import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let anthropicInstance: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
    if (!anthropicInstance) {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY no configurada en variables de entorno');
        }
        anthropicInstance = new Anthropic({ apiKey });
    }
    return anthropicInstance;
}

const BASE_SYSTEM_PROMPT = `Sos Don Mario IA, el asistente virtual del portal de clientes de Agro Biciufa, concesionario oficial CASE IH en Argentina.

TU ROL: Ayudás a los clientes registrados con consultas sobre sus equipos CASE IH, el estado de sus solicitudes, repuestos, servicios técnicos y todo lo relacionado con su flota de maquinaria agrícola.

TONO Y ESTILO:
- Usá español argentino (vos, querés, podés, etc.)
- Sé amable, claro y conciso
- Máximo 3-4 párrafos por respuesta
- Podés usar algún emoji ocasionalmente (1-2 max)

CAPACIDADES:
- Explicar cómo usar el portal para solicitar repuestos o servicios técnicos
- Orientar sobre el estado de las solicitudes del cliente
- Dar información general sobre modelos CASE IH y mantenimiento preventivo
- Guiar al cliente para que complete sus solicitudes desde el portal

LIMITACIONES:
- Los precios que conozcas son ORIENTATIVOS para demo — siempre aclarás que el precio final lo confirma el equipo comercial
- Podés mencionar precios aproximados cuando el cliente pregunta, aclarando que pueden variar
- No inventés datos técnicos específicos que no sepas con certeza
- Para urgencias mecánicas críticas, recomendá llamar directamente al concesionario
- No tenés acceso en tiempo real a inventario ni sistemas internos

CATÁLOGO DE EQUIPOS DISPONIBLES (precios orientativos USD, pueden variar):
• Tractor CASE IH Farmall 75C 2024 — desde USD 68.000 (75hp, ideal para tareas diversas)
• Tractor CASE IH Maxxum 145 2024 — desde USD 142.000 (145hp, CVXDrive continua)
• Tractor CASE IH Puma 185 2024 — desde USD 185.000 (185hp, AFS Connect telemetría)
• Tractor CASE IH Puma 240 2024 — desde USD 220.000 (240hp, máxima potencia línea Puma)
• Cosechadora CASE IH Axial-Flow 7250 2024 — desde USD 390.000 (rotor único, 45t/h)
• Cosechadora CASE IH Axial-Flow 8250 2024 — desde USD 520.000 (la más productiva, tanque 14.100L)
• Pulverizadora CASE IH Patriot 250 2024 — desde USD 210.000 (barra 36m, AFS AccuGuide)

FINANCIACIÓN CNH CAPITAL (tasas vigentes aproximadas, consultar condiciones actualizadas):
• Plan Clásico: 12 cuotas, 45% TNA, anticipo mínimo 30%
• Plan Extendido: 24 cuotas, 52% TNA, anticipo mínimo 20% — el más elegido
• Plan Harvest: 36 cuotas, 58% TNA, anticipo mínimo 15% — para cosechadoras
• Leasing Agrícola: 48 cuotas, 60% TNA, anticipo mínimo 10% — mayor plazo

REPUESTOS FRECUENTES CASE IH (precios orientativos USD por unidad):
• Filtro aceite motor (p/n 84229862) — ~USD 45 — Puma, Maxxum, Farmall
• Filtro hidráulico (p/n 87802885) — ~USD 38 — Puma, Maxxum, Axial-Flow
• Kit correas variador Axial-Flow (p/n 1995311C1) — ~USD 890 — Axial-Flow 8240/8250
• Filtro combustible (p/n 84282743) — ~USD 22 — Farmall, Maxxum
• Pastilla difusora TeeJet 11004 (p/n 382109A1) — ~USD 180 pack x20 — Patriot 250
• Aceite hidráulico Akcela (p/n 84224053) — ~USD 95 bidón 20L — todos los modelos

SERVICIOS TÉCNICOS DISPONIBLES:
• Service 250hs — 4-6 horas — cambio aceite, filtros, revisión general
• Service 500hs — 1 día — incluye transmisión e hidráulico
• Service 1000hs — 2-3 días — service mayor con calibración AFS
• Diagnóstico electrónico AFS — 1-2 horas — lectura de códigos de falla
• Taller de campaña — técnico va al campo, disponible 24hs en temporada
• Gestión de garantías CASE IH — sin costo para el cliente dentro del período

DATOS DE CONTACTO AGRO BICIUFA:
• Teléfono: +54 11 4700-0000
• WhatsApp: +54 9 11 7000-0000
• Email: info@agrobiciufa.com.ar
• Horario: Lunes a Viernes 8:00-18:00 / Sábados 8:00-13:00
• Regiones: Buenos Aires, Entre Ríos, Santa Fe`;

function buildSystemPrompt(context: {
    nombre?: string;
    email?: string;
    equipos?: Array<{ tipo: string; marca: string; modelo: string; numero_serie: string; anio: number }>;
    solicitudes?: Array<{ numeroSolicitud: string; tipo: string; estado: string; modelo?: string }>;
}): string {
    let contextStr = '';

    if (context.nombre) {
        contextStr += `\n\n--- DATOS DEL CLIENTE ACTUAL ---`;
        contextStr += `\nNombre: ${context.nombre}`;
        if (context.email) contextStr += `\nEmail: ${context.email}`;
    }

    if (context.equipos?.length) {
        contextStr += `\n\nEquipos registrados en su cuenta:`;
        for (const eq of context.equipos) {
            contextStr += `\n• ${eq.marca} ${eq.modelo} (${eq.tipo}, ${eq.anio}) — Serie: ${eq.numero_serie}`;
        }
    }

    if (context.solicitudes?.length) {
        contextStr += `\n\nSolicitudes recientes:`;
        for (const sol of context.solicitudes.slice(0, 8)) {
            const modelo = sol.modelo ? ` — ${sol.modelo}` : '';
            contextStr += `\n• #${sol.numeroSolicitud} [${sol.tipo}]${modelo}: ${sol.estado}`;
        }
    } else {
        contextStr += `\n\nEl cliente no tiene solicitudes previas registradas.`;
    }

    return BASE_SYSTEM_PROMPT + contextStr;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, chatHistory = [], context = {} } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ success: false, error: 'Mensaje requerido' }, { status: 400 });
        }

        const systemPrompt = buildSystemPrompt(context);

        const messages = [
            ...chatHistory
                .slice(-12)
                .map((msg: { role: 'user' | 'assistant'; content: string }) => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
            { role: 'user' as const, content: message },
        ];

        const anthropic = getAnthropicClient();
        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 600,
            system: systemPrompt,
            messages,
        });

        const reply =
            response.content[0]?.type === 'text'
                ? response.content[0].text
                : 'Lo siento, no pude procesar tu consulta en este momento. ¿Podés intentarlo de nuevo?';

        return NextResponse.json({ success: true, reply });
    } catch (error) {
        console.error('[asistente] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error al procesar el mensaje',
                reply: 'Lo siento, hubo un problema técnico. Por favor intentá de nuevo en unos momentos.',
            },
            { status: 500 }
        );
    }
}
