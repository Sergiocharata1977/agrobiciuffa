import { NextRequest, NextResponse } from 'next/server';

import { requireRole } from '@/lib/auth/serverAuth';
import { createCliente, listClientes } from '@/lib/clientes/clientesService';

function toPositiveInt(value: string | null, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
    try {
        await requireRole(request, ['admin']);

        const { searchParams } = new URL(request.url);
        const limit = toPositiveInt(searchParams.get('limit'), 50);
        const offset = toPositiveInt(searchParams.get('offset'), 0);

        const result = await listClientes(limit, offset);
        return NextResponse.json(result);
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
            { success: false, error: 'No se pudo listar clientes.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireRole(request, ['admin']);

        const body = (await request.json()) as {
            nombre?: unknown;
            email?: unknown;
            telefono?: unknown;
        };

        const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';
        const telefono =
            typeof body.telefono === 'string' ? body.telefono.trim() : undefined;

        if (!nombre) {
            return NextResponse.json(
                { success: false, error: 'El nombre es obligatorio.' },
                { status: 400 }
            );
        }

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, error: 'El email es invalido.' },
                { status: 400 }
            );
        }

        const cliente = await createCliente({ nombre, email, telefono });

        return NextResponse.json({ success: true, cliente }, { status: 201 });
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
            { success: false, error: 'No se pudo crear el cliente.' },
            { status: 500 }
        );
    }
}
