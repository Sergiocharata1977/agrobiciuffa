'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMisSolicitudes } from '@/hooks/useMisSolicitudes';

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
    recibida: 'bg-zinc-100 text-zinc-700',
    en_revision: 'bg-blue-100 text-blue-700',
    gestionando: 'bg-yellow-100 text-yellow-700',
    cerrada: 'bg-green-100 text-green-700',
    cancelada: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
    const { user, firebaseUser } = useAuth();
    const { solicitudes, loading } = useMisSolicitudes();

    const displayName = user?.displayName || firebaseUser?.displayName || 'Cliente';

    const pendientes = solicitudes.filter(s => ['recibida', 'en_revision', 'gestionando'].includes(s.estado)).length;
    const cerradas = solicitudes.filter(s => s.estado === 'cerrada').length;
    const recientes = solicitudes.slice(0, 3);

    return (
        <div className="max-w-3xl space-y-6">
            {/* Welcome */}
            <div className="bg-zinc-900 rounded-2xl p-6 text-white">
                <p className="text-zinc-400 text-sm mb-1">Bienvenido</p>
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-zinc-400 text-sm mt-1">
                    Desde acá podés hacer seguimiento de tus solicitudes a Agro Biciufa.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center">
                    <p className="text-3xl font-bold text-zinc-900">{loading ? '—' : solicitudes.length}</p>
                    <p className="text-sm text-zinc-500 mt-1">Total solicitudes</p>
                </div>
                <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center">
                    <p className="text-3xl font-bold text-yellow-600">{loading ? '—' : pendientes}</p>
                    <p className="text-sm text-zinc-500 mt-1">En gestión</p>
                </div>
                <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center">
                    <p className="text-3xl font-bold text-green-600">{loading ? '—' : cerradas}</p>
                    <p className="text-sm text-zinc-500 mt-1">Resueltas</p>
                </div>
            </div>

            {/* Recent solicitudes */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-zinc-900">Últimas solicitudes</h3>
                    <Link href="/mis-solicitudes" className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Ver todas →
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-14 bg-zinc-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : recientes.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                        <svg className="h-10 w-10 mx-auto mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm">Todavía no tenés solicitudes registradas con este email.</p>
                        <p className="text-xs text-zinc-400 mt-1">Cuando enviés un formulario desde la web, aparecerán acá.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {recientes.map(sol => (
                            <div key={sol.id} className="py-3 flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-900">
                                        {TIPO_LABELS[sol.tipo] ?? sol.tipo}
                                        <span className="text-zinc-400 font-normal ml-2">#{sol.numeroSolicitud}</span>
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {new Date(sol.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ESTADO_COLORS[sol.estado] ?? 'bg-zinc-100 text-zinc-600'}`}>
                                    {ESTADO_LABELS[sol.estado] ?? sol.estado}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-4">
                <a
                    href="/#solicitud"
                    className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200 p-4 hover:border-red-300 hover:bg-red-50 transition-colors group"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-zinc-900 text-sm">Nueva solicitud</p>
                        <p className="text-xs text-zinc-500">Ir al formulario</p>
                    </div>
                </a>

                <Link
                    href="/mi-cuenta"
                    className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200 p-4 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-zinc-900 text-sm">Mi cuenta</p>
                        <p className="text-xs text-zinc-500">Ver mis datos</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
