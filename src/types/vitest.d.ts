// Type definitions for Vitest globals
import type { MockInstance } from 'vitest';

declare global {
  // Vitest Globals
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const test: typeof import('vitest').test;
  const expect: typeof import('vitest').expect;
  const vi: typeof import('vitest').vi;
  const beforeAll: typeof import('vitest').beforeAll;
  const afterAll: typeof import('vitest').afterAll;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;

  // Mock types
  interface Mock<T = unknown> extends MockInstance<T> {
    mockReturnValue: (value: T) => this;
    mockResolvedValue: <U>(value: U) => this;
    mockRejectedValue: (reason: Error) => this;
    mockImplementation: <U extends (...args: any[]) => any>(fn: U) => this;
    mock: {
      calls: any[][];
    };
  }

  // Add vitest property to import.meta
  interface ImportMeta {
    vitest?: boolean;
  }

  // Add vi.Mock type
  namespace vi {
    interface Mock<T = any> extends MockInstance<T> {}
  }
}

// Extend the Window interface for test mocks
declare global {
  interface Window {
    confirm: (message?: string) => boolean;
  }
}

export {};
