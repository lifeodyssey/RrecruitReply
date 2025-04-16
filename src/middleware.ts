import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


/**
 * Middleware to protect admin routes
 *
 * This middleware checks if the user is authenticated before allowing access to admin routes.
 * If not authenticated, the user is redirected to the login page.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const {pathname} = request.nextUrl;

  // Check if path is public (doesn't require authentication)
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  if (isAuthPath(pathname)) {
    // Get JWT token from cookie and validate
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If user has no token but tries to access protected route
    if (!token) {
      // For API routes, return 401 Unauthorized
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // For other routes, redirect to login
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/**
 * Check if the path is public (doesn't require authentication)
 */
export function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/chat" ||
    pathname === "/admin/login" ||
    pathname === "/admin/error" ||
    pathname.startsWith("/api/turnstile") ||
    pathname.startsWith("/api/autorag/query") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  );
}

/**
 * Check if the path requires authentication
 */
export function isAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/autorag/upload") ||
    pathname.startsWith("/api/autorag/delete") ||
    pathname.startsWith("/api/autorag/documents") ||
    pathname.startsWith("/documents")
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
