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
    "code": "B01",
    "name": "อาคาร 1",
    "floors": 3,
    "description": "สังกัด สถาบันวิจัยและพัฒนา",
    "staffs": [
      "นางประยงค์  นันกลาง"
    ]
  },
  {
    "code": "B02",
    "name": "อาคาร 2",
    "floors": 3,
    "description": "สังกัด คณะวิทยาศาสตร์ (ห้องพยาบาล)",
    "staffs": [
      "นางสาวจันทร์จิรา  เชิดกลิ่น"
    ]
  },
  {
    "code": "B05",
    "name": "อาคาร 5",
    "floors": 3,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      "นางสาวปัทมา  ยอนรัมย์"
    ]
  },
  {
    "code": "B06",
    "name": "อาคาร 6",
    "floors": 3,
    "description": "สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์",
    "staffs": [
      "นางสาวสุณี  เกริงรัมย์"
    ]
  },
  {
    "code": "B07",
    "name": "อาคาร 7",
    "floors": 3,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      "นางสาวพิมพ์วลัญช์  เชียงพฤกษ์"
    ]
  },
  {
    "code": "B10",
    "name": "อาคาร 10",
    "floors": 3,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      "นางสาวตวงลักษณ์  นิลแก้ว"
    ]
  },
  {
    "code": "B12",
    "name": "อาคาร 12 (ศูนย์วิทยาศาสตร์และวิทยาศาสตร์ประยุกต์)",
    "floors": 4,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      "นายพงศ์ศรัณย์  เติมเทียน",
      "นางสาวมะปราง  เปาป่า"
    ]
  },
  {
    "code": "B13",
    "name": "อาคาร 13 (คณะพยาบาลศาสตร์)",
    "floors": 4,
    "description": "สังกัด คณะพยาบาลศาสตร์",
    "staffs": [
      "นางสาวสุวรรณา  ทองสม"
    ]
  },
  {
    "code": "B14",
    "name": "อาคาร 14",
    "floors": 3,
    "description": "สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชานาฏศิลป์+ดนตรี)",
    "staffs": [
      "นางสาวมาลี  สิงห์คำ"
    ]
  },
  {
    "code": "B15",
    "name": "อาคาร 15 (อาคารเฉลิมพระเกียรติ 50 พรรษามหาวชิราลงกรณ์)",
    "floors": 9,
    "description": "สังกัด สำนักงานอธิการบดี + บัณฑิตวิทยาลัย",
    "staffs": [
      "นางบุญมี  จันลา",
      "นางสาวธัญรัศม์  เครืองรัมย์",
      "นางสาวพชรภรณ์  ลีประโคน",
      "นางรุจิกาญจน์  สิงห์คำ"
    ]
  },
  {
    "code": "B16",
    "name": "อาคาร 16 (อาคารสิ่งทอ)",
    "floors": 2,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      "นางกชพร  ชุบรัมย์"
    ]
  },
  {
    "code": "B17",
    "name": "อาคาร 17 (อาคารนวัตปัญญา)",
    "floors": 4,
    "description": "สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ",
    "staffs": [
      "นางสาวกรวรรณ  จันทรภูมิ",
      "นางณัฐชยา  ปรีชารัมย์"
    ]
  },
  {
    "code": "B18",
    "name": "อาคาร 18 (อาคารเฉลิมพระเกียรติ 7 รอบ พระชนมพรรษา)",
    "floors": 5,
    "description": "สังกัด คณะเทคโนโลยีอุตสาหกรรม",
    "staffs": [
      "นางทองสุข  คิดการ",
      "นางอินทิรา  พงษ์กระพัน"
    ]
  },
  {
    "code": "B19",
    "name": "อาคาร 19 (อาคารสิริวิชญากร)",
    "floors": 5,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      "นายวุฒิพงษ์  ชำนาญชัยศรี",
      "นางสาวลลิตา  จะเชนรัมย์"
    ]
  },
  {
    "code": "B20",
    "name": "อาคาร 20 (อาคารสิริวิทยเกษตร)",
    "floors": 4,
    "description": "สังกัด คณะเทคโนโลยีการเกษตร",
    "staffs": [
      "นางสาวนงพะงา  ปลั่งกลาง",
      "นางสาวศิริขวัญ  อินัง"
    ]
  },
  {
    "code": "B21",
    "name": "อาคาร 21",
    "floors": 3,
    "description": "สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน",
    "staffs": [
      "นางสาวละเมียด  ปลื้มกมล"
    ]
  },
  {
    "code": "B22",
    "name": "อาคาร 22 (อาคารวิทยาศาสตร์สุขภาพ)",
    "floors": 8,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      "นางสาวศุภิสรา  รอบแคว้น",
      "นางสาวราตรี  คำบาง"
    ]
  },
  {
    "code": "B23",
    "name": "อาคาร 23 (อาคารอเนกคุณาคาร 1 อาคารราชภัฏคอมเพลคซ์)",
    "floors": 4,
    "description": "สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน + กองพัฒนานักศึกษา",
    "staffs": [
      "นางอำนวย  คงชู",
      "นายสมชาย  สว่างพบ"
    ]
  },
  {
    "code": "B24",
    "name": "อาคาร 24 (คณะวิทยาการจัดการ)",
    "floors": 7,
    "description": "สังกัด คณะวิทยาการจัดการ",
    "staffs": [
      "นางณิสาชล  คะรุรัมย์",
      "นางวาสนา  กรีรัมย์"
    ]
  },
  {
    "code": "B25",
    "name": "อาคาร 25 (คณะมนุษยศาสตร์และสังคมศาสตร์)",
    "floors": 5,
    "description": "สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์",
    "staffs": [
      "นางพรรณี  สวายรัมย์",
      "นางวันทนีย์  ประสูติธนกิตต์"
    ]
  },
  {
    "code": "B26",
    "name": "อาคาร 26 (อาคารอเนกคุณาคาร 2)",
    "floors": 4,
    "description": "สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชาศิลปะ)",
    "staffs": [
      "นางสาวละเมียด  ปลื้มกมล"
    ]
  },
  {
    "code": "B27",
    "name": "อาคาร 27 (โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์)",
    "floors": 4,
    "description": "สังกัด โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์",
    "staffs": [
      "นางสาวสุภาภรณ์  ชะโลมรัมย์"
    ]
  },
  {
    "code": "B-LIB",
    "name": "อาคารบรรณราชนครินทร์ (ห้องสมุด สำนักวิทยบริการฯ)",
    "floors": 4,
    "description": "สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ",
    "staffs": [
      "นางสาวกันตินันท์  เอกา"
    ]
  },
  {
    "code": "B-STAD",
    "name": "สนามกีฬากลาง",
    "floors": 1,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      "นายวุฒิชัย  มะลิรัมย์"
    ]
  },
  {
    "code": "B-GYM",
    "name": "โรงยิมส์",
    "floors": 2,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      "นางสาวจุฑาทิพย์  อีนัง"
    ]
  },
  {
    "code": "B-AUD1",
    "name": "หอประชุมวิชชาอัตศาสตร์",
    "floors": 2,
    "description": "ผอ.กองกลาง",
    "staffs": [
      "นายสุรชัย  ตามกลาง"
    ]
  },
  {
    "code": "B-AUD2",
    "name": "หอประชุมมาลิณีจุโฑปะมา",
    "floors": 2,
    "description": "คณะกรรมการหอประชุมตามคำสั่งแต่งตั้งของมหาวิทยาลัย",
    "staffs": [
      "นายญาณวรุตม์  พันธุ์ขุนแก้ว",
      "นางสาวบุญมี  ปัตแวว",
      "นางพัชรา  พะสุรัมย์"
    ]
  },
  {
    "code": "B-CER",
    "name": "อาคารเซรามิกส์",
    "floors": 1,
    "description": "สังกัด คณะเทคโนโลยีอุตสาหกรรม",
    "staffs": [
      "นายทองพูน  ธรรมสาลี"
    ]
  },
  {
    "code": "B-WOOD",
    "name": "Shop งานไม้ (คณะเทคโนโลยีอุตสาหกรรมเก่า)",
    "floors": 1,
    "description": "สังกัด คณะเทคโนโลยีอุตสาหกรรม",
    "staffs": [
      "นายทองพูน  ธรรมสาลี"
    ]
  },
  {
    "code": "B-IT",
    "name": "อาคาร IT (อาคารเทคโนโลยีสารสนเทศเก่า)",
    "floors": 2,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      "นางณิชาภา  นามวัน"
    ]
  },
  {
    "code": "B-CUL",
    "name": "ศูนย์วัฒนธรรมอีสานใต้",
    "floors": 2,
    "description": "สังกัด สำนักศิลปะและวัฒนธรรม",
    "staffs": [
      "นางสาวเสาวลักษณ์  กอนรัมย์"
    ]
  },
  {
    "code": "DORM-RP01",
    "name": "หอพักราชพฤกษ์ 1",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางสาวนวน  ระตาภรณ์"
    ]
  },
  {
    "code": "DORM-RP02",
    "name": "หอพักราชพฤกษ์ 2",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางสาวศรสวรรค์  เดยังรัมย์"
    ]
  },
  {
    "code": "DORM-RP03",
    "name": "หอพักราชพฤกษ์ 3",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางสาวนวน  ระตาภรณ์"
    ]
  },
  {
    "code": "DORM-RP04",
    "name": "หอพักราชพฤกษ์ 4",
    "floors": 4,
    "description": "สังกัด คณะพยาบาลศาสตร์ (หอพักนักศึกษาพยาบาล)",
    "staffs": [
      "นางสาวศรสวรรค์  เดยังรัมย์"
    ]
  },
  {
    "code": "DORM-RP06",
    "name": "หอพักราชพฤกษ์ 6",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางสาวนงนุช  หนาวบุรีรัมย์"
    ]
  },
  {
    "code": "DORM-RP07",
    "name": "หอพักราชพฤกษ์ 7",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางสาวนงนุช  หนาวบุรีรัมย์"
    ]
  },
  {
    "code": "DORM-RP08",
    "name": "หอพักราชพฤกษ์ 8",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางสาวจรรยา  เจียนรัมย์"
    ]
  },
  {
    "code": "DORM-RP09",
    "name": "หอพักราชพฤกษ์ 9",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางสาวจรรยา  เจียนรัมย์"
    ]
  },
  {
    "code": "DORM-KA",
    "name": "หอพักเขาอังคาร",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      "นางพรพรรณ  คำใจ"
    ]
  },
  {
    "code": "DORM-KD",
    "name": "หอพักเขากระโดง",
    "floors": 4,
    "description": "สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (หอพักบุคลากร)",
    "staffs": [
      "นางพรพรรณ  คำใจ"
    ]
  },
  {
    "code": "CANTEEN-1",
    "name": "ศูนย์อาหาร 1",
    "floors": 2,
    "description": "สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)",
    "staffs": [
      "นายพรชัย  มาลัยทอง"
    ]
  },
  {
    "code": "CANTEEN-2",
    "name": "ศูนย์อาหาร 2",
    "floors": 2,
    "description": "สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)",
    "staffs": [
      "นายพรชัย  มาลัยทอง"
    ]
  },
  {
    "code": "POOL",
    "name": "สระว่ายน้ำ (ราชภัฏชลาธาร)",
    "floors": 1,
    "description": "คณะกรรมการอาคารสถานกีฬาตามคำสั่งแต่งตั้งของมหาวิทยาลัย",
    "staffs": [
      "นายวรุฒิพงษ์  สิริวัฒนธีรกุล"
    ]
  }
]

