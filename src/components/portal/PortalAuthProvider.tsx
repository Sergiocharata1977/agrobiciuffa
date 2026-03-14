'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

import { getAuthClient } from '@/firebase/config';
import type { AuthUser, UserRole } from '@/types/auth';

interface PortalAuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthContextValue | undefined>(undefined);

function normalizeRole(role: unknown): UserRole {
    return role === 'admin' || role === 'mecanico' || role === 'repuestero' || role === 'cliente'
        ? role
        : 'cliente';
}

export function PortalAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const unsubscribe = onAuthStateChanged(getAuthClient(), async (firebaseUser) => {
            try {
                if (!firebaseUser) {
                    localStorage.removeItem('portal_token');
                    if (mounted) {
                        setUser(null);
                    }
                    return;
                }

                const [token, tokenResult] = await Promise.all([
                    firebaseUser.getIdToken(),
                    firebaseUser.getIdTokenResult(),
                ]);

                localStorage.setItem('portal_token', token);

                if (!mounted) {
                    return;
                }

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    role: normalizeRole(tokenResult.claims.role),
                });
            } catch (error) {
                console.error('Error loading portal auth state:', error);
                localStorage.removeItem('portal_token');

                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const value = useMemo<PortalAuthContextValue>(
        () => ({
            user,
            loading,
            signOut: async () => {
                await firebaseSignOut(getAuthClient());
                localStorage.removeItem('portal_token');
            },
        }),
        [loading, user]
    );

    return <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
    const context = useContext(PortalAuthContext);

    if (!context) {
        throw new Error('usePortalAuth must be used within PortalAuthProvider');
    }

    return context;
}
