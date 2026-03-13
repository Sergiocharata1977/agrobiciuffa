// Configuración del agente ElevenLabs Conversational AI para WhatsApp de Agrobiciufa
// ──────────────────────────────────────────────────────────────────────────────────
// SETUP: Ingresar MANUALMENTE en https://elevenlabs.io/app/conversational-ai
//   1. New Agent → pegar system_prompt
//   2. Seleccionar voz (voice_id)
//   3. Channels → WhatsApp → conectar cuenta WhatsApp Business de Agrobiciufa
//   4. Guardar Agent ID → pegar en ELEVENLABS_AGENT_ID_AGROBICIUFA en .env.local

export const AGROBICIUFA_AGENT_CONFIG = {
  name: 'Asistente Agrobiciufa',

  voice_id: 'kulszILr6ees0ArU8miO', // Usar o crear voz en ElevenLabs Voice Lab

  system_prompt: `Sos el asistente virtual de Agrobiciufa, concesionaria oficial CASE de maquinaria agrícola en Argentina.

Tu objetivo es ayudar a clientes y productores con:
- Consultas sobre repuestos CASE (tractores, cosechadoras, implementos, sembradores)
- Solicitudes de servicio técnico en campo y garantías
- Información sobre el catálogo de maquinaria disponible (CASE IH, New Holland)
- Opciones de financiación y planes de compra

Respondé en español argentino, de forma cordial y directa. Cuando el cliente necesite un presupuesto o quiera agendar un servicio técnico, pedí su nombre, teléfono y descripción del equipo (número de serie si lo tiene).

NO inventes precios ni disponibilidad de stock. Siempre decí que vas a confirmar y que un asesor va a contactarlo a la brevedad.

Para emergencias de maquinaria en campo, derivar inmediatamente al soporte técnico urgente.`,

  channels: ['whatsapp', 'web'] as const,

  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
    language: 'es',
  },

  // Variables de entorno necesarias (copiar a .env.local una vez creado el agente)
  required_env_vars: {
    ELEVENLABS_API_KEY: 'sk_... (ya existente)',
    ELEVENLABS_AGENT_ID_AGROBICIUFA: 'agent_... (obtenido en dashboard)',
    ELEVENLABS_VOICE_ID: 'kulszILr6ees0ArU8miO',
    WHATSAPP_PHONE_NUMBER_ID_AGROBICIUFA: '54911... (número WhatsApp Business)',
  },

  // Costo estimado
  cost_estimate: {
    tts_web: 'Incluido en plan ElevenLabs (por caracteres)',
    whatsapp_agent: '$0.10 USD/min de conversación (plan Creator/Pro)',
    whatsapp_meta_api: '~$0.06 USD/conversación (Meta Business API)',
    estimacion_100conv_3min: '~$36 USD/mes adicionales',
  },
} as const;
