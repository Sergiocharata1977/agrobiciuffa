'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    Bot,
    FileText,
    MessageCircle,
    Phone,
    Plus,
    Tractor,
    User,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useMisSolicitudes, type SolicitudResumen } from '@/hooks/useMisSolicitudes';
import type { DonMarioMessage } from '@/types/donmario';

const ESTADO_LABELS: Record<string, string> = {
    recibida: 'Recibida',
    en_revision: 'En revision',
    gestionando: 'Gestionando',
    cerrada: 'Cerrada',
    cancelada: 'Cancelada',
};

const TIPO_LABELS: Record<string, string> = {
    repuesto: 'Repuesto',
    servicio: 'Servicio tecnico',
    comercial: 'Consulta comercial',
};

const ESTADO_COLORS: Record<string, string> = {
    recibida: 'bg-zinc-100 text-zinc-700',
    en_revision: 'bg-blue-50 text-blue-700',
    gestionando: 'bg-amber-50 text-amber-700',
    cerrada: 'bg-emerald-50 text-emerald-700',
    cancelada: 'bg-red-50 text-red-700',
};

const EQUIPOS_DEMO_COUNT = 3;
const CHAT_STORAGE_KEYS = [
    'don_mario_history',
    'donMarioHistory',
    'don_mario_messages',
    'donMarioMessages',
    'portal_don_mario_history',
];

function formatCurrentDate(date: Date) {
    return new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(date);
}

function formatRelativeDate(value: string) {
    const date = new Date(value);
    const diffMs = date.getTime() - Date.now();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (Math.abs(diffMinutes) < 60) {
        return new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(diffMinutes, 'minute');
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
        return new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(diffHours, 'hour');
    }

    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 7) {
        return new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(diffDays, 'day');
    }

    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function getEquipoLabel(solicitud: SolicitudResumen) {
    const parts = [solicitud.maquina_tipo, solicitud.modelo].filter(Boolean);
    if (parts.length > 0) {
        return parts.join(' / ');
    }

    if (solicitud.producto_nombre) {
        return solicitud.producto_nombre;
    }

    if (solicitud.producto_interes) {
        return solicitud.producto_interes;
    }

    return 'Sin equipo asociado';
}

function readChatPreview(): DonMarioMessage[] {
    for (const key of CHAT_STORAGE_KEYS) {
        const raw = window.localStorage.getItem(key);
        if (!raw) {
            continue;
        }

        try {
            const parsed = JSON.parse(raw) as unknown;
            if (!Array.isArray(parsed)) {
                continue;
            }

            const messages = parsed.filter((item): item is DonMarioMessage => {
                if (!item || typeof item !== 'object') {
                    return false;
                }

                const candidate = item as Partial<DonMarioMessage>;
                return (
                    (candidate.role === 'user' || candidate.role === 'assistant') &&
                    typeof candidate.content === 'string'
                );
            });

            if (messages.length > 0) {
                return messages.slice(-2);
            }
        } catch {
            continue;
        }
    }

    return [];
}

function QuickActionCard({
    href,
    icon,
    title,
    subtitle,
    badge,
    highlighted = false,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: string;
    highlighted?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group rounded-2xl border p-4 transition-all ${
                highlighted
                    ? 'border-red-200 bg-red-600 text-white shadow-sm hover:bg-red-700'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        highlighted ? 'bg-white/15 text-white' : 'bg-zinc-100 text-zinc-700'
                    }`}
                >
                    {icon}
                </div>
                {badge ? (
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            highlighted ? 'bg-white text-red-600' : 'bg-zinc-900 text-white'
                        }`}
                    >
                        {badge}
                    </span>
                ) : null}
            </div>
            <div className="mt-5">
                <h3 className={`text-sm font-semibold ${highlighted ? 'text-white' : 'text-zinc-900'}`}>{title}</h3>
                <p className={`mt-1 text-sm ${highlighted ? 'text-red-50' : 'text-zinc-500'}`}>{subtitle}</p>
            </div>
        </Link>
    );
}

