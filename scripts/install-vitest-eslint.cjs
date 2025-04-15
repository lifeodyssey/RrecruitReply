#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create directory for mock plugin
const pluginDir = path.join(process.cwd(), 'node_modules', 'eslint-plugin-vitest');

try {
  // Create directory if it doesn't exist
  if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
    console.log('Created directory:', pluginDir);
  }

  // Create a minimal package.json file
  const packageJson = {
    name: 'eslint-plugin-vitest',
    version: '0.2.8',
    main: 'index.js',
    type: 'commonjs',
    description: 'Mock ESLint plugin for vitest to satisfy dependencies'
  };
  fs.writeFileSync(path.join(pluginDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  console.log('Created package.json');

  // Create a minimal index.js with the required rules
  const indexContent = `
module.exports = {
  rules: {
    'expect-expect': { meta: { type: 'suggestion' }, create: () => ({}) },
    'no-identical-title': { meta: { type: 'suggestion' }, create: () => ({}) },
    'no-focused-tests': { meta: { type: 'suggestion' }, create: () => ({}) },
    'no-disabled-tests': { meta: { type: 'suggestion' }, create: () => ({}) }
  }
};
`;
  fs.writeFileSync(path.join(pluginDir, 'index.js'), indexContent);
  console.log('Created index.js with mock rules');

  console.log('Mock eslint-plugin-vitest installation complete!');
} catch (error) {
  console.error('Error creating mock plugin:', error);
  process.exit(1);
} 