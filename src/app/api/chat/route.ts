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

const SYSTEM_PROMPT = `Eres el asistente virtual experto en maquinaria Case IH de Agro Biciuffa SRL.

TU OBJETIVO: Atender a visitantes de la web, responder consultas sobre tractores, pulverizadoras, cosechadoras, repuestos y servicio tecnico oficial, y tomar datos de contacto.

TONO: Amigable, profesional, con conocimiento del campo argentino. Usa emojis con moderacion (1-2 por respuesta).

REGLAS:
1. Explica los modelos y servicios de forma clara.
2. Respuestas CONCISAS (maximo 3-4 parrafos).
3. Si te piden precios concretos o cotizaciones, indica que es necesario que un asesor comercial se contacte, y pide nombre, telefono y localidad.
4. No inventes caracteristicas de la maquinaria si no estas seguro. Deriva la consulta.`;

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
