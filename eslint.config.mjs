import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import'; // Added import plugin
import jestPlugin from 'eslint-plugin-jest'; // Added jest plugin
import vitestPlugin from 'eslint-plugin-vitest'; // Added vitest plugin
import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Handle project references for TypeScript
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const restrictedImports = {
  // Add any restricted imports here
};

const eslintConfig = [
  {
    // Define global ignores
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'coverage/**',
      'dist/**',
      '.github/**',
      '**/*.config.js',
      '**/*.config.mjs',
      'next-env.d.ts',
    ],
  },
  // Main eslint-config-next compatibility config
  ...compat.extends('next/core-web-vitals'),
  // TypeScript specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      // Strict TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  // React specific rules
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'react/prop-types': 'off', // TypeScript handles prop validation
      'react/require-default-props': 'off', // TypeScript handles default props
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/jsx-handler-names': [
        'warn',
        {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on',
        },
      ],
      'react/jsx-key': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/no-array-index-key': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Test file specific rules
  {
    files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      'jest': jestPlugin,
      'vitest': vitestPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'jest/valid-expect': 'error',
      'jest/expect-expect': 'error',
      'jest/no-identical-title': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-disabled-tests': process.env.CI ? 'error' : 'warn',
      // Use recommended rules from vitest plugin
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  // Clean code and best practices
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // SOLID principles related
      'max-classes-per-file': ['error', 1],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', 3],
      'complexity': ['warn', 8],
      
      // Clean code
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'no-return-await': 'error',
      'no-useless-return': 'error',
      'no-else-return': 'error',
      'no-useless-constructor': 'error',
      'no-empty-function': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      
      // Import organization
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
];

export default eslintConfig;
