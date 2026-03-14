'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Home, Package, UserCircle2 } from 'lucide-react';

const navItems = [
    { href: '/portal', label: 'Inicio', icon: Home },
    { href: '/portal/mis-solicitudes', label: 'Solicitudes', icon: ClipboardList },
    { href: '/portal/mis-equipos', label: 'Equipos', icon: Package },
    { href: '/portal/perfil', label: 'Perfil', icon: UserCircle2 },
] as const;

export function PortalNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                        pathname === item.href ||
                        (item.href !== '/portal' && pathname.startsWith(`${item.href}/`));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors ${
                                active
                                    ? 'text-[#c8102e]'
                                    : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                        >
                            <Icon className={`h-5 w-5 ${active ? 'text-[#c8102e]' : 'text-zinc-400'}`} />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
