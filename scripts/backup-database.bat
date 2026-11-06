@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backup-database.ps1"
pause
