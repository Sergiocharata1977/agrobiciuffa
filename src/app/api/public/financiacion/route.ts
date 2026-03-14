import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminDb } from '@/firebase/admin';

const financiacionSchema = z.object({
    nombre: z.string().min(2),
    empresa: z.string().optional(),
    email: z.string().email(),
    telefono: z.string().min(8),
    localidad: z.string().min(2),
    interes: z.enum(['maquinaria_nueva', 'repuestos', 'servicio', 'usados']),
    descripcion: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
    try {
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, error: 'El cuerpo de la solicitud es inválido.' },
                { status: 400 }
            );
        }

        const parsed = financiacionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: parsed.error.issues[0]?.message ?? 'Datos inválidos.',
                },
                { status: 400 }
            );
        }

        await getAdminDb().collection('consultas_financieras').add({
            ...parsed.data,
            created_at: new Date().toISOString(),
            estado: 'pendiente',
            origen: 'web_institucional' as const,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Error creating financiacion lead:', error);

        return NextResponse.json(
            { success: false, error: 'No se pudo enviar la consulta de financiación.' },
            { status: 500 }
        );
    }
}
