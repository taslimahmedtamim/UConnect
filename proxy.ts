import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude API routes, static files, and next internal paths from middleware protection
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.match(/\.(.*)$/) // Static files like .svg, .ico, etc.
  ) {
    return NextResponse.next();
  }

  // Check for the authentication token cookie
  const token = request.cookies.get('accessToken')?.value;

  const isPublicRoute = publicRoutes.includes(pathname);

  // If the user is logged in and trying to access login/register, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is NOT logged in and trying to access a protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Optionally, configure the matcher if needed (this matches everything, we handle filtering inside)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
