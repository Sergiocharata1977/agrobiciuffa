import { CTASection } from '@/components/institucional/CTASection';
import { CategoriaCard } from '@/components/institucional/CategoriaCard';
import { PageHeader } from '@/components/institucional/PageHeader';

import { CATEGORIAS_DESTACADAS, CATEGORIAS_ORDENADAS } from './_data';

export default function ProductosPage() {
    return (
        <main className="min-h-screen bg-white text-zinc-900">
            <PageHeader
                titulo="Linea de Productos"
                subtitulo="Maquinaria CASE IH para cada necesidad del productor"
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Productos' },
                ]}
            />

            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">
                            Categorias destacadas
                        </span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                            Equipos clave para el trabajo diario
                        </h2>
                        <p className="mt-4 text-base leading-7 text-zinc-600">
                            Recorre las lineas principales CASE IH y encuentra la
                            categoria que mejor se adapta a tu operacion.
                        </p>
                    </div>

                    <div className="mt-12 grid justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {CATEGORIAS_DESTACADAS.map((categoria) => (
                            <CategoriaCard
                                key={categoria.slug}
                                slug={categoria.slug}
                                nombre={categoria.nombre}
                                descripcion={categoria.descripcion}
                                imagen_url={categoria.imagen_url}
                                href={`/productos/${categoria.slug}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-zinc-50 py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">
                            Catalogo completo
                        </span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                            Todas las categorias CASE IH
                        </h2>
                        <p className="mt-4 text-base leading-7 text-zinc-600">
                            Explora tractores, cosechadoras, pulverizadores,
                            sembradoras y soluciones conectadas con foco comercial y
                            posventa.
                        </p>
                    </div>

                    <div className="mt-12 grid justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {CATEGORIAS_ORDENADAS.map((categoria) => (
                            <div key={categoria.slug} id={categoria.slug}>
                                <CategoriaCard
                                    slug={categoria.slug}
                                    nombre={categoria.nombre}
                                    descripcion={categoria.descripcion}
                                    imagen_url={categoria.imagen_url}
                                    href={`/productos/${categoria.slug}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection
                titulo="No encontras lo que buscas? Consulta con un asesor"
                subtitulo="Te ayudamos a identificar la linea de productos y la configuracion mas conveniente para tu operacion."
                ctas={[{ label: 'Ir a contacto', href: '/contacto?area=ventas' }]}
                variante="rojo"
            />
        </main>
    );
}
