# Configuration Files Organization Plan

## Current Issue
The root directory is cluttered with numerous configuration files, making the codebase appear messy and difficult to navigate.

## Configuration Files to Organize
- eslint.config.mjs
- jest.config.js
- babel.config.test.js
- postcss.config.js
- tailwind.config.js
- next.config.ts
- tsconfig.json
- components.json
- Various .env files

## Solution

### 1. Create a Dedicated Config Directory
Move most configuration files to a `config` directory to clean up the root.

```
recruit-reply/
├── config/               # Configuration files directory
│   ├── eslint/           # ESLint configuration
│   │   └── eslint.config.mjs
│   ├── jest/             # Jest configuration
│   │   ├── jest.config.js
│   │   └── jest.setup.ts
│   ├── babel/            # Babel configuration
│   │   └── babel.config.js
│   ├── postcss/          # PostCSS configuration
│   │   └── postcss.config.js
│   ├── tailwind/         # Tailwind configuration
│   │   └── tailwind.config.js
│   └── typescript/       # TypeScript configuration
│       └── tsconfig.base.json
```

### 2. Root Configuration Files
Some configuration files must remain in the root for proper framework functionality, but use reference files:

```
recruit-reply/
├── next.config.js        # Next.js config (must stay in root)
├── tsconfig.json         # References config/typescript/tsconfig.base.json
├── .env.example          # Example environment variables
├── .env                  # Environment variables (gitignored)
├── .env.local            # Local environment overrides (gitignored)
├── .env.production       # Production environment variables
```

### 3. Package.json Script Updates
Update scripts in package.json to reference the new configuration file locations:

```json
{
  "scripts": {
    "lint": "eslint --config ./config/eslint/eslint.config.mjs .",
    "test": "jest --config ./config/jest/jest.config.js",
    "build": "next build",
    ...
  }
}
```

### 4. Implementation Steps

1. Create the config directory structure
2. Move configuration files to their respective subdirectories
3. Create reference files in the root where necessary
4. Update paths in configuration files to account for new locations
5. Update package.json scripts
6. Test all commands to ensure they work with the new structure
7. Update documentation to reflect the new organization

### 5. Benefits

- Cleaner root directory
- Better organization of configuration files by purpose
- Easier to find and modify specific configurations
- More maintainable in the long term
- Follows separation of concerns principle 