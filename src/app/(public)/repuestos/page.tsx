import type { Metadata } from 'next';
import { Package, Search, Truck } from 'lucide-react';

import { CTASection } from '@/components/institucional/CTASection';
import { FormRepuestoSection } from '@/components/institucional/FormRepuestoSection';
import { FortalezaCard } from '@/components/institucional/FortalezaCard';
import { PageHeader } from '@/components/institucional/PageHeader';

export const metadata: Metadata = {
    title: {
        absolute: 'Repuestos Originales | Agro Biciuffa SRL',
    },
    description:
        'Consultá disponibilidad, identificación técnica y asesoramiento para repuestos originales CASE IH.',
};

const fortalezas = [
    {
        titulo: 'Stock Disponible',
        descripcion: 'Inventario permanente de piezas de alta rotación.',
        icono: <Package className="h-5 w-5" />,
    },
    {
        titulo: 'Identificación Técnica',
        descripcion: 'Asesoramiento para identificar correctamente el repuesto por modelo y serie.',
        icono: <Search className="h-5 w-5" />,
    },
    {
        titulo: 'Respuesta Rápida',
        descripcion: 'Optimizamos los tiempos para minimizar la parada del equipo.',
        icono: <Truck className="h-5 w-5" />,
    },
];

export default function RepuestosPage() {
    return (
        <>
            <PageHeader
                titulo="Repuestos Originales"
                subtitulo="Identificación, disponibilidad y asesoramiento técnico para tu equipo CASE IH"
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Repuestos' },
                ]}
            />

            <section className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                            Repuestos originales con respaldo de marca
                        </h2>
                        <p className="mt-4 text-base leading-7 text-zinc-600">
                            Contamos con repuestos originales CASE IH para toda la línea de maquinaria. Si no
                            tenemos el repuesto en stock, lo gestionamos.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {fortalezas.map((fortaleza) => (
                            <div
                                key={fortaleza.titulo}
                                className="rounded-3xl border border-zinc-200 bg-zinc-50 shadow-sm"
                            >
                                <FortalezaCard
                                    icono={fortaleza.icono}
                                    titulo={fortaleza.titulo}
                                    descripcion={fortaleza.descripcion}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FormRepuestoSection />

            <CTASection
                variante="oscuro"
                titulo="¿Necesitás servicio técnico para tu equipo?"
                subtitulo="Coordinamos diagnóstico y atención especializada para mantener tu maquinaria operativa."
                ctas={[{ label: 'Ir a servicio técnico', href: '/servicio-tecnico' }]}
            />
        </>
    );
}
