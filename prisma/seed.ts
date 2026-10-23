import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { id: 1, name: 'หมวดที่ 1 ความสะอาดภายในอาคาร', order: 1 },
  { id: 2, name: 'หมวดที่ 2 ห้องเรียน ห้องประชุม และสำนักงาน', order: 2 },
  { id: 3, name: 'หมวดที่ 3 ห้องน้ำและการจัดการขยะ', order: 3 },
  { id: 4, name: 'หมวดที่ 4 การจัดเก็บอุปกรณ์และครุภัณฑ์', order: 4 },
  { id: 5, name: 'หมวดที่ 5 ความสะอาดภายนอกอาคารและการดูแลพื้นที่สีเขียว', order: 5 },
  { id: 6, name: 'หมวดที่ 6 ความปลอดภัย ความรับผิดชอบ และจิตสาธารณะ', order: 6 },
  { id: 7, name: 'หมวดที่ 7 อื่น ๆ', order: 7 },
]

const questions = [
  // หมวดที่ 1 (1-5)
  { id: 1, categoryId: 1, itemNumber: 1, title: 'พื้นอาคาร ทางเดิน และโถงอาคารสะอาด ไม่มีฝุ่น เศษขยะ หรือคราบสกปรก' },
  { id: 2, categoryId: 1, itemNumber: 2, title: 'ราวบันได ลูกกรง ขอบบันได และราวจับสะอาด ไม่มีฝุ่นสะสม' },
  { id: 3, categoryId: 1, itemNumber: 3, title: 'ซอกมุม ใต้โต๊ะ ใต้เก้าอี้ หลังตู้ และมุมอับสะอาด ไม่มีฝุ่นหรือหยากไย่' },
  { id: 4, categoryId: 1, itemNumber: 4, title: 'ประตู มือจับประตู ขอบหน้าต่าง และวงกบสะอาด ไม่มีคราบสกปรก' },
  { id: 5, categoryId: 1, itemNumber: 5, title: 'กระจกและหน้าต่างใสสะอาด ไม่มีฝุ่น คราบมือ หรือคราบน้ำ' },

  // หมวดที่ 2 (6-11)
  { id: 6, categoryId: 2, itemNumber: 6, title: 'โต๊ะเรียน โต๊ะทำงาน และโต๊ะประชุมสะอาด ไม่มีฝุ่นหรือคราบสกปรก' },
  { id: 7, categoryId: 2, itemNumber: 7, title: 'เก้าอี้เรียนและเก้าอี้สำนักงานสะอาด จัดวางเป็นระเบียบ' },
  { id: 8, categoryId: 2, itemNumber: 8, title: 'ห้องเรียนสะอาดเรียบร้อย พื้นและบริเวณโดยรอบพร้อมใช้งาน' },
  { id: 9, categoryId: 2, itemNumber: 9, title: 'ห้องประชุมสะอาดเรียบร้อย โต๊ะ เก้าอี้ และพื้นที่โดยรอบพร้อมใช้งาน' },
  { id: 10, categoryId: 2, itemNumber: 10, title: 'ห้องสำนักงานและพื้นที่ส่วนกลางสะอาด ไม่มีสิ่งของวางเกะกะ' },
  { id: 11, categoryId: 2, itemNumber: 11, title: 'กระดานเขียนหน้าห้องเรียนและพื้นผิวหรืออุปกรณ์ที่อยู่ในขอบเขตงานทำความสะอาดมีความสะอาดเรียบร้อย' },

  // หมวดที่ 3 (12-15)
  { id: 12, categoryId: 3, itemNumber: 12, title: 'พื้นห้องน้ำ โถสุขภัณฑ์ โถปัสสาวะ และอ่างล้างมือสะอาด' },
  { id: 13, categoryId: 3, itemNumber: 13, title: 'กระจกห้องน้ำ ก๊อกน้ำ และสุขภัณฑ์ไม่มีคราบสกปรกสะสม' },
  { id: 14, categoryId: 3, itemNumber: 14, title: 'ห้องน้ำไม่มีกลิ่นไม่พึงประสงค์ ถังขยะไม่ล้น และพื้นห้องน้ำไม่มีน้ำขัง' },
  { id: 15, categoryId: 3, itemNumber: 15, title: 'ถังขยะได้รับการจัดการตามรอบเวลา ไม่มีขยะตกหล่นหรือส่งกลิ่นรบกวน' },

  // หมวดที่ 4 (16-19)
  { id: 16, categoryId: 4, itemNumber: 16, title: 'ตู้เก็บอุปกรณ์ ชั้นวางของ และอุปกรณ์ทำความสะอาดสะอาด จัดเก็บเป็นระเบียบ' },
  { id: 17, categoryId: 4, itemNumber: 17, title: 'โต๊ะ เก้าอี้ หรือครุภัณฑ์ที่วางกองในพื้นที่ส่วนกลางได้รับการจัดระเบียบ หรือแจ้งผู้รับผิดชอบ' },
  { id: 18, categoryId: 4, itemNumber: 18, title: 'ครุภัณฑ์ชำรุดหรือไม่ใช้งานได้รับการรายงานหน่วยงานพัสดุหรือผู้รับผิดชอบเพื่อพิจารณาดำเนินการ' },
  { id: 19, categoryId: 4, itemNumber: 19, title: 'กระถางต้นไม้ กระถางดอกไม้ และของตกแต่งอาคารสะอาด ไม่มีฝุ่นสะสม' },

  // หมวดที่ 5 (20-25)
  { id: 20, categoryId: 5, itemNumber: 20, title: 'พื้นที่หน้าอาคารและทางเข้าอาคารสะอาด ไม่มีเศษขยะหรือสิ่งของวางเกะกะ' },
  { id: 21, categoryId: 5, itemNumber: 21, title: 'พื้นที่ด้านหลังอาคารและบริเวณโดยรอบสะอาด ปราศจากเศษขยะ และจัดเก็บสิ่งของเป็นระเบียบ' },
  { id: 22, categoryId: 5, itemNumber: 22, title: 'ทางเดินภายนอก ลานกิจกรรม และบันไดภายนอกสะอาด ปราศจากเศษขยะและสิ่งกีดขวาง พร้อมใช้งานอย่างปลอดภัย' },
  { id: 23, categoryId: 5, itemNumber: 23, title: 'กวาดเก็บใบไม้แห้ง กิ่งไม้ และเศษวัสดุในพื้นที่รับผิดชอบให้สะอาดเรียบร้อยอยู่เสมอ' },
  { id: 24, categoryId: 5, itemNumber: 24, title: 'รดน้ำต้นไม้และไม้ประดับตามความเหมาะสมและตามหน้าที่ที่ได้รับมอบหมาย เพื่อให้ต้นไม้มีความสดชื่นและอยู่ในสภาพดี' },
  { id: 25, categoryId: 5, itemNumber: 25, title: 'ดูแลต้นไม้และพื้นที่สีเขียวในบริเวณที่รับผิดชอบให้เรียบร้อย เก็บใบไม้แห้ง และตัดแต่งตามความเหมาะสมและขอบเขตหน้าที่ที่ได้รับมอบหมาย' },

  // หมวดที่ 6 (26-30)
  { id: 26, categoryId: 6, itemNumber: 26, title: 'บริเวณท่อระบายน้ำและจุดเสี่ยงน้ำขังสะอาด ปราศจากเศษขยะสะสม และแจ้งปัญหาที่เกินขอบเขตหน้าที่ให้ผู้เกี่ยวข้องทราบโดยเร็ว เพื่อดำเนินการแก้ไขอย่างเหมาะสม' },
  { id: 27, categoryId: 6, itemNumber: 27, title: 'ทางเดินและทางหนีไฟสะอาด ปราศจากสิ่งกีดขวาง พร้อมใช้งานอยู่เสมอ และรายงานสิ่งผิดปกติที่พบให้ผู้เกี่ยวข้องทราบโดยเร็ว' },
  { id: 28, categoryId: 6, itemNumber: 28, title: 'ดูแลรักษาความสะอาดในพื้นที่รับผิดชอบระหว่างปฏิบัติงาน และเก็บขยะหรือทำความสะอาดสิ่งสกปรกทันทีที่พบ' },
  { id: 29, categoryId: 6, itemNumber: 29, title: 'ตรวจสอบความเรียบร้อยหลังทำความสะอาด และแก้ไขข้อบกพร่องที่พบหรือได้รับแจ้งภายในเวลาที่เหมาะสม' },
  { id: 30, categoryId: 6, itemNumber: 30, title: 'ดูแลอาคารด้วยความรับผิดชอบและมีจิตสาธารณะอย่างสม่ำเสมอ พร้อมรายงานปัญหาที่พบให้ผู้เกี่ยวข้องทราบเพื่อดำเนินการแก้ไขอย่างเหมาะสม' },

  // หมวดที่ 7 (31-35)
  { id: 31, categoryId: 7, itemNumber: 31, title: 'มีป้ายแสดงรายละเอียดแม่บ้านประจำอาคารติดตั้งในบริเวณที่มองเห็นได้ชัดเจน โดยมีข้อมูลครบถ้วนและเป็นปัจจุบัน' },
  { id: 32, categoryId: 7, itemNumber: 32, title: 'ดูแลป้ายแสดงรายละเอียดที่ส่วนกลางจัดทำและติดตั้งในพื้นที่รับผิดชอบให้มีสภาพเรียบร้อย มองเห็นได้ชัดเจน และมีรายละเอียดครบถ้วนเป็นปัจจุบัน' },
  { id: 33, categoryId: 7, itemNumber: 33, title: 'ทำงานร่วมกับเพื่อนร่วมงานเป็นทีม มีน้ำใจช่วยเหลือซึ่งกันและกัน และมีความเสียสละเพื่อประโยชน์ส่วนรวม' },
  { id: 34, categoryId: 7, itemNumber: 34, title: 'ปฏิบัติตามนโยบาย ระเบียบ และแนวทางการดำเนินงานของมหาวิทยาลัยอย่างเคร่งครัดและสม่ำเสมอ' },
  { id: 35, categoryId: 7, itemNumber: 35, title: 'แต่งกายสุภาพ เรียบร้อย สะอาด ไม่มีกลิ่นไม่พึงประสงค์ และมีความพร้อมในการปฏิบัติหน้าที่อยู่เสมอ' },
]

