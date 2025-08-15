#!/usr/bin/env pwsh

Write-Host "🚀 Starting API..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env File Found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Please Edit .env with Your API Keys and Configuration." -ForegroundColor Green
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing Dependencies..." -ForegroundColor Blue
    
    & pnpm install
}

# Build the project
Write-Host "🔨 Building Project..." -ForegroundColor Blue
& pnpm run build

# Start the server
Write-Host "🎯 Starting Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 API Base URL: http://localhost:3001/api/v1" -ForegroundColor Cyan
Write-Host "📚 Documentation: http://localhost:3001/api-docs" -ForegroundColor Cyan
Write-Host "💚 Health Check: http://localhost:3001/api/v1/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available Resources:" -ForegroundColor Yellow
Write-Host "  • Users: http://localhost:3001/api/v1/users" -ForegroundColor White
Write-Host "  • Projects: http://localhost:3001/api/v1/projects" -ForegroundColor White
Write-Host "  • Skills: http://localhost:3001/api/v1/skills" -ForegroundColor White
Write-Host ""

& pnpm run dev