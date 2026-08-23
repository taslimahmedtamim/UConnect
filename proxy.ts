import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy — runs server-side BEFORE the page renders.
 * 
 * - Redirects unauthenticated users to /login (no flash of protected content)
 * - Redirects authenticated users away from /login and /register to /dashboard
 * - Preserves the intended redirect URL so users land where they wanted after login
 * 
 * Note: Auto-refresh of expired tokens is handled client-side in UserProvider.
 */

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude API routes, static files, and next internal paths from protection
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.match(/\.(.*)$/) // Static files like .svg, .ico, etc.
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isPublicRoute = publicRoutes.includes(pathname);

  // Authenticated user trying to access login/register → redirect to dashboard
  if (accessToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Has refresh token but no access token → let the page load, 
  // UserProvider will auto-refresh the token client-side
  if (!accessToken && refreshToken && !isPublicRoute) {
    return NextResponse.next();
  }

  // No valid tokens and trying to access protected route → redirect to login
  if (!accessToken && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure the matcher
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};


