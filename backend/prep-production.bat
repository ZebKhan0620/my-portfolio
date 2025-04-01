@echo off
REM Windows production preparation script for portfolio backend

echo Starting production preparation process...

REM Create necessary directories
echo Creating log directories...
mkdir logs 2>nul
mkdir logs\production 2>nul
mkdir data 2>nul

REM Clean up old builds
echo Cleaning up old builds...
if exist dist rmdir /s /q dist

REM Install sqlite3 if not already installed
echo Installing SQLite...
call npm install sqlite3

REM Install production dependencies only
echo Installing production dependencies...
call npm install --omit=dev

REM Build the application
echo Building the application...
call npm run build

REM Check if build was successful
if %ERRORLEVEL% NEQ 0 (
    echo Build failed. Please fix the errors and try again.
    exit /b %ERRORLEVEL%
)

REM Create a production .env file if it doesn't exist
if not exist .env.production (
    echo Creating sample .env.production file...
    (
        echo # Server Configuration
        echo PORT=3000
        echo NODE_ENV=production
        echo # Email Configuration
        echo SMTP_HOST=smtp.example.com
        echo SMTP_PORT=465
        echo SMTP_USER=your_email@example.com
        echo SMTP_PASS=your_password
        echo SMTP_FROM=your_email@example.com
        echo ADMIN_EMAIL=admin@yourdomain.com
        echo # Frontend URL for CORS
        echo FRONTEND_URL=http://localhost:3000
    ) > .env.production
    echo Please update the .env.production file with your actual values.
) else (
    echo .env.production file already exists.
)

echo Production preparation completed successfully!
echo To start the production server, use:
echo    node dist/server.js
echo Or you can use the start-production.bat script:
echo    .\start-production.bat 