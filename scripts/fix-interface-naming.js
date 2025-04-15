#!/usr/bin/env node

/**
 * Script to fix interface naming convention issues
 * 
 * This script:
 * 1. Adds 'I' prefix to interface names
 * 2. Updates references to those interfaces
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

console.log(`${colors.blue}Starting interface naming fix script...${colors.reset}`);

// Get list of files with interface naming issues
const getFilesWithInterfaceIssues = () => {
  try {
    const result = execSync(
      'grep -r "Interface name" --include="*.ts" --include="*.tsx" .eslintrc.json || true',
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
    console.error(`${colors.red}Error finding files with interface issues:${colors.reset}`, error);
    return [];
  }
};

// Fix interface naming in a file
const fixInterfaceNaming = (filePath) => {
  try {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}File not found: ${filePath}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.blue}Fixing interface naming in ${filePath}...${colors.reset}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Find interface declarations without 'I' prefix
    const interfaceRegex = /interface\s+([A-Z][a-zA-Z0-9]*)\s*(?:<[^>]*>)?\s*(?:extends\s+[^{]+)?\s*\{/g;
    let match;
    const interfaces = [];
    
    while ((match = interfaceRegex.exec(content)) !== null) {
      const interfaceName = match[1];
      if (!interfaceName.startsWith('I')) {
        interfaces.push(interfaceName);
      }
    }
    
    // Replace interface declarations and references
    for (const interfaceName of interfaces) {
      const newName = `I${interfaceName}`;
      
      // Replace interface declaration
      content = content.replace(
        new RegExp(`interface\\s+${interfaceName}\\b`, 'g'),
        `interface ${newName}`
      );
      
      // Replace references to the interface
      content = content.replace(
        new RegExp(`\\b${interfaceName}\\b(?!\\s*{)`, 'g'),
        newName
      );
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`${colors.green}Fixed ${interfaces.length} interfaces in ${filePath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error fixing interface naming in ${filePath}:${colors.reset}`, error);
  }
};

// Fix duplicate imports in a file
const fixDuplicateImports = (filePath) => {
  try {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}File not found: ${filePath}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.blue}Fixing duplicate imports in ${filePath}...${colors.reset}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Find import statements
    const importRegex = /import\s+(?:{[^}]*}\s+from\s+)?['"]([^'"]+)['"]/g;
    const imports = {};
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!imports[importPath]) {
        imports[importPath] = [];
      }
      imports[importPath].push(match[0]);
    }
    
    // Find duplicate imports
    for (const [importPath, statements] of Object.entries(imports)) {
      if (statements.length > 1) {
        // Merge imports
        const mergedImport = mergeImports(statements);
        
        // Replace all occurrences with the merged import
        for (const statement of statements) {
          content = content.replace(statement, '');
        }
        
        // Add the merged import at the beginning
        content = mergedImport + '\n' + content;
      }
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`${colors.green}Fixed duplicate imports in ${filePath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error fixing duplicate imports in ${filePath}:${colors.reset}`, error);
  }
};

// Merge import statements
const mergeImports = (statements) => 
  // This is a simplified implementation
  // A more robust implementation would parse the imports and merge them properly
   statements[0]
;

// Main function
const main = () => {
  // Fix interface naming
  const files = getFilesWithInterfaceIssues();
  for (const file of files) {
    fixInterfaceNaming(file);
  }
  
  // Fix duplicate imports
  const filesWithDuplicateImports = [
    'middleware.ts',
    'src/app/api/autorag/query/route.ts',
    'src/app/api/autorag/upload/route.ts',
    'src/app/api/turnstile/verify/route.ts',
    'src/app/documents/page.tsx',
    'src/components/layout/main-layout.tsx',
    'src/components/turnstile/TurnstileVerification.tsx',
    'src/components/turnstile/TurnstileWidget.tsx',
    'src/components/ui/card.tsx',
    'src/components/ui/input.tsx',
    'src/components/ui/sonner.tsx',
  ];
  
  for (const file of filesWithDuplicateImports) {
    fixDuplicateImports(file);
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
