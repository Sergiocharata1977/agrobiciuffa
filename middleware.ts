import { NextRequest, NextResponse } from 'next/server';

import type { UserRole } from '@/types/auth';

type JwtPayload = {
    exp?: number;
    role?: UserRole;
    claims?: {
        role?: UserRole;
    };
};

const ADMIN_ROLES: UserRole[] = ['mecanico', 'repuestero', 'admin'];
const PORTAL_ROLES: UserRole[] = ['cliente', 'admin'];

const ROLE_RULES: Array<{ prefix: string; roles: UserRole[] }> = [
    { prefix: '/admin/clientes', roles: ['admin'] },
    { prefix: '/admin/repuestos', roles: ['repuestero', 'admin'] },
    { prefix: '/admin/taller', roles: ['mecanico', 'admin'] },
    { prefix: '/admin', roles: ADMIN_ROLES },
    { prefix: '/portal', roles: PORTAL_ROLES },
    { prefix: '/api/admin', roles: ADMIN_ROLES },
];

const PUBLIC_PATHS = new Set(['/admin/login', '/portal/login']);

function decodeBase64Url(input: string): string | null {
    try {
        const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
        return atob(`${normalized}${padding}`);
    } catch {
        return null;
    }
}

function parseToken(token: string): JwtPayload | null {
    const [, payload] = token.split('.');

    if (!payload) {
        return null;
    }

    const decodedPayload = decodeBase64Url(payload);

    if (!decodedPayload) {
        return null;
    }

    try {
        return JSON.parse(decodedPayload) as JwtPayload;
    } catch {
        return null;
    }
}

function extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');

    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice('Bearer '.length).trim();
    }

    return request.cookies.get('session')?.value ?? null;
}

function getRequiredRoles(pathname: string): UserRole[] | null {
    const rule = ROLE_RULES.find(
        ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    return rule?.roles ?? null;
}

function getLoginPath(pathname: string): string {
    if (pathname.startsWith('/portal')) {
        return '/portal/login';
    }

    return '/admin/login';
}

function getRole(payload: JwtPayload | null): UserRole | null {
    return payload?.role ?? payload?.claims?.role ?? null;
}

function isExpired(payload: JwtPayload | null): boolean {
    if (!payload?.exp) {
        return true;
    }

    return payload.exp <= Math.floor(Date.now() / 1000);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (PUBLIC_PATHS.has(pathname)) {
        return NextResponse.next();
    }

    const requiredRoles = getRequiredRoles(pathname);

    if (!requiredRoles) {
        return NextResponse.next();
    }

    const token = extractToken(request);

    if (!token) {
        return NextResponse.redirect(new URL(getLoginPath(pathname), request.url));
    }

    const payload = parseToken(token);

    if (!payload || isExpired(payload)) {
        return NextResponse.redirect(new URL(getLoginPath(pathname), request.url));
    }

    const role = getRole(payload);

    if (!role || !requiredRoles.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/portal/:path*', '/api/admin/:path*'],
};
