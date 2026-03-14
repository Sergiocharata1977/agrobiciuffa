'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMisSolicitudes, type SolicitudResumen } from '@/hooks/useMisSolicitudes';
import { FormSolicitud } from '@/components/forms/FormSolicitud';
import {
    getRepuestosPorCategoria,
    type RepuestoFrecuente,
} from '@/data/repuestos-frecuentes';

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

const CATEGORIA_BADGE_COLORS: Record<RepuestoFrecuente['categoria'], string> = {
    Filtros: 'bg-blue-50 text-blue-700 border-blue-200',
    'Correas y Transmisión': 'bg-amber-50 text-amber-700 border-amber-200',
    Lubricantes: 'bg-green-50 text-green-700 border-green-200',
    Sensores: 'bg-purple-50 text-purple-700 border-purple-200',
    Pulverización: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

function RepuestoRow({ item, mobile = false }: { item: RepuestoFrecuente; mobile?: boolean }) {
    const href = `/nueva-solicitud?tipo=repuesto&repuesto=${encodeURIComponent(item.part_number)}&desc=${encodeURIComponent(item.descripcion)}`;

    if (mobile) {
        return (
            <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-semibold text-zinc-800">
                                {item.part_number}
                            </code>
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${CATEGORIA_BADGE_COLORS[item.categoria]}`}>
                                {item.categoria}
                            </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-zinc-900">{item.descripcion}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{item.compatibilidad}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                            ~USD {item.precio_usd_ref} · {item.unidad}
                        </p>
                    </div>
                    <Link
                        href={href}
                        className="inline-flex rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:border-red-200 hover:text-red-600"
                    >
                        Solicitar
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <tr className="border-t border-zinc-100">
            <td className="px-4 py-3 align-top">
                <div className="space-y-1">
                    <code className="text-xs font-semibold text-zinc-800">{item.part_number}</code>
                    <div>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${CATEGORIA_BADGE_COLORS[item.categoria]}`}>
                            {item.categoria}
                        </span>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-zinc-900">{item.descripcion}</td>
            <td className="px-4 py-3 align-top text-sm text-zinc-500">
                <p className="max-w-xs truncate">{item.compatibilidad}</p>
            </td>
            <td className="px-4 py-3 align-top text-sm text-zinc-600">
                ~USD {item.precio_usd_ref}
                <span className="text-zinc-400"> / {item.unidad}</span>
            </td>
            <td className="px-4 py-3 align-top">
                <Link
                    href={href}
                    className="inline-flex rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:border-red-200 hover:text-red-600"
                >
                    Solicitar
                </Link>
            </td>
        </tr>
    );
}

function SolicitudCard({ sol }: { sol: SolicitudResumen }) {
    const fecha = new Date(sol.created_at).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-red-200 hover:shadow-sm transition-all space-y-3">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-semibold text-zinc-900 text-sm">Repuesto #{sol.numeroSolicitud}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{fecha}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ESTADO_COLORS[sol.estado] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                    {ESTADO_LABELS[sol.estado] ?? sol.estado}
                </span>
            </div>
            {(sol.maquina_tipo || sol.modelo) && (
                <div className="pt-2 border-t border-zinc-100">
                    <p className="text-xs text-zinc-400 mb-0.5">Máquina</p>
                    <p className="text-sm text-zinc-800">{[sol.maquina_tipo, sol.modelo].filter(Boolean).join(' / ')}</p>
                </div>
            )}
            {sol.descripcion_repuesto && (
                <div>
                    <p className="text-xs text-zinc-400 mb-0.5">Repuesto buscado</p>
                    <p className="text-sm text-zinc-700 line-clamp-2">{sol.descripcion_repuesto}</p>
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 flex-shrink-0">
                <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 text-sm">#{sol.numeroSolicitud}</p>
                <p className="text-xs text-zinc-400 truncate">
                    {sol.maquina_tipo ? `${sol.maquina_tipo}${sol.modelo ? ` ${sol.modelo}` : ''}` : sol.descripcion_repuesto ?? '—'}
                </p>
            </div>
            <span className="text-xs text-zinc-400 hidden sm:block flex-shrink-0">{fecha}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${ESTADO_COLORS[sol.estado] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                {ESTADO_LABELS[sol.estado] ?? sol.estado}
            </span>
        </div>
    );
}

const REPUESTOS_DEMO: SolicitudResumen[] = [
    {
        id: 'demo-1', numeroSolicitud: '0042', tipo: 'repuesto', estado: 'gestionando',
        nombre: '', email: '', telefono: '',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        maquina_tipo: 'Tractor', modelo: 'Puma 185',
        descripcion_repuesto: 'Filtro de aceite motor CNH p/n 84229862',
    },
    {
        id: 'demo-2', numeroSolicitud: '0038', tipo: 'repuesto', estado: 'cerrada',
        nombre: '', email: '', telefono: '',
        created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        maquina_tipo: 'Cosechadora', modelo: 'Axial-Flow 8250',
        descripcion_repuesto: 'Correa de variador, 2 unidades',
    },
    {
        id: 'demo-3', numeroSolicitud: '0031', tipo: 'repuesto', estado: 'recibida',
        nombre: '', email: '', telefono: '',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        maquina_tipo: 'Pulverizadora', modelo: 'Patriot 250',
        descripcion_repuesto: 'Pastilla difusora TeeJet 11004 (pack x20)',
    },
];

function NuevaSolicitudModal({ onClose, initialValues }: { onClose: () => void; initialValues: { nombre: string; email: string } }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h2 className="font-bold text-zinc-900 text-lg">Nueva solicitud de repuesto</h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5">
                    <FormSolicitud
                        initialValues={initialValues}
                        initialTab="repuesto"
                        hidePersonalData
                    />
                </div>
            </div>
        </div>
    );
}

export default function RepuestosPage() {
    const { user, firebaseUser } = useAuth();
    const { solicitudes, loading, error } = useMisSolicitudes();
    const [view, setView] = useState<ViewMode>('tarjetas');
    const [showModal, setShowModal] = useState(false);

    const nombre = user?.displayName || firebaseUser?.displayName || '';
    const email = user?.email || firebaseUser?.email || '';

    const apiRepuestos = solicitudes.filter(s => s.tipo === 'repuesto');
    const repuestos = !loading && (error || apiRepuestos.length === 0) ? REPUESTOS_DEMO : apiRepuestos;
    const isDemo = !loading && (error || apiRepuestos.length === 0);
    const repuestosFrecuentes = Object.values(getRepuestosPorCategoria()).flat();

    return (
        <div className="space-y-6">
            {showModal && (
                <NuevaSolicitudModal
                    onClose={() => setShowModal(false)}
                    initialValues={{ nombre, email }}
                />
            )}

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Solicitudes de Repuestos</h1>
                    <p className="text-sm text-zinc-500 mt-1">Tus pedidos de repuestos y piezas</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex rounded-lg border border-zinc-200 overflow-hidden text-sm">
                        <button onClick={() => setView('tarjetas')} className={`px-3 py-2 font-medium transition-colors ${view === 'tarjetas' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-500 hover:bg-zinc-50'}`}>Tarjetas</button>
                        <button onClick={() => setView('lista')} className={`px-3 py-2 font-medium transition-colors ${view === 'lista' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-500 hover:bg-zinc-50'}`}>Lista</button>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva solicitud
                    </button>
                </div>
            </div>

            {isDemo && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    Los siguientes son ejemplos. Tus solicitudes aparecerán aquí cuando las registres.
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-100 rounded-xl animate-pulse" />)}
                </div>
            ) : repuestos.length === 0 ? (
                <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 mx-auto mb-4">
                        <svg className="h-7 w-7 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                    </div>
                    <p className="font-medium text-zinc-600">No tenés solicitudes de repuestos</p>
                    <p className="text-sm text-zinc-400 mt-1">Cuando hagas una solicitud, aparecerá aquí.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                        Nueva solicitud de repuesto
                    </button>
                </div>
            ) : view === 'tarjetas' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {repuestos.map(sol => <SolicitudCard key={sol.id} sol={sol} />)}
                </div>
            ) : (
                <div className="space-y-2">
                    {repuestos.map(sol => <SolicitudRow key={sol.id} sol={sol} />)}
                </div>
            )}

            {/* Repuestos frecuentes */}
            <div className="border-t border-zinc-200 pt-6">
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-zinc-900">Repuestos frecuentes CASE IH</h2>
                    <p className="mt-0.5 text-sm text-zinc-500">
                        Referencia rápida de part numbers y precios orientativos
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-4 py-3">Part Number</th>
                                    <th className="px-4 py-3">Descripción</th>
                                    <th className="px-4 py-3">Compatibilidad</th>
                                    <th className="px-4 py-3">Precio ref.</th>
                                    <th className="px-4 py-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repuestosFrecuentes.map(item => (
                                    <RepuestoRow key={item.id} item={item} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-zinc-100 md:hidden">
                        {repuestosFrecuentes.map(item => (
                            <RepuestoRow key={item.id} item={item} mobile />
                        ))}
                    </div>
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                    Precios orientativos para demo. Disponibilidad y precio final sujetos a stock.
                </p>
            </div>
        </div>
    );
}
