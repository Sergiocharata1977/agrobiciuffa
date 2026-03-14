export interface Cliente {
    id: string;
    email: string;
    nombre: string;
    telefono?: string;
    localidad?: string;
    cuit?: string;
    created_at: string;
    updated_at: string;
    total_solicitudes: number;
    crm_id?: string;
}

export interface EquipoCliente {
    id: string;
    cliente_id: string;
    numero_serie: string;
    marca: string;
    modelo: string;
    anio?: number;
    tipo: 'Tractor' | 'Cosechadora' | 'Pulverizadora' | string;
    created_at: string;
}
