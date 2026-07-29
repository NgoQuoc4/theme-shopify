# PowerShell Packaging Script for Shopify ThemeForest Zip Bundle

$themeName = "Horizon-Furniture-Japandi-v1.0.0"
$outputZip = "$PSScriptRoot\..\$themeName.zip"
$sourceDir = "$PSScriptRoot\.."

Write-Host "Creating ThemeForest release package: $themeName.zip ..." -ForegroundColor Green

if (Test-Path $outputZip) {
    Remove-Item $outputZip -Force
}

# Add System.IO.Compression.FileSystem assembly
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Create zip using Tar or System.IO.Compression
$tempDir = Join-Path $env:TEMP "theme_pack_build"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

$foldersToPack = @("assets", "blocks", "config", "layout", "locales", "sections", "snippets", "templates", "docs")
foreach ($folder in $foldersToPack) {
    $srcPath = Join-Path $sourceDir $folder
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $tempDir -Recurse -Force
    }
}
Copy-Item -Path "$sourceDir\README.txt" -Destination $tempDir -Force

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $outputZip)
Remove-Item $tempDir -Recurse -Force

Write-Host "SUCCESS! Zip package created cleanly at: $outputZip" -ForegroundColor Cyan
