import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqInstance) {
        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing');
        }

        groqInstance = new Groq({
            apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
        });
    }

    return groqInstance;
}

const SYSTEM_PROMPT = `Sos el asistente virtual de Agro Biciufa, concesionario oficial CASE IH en Argentina.

TU OBJETIVO: Atender visitantes de la web, responder consultas sobre equipos, repuestos y servicios técnicos CASE IH, y captar datos de contacto para el equipo comercial.

TONO: Amigable, profesional, con conocimiento del campo argentino. Español argentino (vos, podés, etc.). Máximo 3-4 párrafos. 1-2 emojis por respuesta.

REGLAS:
1. Podés mencionar precios orientativos del catálogo aclarando que son de referencia y el precio final lo confirma el equipo comercial.
2. Si el visitante quiere cotizar o está interesado, pedile nombre, teléfono y localidad.
3. No inventes características técnicas que no conozcas. Derivá la consulta.
4. Para urgencias mecánicas, recomendá llamar al concesionario directamente.

CATÁLOGO DE EQUIPOS (precios orientativos USD, pueden variar):
• Tractor CASE IH Farmall 75C 2024 — desde USD 68.000 (75hp, ideal para tareas diversas)
• Tractor CASE IH Maxxum 145 2024 — desde USD 142.000 (145hp, CVXDrive continua)
• Tractor CASE IH Puma 185 2024 — desde USD 185.000 (185hp, AFS Connect telemetría)
• Tractor CASE IH Puma 240 2024 — desde USD 220.000 (240hp, máxima potencia línea Puma)
• Cosechadora CASE IH Axial-Flow 7250 2024 — desde USD 390.000 (rotor único, 45t/h)
• Cosechadora CASE IH Axial-Flow 8250 2024 — desde USD 520.000 (la más productiva, tanque 14.100L)
• Pulverizadora CASE IH Patriot 250 2024 — desde USD 210.000 (barra 36m, AFS AccuGuide)

FINANCIACIÓN CNH CAPITAL (tasas orientativas):
• Plan Clásico: 12 cuotas, 45% TNA, anticipo 30%
• Plan Extendido: 24 cuotas, 52% TNA, anticipo 20% — el más elegido
• Plan Harvest: 36 cuotas, 58% TNA, anticipo 15% — para cosechadoras
• Leasing Agrícola: 48 cuotas, 60% TNA, anticipo 10%

REPUESTOS FRECUENTES CASE IH (precios orientativos):
• Filtro aceite motor (p/n 84229862) — ~USD 45 — Puma, Maxxum, Farmall
• Filtro hidráulico (p/n 87802885) — ~USD 38 — Puma, Maxxum, Axial-Flow
• Kit correas variador Axial-Flow (p/n 1995311C1) — ~USD 890
• Pastilla difusora TeeJet 11004 (p/n 382109A1) — ~USD 180 pack x20 — Patriot 250
• Aceite hidráulico Akcela (p/n 84224053) — ~USD 95 bidón 20L

SERVICIOS TÉCNICOS:
• Service 250hs / 500hs / 1000hs — mantenimiento preventivo según horas de trabajo
• Diagnóstico electrónico AFS — lectura de códigos de falla con equipo oficial CNH
• Taller de campaña — técnico va al campo, disponible 24hs en temporada
• Gestión de garantías CASE IH — sin costo para el cliente

CONTACTO AGRO BICIUFA:
• Tel: +54 11 4700-0000 · WhatsApp: +54 9 11 7000-0000
• Email: info@agrobiciufa.com.ar
• Horario: Lun-Vie 8-18 / Sab 8-13
• Regiones: Buenos Aires, Entre Ríos, Santa Fe`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, sessionId, chatHistory = [] } = body;

        if (!message || !sessionId) {
            return NextResponse.json(
                { success: false, error: 'Faltan parametros requeridos' },
                { status: 400 }
            );
        }

        const groqMessages = [
            { role: 'system' as const, content: SYSTEM_PROMPT },
            ...chatHistory.map((msg: { role: 'user' | 'assistant'; content: string }) => ({
                role: msg.role,
                content: msg.content,
            })),
            { role: 'user' as const, content: message },
        ];

        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 500,
            top_p: 0.9,
        });

        const reply =
            completion.choices[0]?.message?.content ||
            'Lo siento, no pude procesar tu mensaje. Podrias intentarlo de nuevo?';

        return NextResponse.json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error('Error in chat API:', error);

        const message =
            error instanceof Error ? error.message : 'Error al procesar el mensaje';

        return NextResponse.json(
            {
                success: false,
                error: message,
                reply:
                    'Lo siento, hubo un error. Por favor, intenta de nuevo en unos momentos.',
            },
            { status: 500 }
        );
    }
}
