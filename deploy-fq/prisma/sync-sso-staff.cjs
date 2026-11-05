const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const apiKey = process.env.BRU_SSO_API_KEY || 'bru_kEatpSnddyH_Ylxjj7qocHw6Vw1_ilWqI9kjYYndpOU';
const baseUrl = process.env.BRU_SSO_BASE_URL || 'https://sso.bru.ac.th';

const manualAliases = {
  'นางสาวธัญรัศม์  เครืองรัมย์': '660491', // นางสาว ธัญญรัศม์ เครืองรัมย์
  'นางอินทิรา  พงษ์กระพัน': '5800009',      // นาง อินทิรา พงกระพันธ์
  'นางวันทนีย์  ประสูติธนกิตต์': '6200009'  // วันทนีย์ ประสูติธนกิตติ์
};

function cleanName(raw) {
  return raw.replace(/^(นางสาว|นาง|นาย|ดร\.|ผศ\.|รศ\.)\s*/, '').replace(/\s+/g, ' ').trim();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchSsoUser(rawName) {
  if (manualAliases[rawName]) {
    const url = baseUrl + '/api/users?search=' + encodeURIComponent(manualAliases[rawName]);
    const res = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    const json = await res.json();
    if (json.data && json.data.length > 0) return json.data[0];
  }

  const cleaned = cleanName(rawName);
  const parts = cleaned.split(' ');
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];

  let query = lastName && lastName.length > 2 ? lastName : firstName;
  let url = baseUrl + '/api/users?search=' + encodeURIComponent(query);
  let res = await fetch(url, { headers: { 'X-API-Key': apiKey } });
  let json = await res.json();
  let matches = json.data || [];

  let exact = matches.find(m => {
    const ssoClean = cleanName(m.full_name);
    return ssoClean.includes(firstName) && (parts.length === 1 || ssoClean.includes(lastName));
  });

  if (!exact && parts.length > 1) {
    await sleep(150);
    url = baseUrl + '/api/users?search=' + encodeURIComponent(firstName);
    res = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    json = await res.json();
    matches = json.data || [];
    exact = matches.find(m => {
      const ssoClean = cleanName(m.full_name);
      return ssoClean.includes(firstName) && ssoClean.includes(lastName);
    });
  }

  return exact || null;
}

async function main() {
  console.log('--- Syncing Building Staff with BRU SSO ---');

  const buildingsDataPath = path.join(__dirname, 'buildings_data.json');
  const buildings = JSON.parse(fs.readFileSync(buildingsDataPath, 'utf8'));

  // Collect all unique staff names
  const allStaffRaw = new Set();
  for (const b of buildings) {
    for (const s of b.staffs) {
      allStaffRaw.add(typeof s === 'string' ? s.trim() : s.staffName.trim());
    }
  }

  console.log(`Searching BRU SSO for ${allStaffRaw.size} unique personnel...`);

  const ssoMap = new Map();
  for (const rawName of allStaffRaw) {
    await sleep(150);
    const ssoUser = await fetchSsoUser(rawName);
    ssoMap.set(rawName, ssoUser);
    if (ssoUser) {
      console.log(`✓ SSO Match: ${rawName} -> ${ssoUser.userlogin} (${ssoUser.full_name})`);
    } else {
      console.log(`✗ No SSO: ${rawName} (บันทึกเป็น Outsource/บุคลากรภายนอก)`);
    }
  }

  // 1. Upsert Users in PostgreSQL
  console.log('\n--- Upserting Users into PostgreSQL ---');
  const userDbMap = new Map(); // userlogin -> User record

  for (const [rawName, ssoUser] of ssoMap.entries()) {
    if (!ssoUser) continue;

    // Format proper name: remove double spaces
    const cleanFullName = ssoUser.full_name.replace(/\s+/g, ' ').trim();
    const role = rawName.includes('สุรชัย') ? 'AUDITOR' : 'HOUSEKEEPER';

    const dbUser = await prisma.user.upsert({
      where: { userlogin: ssoUser.userlogin },
      update: {
        fullName: cleanFullName,
        departmentId: ssoUser.departmentid ? String(ssoUser.departmentid) : null,
        role: role
      },
      create: {
        userlogin: ssoUser.userlogin,
        fullName: cleanFullName,
        role: role,
        departmentId: ssoUser.departmentid ? String(ssoUser.departmentid) : null,
        email: `${ssoUser.userlogin}@bru.ac.th`,
        positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)'
      }
    });

    userDbMap.set(ssoUser.userlogin, dbUser);
  }

  console.log(`✓ Successfully upserted ${userDbMap.size} SSO Users into Database`);

  // 2. Update Building and BuildingStaff in PostgreSQL
  console.log('\n--- Updating Buildings & BuildingStaff with SSO Links ---');

  const updatedBuildingsJson = [];

  for (const b of buildings) {
    const dbBuilding = await prisma.building.upsert({
      where: { code: b.code },
      update: {
        name: b.name,
        floors: b.floors || 1,
        description: b.description || '',
        isActive: true
      },
      create: {
        code: b.code,
        name: b.name,
        floors: b.floors || 1,
        description: b.description || '',
        isActive: true
      }
    });

    // Clean existing staff records for this building
    await prisma.buildingStaff.deleteMany({
      where: { buildingId: dbBuilding.id }
    });

    const bStaffJson = [];

    const rawStaffList = b.staffs.map(s => typeof s === 'string' ? s.trim() : s.staffName.trim());
    for (let i = 0; i < rawStaffList.length; i++) {
      const rawName = rawStaffList[i];
      const ssoUser = ssoMap.get(rawName);
      const dbUser = ssoUser ? userDbMap.get(ssoUser.userlogin) : null;

      // Staff display name: prefer SSO clean name if available, else raw name
      const displayName = dbUser ? dbUser.fullName : rawName.replace(/\s+/g, ' ').trim();

      const createdStaff = await prisma.buildingStaff.create({
        data: {
          buildingId: dbBuilding.id,
          userId: dbUser ? dbUser.id : null,
          staffName: displayName,
          isPrimary: i === 0
        }
      });

      bStaffJson.push({
        staffName: displayName,
        userlogin: dbUser ? dbUser.userlogin : null,
        userId: dbUser ? dbUser.id : null,
        departmentId: dbUser ? dbUser.departmentId : null,
        isSso: !!dbUser
      });
    }

    updatedBuildingsJson.push({
      code: b.code,
      name: b.name,
      floors: b.floors || 1,
      description: b.description || '',
      staffs: bStaffJson
    });
  }

  // 3. Save enriched JSON
  fs.writeFileSync(buildingsDataPath, JSON.stringify(updatedBuildingsJson, null, 2), 'utf8');
  console.log('\n✓ Successfully updated prisma/buildings_data.json with SSO userlogin & links!');

  console.log('--- Finished SSO Sync! ---');
}

main()
  .catch(err => {
    console.error('Error during SSO sync:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
