#!/usr/bin/env pwsh

# Exit immediately if a command exits with a non-zero status.
$ErrorActionPreference = 'Stop'

$env:NODE_OPTIONS="--max-old-space-size=2048"

# Configure Git
Write-Host "Configuring Git..."
git config --global user.name 'github-actions[bot]'
git config --global user.email 'github-actions[bot]@users.noreply.github.com'
git config --global --add safe.directory /__w/Portfolio/Portfolio

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