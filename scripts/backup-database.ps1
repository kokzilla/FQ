# PostgreSQL Backup Script with Standard INSERT statements & No-Owner (Universal Compatibility)
$pgBin = "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"
$dbHost = "127.0.0.1"
$dbPort = "5432"
$dbName = "bru_facility_evaluation"
$dbUser = "postgres"
$dbPass = "postgres"

$env:PGPASSWORD = $dbPass

$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
$backupDir = Join-Path $rootDir "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$sqlFile = Join-Path $backupDir "backup_bru_facility_evaluation.sql"
$dumpFile = Join-Path $backupDir "backup_bru_facility_evaluation.dump"

Write-Host "Creating Universal Standard INSERT SQL backup ($sqlFile)..."
& $pgBin -h $dbHost -p $dbPort -U $dbUser -d $dbName --inserts --clean --if-exists --no-owner --no-privileges -f $sqlFile

# Remove PostgreSQL 17/18 specific syntax that breaks older PostgreSQL versions
if (Test-Path $sqlFile) {
    $content = Get-Content -Path $sqlFile -Encoding UTF8
    $content = $content -replace '^\\restrict', '-- \restrict'
    $content = $content -replace '^\\unrestrict', '-- \unrestrict'
    $content = $content -replace '^SET transaction_timeout', '-- SET transaction_timeout'
    $content | Set-Content -Path $sqlFile -Encoding UTF8
}

Write-Host "Creating Custom format backup for pgAdmin Restore Dialog ($dumpFile)..."
& $pgBin -h $dbHost -p $dbPort -U $dbUser -d $dbName -F c --no-owner --no-privileges -f $dumpFile

Write-Host "All backups generated successfully in $backupDir without hardcoded Owner!"
