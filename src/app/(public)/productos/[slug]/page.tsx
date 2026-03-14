import { notFound } from 'next/navigation';

import { CTASection } from '@/components/institucional/CTASection';
import { PageHeader } from '@/components/institucional/PageHeader';

import { ConsultaCategoriaForm } from '../_components/ConsultaCategoriaForm';
import {
    CATEGORIAS,
    DETALLES_CATEGORIA,
    getCategoriaPorSlug,
} from '../_data';

export const dynamicParams = false;

export function generateStaticParams() {
    return CATEGORIAS.map((categoria) => ({ slug: categoria.slug }));
}

export default function CategoriaProductoPage({
    params,
}: {
    params: { slug: string };
}) {
    const categoria = getCategoriaPorSlug(params.slug);

    if (!categoria) {
        notFound();
    }

    const detalle = DETALLES_CATEGORIA[categoria.slug];

    return (
        <main className="min-h-screen bg-white text-zinc-900">
            <PageHeader
                titulo={categoria.nombre}
                subtitulo={categoria.descripcion}
                imagen_fondo={categoria.imagen_url}
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Productos', href: '/productos' },
                    { label: categoria.nombre },
                ]}
            />

            <section className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">
                                Linea CASE IH
                            </span>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                                {detalle.titulo}
                            </h2>
                            <p className="mt-5 text-base leading-8 text-zinc-600">
                                {detalle.descripcion}
                            </p>

                            <div className="mt-8 grid gap-4">
                                {detalle.beneficios.map((beneficio) => (
                                    <div
                                        key={beneficio}
                                        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4"
                                    >
                                        <p className="text-sm leading-6 text-zinc-700">
                                            {beneficio}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={detalle.imagen_url}
                                alt={detalle.imagen_alt}
                                className="h-full min-h-[320px] w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-zinc-50 py-16">
                <div className="container mx-auto px-6">
                    <ConsultaCategoriaForm
                        categoriaNombre={categoria.nombre}
                        categoriaSlug={categoria.slug}
                    />
                </div>
            </section>

            <CTASection
                titulo="Necesitas repuestos o servicio para tu equipo CASE?"
                subtitulo="Nuestro equipo de posventa puede acompanarte con piezas originales, mantenimiento y soporte tecnico."
                ctas={[{ label: 'Ir a repuestos', href: '/repuestos' }]}
                variante="oscuro"
            />
        </main>
    );
}
