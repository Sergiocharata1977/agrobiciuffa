'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMisSolicitudes, type SolicitudResumen } from '@/hooks/useMisSolicitudes';

type ViewMode = 'tarjetas' | 'lista';

const ESTADO_LABELS: Record<string, string> = {
    recibida: 'Recibida',
    en_revision: 'En revisión',
    gestionando: 'Gestionando',
    cerrada: 'Cerrada',
    cancelada: 'Cancelada',
};

const ESTADO_COLORS: Record<string, string> = {
    recibida: 'bg-zinc-50 text-zinc-700 border-zinc-200',
    en_revision: 'bg-blue-50 text-blue-700 border-blue-200',
    gestionando: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    cerrada: 'bg-green-50 text-green-700 border-green-200',
    cancelada: 'bg-red-50 text-red-700 border-red-200',
};

function SolicitudCard({ sol }: { sol: SolicitudResumen }) {
    const fecha = new Date(sol.created_at).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-red-200 hover:shadow-sm transition-all space-y-3">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-semibold text-zinc-900 text-sm">
                        Servicio #{sol.numeroSolicitud}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{fecha}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ESTADO_COLORS[sol.estado] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                    {ESTADO_LABELS[sol.estado] ?? sol.estado}
                </span>
            </div>
            {(sol.maquina_tipo || sol.modelo) && (
                <div className="pt-2 border-t border-zinc-100">
                    <p className="text-xs text-zinc-400 mb-0.5">Máquina</p>
                    <p className="text-sm text-zinc-800">
                        {[sol.maquina_tipo, sol.modelo].filter(Boolean).join(' / ')}
                    </p>
                </div>
            )}
            {sol.descripcion_problema && (
                <div>
                    <p className="text-xs text-zinc-400 mb-0.5">Problema reportado</p>
                    <p className="text-sm text-zinc-700 line-clamp-2">{sol.descripcion_problema}</p>
                </div>
            )}
            {sol.localidad && (
                <div>
                    <p className="text-xs text-zinc-400 mb-0.5">Localidad</p>
                    <p className="text-sm text-zinc-700">
                        {sol.localidad}{sol.provincia ? `, ${sol.provincia}` : ''}
                    </p>
                </div>
            )}
        </div>
    );
}

function SolicitudRow({ sol }: { sol: SolicitudResumen }) {
    const fecha = new Date(sol.created_at).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-4 hover:border-red-200 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 flex-shrink-0">
                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 text-sm">#{sol.numeroSolicitud}</p>
                <p className="text-xs text-zinc-400 truncate">
                    {sol.maquina_tipo ? `${sol.maquina_tipo}${sol.modelo ? ` ${sol.modelo}` : ''}` : sol.descripcion_problema ?? '—'}
                </p>
            </div>
            <span className="text-xs text-zinc-400 hidden sm:block flex-shrink-0">{fecha}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${ESTADO_COLORS[sol.estado] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                {ESTADO_LABELS[sol.estado] ?? sol.estado}
            </span>
        </div>
    );
}

export default function ServiciosPage() {
    const { solicitudes, loading, error } = useMisSolicitudes();
    const [view, setView] = useState<ViewMode>('tarjetas');

    const servicios = solicitudes.filter(s => s.tipo === 'servicio');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Servicios Técnicos</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Tus solicitudes de servicio y mantenimiento
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex rounded-lg border border-zinc-200 overflow-hidden text-sm">
                        <button
                            onClick={() => setView('tarjetas')}
                            className={`px-3 py-2 font-medium transition-colors ${view === 'tarjetas' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-500 hover:bg-zinc-50'}`}
                        >
                            Tarjetas
                        </button>
                        <button
                            onClick={() => setView('lista')}
                            className={`px-3 py-2 font-medium transition-colors ${view === 'lista' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-500 hover:bg-zinc-50'}`}
                        >
                            Lista
                        </button>
                    </div>
                    <Link
                        href="/nueva-solicitud?tipo=servicio"
                        className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva solicitud
                    </Link>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-44 bg-zinc-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : servicios.length === 0 ? (
                <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 mx-auto mb-4">
                        <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                    </div>
                    <p className="font-medium text-zinc-600">No tenés solicitudes de servicio técnico</p>
                    <p className="text-sm text-zinc-400 mt-1">Cuando hagas una solicitud, aparecerá aquí.</p>
                    <Link
                        href="/nueva-solicitud?tipo=servicio"
                        className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                        Nueva solicitud de servicio
                    </Link>
                </div>
            ) : view === 'tarjetas' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {servicios.map(sol => (
                        <SolicitudCard key={sol.id} sol={sol} />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {servicios.map(sol => (
                        <SolicitudRow key={sol.id} sol={sol} />
                    ))}
                </div>
            )}
        </div>
    );
}
