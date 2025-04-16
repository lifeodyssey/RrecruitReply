import { FlatCompat } from "@eslint/eslintrc";
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
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
  // Specific override for the nextauth route file
  {
    files: ['src/app/api/auth/[...nextauth]/route.ts'],
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
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
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      '@typescript-eslint/naming-convention': ['error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
          filter: {
            regex: '^I[A-Z]',
            match: true
          }
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          filter: {
            regex: '^I[A-Z]',
            match: false
          }
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
          filter: {
            regex: '^T[A-Z]',
            match: true
          }
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          filter: {
            regex: '^(ResponseResolver|ResponseTransformer|AnyHandler|Mock)$',
            match: true
          }
        }
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { 'prefer': 'type-imports' }],

      // Keep important TypeScript rules
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
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
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-duplicate-props': 'error',
    },
  },
  // Test file specific rules
  {
    files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      'vitest': vitestPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'vitest/expect-expect': 'error',
      'vitest/no-identical-title': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'max-classes-per-file': 'off',
      'max-lines-per-function': 'off',
      'import/order': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'no-duplicate-imports': 'off',
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  // Clean code and best practices
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: ['**/scripts/**', '**/__tests__/**'],
    rules: {
      // Disabled rules from .eslintrc.js
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-classes-per-file': ['error', 1],
      'complexity': ['error', 15],
      'max-depth': ['error', 4],
      'max-params': ['error', 4],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/jsx-pascal-case': ['error', { allowAllCaps: true }],
      'no-duplicate-imports': 'error',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
        'pathGroups': [
          {
            pattern: '@types',
            group: 'type',
            position: 'after'
          }
        ]
      }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-useless-constructor': 'warn',

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
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-multi-assign': 'error',
      'no-negated-condition': 'error',
      'no-useless-computed-key': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': ['error', { array: false, object: true }],
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'object-shorthand': 'error',

      // Additional code quality rules
      'no-constant-condition': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-unreachable': 'error',
      'default-case': 'error',
      'dot-notation': 'error',
      'guard-for-in': 'error',
      'no-caller': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error', 
      'no-param-reassign': 'error',
      'no-self-compare': 'error',
      'no-useless-concat': 'error',
      'require-await': 'error',
      'no-shadow': 'off', // Turn off in favor of typescript-eslint version
      '@typescript-eslint/no-shadow': 'error',

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
  // Script file exceptions
  {
    files: ['**/scripts/**/*.js'],
    rules: {
      'no-console': 'off',
      'max-depth': 'off', // Scripts can be complex
    }
  },
  // Document page exceptions
  {
    files: ['src/app/documents/page.tsx'],
    rules: {
      'max-lines-per-function': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    }
  },
  // Application layer exceptions
  {
    files: [
      'src/application/errors/application-errors.ts',
      'src/application/utils/api-error-handler.ts'
    ],
    rules: {
      'max-classes-per-file': 'off',
    }
  },
  // Auth and form exceptions
  {
    files: [
      'src/app/api/auth/[...nextauth]/route.ts',
      'src/features/auth/auth.ts',
      'src/lib/prisma.ts',
      'src/components/ui/form.tsx'
    ],
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'no-negated-condition': 'off'
    }
  },
  // Service exceptions
  {
    files: [
      'src/application/services/document-service.ts',
      'src/infrastructure/mocks/mock-document-repository.ts'
    ],
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off'
    }
  },
  // Test file exceptions (already covered by the specific test block)
];

export default eslintConfig;
