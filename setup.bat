@echo off
echo ============================================
echo FitTrack Setup Script (Windows)
echo ============================================
echo.

REM Check Node.js
echo [36mChecking Node.js...[0m
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [31mNode.js not found. Please install Node.js 18+ first.[0m
    exit /b 1
)
node --version
echo [32mNode.js found[0m
echo.

REM Check PostgreSQL
echo [36mChecking PostgreSQL...[0m
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [31mPostgreSQL not found. Please install PostgreSQL 14+[0m
    exit /b 1
)
echo [32mPostgreSQL found[0m
echo.

REM Setup Backend
echo [36mSetting up Backend...[0m
cd backend

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo [32m.env created. Please edit with your credentials.[0m
) else (
    echo [32m.env already exists[0m
)

echo Installing backend dependencies...
call npm install

echo.
echo [36mCreating database...[0m
createdb fittrack 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [32mDatabase created[0m
) else (
    echo [32mDatabase already exists[0m
)

echo.
cd ..

REM Setup Mobile
echo [36mSetting up Mobile App...[0m
cd mobile

echo Installing mobile dependencies...
call npm install

echo [32mMobile setup complete[0m
echo.
cd ..

REM Final Instructions
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Configure backend\.env with your credentials
echo    - Database credentials
echo    - JWT secrets
echo    - OpenAI API key
echo.
echo 2. Start the backend:
echo    cd backend
echo    npm run start:dev
echo.
echo 3. In a new terminal, start the mobile app:
echo    cd mobile
echo    npm start
echo.
echo 4. Press 'i' for iOS simulator or 'a' for Android emulator
echo.
echo Documentation:
echo    - README.md - Project overview
echo    - API_DOCUMENTATION.md - API endpoints
echo    - DEVELOPMENT.md - Development guide
echo.
echo Happy coding!
pause
