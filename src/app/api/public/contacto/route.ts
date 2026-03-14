import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminDb } from '@/firebase/admin';

const contactoSchema = z.object({
    nombre: z.string().min(2),
    empresa: z.string().optional(),
    localidad: z.string().min(2),
    telefono: z.string().min(8),
    email: z.string().email(),
    area: z.enum([
        'ventas',
        'repuestos',
        'servicio_tecnico',
        'administracion',
        'otro',
    ]),
    mensaje: z.string().min(10).max(1000),
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

        const parsed = contactoSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: parsed.error.issues[0]?.message ?? 'Datos inválidos.',
                },
                { status: 400 }
            );
        }

        const payload = {
            ...parsed.data,
            created_at: new Date().toISOString(),
            leido: false,
            origen: 'web_institucional' as const,
        };

        const docRef = await getAdminDb().collection('contactos').add(payload);

        return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error('Error creating contacto:', error);

        return NextResponse.json(
            { success: false, error: 'No se pudo enviar el formulario de contacto.' },
            { status: 500 }
        );
    }
}
