import type { Metadata } from 'next';

import { PublicSiteShell } from '@/components/layout/PublicSiteShell';

import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Agro Biciuffa SRL — Concesionario Oficial CASE IH',
        template: '%s | Agro Biciuffa SRL',
    },
    description:
        'Concesionario oficial CASE IH en Argentina. Venta de maquinaria agrícola, repuestos originales y servicio técnico especializado. Acompañamos al productor antes, durante y después de la compra.',
    keywords: [
        'CASE IH',
        'maquinaria agrícola',
        'tractores',
        'cosechadoras',
        'repuestos agrícolas',
        'servicio técnico agrícola',
        'concesionario CASE IH Argentina',
        'Agro Biciuffa',
    ],
    authors: [{ name: 'Agro Biciuffa SRL' }],
    creator: 'Agro Biciuffa SRL',
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'es_AR',
        siteName: 'Agro Biciuffa SRL',
        title: 'Agro Biciuffa SRL — Concesionario Oficial CASE IH',
        description:
            'Maquinaria agrícola, repuestos originales y servicio técnico CASE IH. Concesionario oficial en Argentina.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body
                className="bg-white text-zinc-900 antialiased"
                style={{ fontFamily: "Arial, 'Helvetica Neue', sans-serif" }}
            >
                <PublicSiteShell>{children}</PublicSiteShell>
            </body>
        </html>
    );
}
