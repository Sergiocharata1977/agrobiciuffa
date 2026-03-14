import Link from 'next/link';
import { Ban } from 'lucide-react';

export default function AdminUnauthorizedPage() {
    return (
        <div
            className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 text-zinc-900"
            style={{ fontFamily: 'system-ui, Arial, sans-serif' }}
        >
            <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
                    <Ban className="h-6 w-6" />
                </div>

                <h1 className="mt-6 text-3xl font-semibold">No tenes acceso a esta seccion</h1>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                    Tu usuario no tiene permisos suficientes para entrar en este modulo del panel
                    administrativo.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href="/admin/login"
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                        Volver al login
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                    >
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
