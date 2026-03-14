'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { FooterInstitucional } from '@/components/layout/FooterInstitucional';
import { NavbarInstitucional } from '@/components/layout/NavbarInstitucional';

const PRIVATE_PREFIXES = ['/admin', '/portal'];

const PRIVATE_EXACT_PATHS = new Set([
    '/login',
    '/register',
    '/dashboard',
    '/mis-equipos',
    '/mis-repuestos',
    '/servicios',
    '/asistente',
    '/reclamos',
    '/mi-cuenta',
    '/mis-solicitudes',
    '/nueva-solicitud',
]);

function shouldHideInstitutionalChrome(pathname: string): boolean {
    // Estas rutas ya pertenecen al flujo privado actual y no deben mezclarse con el chrome institucional.
    if (PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
        return true;
    }

    return PRIVATE_EXACT_PATHS.has(pathname);
}

export function PublicSiteShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const hideChrome = shouldHideInstitutionalChrome(pathname);

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <NavbarInstitucional />
            <div>{children}</div>
            <FooterInstitucional />
        </div>
    );
}
