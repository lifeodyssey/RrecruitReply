import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import'; // Added import plugin
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Handle project references for TypeScript
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const restrictedImports = {
  // Add any restricted imports here
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "public/**",
      "dist/**",
      "build/**",
      "babel.config.test.js",
      "jest.config.js",
      "postcss.config.js",
      "tailwind.config.js",
      "src/__tests__/mocks/fileMock.js", // Keep specific ignore from original flat config
    ],
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": typescriptPlugin,
      "import": importPlugin, // Added import plugin
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn", // Changed from off to warn to encourage explicit return types
      "@typescript-eslint/consistent-type-definitions": "warn",
      // Added from .eslintrc.json
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-require-imports": "off", // Will be overridden for jest.setup.ts
      "import/no-anonymous-default-export": "off",
      // Additional clean code rules
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          "selector": "interface",
          "format": ["PascalCase"],
          "custom": {
            "regex": "^I[A-Z]",
            "match": false
          }
        },
        {
          "selector": "typeAlias",
          "format": ["PascalCase"]
        },
        {
          "selector": "class",
          "format": ["PascalCase"]
        },
        {
          "selector": "function",
          "format": ["camelCase"]
        }
      ],
      "@typescript-eslint/explicit-member-accessibility": ["warn", { "accessibility": "explicit" }],
      "@typescript-eslint/member-ordering": "warn",
      // Import plugin rules (existing)
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          "newlines-between": "always",
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
      ],
      "import/no-unresolved": "off", // Handled by TypeScript
      "import/no-duplicates": "warn",
      "import/newline-after-import": "warn",
    },
  },
  // Override for Jest setup file to allow require
  {
    files: ["jest.setup.ts"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  // Override for test files (from .eslintrc.json)
  {
    files: [
      "**/__tests__/**/*",
      "**/__mocks__/**/*",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];

export default eslintConfig;
