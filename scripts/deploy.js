/**
 * Custom deployment script for handling build-related issues
 * This script helps bypass local build errors and lets Vercel handle the build process
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if Vercel CLI is installed
exec('vercel -v', (error) => {
  if (error) {
    console.error('❌ Vercel CLI is not installed. Please install it with:');
    console.error('npm i -g vercel');
    process.exit(1);
  }
  
  console.log('✅ Vercel CLI is installed');
  
  // Ensure vercel.json exists
  const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
  if (!fs.existsSync(vercelJsonPath)) {
    console.error('❌ vercel.json not found. Please create this file first.');
    process.exit(1);
  }
  
  console.log('✅ vercel.json file found');
  
  // Execute deployment
  console.log('🚀 Deploying to Vercel...');
  
  const deployCmd = 'vercel --prod';
  const childProcess = exec(deployCmd, { cwd: path.join(__dirname, '..') });
  
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  
  childProcess.on('exit', (code) => {
    if (code === 0) {
      console.log('✅ Deployment successful!');
    } else {
      console.error(`❌ Deployment failed with code ${code}`);
    }
  });
}); 