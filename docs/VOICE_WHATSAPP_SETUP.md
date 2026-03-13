# Guía de Configuración: Voz y WhatsApp con ElevenLabs

**Proyecto:** Landing-Agrobiciufa
**Fecha:** 2026-03-13

---

## Parte 1 — TTS Web (Chat de la Landing)

1. Copiar `.env.example` → `.env.local`
2. Completar `ELEVENLABS_API_KEY` con tu API key de https://elevenlabs.io/app/settings/api-keys
3. Verificar que funciona:
   ```bash
   curl -X POST http://localhost:3000/api/voice/tts \
     -H "Content-Type: application/json" \
     -d '{"text":"Hola, soy el asistente de Agrobiciufa"}' \
     --output test.mp3
   ```
   Reproducir `test.mp3` — debe escucharse la voz.

4. En el chat de la landing:
   - Cada mensaje del asistente tiene un botón 🔊 para escucharlo
   - El ícono de auriculares (🎧) en el header activa el **autoplay** (reproduce automáticamente cada respuesta)

---

## Parte 2 — Crear Agente en ElevenLabs Dashboard

1. Ir a https://elevenlabs.io/app/conversational-ai
2. Hacer clic en **"Create Agent"**
3. Pegar el `system_prompt` de `src/lib/voice/agrobiciufa-agent.ts`
4. En Voice: seleccionar o crear voz (Voice ID: `kulszILr6ees0ArU8miO`)
5. Guardar el agente → copiar el **Agent ID** (formato: `agent_xxxx`)
6. Pegar en `.env.local`:
   ```
   ELEVENLABS_AGENT_ID_AGROBICIUFA=agent_xxxx
   ```

---

## Parte 3 — Conectar WhatsApp Business

**Requisitos:** Meta Business Manager con cuenta WhatsApp Business verificada.

1. En el dashboard del agente → **Channels** → **WhatsApp**
2. Hacer clic en **"Connect WhatsApp Account"**
3. Autorizar con OAuth de Meta (cuenta de Agrobiciufa)
4. Seleccionar el número WhatsApp Business de Agrobiciufa
5. Copiar el **Phone Number ID** → pegar en `.env.local`:
   ```
   WHATSAPP_PHONE_NUMBER_ID_AGROBICIUFA=54911...
   ```
6. Guardar y testear: enviar un mensaje de WhatsApp al número → el agente debe responder

### Activar mensajes de audio en WhatsApp
En el dashboard del agente → WhatsApp → activar **"Enable audio message response"**
Esto permite que el agente responda con mensajes de voz además de texto.

---

## Parte 4 — Costos Estimados

| Servicio | Costo |
|---|---|
| TTS Web (por caracteres) | Incluido en plan ElevenLabs actual |
| WhatsApp Agent (por minuto de conversación) | $0.10 USD/min (Creator/Pro) · $0.08 USD/min (Business anual) |
| WhatsApp Business API — Meta | ~$0.06 USD/conversación (Argentina) |
| **Estimación 100 conversaciones × 3 min/mes** | **~$36 USD/mes adicionales** |

---

## Parte 5 — Verificar todo funciona

- [ ] `GET /api/voice/whatsapp-agent-config` con header `x-admin-secret` devuelve `env_configured.api_key: true`
- [ ] El chat de la landing muestra botón 🔊 en mensajes del asistente
- [ ] Click en 🔊 reproduce la respuesta en audio
- [ ] El toggle 🎧 en el header activa/desactiva autoplay
- [ ] Un mensaje de WhatsApp al número de Agrobiciufa recibe respuesta del agente ElevenLabs
- [ ] `npx tsc --noEmit` sin errores

---

## Archivos de código relevantes

| Archivo | Descripción |
|---|---|
| `src/app/api/voice/tts/route.ts` | Proxy TTS → ElevenLabs API |
| `src/hooks/useVoicePlayer.ts` | Hook React para reproducción de audio |
| `src/lib/voice/agrobiciufa-agent.ts` | Config del agente (pegar en dashboard) |
| `src/app/api/voice/whatsapp-agent-config/route.ts` | Endpoint diagnóstico (requiere `x-admin-secret`) |
| `src/components/ChatWindow.tsx` | Chat con botones de voz integrados |

---

## Fuentes

- [ElevenLabs Agents + WhatsApp support](https://elevenlabs.io/blog/elevenlabs-agents-whatsapp-support)
- [ElevenLabs Conversational AI pricing](https://help.elevenlabs.io/hc/en-us/articles/29298065878929)
- [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
