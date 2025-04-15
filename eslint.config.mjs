import { FlatCompat } from "@eslint/eslintrc";
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';
import vitestPlugin from 'eslint-plugin-vitest';
import { fileURLToPath } from "url";
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Handle project references for TypeScript
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

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
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      '@typescript-eslint/naming-convention': ['error', {
        'selector': 'interface',
        'format': ['PascalCase'],
        'prefix': ['I']
      }],
      '@typescript-eslint/consistent-type-imports': ['error', { 'prefer': 'type-imports' }],

      // Keep important TypeScript rules
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
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
      // Disabled rules from .eslintrc.js
      'max-lines-per-function': 'off',
      'max-classes-per-file': 'off',
      'complexity': 'off',
      'max-depth': 'off',
      'max-params': 'off',
      'no-duplicate-imports': 'off',
      'import/order': 'off',
      'no-console': 'off',
      'no-useless-constructor': 'off',

      // Keep other important clean code rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-expressions': 'error',
      'no-return-await': 'error',
      'no-useless-return': 'error',
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],

      // Sort imports but with relaxed rules
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
