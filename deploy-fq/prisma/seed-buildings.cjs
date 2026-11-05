const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'buildings_data.json'), 'utf8'));

async function main() {
  console.log('--- Starting BRU Building & Staff Seeding (Separated Buildings) ---');
  console.log(`Found ${data.length} buildings to import...`);

  // Codes to keep
  const newCodes = data.map(b => b.code);

  // Remove old grouped building codes if they exist and have no assessments
  const oldGroupedCodes = ['DORM-RP13', 'DORM-RP24', 'DORM-RP67', 'DORM-RP89', 'DORM-KDKA', 'CANTEEN'];
  for (const oldCode of oldGroupedCodes) {
    try {
      const oldBld = await prisma.building.findUnique({ where: { code: oldCode } });
      if (oldBld) {
        await prisma.buildingStaff.deleteMany({ where: { buildingId: oldBld.id } });
        await prisma.building.delete({ where: { id: oldBld.id } });
        console.log(`- Removed obsolete grouped code: ${oldCode}`);
      }
    } catch (e) {
      console.warn(`Could not remove ${oldCode}:`, e.message);
    }
  }

  let buildingCount = 0;
  let staffCount = 0;

  for (const item of data) {
    const building = await prisma.building.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        floors: item.floors || 1,
        description: item.description || '',
        isActive: true
      },
      create: {
        code: item.code,
        name: item.name,
        floors: item.floors || 1,
        description: item.description || '',
        isActive: true
      }
    });
    buildingCount++;

    // Re-sync staff members for this building
    await prisma.buildingStaff.deleteMany({
      where: { buildingId: building.id }
    });

    for (let i = 0; i < item.staffs.length; i++) {
      const staffName = item.staffs[i];
      await prisma.buildingStaff.create({
        data: {
          buildingId: building.id,
          staffName: staffName,
          isPrimary: i === 0
        }
      });
      staffCount++;
    }

    console.log(`✓ [${item.code}] ${item.name} (${item.staffs.length} staff)`);
  }

  console.log('----------------------------------------------------');
  console.log(`Successfully seeded ${buildingCount} buildings and ${staffCount} staff assignments!`);
}

main()
  .catch((err) => {
    console.error('Error seeding buildings:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
