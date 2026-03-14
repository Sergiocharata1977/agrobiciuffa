'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { PortalAuthProvider, usePortalAuth } from '@/components/portal/PortalAuthProvider';
import { PortalNav } from '@/components/portal/PortalNav';

function PortalShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = usePortalAuth();

    const isAuthRoute = pathname === '/portal/login' || pathname === '/portal/registro';

    useEffect(() => {
        if (!loading && !user && !isAuthRoute) {
            router.replace('/portal/login');
        }
    }, [isAuthRoute, loading, router, user]);

    useEffect(() => {
        if (!loading && user && isAuthRoute) {
            router.replace('/portal/mis-solicitudes');
        }
    }, [isAuthRoute, loading, router, user]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#c8102e]" />
            </div>
        );
    }

    if (!user && !isAuthRoute) {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            <div className={isAuthRoute ? 'min-h-screen' : 'min-h-screen pb-16'}>{children}</div>
            {!isAuthRoute && user ? <PortalNav /> : null}
        </div>
    );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
    return (
        <PortalAuthProvider>
            <PortalShell>{children}</PortalShell>
        </PortalAuthProvider>
    );
}
