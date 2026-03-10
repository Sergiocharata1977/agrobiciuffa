'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FormSolicitud } from '@/components/forms/FormSolicitud';

export default function NuevaSolicitudPage() {
    const { user, firebaseUser } = useAuth();

    const initialValues = {
        nombre: user?.displayName || firebaseUser?.displayName || '',
        email: user?.email || firebaseUser?.email || '',
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <Link
                    href="/dashboard"
                    className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                    ← Volver al inicio
                </Link>
                <h1 className="text-2xl font-bold text-zinc-900 mt-2">Nueva Solicitud</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Completá el formulario para enviarnos tu consulta o pedido.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <FormSolicitud initialValues={initialValues} />
            </div>
        </div>
    );
}
