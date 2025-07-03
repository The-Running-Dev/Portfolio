#!/usr/bin/env pwsh

# Exit immediately if a command exits with a non-zero status.
$ErrorActionPreference = 'Stop'

$env:NODE_OPTIONS="--max-old-space-size=2048"

$siteDirectory = (Join-Path $PSScriptRoot 'web')

Set-Location $siteDirectory

try {
    # Installing Dependencies
    Write-Host "Installing Dependencies..."
    & pnpm install

    # Building the project
    Write-Host "Building the Project..."
    & pnpm run build

    # Deploy to GitHub Pages
    Write-Host "Deploying to GitHub Pages..."
    & npx docusaurus deploy --skip-build
} catch {
    Write-Error $_

    exit 1
}