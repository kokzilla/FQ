$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
$backupDir = Join-Path $rootDir "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$targetZip = Join-Path $backupDir "deploy-fq.zip"

if (Test-Path $targetZip) {
    Remove-Item -Force $targetZip
}

$includeItems = @(
    "assets",
    "components",
    "middleware",
    "pages",
    "prisma",
    "public",
    "server",
    "shared",
    "app.vue",
    "nuxt.config.ts",
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "tailwind.config.ts",
    "tsconfig.json",
    "Dockerfile",
    "docker-compose.yml",
    ".dockerignore",
    ".env.example",
    "README.md"
)

$tempFolder = Join-Path $env:TEMP "deploy_fq_temp"
if (Test-Path $tempFolder) {
    Remove-Item -Recurse -Force $tempFolder
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Copying project source files..."
foreach ($item in $includeItems) {
    $srcPath = Join-Path $rootDir $item
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $tempFolder -Recurse -Force
    }
}

Write-Host "Compressing to deploy-fq.zip..."
Compress-Archive -Path "$tempFolder\*" -DestinationPath $targetZip -Force

Remove-Item -Recurse -Force $tempFolder

$zipInfo = Get-Item $targetZip
$sizeMb = [math]::Round($zipInfo.Length / 1MB, 2)
Write-Host "Successfully packaged: $targetZip ($sizeMb MB)"
