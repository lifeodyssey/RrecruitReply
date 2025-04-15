#!/usr/bin/env node

/**
 * Master script to run all lint fix scripts
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Starting master lint fix script...${colors.reset}`);

// Run a script
const runScript = (scriptName) => {
  try {
    console.log(`${colors.blue}Running ${scriptName}...${colors.reset}`);
    execSync(`node scripts/${scriptName}.js`, { stdio: 'inherit', cwd: rootDir });
    console.log(`${colors.green}${scriptName} completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error running ${scriptName}:${colors.reset}`, error);
    return false;
  }
};

// Run all scripts
const runAllScripts = () => {
  const scripts = [
    'fix-lint-issues',
    'fix-interface-naming',
    'fix-react-components',
    'fix-console-logs',
    'fix-long-functions',
  ];
  
  let success = true;
  
  for (const script of scripts) {
    const result = runScript(script);
    success = success && result;
  }
  
  return success;
};

// Run build to check if all issues are fixed
const runBuild = () => {
  try {
    console.log(`${colors.blue}Running build...${colors.reset}`);
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
    console.log(`${colors.green}Build completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error running build:${colors.reset}`, error);
    return false;
  }
};

// Main function
const main = () => {
  const scriptsSuccess = runAllScripts();
  
  if (scriptsSuccess) {
    console.log(`${colors.green}All lint fix scripts completed successfully${colors.reset}`);
    
    const buildSuccess = runBuild();
    
    if (buildSuccess) {
      console.log(`${colors.green}All lint and build issues fixed successfully${colors.reset}`);
    } else {
      console.log(`${colors.yellow}Lint issues fixed, but build still has errors${colors.reset}`);
    }
  } else {
    console.log(`${colors.yellow}Some lint fix scripts failed${colors.reset}`);
  }
};

main();
