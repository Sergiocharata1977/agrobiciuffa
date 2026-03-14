export type EstadoSolicitudServicio =
    | 'nueva'
    | 'diagnostico'
    | 'presupuestada'
    | 'aprobada'
    | 'en_trabajo'
    | 'completada';

export type EstadoSolicitudRepuesto =
    | 'nueva'
    | 'verificando_stock'
    | 'cotizada'
    | 'aprobada'
    | 'en_preparacion'
    | 'entregada';

export type EstadoSolicitud = EstadoSolicitudServicio | EstadoSolicitudRepuesto;

export interface SolicitudAdmin {
    id: string;
    cliente_id?: string;
    cliente_nombre: string;
    cliente_email?: string;
    cliente_telefono?: string;
    tipo: 'servicio' | 'repuesto' | 'comercial';
    estado: EstadoSolicitud | string;
    equipo_serie?: string;
    equipo_modelo?: string;
    descripcion?: string;
    created_at: string;
    updated_at?: string;
    asignado_a?: string;
    notas?: string;
}
