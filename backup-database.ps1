# PostgreSQL Backup Script with Standard INSERT statements & No-Owner (Universal Compatibility)
$pgBin = "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"
$dbHost = "127.0.0.1"
$dbPort = "5432"
$dbName = "bru_facility_evaluation"
$dbUser = "postgres"
$dbPass = "postgres"

$env:PGPASSWORD = $dbPass

$sqlFile = "d:\Project\FQ\backup_bru_facility_evaluation.sql"
$dumpFile = "d:\Project\FQ\backup_bru_facility_evaluation.dump"

Write-Host "Creating Universal Standard INSERT SQL backup ($sqlFile)..."
& $pgBin -h $dbHost -p $dbPort -U $dbUser -d $dbName --inserts --clean --if-exists --no-owner --no-privileges -f $sqlFile

# Remove PostgreSQL 17/18 specific syntax that breaks older PostgreSQL versions
$content = Get-Content -Path $sqlFile -Encoding UTF8
$content = $content -replace '^\\restrict', '-- \restrict'
$content = $content -replace '^\\unrestrict', '-- \unrestrict'
$content = $content -replace '^SET transaction_timeout', '-- SET transaction_timeout'
$content | Set-Content -Path $sqlFile -Encoding UTF8

Write-Host "Creating Custom format backup for pgAdmin Restore Dialog ($dumpFile)..."
& $pgBin -h $dbHost -p $dbPort -U $dbUser -d $dbName -F c --no-owner --no-privileges -f $dumpFile

Write-Host "All backups generated successfully without hardcoded Owner!"
