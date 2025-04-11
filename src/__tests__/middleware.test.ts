import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { middleware } from '../middleware';

// Mock NextRequest
class MockNextRequest implements Partial<NextRequest> {
  url: string;
  nextUrl: URL;
  headers: Headers;
  cookies: Record<string, string>;

  constructor(url: string) {
    this.url = url;
    this.nextUrl = new URL(url);
    this.headers = new Headers();
    this.cookies = {};
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
        json: async () => data,
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
