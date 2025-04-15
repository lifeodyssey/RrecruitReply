import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Check if the path is a public path
 */
export const isPublicPath = (path: string): boolean => {
  const publicPaths = ['/', '/chat', '/login', '/api/turnstile/verify'];
  return publicPaths.some((publicPath) => path.startsWith(publicPath));
};

/**
 * Check if the path is an auth path
 */
export const isAuthPath = (path: string): boolean => {
  const authPaths = ['/api/auth'];
  return authPaths.some((authPath) => path.startsWith(authPath));
};

/**
 * Middleware function for Next.js
 */
export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // Allow auth paths
  if (isAuthPath(path)) {
    return NextResponse.next();
  }

  // Check for admin paths
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    // Check for session token
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Continue with token (validation would happen in the API route)
    return NextResponse.next();
  }

  // Default: allow the request
  return NextResponse.next();
}

/**
 * Configure which paths should trigger the middleware
 */
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/auth/:path*',
    '/documents/:path*',
  ],
};
