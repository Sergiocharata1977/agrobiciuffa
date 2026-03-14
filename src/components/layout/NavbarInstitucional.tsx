'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Menu, Phone, User, X } from 'lucide-react';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const productLinks = [
    { label: 'Tractores', href: '/productos#tractores' },
    { label: 'Cosechadoras', href: '/productos#cosechadoras' },
    { label: 'Pulverizadores', href: '/productos#pulverizadores' },
    { label: 'Sembradoras', href: '/productos#sembradoras' },
    { label: 'Tecnologia', href: '/productos#tecnologia-precision' },
];

const navigationLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Repuestos', href: '/repuestos' },
    { label: 'Servicio Técnico', href: '/servicio-tecnico' },
    { label: 'Financiación', href: '/financiacion' },
    { label: 'Novedades', href: '/novedades' },
    { label: 'Contacto', href: '/contacto' },
];

function Brand() {
    return (
        <span className="flex items-end gap-2 text-xl font-black tracking-[-0.08em] text-zinc-900">
            <span>
                AGRO<span className="text-red-600">BICIUFFA</span>
            </span>
            <span className="pb-0.5 text-[0.55rem] font-bold tracking-[0.28em] text-zinc-500">
                SRL
            </span>
        </span>
    );
}

export function NavbarInstitucional() {
    const pathname = usePathname();
    const [hasScrolled, setHasScrolled] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

    useEffect(() => {
        const updateScrollState = () => setHasScrolled(window.scrollY > 10);

        updateScrollState();
        window.addEventListener('scroll', updateScrollState, { passive: true });

        return () => window.removeEventListener('scroll', updateScrollState);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 transition-all duration-200',
                hasScrolled
                    ? 'border-b border-zinc-200 bg-white'
                    : 'bg-white/90 backdrop-blur-md'
            )}
        >
            <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <Link href="/" aria-label="Agro Biciuffa SRL" className="shrink-0">
                    <Brand />
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {navigationLinks.slice(0, 2).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-red-600',
                                pathname === item.href && 'text-red-600'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="group relative">
                        <Link
                            href="/productos"
                            className={cn(
                                'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-red-600',
                                pathname === '/productos' && 'text-red-600'
                            )}
                        >
                            Productos
                            <ChevronDown className="h-4 w-4" />
                        </Link>

                        <div className="pointer-events-none absolute left-0 top-full pt-3 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                            <div className="min-w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl shadow-zinc-900/10">
                                {productLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-red-600"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {navigationLinks.slice(2).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-red-600',
                                pathname === item.href && 'text-red-600'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/portal"
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:border-red-600 hover:text-red-600"
                    >
                        <User className="h-4 w-4" />
                        Mi Cuenta
                    </Link>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                    >
                        <Phone className="h-4 w-4" />
                        Contactar
                    </Link>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 transition-colors hover:border-red-600 hover:text-red-600 md:hidden"
                            aria-label="Abrir menú"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </DialogTrigger>

                    <DialogContent className="left-auto right-0 top-0 flex h-dvh max-w-sm translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-zinc-200 p-0 [&>button:last-child]:hidden data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full">
                        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-5">
                            <Link href="/" aria-label="Agro Biciuffa SRL">
                                <Brand />
                            </Link>
                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 transition-colors hover:border-red-600 hover:text-red-600"
                                    aria-label="Cerrar menú"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </DialogClose>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-6">
                            <nav className="space-y-2">
                                <DialogClose asChild>
                                    <Link
                                        href="/"
                                        className="block rounded-2xl px-4 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 hover:text-red-600"
                                    >
                                        Inicio
                                    </Link>
                                </DialogClose>

                                <DialogClose asChild>
                                    <Link
                                        href="/nosotros"
                                        className="block rounded-2xl px-4 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 hover:text-red-600"
                                    >
                                        Nosotros
                                    </Link>
                                </DialogClose>

                                <div className="rounded-2xl border border-zinc-200">
                                    <button
                                        type="button"
                                        onClick={() => setMobileProductsOpen((value) => !value)}
                                        className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-semibold text-zinc-900"
                                    >
                                        Productos
                                        <ChevronDown
                                            className={cn(
                                                'h-5 w-5 transition-transform',
                                                mobileProductsOpen && 'rotate-180'
                                            )}
                                        />
                                    </button>
                                    {mobileProductsOpen ? (
                                        <div className="border-t border-zinc-200 px-2 py-2">
                                            <DialogClose asChild>
                                                <Link
                                                    href="/productos"
                                                    className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-red-600"
                                                >
                                                    Ver todo
                                                </Link>
                                            </DialogClose>
                                            {productLinks.map((item) => (
                                                <DialogClose asChild key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-red-600"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </DialogClose>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                {navigationLinks.slice(2).map((item) => (
                                    <DialogClose asChild key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="block rounded-2xl px-4 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 hover:text-red-600"
                                        >
                                            {item.label}
                                        </Link>
                                    </DialogClose>
                                ))}
                            </nav>
                        </div>

                        <div className="space-y-3 border-t border-zinc-200 px-5 py-5">
                            <DialogClose asChild>
                                <Link
                                    href="/portal"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:border-red-600 hover:text-red-600"
                                >
                                    <User className="h-4 w-4" />
                                    Mi Cuenta
                                </Link>
                            </DialogClose>
                            <DialogClose asChild>
                                <Link
                                    href="/contacto"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                                >
                                    <Phone className="h-4 w-4" />
                                    Contactar
                                </Link>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    );
}
