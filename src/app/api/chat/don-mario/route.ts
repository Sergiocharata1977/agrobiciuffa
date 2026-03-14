import { type DocumentData, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminDb } from '@/firebase/admin';
import { getAuthenticatedUser } from '@/lib/auth/serverAuth';
import { getEquiposByClienteId } from '@/lib/clientes/clientesService';
import { donMarioChat } from '@/lib/donmario/donMarioService';
import type { ChatContextCliente } from '@/types/donmario';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
    message: z.string().trim().min(1).max(1000),
    session_id: z.string(),
    history: z
        .array(
            z.object({
                role: z.enum(['user', 'assistant']),
                content: z.string(),
            })
        )
        .max(20),
});

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

type SolicitudContexto = {
    id: string;
    tipo: string;
    estado: string;
    equipo?: string;
    descripcion?: string;
    created_at: string;
};

function mapSolicitud(snapshot: QueryDocumentSnapshot<DocumentData>): SolicitudContexto {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        tipo: typeof data.tipo === 'string' ? data.tipo : 'consulta',
        estado: typeof data.estado === 'string' ? data.estado : 'nueva',
        equipo:
            typeof data.equipo_modelo === 'string'
                ? data.equipo_modelo
                : typeof data.equipo === 'string'
                  ? data.equipo
                  : undefined,
        descripcion: typeof data.descripcion === 'string' ? data.descripcion : undefined,
        created_at: toIsoString(data.created_at),
    };
}

function getNombreFallback(email: string | null, displayName: string | null): string {
    if (displayName?.trim()) {
        return displayName.trim();
    }

    if (email) {
        return email.split('@')[0];
    }

    return 'Cliente';
}

async function buildContextoCliente(request: NextRequest): Promise<ChatContextCliente | undefined> {
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return undefined;
    }

    const db = getAdminDb();
    const solicitudesQueries = [
        db.collection('solicitudes').where('uid_cliente', '==', user.uid).get(),
    ];

    if (user.email) {
        solicitudesQueries.push(
            db.collection('solicitudes').where('cliente_email', '==', user.email).get()
        );
    }

    const clienteQuery = user.email
        ? db.collection('clientes').where('email', '==', user.email.toLowerCase()).limit(1).get()
        : Promise.resolve(null);

    const [clienteSnapshot, ...solicitudesSnapshots] = await Promise.all([
        clienteQuery,
        ...solicitudesQueries,
    ]);

    const solicitudesById = new Map<string, SolicitudContexto>();
    for (const snapshot of solicitudesSnapshots) {
        for (const doc of snapshot.docs) {
            solicitudesById.set(doc.id, mapSolicitud(doc));
        }
    }

    const solicitudes = Array.from(solicitudesById.values()).sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
    );

    const clienteDoc = clienteSnapshot?.docs[0];
    const clienteData = clienteDoc?.data();
    const equipos =
        clienteDoc?.id !== undefined ? await getEquiposByClienteId(clienteDoc.id) : [];

    return {
        nombre:
            (typeof clienteData?.nombre === 'string' && clienteData.nombre.trim()) ||
            getNombreFallback(user.email, user.displayName),
        email: user.email ?? '',
        total_solicitudes:
            typeof clienteData?.total_solicitudes === 'number'
                ? clienteData.total_solicitudes
                : solicitudes.length,
        equipos: equipos.map((equipo) => ({
            marca: equipo.marca,
            modelo: equipo.modelo,
            numero_serie: equipo.numero_serie,
        })),
        solicitudes_recientes: solicitudes.slice(0, 3).map((solicitud) => ({
            tipo: solicitud.tipo,
            estado: solicitud.estado,
            equipo: solicitud.equipo,
            descripcion: solicitud.descripcion,
        })),
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = RequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 });
        }

        const { message, session_id, history } = parsed.data;

        let contextoCliente: ChatContextCliente | undefined;
        try {
            contextoCliente = await buildContextoCliente(request);
        } catch (error) {
            console.warn('[Don Mario API] No se pudo cargar contexto autenticado:', error);
        }

        const result = await donMarioChat({ message, history, contextoCliente });

        return NextResponse.json({
            ...result,
            session_id,
        });
    } catch (error) {
        console.error('[Don Mario API]', error);

        return NextResponse.json(
            { error: 'Error interno. Intenta de nuevo.' },
            { status: 500 }
        );
    }
}
