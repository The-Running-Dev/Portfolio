$appDir = '.'

Write-Host "🔨 Phase 1: Preparing Template..." -ForegroundColor Cyan

& docker run `
    --rm `
    -v ./:/workspace `
    -it ghcr.io/the-running-dev/build-agent:latest `
    node-template-build `
        -WorkingDir '.' `
        -AppDir $appDir `
        -PackageManager 'pnpm' `
        -SkipInstall:$true `
        -IsProduction:$false

. (Join-Path $PSScriptRoot 'template-build.ps1') -AppDir $appDir