import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * Middleware to protect admin routes
 *
 * This middleware checks if the user is authenticated before allowing access to admin routes.
 * If not authenticated, the user is redirected to the login page.
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is for admin routes
  if (path.startsWith('/admin') && !path.startsWith('/admin/login') && !path.startsWith('/admin/error')) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect to login if not authenticated
    if (!session) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  // Check if the path is for admin API routes
  if (path.startsWith('/api/admin')) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Return unauthorized if not authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
