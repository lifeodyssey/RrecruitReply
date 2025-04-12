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
  // Define a proper Request class that matches the expected interface
  global.Request = class MockRequest implements Request {
    readonly cache: RequestCache = 'default';
    readonly credentials: RequestCredentials = 'same-origin';
    readonly destination: RequestDestination = '';
    readonly headers: Headers;
    readonly integrity: string = '';
    readonly keepalive: boolean = false;
    readonly method: string;
    readonly mode: RequestMode = 'cors';
    readonly redirect: RequestRedirect = 'follow';
    readonly referrer: string = '';
    readonly referrerPolicy: ReferrerPolicy = '';
    readonly signal: AbortSignal = {
      aborted: false,
      reason: undefined,
      onabort: null,
      throwIfAborted: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    } as AbortSignal;
    readonly url: string;
    readonly body: ReadableStream<Uint8Array> | null = null;
    readonly bodyUsed: boolean = false;

    constructor(input: RequestInfo | URL, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers || {});
    }

    clone(): Request {
      return new MockRequest(this.url, { method: this.method });
    }

    arrayBuffer(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0));
    }

    blob(): Promise<Blob> {
      return Promise.resolve(new Blob([]));
    }

    bytes(): Promise<Uint8Array> {
      return Promise.resolve(new Uint8Array());
    }

    formData(): Promise<FormData> {
      return Promise.resolve(new FormData());
    }

    json(): Promise<any> {
      return Promise.resolve({});
    }

    text(): Promise<string> {
      return Promise.resolve('');
    }
  };
}

if (typeof Response === 'undefined') {
  // Define a proper Response class that matches the expected interface
  global.Response = class MockResponse implements Response {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly redirected: boolean = false;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType = 'default';
    readonly url: string = '';
    readonly body: ReadableStream<Uint8Array> | null = null;
    readonly bodyUsed: boolean = false;
    private readonly _bodyInit: any;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this._bodyInit = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || '';
      this.headers = new Headers(init?.headers || {});
      this.ok = this.status >= 200 && this.status < 300;
    }

    clone(): Response {
      return new MockResponse(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: this.headers
      });
    }

    arrayBuffer(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0));
    }

    blob(): Promise<Blob> {
      return Promise.resolve(new Blob([]));
    }

    bytes(): Promise<Uint8Array> {
      return Promise.resolve(new Uint8Array());
    }

    formData(): Promise<FormData> {
      return Promise.resolve(new FormData());
    }

    json(): Promise<any> {
      return Promise.resolve(typeof this._bodyInit === 'string'
        ? JSON.parse(this._bodyInit)
        : this._bodyInit);
    }

    text(): Promise<string> {
      return Promise.resolve(String(this._bodyInit));
    }

    static error(): Response {
      return new MockResponse(null, { status: 500 });
    }

    static json(data: any, init?: ResponseInit): Response {
      return new MockResponse(JSON.stringify(data), {
        ...init,
        headers: {
          ...init?.headers,
          'Content-Type': 'application/json'
        }
      });
    }

    static redirect(url: string | URL, status?: number): Response {
      return new MockResponse(null, {
        status: status || 302,
        headers: { Location: url.toString() }
      });
    }
  };
}

// Import custom iterators
const customIteratorsPath = './src/__tests__/mocks/custom-iterators';
let HeadersIterator: any;

try {
  const customIterators = require(customIteratorsPath);
  HeadersIterator = customIterators.HeadersIterator;
} catch (e) {
  // Define a minimal version if the module can't be loaded
  class BasicHeadersIterator<T> implements Iterator<T> {
    private iterator: Iterator<T>;
    constructor(iterator: Iterator<T>) {
      this.iterator = iterator;
    }
    next(value?: any): IteratorResult<T> {
      return this.iterator.next(value);
    }
    [Symbol.iterator](): BasicHeadersIterator<T> {
      return this;
    }
  }
  HeadersIterator = BasicHeadersIterator;
}

