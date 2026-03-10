'use client';

import { useState } from 'react';
import Link from 'next/link';

type ViewMode = 'tarjetas' | 'lista';

interface Equipo {
    id: string;
    tipo: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    anio: number;
    estado: 'Operativo' | 'En revisión' | 'En reparación';
    imagen: string;
}

const EQUIPOS_DEMO: Equipo[] = [
    {
        id: '1',
        tipo: 'Tractor',
        marca: 'CASE IH',
        modelo: 'Puma 185',
        numero_serie: 'JBAH185EX6M123456',
        anio: 2019,
        estado: 'Operativo',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/def9156757604e15aaeb367a9b2da0bf?v=68d3d90f&t=size1200',
    },
    {
        id: '2',
        tipo: 'Cosechadora',
        marca: 'CASE IH',
        modelo: 'Axial-Flow 8250',
        numero_serie: 'CAFE8250YP7A98765',
        anio: 2021,
        estado: 'Operativo',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/5ffa167ef892491cb6bfdfef66f259cd?v=98773893&t=size1900',
    },
    {
        id: '3',
        tipo: 'Pulverizadora',
        marca: 'CASE IH',
        modelo: 'Patriot 250',
        numero_serie: 'CAP250YZAB1B54321',
        anio: 2020,
        estado: 'En revisión',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/5a7bca29a5e7455d94157b309f959568?v=e5b97d4d&t=size1900',
    },
];

const ESTADO_COLORS: Record<string, string> = {
    'Operativo': 'bg-green-50 text-green-700 border-green-200',
    'En revisión': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'En reparación': 'bg-red-50 text-red-700 border-red-200',
};

const TIPO_ICON: Record<string, string> = {
    'Tractor': '🚜',
    'Cosechadora': '🌾',
    'Pulverizadora': '💧',
};

function EquipoCard({ equipo }: { equipo: Equipo }) {
    return (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-red-200 hover:shadow-md transition-all">
            {/* Foto del equipo */}
            <div className="relative h-48 bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={equipo.imagen}
                    alt={`${equipo.marca} ${equipo.modelo}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${ESTADO_COLORS[equipo.estado]}`}>
                    {equipo.estado}
                </span>
            </div>

            {/* Info */}
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-xl flex-shrink-0">
                        {TIPO_ICON[equipo.tipo] ?? '⚙️'}
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-900">{equipo.marca} {equipo.modelo}</p>
                        <p className="text-sm text-zinc-500">{equipo.tipo} · {equipo.anio}</p>
                    </div>
                </div>

                <div className="pt-2 border-t border-zinc-100">
                    <p className="text-xs text-zinc-400 mb-0.5">Nro. de serie</p>
                    <p className="text-sm font-mono text-zinc-700">{equipo.numero_serie}</p>
                </div>

                <div className="flex gap-2 pt-1">
                    <Link
                        href={`/nueva-solicitud?tipo=repuesto&serie=${equipo.numero_serie}&modelo=${equipo.modelo}`}
                        className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-zinc-200 text-zinc-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Pedir repuesto
                    </Link>
                    <Link
                        href={`/nueva-solicitud?tipo=servicio&serie=${equipo.numero_serie}&modelo=${equipo.modelo}`}
                        className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-zinc-200 text-zinc-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Servicio técnico
                    </Link>
                </div>
            </div>
        </div>
    );
}

function EquipoRow({ equipo }: { equipo: Equipo }) {
    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-4 hover:border-red-200 transition-colors">
            <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={equipo.imagen}
                    alt={`${equipo.marca} ${equipo.modelo}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        (el.parentElement as HTMLElement).innerHTML = `<span class="flex h-full w-full items-center justify-center text-xl">${TIPO_ICON[equipo.tipo] ?? '⚙️'}</span>`;
                    }}
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900">{equipo.marca} {equipo.modelo}</p>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{equipo.numero_serie}</p>
            </div>
            <span className="text-xs text-zinc-500 hidden sm:block">{equipo.tipo} · {equipo.anio}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ESTADO_COLORS[equipo.estado]} flex-shrink-0`}>
                {equipo.estado}
            </span>
            <div className="flex gap-2 flex-shrink-0">
                <Link
                    href={`/nueva-solicitud?tipo=repuesto&serie=${equipo.numero_serie}&modelo=${equipo.modelo}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    Repuesto
                </Link>
                <Link
                    href={`/nueva-solicitud?tipo=servicio&serie=${equipo.numero_serie}&modelo=${equipo.modelo}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    Servicio
                </Link>
            </div>
        </div>
    );
}

export default function ProductosPage() {
    const [view, setView] = useState<ViewMode>('tarjetas');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Mis Equipos</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Tus maquinarias registradas en Agro Biciufa
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View toggle */}
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
                        href="/nueva-solicitud?tipo=comercial"
                        className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Cotizar nuevo equipo
                    </Link>
                </div>
            </div>

            {/* Demo notice */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Los equipos que compraste en Agro Biciufa aparecerán aquí. Los siguientes son de ejemplo.
            </div>

            {/* Content */}
            {view === 'tarjetas' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {EQUIPOS_DEMO.map(equipo => (
                        <EquipoCard key={equipo.id} equipo={equipo} />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {EQUIPOS_DEMO.map(equipo => (
                        <EquipoRow key={equipo.id} equipo={equipo} />
                    ))}
                </div>
            )}
        </div>
    );
}
