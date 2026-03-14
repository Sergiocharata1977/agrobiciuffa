'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { AlertCircle, RefreshCcw, Search, Wrench } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { EstadoSolicitudServicio, SolicitudAdmin } from '@/types/admin';

const COLUMN_ORDER: EstadoSolicitudServicio[] = [
    'nueva',
    'diagnostico',
    'presupuestada',
    'aprobada',
    'en_trabajo',
    'completada',
];

const COLUMN_META: Record<
    EstadoSolicitudServicio,
    {
        title: string;
        description: string;
        columnClassName: string;
        badgeClassName: string;
        badgeVariant: 'secondary' | 'warning' | 'info' | 'success' | 'destructive' | 'outline';
    }
> = {
    nueva: {
        title: 'Nueva',
        description: 'Ingreso inicial del servicio.',
        columnClassName: 'border-zinc-200 bg-white',
        badgeClassName: 'border-zinc-200 bg-zinc-100 text-zinc-700',
        badgeVariant: 'secondary',
    },
    diagnostico: {
        title: 'Diagnostico',
        description: 'Revision tecnica en curso.',
        columnClassName: 'border-blue-200 bg-blue-50/70',
        badgeClassName: 'border-blue-200 bg-blue-100 text-blue-700',
        badgeVariant: 'info',
    },
    presupuestada: {
        title: 'Presupuestada',
        description: 'Pendiente de definicion comercial.',
        columnClassName: 'border-amber-200 bg-amber-50/70',
        badgeClassName: 'border-amber-200 bg-amber-100 text-amber-700',
        badgeVariant: 'warning',
    },
    aprobada: {
        title: 'Aprobada',
        description: 'Trabajo autorizado por el cliente.',
        columnClassName: 'border-red-200 bg-red-50/70',
        badgeClassName: 'border-red-200 bg-red-100 text-red-700',
        badgeVariant: 'destructive',
    },
    en_trabajo: {
        title: 'En trabajo',
        description: 'Orden actualmente en taller.',
        columnClassName: 'border-zinc-300 bg-zinc-100/80',
        badgeClassName: 'border-zinc-300 bg-zinc-900 text-white',
        badgeVariant: 'outline',
    },
    completada: {
        title: 'Completada',
        description: 'Servicio finalizado.',
        columnClassName: 'border-emerald-200 bg-emerald-50/80',
        badgeClassName: 'border-emerald-200 bg-emerald-100 text-emerald-700',
        badgeVariant: 'success',
    },
};

type KanbanState = Record<EstadoSolicitudServicio, SolicitudAdmin[]>;

type DragData = {
    solicitudId: string;
    fromColumn: EstadoSolicitudServicio;
};

function createEmptyBoard(): KanbanState {
    return {
        nueva: [],
        diagnostico: [],
        presupuestada: [],
        aprobada: [],
        en_trabajo: [],
        completada: [],
    };
}

function isEstadoSolicitudServicio(value: string): value is EstadoSolicitudServicio {
    return COLUMN_ORDER.includes(value as EstadoSolicitudServicio);
}

function normalizeSolicitudes(solicitudes: SolicitudAdmin[]): KanbanState {
    return solicitudes.reduce<KanbanState>((acc, solicitud) => {
        const estado = isEstadoSolicitudServicio(solicitud.estado)
            ? solicitud.estado
            : 'nueva';

        acc[estado].push({
            ...solicitud,
            estado,
        });

        return acc;
    }, createEmptyBoard());
}

function getDragData(data: Record<string, unknown>): DragData | null {
    const solicitudId = data.solicitudId;
    const fromColumn = data.fromColumn;

    if (
        typeof solicitudId === 'string' &&
        typeof fromColumn === 'string' &&
        isEstadoSolicitudServicio(fromColumn)
    ) {
        return { solicitudId, fromColumn };
    }

    return null;
}

function moveSolicitud(
    currentBoard: KanbanState,
    solicitudId: string,
    fromColumn: EstadoSolicitudServicio,
    toColumn: EstadoSolicitudServicio
): KanbanState {
    if (fromColumn === toColumn) {
        return currentBoard;
    }

    const sourceItems = currentBoard[fromColumn];
    const movedItem = sourceItems.find(item => item.id === solicitudId);

    if (!movedItem) {
        return currentBoard;
    }

    return {
        ...currentBoard,
        [fromColumn]: sourceItems.filter(item => item.id !== solicitudId),
        [toColumn]: [
            {
                ...movedItem,
                estado: toColumn,
            },
            ...currentBoard[toColumn].filter(item => item.id !== solicitudId),
        ],
    };
}

