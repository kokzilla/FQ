# บทที่ 5: การติดตั้ง การตั้งค่า และการนำขึ้นระบบจริง (Setup & Deployment)

## 1. ข้อกำหนดขั้นต่ำของระบบ (System Prerequisites)

- **Node.js**: เวอร์ชั่น `>= 22.0.0` (แนะนำ LTS หรือ Node 22+)
- **Package Manager**: `pnpm` (หรือ `npm` / `yarn`)
- **Database**: PostgreSQL 14+ (บนเครื่องพัฒนาใช้ PostgreSQL 18)
- **ระบบปฏิบัติการ**: Windows 10/11, Ubuntu 22.04 LTS หรือ Linux Distributions อื่นๆ

---

## 2. ตัวแปรสภาพแวดล้อม (Environment Variables - `.env`)

สร้างหรือแก้ไขไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจกต์:

```env
# 1. การเชื่อมต่อฐานข้อมูล PostgreSQL (แนะนำระบุเป็น 127.0.0.1 เพื่อความเร็วบน Windows)
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/bru_facility_evaluation?schema=public"

# 2. การเชื่อมต่อ BRU SSO Web Service
BRU_SSO_BASE_URL="https://sso.bru.ac.th"
BRU_SSO_API_KEY="bru_kEatpSnddyH_Ylxjj7qocHw6Vw1_ilWqI9kjYYndpOU"

# 3. รหัสลับสำหรับสร้าง Session และ Token
JWT_SECRET="bru-facility-evaluation-secret-key-2026"
```

---

## 3. ขั้นตอนการติดตั้งและเริ่มต้นพัฒนา (Local Development Setup)

1. **Clone โครงการและติดตั้งโมดูล:**
   ```powershell
   git clone <repository_url>
   cd FQ
   pnpm install
   ```

2. **เปิดใช้งานฐานข้อมูล PostgreSQL:**
   - **กรณีใช้งานบน Windows:** สามารถดับเบิลคลิกไฟล์ [Start-PostgreSQL.bat](file:///C:/Users/Chartwut/Desktop/Start-PostgreSQL.bat) บน Desktop ได้ทันที สคริปต์จะเริ่มบริการ `postgresql-x64-18` ให้โดยอัตโนมัติ
   - หรือเปิด PowerShell (Run as Administrator) แล้วสั่ง:
     ```powershell
     Start-Service postgresql-x64-18
     ```

3. **เตรียมฐานข้อมูลและ Schema:**
   ```powershell
   # อัปเดต Client ของ Prisma
   pnpm run db:generate

   # ซิงก์ Schema ตารางไปยัง PostgreSQL
   pnpm run db:push

   # ลงข้อมูลตั้งต้น (Categories, Questions, Sample Users, Settings)
   pnpm run db:seed
   ```

4. **รันเซิร์ฟเวอร์สำหรับการพัฒนา (Development Server):**
   ```powershell
   pnpm run dev
   ```
   เปิดเว็บเบราว์เซอร์ไปที่: `http://localhost:3000`

---

## 4. การ Build และ Deploy สำหรับใช้งานจริง (Production Deployment)

### 4.1 การ Build โครงการ
รันคำสั่งเพื่อสร้าง Production Artifacts ที่ปรับแต่งประสิทธิภาพสูงสุด:
```powershell
pnpm run build
```
เมื่อสร้างเสร็จ ระบบจะสร้างผลลัพธ์ไว้ในโฟลเดอร์ `.output/`:
- `.output/server/`: เซิร์ฟเวอร์ Node.js (Nitro Server)
- `.output/public/`: Static Assets ของฝั่ง Client

### 4.2 การรันเซิร์ฟเวอร์จริงผ่าน Node.js
```powershell
node .output/server/index.mjs
```
*(ค่าเริ่มต้นจะรันบนพอร์ต 3000 หรือสามารถกำหนดผ่านตัวแปร `PORT=8080 node .output/server/index.mjs`)*

### 4.3 การจัดการ Process ด้วย PM2 (แนะนำสำหรับ Production บน Linux/Windows Server)
1. ติดตั้ง PM2 ทั่วทั้งระบบ:
   ```bash
   npm install -g pm2
   ```
2. เริ่มต้นรันบริการ:
   ```bash
   pm2 start .output/server/index.mjs --name "bru-facility-evaluation" -i max
   pm2 save
   pm2 startup
   ```

### 4.4 การตั้งค่า Reverse Proxy ด้วย Nginx (ตัวอย่าง)
```nginx
server {
    listen 80;
    server_name facility-eval.bru.ac.th;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 5. การแก้ไขปัญหาที่พบบ่อย (Troubleshooting)

### ปัญหาที่ 1: หน้าเว็บหน่วงเวลา 4 วินาทีก่อนแสดงผล
- **สาเหตุ**: บริการ PostgreSQL บนเครื่องปิดอยู่ ทำให้ Node.js ค้างรอ Connection Timeout
- **วิธีแก้**: ตรวจสอบว่าบริการ PostgreSQL กำลังรันอยู่บนพอร์ต 5432 หรือดับเบิลคลิกไฟล์ `Start-PostgreSQL.bat` บน Desktop

### ปัญหาที่ 2: รัน `pnpm run db:generate` แล้วติด Error EPERM บน Windows
- **สาเหตุ**: กระบวนการ Node.js ของ `nuxt dev` หรือเซิร์ฟเวอร์ตัวอื่นกำลังเปิดค้างอยู่ และล็อกไฟล์ DLL `query_engine-windows.dll.node`
- **วิธีแก้**: ปิด Terminal ที่รัน `nuxt dev` อยู่ แล้วรัน `pnpm run db:generate` ใหม่อีกครั้ง จากนั้นจึงค่อยรัน `nuxt dev` ต่อ

### ปัญหาที่ 3: ภาษาไทยในไฟล์ Excel ที่ดาวน์โหลดมาแสดงผลเป็นภาษาต่างดาว
- **สาเหตุ**: โปรแกรม Microsoft Excel บน Windows บางเครื่องเปิดไฟล์ CSV โดยไม่อ่านค่า UTF-8 หากไม่มี BOM
- **วิธีแก้**: ระบบใน `server/api/reports/export-excel.get.ts` ได้ฝัง `\uFEFF` (UTF-8 BOM) ไว้ที่จุดเริ่มต้นของไฟล์แล้ว ทำให้สามารถดับเบิลคลิกเปิดบน Excel ได้ถูกต้องทันที
