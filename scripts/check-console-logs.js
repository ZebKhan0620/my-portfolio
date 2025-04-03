/**
 * Pre-build script to check for console.log statements that might be left in the code.
 * This helps prevent console.log statements from being included in production builds.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to check
const directories = ['src'];

// Files to ignore (regex patterns)
const ignorePatterns = [
  /\.test\.[jt]sx?$/,                   // Test files
  /\.spec\.[jt]sx?$/,                   // Spec files
  /\/dev\//,                            // Development-only directories
  /\/scripts\//,                         // Scripts directory (including this file)
  /node_modules/,                       // node_modules
  /\.next\//                            // Next.js build directory
];

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Get list of files with console.log statements
try {
  console.log('Checking for console.log statements...');
  
  // Use grep or findstr based on platform
  const isWindows = process.platform === 'win32';
  const command = isWindows
    ? `findstr /s /i "console.log" "${directories.join('" "')}"\\*.js "${directories.join('" "')}"\\*.jsx "${directories.join('" "')}"\\*.ts "${directories.join('" "')}"\\*.tsx`
    : `grep -r "console.log" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" ${directories.join(' ')}`;
  
  // Execute the command and get results
  const results = execSync(command, { encoding: 'utf8' }).split('\n').filter(Boolean);
  
  // Filter out ignored patterns
  const filteredResults = results.filter(result => {
    return !ignorePatterns.some(pattern => pattern.test(result));
  });
  
  if (filteredResults.length > 0) {
    console.log('\n🔍 Found console.log statements in:');
    console.log('---------------------------------------');
    filteredResults.forEach(result => console.log(`- ${result.trim()}`));
    console.log('---------------------------------------');
    
    if (isProduction) {
      console.error('\n❌ Error: console.log statements should be removed in production!');
      console.log('Please remove these console.log statements before production build.');
      process.exit(1); // Exit with error in production
    } else {
      console.log('\n⚠️  Warning: console.log statements detected in code.');
      console.log('These should be removed before production deployment.');
    }
  } else {
    console.log('✅ No unexpected console.log statements found!');
  }
} catch (error) {
  // If grep/findstr doesn't find anything, it will exit with non-zero code
  if (error.status === 1 && !error.stdout && !error.stderr) {
    console.log('✅ No console.log statements found!');
  } else {
    console.error('Error checking for console.log statements:', error.message);
    // Don't fail the build for script errors
  }
} 