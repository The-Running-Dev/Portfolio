#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Starts Docusaurus development server with optional Docker template setup.

.PARAMETER SkipTemplateSetup
    Skip Docker template setup and go directly to development server.

.EXAMPLE
    .\docs.ps1                      # Full setup with Docker
    .\docs.ps1 -SkipTemplateSetup   # Skip Docker, just start dev server
#>
param([switch]$SkipTemplateSetup)

# Suppress Docker warnings
$env:DOCKER_CLI_HINTS = "false"

# Find Docusaurus project - check for config file first, then common folders
$indicator = Get-ChildItem -Recurse | Where-Object {
    ($_.Name -match '^docusaurus\.config\.(ts|js)$') -or 
    ($_.PSIsContainer -and $_.Name -match '^(docs|documentation|docusaurus|sidebar)$')
} | Select-Object -First 1

if (-not $indicator) {
    Write-Host "❌ Docusaurus not Found" -ForegroundColor Red

    exit 1
}

# Calculate app directory (convert absolute to relative for Docker)
$appDir = if ($indicator.PSIsContainer) { $indicator.Name } else { 
    $dir = Split-Path $indicator.FullName -Parent
    if ($dir -eq (Get-Location)) { "." } else { [System.IO.Path]::GetRelativePath((Get-Location), $dir) }
}

Write-Host "Using Directory: $appDir" -ForegroundColor Cyan

# Phase 1: Optional Docker template setup
if (-not $SkipTemplateSetup) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Docker not Found. Use -SkipTemplateSetup to Bypass." -ForegroundColor Red
        
        exit 1
    }
    
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker not Running. Use -SkipTemplateSetup to Bypass." -ForegroundColor Red

        exit 1
    }

    Write-Host "🔨 Setting up Templates..." -ForegroundColor Cyan
    & docker run `
        --rm `
        -v ./:/workspace `
        -it ghcr.io/the-running-dev/build-agent:latest `
        node-template-build `
        -AppDir $appDir `
        -PackageManager pnpm `
        -SkipInstall -IsProduction:$false
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Template Setup Failed" -ForegroundColor Red
        
        exit $LASTEXITCODE
    }
}

# Phase 2: Start development server in new window
$appDirPath = if ([System.IO.Path]::IsPathRooted($appDir)) { $appDir } else { 
    Join-Path (Get-Location) $appDir -Resolve 
}

$devCommand = @"
Set-Location '$appDirPath'
Write-Host '📦 Installing Dependencies...' -ForegroundColor Yellow
pnpm install
Write-Host '⚙️ Running prebuild:prod...' -ForegroundColor Yellow  
pnpm run prebuild:prod
Write-Host '🌐 Starting Server at http://localhost:3000' -ForegroundColor Green
pnpm start
"@

Write-Host "🚀 Starting Development Server..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", $devCommand

Write-Host "✅ Server Starting in New Window: http://localhost:3000" -ForegroundColor Green