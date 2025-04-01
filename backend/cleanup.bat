@echo off
REM Windows cleanup script for production preparation

echo Starting cleanup process...

REM Remove test files
echo Removing test files...
if exist .env.test del /f .env.test
if exist src\tests rmdir /s /q src\tests
if exist jest.config.js del /f jest.config.js

REM Remove development files
echo Removing development files...
if exist .env.example del /f .env.example
if exist .github rmdir /s /q .github

REM Remove Docker files if not needed in production
echo Removing Docker files...
if exist docker-compose.yml del /f docker-compose.yml
if exist Dockerfile del /f Dockerfile

REM Remove unnecessary scripts
echo Removing unnecessary scripts...
if exist deploy.sh del /f deploy.sh

REM Clean up node_modules (optional)
echo Do you want to clean up node_modules? (y/n)
set /p clean_modules=""
if /i "%clean_modules%"=="y" (
    echo Cleaning node_modules...
    if exist node_modules rmdir /s /q node_modules
    echo Installing production dependencies only...
    call npm install --omit=dev
) else (
    echo Skipping node_modules cleanup.
)

REM Clean build files
echo Cleaning build files...
if exist dist rmdir /s /q dist

REM Build for production
echo Building for production...
call npm run build

echo Creating logs directory...
mkdir logs 2>nul
mkdir data 2>nul

echo Cleanup completed successfully!
echo Your backend is now ready for production.
echo To start the server, run: .\start-production.bat 