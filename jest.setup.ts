// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder and other web APIs
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Polyfill for Request/Response
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(url, init) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers || {});
      this.body = init?.body || null;
    }
  };
}

if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || '';
      this.headers = new Headers(init?.headers || {});
      this._bodyInit = body;
    }

    json() {
      return Promise.resolve(JSON.parse(this._bodyInit));
    }

    text() {
      return Promise.resolve(this._bodyInit);
    }
  };
}

if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this._headers = {};
      if (init) {
        Object.keys(init).forEach(key => {
          this._headers[key.toLowerCase()] = init[key];
        });
      }
    }

    append(name, value) {
      this._headers[name.toLowerCase()] = value;
    }

    get(name) {
      return this._headers[name.toLowerCase()] || null;
    }
  };
}

// Polyfill for fetch
if (typeof fetch === 'undefined') {
  // Create a map to store custom handlers for specific URLs
  const customHandlers = new Map();

  // Function to register a custom handler
  global.registerFetchMock = (urlPattern, method, responseFactory) => {
    const key = `${method}:${urlPattern}`;
    customHandlers.set(key, responseFactory);
    return () => customHandlers.delete(key); // Return a cleanup function
  };

  // The actual fetch mock
  global.fetch = (url, init) => {
    const method = init?.method || 'GET';

    // Check if there's a custom handler for this URL
    for (const [key, handler] of customHandlers.entries()) {
      const [handlerMethod, urlPattern] = key.split(':');
      if (method === handlerMethod && url.includes(urlPattern)) {
        return handler(url, init);
      }
    }

    // Default handlers for common endpoints

    // Handle query endpoint
    if (url.includes('/query') && method === 'POST') {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          answer: 'This is a sample answer to your query.',
          sources: [
            {
              id: 'doc-1',
              title: 'Sample Resume',
              source: 'Resume',
              content: 'Sample content from the document that matches the query.',
              similarity: 0.95,
            },
          ],
        }),
      });
    }

    // Handle documents endpoint
    if (url.includes('/documents') && !url.includes('/documents/') && method === 'GET') {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([
          {
            id: 'doc-1',
            title: 'Sample Resume',
            source: 'Resume',
            timestamp: Date.now(),
            chunks: 3,
          },
          {
            id: 'doc-2',
            title: 'Job Description - Software Engineer',
            source: 'Job Description',
            timestamp: Date.now() - 86400000, // 1 day ago
            chunks: 2,
          },
        ]),
      });
    }

    // Handle document deletion
    if (url.includes('/documents/') && method === 'DELETE') {
      const documentId = url.split('/').pop();
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          documentId,
        }),
      });
    }

    // Handle document upload
    if (url.includes('/upload') && method === 'POST') {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          documentId: 'new-doc-id',
          chunks: 4,
        }),
      });
    }

    // Default response for unhandled requests
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });
  };
}

// Mock Next.js components and functions
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/server', () => {
  return {
    NextRequest: class MockNextRequest {
      url: string;
      method: string;
      headers: any;
      body: any;

      constructor(url: string, init?: any) {
        this.url = url;
        this.method = init?.method || 'GET';
        this.headers = new Headers(init?.headers || {});
        this.body = init?.body || null;
      }

      json() {
        if (typeof this.body === 'string') {
          return Promise.resolve(JSON.parse(this.body));
        }
        return Promise.resolve({});
      }
    },
    NextResponse: {
      json: (data: any, init?: any) => {
        return {
          status: init?.status || 200,
          headers: new Headers({
            ...init?.headers,
            'content-type': 'application/json',
          }),
          json: () => Promise.resolve(data),
        };
      },
    },
  };
});

// Mock the crypto.randomUUID function
let uuidCounter = 0;
Object.defineProperty(global.crypto, 'randomUUID', {
  value: () => `123e4567-e89b-12d3-a456-${(426614174000 + uuidCounter++).toString().padStart(12, '0')}`,
});

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock the localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
