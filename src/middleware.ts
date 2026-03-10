import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled client-side via Firebase — the middleware only handles
// public-facing routes. Protected dashboard routes use the client AuthGuard.
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookie (set by login page for SSR-aware redirects)
    const authToken = request.cookies.get('auth-token')?.value;

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Redirect to dashboard if accessing auth route while already logged in
    if (isAuthRoute && authToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)',
    ],
};
