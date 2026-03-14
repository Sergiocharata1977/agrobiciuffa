import type { Metadata } from 'next';
import {
    BadgeCheck,
    Handshake,
    Lightbulb,
    MapPinned,
    ShieldCheck,
    Wrench,
} from 'lucide-react';

import { CTASection } from '@/components/institucional/CTASection';
import { FortalezaCard } from '@/components/institucional/FortalezaCard';
import { PageHeader } from '@/components/institucional/PageHeader';

export const metadata: Metadata = {
    title: {
        absolute: 'Nosotros | Agro Biciuffa SRL',
    },
    description:
        'Conocé la historia, los valores y la presencia regional de Agro Biciuffa SRL como concesionario oficial CASE IH.',
};

const valores = [
    {
        titulo: 'Integridad',
        descripcion:
            'Construimos relaciones sostenidas en la confianza, el cumplimiento y la palabra asumida con cada productor.',
        icono: <ShieldCheck className="h-5 w-5" />,
    },
    {
        titulo: 'Servicio',
        descripcion:
            'Priorizamos respuestas ágiles, acompañamiento cercano y soluciones concretas para cada necesidad del cliente.',
        icono: <Handshake className="h-5 w-5" />,
    },
    {
        titulo: 'Excelencia técnica',
        descripcion:
            'Trabajamos con equipos preparados, procesos claros y foco permanente en la calidad de cada intervención.',
        icono: <Wrench className="h-5 w-5" />,
    },
    {
        titulo: 'Compromiso regional',
        descripcion:
            'Entendemos la dinámica productiva local y acompañamos el desarrollo del campo con presencia en territorio.',
        icono: <MapPinned className="h-5 w-5" />,
    },
    {
        titulo: 'Innovación',
        descripcion:
            'Incorporamos tecnología, herramientas y nuevas prácticas para mejorar la experiencia y el rendimiento operativo.',
        icono: <Lightbulb className="h-5 w-5" />,
    },
    {
        titulo: 'Transparencia',
        descripcion:
            'Comunicamos alcances, tiempos y alternativas de manera clara para facilitar decisiones bien informadas.',
        icono: <BadgeCheck className="h-5 w-5" />,
    },
];

export default function NosotrosPage() {
    return (
        <>
            <PageHeader
                titulo="Quiénes Somos"
                subtitulo="Concesionario oficial CASE IH con presencia regional"
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Nosotros' },
                ]}
            />

            <section className="bg-white py-16">
                <div className="container mx-auto grid gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="max-w-2xl space-y-6">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                                Historia y misión
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                                Una empresa enfocada en respaldar cada campaña
                            </h2>
                        </div>

                        <p className="text-base leading-7 text-zinc-600">
                            Agro Biciuffa SRL nace con el objetivo de acercar maquinaria, repuestos y
                            soporte especializado a los productores de la región, integrando una mirada
                            comercial con acompañamiento técnico sostenido en el tiempo. Nuestra historia
                            se construye sobre vínculos de largo plazo, atención personalizada y una
                            presencia constante junto al cliente.
                        </p>

                        <p className="text-base leading-7 text-zinc-600">
                            Nuestra misión es brindar soluciones confiables para el trabajo agrícola,
                            combinando el respaldo de CASE IH con un equipo comprometido con la calidad
                            del servicio, la eficiencia operativa y la continuidad productiva.
                        </p>

                        <p className="text-base leading-7 text-zinc-600">
                            Asumimos el compromiso de acompañar al productor antes, durante y después de
                            cada operación, entendiendo que la respuesta oportuna y el conocimiento del
                            terreno son parte central del valor que entregamos.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-sm">
                        <img
                            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"
                            alt="Instalaciones y taller de Agro Biciuffa"
                            className="h-full min-h-[320px] w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-zinc-50 py-16">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                            Cultura de trabajo
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                            Nuestros valores
                        </h2>
                        <p className="mt-4 text-base leading-7 text-zinc-600">
                            Principios que orientan cada decisión comercial, técnica y de atención al
                            cliente.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {valores.map((valor) => (
                            <div
                                key={valor.titulo}
                                className="rounded-3xl border border-zinc-200 bg-white shadow-sm"
                            >
                                <FortalezaCard
                                    icono={valor.icono}
                                    titulo={valor.titulo}
                                    descripcion={valor.descripcion}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="container mx-auto grid gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                                Cobertura y presencia
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                                Cercanía operativa para dar respuesta en tiempo real
                            </h2>
                        </div>

                        <p className="text-base leading-7 text-zinc-600">
                            Acompañamos a productores, contratistas y empresas agropecuarias de la zona
                            con atención comercial, repuestos originales y servicio técnico coordinado
                            para responder con rapidez según la etapa de trabajo y la criticidad del
                            equipo.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                    Dirección
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-700">
                                    [placeholder] Dirección comercial de Agro Biciuffa
                                </p>
                            </div>
                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                    Teléfono
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-700">
                                    [placeholder] Teléfono principal
                                </p>
                            </div>
                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                    Horarios
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-700">
                                    Lun-Vie 8 a 18 hs
                                    <br />
                                    Sáb 8 a 13 hs
                                </p>
                            </div>
                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                    Alcance
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-700">
                                    Cobertura regional con atención comercial y técnica coordinada según
                                    la necesidad de cada cliente.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-sm">
                        <iframe
                            title="Mapa de cobertura Agro Biciuffa"
                            src="https://www.google.com/maps?q=Ubicaci%C3%B3n%20de%20Agro%20Biciuffa&z=13&output=embed"
                            className="h-[420px] w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>

            <CTASection
                variante="rojo"
                titulo="¿Querés trabajar con nosotros?"
                subtitulo="Ponete en contacto con nuestro equipo para consultas comerciales, institucionales o de soporte."
                ctas={[{ label: 'Ir a contacto', href: '/contacto' }]}
            />
        </>
    );
}
