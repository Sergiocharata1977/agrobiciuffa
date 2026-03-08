'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { useAuth } from '@/contexts/AuthContext';

function SidebarContent() {
    const pathname = usePathname();
    const { user, firebaseUser, logout } = useAuth();

    const navItems = [
        {
            href: '/dashboard',
            label: 'Inicio',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            href: '/mis-solicitudes',
            label: 'Mis Solicitudes',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
        },
        {
            href: '/mi-cuenta',
            label: 'Mi Cuenta',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ];

    const displayName = user?.displayName || firebaseUser?.displayName || 'Cliente';
    const email = user?.email || firebaseUser?.email || '';
    const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                    </svg>
                </div>
                <div>
                    <p className="text-white font-bold text-sm leading-tight">Agro Biciufa</p>
                    <p className="text-zinc-500 text-xs">Portal del cliente</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3 pt-4">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-red-600 text-white'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}

                <div className="my-3 border-t border-zinc-800"></div>

                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ir a la web
                </Link>
            </nav>

            {/* User footer */}
            <div className="border-t border-zinc-800 p-3">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-400 text-xs font-bold flex-shrink-0">
                        {initials || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{displayName}</p>
                        <p className="text-xs text-zinc-500 truncate">{email}</p>
                    </div>
                    <button
                        onClick={logout}
                        title="Cerrar sesión"
                        className="text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <AuthProvider>
            <OrganizationProvider>
                <div className="min-h-screen bg-zinc-50">
                    {/* Sidebar */}
                    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-zinc-900 border-r border-zinc-800">
                        <SidebarContent />
                    </aside>

                    {/* Main Content */}
                    <main className="pl-60">
                        <div className="p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </OrganizationProvider>
        </AuthProvider>
    );
}