if (typeof Headers === 'undefined') {
  // Define a proper Headers class that matches the expected interface
  global.Headers = class MockHeaders implements Headers {
    private _headers: Record<string, string> = {};

    [Symbol.iterator](): HeadersIterator<[string, string]> {
      return new HeadersIterator(Object.entries(this._headers)[Symbol.iterator]());
    }

    entries(): HeadersIterator<[string, string]> {
      return new HeadersIterator(Object.entries(this._headers)[Symbol.iterator]());
    }

    keys(): HeadersIterator<string> {
      return new HeadersIterator(Object.keys(this._headers)[Symbol.iterator]());
    }

    values(): HeadersIterator<string> {
      return new HeadersIterator(Object.values(this._headers)[Symbol.iterator]());
    }

    forEach(callback: (value: string, key: string, parent: Headers) => void): void {
      Object.entries(this._headers).forEach(([key, value]) => callback(value, key, this as Headers));
    }

    constructor(init?: HeadersInit) {
      if (init) {
        if (init instanceof Headers) {
          init.forEach((value, key) => {
            this._headers[key.toLowerCase()] = value;
          });
        } else if (Array.isArray(init)) {
          init.forEach(([key, value]) => {
            this._headers[key.toLowerCase()] = value;
          });
        } else {
          Object.entries(init).forEach(([key, value]) => {
            this._headers[key.toLowerCase()] = value;
          });
        }
      }
    }

    append(name: string, value: string): void {
      this._headers[name.toLowerCase()] = value;
    }

    delete(name: string): void {
      delete this._headers[name.toLowerCase()];
    }

    get(name: string): string | null {
      return this._headers[name.toLowerCase()] || null;
    }

    has(name: string): boolean {
      return name.toLowerCase() in this._headers;
    }

    set(name: string, value: string): void {
      this._headers[name.toLowerCase()] = value;
    }

    getSetCookie(): string[] {
      return this.get('set-cookie')?.split(', ') || [];
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
  global.fetch = (url: RequestInfo | URL, init?: RequestInit) => {
    const method = init?.method || 'GET';
    const urlString = url instanceof URL ? url.toString() : url.toString();

    // Check if there's a custom handler for this URL
    for (const [key, handler] of customHandlers.entries()) {
      const [handlerMethod, urlPattern] = key.split(':');
      if (method === handlerMethod && urlString.includes(urlPattern)) {
        return handler(urlString, init);
      }
    }

    // Default handlers for common endpoints

    // Handle query endpoint
    if (urlString.includes('/query') && method === 'POST') {
      return Promise.resolve(new Response(JSON.stringify({
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
      }), { status: 200 }));
    }

    // Handle documents endpoint
    if (urlString.includes('/documents') && !urlString.includes('/documents/') && method === 'GET') {
      return Promise.resolve(new Response(JSON.stringify([
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
      ]), { status: 200 }));
    }

    // Handle document deletion
    if (urlString.includes('/documents/') && method === 'DELETE') {
      const documentId = urlString.split('/').pop();
      return Promise.resolve(new Response(JSON.stringify({
        success: true,
        documentId,
      }), { status: 200 }));
    }

    // Handle document upload
    if (urlString.includes('/upload') && method === 'POST') {
      return Promise.resolve(new Response(JSON.stringify({
        success: true,
        documentId: 'new-doc-id',
        chunks: 4,
      }), { status: 200 }));
    }

    // Default response for unhandled requests
    return Promise.resolve(new Response(JSON.stringify({ error: 'Not found' }), { status: 404 }));
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
  // Create a proper NextURL mock
  class MockNextURL implements URL {
    hash: string = '';
    host: string = '';
    hostname: string = '';
    href: string = '';
    readonly origin: string = '';
    password: string = '';
    pathname: string = '';
    port: string = '';
    protocol: string = '';
    search: string = '';
    readonly searchParams: URLSearchParams = new URLSearchParams();
    username: string = '';
    // Additional NextURL properties
    basePath: string = '';
    buildId: string = '';
    locale: string = '';
    defaultLocale: string = '';
    domainLocale: { domain: string; defaultLocale: string; locales: string[] } | undefined = undefined;

    constructor(url: string | URL, base?: string | URL) {
      const parsedUrl = new URL(url, base);
      this.hash = parsedUrl.hash;
      this.host = parsedUrl.host;
      this.hostname = parsedUrl.hostname;
      this.href = parsedUrl.href;
      this.pathname = parsedUrl.pathname;
      this.port = parsedUrl.port;
      this.protocol = parsedUrl.protocol;
      this.search = parsedUrl.search;
    }

    toString(): string {
      return this.href;
    }

    toJSON(): string {
      return this.href;
    }

    // NextURL specific methods
    analyze(): { pathname: string; search: string; hash: string } {
      return { pathname: this.pathname, search: this.search, hash: this.hash };
    }

    formatPathname(): string {
      return this.pathname;
    }

    formatSearch(): string {
      return this.search;
    }
  }

  // Create a proper RequestCookies mock
  // Import MapIterator directly to avoid circular dependencies
  const { MapIterator } = require('./src/__tests__/mocks/custom-iterators');

  class MockRequestCookies implements Map<string, string> {
    private cookies: Map<string, string> = new Map();

    // Add Symbol.toStringTag property required by Map
    readonly [Symbol.toStringTag]: string = 'Map';

    get size(): number {
      return this.cookies.size;
    }

    clear(): void {
      this.cookies.clear();
    }

    delete(key: string): boolean {
      return this.cookies.delete(key);
    }

    forEach(callbackfn: (value: string, key: string, map: Map<string, string>) => void): void {
      this.cookies.forEach(callbackfn);
    }

    get(key: string): string | undefined {
      return this.cookies.get(key);
    }

    getAll(): { name: string; value: string }[] {
      return Array.from(this.cookies.entries()).map(([name, value]) => ({ name, value }));
    }

    has(key: string): boolean {
      return this.cookies.has(key);
    }

    set(key: string, value: string): this {
      this.cookies.set(key, value);
      return this;
    }

    // Use MapIterator for these methods to match the Map interface
    [Symbol.iterator](): MapIterator<[string, string]> {
      return new MapIterator(this.cookies[Symbol.iterator]());
    }

    entries(): MapIterator<[string, string]> {
      return new MapIterator(this.cookies.entries());
    }

    keys(): MapIterator<string> {
      return new MapIterator(this.cookies.keys());
    }

    values(): MapIterator<string> {
      return new MapIterator(this.cookies.values());
    }
  }

  return {
    NextRequest: class MockNextRequest {
      url: string;
      nextUrl: MockNextURL;
      method: string;
      headers: Headers;
      cookies: MockRequestCookies;
      body: any;
      ip: string = '127.0.0.1';
      geo: { city?: string; country?: string; region?: string } = {};
      ua: { isBot: boolean } = { isBot: false };
      page: { name?: string; params?: Record<string, string> } = {};

      constructor(url: string, init?: any) {
        this.url = url;
        this.nextUrl = new MockNextURL(url);
        this.method = init?.method || 'GET';
        this.headers = new Headers(init?.headers || {});
        this.cookies = new MockRequestCookies();
        this.body = init?.body || null;
      }

      json() {
        if (typeof this.body === 'string') {
          return Promise.resolve(JSON.parse(this.body));
        }
        return Promise.resolve({});
      }

      text() {
        return Promise.resolve(typeof this.body === 'string' ? this.body : '');
      }

      blob() {
        return Promise.resolve(new Blob([]));
      }

      arrayBuffer() {
        return Promise.resolve(new ArrayBuffer(0));
      }

      formData() {
        return Promise.resolve(new FormData());
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
      redirect: (url: string | URL) => {
        return {
          status: 302,
          headers: new Headers({
            'Location': url.toString(),
          }),
        };
      },
      rewrite: (url: string | URL) => {
        return {
          status: 200,
          headers: new Headers(),
        };
      },
      next: () => {
        return {
          status: 200,
          headers: new Headers(),
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
