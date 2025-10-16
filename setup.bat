@echo off
REM ShopMateAI - Quick Setup Script for Windows PowerShell

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║            ShopMateAI - UAT & Development Setup                   ║
echo ║                   Local Development (Port 2589)                   ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found. Please install from https://nodejs.org/
    exit /b 1
)
echo ✓ Node.js found

docker --version >nul 2>&1
if errorlevel 1 (
    echo ⚠ Docker not found. Please install from https://www.docker.com/
    echo   Or run: choco install docker-desktop
) else (
    echo ✓ Docker found
)

echo.
echo [2/5] Setting up Backend...
cd server
call npm install
if errorlevel 1 (
    echo ✗ Backend setup failed
    exit /b 1
)
echo ✓ Backend dependencies installed
cd ..

echo.
echo [3/5] Setting up Frontend...
cd client
call npm install
if errorlevel 1 (
    echo ✗ Frontend setup failed
    exit /b 1
)
echo ✓ Frontend dependencies installed
cd ..

echo.
echo [4/5] Setting up Git...
git remote -v | findstr origin >nul
if errorlevel 1 (
    echo Setting up Git repository...
    git init
    git remote add origin https://github.com/LuxusEle/ShopmateAI.git
    echo ✓ Git repository configured
) else (
    echo ✓ Git repository already configured
)

echo.
echo [5/5] Verifying configuration...
if exist "client\.env.local" (
    echo ✓ Frontend environment configured
) else (
    echo ⚠ Frontend .env.local not found
)

if exist "server\.env" (
    echo ✓ Backend environment configured
) else (
    echo ⚠ Backend .env not found
)

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                    Setup Complete! ✓                              ║
echo ║                                                                    ║
echo ║  To start development, run these commands in separate terminals:  ║
echo ║                                                                    ║
echo ║  Terminal 1 (MongoDB):                                            ║
echo ║    docker-compose up -d                                           ║
echo ║                                                                    ║
echo ║  Terminal 2 (Backend):                                            ║
echo ║    cd server                                                      ║
echo ║    npm run dev                                                    ║
echo ║    (Runs on http://localhost:5000)                                ║
echo ║                                                                    ║
echo ║  Terminal 3 (Frontend):                                           ║
echo ║    cd client                                                      ║
echo ║    npm start                                                      ║
echo ║    (Runs on http://localhost:2589)                                ║
echo ║                                                                    ║
echo ║  Test the application at: http://localhost:2589                   ║
echo ║                                                                    ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.
