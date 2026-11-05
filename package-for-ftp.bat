@echo off
chcp 65001 > nul
echo กำลังจัดเตรียมไฟล์ deploy-fq.zip สำหรับอัปโหลดขึ้น FTP...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0package-for-ftp.ps1"
pause
