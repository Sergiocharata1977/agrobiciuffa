import * as admin from 'firebase-admin';
import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

let groqInstance: Groq | null = null;
const getGroqClient = () => {
    if (!groqInstance) {
        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing');
        }
        groqInstance = new Groq({
            apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
        });
    }
    return groqInstance;
};

// System prompt para Agrobiciufa
const SYSTEM_PROMPT = `Eres el asistente virtual experto en maquinaria Case IH de Agro Biciuffa SRL.

TU OBJETIVO: Atender a visitantes de la web, responder consultas sobre tractores, pulverizadoras, cosechadoras, repuestos y servicio técnico oficial, y tomar datos de contacto.

TONO: Amigable, profesional, con conocimiento del campo argentino. Usa emojis con moderación (1-2 por respuesta).

REGLAS:
1. Explica los modelos y servicios de forma clara.
2. Respuestas CONCISAS (máximo 3-4 párrafos).
3. Si te piden precios concretos o cotizaciones, indica que es necesario que un asesor comercial se contacte, y pide nombre, teléfono y localidad.
4. NO inventes características de la maquinaria si no estás seguro. Deriva la consulta.`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, sessionId, chatHistory = [] } = body;

        if (!message || !sessionId) {
            return NextResponse.json(
                { success: false, error: 'Faltan parámetros requeridos' },
                { status: 400 }
            );
        }

        const groqMessages = [
            { role: 'system' as const, content: SYSTEM_PROMPT },
            ...chatHistory.map((msg: any) => ({
                role: msg.role as 'user' | 'assistant',
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
            'Lo siento, no pude procesar tu mensaje. ¿Podrías intentarlo de nuevo?';

        // Opcional: Guardar en Firestore el lead / la conversación si se requiere.
        // Por el momento, la integración responde al frontend de manera básica.

        return NextResponse.json({
            success: true,
            reply,
        });
    } catch (error: any) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al procesar el mensaje',
                reply:
                    'Lo siento, hubo un error. Por favor, intenta de nuevo en unos momentos.',
            },
            { status: 500 }
        );
    }
}
