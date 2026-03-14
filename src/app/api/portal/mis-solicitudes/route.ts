import {
    type DocumentData,
    type QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { getAdminDb } from '@/firebase/admin';
import { requireRole } from '@/lib/auth/serverAuth';
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
        cliente_id:
            typeof data.uid_cliente === 'string'
                ? data.uid_cliente
                : typeof data.cliente_id === 'string'
                  ? data.cliente_id
                  : undefined,
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
        estado: typeof data.estado === 'string' ? data.estado : 'nueva',
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

export async function GET(request: NextRequest) {
    try {
        const user = await requireRole(request, ['cliente']);
        const queries = [
            getAdminDb()
                .collection('solicitudes')
                .where('uid_cliente', '==', user.uid)
                .get(),
        ];

        if (user.email) {
            queries.push(
                getAdminDb()
                    .collection('solicitudes')
                    .where('cliente_email', '==', user.email)
                    .get()
            );
        }

        const snapshots = await Promise.all(queries);
        const byId = new Map<string, SolicitudAdmin>();

        for (const snapshot of snapshots) {
            for (const doc of snapshot.docs) {
                byId.set(doc.id, mapSolicitud(doc));
            }
        }

        const solicitudes = Array.from(byId.values()).sort((a, b) =>
            b.created_at.localeCompare(a.created_at)
        );

        return NextResponse.json({ solicitudes });
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
            { success: false, error: 'No se pudieron obtener las solicitudes.' },
            { status: 500 }
        );
    }
}