export default function DashboardPage() {
    const { user, firebaseUser } = useAuth();
    const { solicitudes, loading, error } = useMisSolicitudes();
    const [chatPreview, setChatPreview] = useState<DonMarioMessage[]>([]);

    useEffect(() => {
        setChatPreview(readChatPreview());
    }, []);

    const nombreCompleto = user?.displayName || firebaseUser?.displayName || 'Cliente';
    const primerNombre = nombreCompleto.split(' ')[0] || 'Cliente';
    const pendientes = solicitudes.filter((s) => ['recibida', 'en_revision', 'gestionando'].includes(s.estado)).length;
    const recientes = solicitudes.slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                    <section className="rounded-3xl bg-zinc-900 px-6 py-7 text-white">
                        <p className="text-sm text-zinc-400">Portal del cliente</p>
                        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Hola, {primerNombre}!</h1>
                                <p className="mt-2 max-w-2xl text-sm text-zinc-300">
                                    Revisa tus gestiones, accede rapido a tus equipos y conversa con Don Mario.
                                </p>
                            </div>
                            <p className="text-sm capitalize text-zinc-400">{formatCurrentDate(new Date())}</p>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">Accesos rapidos</h2>
                                <p className="text-sm text-zinc-500">Lo que mas usas del portal, a un toque.</p>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <QuickActionCard
                                href="/mis-solicitudes"
                                icon={<FileText className="h-5 w-5" />}
                                title="Mis Solicitudes"
                                subtitle="Seguimiento de pedidos y consultas."
                                badge={loading ? '...' : `${pendientes} pendientes`}
                            />
                            <QuickActionCard
                                href="/mis-equipos"
                                icon={<Tractor className="h-5 w-5" />}
                                title="Mis Equipos"
                                subtitle="Tus maquinas registradas y accesos directos."
                                badge={`${EQUIPOS_DEMO_COUNT} equipos`}
                            />
                            <QuickActionCard
                                href="/nueva-solicitud"
                                icon={<Plus className="h-5 w-5" />}
                                title="Nueva Solicitud"
                                subtitle="Carga un pedido de repuesto, servicio o consulta."
                                highlighted
                            />
                            <QuickActionCard
                                href="/mi-cuenta"
                                icon={<User className="h-5 w-5" />}
                                title="Mi Perfil"
                                subtitle="Actualiza tus datos y preferencias."
                            />
                        </div>
                    </section>

                    <section className="rounded-3xl border border-zinc-200 bg-white p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">Solicitudes recientes</h2>
                                <p className="text-sm text-zinc-500">Tus ultimas 3 gestiones registradas.</p>
                            </div>
                            <Link
                                href="/mis-solicitudes"
                                className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                            >
                                Ver todas
                            </Link>
                        </div>

                        {error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : loading ? (
                            <div className="space-y-3">
                                {[0, 1, 2].map((item) => (
                                    <div key={item} className="h-24 animate-pulse rounded-2xl bg-zinc-100" />
                                ))}
                            </div>
                        ) : recientes.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center">
                                <p className="text-sm font-medium text-zinc-700">
                                    Todavia no tenes solicitudes. Necesitas algo?
                                </p>
                                <Link
                                    href="/nueva-solicitud"
                                    className="mt-3 inline-flex rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                                >
                                    Crear solicitud
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recientes.map((solicitud) => (
                                    <article
                                        key={solicitud.id}
                                        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white">
                                                        {TIPO_LABELS[solicitud.tipo] ?? solicitud.tipo}
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            ESTADO_COLORS[solicitud.estado] ?? 'bg-zinc-100 text-zinc-700'
                                                        }`}
                                                    >
                                                        {ESTADO_LABELS[solicitud.estado] ?? solicitud.estado}
                                                    </span>
                                                </div>
                                                <p className="mt-3 text-sm font-semibold text-zinc-900">
                                                    {getEquipoLabel(solicitud)}
                                                </p>
                                                <p className="mt-1 text-sm text-zinc-500">
                                                    Solicitud #{solicitud.numeroSolicitud}
                                                </p>
                                            </div>
                                            <p className="text-sm text-zinc-500">{formatRelativeDate(solicitud.created_at)}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-3xl border border-red-100 bg-gradient-to-b from-red-50 to-white p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">Don Mario</h2>
                                <p className="text-sm text-zinc-500">Asistente digital contextual</p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-zinc-600">
                            Tu asistente digital. Consulta sobre repuestos, servicio tecnico o el estado de tus solicitudes.
                        </p>

                        <Link
                            href="/asistente"
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Chatear con Don Mario
                        </Link>

                        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Ultimos mensajes</p>
                            {chatPreview.length === 0 ? (
                                <p className="mt-3 text-sm text-zinc-500">
                                    No hay una sesion activa guardada en este dispositivo.
                                </p>
                            ) : (
                                <div className="mt-3 space-y-3">
                                    {chatPreview.map((message, index) => (
                                        <div key={`${message.role}-${index}`} className="rounded-2xl bg-zinc-50 p-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                                {message.role === 'user' ? 'Vos' : 'Don Mario'}
                                            </p>
                                            <p className="mt-1 line-clamp-3 text-sm text-zinc-700">
                                                {message.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-zinc-200 bg-white p-5">
                        <h2 className="text-lg font-semibold text-zinc-900">Contacto rapido</h2>
                        <p className="mt-1 text-sm text-zinc-500">Canales directos para atencion comercial y soporte.</p>

                        <div className="mt-5 space-y-3">
                            <a
                                href="tel:+543492500000"
                                className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">Telefono</p>
                                    <p className="text-sm text-zinc-500">+54 3492 50-0000</p>
                                </div>
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                                    <Phone className="h-4 w-4" />
                                </span>
                            </a>

                            <a
                                href="https://wa.me/543492500000?text=Hola%20Agro%20Biciufa,%20necesito%20ayuda%20desde%20el%20portal."
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">WhatsApp</p>
                                    <p className="text-sm text-zinc-500">Escribenos para una respuesta rapida</p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    Abrir chat
                                </span>
                            </a>
                        </div>

                        <div className="mt-5 rounded-2xl bg-zinc-900 px-4 py-4 text-sm text-zinc-200">
                            Atencion: Lun-Vie 8-18 / Sab 8-13
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
