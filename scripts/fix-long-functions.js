#!/usr/bin/env node

/**
 * Script to identify long functions that need refactoring
 * 
 * This script:
 * 1. Identifies functions that exceed the maximum allowed lines
 * 2. Generates a report with suggestions for refactoring
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

console.log(`${colors.blue}Starting long function analysis script...${colors.reset}`);

// Get list of files with long functions
const getFilesWithLongFunctions = () => {
  try {
    const result = execSync(
      'grep -r "has too many lines" --include="*.ts" --include="*.tsx" .eslintrc.json || true',
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
    console.error(`${colors.red}Error finding files with long functions:${colors.reset}`, error);
    return [];
  }
};

// Analyze long functions in a file
const analyzeLongFunctions = (filePath) => {
  try {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}File not found: ${filePath}${colors.reset}`);
      return null;
    }
    
    console.log(`${colors.blue}Analyzing long functions in ${filePath}...${colors.reset}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Find function declarations
    const functionRegex = /(?:function|const)\s+([A-Za-z0-9_]+)\s*(?:=\s*(?:async\s*)?\([^)]*\)|[^(]*\([^)]*\))\s*(?:=>|{)/g;
    let match;
    const functions = [];
    
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1];
      const startIndex = match.index;
      
      // Find the end of the function
      let braceCount = 1;
      let endIndex = content.indexOf('{', startIndex);
      
      if (endIndex === -1) {
        // Arrow function with implicit return
        endIndex = content.indexOf('=>', startIndex);
        if (endIndex === -1) {continue;}
        
        endIndex = content.indexOf('\n', endIndex);
        if (endIndex === -1) {continue;}
      } else {
        // Function with braces
        for (let i = endIndex + 1; i < content.length; i++) {
          if (content[i] === '{') {braceCount++;}
          if (content[i] === '}') {braceCount--;}
          
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
      
      const functionBody = content.substring(startIndex, endIndex + 1);
      const lineCount = functionBody.split('\n').length;
      
      if (lineCount > 50) {
        functions.push({
          name: functionName,
          lineCount,
          body: functionBody,
        });
      }
    }
    
    return {
      filePath,
      functions,
    };
  } catch (error) {
    console.error(`${colors.red}Error analyzing long functions in ${filePath}:${colors.reset}`, error);
    return null;
  }
};

// Generate refactoring suggestions
const generateRefactoringSuggestions = (analysisResults) => {
  const suggestions = [];
  
  for (const result of analysisResults) {
    if (!result) {continue;}
    
    for (const func of result.functions) {
      // Analyze the function body to identify potential extractions
      const blocks = identifyExtractableBlocks(func.body);
      
      suggestions.push({
        filePath: result.filePath,
        functionName: func.name,
        lineCount: func.lineCount,
        extractableBlocks: blocks,
      });
    }
  }
  
  return suggestions;
};

// Identify extractable blocks in a function
const identifyExtractableBlocks = (functionBody) => {
  const blocks = [];
  
  // Look for comment blocks that might indicate logical sections
  const commentBlockRegex = /\/\*\*?\s*\n\s*\*\s*([^\n]+)[\s\S]*?\*\//g;
  let match;
  
  while ((match = commentBlockRegex.exec(functionBody)) !== null) {
    blocks.push({
      description: match[1].trim(),
      type: 'comment block',
    });
  }
  
  // Look for if/else blocks
  const ifBlockRegex = /if\s*\([^)]+\)\s*{[\s\S]*?}/g;
  while ((match = ifBlockRegex.exec(functionBody)) !== null) {
    blocks.push({
      description: 'Conditional logic block',
      type: 'if block',
    });
  }
  
  // Look for loops
  const loopRegex = /(?:for|while)\s*\([^)]+\)\s*{[\s\S]*?}/g;
  while ((match = loopRegex.exec(functionBody)) !== null) {
    blocks.push({
      description: 'Loop block',
      type: 'loop',
    });
  }
  
  // Look for try/catch blocks
  const tryCatchRegex = /try\s*{[\s\S]*?}\s*catch[\s\S]*?}/g;
  while ((match = tryCatchRegex.exec(functionBody)) !== null) {
    blocks.push({
      description: 'Error handling block',
      type: 'try/catch',
    });
  }
  
  return blocks;
};

// Write refactoring report
const writeRefactoringReport = (suggestions) => {
  const reportPath = path.join(rootDir, 'refactoring-report.md');
  
  let report = '# Function Refactoring Report\n\n';
  report += 'This report identifies functions that exceed the maximum allowed lines (50) and provides suggestions for refactoring.\n\n';
  
  for (const suggestion of suggestions) {
    report += `## ${suggestion.filePath}\n\n`;
    report += `### Function: ${suggestion.functionName}\n\n`;
    report += `- Line count: ${suggestion.lineCount}\n`;
    report += `- Exceeds maximum by: ${suggestion.lineCount - 50} lines\n\n`;
    
    if (suggestion.extractableBlocks.length > 0) {
      report += '#### Potential Extractions:\n\n';
      
      for (const block of suggestion.extractableBlocks) {
        report += `- ${block.description} (${block.type})\n`;
      }
      
      report += '\n';
    }
    
    report += '#### Refactoring Suggestions:\n\n';
    report += '1. Extract logical blocks into separate functions\n';
    report += '2. Consider using helper functions for repetitive code\n';
    report += '3. Use composition to break down complex logic\n\n';
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`${colors.green}Refactoring report written to ${reportPath}${colors.reset}`);
};

// Main function
const main = () => {
  // Analyze long functions
  const files = getFilesWithLongFunctions();
  const analysisResults = files.map(analyzeLongFunctions).filter(Boolean);
  
  // Generate refactoring suggestions
  const suggestions = generateRefactoringSuggestions(analysisResults);
  
  // Write refactoring report
  writeRefactoringReport(suggestions);
  
  console.log(`${colors.green}Long function analysis completed${colors.reset}`);
};

main();