function parseDate(value: unknown): Date | null {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed;
        }
    }

    if (typeof value === 'object' && value !== null) {
        const withSeconds = value as { seconds?: unknown; _seconds?: unknown };
        const seconds =
            typeof withSeconds.seconds === 'number'
                ? withSeconds.seconds
                : typeof withSeconds._seconds === 'number'
                    ? withSeconds._seconds
                    : null;

        if (seconds !== null) {
            const parsed = new Date(seconds * 1000);
            if (!Number.isNaN(parsed.getTime())) {
                return parsed;
            }
        }
    }

    return null;
}

function formatRelativeDate(value: unknown): string {
    const parsed = parseDate(value);

    if (!parsed) {
        return 'Fecha no disponible';
    }

    return formatDistanceToNow(parsed, {
        addSuffix: true,
        locale: es,
    });
}

function truncateText(value: string | undefined, limit: number): string {
    if (!value) {
        return 'Sin descripcion cargada.';
    }

    if (value.length <= limit) {
        return value;
    }

    return `${value.slice(0, limit).trimEnd()}...`;
}

function getToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.localStorage.getItem('admin_token');
}

function LoadingBoard() {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMN_ORDER.map(column => (
                <div
                    key={column}
                    className="min-h-[520px] min-w-[280px] rounded-3xl border border-zinc-200 bg-white p-4"
                >
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="mt-3 h-4 w-44" />
                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-40 rounded-2xl" />
                        <Skeleton className="h-36 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ServicioCard({
    solicitud,
}: {
    solicitud: SolicitudAdmin & { estado: EstadoSolicitudServicio };
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        return draggable({
            element,
            getInitialData: () => ({
                solicitudId: solicitud.id,
                fromColumn: solicitud.estado,
            }),
        });
    }, [solicitud.id, solicitud.estado]);

    const estadoMeta = COLUMN_META[solicitud.estado];
    const equipo = [solicitud.equipo_modelo, solicitud.equipo_serie]
        .filter(Boolean)
        .join(' / ');

    return (
        <div
            ref={ref}
            className="cursor-grab rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                        {solicitud.cliente_nombre || 'Cliente sin nombre'}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                        {equipo || 'Equipo sin modelo ni serie'}
                    </p>
                </div>
                <Badge
                    variant={estadoMeta.badgeVariant}
                    className={cn('shrink-0 border', estadoMeta.badgeClassName)}
                >
                    {estadoMeta.title}
                </Badge>
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-700">
                {truncateText(solicitud.descripcion, 80)}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
                <span>{formatRelativeDate(solicitud.created_at)}</span>
                {solicitud.cliente_id ? (
                    <Link
                        href={`/admin/clientes/${solicitud.cliente_id}`}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1 font-medium text-red-700 transition hover:bg-red-100"
                    >
                        Ver cliente
                    </Link>
                ) : null}
            </div>
        </div>
    );
}

