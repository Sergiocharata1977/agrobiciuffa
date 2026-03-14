'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { Package, ShieldCheck, Users, Wrench } from 'lucide-react';

import { getAuthClient } from '@/firebase/config';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/auth';

interface AdminNavProps {
    role: UserRole;
}

interface NavItem {
    href: string;
    label: string;
    icon: typeof Wrench;
}

const NAV_ITEMS_BY_ROLE: Record<'mecanico' | 'repuestero' | 'admin', NavItem[]> = {
    mecanico: [
        { href: '/admin/taller', label: 'Taller', icon: Wrench },
    ],
    repuestero: [
        { href: '/admin/repuestos', label: 'Repuestos', icon: Package },
    ],
    admin: [
        { href: '/admin/taller', label: 'Taller', icon: Wrench },
        { href: '/admin/repuestos', label: 'Repuestos', icon: Package },
        { href: '/admin/clientes', label: 'Clientes', icon: Users },
        { href: '/admin/web', label: 'Gestion Web', icon: ShieldCheck },
    ],
};

function getNavItems(role: UserRole): NavItem[] {
    if (role === 'mecanico' || role === 'repuestero' || role === 'admin') {
        return NAV_ITEMS_BY_ROLE[role];
    }

    return [];
}

function getRoleLabel(role: UserRole): string {
    switch (role) {
        case 'admin':
            return 'Administrador';
        case 'mecanico':
            return 'Mecanico';
        case 'repuestero':
            return 'Repuestero';
        default:
            return 'Cliente';
    }
}

export function AdminNav({ role }: AdminNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const navItems = getNavItems(role);

    const handleLogout = async () => {
        try {
            signOut(getAuth());
        } catch {
            try {
                await signOut(getAuthClient());
            } catch {
                // Ignore client auth errors and still clear local state.
            }
        }

        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('admin_token');
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

        router.replace('/admin/login');
        router.refresh();
    };

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-zinc-200 bg-zinc-100">
            <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold leading-tight text-zinc-900">Agrobiciufa Admin</p>
                    <p className="text-xs text-zinc-600">Panel operativo</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 p-3 pt-4">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-zinc-200 p-4">
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Rol activo</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">{getRoleLabel(role)}</p>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center justify-center rounded-xl bg-zinc-900 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                    Cerrar sesion
                </button>
            </div>
        </aside>
    );
}