const initialUsers = [
  { userlogin: 'admin', fullName: 'ผู้ดูแลระบบ อาคารสถานที่', role: 'ADMIN', positionName: 'ผู้ดูแลระบบอาคารสถานที่', email: 'admin@bru.ac.th' },
  { userlogin: '100174', fullName: 'รองศาสตราจารย์ ดร. ศิราณี จุโฑปะมา', role: 'AUDITOR', positionName: 'ประธานกรรมการ', departmentId: '79', email: '100174@bru.ac.th' },
  { userlogin: '900522', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. พิทยา พันธะไชย', role: 'AUDITOR', positionName: 'รองประธานกรรมการ', departmentId: '79', email: '900522@bru.ac.th' },
  { userlogin: '100196', fullName: 'รองศาสตราจารย์ ดร. สุพัตรา รักการศิลป์', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '0', email: '100196@bru.ac.th' },
  { userlogin: '500118', fullName: 'อาจารย์ ดร. พนาสินธุ์ ศรีวิเศษ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '500118@bru.ac.th' },
  { userlogin: '400051', fullName: 'อาจารย์ อัญญา มธุรเมธา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '123', email: '400051@bru.ac.th' },
  { userlogin: '100223', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. นิจพร ณ พัทลุง', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '158', email: '100223@bru.ac.th' },
  { userlogin: '100061', fullName: 'อาจารย์ วิชชา ภัทรนิธิคุณากร', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100061@bru.ac.th' },
  { userlogin: '100232', fullName: 'อาจารย์ วิสาข์ แฝงเวียง', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '172', email: '100232@bru.ac.th' },
  { userlogin: '100014', fullName: 'ผู้ช่วยศาสตราจารย์ วิไลวรรณ ศิริเมฆา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '94', email: '100014@bru.ac.th' },
  { userlogin: '440213', fullName: 'อาจารย์ ดร. ศรีเพ็ญ พลเดช', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '440213@bru.ac.th' },
  { userlogin: '57023', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. เอกชัย ธีรภัคสิริ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '57023@bru.ac.th' },
  { userlogin: '400015', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. นพดล ธีระวงศ์ภิญโญ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '123', email: '400015@bru.ac.th' },
  { userlogin: '100113', fullName: 'อาจารย์ ดร. ทิพวัลย์ แสนคำ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100113@bru.ac.th' },
  { userlogin: '440228', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. ผกามาศ บุตรสาลี', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '142', email: '440228@bru.ac.th' },
  { userlogin: '100180', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. บรรเจิด สอนสุภาพ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '158', email: '100180@bru.ac.th' },
  { userlogin: '100117', fullName: 'ผู้ช่วยศาสตราจารย์ วัชระ วชิรภัทรกุล', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '172', email: '100117@bru.ac.th' },
  { userlogin: '900131', fullName: 'อาจารย์ กนิษฐา จอดนอก', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '198', email: '900131@bru.ac.th' },
  { userlogin: '100080', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. สมศักดิ์ จีวัฒนา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100080@bru.ac.th' },
  { userlogin: '100189', fullName: 'รองศาสตราจารย์ ดร. นฤมล สมคุณา', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '158', email: '100189@bru.ac.th' },
  { userlogin: '100114', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. ณัฐพล แสนคำ', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '118', email: '100114@bru.ac.th' },
  { userlogin: '400011', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. อโศก ไทยจันทรารักษ์', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '400011@bru.ac.th' },
  { userlogin: '100052', fullName: 'ผู้ช่วยศาสตราจารย์ ดร. ธิติ ปัญญาอินทร์', role: 'AUDITOR', positionName: 'กรรมการ', departmentId: '79', email: '100052@bru.ac.th' },
  { userlogin: '100109', fullName: 'อาจารย์ พวงเพชร ราชประโคน', role: 'AUDITOR', positionName: 'กรรมการและเลขานุการ', departmentId: '1', email: '100109@bru.ac.th' },
  { userlogin: '300036', fullName: 'นาย ลัด พอกกลาง', role: 'AUDITOR', positionName: 'กรรมการและเลขานุการ', departmentId: '40', email: '300036@bru.ac.th' },
  { userlogin: '4300016', fullName: 'นางสาว พิมพ์วลัญช์ เชียงพฤกษ์', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '4300016@bru.ac.th' },
  { userlogin: '600034', fullName: 'นาย ประสิทธิ์ จันลา', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '600034@bru.ac.th' },
  { userlogin: '600100', fullName: 'นาย อภิสิทธิ์ แพนแก้ว', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '600100@bru.ac.th' },
  { userlogin: '5500010', fullName: 'ดุสิต เพชรเนื้อนิล', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '5500010@bru.ac.th' },
  { userlogin: '600099', fullName: 'อธิพงศ์ แต้มสี', role: 'AUDITOR', positionName: 'กรรมการและผู้ช่วยเลขานุการ', departmentId: '40', email: '600099@bru.ac.th' },
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
  console.log('Seeding PostgreSQL database...')

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

  // 6. System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'criteria_building' },
    update: {},
    create: {
      key: 'criteria_building',
      value: JSON.stringify({
        greenMin: 4,
        yellowMin: 2,
        greenLabel: 'ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน',
        yellowLabel: 'ปานกลาง / เฝ้าระวัง',
        redLabel: 'ต้องปรับปรุงเร่งด่วน'
      })
    }
  })

  await prisma.systemSetting.upsert({
    where: { key: 'criteria_staff' },
    update: {},
    create: {
      key: 'criteria_staff',
      value: JSON.stringify({
        greenMin: 4,
        yellowMin: 2,
        greenLabel: 'ดีเยี่ยม / ผลงานดีเด่น',
        yellowLabel: 'ปานกลาง / พอใช้',
        redLabel: 'ต้องปรับปรุงเร่งด่วน'
      })
    }
  })

  console.log('Database seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