const sampleBuildings = [
  {
    code: 'B15',
    name: 'อาคาร 15 (เฉลิมพระเกียรติ 50 พรรษา มหาวชิราลงกรณ)',
    floors: 9,
    description: 'อาคารเรียนรวมและศูนย์ปฏิบัติการ 9 ชั้น',
    staffs: ['นางสมศรี ใจสะอาด (ชั้น 1-4)', 'นางสมใจ รักษ์ดี (ชั้น 5-9)']
  },
  {
    code: 'B18',
    name: 'อาคาร 18 (สำนักวิทยบริการและเทคโนโลยีสารสนเทศ ARIT)',
    floors: 5,
    description: 'หอสมุดกลาง ศูนย์คอมพิวเตอร์และอินเทอร์เน็ต',
    staffs: ['นางปราณี ขยันยิ่ง (หอสมุดและศูนย์คอมฯ)']
  },
  {
    code: 'B22',
    name: 'อาคาร 22 (อาคารวิทยาศาสตร์และเทคโนโลยี)',
    floors: 8,
    description: 'คณะวิทยาศาสตร์และห้องปฏิบัติการเคมี/ฟิสิกส์',
    staffs: ['นางวันดี มีสุข']
  },
  {
    code: 'B24',
    name: 'อาคาร 24 (อาคารปฏิบัติการทางวิทยาศาสตร์และนวัตกรรม)',
    floors: 7,
    description: 'ศูนย์ความเป็นเลิศทางการวิจัยและนวัตกรรม',
    staffs: ['นางสุภาพรรณ บัวแก้ว']
  },
  {
    code: 'B01',
    name: 'อาคาร 1 (อาคารอำนวยการและสำนักงานอธิการบดี)',
    floors: 3,
    description: 'สำนักงานอธิการบดี กองกลาง และกองนโยบายและแผน',
    staffs: ['นางอำไพ พรหมประเสริฐ']
  }
]

