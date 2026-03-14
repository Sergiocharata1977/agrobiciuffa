export type EstadoStock = 'Disponible' | 'Consultar' | 'Bajo pedido';

export interface EquipoCatalogo {
    id: string;
    tipo: 'Tractor' | 'Cosechadora' | 'Pulverizadora' | 'Sembradora';
    marca: string;
    modelo: string;
    anio: number;
    precio_usd: number;
    estado_stock: EstadoStock;
    imagen: string;
    descripcion: string;
    potencia_hp?: number;
}

export const CATALOGO_EQUIPOS: EquipoCatalogo[] = [
    {
        id: 'cat-farmall-75c',
        tipo: 'Tractor',
        marca: 'CASE IH',
        modelo: 'Farmall 75C',
        anio: 2024,
        precio_usd: 68000,
        estado_stock: 'Disponible',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/farmall-75c',
        descripcion: 'Tractor compacto ideal para tareas diversas. Motor FPT 4 cilindros, transmisión PowerShuttle 12x12.',
        potencia_hp: 75,
    },
    {
        id: 'cat-maxxum-145',
        tipo: 'Tractor',
        marca: 'CASE IH',
        modelo: 'Maxxum 145',
        anio: 2024,
        precio_usd: 142000,
        estado_stock: 'Disponible',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/maxxum-145',
        descripcion: 'Tractor mediano versátil. Motor FPT 4.5L, transmisión CVXDrive continua, cabina CommandARC.',
        potencia_hp: 145,
    },
    {
        id: 'cat-puma-185',
        tipo: 'Tractor',
        marca: 'CASE IH',
        modelo: 'Puma 185',
        anio: 2024,
        precio_usd: 185000,
        estado_stock: 'Disponible',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/def9156757604e15aaeb367a9b2da0bf?v=68d3d90f&t=size1200',
        descripcion: 'Tractor de alta potencia para grandes superficies. Motor FPT 6.7L Tier 4, AFS Connect telemetría.',
        potencia_hp: 185,
    },
    {
        id: 'cat-puma-240',
        tipo: 'Tractor',
        marca: 'CASE IH',
        modelo: 'Puma 240',
        anio: 2024,
        precio_usd: 220000,
        estado_stock: 'Consultar',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/puma-240',
        descripcion: 'El tractor más potente de la línea Puma. CVXDrive, suspensión delantera, GPS integrado.',
        potencia_hp: 240,
    },
    {
        id: 'cat-af-7250',
        tipo: 'Cosechadora',
        marca: 'CASE IH',
        modelo: 'Axial-Flow 7250',
        anio: 2024,
        precio_usd: 390000,
        estado_stock: 'Consultar',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/axial-flow-7250',
        descripcion: 'Cosechadora de alta eficiencia. Sistema Axial-Flow de rotor único, caudal de grano 45 t/h.',
    },
    {
        id: 'cat-af-8250',
        tipo: 'Cosechadora',
        marca: 'CASE IH',
        modelo: 'Axial-Flow 8250',
        anio: 2024,
        precio_usd: 520000,
        estado_stock: 'Consultar',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/5ffa167ef892491cb6bfdfef66f259cd?v=98773893&t=size1900',
        descripcion: 'La cosechadora más productiva de CASE IH. Rotor de 762mm, tanque 14.100L, AFS Connect.',
    },
    {
        id: 'cat-patriot-250',
        tipo: 'Pulverizadora',
        marca: 'CASE IH',
        modelo: 'Patriot 250',
        anio: 2024,
        precio_usd: 210000,
        estado_stock: 'Disponible',
        imagen: 'https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/5a7bca29a5e7455d94157b309f959568?v=e5b97d4d&t=size1900',
        descripcion: 'Pulverizadora autopropulsada. Barra Arag 36m, bomba centrífuga 757 L/min, AFS AccuGuide.',
    },
];
