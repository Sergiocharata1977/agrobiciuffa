'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FormSolicitud } from '@/components/forms/FormSolicitud';

const TIPO_LABELS: Record<string, string> = {
    repuesto: 'Solicitud de Repuesto',
    servicio: 'Solicitud de Servicio Técnico',
    comercial: 'Consulta Comercial',
};

const TIPO_BACK: Record<string, string> = {
    repuesto: '/repuestos',
    servicio: '/servicios',
    comercial: '/mis-equipos',
};

function NuevaSolicitudForm() {
    const { user, firebaseUser } = useAuth();
    const searchParams = useSearchParams();

    const tipoParam = searchParams.get('tipo') as 'repuesto' | 'servicio' | 'comercial' | null;
    const modeloParam = searchParams.get('modelo') ?? '';
    const serieParam = searchParams.get('serie') ?? '';

    const initialTab = tipoParam ?? 'comercial';
    const titulo = TIPO_LABELS[initialTab] ?? 'Nueva Solicitud';
    const backHref = TIPO_BACK[initialTab] ?? '/dashboard';

    const initialValues = {
        nombre: user?.displayName || firebaseUser?.displayName || '',
        email: user?.email || firebaseUser?.email || '',
        modelo: modeloParam,
        numero_serie: serieParam,
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <Link
                    href={backHref}
                    className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                    ← Volver
                </Link>
                <h1 className="text-2xl font-bold text-zinc-900 mt-2">{titulo}</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Completá el formulario para enviarnos tu consulta o pedido.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <FormSolicitud
                    initialValues={initialValues}
                    initialTab={initialTab}
                    hidePersonalData
                />
            </div>
        </div>
    );
}

export default function NuevaSolicitudPage() {
    return (
        <Suspense>
            <NuevaSolicitudForm />
        </Suspense>
    );
}
