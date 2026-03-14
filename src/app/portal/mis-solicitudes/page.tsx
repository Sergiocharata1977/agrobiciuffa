'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Package2, Plus, RefreshCw, Wrench } from 'lucide-react';

import { usePortalAuth } from '@/components/portal/PortalAuthProvider';
import type { SolicitudAdmin } from '@/types/admin';

type FiltroTipo = 'todas' | 'servicio' | 'repuesto';

const TAB_OPTIONS: Array<{ key: FiltroTipo; label: string }> = [
    { key: 'todas', label: 'Todas' },
    { key: 'servicio', label: 'Servicios' },
    { key: 'repuesto', label: 'Repuestos' },
];

const ESTADO_LABELS: Record<string, string> = {
    nueva: 'Nueva',
    diagnostico: 'Diagnóstico',
    presupuestada: 'Presupuestada',
    aprobada: 'Aprobada',
    en_trabajo: 'En trabajo',
    completada: 'Completada',
    verificando_stock: 'Verificando stock',
    cotizada: 'Cotizada',
    en_preparacion: 'En preparación',
    entregada: 'Entregada',
};

const ESTADO_STYLES: Record<string, string> = {
    nueva: 'border-slate-200 bg-slate-100 text-slate-700',
    diagnostico: 'border-sky-200 bg-sky-100 text-sky-700',
    presupuestada: 'border-violet-200 bg-violet-100 text-violet-700',
    aprobada: 'border-emerald-200 bg-emerald-100 text-emerald-700',
    en_trabajo: 'border-amber-200 bg-amber-100 text-amber-700',
    completada: 'border-green-200 bg-green-100 text-green-700',
    verificando_stock: 'border-cyan-200 bg-cyan-100 text-cyan-700',
    cotizada: 'border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700',
    en_preparacion: 'border-orange-200 bg-orange-100 text-orange-700',
    entregada: 'border-lime-200 bg-lime-100 text-lime-700',
};

const TIPO_STYLES: Record<SolicitudAdmin['tipo'], string> = {
    servicio: 'bg-[#fff4f4] text-[#c8102e]',
    repuesto: 'bg-amber-100 text-amber-800',
    comercial: 'bg-zinc-100 text-zinc-700',
};

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Fecha sin registrar';
    }

    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function getEquipoLabel(solicitud: SolicitudAdmin): string {
    if (solicitud.equipo_modelo && solicitud.equipo_serie) {
        return `${solicitud.equipo_modelo} · ${solicitud.equipo_serie}`;
    }

    return solicitud.equipo_modelo ?? solicitud.equipo_serie ?? 'Equipo sin especificar';
}

function getTipoLabel(tipo: SolicitudAdmin['tipo']): string {
    if (tipo === 'servicio') {
        return 'Servicio';
    }

    if (tipo === 'repuesto') {
        return 'Repuesto';
    }

    return 'Comercial';
}

function TipoIcon({ tipo }: { tipo: SolicitudAdmin['tipo'] }) {
    if (tipo === 'servicio') {
        return <Wrench className="h-5 w-5" />;
    }

    if (tipo === 'repuesto') {
        return <Package2 className="h-5 w-5" />;
    }

    return <ClipboardList className="h-5 w-5" />;
}

export default function PortalMisSolicitudesPage() {
    const { user, loading: authLoading } = usePortalAuth();
    const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtro, setFiltro] = useState<FiltroTipo>('todas');

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            setSolicitudes([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const loadSolicitudes = async () => {
            try {
                setLoading(true);
                setError('');

                const token = localStorage.getItem('portal_token');
                if (!token) {
                    throw new Error('Tu sesión expiró. Iniciá sesión nuevamente.');
                }

                const response = await fetch('/api/portal/mis-solicitudes', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                const data = (await response.json()) as {
                    solicitudes?: SolicitudAdmin[];
                    error?: string;
                };

                if (!response.ok) {
                    throw new Error(data.error ?? 'No se pudieron cargar las solicitudes.');
                }

                setSolicitudes(Array.isArray(data.solicitudes) ? data.solicitudes : []);
            } catch (fetchError) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : 'No se pudieron cargar las solicitudes.'
                );
                setSolicitudes([]);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadSolicitudes();

        return () => {
            controller.abort();
        };
    }, [authLoading, user]);

    const solicitudesFiltradas = useMemo(
        () =>
            solicitudes.filter((solicitud) =>
                filtro === 'todas' ? true : solicitud.tipo === filtro
            ),
        [filtro, solicitudes]
    );

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-28 pt-6">
            <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fff7f2] via-white to-[#ffe7d1] p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c8102e]">
                    Portal cliente
                </p>
                <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-950">
                            Mis solicitudes
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                            Revisá el estado de tus pedidos de servicio y repuestos
                            en un solo lugar.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-zinc-600 shadow-sm transition hover:text-zinc-900"
                        aria-label="Actualizar solicitudes"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </section>

            <section className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {TAB_OPTIONS.map((tab) => {
                    const isActive = filtro === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setFiltro(tab.key)}
                            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                                isActive
                                    ? 'bg-[#c8102e] text-white shadow-sm'
                                    : 'bg-white text-zinc-600 ring-1 ring-zinc-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </section>

            {error ? (
                <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <section className="mt-5 space-y-3">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className="h-36 animate-pulse rounded-[24px] bg-white shadow-sm ring-1 ring-zinc-200"
                        />
                    ))}
                </section>
            ) : null}

            {!loading && solicitudesFiltradas.length > 0 ? (
                <section className="mt-5 space-y-4">
                    {solicitudesFiltradas.map((solicitud) => (
                        <article
                            key={solicitud.id}
                            className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-zinc-200"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                                    <TipoIcon tipo={solicitud.tipo} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${TIPO_STYLES[solicitud.tipo]}`}
                                        >
                                            {getTipoLabel(solicitud.tipo)}
                                        </span>
                                        <span
                                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${ESTADO_STYLES[solicitud.estado] ?? 'border-zinc-200 bg-zinc-100 text-zinc-700'}`}
                                        >
                                            {ESTADO_LABELS[solicitud.estado] ?? solicitud.estado}
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        <p className="truncate text-base font-semibold text-zinc-900">
                                            {getEquipoLabel(solicitud)}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                                            {formatDate(solicitud.created_at)}
                                        </p>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                                        {solicitud.descripcion?.trim() || 'Sin descripción adicional.'}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            ) : null}

            {!loading && solicitudesFiltradas.length === 0 ? (
                <section className="mt-8 flex flex-1 items-center">
                    <div className="w-full rounded-[28px] border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff4f4] text-[#c8102e]">
                            <ClipboardList className="h-8 w-8" />
                        </div>
                        <h2 className="mt-5 text-xl font-semibold text-zinc-900">
                            Todavía no tenés solicitudes.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                            ¿Necesitás repuestos o servicio técnico?
                        </p>
                    </div>
                </section>
            ) : null}

            <Link
                href="/nueva-solicitud"
                className="fixed bottom-20 right-4 inline-flex items-center gap-2 rounded-full bg-[#c8102e] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-300/60 transition hover:bg-red-700"
            >
                <Plus className="h-4 w-4" />
                Nueva solicitud
            </Link>
        </main>
    );
}
