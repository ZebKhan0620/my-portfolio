@echo off
REM Windows script to start the application in production mode

echo Starting application in production mode...

REM Copy production env file if it exists
if exist .env.production (
    echo Using production environment variables...
    copy .env.production .env /Y > nul
) else (
    echo Warning: .env.production file not found!
    echo Creating a basic .env file...
    (
        echo NODE_ENV=production
        echo PORT=3001
    ) > .env
)

REM Check if build exists
if not exist dist\server.js (
    echo Error: Build not found. Please run prep-production.bat first.
    exit /b 1
)

REM Start the application
echo Starting server...
set PORT=3001
node dist/server.js

REM This line will be reached only if the server crashes
echo Server stopped. 