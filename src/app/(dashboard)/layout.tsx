'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

function AuthGuard({ children }: { children: ReactNode }) {
    const { firebaseUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !firebaseUser) {
            router.replace('/login');
        }
    }, [firebaseUser, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-zinc-200 border-t-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!firebaseUser) return null;

    return <>{children}</>;
}

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
            href: '/productos',
            label: 'Mis Equipos',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            href: '/repuestos',
            label: 'Repuestos',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            href: '/servicios',
            label: 'Servicios Técnicos',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
            ),
        },
        {
            href: '/asistente',
            label: 'Don Cándido IA',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
        },
        {
            href: '/reclamos',
            label: 'Reclamos',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
            <AuthGuard>
                <div className="min-h-screen bg-zinc-50">
                    {/* Sidebar */}
                    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-zinc-900 border-r border-zinc-800">
                        <SidebarContent />
                    </aside>

                    {/* Main Content */}
                    <main className="pl-60 min-h-screen">
                        <div className="p-6 w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </AuthGuard>
        </AuthProvider>
    );
}