const initialUsers = [
  { userlogin: 'admin', fullName: 'ผู้ดูแลระบบ อาคารสถานที่', role: 'ADMIN', positionName: 'ผู้ดูแลระบบอาคารสถานที่', email: 'admin@bru.ac.th' },
  { userlogin: 'somchai', fullName: 'ดร.สมชาย ใจมั่น', role: 'AUDITOR', positionName: 'ประธานกรรมการตรวจประเมินอาคาร', email: 'somchai@bru.ac.th' },
  { userlogin: 'nattapong', fullName: 'ผศ.ณัฐพงษ์ สิทธิศักดิ์', role: 'AUDITOR', positionName: 'กรรมการตรวจประเมิน', email: 'nattapong@bru.ac.th' },
  { userlogin: 'pranee', fullName: 'นางปราณี ขยันยิ่ง', role: 'HOUSEKEEPER', positionName: 'พนักงานบริการประจำอาคาร (แม่บ้าน)', email: 'pranee@bru.ac.th' },
]

const initialRounds = [
  {
    id: 'round-2568',
    name: 'รอบการประเมินประจำปีงบประมาณ 2568',
    year: '2568',
    description: 'รอบประเมินมาตรฐานความสะอาดประจำปี 2568 ทั่วมหาวิทยาลัย',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    status: 'CLOSED'
  },
  {
    id: 'round-2570',
    name: 'รอบการประเมินประจำปีงบประมาณ 2570',
    year: '2570',
    description: 'รอบประเมินปัจจุบัน มหาวิทยาลัยราชภัฏบุรีรัมย์',
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    status: 'OPEN'
  }
]