function Column({
    column,
    solicitudes,
    onMove,
}: {
    column: EstadoSolicitudServicio;
    solicitudes: (SolicitudAdmin & { estado: EstadoSolicitudServicio })[];
    onMove: (args: {
        solicitudId: string;
        fromColumn: EstadoSolicitudServicio;
        toColumn: EstadoSolicitudServicio;
    }) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isOver, setIsOver] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        return dropTargetForElements({
            element,
            getData: () => ({ column }),
            canDrop: ({ source }) => getDragData(source.data) !== null,
            onDragEnter: () => setIsOver(true),
            onDragLeave: () => setIsOver(false),
            onDrop: ({ source }) => {
                setIsOver(false);

                const dragData = getDragData(source.data);

                if (!dragData || dragData.fromColumn === column) {
                    return;
                }

                onMove({
                    solicitudId: dragData.solicitudId,
                    fromColumn: dragData.fromColumn,
                    toColumn: column,
                });
            },
        });
    }, [column, onMove]);

    const meta = COLUMN_META[column];

    return (
        <section
            ref={ref}
            className={cn(
                'min-h-[540px] min-w-[280px] rounded-3xl border p-4 transition',
                meta.columnClassName,
                isOver && 'border-red-400 ring-2 ring-red-200'
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-900">{meta.title}</h2>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{meta.description}</p>
                </div>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                    {solicitudes.length}
                </span>
            </div>

            <div className="mt-5 space-y-3">
                {solicitudes.length > 0 ? (
                    solicitudes.map(solicitud => (
                        <ServicioCard key={solicitud.id} solicitud={solicitud} />
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-4 py-8 text-center text-sm text-zinc-500">
                        Sin servicios en esta etapa.
                    </div>
                )}
            </div>
        </section>
    );
}

export default function AdminTallerPage() {
    const [board, setBoard] = useState<KanbanState>(createEmptyBoard);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const loadSolicitudes = async (showLoader: boolean) => {
        if (showLoader) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setError(null);

        try {
            const token = getToken();
            const response = await fetch('/api/admin/solicitudes?tipo=servicio', {
                headers: token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {},
                cache: 'no-store',
            });

            const data = (await response.json()) as {
                success?: boolean;
                error?: string;
                solicitudes?: SolicitudAdmin[];
            };

            if (!response.ok) {
                throw new Error(data.error || 'No se pudieron cargar las solicitudes.');
            }

            setBoard(normalizeSolicitudes(data.solicitudes ?? []));
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : 'No se pudieron cargar las solicitudes.'
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        void loadSolicitudes(true);
    }, []);

    const filteredBoard = useMemo<KanbanState>(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return board;
        }

        return COLUMN_ORDER.reduce<KanbanState>((acc, column) => {
            acc[column] = board[column].filter(solicitud => {
                const cliente = solicitud.cliente_nombre.toLowerCase();
                const serie = (solicitud.equipo_serie ?? '').toLowerCase();

                return cliente.includes(term) || serie.includes(term);
            });

            return acc;
        }, createEmptyBoard());
    }, [board, search]);

    const totalServicios = COLUMN_ORDER.reduce(
        (total, column) => total + board[column].length,
        0
    );

    const handleMove = async ({
        solicitudId,
        fromColumn,
        toColumn,
    }: {
        solicitudId: string;
        fromColumn: EstadoSolicitudServicio;
        toColumn: EstadoSolicitudServicio;
    }) => {
        const previousBoard = board;
        const nextBoard = moveSolicitud(previousBoard, solicitudId, fromColumn, toColumn);

        if (nextBoard === previousBoard) {
            return;
        }

        setBoard(nextBoard);
        setError(null);

        try {
            const token = getToken();
            const response = await fetch(`/api/admin/solicitudes/${solicitudId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ estado: toColumn }),
            });

            const data = (await response.json()) as {
                success?: boolean;
                error?: string;
            };

            if (!response.ok || data.success === false) {
                throw new Error(data.error || 'No se pudo actualizar el estado.');
            }
        } catch (updateError) {
            setBoard(previousBoard);
            setError(
                updateError instanceof Error
                    ? updateError.message
                    : 'No se pudo actualizar el estado.'
            );
        }
    };

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                            <Wrench className="h-3.5 w-3.5" />
                            Taller
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                                Kanban de servicios tecnicos
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                                Gestion operativa de solicitudes reales de taller, con cambios de
                                estado por arrastre y seguimiento rapido por cliente o serie.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Buscar por cliente o serie"
                                className="h-11 w-full rounded-2xl border border-zinc-300 bg-white pl-9 pr-4 text-sm text-zinc-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:w-72"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadSolicitudes(false)}
                            disabled={loading || refreshing}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCcw
                                className={cn('h-4 w-4', refreshing && 'animate-spin')}
                            />
                            Actualizar
                        </button>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-700">
                        Total en tablero: <span className="font-semibold text-zinc-950">{totalServicios}</span>
                    </div>
                    {search.trim() ? (
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-700">
                            Filtro activo: <span className="font-semibold text-zinc-950">{search.trim()}</span>
                        </div>
                    ) : null}
                </div>
            </header>

            {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            ) : null}

            {loading ? (
                <LoadingBoard />
            ) : (
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4">
                        {COLUMN_ORDER.map(column => (
                            <Column
                                key={column}
                                column={column}
                                solicitudes={
                                    filteredBoard[column] as (SolicitudAdmin & {
                                        estado: EstadoSolicitudServicio;
                                    })[]
                                }
                                onMove={handleMove}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
