# Configuration Files Organization

This document explains how configuration files are organized in the Recruit-Reply project following clean code principles.

## Directory Structure

```
recruit-reply/
├── config/                      # Configuration files directory
│   ├── eslint/                  # ESLint configuration
│   │   └── eslint.config.mjs    # Main ESLint configuration
│   ├── jest/                    # Jest configuration
│   │   ├── jest.config.js       # Jest configuration
│   │   └── jest.setup.ts        # Jest setup file
│   ├── babel/                   # Babel configuration
│   │   └── babel.config.js      # Babel configuration for tests
│   ├── postcss/                 # PostCSS configuration
│   │   └── postcss.config.js    # PostCSS plugins configuration
│   ├── tailwind/                # Tailwind configuration
│   │   └── tailwind.config.js   # Tailwind CSS configuration
│   └── typescript/              # TypeScript configuration
│       └── tsconfig.base.json   # Base TypeScript configuration
```

## Root Configuration Files

The following configuration files remain in the root directory but reference the actual configurations in the `config` directory:

| Root File             | Description                                          |
|-----------------------|------------------------------------------------------|
| eslint.config.mjs     | References ./config/eslint/eslint.config.mjs         |
| jest.config.js        | References ./config/jest/jest.config.js              |
| babel.config.test.js  | References ./config/babel/babel.config.test.js       |
| postcss.config.js     | References ./config/postcss/postcss.config.js        |
| tailwind.config.js    | References ./config/tailwind/tailwind.config.js      |
| tsconfig.json         | Extends ./config/typescript/tsconfig.base.json       |
| next.config.ts        | Remains in root (required by Next.js)                |

## Environment Files

Environment files remain in the root directory as they are automatically loaded by Next.js:

| File           | Purpose                                      |
|----------------|----------------------------------------------|
| .env           | Default environment variables                |
| .env.local     | Local overrides (not committed to Git)       |
| .env.example   | Example environment file for documentation   |
| .env.production| Production environment variables             |

## Working with Configuration Files

### Editing Configurations

When you need to modify a configuration:

1. **Edit the file in the `config` directory**, not the reference file in the root.
2. For example, to modify ESLint rules, edit `config/eslint/eslint.config.mjs`.

### Adding New Configuration Files

When adding a new tool or configuration:

1. Create a new subdirectory in the `config` directory for the tool
2. Place the configuration file in that directory
3. Create a reference file in the root if required by the tool

Example for a hypothetical new tool:

```bash
# 1. Create directory
mkdir -p config/newtool

# 2. Add configuration file
touch config/newtool/newtool.config.js

# 3. Create reference in root if needed
echo "module.exports = require('./config/newtool/newtool.config.js');" > newtool.config.js
```

## Implementation

The configuration organization was implemented using a script:

```bash
# To organize configuration files
./scripts/organize-config.sh
```

## Troubleshooting

If you encounter issues with the configuration:

1. Check that reference files in the root directory are correctly pointing to the actual configuration files
2. Ensure that relative paths in configuration files are adjusted for the new location
3. Verify that package.json scripts are using the correct paths

If a specific tool cannot find its configuration:

1. Move the configuration file back to the root directory
2. Document the exception in this file 