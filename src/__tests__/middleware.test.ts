import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { middleware } from '../../middleware';

import type { NextRequest } from 'next/server';


// Import the types from the dom-extensions.d.ts file
/// <reference path="../../types/dom-extensions.d.ts" />

// Define symbols for internal properties
const Internal = Symbol.for('NextURLInternal');
const INTERNALS = Symbol.for('NextRequestInternal');

// Create a unique symbol for INTERNALS to avoid conflicts
const MOCK_INTERNALS = Symbol('MOCK_INTERNALS');

// Import custom iterators
import './mocks/custom-iterators';


// Define the NextURL class that matches the expected interface
// Create a minimal implementation that satisfies the NextURL interface
class MockNextURL {
  // Add the [Internal] property required by NextURL
  private readonly [Internal]: {
    basePath: string;
    buildId: string;
    locale?: string;
    defaultLocale?: string;
  };
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
  domainLocale: { domain: string; defaultLocale: string; locales: string[] } | undefined = undefined;

  // Internal property for NextURL - using the proper Internal symbol
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

    // Initialize the Internal property
    this[Internal] = {
      basePath: '',
      buildId: '',
      locale: undefined,
      defaultLocale: undefined
    };
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

// Define RequestCookie interface to match NextJS's implementation
interface RequestCookie {
  name: string;
  value: string;
}

// Create a minimal RequestCookies implementation
class MockRequestCookies {
  private cookies: Map<string, string> = new Map();

  // Add Symbol.toStringTag property
  readonly [Symbol.toStringTag]: string = 'RequestCookies';

  clear(): MockRequestCookies {
    this.cookies.clear();
    return this;
  }

  delete(key: string): boolean {
    return this.cookies.delete(key);
  }

  forEach(callbackfn: (value: string, key: string) => void): void {
    this.cookies.forEach(callbackfn);
  }

  // Return RequestCookie instead of string to match NextJS's interface
  get(key: string): RequestCookie | undefined {
    const value = this.cookies.get(key);
    return value ? { name: key, value } : undefined;
  }

  getAll(): RequestCookie[] {
    return Array.from(this.cookies.entries()).map(([name, value]) => ({ name, value }));
  }

  has(key: string): boolean {
    return this.cookies.has(key);
  }

  set(key: string, value: string): MockRequestCookies {
    this.cookies.set(key, value);
    return this;
  }
}

// Create a minimal implementation that satisfies the NextRequest interface
class MockNextRequest {
  // Request properties
  url: string;
  method: string = 'GET';
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
    throwIfAborted: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
  } as AbortSignal;

  // NextRequest properties
  nextUrl: MockNextURL;
  cookies: MockRequestCookies;
  ip: string = '127.0.0.1';
  geo: { city?: string; country?: string; region?: string } = {};

  // Define private properties for internal state
  private _internalState: {
    cookies: MockRequestCookies;
    nextUrl: MockNextURL;
    ip?: string;
    geo?: { city?: string; country?: string; region?: string };
    ua?: { isBot: boolean };
  };

  // Define getters for the symbol properties
  get [INTERNALS](): Record<string, unknown> { return this._internalState; }
  get [MOCK_INTERNALS](): Record<string, unknown> { return this._internalState; }

  // These properties are accessed through INTERNALS
  ua: { isBot: boolean } = { isBot: false };
  page: { name?: string; params?: Record<string, string> } = {};

  constructor(url: string) {
    this.url = url;
    this.nextUrl = new MockNextURL(url);
    this.headers = new Headers();
    this.cookies = new MockRequestCookies();
    this.ua = { isBot: false };
    this.page = {};

    // Initialize the internal state
    this._internalState = {
      cookies: this.cookies,
      nextUrl: this.nextUrl,
      ip: '127.0.0.1',
      geo: { city: undefined, country: undefined, region: undefined },
      ua: { isBot: false }
    };

    // Define INTERNALS property for compatibility with NextRequest
    Object.defineProperty(this, INTERNALS, {
      get: () => this._internalState,
      enumerable: true,
      configurable: false
    });
  }

  // Request methods
  json(): Promise<unknown> {
    return Promise.resolve({});
  }

  text(): Promise<string> {
    return Promise.resolve('');
  }

  blob(): Promise<Blob | unknown> {
    return Promise.resolve(new Blob([]));
  }

  arrayBuffer(): Promise<ArrayBuffer | unknown> {
    return Promise.resolve(new ArrayBuffer(0));
  }

  formData(): Promise<FormData | unknown> {
    return Promise.resolve(new FormData());
  }

  bytes(): Promise<Uint8Array> {
    return Promise.resolve(new Uint8Array());
  }

  clone(): MockNextRequest {
    // Create a new instance
    const clone = new MockNextRequest(this.url);

    // Copy basic properties
    clone.method = this.method;
    clone.headers = new Headers(this.headers);
    clone.ip = this.ip;
    clone.geo = { ...this.geo };
    clone.ua = { ...this.ua };
    clone.page = { ...this.page };

    // Update the internal state
    clone._internalState = {
      cookies: clone.cookies,
      nextUrl: clone.nextUrl,
      ip: clone.ip,
      geo: clone.geo,
      ua: clone.ua
    };

    return clone;
  }
}

// Mock next-auth/jwt
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      next: jest.fn().mockReturnValue({ type: 'next' }),
      redirect: jest.fn().mockImplementation((url) => ({ type: 'redirect', url })),
      json: jest.fn().mockImplementation((data, options) => ({
        type: 'json',
        data,
        status: options?.status || 200,
        json: async (): Promise<unknown> => data,
      })),
    },
  };
});

describe('Authentication Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    (getToken as jest.Mock).mockResolvedValue(null);
  });

  it('allows access to non-admin routes', async () => {
    const request = new MockNextRequest('http://localhost:3000/');

    await middleware(request as unknown as NextRequest);

    expect(getToken).not.toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('allows access to admin login page', async () => {
    const request = new MockNextRequest('http://localhost:3000/admin/login');

    await middleware(request as unknown as NextRequest);

    expect(getToken).not.toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('allows access to admin error page', async () => {
    const request = new MockNextRequest('http://localhost:3000/admin/error');

    await middleware(request as unknown as NextRequest);

    expect(getToken).not.toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('redirects to login if not authenticated for admin routes', async () => {
    const request = new MockNextRequest('http://localhost:3000/admin/dashboard');

    await middleware(request as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));

    // Check if the redirect URL is correct
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/admin/login');
    expect(redirectUrl.searchParams.get('callbackUrl')).toBe('http://localhost:3000/admin/dashboard');
  });

  it('allows access to admin routes if authenticated', async () => {
    // Mock authenticated session
    (getToken as jest.Mock).mockResolvedValue({
      email: 'admin@example.com',
      role: 'admin',
    });

    const request = new MockNextRequest('http://localhost:3000/admin/dashboard');

    await middleware(request as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('returns 401 for admin API routes if not authenticated', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/admin/documents');

    // Mock NextResponse.json to return a 401 response
    (NextResponse.json as jest.Mock).mockReturnValueOnce({
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    });

    // Call the middleware
    await middleware(request as unknown as NextRequest);

    // Verify that getToken was called
    expect(getToken).toHaveBeenCalled();

    // Verify that NextResponse.json was called
    expect(NextResponse.json).toHaveBeenCalled();
  });

  it('allows access to admin API routes if authenticated', async () => {
    // Mock authenticated session
    (getToken as jest.Mock).mockResolvedValue({
      email: 'admin@example.com',
      role: 'admin',
    });

    const request = new MockNextRequest('http://localhost:3000/api/admin/documents');

    await middleware(request as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
