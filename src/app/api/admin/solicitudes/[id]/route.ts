import { NextRequest, NextResponse } from 'next/server';

import { getAdminDb } from '@/firebase/admin';
import { requireRole } from '@/lib/auth/serverAuth';
import type {
    EstadoSolicitudRepuesto,
    EstadoSolicitudServicio,
} from '@/types/admin';

const ESTADOS_SERVICIO = new Set<EstadoSolicitudServicio>([
    'nueva',
    'diagnostico',
    'presupuestada',
    'aprobada',
    'en_trabajo',
    'completada',
]);

const ESTADOS_REPUESTO = new Set<EstadoSolicitudRepuesto>([
    'nueva',
    'verificando_stock',
    'cotizada',
    'aprobada',
    'en_preparacion',
    'entregada',
]);

function isValidEstado(tipo: unknown, estado: string): boolean {
    if (tipo === 'servicio') {
        return ESTADOS_SERVICIO.has(estado as EstadoSolicitudServicio);
    }

    if (tipo === 'repuesto') {
        return ESTADOS_REPUESTO.has(estado as EstadoSolicitudRepuesto);
    }

    return ESTADOS_SERVICIO.has(estado as EstadoSolicitudServicio) ||
        ESTADOS_REPUESTO.has(estado as EstadoSolicitudRepuesto);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireRole(request, ['mecanico', 'repuestero', 'admin']);

        const { id } = await params;
        const body = (await request.json()) as {
            estado?: unknown;
            notas?: unknown;
        };

        if (typeof body.estado !== 'string' || !body.estado.trim()) {
            return NextResponse.json(
                { success: false, error: 'Estado invalido.' },
                { status: 400 }
            );
        }

        const solicitudRef = getAdminDb().collection('solicitudes').doc(id);
        const solicitudSnapshot = await solicitudRef.get();

        if (!solicitudSnapshot.exists) {
            return NextResponse.json(
                { success: false, error: 'Solicitud no encontrada.' },
                { status: 404 }
            );
        }

        const solicitud = solicitudSnapshot.data();
        const estado = body.estado.trim();

        if (!isValidEstado(solicitud?.tipo, estado)) {
            return NextResponse.json(
                { success: false, error: 'Estado invalido para el tipo de solicitud.' },
                { status: 400 }
            );
        }

        const updates: {
            estado: string;
            updated_at: Date;
            notas?: string;
        } = {
            estado,
            updated_at: new Date(),
        };

        if (typeof body.notas === 'string') {
            updates.notas = body.notas.trim();
        }

        await solicitudRef.update(updates);

        return NextResponse.json({ success: true, id, estado });
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
            { success: false, error: 'No se pudo actualizar la solicitud.' },
            { status: 500 }
        );
    }
}
