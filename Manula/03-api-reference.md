# บทที่ 3: ข้อมูลจำเพาะระบบแม่ข่ายและ API (Server & API Reference)

ระบบฝั่ง Server พัฒนาด้วย Nitro Engine ภายใต้กรอบการทำงานของ Nuxt 4 โดยใช้ `h3` Handler API ทุกเส้นทางมี Prefix อยู่ภายใต้ `/api/*`

---

## 1. การยืนยันตัวตนและการจัดการสิทธิ์ (Auth & SSO)

### `POST /api/auth/login`
- **คำอธิบาย**: ยืนยันตัวตนผู้ใช้งาน รองรับทั้งบัญชี Local Admin และ BRU SSO API
- **Request Body**:
  ```json
  {
    "userlogin": "admin",
    "password": "your-password"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "user": {
      "id": "u1",
      "userlogin": "admin",
      "fullName": "ผู้ดูแลระบบ อาคารสถานที่",
      "role": "ADMIN",
      "positionName": "ผู้ดูแลระบบ"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```

### `GET /api/sso/search?q={keyword}`
- **คำอธิบาย**: ค้นหาข้อมูลบุคลากรของมหาวิทยาลัยราชภัฏบุรีรัมย์ผ่าน BRU SSO API แบบ Live Search
- **Query Params**:
  - `q`: คำค้นหา เช่น ชื่อ, นามสกุล หรือ Userlogin
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "data": [
      {
        "userlogin": "chartwut.k",
        "fullName": "นายชาติวุฒิ ...",
        "departmentName": "สำนักวิทยบริการและเทคโนโลยีสารสนเทศ",
        "email": "chartwut@bru.ac.th"
      }
    ]
  }
  ```

---

## 2. การจัดการรอบการประเมิน (Evaluation Rounds)

| Method | Endpoint | คำอธิบาย |
| :--- | :--- | :--- |
| `GET` | `/api/rounds` | ดึงรายการรอบการประเมินทั้งหมด เรียงตามปีงบประมาณ |
| `POST` | `/api/rounds` | สร้างรอบการประเมินใหม่ (ต้องระบุ `name`, `year`, `startDate`, `endDate`) |
| `PUT` | `/api/rounds/[id]` | แก้ไขข้อมูลรอบ เช่น ปรับสถานะเป็น `OPEN` หรือ `CLOSED` |
| `DELETE` | `/api/rounds/[id]` | ลบรอบการประเมินออกจากระบบ |

---

## 3. การจัดการอาคารและแม่บ้านประจำอาคาร (Buildings & Staffs)

### `GET /api/buildings`
- **คำอธิบาย**: ดึงข้อมูลอาคารทั้งหมด พร้อมข้อมูลผู้รับผิดชอบประจำอาคาร (แม่บ้าน)
- **Response**:
  ```json
  {
    "ok": true,
    "data": [
      {
        "id": "bldg-uuid-1",
        "code": "B15",
        "name": "อาคาร 15 เฉลิมพระเกียรติ",
        "floors": 4,
        "description": "อาคารเรียนรวมและสำนักงาน",
        "isActive": true,
        "staffs": [
          {
            "id": "staff-uuid-1",
            "staffName": "นางปราณี ขยันยิ่ง",
            "phone": "081-xxxxxxx",
            "isPrimary": true
          }
        ]
      }
    ]
  }
  ```

### `POST /api/buildings`
- **คำอธิบาย**: เพิ่มอาคารใหม่เข้าสู่ระบบ พร้อมระบุแม่บ้านในอาคาร

### `PUT /api/buildings/[id]`
- **คำอธิบาย**: อัปเดตข้อมูลอาคารและปรับปรุงรายชื่อแม่บ้านประจำอาคาร

### `DELETE /api/buildings/[id]`
- **คำอธิบาย**: ลบอาคารหรือปรับสถานะเป็น `isActive = false`

### `GET /api/buildings/staff-pool`
- **คำอธิบาย**: ดึงรายชื่อแม่บ้านทั้งหมดในมหาวิทยาลัย เพื่อนำไปใช้เป็นตัวเลือกประเมินแบบรายบุคคล

---

## 4. การจัดการข้อคำถามการตรวจประเมิน (Questions)

| Method | Endpoint | คำอธิบาย |
| :--- | :--- | :--- |
| `GET` | `/api/questions` | ดึงรายการหมวดหมู่ 7 หมวด พร้อมข้อคำถามทั้ง 35 ข้อ |
| `POST` | `/api/questions` | เพิ่มข้อคำถามใหม่ในหมวดที่กำหนด |
| `PUT` | `/api/questions/[id]` | แก้ไขหัวข้อคำถาม หรือปรับเปลี่ยนลำดับข้อ |
| `DELETE` | `/api/questions/[id]` | ลบข้อคำถาม |

---

## 5. การบันทึกและดึงผลการตรวจประเมิน (Assessments)

### `GET /api/assessments?roundId={roundId}&buildingId={buildingId}`
- **คำอธิบาย**: ดึงประวัติผลการประเมินตามรอบหรืออาคาร

### `POST /api/assessments`
- **คำอธิบาย**: บันทึกผลการตรวจประเมินใหม่
- **Request Body Payload**:
  ```json
  {
    "roundId": "round-2570",
    "buildingId": "bldg-uuid-1",
    "staffId": null,
    "responsibleStaffText": "นางปราณี ขยันยิ่ง",
    "assessorId": "user-uuid-1",
    "totalScoreObtained": 165.0,
    "totalMaxScore": 175.0,
    "percentage": 94.28,
    "grade": "EXCELLENT",
    "strengthsSummary": "โถงทางเดินและห้องน้ำสะอาดเรียบร้อยมาก",
    "urgentProblems": "กระจกหน้าต่างชั้น 3 มีคราบน้ำฝนสะสม",
    "correctivePlan": "นัดหมายเช็ดทำความสะอาดภายในสัปดาห์หน้า",
    "signatureImage": "data:image/png;base64,iVBORw0KGgo...",
    "scores": [
      {
        "questionItemId": 1,
        "score": 5,
        "isNA": false,
        "defectNote": ""
      },
      {
        "questionItemId": 14,
        "score": null,
        "isNA": true,
        "defectNote": "ไม่มีห้องน้ำในจุดตรวจนี้"
      }
    ]
  }
  ```

---

## 6. รายงานเชิงวิเคราะห์และการส่งออก (Reports & Analytics)

### `GET /api/reports/summary?roundId={roundId}`
- **คำอธิบาย**: ประมวลผลคะแนนเฉลี่ยระดับข้อคำถาม (Item-Level Consensus Average) ของกรรมการทุกคนในรอบนั้น
- **ข้อมูลที่ส่งกลับ**:
  - `buildingsSummary`: คะแนนเฉลี่ย, ร้อยละ, เกรด, จำนวนกรรมการที่ตรวจ, และจุดบกพร่องของแต่ละอาคาร
  - `categoriesSummary`: คะแนนเฉลี่ยแยกตามหมวด 1 ถึง 7
  - `urgentHotspots`: รายการจุดบกพร่องเร่งด่วนสะสมที่ตรวจพบ
  - `trendComparison`: เปรียบเทียบผลกับรอบก่อนหน้า (คะแนนเปลี่ยนแปลง +/- %)

### `GET /api/reports/export-excel?roundId={roundId}&type={type}`
- **คำอธิบาย**: ดาวน์โหลดรายงานในรูปแบบไฟล์ Excel Spreadsheet (`.csv` พร้อม UTF-8 BOM รองรับภาษาไทยบน Microsoft Excel ทุกรุ่น)
- **Parameters**:
  - `roundId`: รหัสรอบที่ต้องการส่งออก
  - `type`: `building` (รายงานสรุปตามอาคาร) หรือ `staff` (รายงานสรุปตามรายบุคคล)

---

## 7. การตั้งค่าระบบ (Settings)

### `GET /api/settings/color-criteria`
- **คำอธิบาย**: ดึงเกณฑ์คะแนนเฉลี่ยและข้อความตัดเกรด (ช่วงคะแนนสีเขียว สีเหลือง และสีแดง)

### `PUT /api/settings/color-criteria`
- **คำอธิบาย**: บันทึกการปรับเปลี่ยนช่วงคะแนนของฝ่ายบริหาร บันทึกลงในตาราง `SystemSetting`
