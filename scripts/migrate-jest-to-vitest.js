#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * This script helps migrate Jest tests to Vitest syntax
 * Usage: node scripts/migrate-jest-to-vitest.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Define replacements to apply to test files
const replacements = [
  // Import statements
  {
    pattern: /import (.*) from ['"]@testing-library\/jest-dom['"]/g,
    replacement: 'import $1 from \'@testing-library/jest-dom\'\nimport { expect, afterEach, beforeEach, beforeAll, afterAll, describe, it, vi } from \'vitest\''
  },
  { pattern: /import (.*) from ['"]jest-dom['"]/g, replacement: 'import $1 from \'@testing-library/jest-dom\'' },

  // Jest function references
  { pattern: /jest\.fn/g, replacement: 'vi.fn' },
  { pattern: /jest\.mock/g, replacement: 'vi.mock' },
  { pattern: /jest\.spyOn/g, replacement: 'vi.spyOn' },
  { pattern: /jest\.resetAllMocks/g, replacement: 'vi.resetAllMocks' },
  { pattern: /jest\.clearAllMocks/g, replacement: 'vi.clearAllMocks' },
  { pattern: /jest\.useFakeTimers/g, replacement: 'vi.useFakeTimers' },
  { pattern: /jest\.useRealTimers/g, replacement: 'vi.useRealTimers' },
  { pattern: /jest\.advanceTimersByTime/g, replacement: 'vi.advanceTimersByTime' },
  { pattern: /jest\.runAllTimers/g, replacement: 'vi.runAllTimers' },
  { pattern: /jest\.requireMock/g, replacement: 'vi.importMock' },
  { pattern: /jest\.requireActual/g, replacement: 'vi.importActual' },

  // Jest type references
  { pattern: /jest\.Mocked/g, replacement: 'MockInstance' },
  { pattern: /jest\.Mock/g, replacement: 'Mock' },

  // Function mocking
  { pattern: /\.mockImplementation/g, replacement: '.mockImplementation' },
  { pattern: /\.mockReturnValue/g, replacement: '.mockReturnValue' },
  { pattern: /\.mockResolvedValue/g, replacement: '.mockResolvedValue' },
  { pattern: /\.mockRejectedValue/g, replacement: '.mockRejectedValue' },

  // Test syntax
  { pattern: /test\(/g, replacement: 'it(' },
  { pattern: /it\.each/g, replacement: 'it.each' },
  { pattern: /test\.each/g, replacement: 'it.each' },
  { pattern: /describe\.each/g, replacement: 'describe.each' },
  { pattern: /it\.only/g, replacement: 'it.only' },
  { pattern: /test\.only/g, replacement: 'it.only' },
  { pattern: /describe\.only/g, replacement: 'describe.only' },
  { pattern: /it\.skip/g, replacement: 'it.skip' },
  { pattern: /test\.skip/g, replacement: 'it.skip' },
  { pattern: /describe\.skip/g, replacement: 'describe.skip' },

  // jest.setTimeout needs special handling
  { pattern: /jest\.setTimeout\((\d+)\)/g, replacement: '// Vitest equivalent of jest.setTimeout - use beforeAll instead\nbeforeAll(() => {\n  vi.setConfig({ testTimeout: $1 })\n})' },
];

async function processFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Apply replacements
    for (const { pattern, replacement } of replacements) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        modified = true;
        content = newContent;
      }
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✅ Updated: ${filePath}`);
      return 1;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

async function main() {
  try {
    // Find all test files
    const testFiles = await glob(`${rootDir}/src/**/*.{test,spec}.{js,jsx,ts,tsx}`);
    const testDirFiles = await glob(`${rootDir}/src/**/__tests__/**/*.{js,jsx,ts,tsx}`);
    const allFiles = [...new Set([...testFiles, ...testDirFiles])];

    console.log(`Found ${allFiles.length} test files to process...`);

    let updatedCount = 0;
    for (const file of allFiles) {
      updatedCount += await processFile(file);
    }

    console.log(`\nMigration complete! Updated ${updatedCount} of ${allFiles.length} files.`);
    console.log(`\nPlease review the changes and run your tests to ensure everything works correctly.`);
    console.log(`You may still need to manually update some specific Jest patterns that couldn't be automatically migrated.`);

  } catch (error) {
    console.error('Error during migration:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);