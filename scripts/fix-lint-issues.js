#!/usr/bin/env node

/**
 * Script to automatically fix common lint issues in the codebase
 * 
 * This script:
 * 1. Runs eslint --fix to fix auto-fixable issues
 * 2. Adds eslint-disable comments for necessary console logs in scripts
 * 3. Runs prettier to format the code
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

console.log(`${colors.blue}Starting lint fix script...${colors.reset}`);

// Step 1: Run eslint --fix to fix auto-fixable issues
try {
  console.log(`${colors.blue}Running eslint --fix...${colors.reset}`);
  execSync('npm run lint:fix', { stdio: 'inherit', cwd: rootDir });
  console.log(`${colors.green}Eslint fix completed successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Error running eslint --fix:${colors.reset}`, error);
}

// Step 2: Add eslint-disable comments for necessary console logs in scripts
const scriptFiles = [
  'scripts/migrate-jest-to-vitest.js',
  'scripts/update-cloudflare-vars.js',
];

scriptFiles.forEach(filePath => {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`${colors.blue}Adding eslint-disable comments to ${filePath}...${colors.reset}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Add file-level eslint-disable for console
    if (!content.includes('eslint-disable no-console')) {
      content = `/* eslint-disable no-console */\n${content}`;
      fs.writeFileSync(fullPath, content);
    }
  }
});

// Step 3: Run prettier to format the code
try {
  console.log(`${colors.blue}Running prettier...${colors.reset}`);
  execSync('npm run format', { stdio: 'inherit', cwd: rootDir });
  console.log(`${colors.green}Prettier formatting completed successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Error running prettier:${colors.reset}`, error);
}

console.log(`${colors.green}Lint fix script completed${colors.reset}`);