async function main() {
  console.log('Seeding SQLite database...')

  // 1. Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, order: cat.order },
      create: cat,
    })
  }

  // 2. Questions
  for (const q of questions) {
    await prisma.questionItem.upsert({
      where: { id: q.id },
      update: { title: q.title, categoryId: q.categoryId, itemNumber: q.itemNumber },
      create: { ...q, maxScore: 5 },
    })
  }

  // 3. Buildings & Staffs
  for (const b of sampleBuildings) {
    const building = await prisma.building.upsert({
      where: { code: b.code },
      update: { name: b.name, floors: b.floors, description: b.description },
      create: {
        code: b.code,
        name: b.name,
        floors: b.floors,
        description: b.description
      },
    })

    // Staffs
    await prisma.buildingStaff.deleteMany({ where: { buildingId: building.id } })
    for (const s of b.staffs) {
      await prisma.buildingStaff.create({
        data: {
          buildingId: building.id,
          staffName: s
        }
      })
    }
  }

  // 4. Users
  for (const u of initialUsers) {
    await prisma.user.upsert({
      where: { userlogin: u.userlogin },
      update: { fullName: u.fullName, role: u.role, positionName: u.positionName, email: u.email },
      create: u
    })
  }

  // 5. Rounds
  for (const r of initialRounds) {
    await prisma.evaluationRound.upsert({
      where: { id: r.id },
      update: { name: r.name, year: r.year, description: r.description, status: r.status, startDate: r.startDate, endDate: r.endDate },
      create: r
    })
  }

  console.log('SQLite database seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
