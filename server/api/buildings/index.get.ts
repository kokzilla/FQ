import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { isDbReady } from '../../utils/dbState'

const INITIAL_BUILDINGS = [
  {
    "id": "20fe781e-e11c-40d7-8611-a9c3041e713c",
    "code": "B-AUD1",
    "name": "หอประชุมวิชชาอัตศาสตร์",
    "floors": 2,
    "description": "ผอ.กองกลาง",
    "staffs": [
      {
        "id": "20538c49-41ee-484f-a9e3-5a8399a1a1e3",
        "staffName": "นาย สุรชัย ตามกลาง",
        "userId": "c864e006-fd80-403d-a606-5f77b99bcfd6",
        "userlogin": "5300005",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "cbbc95ec-f199-43a1-9251-9d56c76f3c19",
    "code": "B-AUD2",
    "name": "หอประชุมมาลิณีจุโฑปะมา",
    "floors": 2,
    "description": "คณะกรรมการหอประชุมตามคำสั่งแต่งตั้งของมหาวิทยาลัย",
    "staffs": [
      {
        "id": "a1c1aed3-9081-4099-b9dd-1223ae44520c",
        "staffName": "ญาณวรุตม์ พันธุ์ขุนแก้ว",
        "userId": "021c1f9d-3e60-4d78-8552-fef53daee902",
        "userlogin": "6800017",
        "isPrimary": true
      },
      {
        "id": "e4565071-ebbd-4a20-970b-75cbd1c3da99",
        "staffName": "บุญมี ปัตแวว",
        "userId": "c67fe412-0f81-4aae-891a-2c1ae6148984",
        "userlogin": "6800016",
        "isPrimary": false
      },
      {
        "id": "1a69a4c3-4cdb-433a-8113-586906f8a854",
        "staffName": "พัชรา พะสุรัมย์",
        "userId": "84f68217-42a8-44e1-918f-29187c08b73b",
        "userlogin": "6800024",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "14e0a11b-a4b9-4687-b60f-0a97b6f1d87a",
    "code": "B-CER",
    "name": "อาคารเซรามิกส์",
    "floors": 1,
    "description": "สังกัด คณะเทคโนโลยีอุตสาหกรรม",
    "staffs": [
      {
        "id": "d9c2c01a-c5a6-41b0-af5a-5dc9c821b694",
        "staffName": "นาย ทองพูน ธรรมสาลี",
        "userId": "8afddff0-2367-434e-9d77-8afa13b1dc57",
        "userlogin": "660269",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "8b16bf09-ebbc-4159-836a-b8dde54ca425",
    "code": "B-CUL",
    "name": "ศูนย์วัฒนธรรมอีสานใต้",
    "floors": 2,
    "description": "สังกัด สำนักศิลปะและวัฒนธรรม",
    "staffs": [
      {
        "id": "00906ba4-7535-48ba-95b9-27b7f7515b04",
        "staffName": "นางสาว เสาวลักษณ์ กอนรัมย์",
        "userId": "63de95f1-a75f-4fb4-9396-034a8a0f8686",
        "userlogin": "660442",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "f1a88782-4f3a-4655-b7c5-3a4ed1ec2fd1",
    "code": "B-GYM",
    "name": "โรงยิมส์",
    "floors": 2,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      {
        "id": "cee36c6f-325b-4786-a96c-2016f5bde055",
        "staffName": "จุฑาทิพย์ อีนัง",
        "userId": "55fbb229-9d63-44c5-a868-d715825df9c7",
        "userlogin": "6700015",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "467c76f8-8007-4e82-a4e7-0799deb929cc",
    "code": "B-IT",
    "name": "อาคาร IT (อาคารเทคโนโลยีสารสนเทศเก่า)",
    "floors": 2,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      {
        "id": "2a4b0fdc-7a8d-453e-8d38-f71312055412",
        "staffName": "นาง ณิชาภา นามวัน",
        "userId": "de1dc0eb-54f5-4b05-ad14-fec4131a4429",
        "userlogin": "6300025",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "e135cd6d-bc80-4ef5-9596-538ecc47296b",
    "code": "B-LIB",
    "name": "อาคารบรรณราชนครินทร์ (ห้องสมุด สำนักวิทยบริการฯ)",
    "floors": 4,
    "description": "สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ",
    "staffs": [
      {
        "id": "1cce249d-f906-404c-9338-024f081a1f22",
        "staffName": "นางสาว กันตินันท์ เอกา",
        "userId": "b2186417-abf1-41ee-8311-b2d9ba2151c8",
        "userlogin": "600078",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "d9767a01-0718-4526-9aa2-19ba05a8368c",
    "code": "B-STAD",
    "name": "สนามกีฬากลาง",
    "floors": 1,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      {
        "id": "380f78b6-aaa9-4f02-8581-5beb204a4427",
        "staffName": "นาย วุฒิชัย มะลิรัมย์",
        "userId": "93426701-adf3-43bc-a61c-d8cc65abc3ab",
        "userlogin": "660065",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "9f814059-ae61-4756-8bc4-d7e8595a9956",
    "code": "B-WOOD",
    "name": "Shop งานไม้ (คณะเทคโนโลยีอุตสาหกรรมเก่า)",
    "floors": 1,
    "description": "สังกัด คณะเทคโนโลยีอุตสาหกรรม",
    "staffs": [
      {
        "id": "7f2fd072-eb45-41c3-ba66-0bee7cdd0a22",
        "staffName": "นาย ทองพูน ธรรมสาลี",
        "userId": "8afddff0-2367-434e-9d77-8afa13b1dc57",
        "userlogin": "660269",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "31d1b24a-c308-408b-af06-f707e2d0913e",
    "code": "B01",
    "name": "อาคาร 1",
    "floors": 3,
    "description": "สังกัด สถาบันวิจัยและพัฒนา",
    "staffs": [
      {
        "id": "6b7a3b0c-d10b-4112-8c54-2cdfa40aaa6e",
        "staffName": "นาง ประยงค์ นันกลาง",
        "userId": "3c189b33-18cf-453e-8879-691b170fbf47",
        "userlogin": "5500056",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "ed2c1845-059b-4b37-88dc-41dbebf178a5",
    "code": "B02",
    "name": "อาคาร 2",
    "floors": 3,
    "description": "สังกัด คณะวิทยาศาสตร์ (ห้องพยาบาล)",
    "staffs": [
      {
        "id": "8ccd620e-1e1a-495c-8e13-3a06f387c22f",
        "staffName": "จันทร์จิรา เชิดกลิ่น",
        "userId": "aa1a2ec7-1f50-4eb0-be86-140b3fc7787e",
        "userlogin": "6900004",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "c87dea49-468c-467e-80c4-b3161e76f861",
    "code": "B05",
    "name": "อาคาร 5",
    "floors": 3,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      {
        "id": "33ca1cbb-10d8-4e3b-b12c-a6a9fbcf819e",
        "staffName": "ปัทมา ยอนรัมย์",
        "userId": "16e14d00-3476-4296-8c44-c14f7d92f70d",
        "userlogin": "6900005",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "ae5b74a2-a766-4b32-9d02-2147d7f43b14",
    "code": "B06",
    "name": "อาคาร 6",
    "floors": 3,
    "description": "สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์",
    "staffs": [
      {
        "id": "4358db12-92da-4d2f-b83b-b4a666b618b5",
        "staffName": "สุณี เกริงรัมย์",
        "userId": "f6510fd5-4ff2-4d4b-babd-7ea415ac83cf",
        "userlogin": "6500016",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "0d793dbf-5bf1-4799-82f6-9d0f0494f201",
    "code": "B07",
    "name": "อาคาร 7",
    "floors": 3,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      {
        "id": "6c998321-5a95-44e7-884e-8cc0e28cb96f",
        "staffName": "นางสาว พิมพ์วลัญช์ เชียงพฤกษ์",
        "userId": "8d2294b9-0f6c-428e-9e6d-d4cc17f05850",
        "userlogin": "4300016",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "582cbe05-04cb-4585-af38-075fb19844fb",
    "code": "B10",
    "name": "อาคาร 10",
    "floors": 3,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      {
        "id": "401b79eb-ce8c-4be7-a6f0-7cfe2ac36ed8",
        "staffName": "นาง ตวงลักษณ์ นิลแก้ว",
        "userId": "7b436341-14a1-4266-a324-b63a7e96b5af",
        "userlogin": "600083",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "aa6b5228-92f6-4e59-a32b-a20041205ba6",
    "code": "B12",
    "name": "อาคาร 12 (ศูนย์วิทยาศาสตร์และวิทยาศาสตร์ประยุกต์)",
    "floors": 4,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      {
        "id": "ff786505-c13c-4f4f-9d20-e435ce3c2392",
        "staffName": "นาย พงศ์ศรัณย์ เติมเทียน",
        "userId": "0d466cd5-79a5-4f3c-b86d-f9ae98e6f7d8",
        "userlogin": "660427",
        "isPrimary": true
      },
      {
        "id": "9bcc5a83-1784-4afd-bd60-c7cb00b4b795",
        "staffName": "มะปราง เปาป่า",
        "userId": "4bb399af-aaac-4795-b93b-e48fa271eb2b",
        "userlogin": "6700009",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "b3ddecc2-61eb-4c24-ac76-26bb3c7e2d15",
    "code": "B13",
    "name": "อาคาร 13 (คณะพยาบาลศาสตร์)",
    "floors": 4,
    "description": "สังกัด คณะพยาบาลศาสตร์",
    "staffs": [
      {
        "id": "644563d1-b7b3-4637-948d-35c91e15178a",
        "staffName": "นางสาว สุวรรณา ทองสม",
        "userId": "22a2619b-57e5-4f8d-9da2-93560f495eb4",
        "userlogin": "6400013",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "e2e48bb4-de09-46fe-a32f-e1d1d973177b",
    "code": "B14",
    "name": "อาคาร 14",
    "floors": 3,
    "description": "สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชานาฏศิลป์+ดนตรี)",
    "staffs": [
      {
        "id": "856479e6-2817-4985-a9cf-5fce566dc906",
        "staffName": "มาลี สิงห์คำ",
        "userId": "fd7c44f6-90da-4b92-903a-9ad7675ea22c",
        "userlogin": "6700002",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "72ae0fa1-1531-4871-ad04-ce918863459b",
    "code": "B15",
    "name": "อาคาร 15 (อาคารเฉลิมพระเกียรติ 50 พรรษามหาวชิราลงกรณ์)",
    "floors": 9,
    "description": "สังกัด สำนักงานอธิการบดี + บัณฑิตวิทยาลัย",
    "staffs": [
      {
        "id": "de051e31-412d-496b-b142-435eff26bde4",
        "staffName": "นาง บุญมี จันลา",
        "userId": "bc67806b-4cac-40e7-98b9-d2d64131a02b",
        "userlogin": "4200008",
        "isPrimary": true
      },
      {
        "id": "276b8b99-b174-460e-b921-95a953e30ef5",
        "staffName": "นางสาว ธัญญรัศม์ เครืองรัมย์",
        "userId": "e36a94e4-deff-4721-bb09-d1f355915c15",
        "userlogin": "660491",
        "isPrimary": false
      },
      {
        "id": "64bca0fe-9701-44e6-8eb7-ade6335110d7",
        "staffName": "นางสาว พชรภรณ์ ลีประโคน",
        "userId": "72e9a4cf-82fb-4109-8c63-25cc51be4a9d",
        "userlogin": "6200027",
        "isPrimary": false
      },
      {
        "id": "561fe003-12e2-4fea-87a6-c5868fb6c1ed",
        "staffName": "นาง รุจิกาญจน์ สิงห์คำ",
        "userId": "f90d0109-a40e-4956-9513-e7e24ea130a5",
        "userlogin": "660141",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "f788f6aa-df6d-4494-8e09-065043c3dacc",
    "code": "B16",
    "name": "อาคาร 16 (อาคารสิ่งทอ)",
    "floors": 2,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      {
        "id": "39532add-ccfc-4efc-8946-1cc3e0f3ee41",
        "staffName": "นาง กชพร ชุบรัมย์",
        "userId": "000150ea-3be8-44a3-ad0f-20350b08aa79",
        "userlogin": "4200009",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "529e2dcc-b0c3-48b8-b66e-ea2ea5a695e9",
    "code": "B17",
    "name": "อาคาร 17 (อาคารนวัตปัญญา)",
    "floors": 4,
    "description": "สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ",
    "staffs": [
      {
        "id": "77dd093e-a9a9-4611-ba1a-fe2a4eaf9d7d",
        "staffName": "กรวรรณ จันทรภูมิ",
        "userId": "223df438-6b07-438b-86ad-af460d5a3911",
        "userlogin": "600079",
        "isPrimary": true
      },
      {
        "id": "56ed032b-7656-49e8-82c3-2001a5e474bd",
        "staffName": "นาง ณัฐชยา ปรีชารัมย์",
        "userId": "c637a87d-f692-400b-ac2c-800401cdedd6",
        "userlogin": "600082",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "0040679c-c2ad-4a69-9045-91119bce6e59",
    "code": "B18",
    "name": "อาคาร 18 (อาคารเฉลิมพระเกียรติ 7 รอบ พระชนมพรรษา)",
    "floors": 5,
    "description": "สังกัด คณะเทคโนโลยีอุตสาหกรรม",
    "staffs": [
      {
        "id": "935aa4e3-1255-47c0-8d0c-818ff2620cce",
        "staffName": "ทองสุข คิดการ",
        "userId": "1bc16224-f644-4986-a55f-eafbd5de08d2",
        "userlogin": "5300049",
        "isPrimary": true
      },
      {
        "id": "8eb568bd-9d9d-4401-9e5c-128ba3a34fdd",
        "staffName": "นาง อินทิรา พงกระพันธ์",
        "userId": "b535c9bf-50fc-4a1a-8b8a-c75a8e16e5e7",
        "userlogin": "5800009",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "e4d58f74-4d82-49e1-8373-f8dadbc43289",
    "code": "B19",
    "name": "อาคาร 19 (อาคารสิริวิชญากร)",
    "floors": 5,
    "description": "สังกัด คณะครุศาสตร์",
    "staffs": [
      {
        "id": "12dccb7e-7e9c-491d-9a66-7ec3e3bb4313",
        "staffName": "นาย วุฒิพงษ์ ชำนาญชัยศรี",
        "userId": "1b4cab3f-2c6f-4b1d-9dff-910ee027baa2",
        "userlogin": "5000042",
        "isPrimary": true
      },
      {
        "id": "ea64dab5-58eb-4f10-b0c8-e01346b624e4",
        "staffName": "นางสาว ลลิตา จะเชนรัมย์",
        "userId": "ff007ea6-9026-4d12-a7d0-64be88c48ee1",
        "userlogin": "660267",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "83b80602-3275-4b84-94d0-17d6efb2b532",
    "code": "B20",
    "name": "อาคาร 20 (อาคารสิริวิทยเกษตร)",
    "floors": 4,
    "description": "สังกัด คณะเทคโนโลยีการเกษตร",
    "staffs": [
      {
        "id": "fd24c089-20c9-4462-8293-c61b25a019ce",
        "staffName": "นางสาว นงพะงา ปลั่งกลาง",
        "userId": "63abc1e0-a44e-4a24-a471-fd8ac4aca03e",
        "userlogin": "600072",
        "isPrimary": true
      },
      {
        "id": "6c0b723c-3e28-46d1-8b50-b5d3781bf9cf",
        "staffName": "นางสาว ศิริขวัญ อินัง",
        "userId": "9c4bcc8b-2b48-4a52-908d-f08354eb432f",
        "userlogin": "600077",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "7934e1d2-518e-4318-85fb-cab18fcbbaa3",
    "code": "B21",
    "name": "อาคาร 21",
    "floors": 3,
    "description": "สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน",
    "staffs": [
      {
        "id": "eff04359-3678-4989-87c3-329dc0df3a95",
        "staffName": "นางสาว ละเมียด ปลื้มกมล",
        "userId": "8e955ad3-c7b5-4585-9cca-fcca03ff5f16",
        "userlogin": "600076",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "734b53d7-59d0-471d-bfe2-b6289c7cb2d5",
    "code": "B22",
    "name": "อาคาร 22 (อาคารวิทยาศาสตร์สุขภาพ)",
    "floors": 8,
    "description": "สังกัด คณะวิทยาศาสตร์",
    "staffs": [
      {
        "id": "c8f894ef-bec5-4eed-8665-e0491f9081ce",
        "staffName": "นางสาวศุภิสรา รอบแคว้น",
        "userId": null,
        "userlogin": null,
        "isPrimary": true
      },
      {
        "id": "0d92f594-e880-4566-9e43-bc51806b4398",
        "staffName": "นางสาว ราตรี คำบาง",
        "userId": "634059fb-9b7b-4498-9de5-09358b5ceb99",
        "userlogin": "660169",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "25e688a8-5df2-4079-b0dc-3af537877f9a",
    "code": "B23",
    "name": "อาคาร 23 (อาคารอเนกคุณาคาร 1 อาคารราชภัฏคอมเพลคซ์)",
    "floors": 4,
    "description": "สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน + กองพัฒนานักศึกษา",
    "staffs": [
      {
        "id": "6b8a1dba-5c39-4484-8f7f-aca73f4705e5",
        "staffName": "อำนวย คงชู",
        "userId": "346996a6-428f-40d1-a8d0-237e0f5a0b3c",
        "userlogin": "6200010",
        "isPrimary": true
      },
      {
        "id": "d43c39dd-9110-49d6-97b0-9d59d894430d",
        "staffName": "นาย สมชาย สว่างพบ",
        "userId": "677a7781-3d96-42f9-81c5-b1959ca33f53",
        "userlogin": "660201",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "4b04657f-a7d1-48bd-b803-303ef8fa1541",
    "code": "B24",
    "name": "อาคาร 24 (คณะวิทยาการจัดการ)",
    "floors": 7,
    "description": "สังกัด คณะวิทยาการจัดการ",
    "staffs": [
      {
        "id": "3624ad95-0bd4-4e53-ae33-9fcd7f31e09b",
        "staffName": "นาง ณิสาชล คะรุรัมย์",
        "userId": "b4bb78bf-3ba6-46eb-a893-e789eba011cb",
        "userlogin": "600102",
        "isPrimary": true
      },
      {
        "id": "fa2adeb1-f027-4ea3-b394-0181d9c6eec7",
        "staffName": "นางสาว วาสนา กรีรัมย์",
        "userId": "45959002-1e06-4e55-a8e9-395b02a1c32f",
        "userlogin": "6300037",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "8bd0c52a-c2da-44a4-a507-b0b08f03b20f",
    "code": "B25",
    "name": "อาคาร 25 (คณะมนุษยศาสตร์และสังคมศาสตร์)",
    "floors": 5,
    "description": "สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์",
    "staffs": [
      {
        "id": "2fbc8ae1-630e-4897-9e8a-131eed4a1010",
        "staffName": "พรรณี สวายรัมย์",
        "userId": "facd0a93-ac05-4598-b159-c70a198de095",
        "userlogin": "5000035",
        "isPrimary": true
      },
      {
        "id": "17f12ebb-cea5-4cad-b872-661d86590e39",
        "staffName": "วันทนีย์ ประสูติธนกิตติ์",
        "userId": "f9d3df05-c6b9-4b5d-a788-1f65665c6879",
        "userlogin": "6200009",
        "isPrimary": false
      }
    ]
  },
  {
    "id": "9d340188-149a-47c6-b135-9ac5165c4689",
    "code": "B26",
    "name": "อาคาร 26 (อาคารอเนกคุณาคาร 2)",
    "floors": 4,
    "description": "สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชาศิลปะ)",
    "staffs": [
      {
        "id": "35730c8e-778f-4856-89f5-ac98a404ff47",
        "staffName": "นางสาว ละเมียด ปลื้มกมล",
        "userId": "8e955ad3-c7b5-4585-9cca-fcca03ff5f16",
        "userlogin": "600076",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "b67576c0-4284-48d0-a1fd-acdfb3a39d54",
    "code": "B27",
    "name": "อาคาร 27 (โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์)",
    "floors": 4,
    "description": "สังกัด โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์",
    "staffs": [
      {
        "id": "e37c8bc7-3f43-4855-8510-8d7516b1da93",
        "staffName": "นางสาว สุภาภรณ์ ชะโลมรัมย์",
        "userId": "9a54758f-2c17-4b91-8d88-756957d6aedd",
        "userlogin": "5600017",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "90fc40ad-94f6-4394-9b8b-d1991ec80f13",
    "code": "CANTEEN-1",
    "name": "ศูนย์อาหาร 1",
    "floors": 2,
    "description": "สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)",
    "staffs": [
      {
        "id": "8c052a77-043a-467c-8508-ad0cd250872d",
        "staffName": "นาย พรชัย มาลัยทอง",
        "userId": "d8f28b02-8066-4d23-a26a-1f73c2dd3150",
        "userlogin": "660420",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "03fbf7e8-add0-402b-85b4-e3927ec4f95b",
    "code": "CANTEEN-2",
    "name": "ศูนย์อาหาร 2",
    "floors": 2,
    "description": "สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)",
    "staffs": [
      {
        "id": "0c42e17c-6886-49dc-9009-2712df7067ce",
        "staffName": "นาย พรชัย มาลัยทอง",
        "userId": "d8f28b02-8066-4d23-a26a-1f73c2dd3150",
        "userlogin": "660420",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "c06171a9-fe0d-4f00-b84e-ba30e36e5b7a",
    "code": "DORM-KA",
    "name": "หอพักเขาอังคาร",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "0e31bcce-db8a-4014-92d5-1ae021283c01",
        "staffName": "นาง พรพรรณ คำใจ",
        "userId": "55a006ee-f8e9-41a6-8540-106bbc447c5e",
        "userlogin": "4700026",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "966b0fa8-43a1-4c4f-9a9f-2a6a3f95c215",
    "code": "DORM-KD",
    "name": "หอพักเขากระโดง",
    "floors": 4,
    "description": "สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (หอพักบุคลากร)",
    "staffs": [
      {
        "id": "3d6e8c96-4004-4050-acaa-f621fd368b56",
        "staffName": "นาง พรพรรณ คำใจ",
        "userId": "55a006ee-f8e9-41a6-8540-106bbc447c5e",
        "userlogin": "4700026",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "b9ec4477-f2a8-47e2-b55c-2d7b17b149a2",
    "code": "DORM-RP01",
    "name": "หอพักราชพฤกษ์ 1",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "1dfbf42a-bfdb-4d31-aa01-7ca5ce10ac2a",
        "staffName": "นาง นวน ระตาภรณ์",
        "userId": "1c6577b5-d084-47b7-aaa9-be018ec6ab1d",
        "userlogin": "660436",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "2fdf0eec-50bb-4915-8a4e-ca3a1364f365",
    "code": "DORM-RP02",
    "name": "หอพักราชพฤกษ์ 2",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "b0937759-961d-4151-8123-beb306b47548",
        "staffName": "ศรสวรรค์ เดยังรัมย์",
        "userId": "aecbee6a-7796-4adb-a71a-1b3ec5209cc4",
        "userlogin": "6600001",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "a73b5644-038f-48ea-867a-39bfaabe1de9",
    "code": "DORM-RP03",
    "name": "หอพักราชพฤกษ์ 3",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "210ee02c-4413-44d8-b2d9-66f6b94ced95",
        "staffName": "นาง นวน ระตาภรณ์",
        "userId": "1c6577b5-d084-47b7-aaa9-be018ec6ab1d",
        "userlogin": "660436",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "5d4f9ce1-818a-4cc8-b757-1a1718e79301",
    "code": "DORM-RP04",
    "name": "หอพักราชพฤกษ์ 4",
    "floors": 4,
    "description": "สังกัด คณะพยาบาลศาสตร์ (หอพักนักศึกษาพยาบาล)",
    "staffs": [
      {
        "id": "77929af7-5dc4-47bc-bafb-963c92b671d2",
        "staffName": "ศรสวรรค์ เดยังรัมย์",
        "userId": "aecbee6a-7796-4adb-a71a-1b3ec5209cc4",
        "userlogin": "6600001",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "3db946ac-f210-4fb1-af62-183306ab3b75",
    "code": "DORM-RP06",
    "name": "หอพักราชพฤกษ์ 6",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "de53177f-c098-41e0-8736-7e9975eb1e6b",
        "staffName": "นางสาว นงนุช หนาวบุรีรัมย์",
        "userId": "1c115ab8-71e0-4a5f-9dba-937d5fdd69ba",
        "userlogin": "5900034",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "a2b2e613-2667-45cd-8ee4-5063668c8752",
    "code": "DORM-RP07",
    "name": "หอพักราชพฤกษ์ 7",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "cf13e3c5-a368-403b-90df-5f46cbdb9111",
        "staffName": "นางสาว นงนุช หนาวบุรีรัมย์",
        "userId": "1c115ab8-71e0-4a5f-9dba-937d5fdd69ba",
        "userlogin": "5900034",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "b6757715-eb93-4f9b-b383-c505f14f7a7e",
    "code": "DORM-RP08",
    "name": "หอพักราชพฤกษ์ 8",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "c9824949-ea6b-499e-a0df-ba1722dd642c",
        "staffName": "จรรยา เจียนรัมย์",
        "userId": "957f22e1-5e9e-4677-b84e-9a0903969348",
        "userlogin": "6800012",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "f4d963cf-b5dd-46f8-80e2-c23131a206e4",
    "code": "DORM-RP09",
    "name": "หอพักราชพฤกษ์ 9",
    "floors": 4,
    "description": "สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)",
    "staffs": [
      {
        "id": "9ff86c66-0f69-420b-a931-1de8f0654ac5",
        "staffName": "จรรยา เจียนรัมย์",
        "userId": "957f22e1-5e9e-4677-b84e-9a0903969348",
        "userlogin": "6800012",
        "isPrimary": true
      }
    ]
  },
  {
    "id": "b30a43b3-99c4-408b-955f-3614c0de1148",
    "code": "POOL",
    "name": "สระว่ายน้ำ (ราชภัฏชลาธาร)",
    "floors": 1,
    "description": "คณะกรรมการอาคารสถานกีฬาตามคำสั่งแต่งตั้งของมหาวิทยาลัย",
    "staffs": [
      {
        "id": "976098cf-2463-4b2f-b649-3c09defbca2f",
        "staffName": "นายวรุฒิพงษ์ สิริวัฒนธีรกุล",
        "userId": null,
        "userlogin": null,
        "isPrimary": true
      }
    ]
  }
]

if (!(globalThis as any).__DEFAULT_BUILDINGS) {
  (globalThis as any).__DEFAULT_BUILDINGS = [...INITIAL_BUILDINGS]
}

export default defineEventHandler(async () => {
  if (await isDbReady()) {
    try {
      const buildings = await prisma.building.findMany({
        where: { isActive: true },
        include: { staffs: { include: { user: true } } },
        orderBy: { code: 'asc' }
      })

      if (buildings.length > 0) {
        return { ok: true, data: buildings }
      }
    } catch (err) {}
  }

  return { ok: true, data: (globalThis as any).__DEFAULT_BUILDINGS }
})
