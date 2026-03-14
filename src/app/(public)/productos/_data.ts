import type { CategoriaProducto, SlugCategoria } from '@/types/institucional';

export const CATEGORIAS: CategoriaProducto[] = [
    {
        slug: 'tractores',
        nombre: 'Tractores',
        descripcion: 'Series Puma, Maxxum, Farmall y Magnum para toda escala de trabajo agricola.',
        destacado: true,
        orden: 1,
        imagen_url:
            'https://images.unsplash.com/photo-1605648816402-9988184e1b82?q=80&w=1200&auto=format&fit=crop',
    },
    {
        slug: 'cosechadoras',
        nombre: 'Cosechadoras',
        descripcion: 'Axial-Flow, tecnologia de flujo axial para maxima eficiencia de cosecha.',
        destacado: true,
        orden: 2,
        imagen_url:
            'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    },
    {
        slug: 'pulverizadores',
        nombre: 'Pulverizadores',
        descripcion: 'Patriot, pulverizadores autopropulsados de alta precision.',
        destacado: true,
        orden: 3,
        imagen_url:
            'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=1200&auto=format&fit=crop',
    },
    {
        slug: 'sembradoras',
        nombre: 'Sembradoras',
        descripcion: 'Early Riser, sembradoras de precision para siembra directa.',
        destacado: false,
        orden: 4,
        imagen_url:
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop',
    },
    {
        slug: 'heno-forraje',
        nombre: 'Heno y Forraje',
        descripcion: 'Equipos para corte, acondicionamiento y empaque de forraje.',
        destacado: false,
        orden: 5,
        imagen_url:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    },
    {
        slug: 'tecnologia-precision',
        nombre: 'Tecnologia de Precision',
        descripcion: 'AFS Connect, conectividad, monitoreo y gestion de datos agronomicos.',
        destacado: false,
        orden: 6,
        imagen_url:
            'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1200&auto=format&fit=crop',
    },
];

export const CATEGORIAS_ORDENADAS = [...CATEGORIAS].sort((a, b) => a.orden - b.orden);
export const CATEGORIAS_DESTACADAS = CATEGORIAS_ORDENADAS.filter((categoria) => categoria.destacado);

type DetalleCategoria = {
    titulo: string;
    descripcion: string;
    beneficios: string[];
    imagen_url: string;
    imagen_alt: string;
};

export const DETALLES_CATEGORIA: Record<SlugCategoria, DetalleCategoria> = {
    tractores: {
        titulo: 'Potencia escalable para cada etapa del trabajo',
        descripcion:
            'La linea de tractores CASE IH combina las series Puma, Maxxum, Farmall y Magnum para cubrir desde labores mixtas hasta planteos de alta demanda. Cada plataforma prioriza eficiencia de consumo, confort de cabina y capacidad de traccion para mantener ritmo estable durante toda la jornada.',
        beneficios: [
            'Series Puma, Maxxum, Farmall y Magnum para distintas escalas operativas.',
            'Cabinas confortables con mandos intuitivos y mejor visibilidad.',
            'Configuraciones versatiles para siembra, transporte y trabajos intensivos.',
        ],
        imagen_url:
            'https://images.unsplash.com/photo-1605648816402-9988184e1b82?q=80&w=1400&auto=format&fit=crop',
        imagen_alt: 'Tractor CASE IH trabajando en el campo',
    },
    cosechadoras: {
        titulo: 'Cosecha eficiente con tecnologia de flujo axial',
        descripcion:
            'Las cosechadoras Axial-Flow estan pensadas para maximizar capacidad de trabajo con calidad de grano consistente. La arquitectura de flujo axial, junto con herramientas de telemetria y monitoreo, ayuda a tomar decisiones rapidas en plena campana y sostener productividad lote tras lote.',
        beneficios: [
            'Sistema Axial-Flow para alta eficiencia y cuidado del grano.',
            'Telemetria y monitoreo para seguimiento operativo en tiempo real.',
            'Mayor capacidad de trabajo para ventanas de cosecha exigentes.',
        ],
        imagen_url:
            'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1400&auto=format&fit=crop',
        imagen_alt: 'Cosechadora CASE IH en lote de cultivo',
    },
    pulverizadores: {
        titulo: 'Aplicacion precisa con conectividad integrada',
        descripcion:
            'La familia Patriot entrega precision de aplicacion, estabilidad y herramientas de conectividad para reducir solapamientos y mejorar el uso de insumos. La combinacion de barrales, control y telemetria ayuda a sostener calidad de cobertura incluso en jornadas largas.',
        beneficios: [
            'Patriot autopropulsados con alta precision de aplicacion.',
            'Conectividad para seguimiento de labores y ajustes rapidos.',
            'Estabilidad operativa para mantener cobertura uniforme.',
        ],
        imagen_url:
            'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=1400&auto=format&fit=crop',
        imagen_alt: 'Pulverizador CASE IH aplicando en el campo',
    },
    sembradoras: {
        titulo: 'Siembra consistente desde la primera pasada',
        descripcion:
            'Las soluciones CASE IH para siembra integran precision, robustez y facilidad de regulacion para responder a diferentes ambientes y ventanas de implantacion. La propuesta esta orientada a mejorar uniformidad, velocidad de trabajo y control agronomico durante toda la campana.',
        beneficios: [
            'Precision de implantacion para mejorar uniformidad del cultivo.',
            'Configuraciones pensadas para trabajo sostenido en campo.',
            'Respaldo CASE IH en puesta a punto, servicio y seguimiento.',
        ],
        imagen_url:
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1400&auto=format&fit=crop',
        imagen_alt: 'Equipo de siembra trabajando en lote agricola',
    },
    'heno-forraje': {
        titulo: 'Equipos confiables para forraje de calidad',
        descripcion:
            'La categoria de heno y forraje reune equipos pensados para corte, acondicionamiento y empaque con rendimiento estable. CASE IH prioriza simplicidad operativa, continuidad de trabajo y soporte posventa para que la confeccion de reservas no se detenga.',
        beneficios: [
            'Soluciones para corte, acondicionamiento y manejo de forrajes.',
            'Operacion simple para reducir tiempos improductivos.',
            'Acompanamiento comercial y tecnico durante toda la temporada.',
        ],
        imagen_url:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1400&auto=format&fit=crop',
        imagen_alt: 'Equipo de heno y forraje en un establecimiento rural',
    },
    'tecnologia-precision': {
        titulo: 'Datos conectados para decidir mejor',
        descripcion:
            'AFS Connect y el ecosistema de agricultura de precision CASE IH permiten conectar maquinas, operadores y datos agronomicos en una misma vista. El objetivo es ordenar informacion, monitorear desempeno y ganar trazabilidad en cada labor.',
        beneficios: [
            'Conectividad AFS Connect para monitoreo y gestion remota.',
            'Mejor trazabilidad operativa y soporte basado en datos.',
            'Integracion con el ecosistema CASE IH para decisiones mas rapidas.',
        ],
        imagen_url:
            'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1400&auto=format&fit=crop',
        imagen_alt: 'Pantalla y tecnologia aplicada a agricultura de precision',
    },
};

export function getCategoriaPorSlug(slug: string) {
    return CATEGORIAS.find((categoria) => categoria.slug === slug);
}
