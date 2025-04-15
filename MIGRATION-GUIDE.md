# Jest to Vitest Migration Guide

This document outlines the steps taken to migrate our test suite from Jest to Vitest, along with tips for handling common issues.

## Overview

We've migrated our test suite from Jest to Vitest for the following benefits:

- Vitest offers improved performance and a better developer experience
- Native ESM support (no more CommonJS issues)
- Compatible with our Vite build system
- Better watch mode and parallel test execution
- Minimal configuration changes required

## Migration Steps

### 1. Run the Automated Migration Script

```bash
pnpm test:migrate
# or
npm run test:migrate
```

This script will automatically update Jest syntax to Vitest in all test files:
- Replaces `jest.fn()` with `vi.fn()`
- Updates import statements
- Converts mock implementations
- Handles timer mocks
- Updates test runners (`test()` to `it()`)

### 2. Manual Adjustments

After running the script, you may need to manually fix some issues:

#### Type Imports

Replace Jest types with Vitest equivalents:

```typescript
// Before
import type { Mock } from 'jest';

// After
import type { Mock } from 'vitest';
```

#### Using Spies

```typescript
// Before
const spy = jest.spyOn(object, 'method');

// After
const spy = vi.spyOn(object, 'method');
```

#### Timer Mocks

```typescript
// Before
jest.useFakeTimers();
jest.advanceTimersByTime(1000);

// After
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
```

#### Snapshots

Snapshots should work the same way, but you may need to regenerate them:

```bash
pnpm test -- -u
# or
npm run test -- -u
```

### 3. Running Tests

Test commands remain the same but now use Vitest under the hood:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Run in watch mode
pnpm test:coverage  # Generate coverage report
```

## Common Issues and Solutions

### MSW Integration

If you're using MSW (Mock Service Worker) for API mocking, Vitest requires a different setup. Our configuration now properly handles this.

### Jest DOM Matchers

We're still using `@testing-library/jest-dom` for DOM matchers. These are now properly extended in the Vitest setup file.

### Test Timeouts

If you previously used `jest.setTimeout()`, this has been replaced with:

```typescript
beforeAll(() => {
  vi.setConfig({ testTimeout: 10000 });
});
```

### Global Setup

The global setup is now handled in `vitest.setup.ts`, which imports common testing utilities and sets up mocks.

## Configuration Files

- `vitest.config.ts` - Main Vitest configuration
- `vitest.setup.ts` - Global test setup (combining previous Jest setup)

## Cleanup

Once all tests are passing with Vitest, we can remove the following files:

- `jest.config.js`
- `jest.setup.ts`
- `babel.config.test.js` (if it was only used for Jest)

## References

- [Vitest Documentation](https://vitest.dev/)
- [Migration from Jest](https://vitest.dev/guide/migration.html) 