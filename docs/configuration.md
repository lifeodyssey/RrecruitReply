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

## 配置文件合并记录

为了简化项目配置，我们合并了以下配置文件：

1. **ESLint 配置**
   - 合并 `.eslintrc.js` 和 `eslint.config.mjs`，保留了新的平面配置格式 `eslint.config.mjs`
   - 禁用了一些过于严格的规则，同时保留了重要的代码质量规则

2. **Vite/Vitest 配置**
   - 合并 `vitest.config.ts` 到 `vite.config.ts`
   - 添加了所有测试相关配置，包括 MSW 内联依赖和环境选项

3. **PostCSS 配置**
   - 合并 `postcss.config.js` 和 `postcss.config.cjs`，使用 ESM 格式 (`.js`)
   - 支持 Tailwind CSS 和 @tailwindcss/postcss 插件

4. **清理配置**
   - 移除了 Jest 和 Babel 配置，因为项目已迁移到 Vitest
   - 移除了自动生成的 `*.tsbuildinfo` 文件
   - 保留 `tsconfig.json` 和 `tsconfig.build.json` 用于不同的构建目标 