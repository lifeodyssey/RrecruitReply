/**
 * Mock implementation of NextRequest for testing
 */

// Add a simple test to prevent the "no tests" error
describe('MockNextRequest', () => {
  it('can be instantiated with a URL', () => {
    const request = new MockNextRequest('https://example.com');
    expect(request.url).toBe('https://example.com');
    expect(request.method).toBe('GET');
  });

  it('can parse JSON body', async () => {
    const request = new MockNextRequest('https://example.com', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
    });
    const data = await request.json();
    expect(data).toEqual({ test: 'data' });
  });
});

// Removed unused import: import { NextRequest } from 'next/server';

// Import MapIterator to ensure correct Map interface implementation
import { MapIterator } from './custom-iterators';

// Define the internal structure for NextURL
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
interface _INextURLInternal {
  basePath: string;
  buildId: string;
  locale: string | undefined;
  defaultLocale: string | undefined;
}

// Define the NextURL class that matches the expected interface
export class MockNextURL implements URL {
  // URL properties
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

  // NextURL properties
  basePath: string = '';
  buildId: string = '';
  locale: string = '';
  defaultLocale: string = '';
  domainLocale: { domain: string; defaultLocale: string; locales: string[] } | undefined =
    undefined;

  // Internal property for NextURL
  // Use a private property instead of a computed property name
  private readonly _nextURLInternal: Record<string, unknown> = {
    basePath: '',
    buildId: '',
    locale: undefined,
    defaultLocale: undefined,
  };

  constructor(url: string | URL, base?: string | URL) {
    const parsedUrl = new URL(url, base);
    this.hash = parsedUrl.hash;
    this.host = parsedUrl.host;
    this.hostname = parsedUrl.hostname;
    this.href = parsedUrl.href;
    this.origin = parsedUrl.origin;
    this.password = parsedUrl.password;
    this.pathname = parsedUrl.pathname;
    this.port = parsedUrl.port;
    this.protocol = parsedUrl.protocol;
    this.search = parsedUrl.search;
    this.searchParams = parsedUrl.searchParams;
    this.username = parsedUrl.username;
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

  clone(): MockNextURL {
    return new MockNextURL(this.href);
  }
}

// Define the internal structure for NextRequest
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
interface _INextRequestInternal {
  cookies: Map<string, string>;
  nextUrl: MockNextURL;
  ip?: string;
  geo?: { city?: string; country?: string; region?: string };
  ua?: { isBot: boolean };
}

// Mock RequestCookie interface
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
interface _IRequestCookie {
  name: string;
  value: string;
}

// Mock RequestCookies class
class MockRequestCookies implements Map<string, string> {
  private cookies: Map<string, string> = new Map();
  readonly size: number = 0;

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

  entries(): MapIterator<[string, string]> {
    return new MapIterator(this.cookies.entries());
  }

  keys(): MapIterator<string> {
    return new MapIterator(this.cookies.keys());
  }

  values(): MapIterator<string> {
    return new MapIterator(this.cookies.values());
  }

  [Symbol.iterator](): MapIterator<[string, string]> {
    return new MapIterator(this.cookies.entries());
  }

  get [Symbol.toStringTag](): string {
    return 'Map';
  }
}

/**
 * Mock implementation of NextRequest for testing
 */
export class MockNextRequest implements Request {
  // Request properties
  url: string;
  method: string;
  headers: Headers;
  body: ReadableStream<Uint8Array> | null = null;
  bodyUsed: boolean = false;
  cache: RequestCache = 'default';
  credentials: RequestCredentials = 'same-origin';
  destination: RequestDestination = '';
  integrity: string = '';
  keepalive: boolean = false;
  mode: RequestMode = 'cors';
  redirect: RequestRedirect = 'follow';
  referrer: string = '';
  referrerPolicy: ReferrerPolicy = '';
  signal: AbortSignal = {
    aborted: false,
    reason: undefined,
    onabort: null,
    throwIfAborted: () => {
      /* Implementation not needed for tests */
    },
    addEventListener: () => {
      /* Implementation not needed for tests */
    },
    removeEventListener: () => {
      /* Implementation not needed for tests */
    },
    dispatchEvent: () => true,
  } as AbortSignal;

  // NextRequest properties
  nextUrl: MockNextURL;
  cookies: MockRequestCookies;

  // Internal property for NextRequest
  // Use a private property instead of a computed property name
  private readonly _nextRequestInternal: Record<string, unknown>;

  // Mock data for tests
  private mockJsonData: Record<string, unknown> = {};

  constructor(
    url: string,
    options: { method?: string; headers?: HeadersInit; body?: string } = {}
  ) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Headers(options.headers || {});
    this.nextUrl = new MockNextURL(url);
    this.cookies = new MockRequestCookies();

    if (options.body) {
      this.mockJsonData = JSON.parse(options.body || '{}');
    }

    // Initialize the internal property
    this._nextRequestInternal = {
      cookies: new Map(),
      nextUrl: this.nextUrl,
      ip: '127.0.0.1',
      geo: { city: undefined, country: undefined, region: undefined },
      ua: { isBot: false },
    };
  }

  // Request methods
  async json(): Promise<Record<string, unknown>> {
    return this.mockJsonData;
  }

  async text(): Promise<string> {
    return JSON.stringify(this.mockJsonData);
  }

  async blob(): Promise<Blob> {
    return new Blob([JSON.stringify(this.mockJsonData)], { type: 'application/json' });
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    return encoder.encode(JSON.stringify(this.mockJsonData)).buffer as ArrayBuffer;
  }

  async formData(): Promise<FormData> {
    const formData = new FormData();
    Object.entries(this.mockJsonData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    return formData;
  }

  async bytes(): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    return encoder.encode(JSON.stringify(this.mockJsonData));
  }

  clone(): MockNextRequest {
    const clone = new MockNextRequest(this.url, {
      method: this.method,
      headers: this.headers,
    });
    clone.mockJsonData = { ...this.mockJsonData };

    // Set the internal property
    Object.defineProperty(clone, '_nextRequestInternal', {
      value: {
        cookies: clone.cookies,
        nextUrl: clone.nextUrl,
        ip: '127.0.0.1',
        geo: { city: undefined, country: undefined, region: undefined },
        ua: { isBot: false },
      },
      writable: false,
      enumerable: true,
      configurable: false,
    });

    return clone;
  }
}
