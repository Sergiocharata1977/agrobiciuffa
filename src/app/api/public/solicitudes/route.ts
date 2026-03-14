import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminDb } from '@/firebase/admin';

const institucionalSchema = z.discriminatedUnion('tipo', [
    z.object({
        tipo: z.literal('repuesto'),
        cliente_nombre: z.string().min(2),
        cliente_telefono: z.string().min(8),
        cliente_email: z.string().email().optional(),
        localidad: z.string().min(2).optional(),
        equipo_modelo: z.string().min(2),
        equipo_serie: z.string().optional(),
        descripcion: z.string().min(10).max(2000),
        codigo_repuesto: z.string().optional(),
        urgencia: z.enum(['normal', 'urgente']).optional(),
    }),
    z.object({
        tipo: z.literal('servicio'),
        cliente_nombre: z.string().min(2),
        cliente_telefono: z.string().min(8),
        cliente_email: z.string().email().optional(),
        localidad: z.string().min(2),
        equipo_modelo: z.string().min(2),
        equipo_serie: z.string().optional(),
        descripcion: z.string().min(10).max(2000),
        tipo_atencion: z.enum(['En taller', 'En campo', 'Sin preferencia']),
        urgencia: z.enum(['Normal', 'Urgente — equipo parado']),
    }),
]);

const solicitudClientSchema = z.discriminatedUnion('tipo', [
    z.object({
        tipo: z.literal('repuesto'),
        nombre: z.string().min(2),
        telefono: z.string().min(8),
        email: z.string().email(),
        cuit: z.string().optional(),
        website: z.string().optional(),
        form_started_at: z.number().optional(),
        maquina_tipo: z.string().min(2),
        modelo: z.string().min(2),
        numero_serie: z.string().optional(),
        descripcion_repuesto: z.string().min(10).max(2000),
    }),
    z.object({
        tipo: z.literal('servicio'),
        nombre: z.string().min(2),
        telefono: z.string().min(8),
        email: z.string().email(),
        cuit: z.string().optional(),
        website: z.string().optional(),
        form_started_at: z.number().optional(),
        maquina_tipo: z.string().min(2),
        modelo: z.string().min(2),
        numero_serie: z.string().optional(),
        descripcion_problema: z.string().min(10).max(2000),
        localidad: z.string().min(2),
        provincia: z.string().min(2),
    }),
    z.object({
        tipo: z.literal('comercial'),
        nombre: z.string().min(2),
        telefono: z.string().min(8),
        email: z.string().email(),
        cuit: z.string().optional(),
        website: z.string().optional(),
        form_started_at: z.number().optional(),
        producto_id: z.string().optional(),
        producto_nombre: z.string().optional(),
        precio_referencia: z.number().nullable().optional(),
        producto_interes: z.string().min(2),
        requiere_financiacion: z.boolean(),
        comentarios: z.string().min(5).max(2000),
    }),
]);

type NormalizedPayload = {
    tipo: 'repuesto' | 'servicio' | 'comercial';
    cliente_nombre: string;
    cliente_telefono: string;
    cliente_email?: string;
    localidad?: string;
    provincia?: string;
    equipo_modelo?: string;
    equipo_serie?: string;
    descripcion: string;
    codigo_repuesto?: string;
    tipo_atencion?: 'En taller' | 'En campo' | 'Sin preferencia';
    urgencia?: 'normal' | 'urgente' | 'Normal' | 'Urgente — equipo parado';
    producto_id?: string;
    producto_nombre?: string;
    producto_interes?: string;
    precio_referencia?: number | null;
    requiere_financiacion?: boolean;
    cuit?: string;
    estado: 'nueva';
    origen: 'web_institucional' | 'web_publica';
    numero_solicitud: string;
    created_at: string;
    updated_at: string;
};

