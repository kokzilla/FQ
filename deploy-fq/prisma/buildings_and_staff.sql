-- =========================================================================
-- SQL Data Script: BRU Buildings & Responsible Staff (With BRU SSO Accounts)
-- มหาวิทยาลัยราชภัฏบุรีรัมย์ - ข้อมูลอาคารและผู้รับผิดชอบเชื่อมโยงกับระบบ BRU SSO
-- Compatible with PostgreSQL (Table: "User", "Building", "BuildingStaff")
-- =========================================================================

BEGIN;

-- 1. Insert/Update SSO Users (พนักงานบริการประจำอาคาร / แม่บ้าน จาก BRU SSO)
INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('ea9464ab-faf5-41c0-9545-1ea1d41241e0', '100080', 'ผู้ช่วยศาสตราจารย์ ดร. สมศักดิ์ จีวัฒนา', '100080@bru.ac.th', 'AUDITOR', '118', 'บุคลากรมหาวิทยาลัย', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('bc67806b-4cac-40e7-98b9-d2d64131a02b', '4200008', 'นาง บุญมี จันลา', '4200008@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('000150ea-3be8-44a3-ad0f-20350b08aa79', '4200009', 'นาง กชพร ชุบรัมย์', '4200009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('8d2294b9-0f6c-428e-9e6d-d4cc17f05850', '4300016', 'นางสาว พิมพ์วลัญช์ เชียงพฤกษ์', '4300016@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('55a006ee-f8e9-41a6-8540-106bbc447c5e', '4700026', 'นาง พรพรรณ คำใจ', '4700026@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('facd0a93-ac05-4598-b159-c70a198de095', '5000035', 'พรรณี สวายรัมย์', '5000035@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('1b4cab3f-2c6f-4b1d-9dff-910ee027baa2', '5000042', 'นาย วุฒิพงษ์ ชำนาญชัยศรี', '5000042@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('04656b16-c2bc-48d9-a917-9c2d6b2523ff', '500284', 'อาจารย์ ดร. ชาติวุฒิ ธนาจิรันธร', '500284@bru.ac.th', 'AUDITOR', '102', 'บุคลากรมหาวิทยาลัย', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('c864e006-fd80-403d-a606-5f77b99bcfd6', '5300005', 'นาย สุรชัย ตามกลาง', '5300005@bru.ac.th', 'AUDITOR', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('1bc16224-f644-4986-a55f-eafbd5de08d2', '5300049', 'ทองสุข คิดการ', '5300049@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('3c189b33-18cf-453e-8879-691b170fbf47', '5500056', 'นาง ประยงค์ นันกลาง', '5500056@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('9a54758f-2c17-4b91-8d88-756957d6aedd', '5600017', 'นางสาว สุภาภรณ์ ชะโลมรัมย์', '5600017@bru.ac.th', 'HOUSEKEEPER', '86', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('b535c9bf-50fc-4a1a-8b8a-c75a8e16e5e7', '5800009', 'นาง อินทิรา พงกระพันธ์', '5800009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('1c115ab8-71e0-4a5f-9dba-937d5fdd69ba', '5900034', 'นางสาว นงนุช หนาวบุรีรัมย์', '5900034@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('63abc1e0-a44e-4a24-a471-fd8ac4aca03e', '600072', 'นางสาว นงพะงา ปลั่งกลาง', '600072@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('8e955ad3-c7b5-4585-9cca-fcca03ff5f16', '600076', 'นางสาว ละเมียด ปลื้มกมล', '600076@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('9c4bcc8b-2b48-4a52-908d-f08354eb432f', '600077', 'นางสาว ศิริขวัญ อินัง', '600077@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('b2186417-abf1-41ee-8311-b2d9ba2151c8', '600078', 'นางสาว กันตินันท์ เอกา', '600078@bru.ac.th', 'HOUSEKEEPER', '65', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('223df438-6b07-438b-86ad-af460d5a3911', '600079', 'กรวรรณ จันทรภูมิ', '600079@bru.ac.th', 'HOUSEKEEPER', '65', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('c637a87d-f692-400b-ac2c-800401cdedd6', '600082', 'นาง ณัฐชยา ปรีชารัมย์', '600082@bru.ac.th', 'HOUSEKEEPER', '66', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('7b436341-14a1-4266-a324-b63a7e96b5af', '600083', 'นาง ตวงลักษณ์ นิลแก้ว', '600083@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('b4bb78bf-3ba6-46eb-a893-e789eba011cb', '600102', 'นาง ณิสาชล คะรุรัมย์', '600102@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('f9d3df05-c6b9-4b5d-a788-1f65665c6879', '6200009', 'วันทนีย์ ประสูติธนกิตติ์', '6200009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('346996a6-428f-40d1-a8d0-237e0f5a0b3c', '6200010', 'อำนวย คงชู', '6200010@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('72e9a4cf-82fb-4109-8c63-25cc51be4a9d', '6200027', 'นางสาว พชรภรณ์ ลีประโคน', '6200027@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('de1dc0eb-54f5-4b05-ad14-fec4131a4429', '6300025', 'นาง ณิชาภา นามวัน', '6300025@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('45959002-1e06-4e55-a8e9-395b02a1c32f', '6300037', 'นางสาว วาสนา กรีรัมย์', '6300037@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('22a2619b-57e5-4f8d-9da2-93560f495eb4', '6400013', 'นางสาว สุวรรณา ทองสม', '6400013@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('f6510fd5-4ff2-4d4b-babd-7ea415ac83cf', '6500016', 'สุณี เกริงรัมย์', '6500016@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('aecbee6a-7796-4adb-a71a-1b3ec5209cc4', '6600001', 'ศรสวรรค์ เดยังรัมย์', '6600001@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('93426701-adf3-43bc-a61c-d8cc65abc3ab', '660065', 'นาย วุฒิชัย มะลิรัมย์', '660065@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('f90d0109-a40e-4956-9513-e7e24ea130a5', '660141', 'นาง รุจิกาญจน์ สิงห์คำ', '660141@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('634059fb-9b7b-4498-9de5-09358b5ceb99', '660169', 'นางสาว ราตรี คำบาง', '660169@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('677a7781-3d96-42f9-81c5-b1959ca33f53', '660201', 'นาย สมชาย สว่างพบ', '660201@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('ff007ea6-9026-4d12-a7d0-64be88c48ee1', '660267', 'นางสาว ลลิตา จะเชนรัมย์', '660267@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('8afddff0-2367-434e-9d77-8afa13b1dc57', '660269', 'นาย ทองพูน ธรรมสาลี', '660269@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('d8f28b02-8066-4d23-a26a-1f73c2dd3150', '660420', 'นาย พรชัย มาลัยทอง', '660420@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('0d466cd5-79a5-4f3c-b86d-f9ae98e6f7d8', '660427', 'นาย พงศ์ศรัณย์ เติมเทียน', '660427@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('1c6577b5-d084-47b7-aaa9-be018ec6ab1d', '660436', 'นาง นวน ระตาภรณ์', '660436@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('63de95f1-a75f-4fb4-9396-034a8a0f8686', '660442', 'นางสาว เสาวลักษณ์ กอนรัมย์', '660442@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('e36a94e4-deff-4721-bb09-d1f355915c15', '660491', 'นางสาว ธัญญรัศม์ เครืองรัมย์', '660491@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('fd7c44f6-90da-4b92-903a-9ad7675ea22c', '6700002', 'มาลี สิงห์คำ', '6700002@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('4bb399af-aaac-4795-b93b-e48fa271eb2b', '6700009', 'มะปราง เปาป่า', '6700009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('55fbb229-9d63-44c5-a868-d715825df9c7', '6700015', 'จุฑาทิพย์ อีนัง', '6700015@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('957f22e1-5e9e-4677-b84e-9a0903969348', '6800012', 'จรรยา เจียนรัมย์', '6800012@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('c67fe412-0f81-4aae-891a-2c1ae6148984', '6800016', 'บุญมี ปัตแวว', '6800016@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('021c1f9d-3e60-4d78-8552-fef53daee902', '6800017', 'ญาณวรุตม์ พันธุ์ขุนแก้ว', '6800017@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('84f68217-42a8-44e1-918f-29187c08b73b', '6800024', 'พัชรา พะสุรัมย์', '6800024@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('aa1a2ec7-1f50-4eb0-be86-140b3fc7787e', '6900004', 'จันทร์จิรา เชิดกลิ่น', '6900004@bru.ac.th', 'HOUSEKEEPER', '1', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('16e14d00-3476-4296-8c44-c14f7d92f70d', '6900005', 'ปัทมา ยอนรัมย์', '6900005@bru.ac.th', 'HOUSEKEEPER', '1', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('0d7cd6cc-32cb-46d5-a6f9-3d7143f828d6', '900522', 'ผู้ช่วยศาสตราจารย์ ดร. พิทยา พันธะไชย', '900522@bru.ac.th', 'AUDITOR', '79', 'บุคลากรมหาวิทยาลัย', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "userlogin", "fullName", "email", "role", "departmentId", "positionName", "createdAt", "updatedAt")
VALUES ('199d8a03-d67a-43fb-a6b5-e8cb2f1c1040', 'admin', 'ผู้ดูแลระบบ อาคารสถานที่', 'admin@bru.ac.th', 'ADMIN', NULL, 'ผู้ดูแลระบบ', NOW(), NOW())
ON CONFLICT ("userlogin") DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "departmentId" = EXCLUDED."departmentId",
  "positionName" = EXCLUDED."positionName",
  "updatedAt" = NOW();

-- 2. Insert/Update Buildings
-- อาคาร: B-AUD1 - หอประชุมวิชชาอัตศาสตร์
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('20fe781e-e11c-40d7-8611-a9c3041e713c', 'B-AUD1', 'หอประชุมวิชชาอัตศาสตร์', 2, 'ผอ.กองกลาง', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('20538c49-41ee-484f-a9e3-5a8399a1a1e3', '20fe781e-e11c-40d7-8611-a9c3041e713c', 'c864e006-fd80-403d-a606-5f77b99bcfd6', 'นาย สุรชัย ตามกลาง', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-AUD2 - หอประชุมมาลิณีจุโฑปะมา
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('cbbc95ec-f199-43a1-9251-9d56c76f3c19', 'B-AUD2', 'หอประชุมมาลิณีจุโฑปะมา', 2, 'คณะกรรมการหอประชุมตามคำสั่งแต่งตั้งของมหาวิทยาลัย', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('a1c1aed3-9081-4099-b9dd-1223ae44520c', 'cbbc95ec-f199-43a1-9251-9d56c76f3c19', '021c1f9d-3e60-4d78-8552-fef53daee902', 'ญาณวรุตม์ พันธุ์ขุนแก้ว', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('e4565071-ebbd-4a20-970b-75cbd1c3da99', 'cbbc95ec-f199-43a1-9251-9d56c76f3c19', 'c67fe412-0f81-4aae-891a-2c1ae6148984', 'บุญมี ปัตแวว', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('1a69a4c3-4cdb-433a-8113-586906f8a854', 'cbbc95ec-f199-43a1-9251-9d56c76f3c19', '84f68217-42a8-44e1-918f-29187c08b73b', 'พัชรา พะสุรัมย์', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-CER - อาคารเซรามิกส์
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('14e0a11b-a4b9-4687-b60f-0a97b6f1d87a', 'B-CER', 'อาคารเซรามิกส์', 1, 'สังกัด คณะเทคโนโลยีอุตสาหกรรม', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('d9c2c01a-c5a6-41b0-af5a-5dc9c821b694', '14e0a11b-a4b9-4687-b60f-0a97b6f1d87a', '8afddff0-2367-434e-9d77-8afa13b1dc57', 'นาย ทองพูน ธรรมสาลี', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-CUL - ศูนย์วัฒนธรรมอีสานใต้
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('8b16bf09-ebbc-4159-836a-b8dde54ca425', 'B-CUL', 'ศูนย์วัฒนธรรมอีสานใต้', 2, 'สังกัด สำนักศิลปะและวัฒนธรรม', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('00906ba4-7535-48ba-95b9-27b7f7515b04', '8b16bf09-ebbc-4159-836a-b8dde54ca425', '63de95f1-a75f-4fb4-9396-034a8a0f8686', 'นางสาว เสาวลักษณ์ กอนรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-GYM - โรงยิมส์
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('f1a88782-4f3a-4655-b7c5-3a4ed1ec2fd1', 'B-GYM', 'โรงยิมส์', 2, 'สังกัด คณะครุศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('cee36c6f-325b-4786-a96c-2016f5bde055', 'f1a88782-4f3a-4655-b7c5-3a4ed1ec2fd1', '55fbb229-9d63-44c5-a868-d715825df9c7', 'จุฑาทิพย์ อีนัง', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-IT - อาคาร IT (อาคารเทคโนโลยีสารสนเทศเก่า)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('467c76f8-8007-4e82-a4e7-0799deb929cc', 'B-IT', 'อาคาร IT (อาคารเทคโนโลยีสารสนเทศเก่า)', 2, 'สังกัด คณะวิทยาศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('2a4b0fdc-7a8d-453e-8d38-f71312055412', '467c76f8-8007-4e82-a4e7-0799deb929cc', 'de1dc0eb-54f5-4b05-ad14-fec4131a4429', 'นาง ณิชาภา นามวัน', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-LIB - อาคารบรรณราชนครินทร์ (ห้องสมุด สำนักวิทยบริการฯ)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('e135cd6d-bc80-4ef5-9596-538ecc47296b', 'B-LIB', 'อาคารบรรณราชนครินทร์ (ห้องสมุด สำนักวิทยบริการฯ)', 4, 'สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('1cce249d-f906-404c-9338-024f081a1f22', 'e135cd6d-bc80-4ef5-9596-538ecc47296b', 'b2186417-abf1-41ee-8311-b2d9ba2151c8', 'นางสาว กันตินันท์ เอกา', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-STAD - สนามกีฬากลาง
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('d9767a01-0718-4526-9aa2-19ba05a8368c', 'B-STAD', 'สนามกีฬากลาง', 1, 'สังกัด คณะครุศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('380f78b6-aaa9-4f02-8581-5beb204a4427', 'd9767a01-0718-4526-9aa2-19ba05a8368c', '93426701-adf3-43bc-a61c-d8cc65abc3ab', 'นาย วุฒิชัย มะลิรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B-WOOD - Shop งานไม้ (คณะเทคโนโลยีอุตสาหกรรมเก่า)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('9f814059-ae61-4756-8bc4-d7e8595a9956', 'B-WOOD', 'Shop งานไม้ (คณะเทคโนโลยีอุตสาหกรรมเก่า)', 1, 'สังกัด คณะเทคโนโลยีอุตสาหกรรม', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('7f2fd072-eb45-41c3-ba66-0bee7cdd0a22', '9f814059-ae61-4756-8bc4-d7e8595a9956', '8afddff0-2367-434e-9d77-8afa13b1dc57', 'นาย ทองพูน ธรรมสาลี', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B01 - อาคาร 1
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('31d1b24a-c308-408b-af06-f707e2d0913e', 'B01', 'อาคาร 1', 3, 'สังกัด สถาบันวิจัยและพัฒนา', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('6b7a3b0c-d10b-4112-8c54-2cdfa40aaa6e', '31d1b24a-c308-408b-af06-f707e2d0913e', '3c189b33-18cf-453e-8879-691b170fbf47', 'นาง ประยงค์ นันกลาง', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B02 - อาคาร 2
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('ed2c1845-059b-4b37-88dc-41dbebf178a5', 'B02', 'อาคาร 2', 3, 'สังกัด คณะวิทยาศาสตร์ (ห้องพยาบาล)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('8ccd620e-1e1a-495c-8e13-3a06f387c22f', 'ed2c1845-059b-4b37-88dc-41dbebf178a5', 'aa1a2ec7-1f50-4eb0-be86-140b3fc7787e', 'จันทร์จิรา เชิดกลิ่น', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B05 - อาคาร 5
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('c87dea49-468c-467e-80c4-b3161e76f861', 'B05', 'อาคาร 5', 3, 'สังกัด คณะวิทยาศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('33ca1cbb-10d8-4e3b-b12c-a6a9fbcf819e', 'c87dea49-468c-467e-80c4-b3161e76f861', '16e14d00-3476-4296-8c44-c14f7d92f70d', 'ปัทมา ยอนรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B06 - อาคาร 6
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('ae5b74a2-a766-4b32-9d02-2147d7f43b14', 'B06', 'อาคาร 6', 3, 'สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('4358db12-92da-4d2f-b83b-b4a666b618b5', 'ae5b74a2-a766-4b32-9d02-2147d7f43b14', 'f6510fd5-4ff2-4d4b-babd-7ea415ac83cf', 'สุณี เกริงรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B07 - อาคาร 7
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('0d793dbf-5bf1-4799-82f6-9d0f0494f201', 'B07', 'อาคาร 7', 3, 'สังกัด คณะวิทยาศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('6c998321-5a95-44e7-884e-8cc0e28cb96f', '0d793dbf-5bf1-4799-82f6-9d0f0494f201', '8d2294b9-0f6c-428e-9e6d-d4cc17f05850', 'นางสาว พิมพ์วลัญช์ เชียงพฤกษ์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B10 - อาคาร 10
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('582cbe05-04cb-4585-af38-075fb19844fb', 'B10', 'อาคาร 10', 3, 'สังกัด คณะครุศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('401b79eb-ce8c-4be7-a6f0-7cfe2ac36ed8', '582cbe05-04cb-4585-af38-075fb19844fb', '7b436341-14a1-4266-a324-b63a7e96b5af', 'นาง ตวงลักษณ์ นิลแก้ว', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B12 - อาคาร 12 (ศูนย์วิทยาศาสตร์และวิทยาศาสตร์ประยุกต์)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('aa6b5228-92f6-4e59-a32b-a20041205ba6', 'B12', 'อาคาร 12 (ศูนย์วิทยาศาสตร์และวิทยาศาสตร์ประยุกต์)', 4, 'สังกัด คณะวิทยาศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('ff786505-c13c-4f4f-9d20-e435ce3c2392', 'aa6b5228-92f6-4e59-a32b-a20041205ba6', '0d466cd5-79a5-4f3c-b86d-f9ae98e6f7d8', 'นาย พงศ์ศรัณย์ เติมเทียน', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('9bcc5a83-1784-4afd-bd60-c7cb00b4b795', 'aa6b5228-92f6-4e59-a32b-a20041205ba6', '4bb399af-aaac-4795-b93b-e48fa271eb2b', 'มะปราง เปาป่า', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B13 - อาคาร 13 (คณะพยาบาลศาสตร์)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('b3ddecc2-61eb-4c24-ac76-26bb3c7e2d15', 'B13', 'อาคาร 13 (คณะพยาบาลศาสตร์)', 4, 'สังกัด คณะพยาบาลศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('644563d1-b7b3-4637-948d-35c91e15178a', 'b3ddecc2-61eb-4c24-ac76-26bb3c7e2d15', '22a2619b-57e5-4f8d-9da2-93560f495eb4', 'นางสาว สุวรรณา ทองสม', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B14 - อาคาร 14
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('e2e48bb4-de09-46fe-a32f-e1d1d973177b', 'B14', 'อาคาร 14', 3, 'สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชานาฏศิลป์+ดนตรี)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('856479e6-2817-4985-a9cf-5fce566dc906', 'e2e48bb4-de09-46fe-a32f-e1d1d973177b', 'fd7c44f6-90da-4b92-903a-9ad7675ea22c', 'มาลี สิงห์คำ', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B15 - อาคาร 15 (อาคารเฉลิมพระเกียรติ 50 พรรษามหาวชิราลงกรณ์)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('72ae0fa1-1531-4871-ad04-ce918863459b', 'B15', 'อาคาร 15 (อาคารเฉลิมพระเกียรติ 50 พรรษามหาวชิราลงกรณ์)', 9, 'สังกัด สำนักงานอธิการบดี + บัณฑิตวิทยาลัย', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('de051e31-412d-496b-b142-435eff26bde4', '72ae0fa1-1531-4871-ad04-ce918863459b', 'bc67806b-4cac-40e7-98b9-d2d64131a02b', 'นาง บุญมี จันลา', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('276b8b99-b174-460e-b921-95a953e30ef5', '72ae0fa1-1531-4871-ad04-ce918863459b', 'e36a94e4-deff-4721-bb09-d1f355915c15', 'นางสาว ธัญญรัศม์ เครืองรัมย์', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('64bca0fe-9701-44e6-8eb7-ade6335110d7', '72ae0fa1-1531-4871-ad04-ce918863459b', '72e9a4cf-82fb-4109-8c63-25cc51be4a9d', 'นางสาว พชรภรณ์ ลีประโคน', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('561fe003-12e2-4fea-87a6-c5868fb6c1ed', '72ae0fa1-1531-4871-ad04-ce918863459b', 'f90d0109-a40e-4956-9513-e7e24ea130a5', 'นาง รุจิกาญจน์ สิงห์คำ', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B16 - อาคาร 16 (อาคารสิ่งทอ)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('f788f6aa-df6d-4494-8e09-065043c3dacc', 'B16', 'อาคาร 16 (อาคารสิ่งทอ)', 2, 'สังกัด คณะวิทยาศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('39532add-ccfc-4efc-8946-1cc3e0f3ee41', 'f788f6aa-df6d-4494-8e09-065043c3dacc', '000150ea-3be8-44a3-ad0f-20350b08aa79', 'นาง กชพร ชุบรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B17 - อาคาร 17 (อาคารนวัตปัญญา)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('529e2dcc-b0c3-48b8-b66e-ea2ea5a695e9', 'B17', 'อาคาร 17 (อาคารนวัตปัญญา)', 4, 'สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('77dd093e-a9a9-4611-ba1a-fe2a4eaf9d7d', '529e2dcc-b0c3-48b8-b66e-ea2ea5a695e9', '223df438-6b07-438b-86ad-af460d5a3911', 'กรวรรณ จันทรภูมิ', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('56ed032b-7656-49e8-82c3-2001a5e474bd', '529e2dcc-b0c3-48b8-b66e-ea2ea5a695e9', 'c637a87d-f692-400b-ac2c-800401cdedd6', 'นาง ณัฐชยา ปรีชารัมย์', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B18 - อาคาร 18 (อาคารเฉลิมพระเกียรติ 7 รอบ พระชนมพรรษา)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('0040679c-c2ad-4a69-9045-91119bce6e59', 'B18', 'อาคาร 18 (อาคารเฉลิมพระเกียรติ 7 รอบ พระชนมพรรษา)', 5, 'สังกัด คณะเทคโนโลยีอุตสาหกรรม', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('935aa4e3-1255-47c0-8d0c-818ff2620cce', '0040679c-c2ad-4a69-9045-91119bce6e59', '1bc16224-f644-4986-a55f-eafbd5de08d2', 'ทองสุข คิดการ', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('8eb568bd-9d9d-4401-9e5c-128ba3a34fdd', '0040679c-c2ad-4a69-9045-91119bce6e59', 'b535c9bf-50fc-4a1a-8b8a-c75a8e16e5e7', 'นาง อินทิรา พงกระพันธ์', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B19 - อาคาร 19 (อาคารสิริวิชญากร)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('e4d58f74-4d82-49e1-8373-f8dadbc43289', 'B19', 'อาคาร 19 (อาคารสิริวิชญากร)', 5, 'สังกัด คณะครุศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('12dccb7e-7e9c-491d-9a66-7ec3e3bb4313', 'e4d58f74-4d82-49e1-8373-f8dadbc43289', '1b4cab3f-2c6f-4b1d-9dff-910ee027baa2', 'นาย วุฒิพงษ์ ชำนาญชัยศรี', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('ea64dab5-58eb-4f10-b0c8-e01346b624e4', 'e4d58f74-4d82-49e1-8373-f8dadbc43289', 'ff007ea6-9026-4d12-a7d0-64be88c48ee1', 'นางสาว ลลิตา จะเชนรัมย์', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B20 - อาคาร 20 (อาคารสิริวิทยเกษตร)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('83b80602-3275-4b84-94d0-17d6efb2b532', 'B20', 'อาคาร 20 (อาคารสิริวิทยเกษตร)', 4, 'สังกัด คณะเทคโนโลยีการเกษตร', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('fd24c089-20c9-4462-8293-c61b25a019ce', '83b80602-3275-4b84-94d0-17d6efb2b532', '63abc1e0-a44e-4a24-a471-fd8ac4aca03e', 'นางสาว นงพะงา ปลั่งกลาง', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('6c0b723c-3e28-46d1-8b50-b5d3781bf9cf', '83b80602-3275-4b84-94d0-17d6efb2b532', '9c4bcc8b-2b48-4a52-908d-f08354eb432f', 'นางสาว ศิริขวัญ อินัง', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B21 - อาคาร 21
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('7934e1d2-518e-4318-85fb-cab18fcbbaa3', 'B21', 'อาคาร 21', 3, 'สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('eff04359-3678-4989-87c3-329dc0df3a95', '7934e1d2-518e-4318-85fb-cab18fcbbaa3', '8e955ad3-c7b5-4585-9cca-fcca03ff5f16', 'นางสาว ละเมียด ปลื้มกมล', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B22 - อาคาร 22 (อาคารวิทยาศาสตร์สุขภาพ)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('734b53d7-59d0-471d-bfe2-b6289c7cb2d5', 'B22', 'อาคาร 22 (อาคารวิทยาศาสตร์สุขภาพ)', 8, 'สังกัด คณะวิทยาศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('c8f894ef-bec5-4eed-8665-e0491f9081ce', '734b53d7-59d0-471d-bfe2-b6289c7cb2d5', NULL, 'นางสาวศุภิสรา รอบแคว้น', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('0d92f594-e880-4566-9e43-bc51806b4398', '734b53d7-59d0-471d-bfe2-b6289c7cb2d5', '634059fb-9b7b-4498-9de5-09358b5ceb99', 'นางสาว ราตรี คำบาง', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B23 - อาคาร 23 (อาคารอเนกคุณาคาร 1 อาคารราชภัฏคอมเพลคซ์)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('25e688a8-5df2-4079-b0dc-3af537877f9a', 'B23', 'อาคาร 23 (อาคารอเนกคุณาคาร 1 อาคารราชภัฏคอมเพลคซ์)', 4, 'สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน + กองพัฒนานักศึกษา', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('6b8a1dba-5c39-4484-8f7f-aca73f4705e5', '25e688a8-5df2-4079-b0dc-3af537877f9a', '346996a6-428f-40d1-a8d0-237e0f5a0b3c', 'อำนวย คงชู', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('d43c39dd-9110-49d6-97b0-9d59d894430d', '25e688a8-5df2-4079-b0dc-3af537877f9a', '677a7781-3d96-42f9-81c5-b1959ca33f53', 'นาย สมชาย สว่างพบ', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B24 - อาคาร 24 (คณะวิทยาการจัดการ)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('4b04657f-a7d1-48bd-b803-303ef8fa1541', 'B24', 'อาคาร 24 (คณะวิทยาการจัดการ)', 7, 'สังกัด คณะวิทยาการจัดการ', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('3624ad95-0bd4-4e53-ae33-9fcd7f31e09b', '4b04657f-a7d1-48bd-b803-303ef8fa1541', 'b4bb78bf-3ba6-46eb-a893-e789eba011cb', 'นาง ณิสาชล คะรุรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('fa2adeb1-f027-4ea3-b394-0181d9c6eec7', '4b04657f-a7d1-48bd-b803-303ef8fa1541', '45959002-1e06-4e55-a8e9-395b02a1c32f', 'นางสาว วาสนา กรีรัมย์', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B25 - อาคาร 25 (คณะมนุษยศาสตร์และสังคมศาสตร์)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('8bd0c52a-c2da-44a4-a507-b0b08f03b20f', 'B25', 'อาคาร 25 (คณะมนุษยศาสตร์และสังคมศาสตร์)', 5, 'สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('2fbc8ae1-630e-4897-9e8a-131eed4a1010', '8bd0c52a-c2da-44a4-a507-b0b08f03b20f', 'facd0a93-ac05-4598-b159-c70a198de095', 'พรรณี สวายรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";
INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('17f12ebb-cea5-4cad-b872-661d86590e39', '8bd0c52a-c2da-44a4-a507-b0b08f03b20f', 'f9d3df05-c6b9-4b5d-a788-1f65665c6879', 'วันทนีย์ ประสูติธนกิตติ์', false, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B26 - อาคาร 26 (อาคารอเนกคุณาคาร 2)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('9d340188-149a-47c6-b135-9ac5165c4689', 'B26', 'อาคาร 26 (อาคารอเนกคุณาคาร 2)', 4, 'สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชาศิลปะ)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('35730c8e-778f-4856-89f5-ac98a404ff47', '9d340188-149a-47c6-b135-9ac5165c4689', '8e955ad3-c7b5-4585-9cca-fcca03ff5f16', 'นางสาว ละเมียด ปลื้มกมล', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: B27 - อาคาร 27 (โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('b67576c0-4284-48d0-a1fd-acdfb3a39d54', 'B27', 'อาคาร 27 (โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์)', 4, 'สังกัด โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('e37c8bc7-3f43-4855-8510-8d7516b1da93', 'b67576c0-4284-48d0-a1fd-acdfb3a39d54', '9a54758f-2c17-4b91-8d88-756957d6aedd', 'นางสาว สุภาภรณ์ ชะโลมรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: CANTEEN-1 - ศูนย์อาหาร 1
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('90fc40ad-94f6-4394-9b8b-d1991ec80f13', 'CANTEEN-1', 'ศูนย์อาหาร 1', 2, 'สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('8c052a77-043a-467c-8508-ad0cd250872d', '90fc40ad-94f6-4394-9b8b-d1991ec80f13', 'd8f28b02-8066-4d23-a26a-1f73c2dd3150', 'นาย พรชัย มาลัยทอง', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: CANTEEN-2 - ศูนย์อาหาร 2
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('03fbf7e8-add0-402b-85b4-e3927ec4f95b', 'CANTEEN-2', 'ศูนย์อาหาร 2', 2, 'สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('0c42e17c-6886-49dc-9009-2712df7067ce', '03fbf7e8-add0-402b-85b4-e3927ec4f95b', 'd8f28b02-8066-4d23-a26a-1f73c2dd3150', 'นาย พรชัย มาลัยทอง', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-KA - หอพักเขาอังคาร
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('c06171a9-fe0d-4f00-b84e-ba30e36e5b7a', 'DORM-KA', 'หอพักเขาอังคาร', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('0e31bcce-db8a-4014-92d5-1ae021283c01', 'c06171a9-fe0d-4f00-b84e-ba30e36e5b7a', '55a006ee-f8e9-41a6-8540-106bbc447c5e', 'นาง พรพรรณ คำใจ', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-KD - หอพักเขากระโดง
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('966b0fa8-43a1-4c4f-9a9f-2a6a3f95c215', 'DORM-KD', 'หอพักเขากระโดง', 4, 'สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (หอพักบุคลากร)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('3d6e8c96-4004-4050-acaa-f621fd368b56', '966b0fa8-43a1-4c4f-9a9f-2a6a3f95c215', '55a006ee-f8e9-41a6-8540-106bbc447c5e', 'นาง พรพรรณ คำใจ', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP01 - หอพักราชพฤกษ์ 1
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('b9ec4477-f2a8-47e2-b55c-2d7b17b149a2', 'DORM-RP01', 'หอพักราชพฤกษ์ 1', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('1dfbf42a-bfdb-4d31-aa01-7ca5ce10ac2a', 'b9ec4477-f2a8-47e2-b55c-2d7b17b149a2', '1c6577b5-d084-47b7-aaa9-be018ec6ab1d', 'นาง นวน ระตาภรณ์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP02 - หอพักราชพฤกษ์ 2
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('2fdf0eec-50bb-4915-8a4e-ca3a1364f365', 'DORM-RP02', 'หอพักราชพฤกษ์ 2', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('b0937759-961d-4151-8123-beb306b47548', '2fdf0eec-50bb-4915-8a4e-ca3a1364f365', 'aecbee6a-7796-4adb-a71a-1b3ec5209cc4', 'ศรสวรรค์ เดยังรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP03 - หอพักราชพฤกษ์ 3
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('a73b5644-038f-48ea-867a-39bfaabe1de9', 'DORM-RP03', 'หอพักราชพฤกษ์ 3', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('210ee02c-4413-44d8-b2d9-66f6b94ced95', 'a73b5644-038f-48ea-867a-39bfaabe1de9', '1c6577b5-d084-47b7-aaa9-be018ec6ab1d', 'นาง นวน ระตาภรณ์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP04 - หอพักราชพฤกษ์ 4
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('5d4f9ce1-818a-4cc8-b757-1a1718e79301', 'DORM-RP04', 'หอพักราชพฤกษ์ 4', 4, 'สังกัด คณะพยาบาลศาสตร์ (หอพักนักศึกษาพยาบาล)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('77929af7-5dc4-47bc-bafb-963c92b671d2', '5d4f9ce1-818a-4cc8-b757-1a1718e79301', 'aecbee6a-7796-4adb-a71a-1b3ec5209cc4', 'ศรสวรรค์ เดยังรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP06 - หอพักราชพฤกษ์ 6
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('3db946ac-f210-4fb1-af62-183306ab3b75', 'DORM-RP06', 'หอพักราชพฤกษ์ 6', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('de53177f-c098-41e0-8736-7e9975eb1e6b', '3db946ac-f210-4fb1-af62-183306ab3b75', '1c115ab8-71e0-4a5f-9dba-937d5fdd69ba', 'นางสาว นงนุช หนาวบุรีรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP07 - หอพักราชพฤกษ์ 7
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('a2b2e613-2667-45cd-8ee4-5063668c8752', 'DORM-RP07', 'หอพักราชพฤกษ์ 7', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('cf13e3c5-a368-403b-90df-5f46cbdb9111', 'a2b2e613-2667-45cd-8ee4-5063668c8752', '1c115ab8-71e0-4a5f-9dba-937d5fdd69ba', 'นางสาว นงนุช หนาวบุรีรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP08 - หอพักราชพฤกษ์ 8
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('b6757715-eb93-4f9b-b383-c505f14f7a7e', 'DORM-RP08', 'หอพักราชพฤกษ์ 8', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('c9824949-ea6b-499e-a0df-ba1722dd642c', 'b6757715-eb93-4f9b-b383-c505f14f7a7e', '957f22e1-5e9e-4677-b84e-9a0903969348', 'จรรยา เจียนรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: DORM-RP09 - หอพักราชพฤกษ์ 9
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('f4d963cf-b5dd-46f8-80e2-c23131a206e4', 'DORM-RP09', 'หอพักราชพฤกษ์ 9', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('9ff86c66-0f69-420b-a931-1de8f0654ac5', 'f4d963cf-b5dd-46f8-80e2-c23131a206e4', '957f22e1-5e9e-4677-b84e-9a0903969348', 'จรรยา เจียนรัมย์', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

-- อาคาร: POOL - สระว่ายน้ำ (ราชภัฏชลาธาร)
INSERT INTO "Building" ("id", "code", "name", "floors", "description", "isActive", "createdAt", "updatedAt")
VALUES ('b30a43b3-99c4-408b-955f-3614c0de1148', 'POOL', 'สระว่ายน้ำ (ราชภัฏชลาธาร)', 1, 'คณะกรรมการอาคารสถานกีฬาตามคำสั่งแต่งตั้งของมหาวิทยาลัย', true, NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "floors" = EXCLUDED."floors",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

INSERT INTO "BuildingStaff" ("id", "buildingId", "userId", "staffName", "isPrimary", "createdAt")
VALUES ('976098cf-2463-4b2f-b649-3c09defbca2f', 'b30a43b3-99c4-408b-955f-3614c0de1148', NULL, 'นายวรุฒิพงษ์ สิริวัฒนธีรกุล', true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "staffName" = EXCLUDED."staffName";

COMMIT;
