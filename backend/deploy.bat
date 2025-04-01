@echo off
REM Windows deployment script for portfolio backend

echo Starting deployment process...

REM Create necessary directories
echo Creating log directories...
mkdir logs\pm2 2>nul

REM Install dependencies
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

REM Start the application with PM2
echo Starting the application...
REM Run PM2 with elevated permissions
powershell -Command "Start-Process pm2 -ArgumentList 'start ecosystem.config.js --env production' -Verb RunAs"

REM Wait for PM2 to start
timeout /t 3

REM Save PM2 process list
echo Saving PM2 process list...
powershell -Command "Start-Process pm2 -ArgumentList 'save' -Verb RunAs"

REM Display status
echo Checking application status...
powershell -Command "Start-Process pm2 -ArgumentList 'status' -Verb RunAs"

echo Deployment completed successfully!

echo Monitoring application logs...
echo Use 'pm2 logs' to view logs
echo Use 'pm2 monit' to monitor the application