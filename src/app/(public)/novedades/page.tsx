import type { Metadata } from 'next';
import { CalendarDays, Newspaper } from 'lucide-react';

import { PageHeader } from '@/components/institucional/PageHeader';
import { getAdminDb } from '@/firebase/admin';
import type { Novedad } from '@/types/institucional';

export const metadata: Metadata = {
    title: {
        absolute: 'Novedades | Agro Biciuffa SRL',
    },
    description:
        'Campanas, lanzamientos y novedades institucionales de Agro Biciuffa.',
};

type FirestoreNovedad = Partial<Novedad> & {
    imagen?: string;
    contenido?: string;
};

function toIsoString(value: unknown): string {
    if (typeof value === 'string' && value.trim()) {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof value.toDate === 'function'
    ) {
        return value.toDate().toISOString();
    }

    return new Date(0).toISOString();
}

function formatFecha(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Fecha no disponible';
    }

    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

async function getNovedades(): Promise<Novedad[]> {
    try {
        const snapshot = await getAdminDb()
            .collection('novedades')
            .where('publicada', '==', true)
            .orderBy('publicada_at', 'desc')
            .limit(12)
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data() as FirestoreNovedad;

            return {
                id: doc.id,
                slug: typeof data.slug === 'string' ? data.slug : doc.id,
                titulo:
                    typeof data.titulo === 'string' && data.titulo.trim()
                        ? data.titulo
                        : 'Novedad institucional',
                resumen:
                    typeof data.resumen === 'string' && data.resumen.trim()
                        ? data.resumen
                        : 'Pronto compartiremos mas informacion sobre esta novedad.',
                cuerpo:
                    typeof data.cuerpo === 'string'
                        ? data.cuerpo
                        : typeof data.contenido === 'string'
                          ? data.contenido
                          : '',
                imagen_url:
                    typeof data.imagen_url === 'string' && data.imagen_url.trim()
                        ? data.imagen_url
                        : typeof data.imagen === 'string'
                          ? data.imagen
                          : undefined,
                publicada: true,
                publicada_at: toIsoString(data.publicada_at ?? data.created_at),
                created_at: toIsoString(data.created_at),
                tags: Array.isArray(data.tags)
                    ? data.tags.filter(
                          (tag): tag is string => typeof tag === 'string'
                      )
                    : [],
            };
        });
    } catch (error) {
        console.error('Error loading novedades page:', error);
        return [];
    }
}

export default async function NovedadesPage() {
    const novedades = await getNovedades();

    return (
        <main className="min-h-screen bg-white text-zinc-900">
            <PageHeader
                titulo="Novedades"
                subtitulo="Campanas, lanzamientos y novedades de Agro Biciuffa"
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Novedades' },
                ]}
            />

            <section className="bg-white py-16">
                <div className="container mx-auto px-6">
                    {novedades.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {novedades.map((novedad) => (
                                <article
                                    key={novedad.id}
                                    className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1"
                                >
                                    <div className="bg-zinc-100">
                                        {novedad.imagen_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={novedad.imagen_url}
                                                alt={novedad.titulo}
                                                className="h-56 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-56 items-center justify-center bg-zinc-100 text-zinc-400">
                                                <Newspaper className="h-12 w-12" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                                            <CalendarDays className="h-4 w-4" />
                                            <span>{formatFecha(novedad.publicada_at)}</span>
                                        </div>

                                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
                                            {novedad.titulo}
                                        </h2>
                                        <p className="mt-3 text-sm leading-7 text-zinc-600">
                                            {novedad.resumen}
                                        </p>

                                        <a
                                            href="#"
                                            className="mt-6 inline-flex text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                                        >
                                            Leer mas
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
                                <Newspaper className="h-8 w-8" />
                            </div>
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900">
                                Proximamente
                            </h2>
                            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
                                Novedades institucionales, campanas y eventos.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
