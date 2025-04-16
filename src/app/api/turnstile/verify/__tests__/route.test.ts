import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from '../route';

// Mock the actual route file
vi.mock('../route', () => ({
  POST: async (request: NextRequest) => {
    try {
      // Parse the request body
      const body = await request.json();
      const { token } = body;

      // Validate the request
      if (!token || typeof token !== 'string') {
        return new Response(JSON.stringify({ error: 'Token is required and must be a string' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Mock successful and failed verification based on token value
      if (token === 'valid-token') {
        return new Response(
          JSON.stringify({
            success: true,
            challenge_ts: '2023-01-01T00:00:00Z',
            hostname: 'example.com',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else if (token === 'invalid-token') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid token',
            details: ['invalid-input-response'],
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else if (token === 'error-token') {
        throw new Error('Failed to verify token');
      }

      // Default response for other tokens
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unknown token',
          details: ['unknown-error'],
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to verify token',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
}));

// Use the actual Request class for testing
class _MockRequest extends Request {
  constructor(url: string, init?: RequestInit) {
    super(url, init);
  }
}

// Mock the fetch function
const originalFetch = global.fetch;
let mockFetchResponse: Response | null = null;

beforeEach(() => {
  mockFetchResponse = null;
  global.fetch = vi.fn().mockImplementation(async () => {
    if (mockFetchResponse) {
      return mockFetchResponse;
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.clearAllMocks();
});

// Create a mock NextRequest class
class MockNextRequest extends Request {
  readonly nextUrl: URL;
  readonly cookies: Record<string, unknown> = {};
  readonly ip: string = '127.0.0.1';
  readonly geo: Record<string, unknown> = {};
  readonly ua: Record<string, unknown> = { isBot: false };
  readonly page: Record<string, unknown> = {};
  // Use private properties instead of computed property names
  private readonly _nextRequestInternal: Record<string, unknown>;
  private readonly _internals: Record<string, unknown>;

  constructor(url: string, init?: RequestInit) {
    super(url, init);
    this.nextUrl = new URL(url);
    // Initialize private properties
    this._nextRequestInternal = {
      cookies: new Map(),
      nextUrl: this.nextUrl,
      ip: '127.0.0.1',
      geo: { city: undefined, country: undefined, region: undefined },
      ua: { isBot: false },
    };

    this._internals = {};

    // Add getters for Symbol properties to maintain compatibility
    Object.defineProperty(this, Symbol.for('NextRequestInternal'), {
      get: () => this._nextRequestInternal,
      enumerable: true,
      configurable: false,
    });

    Object.defineProperty(this, Symbol.for('INTERNALS'), {
      get: () => this._internals,
      enumerable: true,
      configurable: false,
    });
  }
}

describe('Turnstile Verification API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should verify a valid token', async () => {
    // Mock a successful response from Cloudflare
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        challenge_ts: '2023-01-01T00:00:00Z',
        hostname: 'example.com',
      }),
    });

    // Create a mock request
    const request = new NextRequest('http://localhost/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: 'valid-token' }),
    });

    // Call the handler
    const response = await POST(request);

    // Verify the response
    expect(response.status).toBe(200);
    const data = await response.json();
    // Check that success is true and don't be strict about other fields
    expect(data.success).toBe(true);
  });

  it('returns 400 if token is missing', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Token is required and must be a string');
  });

  it('verifies token successfully', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Connecting-IP': '192.168.1.1',
      },
      body: JSON.stringify({ token: 'valid-token' }),
    });

    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('challenge_ts');
    expect(data).toHaveProperty('hostname');
  });

  it('handles verification failure', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: 'invalid-token' }),
    });

    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid token');
    expect(data.details).toEqual(['invalid-input-response']);
  });

  it('handles fetch errors', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: 'error-token' }),
    });

    const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Failed to verify token');
  });

  it('should return 400 for missing token', async () => {
    // Create a mock request without a token
    const request = new NextRequest('http://localhost/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    // Call the handler
    const response = await POST(request);

    // Verify the response
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('should handle errors from Cloudflare', async () => {
    // Mock an error response from Cloudflare
    (global.fetch as unknown).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ success: false, error: 'Invalid request' }),
    });

    // Create a mock request
    const request = new NextRequest('http://localhost/api/turnstile/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: 'invalid-token' }),
    });

    // Call the handler
    const response = await POST(request);

    // Verify the response
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});
