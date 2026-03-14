import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminDb } from '@/firebase/admin';
import { requireRole } from '@/lib/auth/serverAuth';
import type { EquipoCliente } from '@/types/clientes';

function toIsoString(value: unknown): string {
    if (!value) return new Date(0).toISOString();
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString();
    if (
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof (value as { toDate: unknown }).toDate === 'function'
    ) {
        return (value as { toDate: () => Date }).toDate().toISOString();
    }
    return new Date(value as string | number).toISOString();
}

const nuevoEquipoSchema = z.object({
    numero_serie: z.string().min(3, 'Numero de serie requerido'),
    marca: z.string().min(1, 'Marca requerida'),
    modelo: z.string().min(1, 'Modelo requerido'),
    anio: z.number().int().min(1980).max(new Date().getFullYear() + 1).optional(),
    tipo: z.string().min(1, 'Tipo requerido'),
});

export async function GET(request: NextRequest) {
    try {
        const user = await requireRole(request, ['cliente', 'admin']);

        const snapshot = await getAdminDb()
            .collection('equipos_cliente')
            .where('cliente_id', '==', user.uid)
            .orderBy('created_at', 'desc')
            .get();

        const equipos: EquipoCliente[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                cliente_id: typeof data.cliente_id === 'string' ? data.cliente_id : user.uid,
                numero_serie: typeof data.numero_serie === 'string' ? data.numero_serie : '',
                marca: typeof data.marca === 'string' ? data.marca : '',
                modelo: typeof data.modelo === 'string' ? data.modelo : '',
                anio: typeof data.anio === 'number' ? data.anio : undefined,
                tipo: typeof data.tipo === 'string' ? data.tipo : '',
                created_at: toIsoString(data.created_at),
            };
        });

        return NextResponse.json({ equipos });
    } catch (error) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            return NextResponse.json({ success: false, error: 'No autenticado.' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'FORBIDDEN') {
            return NextResponse.json({ success: false, error: 'Sin permisos.' }, { status: 403 });
        }
        return NextResponse.json(
            { success: false, error: 'No se pudieron cargar los equipos.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireRole(request, ['cliente', 'admin']);

        const body = (await request.json()) as unknown;
        const parsed = nuevoEquipoSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' },
                { status: 400 }
            );
        }

        const { numero_serie, marca, modelo, anio, tipo } = parsed.data;

        // Verificar duplicado para este cliente
        const existing = await getAdminDb()
            .collection('equipos_cliente')
            .where('cliente_id', '==', user.uid)
            .where('numero_serie', '==', numero_serie)
            .limit(1)
            .get();

        if (!existing.empty) {
            return NextResponse.json(
                { success: false, error: 'Ya tenes un equipo registrado con ese numero de serie.' },
                { status: 409 }
            );
        }

        const docRef = await getAdminDb().collection('equipos_cliente').add({
            cliente_id: user.uid,
            numero_serie,
            marca,
            modelo,
            ...(anio !== undefined ? { anio } : {}),
            tipo,
            created_at: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            return NextResponse.json({ success: false, error: 'No autenticado.' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'FORBIDDEN') {
            return NextResponse.json({ success: false, error: 'Sin permisos.' }, { status: 403 });
        }
        return NextResponse.json(
            { success: false, error: 'No se pudo registrar el equipo.' },
            { status: 500 }
        );
    }
}
