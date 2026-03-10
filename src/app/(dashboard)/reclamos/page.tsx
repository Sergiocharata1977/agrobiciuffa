'use client';

import Link from 'next/link';

const CATEGORIAS = [
    {
        id: 'equipo',
        titulo: 'Problema con el equipo',
        descripcion: 'Falla mecánica, hidráulica, electrónica u operativa. Te derivamos a nuestro equipo de Servicio Técnico.',
        href: '/nueva-solicitud?tipo=servicio',
        destino: 'Servicio Técnico',
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        cardHover: 'hover:border-amber-300 hover:bg-amber-50/30',
    },
    {
        id: 'repuesto',
        titulo: 'Repuesto dañado o incorrecto',
        descripcion: 'Recibiste un repuesto en mal estado, equivocado o diferente a lo solicitado.',
        href: '/nueva-solicitud?tipo=repuesto',
        destino: 'Repuestos',
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        iconBg: 'bg-red-50',
        iconColor: 'text-red-500',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
        cardHover: 'hover:border-red-300 hover:bg-red-50/30',
    },
    {
        id: 'comercial',
        titulo: 'Reclamo comercial',
        descripcion: 'Inconvenientes con garantía, financiación, facturación, entrega o condiciones de la compra.',
        href: '/nueva-solicitud?tipo=comercial',
        destino: 'Área Comercial',
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        cardHover: 'hover:border-blue-300 hover:bg-blue-50/30',
    },
    {
        id: 'sugerencia',
        titulo: 'Queja o sugerencia general',
        descripcion: 'Querés compartir tu experiencia, hacer una sugerencia de mejora o reportar algo que no encaja en las categorías anteriores.',
        href: '/nueva-solicitud?tipo=comercial',
        destino: 'Área de Calidad',
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-500',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        cardHover: 'hover:border-purple-300 hover:bg-purple-50/30',
    },
];

export default function ReclamosPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Reclamos y Problemas</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Elegí la categoría que mejor describe tu situación para que podamos ayudarte más rápido.
                </p>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 flex items-start gap-3">
                <svg className="h-5 w-5 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-zinc-600">
                    Todos los reclamos son gestionados en el orden en que se reciben. Nuestro equipo te contactará a la brevedad.
                </p>
            </div>

            {/* Categorías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIAS.map((cat) => (
                    <Link
                        key={cat.id}
                        href={cat.href}
                        className={`group bg-white rounded-xl border border-zinc-200 p-6 transition-all ${cat.cardHover} hover:shadow-sm`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.iconBg} ${cat.iconColor} flex-shrink-0`}>
                                {cat.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-zinc-900">{cat.titulo}</p>
                                </div>
                                <p className="text-sm text-zinc-500 leading-relaxed">{cat.descripcion}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                                        → {cat.destino}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Urgencia */}
            <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4">
                <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-red-800 text-sm">¿Es urgente?</p>
                        <p className="text-sm text-red-700 mt-0.5">
                            Para situaciones críticas que paralizan la operación, comunicate directamente con nuestro equipo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
