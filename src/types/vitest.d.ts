// Type definitions for Vitest globals
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MockInstance } from 'vitest';

declare global {
  // Vitest Globals
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const describe: typeof import('vitest').describe;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const it: typeof import('vitest').it;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const test: typeof import('vitest').test;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const expect: typeof import('vitest').expect;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const vi: typeof import('vitest').vi;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const beforeAll: typeof import('vitest').beforeAll;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const afterAll: typeof import('vitest').afterAll;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const beforeEach: typeof import('vitest').beforeEach;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const afterEach: typeof import('vitest').afterEach;

  // Mock types
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Mock<_T = unknown> = unknown;

  // Add vitest property to import.meta
  interface IImportMeta {
    vitest?: boolean;
  }

  // Mock server type
  interface IMockServer {
    listen: () => void;
    close: () => void;
    resetHandlers: () => void;
    use: (handler: unknown) => void;
  }

  // Add vi.Mock type
  namespace vi {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type Mock<_T = unknown> = unknown;
  }

  // Extend the Window interface for test mocks
  interface IWindow {
    confirm: (message?: string) => boolean;
  }
}

export {};
