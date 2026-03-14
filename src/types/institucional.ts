// Categorías de productos CASE IH
export type SlugCategoria =
    | 'tractores'
    | 'cosechadoras'
    | 'pulverizadores'
    | 'sembradoras'
    | 'heno-forraje'
    | 'tecnologia-precision';

export interface CategoriaProducto {
    slug: SlugCategoria;
    nombre: string;
    descripcion: string;
    imagen_url?: string;
    destacado: boolean;
    orden: number;
}

export interface Producto {
    id: string;
    categoria_slug: SlugCategoria;
    nombre: string;
    descripcion_corta: string; // max 160 chars — para cards
    descripcion_completa?: string; // HTML o markdown — para ficha
    beneficios?: string[];
    imagen_url?: string;
    imagenes?: string[];
    destacado: boolean;
    disponible: boolean;
    created_at: string;
}

export interface Novedad {
    id: string;
    slug: string;
    titulo: string;
    resumen: string; // max 200 chars
    cuerpo: string; // HTML o markdown
    imagen_url?: string;
    publicada: boolean;
    publicada_at: string; // ISO date
    created_at: string;
    tags?: string[];
}

// Formulario Contacto General
export interface FormContacto {
    nombre: string;
    empresa?: string;
    localidad: string;
    telefono: string;
    email: string;
    area: 'ventas' | 'repuestos' | 'servicio_tecnico' | 'administracion' | 'otro';
    mensaje: string;
}

// Formulario Consulta Repuestos (va a colección solicitudes tipo=repuesto)
export interface FormRepuesto {
    nombre: string;
    email?: string;
    telefono: string;
    localidad?: string;
    maquina_marca: string;
    maquina_modelo: string;
    maquina_serie?: string;
    descripcion_repuesto: string;
    codigo_repuesto?: string;
    urgencia?: 'normal' | 'urgente';
}

// Formulario Servicio Técnico (va a colección solicitudes tipo=servicio)
export interface FormServicio {
    nombre: string;
    email?: string;
    telefono: string;
    localidad: string;
    maquina_marca: string;
    maquina_modelo: string;
    maquina_serie?: string;
    descripcion_problema: string;
    tipo_atencion: 'taller' | 'campo' | 'cualquiera';
    urgencia?: 'normal' | 'urgente';
}

// Formulario Financiación
// NUNCA pedir monto ni aprobar crédito — solo captar interés
export interface FormFinanciacion {
    nombre: string;
    empresa?: string;
    email: string;
    telefono: string;
    localidad: string;
    interes: 'maquinaria_nueva' | 'repuestos' | 'servicio' | 'usados';
    descripcion?: string;
}
