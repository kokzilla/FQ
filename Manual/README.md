# คู่มือนักพัฒนา (Developer Documentation)
### ระบบประเมินผลการปฏิบัติงานบุคลากรประจำอาคาร (แม่บ้าน)
**มหาวิทยาลัยราชภัฏบุรีรัมย์ (BRU Building Facility Evaluation System)**

ยินดีต้อนรับสู่เอกสารคู่มือสำหรับนักพัฒนาซอฟต์แวร์ (Developer Guide) รวบรวมโครงสร้างสถาปัตยกรรมระบบ โครงสร้างฐานข้อมูล ข้อมูลจำเพาะ API รายละเอียดคอมโพเนนต์ส่วนติดต่อผู้ใช้ และคู่มือการติดตั้งเพื่อการพัฒนาและนำขึ้นใช้งานจริง

---

## 📚 สารบัญเอกสาร (Table of Contents)

1. [บทที่ 1: ภาพรวมสถาปัตยกรรมและเทคโนโลยี (Architecture & Tech Stack)](./01-architecture-and-tech-stack.md)
   - ภาพรวมของระบบ (System Overview)
   - สแต็กเทคโนโลยี (Technology Stack)
   - โครงสร้างไดเรกทอรีโครงการ (Project Directory Structure)
   - วงจรการทำงานและกระบวนการหลัก (Core Workflows)

2. [บทที่ 2: โครงสร้างฐานข้อมูลและการจัดการ Schema (Database & Prisma ORM)](./02-database-and-schema.md)
   - แบบจำลอง Entity-Relationship (ER Diagram)
   - รายละเอียด Data Models ทั้งหมด
   - คำสั่งจัดการฐานข้อมูล Prisma (Generate, Push, Seed, Migrate)
   - การปรับจูนประสิทธิภาพ Connection Pool และ Caching

3. [บทที่ 3: ข้อมูลจำเพาะระบบแม่ข่ายและ API (Server & API Reference)](./03-api-reference.md)
   - สรุป Endpoint ทั้งหมดในระบบ
   - การยืนยันตัวตนและการเชื่อมต่อ BRU SSO
   - API การจัดการรอบ, อาคาร, ข้อคำถาม และการตรวจประเมิน
   - API การออกรายงานและการส่งออกไฟล์ Excel/CSV

4. [บทที่ 4: ส่วนติดต่อผู้ใช้และคอมโพเนนต์ (Frontend & Components)](./04-frontend-and-components.md)
   - การทำงานของแต่ละหน้าจอ (Pages)
   - คอมโพเนนต์ที่นำกลับมาใช้ซ้ำ (Reusable UI Components)
   - การจัดการสถานะและการบันทึกแบบร่างออฟไลน์ (Offline Draft Autosave)
   - Route Middleware และระบบรักษาความปลอดภัยฝั่งไคลเอนต์

5. [บทที่ 5: การติดตั้ง การตั้งค่า และการนำขึ้นระบบจริง (Setup & Deployment)](./05-setup-and-deployment.md)
   - ตัวแปรสภาพแวดล้อม (Environment Variables - `.env`)
   - ขั้นตอนการติดตั้งและเริ่มพัฒนาในเครื่อง (Local Setup)
   - การจัดการ PostgreSQL Service บน Windows
   - การ Build สำหรับ Production และการ Deploy
   - การแก้ไขปัญหาที่พบบ่อย (Troubleshooting)

---

## 📌 ข้อมูลสรุปโครงการโดยย่อ (Quick Reference)

| รายการ | รายละเอียด |
| :--- | :--- |
| **ชื่อโครงการ** | BRU Facility Evaluation (FQ) |
| **กรอบการทำงาน** | Nuxt 4 (Vue 3 + Nitro Engine) |
| **ภาษา** | TypeScript, Node.js (>= 22) |
| **ฐานข้อมูล** | PostgreSQL 18 (ผ่าน Prisma ORM) |
| **สไตล์ลิ่ง** | Tailwind CSS + Lucide Icons |
| **ระบบเข้าสู่ระบบ** | BRU SSO REST API + Local Admin Fallback |
| **พอร์ตเริ่มต้น** | `3000` (Dev Server), `5432` (PostgreSQL) |
