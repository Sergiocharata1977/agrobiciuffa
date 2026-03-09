const BASE_URL = (
  process.env.NEXT_PUBLIC_9001APP_URL ??
  process.env.NEXT_PUBLIC_DONC_SOLICITUDES_URL ??
  ''
).replace(/\/$/, '');

const TENANT_SLUG = (process.env.NEXT_PUBLIC_TENANT_SLUG ?? '').trim();

export type SolicitudTipo = 'repuesto' | 'servicio' | 'comercial';

interface BasePayload {
  tipo: SolicitudTipo;
  nombre: string;
  telefono: string;
  email: string;
  cuit?: string;
  website?: string;
  form_started_at?: number;
}

export interface RepuestoPayload extends BasePayload {
  tipo: 'repuesto';
  maquina_tipo: string;
  modelo: string;
  numero_serie?: string;
  descripcion_repuesto: string;
}

export interface ServicioPayload extends BasePayload {
  tipo: 'servicio';
  maquina_tipo: string;
  modelo: string;
  numero_serie?: string;
  descripcion_problema: string;
  localidad: string;
  provincia: string;
}

export interface ComercialPayload extends BasePayload {
  tipo: 'comercial';
  producto_id?: string;
  producto_nombre?: string;
  precio_referencia?: number | null;
  producto_interes: string;
  requiere_financiacion: boolean;
  comentarios: string;
}

export type SolicitudPayload = RepuestoPayload | ServicioPayload | ComercialPayload;

export interface SolicitudResponse {
  success: boolean;
  id: string;
  numeroSolicitud: string;
  tipo: SolicitudTipo;
  message: string;
  crmWarning?: string | null;
}

export async function enviarSolicitud(payload: SolicitudPayload): Promise<SolicitudResponse> {
  if (!BASE_URL) {
    throw new Error('El servicio de solicitudes no está configurado en este entorno.');
  }

  const response = await fetch(`${BASE_URL}/api/public/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      ...(TENANT_SLUG ? { tenant_slug: TENANT_SLUG } : {}),
    }),
  });

  const data = await response.json() as Record<string, unknown>;

  if (!response.ok || !data.success) {
    const message = typeof data.error === 'string' ? data.error : 'No se pudo registrar la solicitud.';
    throw new Error(message);
  }

  return data as unknown as SolicitudResponse;
}
