# 📋 เอกสารส่งต่องาน (Handoff Document)
### โครงการ: ระบบประเมินผลการปฏิบัติงานบุคลากรประจำอาคาร (BRU Facility Evaluation)
**วันที่บันทึก:** 5 พฤศจิกายน 2569  
**โฟลเดอร์โปรเจกต์:** `d:\Project\FQ`

---

## 1. สรุปสถานะปัจจุบัน (Current Status)

| รายการ | สถานะ | รายละเอียด |
|---|:---:|---|
| **การแก้ไขข้อผิดพลาดโค้ด** |  **เสร็จสิ้น** | แก้ไข Syntax error ใน `server/api/reports/export-excel.get.ts` และทดสอบ `pnpm run build` ผ่านสมบูรณ์ 100% |
| **โครงสร้าง Docker** |  **เสร็จสิ้น** | จัดทำ `Dockerfile` (Multi-stage Node 20 Alpine), `docker-compose.yml`, `.dockerignore` เรียบร้อย |
| **แพ็กเกจ Source Code สำหรับ FTP** |  **เสร็จสิ้น** | ไฟล์ `deploy-fq.zip` (0.18 MB) สร้างเสร็จพร้อมใช้งาน (ไม่มี `node_modules` ปะปน) |
| **ฐานข้อมูล (Database)** |  **เสร็จสิ้น** | สร้างไฟล์สำรอง `backup_bru_facility_evaluation.sql` แบบ Universal Script (ตัด `OWNER` และ `transaction_timeout` ออกแล้ว รันบน pgAdmin ผ่านฉลุย) |
| **โจทย์ที่ต้องทำต่อที่บ้าน** | ⏳ **รอดำเนินการ** | **Admin แจ้งให้เราเป็นผู้ Build Docker Image แล้วส่งไฟล์อิมเมจ (.tar) ให้** |

---

## 2. ขั้นตอนการกลับไปทำต่อที่บ้าน (Step-by-Step at Home)

### ขั้นตอนที่ 1: ตรวจสอบ Docker บนเครื่องที่บ้าน
1. ตรวจสอบว่าเครื่องที่บ้านมี **Docker Desktop** หรือยัง
   * หากยังไม่มี ให้ดาวน์โหลดที่: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   * ติดตั้งและเปิดโปรแกรมให้ไอคอนมุมล่างขึ้นสถานะ **Engine Running** สีเขียว

### ขั้นตอนที่ 2: สั่ง Build Image ในเครื่องที่บ้าน
เปิด Terminal / PowerShell / Command Prompt แล้วเข้าไปที่โฟลเดอร์โปรเจกต์:
```bash
cd D:\Project\FQ
docker build -t bru-fq-app:latest .
```
*(ระบบจะทำการดาวน์โหลด Node 20 Alpine, ติดตั้ง Dependencies, รัน Prisma Generate และ Build Nuxt Production ให้จนเสร็จ)*

### ขั้นตอนที่ 3: Export Image เป็นไฟล์เดี่ยว (.tar)
พิมพ์คำสั่ง:
```bash
docker save -o bru-fq-app.tar bru-fq-app:latest
```
* คุณจะได้ไฟล์ **`bru-fq-app.tar`** (ขนาดประมาณ 200–300 MB) อยู่ในโฟลเดอร์โปรเจกต์

### ขั้นตอนที่ 4: อัปโหลดขึ้นเซิร์ฟเวอร์ผ่าน FileZilla
เปิด FileZilla เชื่อมต่อไปยัง FTP ของเซิร์ฟเวอร์ และอัปโหลดไฟล์เหล่านี้ขึ้นไป:
1. **`bru-fq-app.tar`** (ไฟล์ Image ที่เพิ่งสร้าง)
2. **`docker-compose.yml`**
3. **`.env`** (ไฟล์คอนฟิกที่ระบุ `DATABASE_URL` ของฐานข้อมูลเดิม)

---

## 3. ข้อความแจ้ง Admin เมื่ออัปโหลดไฟล์เสร็จ (ส่งให้ Admin รัน)

> *"เรียน Admin ครับ ผมได้ Build Docker Image และอัปโหลดไฟล์ขึ้น FTP เรียบร้อยแล้วครับ รบกวนช่วยสั่งรันระบบตามคำสั่งนี้ให้หน่อยครับ:*
>
> ```bash
> # 1. โหลด Image เข้าสู่ Docker
> docker load -i bru-fq-app.tar
>
> # 2. สั่งรัน Container ผ่าน Docker Compose
> docker compose up -d
>
> # 3. ซิงก์โครงสร้าง Prisma เข้ากับฐานข้อมูลเดิม
> docker compose exec app npx prisma db push
> ```
> *ขอบคุณมากครับ"*

---

## 4. ตำแหน่งไฟล์สำคัญที่เตรียมไว้ในโปรเจกต์ (`d:\Project\FQ`)

* 📦 **`deploy-fq.zip`** : แพ็กเกจ Source Code ครบชุด (0.18 MB)
* 🐳 **`Dockerfile`** : สคริปต์ Multi-stage Build สำหรับ Docker
* 📄 **`docker-compose.yml`** : การตั้งค่า Service Container และ Network
* ⚙️ **`.env.production.example`** : แม่แบบ Environment Variables
* 🗄️ **`backup_bru_facility_evaluation.sql`** : ข้อมูลสำรองฐานข้อมูล SQL ที่แก้ไขสมบูรณ์แล้ว
* ⚡ **`package-for-ftp.bat`** : สคริปต์ดับเบิลคลิกเพื่อแพ็กไฟล์ zip อัตโนมัติ
* ⚡ **`backup-database.bat`** : สคริปต์ดับเบิลคลิกสำรองฐานข้อมูลอัตโนมัติ
