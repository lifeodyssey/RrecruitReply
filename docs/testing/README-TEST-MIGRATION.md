# Jest to Vitest Migration Guide

This document provides specific instructions for completing the migration from Jest to Vitest in the recruit-reply project.

## Migration Status

We have started to migrate our test suite from Jest to Vitest. The following components have been updated:

- Basic Vitest configuration in `vitest.config.ts`
- Simplified test setup in `vitest.setup.ts`
- A migration script to update Jest syntax to Vitest (run with `npm run test:migrate`)
- Package.json scripts have been updated to use Vitest
- Some tests have been migrated to work with Vitest

## Remaining Tasks

To complete the migration, follow these steps:

1. **Run the migration script** to update Jest syntax in all test files:

```bash
npm run test:migrate
```

2. **Fix any failing tests** by examining the test output and updating tests as needed.
   - Pay special attention to mocks and spies, they may need manual fixing
   - Verify localStorage mocks are properly initialized in each test
   - Replace any remaining `jest` references with Vitest equivalents

3. **Update MSW integration** by creating proper handlers for Vitest:
   - Check `src/test/mocks/server.ts` for MSW setup
   - Ensure handlers are properly configured for Vitest

4. **Test Coverage Reports**:
   - Verify coverage reports work as expected with Vitest
   - Update CI configuration to use Vitest for coverage reports

5. **Remove Jest Configuration** when all tests are passing:
   - `jest.config.js`
   - `jest.setup.ts`
   - Any Jest-specific Babel configuration

## Common Issues and Solutions

### Mock Function Errors

If you encounter errors like `TypeError: Cannot assign to read only property 'mockImplementation'`, use this approach:

```typescript
// Before
global.fetch = vi.fn().mockImplementation(() => {...});

// After - inside a test
global.fetch = vi.fn(() => {...});

// Or - reset before mocking
const originalFetch = global.fetch;
beforeEach(() => {
  global.fetch = vi.fn(() => {...});
});
afterEach(() => {
  global.fetch = originalFetch;
});
```

### Mock Storage

For localStorage mocks, define them within each test for better isolation:

```typescript
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  mockLocalStorage.clear();
});
```

### Using Matchers

Ensure you import and extend custom matchers properly:

```typescript
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
```

## Reference Files

Refer to these files for examples of successful migration:

- `src/hooks/__tests__/useTurnstileVerification.test.tsx` - Example of a migrated test
- `vitest.setup.ts` - Simplified test setup
- `vitest.config.ts` - Configuration for Vitest

## Troubleshooting

If you encounter any issues:

1. Check the Vitest documentation: https://vitest.dev/guide/
2. Look for specific error messages in test output
3. Try running a single test file to isolate issues
4. Remember that Vitest has different globals and syntax than Jest in some cases 