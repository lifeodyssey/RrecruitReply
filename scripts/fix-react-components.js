#!/usr/bin/env node

/**
 * Script to fix React component definition issues
 * 
 * This script:
 * 1. Converts function components to arrow functions
 * 2. Adds explicit return types to functions
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

console.log(`${colors.blue}Starting React component fix script...${colors.reset}`);

// Get list of files with React component definition issues
const getFilesWithComponentIssues = () => {
  try {
    const result = execSync(
      'grep -r "Function component is not an arrow function" --include="*.tsx" .eslintrc.json || true',
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
    console.error(`${colors.red}Error finding files with component issues:${colors.reset}`, error);
    return [];
  }
};

// Fix React component definitions in a file
const fixComponentDefinitions = (filePath) => {
  try {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}File not found: ${filePath}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.blue}Fixing component definitions in ${filePath}...${colors.reset}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Find function component declarations
    const functionComponentRegex = /export\s+(?:default\s+)?function\s+([A-Z][a-zA-Z0-9]*)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*{/g;
    let match;
    
    while ((match = functionComponentRegex.exec(content)) !== null) {
      const componentName = match[1];
      const params = match[2];
      const returnType = match[3] ? match[3].trim() : 'React.ReactElement';
      
      // Create the arrow function version
      const arrowFunction = `export const ${componentName} = (${params}): ${returnType} => {`;
      
      // Replace the function declaration
      content = content.replace(match[0], arrowFunction);
      
      // Find the end of the function and add export default if needed
      if (match[0].includes('export default')) {
        // Find the closing brace of the function
        const closingBraceRegex = new RegExp(`}\\s*$`);
        content = content.replace(closingBraceRegex, '};\n\nexport default ' + componentName + ';');
      } else {
        // Just add a semicolon
        const closingBraceRegex = new RegExp(`}(?=\\s*$|\\s*\\/\\*|\\s*\\/\\/|\\s*\\n)`);
        content = content.replace(closingBraceRegex, '};');
      }
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`${colors.green}Fixed component definitions in ${filePath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error fixing component definitions in ${filePath}:${colors.reset}`, error);
  }
};

// Add explicit return types to functions
const addExplicitReturnTypes = (filePath) => {
  try {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}File not found: ${filePath}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.blue}Adding explicit return types in ${filePath}...${colors.reset}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Find arrow functions without return types
    const arrowFunctionRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*(\([^)]*\))\s*=>/g;
    let match;
    
    while ((match = arrowFunctionRegex.exec(content)) !== null) {
      const functionName = match[1];
      const params = match[2];
      
      // Skip if it already has a return type
      if (content.substring(match.index, match.index + match[0].length + 20).includes(':')) {
        continue;
      }
      
      // Add return type based on the function name
      let returnType = 'void';
      if (functionName.startsWith('handle')) {
        returnType = 'void';
      } else if (functionName.includes('Page')) {
        returnType = 'React.ReactElement';
      } else if (functionName.includes('Component')) {
        returnType = 'React.ReactElement';
      }
      
      // Replace the arrow function declaration
      const newDeclaration = `const ${functionName} = ${params}: ${returnType} =>`;
      content = content.replace(match[0], newDeclaration);
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`${colors.green}Added explicit return types in ${filePath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error adding explicit return types in ${filePath}:${colors.reset}`, error);
  }
};

// Main function
const main = () => {
  // Fix component definitions
  const files = getFilesWithComponentIssues();
  for (const file of files) {
    fixComponentDefinitions(file);
  }
  
  // Add explicit return types to functions in specific files
  const filesNeedingReturnTypes = [
    'src/components/ConfigDisplay.tsx',
    'src/components/layout/mode-toggle.tsx',
  ];
  
  for (const file of filesNeedingReturnTypes) {
    addExplicitReturnTypes(file);
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
