import Anthropic from '@anthropic-ai/sdk';

import type { ChatContextCliente, DonMarioResponse } from '@/types/donmario';

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

const SYSTEM_PROMPT_BASE = `
Sos Don Mario, el asistente digital de Agro Biciuffa SRL, concesionario oficial CASE IH en Argentina.
Tu rol es ayudar a los clientes y visitantes a:
- Conocer los productos y servicios de Agro Biciuffa
- Iniciar consultas de repuestos, servicio tecnico y maquinaria
- Orientar sobre financiacion disponible
- Informar sobre ubicacion y contacto
- Derivar a las areas correctas segun la consulta

Sobre Agro Biciuffa:
- Concesionario oficial CASE IH
- Servicios: venta de maquinaria nueva, repuestos originales, servicio tecnico, financiacion
- Zona de cobertura: region agropecuaria argentina (consultar para detalles exactos)
- Canales: web, WhatsApp, telefono, atencion personal en sucursal

Reglas:
- Responde siempre en espanol argentino profesional, usando vos
- Se conciso y directo: el cliente puede estar en el campo o en la ruta
- Si no sabes algo especifico (precio, stock) indica que lo va a contactar un asesor
- Nunca inventes precios, stock ni plazos de entrega
- Si la consulta es tecnica compleja, deriva a servicio tecnico humano
- Cuando el usuario quiera hacer una solicitud formal, guialo al formulario correspondiente
- Maximo 3 parrafos por respuesta
`;

function buildSystemPromptCliente(contexto: ChatContextCliente): string {
    const equiposStr =
        contexto.equipos.length > 0
            ? contexto.equipos
                  .map((equipo) => `${equipo.marca} ${equipo.modelo} (Serie: ${equipo.numero_serie})`)
                  .join(', ')
            : 'ninguno registrado';

    const solicitudesStr =
        contexto.solicitudes_recientes.length > 0
            ? contexto.solicitudes_recientes
                  .slice(0, 3)
                  .map(
                      (solicitud) =>
                          `${solicitud.tipo} (${solicitud.estado}) - ${solicitud.equipo ?? ''} - ${
                              solicitud.descripcion?.slice(0, 60) ?? ''
                          }`
                  )
                  .join('\n    ')
            : 'ninguna reciente';

    return `${SYSTEM_PROMPT_BASE}

--- CONTEXTO DEL CLIENTE AUTENTICADO ---
Nombre: ${contexto.nombre}
Email: ${contexto.email}
Total solicitudes historicas: ${contexto.total_solicitudes}

Equipos registrados:
  ${equiposStr}

Solicitudes recientes:
  ${solicitudesStr}

Usa este contexto para personalizar las respuestas. Por ejemplo:
- Podes mencionar los equipos del cliente por marca y modelo
- Podes hacer seguimiento de sus solicitudes recientes
- No hace falta pedir datos que ya tenes
---`;
}

function normalizeText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
}

function detectarAcciones(userMsg: string): DonMarioResponse['acciones'] {
    const msg = normalizeText(userMsg);
    const acciones: NonNullable<DonMarioResponse['acciones']> = [];

    if (msg.includes('repuesto') || msg.includes('parte') || msg.includes('pieza')) {
        acciones.push({
            label: 'Solicitar repuesto',
            href: '/nueva-solicitud?tipo=repuesto',
        });
    }

    if (
        msg.includes('tecnico') ||
        msg.includes('falla') ||
        msg.includes('reparar') ||
        msg.includes('service')
    ) {
        acciones.push({
            label: 'Solicitar servicio tecnico',
            href: '/nueva-solicitud?tipo=servicio',
        });
    }

    if (
        msg.includes('precio') ||
        msg.includes('cotiz') ||
        msg.includes('comprar') ||
        msg.includes('maquina')
    ) {
        acciones.push({
            label: 'Consultar comercial',
            href: '/contacto?area=ventas',
        });
    }

    if (msg.includes('financ') || msg.includes('credito') || msg.includes('cuota')) {
        acciones.push({
            label: 'Consultar financiacion',
            href: '/financiacion',
        });
    }

    return acciones.length > 0 ? acciones : undefined;
}

export async function donMarioChat(params: {
    message: string;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
    contextoCliente?: ChatContextCliente;
}): Promise<DonMarioResponse> {
    const { message, history, contextoCliente } = params;

    const systemPrompt = contextoCliente
        ? buildSystemPromptCliente(contextoCliente)
        : SYSTEM_PROMPT_BASE;

    const messages = [
        ...history.slice(-10).map((item) => ({
            role: item.role,
            content: item.content,
        })),
        { role: 'user' as const, content: message },
    ];

    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages,
    });

    const reply =
        response.content[0]?.type === 'text'
            ? response.content[0].text
            : 'Lo siento, no pude procesar tu consulta. Intenta de nuevo.';

    return {
        reply,
        session_id: '',
        acciones: detectarAcciones(message),
    };
}
