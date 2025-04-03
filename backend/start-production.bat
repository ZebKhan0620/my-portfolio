@echo off
REM Start the backend server in production mode

echo Starting backend server in production mode...
echo.

REM Check if environment variables are set
if not exist .env (
    echo Error: .env file not found. Please create a .env file with your configuration.
    exit /b 1
)

REM Check if build exists
if not exist dist\server.js (
    echo Error: Build not found. Please run 'npm run prod:build' first.
    exit /b 1
)

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs
if not exist data mkdir data

REM Start the server in production mode
echo Starting server...
npm run prod:start

echo.
echo Server is running in production mode.
