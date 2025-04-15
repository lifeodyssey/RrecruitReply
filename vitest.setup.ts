import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add DOM matchers
expect.extend(matchers);

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});

// Setup simple jest compatibility
(global as Record<string, unknown>).jest = {
  fn: vi.fn,
  mock: vi.mock,
  spyOn: vi.spyOn,
  resetAllMocks: vi.resetAllMocks,
  clearAllMocks: vi.clearAllMocks,
};

// Basic web API mocks
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock window APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// DOM element mocks
Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
Element.prototype.scrollIntoView = vi.fn() as unknown as typeof Element.prototype.scrollIntoView;

// Mock fetch functionality for tests
// This will allow tests to mock fetch responses
interface IFetchMockHandler {
  (request: Request): Promise<Response>;
}

/**
 * Register a fetch mock for a specific URL and method
 * @param url The URL to mock
 * @param method The HTTP method to mock
 * @param handler A function that returns a Response
 * @returns A cleanup function to remove the mock
 */
(global as Record<string, unknown>).registerFetchMock = (url: string, method: string, handler: IFetchMockHandler): (() => void) => {
  // Store the original fetch
  const originalFetch = global.fetch;

  // Replace global fetch with our mocked version
  global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const requestMethod = init?.method || 'GET';

    // If the URL and method match, use the handler
    if (requestUrl.includes(url) && requestMethod === method) {
      // Ensure the URL is a valid URL by prefixing with base URL if needed
      const fullUrl = requestUrl.startsWith('http')
        ? requestUrl
        : `http://localhost:3000${requestUrl.startsWith('/') ? '' : '/'}${requestUrl}`;

      return handler(new Request(fullUrl, init));
    }

    // Otherwise, try to use the original fetch, but handle URL validation
    try {
      return originalFetch(input, init);
    } catch (error) {
      // If it's a URL validation error, try to fix the URL and retry
      if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        const inputUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        const fullUrl = inputUrl.startsWith('http')
          ? inputUrl
          : `http://localhost:3000${inputUrl.startsWith('/') ? '' : '/'}${inputUrl}`;

        return originalFetch(fullUrl, init);
      }
      throw error;
    }
  });

  // Return a cleanup function
  return () => {
    global.fetch = originalFetch;
  };
};

// Type definition is already in src/types/global.d.ts
