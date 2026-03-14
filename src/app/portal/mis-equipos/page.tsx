'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, Package, Plus, Tractor, Wrench } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { EquipoCliente } from '@/types/clientes';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('portal_token');
}

const TIPO_ICON: Record<string, React.ReactNode> = {
    Tractor: <Tractor className="h-8 w-8 text-red-600" />,
    Cosechadora: <Package className="h-8 w-8 text-red-600" />,
    Pulverizadora: <Wrench className="h-8 w-8 text-red-600" />,
};

function EquipoCard({ equipo }: { equipo: EquipoCliente }) {
    const router = useRouter();
    const icon = TIPO_ICON[equipo.tipo] ?? <Tractor className="h-8 w-8 text-zinc-400" />;

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-zinc-900">
                        {equipo.marca} {equipo.modelo}
                        {equipo.anio ? ` (${equipo.anio})` : ''}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">Serie: {equipo.numero_serie}</p>
                    <span className="mt-2 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600">
                        {equipo.tipo}
                    </span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            `/nueva-solicitud?tipo=repuesto&serie=${encodeURIComponent(equipo.numero_serie)}&modelo=${encodeURIComponent(equipo.modelo)}`
                        )
                    }
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                >
                    <Package className="h-4 w-4" />
                    Pedir repuesto
                </button>
                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            `/nueva-solicitud?tipo=servicio&serie=${encodeURIComponent(equipo.numero_serie)}&modelo=${encodeURIComponent(equipo.modelo)}`
                        )
                    }
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                    <Wrench className="h-4 w-4" />
                    Servicio tecnico
                </button>
            </div>
        </div>
    );
}

const TIPOS_EQUIPO = ['Tractor', 'Cosechadora', 'Pulverizadora', 'Implemento', 'Otro'];

function AgregarEquipoModal({
    onClose,
    onAdded,
}: {
    onClose: () => void;
    onAdded: () => void;
}) {
    const [form, setForm] = useState({
        numero_serie: '',
        marca: 'CASE IH',
        modelo: '',
        anio: '',
        tipo: 'Tractor',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = getToken();
            const body = {
                numero_serie: form.numero_serie.trim(),
                marca: form.marca.trim(),
                modelo: form.modelo.trim(),
                tipo: form.tipo,
                ...(form.anio ? { anio: parseInt(form.anio, 10) } : {}),
            };

            const response = await fetch('/api/portal/mis-equipos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(body),
            });

            const data = (await response.json()) as { success?: boolean; error?: string };

            if (!response.ok || data.success === false) {
                throw new Error(data.error ?? 'No se pudo registrar el equipo.');
            }

            onAdded();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
            <div className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl">
                <h2 className="text-lg font-semibold text-zinc-900">Agregar equipo</h2>
                <p className="mt-1 text-sm text-zinc-500">
                    Registra tu equipo para hacer solicitudes mas rapido.
                </p>

                <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-700">
                            Numero de serie *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.numero_serie}
                            onChange={e => setForm(f => ({ ...f, numero_serie: e.target.value }))}
                            placeholder="Ej: ZCF150000"
                            className="h-11 w-full rounded-xl border border-zinc-300 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-700">Marca</label>
                            <input
                                type="text"
                                value={form.marca}
                                onChange={e => setForm(f => ({ ...f, marca: e.target.value }))}
                                className="h-11 w-full rounded-xl border border-zinc-300 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-700">Modelo *</label>
                            <input
                                type="text"
                                required
                                value={form.modelo}
                                onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))}
                                placeholder="Ej: Puma 185"
                                className="h-11 w-full rounded-xl border border-zinc-300 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-700">Año</label>
                            <input
                                type="number"
                                min="1980"
                                max={new Date().getFullYear() + 1}
                                value={form.anio}
                                onChange={e => setForm(f => ({ ...f, anio: e.target.value }))}
                                placeholder="2020"
                                className="h-11 w-full rounded-xl border border-zinc-300 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-700">Tipo *</label>
                            <select
                                value={form.tipo}
                                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                                className="h-11 w-full rounded-xl border border-zinc-300 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            >
                                {TIPOS_EQUIPO.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error ? (
                        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    ) : null}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 rounded-xl border border-zinc-300 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-11 rounded-xl bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MisEquiposPage() {
    const [equipos, setEquipos] = useState<EquipoCliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadEquipos = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            const response = await fetch('/api/portal/mis-equipos', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                cache: 'no-store',
            });
            const data = (await response.json()) as {
                equipos?: EquipoCliente[];
                error?: string;
            };
            if (!response.ok) throw new Error(data.error ?? 'No se pudieron cargar los equipos.');
            setEquipos(data.equipos ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadEquipos();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            <div className="mx-auto max-w-lg px-4 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Mis equipos</h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            {equipos.length > 0
                                ? `${equipos.length} equipo${equipos.length !== 1 ? 's' : ''} registrado${equipos.length !== 1 ? 's' : ''}`
                                : 'Registra tus equipos para hacer solicitudes mas rapido.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="flex h-11 items-center gap-2 rounded-2xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar
                    </button>
                </div>

                {error ? (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                ) : null}

                <div className="mt-6 space-y-4">
                    {loading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-40 animate-pulse rounded-2xl border border-zinc-200 bg-white"
                            />
                        ))
                    ) : equipos.length > 0 ? (
                        equipos.map(equipo => <EquipoCard key={equipo.id} equipo={equipo} />)
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
                            <Tractor className="h-12 w-12 text-zinc-300" />
                            <p className="mt-4 text-base font-medium text-zinc-600">
                                Todavia no registraste ningun equipo
                            </p>
                            <p className="mt-2 text-sm text-zinc-400">
                                Agrega tu tractor, cosechadora o pulverizadora para hacer solicitudes mas rapido.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowModal(true)}
                                className={cn(
                                    'mt-6 flex h-11 items-center gap-2 rounded-2xl bg-red-600 px-5 text-sm font-medium text-white',
                                    'transition hover:bg-red-700'
                                )}
                            >
                                <Plus className="h-4 w-4" />
                                Agregar primer equipo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal ? (
                <AgregarEquipoModal
                    onClose={() => setShowModal(false)}
                    onAdded={() => void loadEquipos()}
                />
            ) : null}
        </div>
    );
}
