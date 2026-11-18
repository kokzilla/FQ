const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const args = new Set(process.argv.slice(2));
const isDryRun = args.has('--dry-run');
const syncSso = args.has('--sync-sso');

const apiKey = process.env.BRU_SSO_API_KEY || 'bru_kEatpSnddyH_Ylxjj7qocHw6Vw1_ilWqI9kjYYndpOU';
const baseUrl = process.env.BRU_SSO_BASE_URL || 'https://sso.bru.ac.th';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function cleanName(raw) {
  return raw
    .replace(/\([^)]*\)/g, '')
    .replace(/^(นางสาว|นาง|นาย|ดร\.|ผศ\.|รศ\.)\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractUserLogin(raw) {
  const match = raw.match(/\(([0-9A-Za-z_-]+)\)\s*$/);
  return match ? match[1].trim() : null;
}

async function fetchSsoUser(rawName, loginHint) {
  if (loginHint) {
    const url = `${baseUrl}/api/users?search=${encodeURIComponent(loginHint)}`;
    const res = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    if (res.ok) {
      const json = await res.json();
      const exactLogin = (json.data || []).find(m => m.userlogin === loginHint);
      if (exactLogin) return exactLogin;
    }
  }

  const cleaned = cleanName(rawName);
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length === 0) return null;

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const query = lastName && lastName.length > 2 ? lastName : firstName;

  const url = `${baseUrl}/api/users?search=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'X-API-Key': apiKey } });
  if (!res.ok) return null;
  const json = await res.json();
  const matches = json.data || [];

  return matches.find(m => {
    const ssoClean = cleanName(m.full_name || '');
    return ssoClean.includes(firstName) && (parts.length === 1 || ssoClean.includes(lastName));
  }) || null;
}

async function main() {
  console.log(`=== Link BuildingStaff -> User (${isDryRun ? 'DRY RUN' : 'APPLY'}${syncSso ? ', +SSO' : ''}) ===`);

  const unlinked = await prisma.buildingStaff.findMany({
    where: { userId: null },
    include: { building: { select: { code: true, name: true } } },
    orderBy: [{ building: { code: 'asc' } }, { staffName: 'asc' }]
  });

  console.log(`Found ${unlinked.length} BuildingStaff records with userId = null.\n`);

  const allUsers = await prisma.user.findMany({
    select: { id: true, userlogin: true, fullName: true, role: true }
  });

  const byLogin = new Map(allUsers.map(u => [u.userlogin, u]));
  const byCleanName = new Map(allUsers.map(u => [cleanName(u.fullName), u]));

  let linkedLocal = 0;
  let linkedSso = 0;
  const stillUnlinked = [];

  for (const staff of unlinked) {
    const loginHint = extractUserLogin(staff.staffName);
    const cleaned = cleanName(staff.staffName);

    let matchedUser = (loginHint && byLogin.get(loginHint)) || byCleanName.get(cleaned) || null;
    let source = 'LOCAL_DB';

    if (!matchedUser && syncSso) {
      await sleep(150);
      const ssoUser = await fetchSsoUser(staff.staffName, loginHint);
      if (ssoUser && ssoUser.userlogin && String(ssoUser.userlogin).trim()) {
        const ssoLogin = String(ssoUser.userlogin).trim();
        source = 'BRU_SSO';
        const cleanFullName = (ssoUser.full_name || '').replace(/\s+/g, ' ').trim();
        if (isDryRun) {
          matchedUser = { id: `(new:${ssoLogin})`, userlogin: ssoLogin, fullName: cleanFullName };
        } else {
          matchedUser = await prisma.user.upsert({
            where: { userlogin: ssoLogin },
            update: {
              fullName: cleanFullName,
              departmentId: ssoUser.departmentid ? String(ssoUser.departmentid) : null
            },
            create: {
              userlogin: ssoLogin,
              fullName: cleanFullName,
              role: 'HOUSEKEEPER',
              departmentId: ssoUser.departmentid ? String(ssoUser.departmentid) : null,
              email: `${ssoLogin}@bru.ac.th`,
              positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)'
            }
          });
          byLogin.set(matchedUser.userlogin, matchedUser);
          byCleanName.set(cleanName(matchedUser.fullName), matchedUser);
        }
      }
    }

    if (matchedUser) {
      if (source === 'LOCAL_DB') linkedLocal++;
      else linkedSso++;

      console.log(`[MATCH:${source}] ${staff.building.code} | "${staff.staffName}" -> ${matchedUser.userlogin} (${matchedUser.fullName})`);
      if (!isDryRun) {
        await prisma.buildingStaff.update({
          where: { id: staff.id },
          data: {
            userId: matchedUser.id,
            staffName: matchedUser.fullName
          }
        });
      }
    } else {
      stillUnlinked.push(staff);
      console.log(`[UNMATCHED] ${staff.building.code} | "${staff.staffName}"`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Matched via Local DB: ${linkedLocal}`);
  console.log(`Matched via BRU SSO:  ${linkedSso}`);
  console.log(`Still unlinked:       ${stillUnlinked.length}`);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
