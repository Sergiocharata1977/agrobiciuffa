export interface DonMarioAccion {
    label: string;
    href: string;
}

export interface ChatContextEquipo {
    marca: string;
    modelo: string;
    numero_serie: string;
}

export interface ChatContextSolicitud {
    tipo: string;
    estado: string;
    equipo?: string;
    descripcion?: string;
}

export interface ChatContextCliente {
    nombre: string;
    email: string;
    total_solicitudes: number;
    equipos: ChatContextEquipo[];
    solicitudes_recientes: ChatContextSolicitud[];
}

export interface DonMarioResponse {
    reply: string;
    session_id: string;
    acciones?: DonMarioAccion[];
}
