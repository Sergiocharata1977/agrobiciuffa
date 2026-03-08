'use client';

import { useState } from 'react';
import { useMisSolicitudes, type SolicitudResumen } from '@/hooks/useMisSolicitudes';

const ESTADO_LABELS: Record<string, string> = {
    recibida: 'Recibida',
    en_revision: 'En revisión',
    gestionando: 'Gestionando',
    cerrada: 'Cerrada',
    cancelada: 'Cancelada',
};

const TIPO_LABELS: Record<string, string> = {
    repuesto: 'Repuesto',
    servicio: 'Servicio técnico',
    comercial: 'Consulta comercial',
};

const ESTADO_COLORS: Record<string, string> = {
    recibida: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    en_revision: 'bg-blue-50 text-blue-700 border-blue-200',
    gestionando: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    cerrada: 'bg-green-50 text-green-700 border-green-200',
    cancelada: 'bg-red-50 text-red-700 border-red-200',
};

const TIPO_ICON: Record<string, React.ReactNode> = {
    repuesto: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    servicio: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
    ),
    comercial: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
};

function SolicitudDetail({ sol }: { sol: SolicitudResumen }) {
    return (
        <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-3 text-sm">
            <div>
                <p className="text-zinc-400 text-xs mb-0.5">Nombre</p>
                <p className="text-zinc-800">{sol.nombre}</p>
            </div>
            <div>
                <p className="text-zinc-400 text-xs mb-0.5">Teléfono</p>
                <p className="text-zinc-800">{sol.telefono}</p>
            </div>
            {sol.maquina_tipo && (
                <div>
                    <p className="text-zinc-400 text-xs mb-0.5">Máquina</p>
                    <p className="text-zinc-800">{sol.maquina_tipo} {sol.modelo ? `/ ${sol.modelo}` : ''}</p>
                </div>
            )}
            {sol.descripcion_repuesto && (
                <div className="col-span-2">
                    <p className="text-zinc-400 text-xs mb-0.5">Repuesto buscado</p>
                    <p className="text-zinc-800">{sol.descripcion_repuesto}</p>
                </div>
            )}
            {sol.descripcion_problema && (
                <div className="col-span-2">
                    <p className="text-zinc-400 text-xs mb-0.5">Problema</p>
                    <p className="text-zinc-800">{sol.descripcion_problema}</p>
                </div>
            )}
            {sol.localidad && (
                <div>
                    <p className="text-zinc-400 text-xs mb-0.5">Localidad</p>
                    <p className="text-zinc-800">{sol.localidad}{sol.provincia ? `, ${sol.provincia}` : ''}</p>
                </div>
            )}
            {sol.producto_interes && (
                <div className="col-span-2">
                    <p className="text-zinc-400 text-xs mb-0.5">Producto de interés</p>
                    <p className="text-zinc-800">{sol.producto_nombre ?? sol.producto_interes}</p>
                </div>
            )}
            {sol.comentarios && (
                <div className="col-span-2">
                    <p className="text-zinc-400 text-xs mb-0.5">Comentarios</p>
                    <p className="text-zinc-800">{sol.comentarios}</p>
                </div>
            )}
        </div>
    );
}

export default function MisSolicitudesPage() {
    const { solicitudes, loading, error, refetch } = useMisSolicitudes();
    const [filtroEstado, setFiltroEstado] = useState<string>('todos');
    const [filtroTipo, setFiltroTipo] = useState<string>('todos');
    const [expandida, setExpandida] = useState<string | null>(null);

    const filtradas = solicitudes.filter(s => {
        if (filtroEstado !== 'todos' && s.estado !== filtroEstado) return false;
        if (filtroTipo !== 'todos' && s.tipo !== filtroTipo) return false;
        return true;
    });

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900">Mis Solicitudes</h1>
                <p className="text-zinc-500 text-sm mt-1">Seguimiento de todas tus consultas a Agro Biciufa</p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div>
                    <select
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                        className="text-sm border border-zinc-300 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="recibida">Recibida</option>
                        <option value="en_revision">En revisión</option>
                        <option value="gestionando">Gestionando</option>
                        <option value="cerrada">Cerrada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
                <div>
                    <select
                        value={filtroTipo}
                        onChange={e => setFiltroTipo(e.target.value)}
                        className="text-sm border border-zinc-300 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="repuesto">Repuesto</option>
                        <option value="servicio">Servicio técnico</option>
                        <option value="comercial">Consulta comercial</option>
                    </select>
                </div>
                <button
                    onClick={refetch}
                    className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1.5 px-3 py-2 border border-zinc-300 rounded-lg bg-white"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualizar
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-zinc-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && filtradas.length === 0 && (
                <div className="text-center py-16 text-zinc-400">
                    <svg className="h-12 w-12 mx-auto mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="font-medium">
                        {solicitudes.length === 0
                            ? 'No tenés solicitudes registradas'
                            : 'Ninguna solicitud coincide con los filtros'}
                    </p>
                    <p className="text-xs mt-1">
                        {solicitudes.length === 0
                            ? 'Las solicitudes enviadas desde la web aparecerán acá.'
                            : 'Probá cambiando los filtros de arriba.'}
                    </p>
                </div>
            )}

            {/* Lista */}
            {!loading && filtradas.length > 0 && (
                <div className="space-y-3">
                    {filtradas.map(sol => (
                        <div key={sol.id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                            <button
                                onClick={() => setExpandida(expandida === sol.id ? null : sol.id)}
                                className="w-full text-left p-4 flex items-start gap-3 hover:bg-zinc-50 transition-colors"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 flex-shrink-0 mt-0.5">
                                    {TIPO_ICON[sol.tipo]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium text-zinc-900 text-sm">
                                            {TIPO_LABELS[sol.tipo] ?? sol.tipo}
                                        </p>
                                        <span className="text-zinc-400 text-xs">#{sol.numeroSolicitud}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {new Date(sol.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ESTADO_COLORS[sol.estado] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                                        {ESTADO_LABELS[sol.estado] ?? sol.estado}
                                    </span>
                                    <svg
                                        className={`h-4 w-4 text-zinc-400 transition-transform ${expandida === sol.id ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {expandida === sol.id && (
                                <div className="px-4 pb-4">
                                    <SolicitudDetail sol={sol} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
