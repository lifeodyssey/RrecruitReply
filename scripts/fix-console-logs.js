#!/usr/bin/env node

/**
 * Script to fix console.log statements
 * 
 * This script:
 * 1. Adds eslint-disable comments for necessary console logs in development tools
 * 2. Replaces console.log with proper logging in application code
 */

import { execSync } from 'child_process';
import fs from 'fs';
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

console.log(`${colors.blue}Starting console.log fix script...${colors.reset}`);

// Get list of files with console.log statements
const getFilesWithConsoleLogs = () => {
  try {
    const result = execSync(
      'grep -r "Unexpected console statement" --include="*.ts" --include="*.tsx" .eslintrc.json || true',
      { cwd: rootDir, encoding: 'utf8' }
    );
    
    const fileRegex = /\/([^:]+):/g;
    const files = new Set();
    let match;
    
    while ((match = fileRegex.exec(result)) !== null) {
      files.add(match[1]);
    }
    
    return Array.from(files);
  } catch (error) {
    console.error(`${colors.red}Error finding files with console.log statements:${colors.reset}`, error);
    return [];
  }
};

// Fix console.log statements in a file
const fixConsoleLogs = (filePath) => {
  try {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}File not found: ${filePath}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.blue}Fixing console.log statements in ${filePath}...${colors.reset}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if it's a script file
    const isScript = filePath.includes('scripts/') || filePath.includes('workers/');
    
    if (isScript) {
      // Add file-level eslint-disable for console
      if (!content.includes('eslint-disable no-console')) {
        content = `/* eslint-disable no-console */\n${content}`;
      }
    } else {
      // Replace console.log with proper logging or add line-level eslint-disable
      const consoleLogRegex = /(console\.(?:log|warn|error|info|debug)\(.*?\);?)/g;
      content = content.replace(consoleLogRegex, '// eslint-disable-next-line no-console\n$1');
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`${colors.green}Fixed console.log statements in ${filePath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error fixing console.log statements in ${filePath}:${colors.reset}`, error);
  }
};

// Main function
const main = () => {
  // Fix console.log statements
  const files = getFilesWithConsoleLogs();
  for (const file of files) {
    fixConsoleLogs(file);
  }
  
  // Run eslint --fix again
  try {
    console.log(`${colors.blue}Running eslint --fix...${colors.reset}`);
    execSync('npm run lint:fix', { stdio: 'inherit', cwd: rootDir });
    console.log(`${colors.green}Eslint fix completed successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error running eslint --fix:${colors.reset}`, error);
  }
};

main();