function buildNumeroSolicitud() {
    return Date.now().toString().slice(-6);
}

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

        const institucionalResult = institucionalSchema.safeParse(body);
        const clientResult = solicitudClientSchema.safeParse(body);

        if (!institucionalResult.success && !clientResult.success) {
            const error =
                institucionalResult.error.issues[0]?.message ??
                clientResult.error.issues[0]?.message ??
                'Datos inválidos.';

            return NextResponse.json({ success: false, error }, { status: 400 });
        }

        const now = new Date().toISOString();
        const numeroSolicitud = buildNumeroSolicitud();
        let payload: NormalizedPayload;

        if (institucionalResult.success) {
            const parsed = institucionalResult.data;

            if (parsed.tipo === 'repuesto') {
                payload = {
                    tipo: 'repuesto',
                    cliente_nombre: parsed.cliente_nombre.trim(),
                    cliente_telefono: parsed.cliente_telefono.trim(),
                    cliente_email: parsed.cliente_email?.trim() || undefined,
                    localidad: parsed.localidad?.trim() || undefined,
                    equipo_modelo: parsed.equipo_modelo.trim(),
                    equipo_serie: parsed.equipo_serie?.trim() || undefined,
                    descripcion: parsed.descripcion.trim(),
                    codigo_repuesto: parsed.codigo_repuesto?.trim() || undefined,
                    urgencia: parsed.urgencia ?? 'normal',
                    estado: 'nueva',
                    origen: 'web_institucional',
                    numero_solicitud: numeroSolicitud,
                    created_at: now,
                    updated_at: now,
                };
            } else {
                payload = {
                    tipo: 'servicio',
                    cliente_nombre: parsed.cliente_nombre.trim(),
                    cliente_telefono: parsed.cliente_telefono.trim(),
                    cliente_email: parsed.cliente_email?.trim() || undefined,
                    localidad: parsed.localidad.trim(),
                    equipo_modelo: parsed.equipo_modelo.trim(),
                    equipo_serie: parsed.equipo_serie?.trim() || undefined,
                    descripcion: parsed.descripcion.trim(),
                    tipo_atencion: parsed.tipo_atencion,
                    urgencia: parsed.urgencia,
                    estado: 'nueva',
                    origen: 'web_institucional',
                    numero_solicitud: numeroSolicitud,
                    created_at: now,
                    updated_at: now,
                };
            }
        } else if (clientResult.success) {
            const parsed = clientResult.data;

            if (parsed.tipo === 'repuesto') {
                payload = {
                    tipo: 'repuesto',
                    cliente_nombre: parsed.nombre.trim(),
                    cliente_telefono: parsed.telefono.trim(),
                    cliente_email: parsed.email.trim(),
                    equipo_modelo: `${parsed.maquina_tipo.trim()} ${parsed.modelo.trim()}`.trim(),
                    equipo_serie: parsed.numero_serie?.trim() || undefined,
                    descripcion: parsed.descripcion_repuesto.trim(),
                    cuit: parsed.cuit?.trim() || undefined,
                    estado: 'nueva',
                    origen: 'web_publica',
                    numero_solicitud: numeroSolicitud,
                    created_at: now,
                    updated_at: now,
                };
            } else if (parsed.tipo === 'servicio') {
                payload = {
                    tipo: 'servicio',
                    cliente_nombre: parsed.nombre.trim(),
                    cliente_telefono: parsed.telefono.trim(),
                    cliente_email: parsed.email.trim(),
                    localidad: parsed.localidad.trim(),
                    provincia: parsed.provincia.trim(),
                    equipo_modelo: `${parsed.maquina_tipo.trim()} ${parsed.modelo.trim()}`.trim(),
                    equipo_serie: parsed.numero_serie?.trim() || undefined,
                    descripcion: parsed.descripcion_problema.trim(),
                    cuit: parsed.cuit?.trim() || undefined,
                    estado: 'nueva',
                    origen: 'web_publica',
                    numero_solicitud: numeroSolicitud,
                    created_at: now,
                    updated_at: now,
                };
            } else {
                payload = {
                    tipo: 'comercial',
                    cliente_nombre: parsed.nombre.trim(),
                    cliente_telefono: parsed.telefono.trim(),
                    cliente_email: parsed.email.trim(),
                    descripcion: parsed.comentarios.trim(),
                    producto_id: parsed.producto_id?.trim() || undefined,
                    producto_nombre: parsed.producto_nombre?.trim() || undefined,
                    producto_interes: parsed.producto_interes.trim(),
                    precio_referencia: parsed.precio_referencia ?? null,
                    requiere_financiacion: parsed.requiere_financiacion,
                    cuit: parsed.cuit?.trim() || undefined,
                    estado: 'nueva',
                    origen: 'web_publica',
                    numero_solicitud: numeroSolicitud,
                    created_at: now,
                    updated_at: now,
                };
            }
        } else {
            return NextResponse.json(
                { success: false, error: 'Datos inválidos.' },
                { status: 400 }
            );
        }

        const docRef = await getAdminDb().collection('solicitudes').add(payload);

        return NextResponse.json(
            {
                success: true,
                id: docRef.id,
                numeroSolicitud,
                tipo: payload.tipo,
                message: 'Solicitud registrada correctamente.',
                crmWarning: null,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating solicitud:', error);

        return NextResponse.json(
            { success: false, error: 'No se pudo registrar la solicitud.' },
            { status: 500 }
        );
    }
}
