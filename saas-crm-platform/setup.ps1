# ShopMateAI - Quick Start Guide for PowerShell

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║            ShopMateAI - Quick Start for Local Development          ║" -ForegroundColor Cyan
Write-Host "║                   Port Configuration: 2589                         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "[1/4] Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "✗ Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green

$dockerVersion = docker --version 2>$null
if ($null -eq $dockerVersion) {
    Write-Host "⚠ Docker not found (optional for remote MongoDB)" -ForegroundColor Yellow
} else {
    Write-Host "✓ Docker installed" -ForegroundColor Green
}

# Install dependencies
Write-Host ""
Write-Host "[2/4] Installing dependencies..." -ForegroundColor Yellow

Write-Host "  → Backend..." -ForegroundColor Gray
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend setup failed" -ForegroundColor Red
    exit 1
}
Write-Host "    ✓ Backend ready" -ForegroundColor Green
Set-Location ..

Write-Host "  → Frontend..." -ForegroundColor Gray
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend setup failed" -ForegroundColor Red
    exit 1
}
Write-Host "    ✓ Frontend ready" -ForegroundColor Green
Set-Location ..

# Configure Git
Write-Host ""
Write-Host "[3/4] Configuring Git..." -ForegroundColor Yellow

$remoteExists = git remote -v 2>$null | Select-String origin
if ($null -eq $remoteExists) {
    Write-Host "  Setting up remote..." -ForegroundColor Gray
    git init
    git remote add origin https://github.com/LuxusEle/ShopmateAI.git
    Write-Host "    ✓ Remote configured" -ForegroundColor Green
} else {
    Write-Host "    ✓ Remote already configured" -ForegroundColor Green
}

# Show next steps
Write-Host ""
Write-Host "[4/4] Environment Configuration..." -ForegroundColor Yellow

if (Test-Path "client\.env.local") {
    Write-Host "    ✓ Frontend .env configured" -ForegroundColor Green
} else {
    Write-Host "    ⚠ Frontend .env.local needs configuration" -ForegroundColor Yellow
}

if (Test-Path "server\.env") {
    Write-Host "    ✓ Backend .env configured" -ForegroundColor Green
} else {
    Write-Host "    ⚠ Backend .env needs configuration" -ForegroundColor Yellow
}

# Display final instructions
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    🎉 Setup Complete!                             ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  START LOCAL DEVELOPMENT (3 terminals):                           ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  Terminal 1 - Database:                                           ║" -ForegroundColor Green
Write-Host "║    docker-compose up -d                                           ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  Terminal 2 - Backend (API):                                      ║" -ForegroundColor Green
Write-Host "║    cd server                                                      ║" -ForegroundColor Green
Write-Host "║    npm run dev                                                    ║" -ForegroundColor Green
Write-Host "║    # Runs on http://localhost:5000                                ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  Terminal 3 - Frontend (UI):                                      ║" -ForegroundColor Green
Write-Host "║    cd client                                                      ║" -ForegroundColor Green
Write-Host "║    npm start                                                      ║" -ForegroundColor Green
Write-Host "║    # Runs on http://localhost:2589                                ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  THEN VISIT: http://localhost:2589                                ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  🔗 Register Account → Login → Dashboard                          ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📖 For more info, see:" -ForegroundColor Cyan
Write-Host "   • UAT_DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host "   • QUICK_START_MVP.md" -ForegroundColor Gray
Write-Host "   • README.md" -ForegroundColor Gray
Write-Host ""
