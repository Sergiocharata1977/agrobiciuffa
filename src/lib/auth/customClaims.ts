import type { DecodedIdToken } from 'firebase-admin/auth';

import { getAdminAuth } from '@/firebase/admin';
import type { UserRole } from '@/types/auth';

export interface VerifiedAuthToken {
    uid: string;
    email: string | null;
    role: UserRole;
}

function mapDecodedToken(decoded: DecodedIdToken): VerifiedAuthToken {
    return {
        uid: decoded.uid,
        email: decoded.email ?? null,
        role: (decoded.role as UserRole) ?? 'cliente',
    };
}

export async function setUserRole(uid: string, role: UserRole): Promise<void> {
    await getAdminAuth().setCustomUserClaims(uid, { role });
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
    const user = await getAdminAuth().getUser(uid);
    return (user.customClaims?.role as UserRole) ?? null;
}

export async function verifyIdToken(token: string): Promise<VerifiedAuthToken> {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return mapDecodedToken(decoded);
}

export async function verifySessionCookie(sessionCookie: string): Promise<VerifiedAuthToken> {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return mapDecodedToken(decoded);
}
