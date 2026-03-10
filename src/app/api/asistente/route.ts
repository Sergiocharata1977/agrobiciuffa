import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqInstance) {
        groqInstance = new Groq({
            apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
        });
    }
    return groqInstance;
}

const BASE_SYSTEM_PROMPT = `Sos Don Cándido, el asistente virtual del portal de clientes de Agro Biciufa, concesionario oficial CASE IH en Argentina.

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
- No des precios concretos ni disponibilidad de stock (derivá al equipo comercial)
- No inventés datos técnicos específicos que no sepas con certeza
- Para urgencias mecánicas críticas, recomendá llamar directamente al concesionario
- No tenés acceso en tiempo real a inventario ni sistemas internos`;

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

        const groqMessages = [
            { role: 'system' as const, content: systemPrompt },
            ...chatHistory
                .slice(-12) // last 12 messages max
                .map((msg: { role: 'user' | 'assistant'; content: string }) => ({
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
            max_tokens: 600,
            top_p: 0.9,
        });

        const reply =
            completion.choices[0]?.message?.content ||
            'Lo siento, no pude procesar tu consulta en este momento. ¿Podés intentarlo de nuevo?';

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
