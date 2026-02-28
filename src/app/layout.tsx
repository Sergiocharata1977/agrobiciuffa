import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        default: process.env.NEXT_PUBLIC_APP_NAME || 'Proyecto Base',
        template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Proyecto Base'}`,
    },
    description: 'Aplicación multi-tenant con Next.js y Firebase',
    keywords: ['next.js', 'firebase', 'multi-tenant', 'saas'],
    authors: [{ name: 'Tu Empresa' }],
    creator: 'Tu Empresa',
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
