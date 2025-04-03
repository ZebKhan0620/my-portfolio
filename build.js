const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define cross-platform command execution function
const runCommand = (command) => {
  try {
    execSync(command, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_DISABLE_ESLINT: '1',
        TS_NODE_PROJECT: 'tsconfig.vercel.json'
      },
      shell: process.platform === 'win32' ? 'powershell.exe' : '/bin/bash'
    });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`, error);
    return false;
  }
};

// Create a tsconfig.vercel.json that excludes the backend directory
const tsconfigPath = path.join(__dirname, 'tsconfig.json');
const tsconfigVercelPath = path.join(__dirname, 'tsconfig.vercel.json');

// Read the original tsconfig
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Add the backend directory to exclude
if (!tsconfig.exclude) {
  tsconfig.exclude = [];
}
tsconfig.exclude.push('backend/**/*');

// Write the modified tsconfig
fs.writeFileSync(tsconfigVercelPath, JSON.stringify(tsconfig, null, 2));

// Run the build with the modified tsconfig
try {
  console.log('Building Next.js app...');
  const buildSucceeded = runCommand('next build');
  
  if (!buildSucceeded) {
    throw new Error('Build command failed');
  }
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} finally {
  // Clean up the temporary tsconfig
  try {
    fs.unlinkSync(tsconfigVercelPath);
  } catch (error) {
    console.warn('Failed to clean up temporary tsconfig:', error);
  }
} 