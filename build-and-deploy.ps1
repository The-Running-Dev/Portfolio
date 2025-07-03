#!/usr/bin/env pwsh

# Exit immediately if a command exits with a non-zero status.
$ErrorActionPreference = 'Stop'

$env:NODE_OPTIONS="--max-old-space-size=2048"

# Override origin URL with PAT
$repoUrl = "https://x-access-token:$($env:GITHUB_TOKEN)@github.com/The-Running-Dev/Portfolio.git"
$siteDirectory = (Join-Path $PSScriptRoot 'web')

Set-Location $siteDirectory

# Configure Git
Write-Host "Configuring Git..."
& git config --global user.name 'github-actions[bot]'
& git config --global user.email 'github-actions[bot]@users.noreply.github.com'
& git remote set-url origin $repoUrl

# Installing Dependencies
Write-Host "Installing Dependencies..."
& pnpm install

# Building the project
Write-Host "Building the Project..."
& pnpm run build

# Deploy to GitHub Pages
Write-Host "Deploying to GitHub Pages..."
& npx docusaurus deploy --skip-build