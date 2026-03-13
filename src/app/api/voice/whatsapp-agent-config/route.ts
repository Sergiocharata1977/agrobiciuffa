// GET /api/voice/whatsapp-agent-config
// Endpoint de diagnóstico interno — protegido con header x-admin-secret
import { AGROBICIUFA_AGENT_CONFIG } from '@/lib/voice/agrobiciufa-agent';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { required_env_vars: _hidden, ...safeConfig } = AGROBICIUFA_AGENT_CONFIG;

  return NextResponse.json({
    success: true,
    data: {
      ...safeConfig,
      env_configured: {
        api_key: !!process.env.ELEVENLABS_API_KEY,
        voice_id: !!process.env.ELEVENLABS_VOICE_ID,
        agent_id: !!process.env.ELEVENLABS_AGENT_ID_AGROBICIUFA,
        whatsapp_number: !!process.env.WHATSAPP_PHONE_NUMBER_ID_AGROBICIUFA,
      },
    },
  });
}
