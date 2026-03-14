import {
    type DocumentData,
    type QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { getAdminDb } from '@/firebase/admin';
import { requireRole } from '@/lib/auth/serverAuth';
import {
    getEquiposByClienteId,
    getClienteById,
    updateCliente,
} from '@/lib/clientes/clientesService';
import type { SolicitudAdmin } from '@/types/admin';

function toIsoString(value: unknown): string {
    if (!value) {
        return new Date(0).toISOString();
    }

    if (typeof value === 'string') {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof value.toDate === 'function'
    ) {
        return value.toDate().toISOString();
    }

    return new Date(value as string | number).toISOString();
}

function mapSolicitud(
    snapshot: QueryDocumentSnapshot<DocumentData>
): SolicitudAdmin {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        cliente_id: typeof data.cliente_id === 'string' ? data.cliente_id : undefined,
        cliente_nombre:
            typeof data.cliente_nombre === 'string' ? data.cliente_nombre : '',
        cliente_email:
            typeof data.cliente_email === 'string' ? data.cliente_email : undefined,
        cliente_telefono:
            typeof data.cliente_telefono === 'string'
                ? data.cliente_telefono
                : undefined,
        tipo:
            data.tipo === 'servicio' ||
            data.tipo === 'repuesto' ||
            data.tipo === 'comercial'
                ? data.tipo
                : 'comercial',
        estado: typeof data.estado === 'string' ? data.estado : '',
        equipo_serie:
            typeof data.equipo_serie === 'string' ? data.equipo_serie : undefined,
        equipo_modelo:
            typeof data.equipo_modelo === 'string' ? data.equipo_modelo : undefined,
        descripcion:
            typeof data.descripcion === 'string' ? data.descripcion : undefined,
        created_at: toIsoString(data.created_at),
        updated_at: data.updated_at ? toIsoString(data.updated_at) : undefined,
        asignado_a:
            typeof data.asignado_a === 'string' ? data.asignado_a : undefined,
        notas: typeof data.notas === 'string' ? data.notas : undefined,
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireRole(request, ['mecanico', 'repuestero', 'admin']);

        const { id } = await params;
        const [cliente, equipos] = await Promise.all([
            getClienteById(id),
            getEquiposByClienteId(id),
        ]);

        if (!cliente) {
            return NextResponse.json(
                { success: false, error: 'Cliente no encontrado.' },
                { status: 404 }
            );
        }

        const solicitudesSnapshot = await getAdminDb()
            .collection('solicitudes')
            .where('cliente_id', '==', id)
            .orderBy('created_at', 'desc')
            .get();

        return NextResponse.json({
            cliente,
            equipos,
            solicitudes: solicitudesSnapshot.docs.map(mapSolicitud),
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            return NextResponse.json(
                { success: false, error: 'No autenticado.' },
                { status: 401 }
            );
        }

        if (error instanceof Error && error.message === 'FORBIDDEN') {
            return NextResponse.json(
                { success: false, error: 'Sin permisos.' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'No se pudo obtener el cliente.' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireRole(request, ['admin']);

        const { id } = await params;
        const body = (await request.json()) as {
            nombre?: unknown;
            telefono?: unknown;
            localidad?: unknown;
            cuit?: unknown;
        };

        const cliente = await getClienteById(id);
        if (!cliente) {
            return NextResponse.json(
                { success: false, error: 'Cliente no encontrado.' },
                { status: 404 }
            );
        }

        const updates = Object.fromEntries(
            Object.entries({
                nombre: typeof body.nombre === 'string' ? body.nombre.trim() : undefined,
                telefono:
                    typeof body.telefono === 'string'
                        ? body.telefono.trim()
                        : undefined,
                localidad:
                    typeof body.localidad === 'string'
                        ? body.localidad.trim()
                        : undefined,
                cuit: typeof body.cuit === 'string' ? body.cuit.trim() : undefined,
            }).filter(([, value]) => value !== undefined)
        );

        await updateCliente(id, updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            return NextResponse.json(
                { success: false, error: 'No autenticado.' },
                { status: 401 }
            );
        }

        if (error instanceof Error && error.message === 'FORBIDDEN') {
            return NextResponse.json(
                { success: false, error: 'Sin permisos.' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'No se pudo actualizar el cliente.' },
            { status: 500 }
        );
    }
}
