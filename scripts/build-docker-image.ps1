$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
Set-Location $rootDir

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  BRU Facility Evaluation - Docker Build   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check if Docker CLI is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] ไม่พบคำสั่ง docker ในระบบ" -ForegroundColor Red
    Write-Host "กรุณาติดตั้ง Docker Desktop ก่อนดำเนินการ:" -ForegroundColor Yellow
    Write-Host "  1. ดาวน์โหลดและติดตั้ง: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Write-Host "     หรือติดตั้งผ่าน winget: winget install Docker.DockerDesktop" -ForegroundColor Yellow
    Write-Host "  2. เปิดโปรแกรม Docker Desktop ให้ขึ้นสถานะ Engine Running (สีเขียว)" -ForegroundColor Yellow
    exit 1
}

# 2. Check if Docker Daemon is running
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker Daemon ยังไม่ได้เปิดทำงาน (Engine not running)" -ForegroundColor Red
    Write-Host "กรุณาเปิดโปรแกรม Docker Desktop แล้วรอให้สถานะเป็น Engine Running ก่อนรันสคริปต์นี้" -ForegroundColor Yellow
    exit 1
}

$imageName = "bru-fq-app:latest"
$backupDir = Join-Path $rootDir "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}
$tarPath = Join-Path $backupDir "bru-fq-app.tar"

# 3. Build Docker Image
Write-Host "`n[1/2] กำลังทำการ Build Docker Image: $imageName ..." -ForegroundColor Green
docker build -t $imageName .

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] การ Build Image ไม่สำเร็จ กรุณาตรวจสอบข้อความ Error ด้านบน" -ForegroundColor Red
    exit $LASTEXITCODE
}

# 4. Save Docker Image to tar
Write-Host "`n[2/2] กำลัง Export Docker Image เป็นไฟล์ .tar ไปที่: $tarPath ..." -ForegroundColor Green
docker save -o $tarPath $imageName

if ($LASTEXITCODE -eq 0) {
    $fileInfo = Get-Item $tarPath
    $sizeMb = [math]::Round($fileInfo.Length / 1MB, 2)
    Write-Host "`n==========================================" -ForegroundColor Cyan
    Write-Host "  สร้างไฟล์ Image สำเร็จเรียบร้อย! 🎉" -ForegroundColor Green
    Write-Host "  ไฟล์: $tarPath" -ForegroundColor White
    Write-Host "  ขนาด: $sizeMb MB" -ForegroundColor White
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "`nสิ่งที่ต้องส่งขึ้น FTP เซิร์ฟเวอร์ให้ Admin:" -ForegroundColor Yellow
    Write-Host "  1. backups/bru-fq-app.tar"
    Write-Host "  2. docker-compose.yml"
    Write-Host "  3. .env (คอนฟิกฐานข้อมูล)"
} else {
    Write-Host "`n[ERROR] ไม่สามารถบันทึกไฟล์ tar ได้" -ForegroundColor Red
    exit $LASTEXITCODE
}
