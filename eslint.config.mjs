import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
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
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": typescriptPlugin,
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
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/consistent-type-definitions": "warn",
    }
  }
];

export default eslintConfig;
