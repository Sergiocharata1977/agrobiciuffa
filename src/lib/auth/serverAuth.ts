import type { AuthUser, UserRole } from '@/types/auth';

import { verifyIdToken, verifySessionCookie } from './customClaims';

const SESSION_COOKIE_NAMES = ['__session', 'session', 'auth-token'] as const;

function parseCookies(cookieHeader: string | null): Map<string, string> {
    const cookies = new Map<string, string>();

    if (!cookieHeader) {
        return cookies;
    }

    for (const part of cookieHeader.split(';')) {
        const [rawName, ...rawValue] = part.trim().split('=');
        if (!rawName || rawValue.length === 0) {
            continue;
        }

        cookies.set(rawName, rawValue.join('='));
    }

    return cookies;
}

function toAuthUser(user: Awaited<ReturnType<typeof verifyIdToken>>): AuthUser {
    return {
        uid: user.uid,
        email: user.email,
        displayName: null,
        role: user.role,
    };
}

export async function getAuthenticatedUser(request: Request): Promise<AuthUser | null> {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.slice(7).trim();
            if (!token) {
                return null;
            }

            const decoded = await verifyIdToken(token);
            return toAuthUser(decoded);
        }

        const cookies = parseCookies(request.headers.get('cookie'));
        for (const cookieName of SESSION_COOKIE_NAMES) {
            const cookieValue = cookies.get(cookieName);
            if (!cookieValue) {
                continue;
            }

            try {
                const decoded = await verifySessionCookie(cookieValue);
                return toAuthUser(decoded);
            } catch {
                try {
                    const decoded = await verifyIdToken(cookieValue);
                    return toAuthUser(decoded);
                } catch {
                    continue;
                }
            }
        }

        return null;
    } catch {
        return null;
    }
}

export async function requireRole(
    request: Request,
    allowedRoles: UserRole[]
): Promise<AuthUser> {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        throw new Error('UNAUTHORIZED');
    }

    if (!allowedRoles.includes(user.role)) {
        throw new Error('FORBIDDEN');
    }

    return user;
}
