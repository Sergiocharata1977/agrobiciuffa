import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const serviceLinks = [
    { label: 'Productos', href: '/productos' },
    { label: 'Repuestos', href: '/repuestos' },
    { label: 'Servicio Técnico', href: '/servicio-tecnico' },
    { label: 'Financiación', href: '/financiacion' },
    { label: 'Usados (próximamente)', href: '/productos#usados' },
];

const companyLinks = [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Novedades', href: '/novedades' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Área de Clientes', href: '/portal' },
    { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
];

export function FooterInstitucional() {
    return (
        <footer className="bg-zinc-900 text-white/70">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
                <div className="space-y-5">
                    <div>
                        <p className="text-2xl font-black tracking-[-0.08em] text-white">
                            AGRO<span className="text-red-600">BICIUFFA</span>
                        </p>
                        <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.32em] text-white/40">
                            SRL
                        </p>
                    </div>
                    <p className="max-w-xs text-sm leading-6">
                        Concesionario oficial CASE IH. Venta de maquinaria, repuestos originales y servicio técnico especializado.
                    </p>
                    <div className="flex items-center gap-3">
                        <Link
                            href="#"
                            aria-label="Facebook"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-red-600 hover:text-white"
                        >
                            <Facebook className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#"
                            aria-label="Instagram"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-red-600 hover:text-white"
                        >
                            <Instagram className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div>
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-white">Servicios</h2>
                    <nav className="space-y-3 text-sm">
                        {serviceLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block transition-colors hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-white">Empresa</h2>
                    <nav className="space-y-3 text-sm">
                        {companyLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block transition-colors hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-white">Contacto</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                            <span>[placeholder] Dirección comercial a configurar con datos reales</span>
                        </div>
                        <div className="flex gap-3">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                            <span>[placeholder] Teléfono principal</span>
                        </div>
                        <div className="flex gap-3">
                            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                            <Link href="https://wa.me/54XXXXXXXXX" className="transition-colors hover:text-white">
                                WhatsApp comercial
                            </Link>
                        </div>
                        <div className="flex gap-3">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                            <span>[placeholder] Email de contacto</span>
                        </div>
                        <p>Horario: Lun-Vie 8 a 18 hs / Sáb 8 a 13 hs</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <p>Copyright 2026 Agro Biciuffa SRL. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/politica-de-privacidad" className="transition-colors hover:text-white">
                            Política de Privacidad
                        </Link>
                        <Link href="/aviso-legal" className="transition-colors hover:text-white">
                            Aviso Legal
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
