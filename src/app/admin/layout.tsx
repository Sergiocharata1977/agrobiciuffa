import type { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { AdminNav } from '@/components/admin/AdminNav';
import { getAuthenticatedUser } from '@/lib/auth/serverAuth';

interface AdminLayoutProps {
    children: ReactNode;
}

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/admin/unauthorized']);
const ALLOWED_ROLES = new Set(['mecanico', 'repuestero', 'admin']);

function getCurrentPathname(): string {
    const headerStore = headers();
    const pathnameHeader =
        headerStore.get('next-url') ??
        headerStore.get('x-invoke-path') ??
        headerStore.get('x-matched-path') ??
        '/admin';

    try {
        if (pathnameHeader.startsWith('http://') || pathnameHeader.startsWith('https://')) {
            return new URL(pathnameHeader).pathname;
        }

        return pathnameHeader;
    } catch {
        return pathnameHeader;
    }
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = getCurrentPathname();

    if (PUBLIC_ADMIN_PATHS.has(pathname)) {
        return <>{children}</>;
    }

    const cookieStore = cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    const request = new Request('http://localhost/admin', {
        headers: cookieHeader ? { cookie: cookieHeader } : {},
    });

    const user = await getAuthenticatedUser(request);

    if (!user) {
        redirect('/admin/login');
    }

    if (!ALLOWED_ROLES.has(user.role)) {
        redirect('/admin/unauthorized');
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            <AdminNav role={user.role} />
            <main className="min-h-screen pl-60">
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
