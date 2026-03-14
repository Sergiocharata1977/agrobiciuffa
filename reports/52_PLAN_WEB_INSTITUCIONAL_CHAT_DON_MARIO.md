# Plan Web Institucional + Chat Don Mario IA — Ejecución multi-agente

**Fecha:** 2026-03-14
**Feature:** Convertir la landing actual en web institucional oficial de concesionario CASE IH + integrar Chat Don Mario IA con contexto del cliente en el portal
**Proyecto:** `Landing-Agrobiciufa`
**Prerequisito:** Report 51 completado (Auth propia, Admin Kanban, Portal base)

---

## Contexto y decisiones de arquitectura

### Lo que ya existe (NO tocar sin aviso)
| Recurso | Ruta | Estado |
|---------|------|--------|
| Landing one-page | `src/app/page.tsx` | Existe, se reemplaza |
| Chat widget flotante | `src/components/ChatWidget.tsx` + `ChatWindow.tsx` | Existe, se extiende |
| Portal cliente | `src/app/(dashboard)/` | Completado en R51 |
| API pública solicitudes | `src/app/api/public/solicitudes/route.ts` | Existe, no tocar |
| Auth Firebase | `src/app/(auth)/` | Completado en R51 |
| Admin Kanban | `src/app/admin/` | Completado en R51 |

### Arquitectura de rutas nueva (pública)
```
agrobiciufa.com/
├── /                         → Inicio institucional (reemplaza page.tsx actual)
├── /nosotros                 → Historia, misión, equipo, cobertura
├── /productos                → Catálogo por categorías CASE IH
│   └── /productos/[slug]     → Ficha por categoría (tractores, cosechadoras, etc.)
├── /repuestos                → Presentación + formulario específico
├── /servicio-tecnico         → Presentación + formulario solicitud técnica
├── /financiacion             → Opciones + formulario consulta financiera
├── /novedades                → Blog/noticias institucionales
│   └── /novedades/[slug]     → Artículo individual (fase 2)
├── /contacto                 → Contacto completo con mapa y formularios
└── /portal/                  → Portal cliente (ya existe — R51)
    ├── /portal/asistente     → Chat Don Mario IA con contexto cliente (NUEVO)
    └── /portal/dashboard     → Dashboard mejorado con acceso a Don Mario (NUEVO)
```

### Identidad visual Agrobiciufa
- Rojo primario CASE IH: `#c8102e` → `bg-red-600`, `hover:bg-red-700`
- Negro/oscuro: `#1a1a1a` → `zinc-900`
- Fondo claro: `zinc-50`, `white`
- Bordes: `zinc-200`
- Tipografía: `'Arial', 'Helvetica Neue', sans-serif` — NUNCA Google Fonts
- Estilo: corporativo-agro, limpio, robusto — NO e-commerce genérico

### Chat Don Mario IA — Decisiones
- Nombre público: **Don Mario** (asistente digital de Agrobiciufa)
- Stack: Claude SDK (`@anthropic-ai/sdk` ya instalado en el proyecto)
- En landing pública: widget flotante existente — mantener como captación anónima
- En portal cliente: versión **contextual** — conoce al cliente, sus equipos, sus solicitudes
- API: `/api/chat/don-mario/route.ts` — un endpoint, dos modos (anónimo vs. autenticado)
- Contexto del cliente se inyecta en el system prompt si hay token válido
- El chat puede iniciar solicitudes: guía al usuario y pre-llena `/nueva-solicitud`

### Formularios institucionales — Colecciones Firestore
| Formulario | Colección Firestore | Notas |
|------------|---------------------|-------|
| Contacto general | `contactos` | Nuevo |
| Consulta repuestos | `solicitudes` tipo=`repuesto` | Ya existe, reutilizar |
| Servicio técnico | `solicitudes` tipo=`servicio` | Ya existe, reutilizar |
| Financiación | `consultas_financieras` | Nuevo |
| Novedades (CRUD) | `novedades` | Nuevo, admin puede crear |

### Categorías de productos CASE IH (slugs)
```
tractores | cosechadoras | pulverizadores | sembradoras | heno-forraje | tecnologia-precision
```

---

## Resumen de olas

| Ola | Agentes | Paralelos entre sí | Dependen de |
|-----|---------|-------------------|-------------|
| 1 | 1A, 1B, 1C | Sí | Nada |
| 2 | 2A, 2B, 2C | Sí | Ola 1 completa |
| 3 | 3A, 3B, 3C | Sí | Ola 2 completa |
| 4 | 4A, 4B, 4C | Sí | Ola 2 completa |
| 5 | 5A, 5B | Sí | Olas 2 + 3 completas |

> Ola 4 puede ejecutarse en PARALELO con Ola 3 (son páginas independientes).

---

## Ola 1 — Fundaciones: Types + API + LLM service
> Ejecutar 1A + 1B + 1C en PARALELO

---

## Agente 1A — Types institucionales
**Puede ejecutarse en paralelo con:** 1B, 1C
**Depende de:** nada

### Objetivo
Crear todos los tipos TypeScript para la web institucional: productos, categorías, novedades, formularios y contexto del chat.

### Archivos a crear
- `src/types/institucional.ts` — Producto, CategoriaProducto, Novedad, FormContacto, FormRepuesto, FormServicio, FormFinanciacion
- `src/types/donmario.ts` — ChatContextCliente, DonMarioMessage, DonMarioSession

### Archivos a modificar
- Ninguno

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Firestore)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/types/ (glob — ver qué tipos ya existen)
- src/app/api/public/solicitudes/route.ts (ver estructura actual de solicitud)

TAREA: Crear 2 archivos de tipos en src/types/

--- src/types/institucional.ts ---

// Categorías de productos CASE IH
export type SlugCategoria =
  | 'tractores'
  | 'cosechadoras'
  | 'pulverizadores'
  | 'sembradoras'
  | 'heno-forraje'
  | 'tecnologia-precision';

export interface CategoriaProducto {
  slug: SlugCategoria;
  nombre: string;
  descripcion: string;
  imagen_url?: string;
  destacado: boolean;
  orden: number;
}

export interface Producto {
  id: string;
  categoria_slug: SlugCategoria;
  nombre: string;
  descripcion_corta: string;      // max 160 chars — para cards
  descripcion_completa?: string;  // HTML o markdown — para ficha
  beneficios?: string[];
  imagen_url?: string;
  imagenes?: string[];
  destacado: boolean;
  disponible: boolean;
  created_at: string;
}

export interface Novedad {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;              // max 200 chars
  cuerpo: string;               // HTML o markdown
  imagen_url?: string;
  publicada: boolean;
  publicada_at: string;         // ISO date
  created_at: string;
  tags?: string[];
}

// Formulario Contacto General
export interface FormContacto {
  nombre: string;
  empresa?: string;
  localidad: string;
  telefono: string;
  email: string;
  area: 'ventas' | 'repuestos' | 'servicio_tecnico' | 'administracion' | 'otro';
  mensaje: string;
}

// Formulario Consulta Repuestos (va a colección solicitudes tipo=repuesto)
export interface FormRepuesto {
  nombre: string;
  email?: string;
  telefono: string;
  localidad?: string;
  maquina_marca: string;
  maquina_modelo: string;
  maquina_serie?: string;
  descripcion_repuesto: string;
  codigo_repuesto?: string;
  urgencia?: 'normal' | 'urgente';
}

// Formulario Servicio Técnico (va a colección solicitudes tipo=servicio)
export interface FormServicio {
  nombre: string;
  email?: string;
  telefono: string;
  localidad: string;
  maquina_marca: string;
  maquina_modelo: string;
  maquina_serie?: string;
  descripcion_problema: string;
  tipo_atencion: 'taller' | 'campo' | 'cualquiera';
  urgencia?: 'normal' | 'urgente';
}

// Formulario Financiación
export interface FormFinanciacion {
  nombre: string;
  empresa?: string;
  email: string;
  telefono: string;
  localidad: string;
  interes: 'maquinaria_nueva' | 'repuestos' | 'servicio' | 'usados';
  descripcion?: string;
  // NUNCA pedir monto ni aprobar crédito — solo captar interés
}

--- src/types/donmario.ts ---

// Contexto del cliente inyectado en el system prompt de Don Mario
export interface ChatContextCliente {
  nombre: string;
  email: string;
  total_solicitudes: number;
  solicitudes_recientes: Array<{
    tipo: string;
    estado: string;
    equipo?: string;
    descripcion?: string;
    fecha: string;
  }>;
  equipos: Array<{
    marca: string;
    modelo: string;
    numero_serie: string;
    tipo: string;
  }>;
}

export interface DonMarioMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id: string;
}

export interface DonMarioSession {
  session_id: string;
  cliente_id?: string;        // presente si usuario autenticado
  modo: 'anonimo' | 'cliente';
  messages: DonMarioMessage[];
  created_at: string;
}

// Request al endpoint /api/chat/don-mario
export interface DonMarioRequest {
  message: string;
  session_id: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  // Si viene con token de auth → backend agrega el contexto del cliente
}

// Response del endpoint
export interface DonMarioResponse {
  reply: string;
  session_id: string;
  // Acciones sugeridas que el frontend puede renderizar como botones
  acciones?: Array<{
    label: string;
    href: string;
  }>;
}

CRITERIO DE ÉXITO: Los 2 archivos existen en src/types/ y compilan sin errores (tsc --noEmit).
NO modificar ningún archivo existente.
```

---

## Agente 1B — API routes de formularios institucionales
**Puede ejecutarse en paralelo con:** 1A, 1C
**Depende de:** nada

### Objetivo
Crear los endpoints públicos para los formularios institucionales: contacto, financiación, y adaptar el endpoint de solicitudes para aceptar los formularios de repuesto/servicio institucionales.

### Archivos a crear
- `src/app/api/public/contacto/route.ts` — POST formulario contacto → colección `contactos`
- `src/app/api/public/financiacion/route.ts` — POST formulario financiación → colección `consultas_financieras`
- `src/app/api/public/novedades/route.ts` — GET novedades publicadas (para la página pública)

### Archivos a modificar
- Ninguno (las solicitudes de repuesto/servicio ya van al endpoint existente `/api/public/solicitudes`)

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Admin SDK, Firestore)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE:
- src/app/api/public/solicitudes/route.ts (patrón exacto a seguir para las nuevas routes)
- package.json (verificar que zod y firebase-admin están instalados)

TAREA: Crear 3 API routes nuevas en src/app/api/public/

--- src/app/api/public/contacto/route.ts ---
POST: Guardar formulario de contacto general.
Validar con Zod:
  nombre: z.string().min(2)
  empresa: z.string().optional()
  localidad: z.string().min(2)
  telefono: z.string().min(8)
  email: z.string().email()
  area: z.enum(['ventas', 'repuestos', 'servicio_tecnico', 'administracion', 'otro'])
  mensaje: z.string().min(10).max(1000)
Guardar en Firestore colección 'contactos' con campos:
  - todos los campos del form
  - created_at: new Date().toISOString()
  - leido: false
  - origen: 'web_institucional'
Retornar: { success: true, id: docRef.id }
Error handling: { success: false, error: 'mensaje' } con status 400/500

--- src/app/api/public/financiacion/route.ts ---
POST: Guardar consulta de financiación.
Validar con Zod:
  nombre: z.string().min(2)
  empresa: z.string().optional()
  email: z.string().email()
  telefono: z.string().min(8)
  localidad: z.string().min(2)
  interes: z.enum(['maquinaria_nueva', 'repuestos', 'servicio', 'usados'])
  descripcion: z.string().max(500).optional()
Guardar en colección 'consultas_financieras' con:
  - todos los campos
  - created_at: now ISO
  - estado: 'pendiente'
  - origen: 'web_institucional'
IMPORTANTE: NO procesar ni aprobar nada — solo guardar el lead.
Retornar: { success: true }

--- src/app/api/public/novedades/route.ts ---
GET: Listar novedades publicadas.
Query params: limit (default 6), offset (default 0), tag (opcional)
Colección Firestore 'novedades', filtro: publicada == true
Ordenar por publicada_at desc.
Retornar: { novedades: Novedad[], total: number }
Si la colección está vacía → retornar { novedades: [], total: 0 } (no fallar).

PATRÓN OBLIGATORIO de todos los handlers:
- Try/catch global
- Log de error en consola
- Nunca exponer stack traces al cliente
- CORS headers si el proyecto los usa (verificar en el archivo existente)

CRITERIO DE ÉXITO: Los 3 archivos existen, compilan, siguen el mismo patrón que solicitudes/route.ts.
```

---

## Agente 1C — Servicio Chat Don Mario IA
**Puede ejecutarse en paralelo con:** 1A, 1B
**Depende de:** nada

### Objetivo
Crear el endpoint y el servicio LLM para Don Mario IA: modo anónimo (landing) y modo cliente (portal con contexto inyectado).

### Archivos a crear
- `src/app/api/chat/don-mario/route.ts` — POST endpoint unificado (anónimo + autenticado)
- `src/lib/donmario/donMarioService.ts` — lógica LLM + construcción de contexto

### Archivos a modificar
- Ninguno (el ChatWindow.tsx existente se actualiza en ola 2)

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Admin SDK)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE:
- package.json (verificar @anthropic-ai/sdk instalado — lo está)
- src/app/api/ (glob para ver qué APIs existen)
- src/app/(dashboard)/asistente/ (ver si hay API de chat existente)
- src/app/api/public/solicitudes/route.ts (patrón de API routes)

TAREA: Crear el servicio Don Mario IA

--- src/lib/donmario/donMarioService.ts ---

import Anthropic from '@anthropic-ai/sdk';
import type { ChatContextCliente, DonMarioResponse } from '@/types/donmario';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// System prompt base (anónimo — visitante de la landing)
const SYSTEM_PROMPT_BASE = `
Sos Don Mario, el asistente digital de Agro Biciuffa SRL, concesionario oficial CASE IH en Argentina.
Tu rol es ayudar a los clientes y visitantes a:
- Conocer los productos y servicios de Agro Biciuffa
- Iniciar consultas de repuestos, servicio técnico y maquinaria
- Orientar sobre financiación disponible
- Informar sobre ubicación y contacto
- Derivar a las áreas correctas según la consulta

Sobre Agro Biciuffa:
- Concesionario oficial CASE IH
- Servicios: venta de maquinaria nueva, repuestos originales, servicio técnico, financiación
- Zona de cobertura: región agropecuaria argentina (consultar para detalles exactos)
- Canales: web, WhatsApp, teléfono, atención personal en sucursal

Reglas:
- Respondé siempre en español argentino (vos, che, boludo=no, profesional)
- Sé conciso y directo — el cliente está en el campo o en la ruta
- Si no sabés algo específico (precio, stock) → decile que lo va a contactar un asesor
- Nunca inventes precios, stock, ni plazos de entrega
- Si la consulta es técnica compleja → derivá a servicio técnico humano
- Cuando el usuario quiera hacer una solicitud formal → guialo a usar el formulario correspondiente
- Máximo 3 párrafos por respuesta. Sé útil, no verboso.
`;

// System prompt para clientes autenticados — incluye contexto del cliente
function buildSystemPromptCliente(contexto: ChatContextCliente): string {
  const equiposStr = contexto.equipos.length > 0
    ? contexto.equipos.map(e => `${e.marca} ${e.modelo} (Serie: ${e.numero_serie})`).join(', ')
    : 'ninguno registrado';

  const solicitudesStr = contexto.solicitudes_recientes.length > 0
    ? contexto.solicitudes_recientes
        .slice(0, 3)
        .map(s => `${s.tipo} (${s.estado}) - ${s.equipo ?? ''} - ${s.descripcion?.slice(0, 60) ?? ''}`)
        .join('\n    ')
    : 'ninguna reciente';

  return `${SYSTEM_PROMPT_BASE}

--- CONTEXTO DEL CLIENTE AUTENTICADO ---
Nombre: ${contexto.nombre}
Email: ${contexto.email}
Total solicitudes históricas: ${contexto.total_solicitudes}

Equipos registrados:
  ${equiposStr}

Solicitudes recientes:
  ${solicitudesStr}

Usá este contexto para personalizar las respuestas. Por ejemplo:
- Podés mencionar los equipos del cliente por nombre/modelo
- Podés hacer seguimiento de sus solicitudes recientes
- No tenés que pedirle datos que ya tenés
---`;
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

  // Construir messages para Anthropic (últimos 10 intercambios para no saturar)
  const messages = [
    ...history.slice(-10).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: message },
  ];

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',   // haiku — rápido y económico para chat
    max_tokens: 400,
    system: systemPrompt,
    messages,
  });

  const reply = response.content[0].type === 'text'
    ? response.content[0].text
    : 'Lo siento, no pude procesar tu consulta. Intentá de nuevo.';

  // Detectar si el usuario quiere hacer una solicitud formal → sugerir acciones
  const acciones = detectarAcciones(message, reply);

  return { reply, session_id: '', acciones };
}

// Detección básica de intención para sugerir acciones rápidas
function detectarAcciones(
  userMsg: string,
  _reply: string
): DonMarioResponse['acciones'] {
  const msg = userMsg.toLowerCase();
  const acciones: DonMarioResponse['acciones'] = [];

  if (msg.includes('repuesto') || msg.includes('parte') || msg.includes('pieza')) {
    acciones.push({ label: 'Solicitar repuesto', href: '/nueva-solicitud?tipo=repuesto' });
  }
  if (msg.includes('técnico') || msg.includes('falla') || msg.includes('reparar') || msg.includes('service')) {
    acciones.push({ label: 'Solicitar servicio técnico', href: '/nueva-solicitud?tipo=servicio' });
  }
  if (msg.includes('precio') || msg.includes('cotiz') || msg.includes('comprar') || msg.includes('maquina')) {
    acciones.push({ label: 'Consultar comercial', href: '/contacto?area=ventas' });
  }
  if (msg.includes('financ') || msg.includes('crédito') || msg.includes('cuota')) {
    acciones.push({ label: 'Consultar financiación', href: '/financiacion' });
  }

  return acciones.length > 0 ? acciones : undefined;
}

--- src/app/api/chat/don-mario/route.ts ---

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { donMarioChat } from '@/lib/donmario/donMarioService';
// Importar serverAuth de R51 si ya existe, o implementar verificación básica
// import { getAuthenticatedUser } from '@/lib/auth/serverAuth';
// Importar clientesService para obtener contexto del cliente autenticado

const RequestSchema = z.object({
  message: z.string().min(1).max(1000),
  session_id: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(20),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { message, session_id, history } = parsed.data;

    // Intentar obtener contexto del cliente si viene autenticado
    // (modo anónimo si no hay token válido — no falla, solo no agrega contexto)
    let contextoCliente = undefined;
    try {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        // Si serverAuth está disponible (R51), usarlo aquí
        // const user = await getAuthenticatedUser(request);
        // if (user) { contextoCliente = await buildContextoCliente(user.uid); }
        // Por ahora dejar como placeholder — el agente de ola 2 lo completa
      }
    } catch {
      // No fallar si no hay auth — solo modo anónimo
    }

    const result = await donMarioChat({ message, history, contextoCliente });
    result.session_id = session_id;

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Don Mario API]', error);
    return NextResponse.json(
      { error: 'Error interno. Intentá de nuevo.' },
      { status: 500 }
    );
  }
}

NOTAS:
- ANTHROPIC_API_KEY ya debe estar en .env.local del proyecto Landing
- Usar modelo claude-haiku-4-5-20251001 (rápido, económico para chat)
- El contexto del cliente es OPCIONAL — si no hay auth funciona en modo anónimo
- NO implementar streaming por ahora — response simple JSON

CRITERIO DE ÉXITO: El endpoint responde con { reply, session_id, acciones? } cuando se le hace POST.
tsc --noEmit sin errores.
```

---

## Ola 2 — Componentes base institucionales
> Ejecutar solo después de que OLA 1 esté completa
> Ejecutar 2A + 2B + 2C en PARALELO

---

## Agente 2A — Layout institucional: Navbar multi-página + Footer
**Puede ejecutarse en paralelo con:** 2B, 2C
**Depende de:** Ola 1 completa

### Objetivo
Crear el Navbar institucional multi-página con menú completo y el Footer corporativo obligatorio. Reemplazar el nav minimalista actual.

### Archivos a crear
- `src/components/layout/NavbarInstitucional.tsx` — Navbar responsive con menú completo
- `src/components/layout/FooterInstitucional.tsx` — Footer corporativo completo
- `src/app/layout.tsx` — MODIFICAR: agregar Navbar + Footer en el layout raíz (si no interfiere con dashboard/admin)

### Archivos a modificar
- `src/app/layout.tsx` — agregar NavbarInstitucional y FooterInstitucional condicional (solo en rutas públicas, no en /portal ni /admin)

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE:
- src/app/layout.tsx (layout raíz actual)
- src/app/page.tsx (ver el nav actual — mínimo, a reemplazar)
- src/app/(dashboard)/layout.tsx (el dashboard tiene su propio layout — no interferir)
- src/components/layout/ (ver qué ya existe)

PALETA OBLIGATORIA:
- Rojo: #c8102e — bg-red-600, hover:bg-red-700, text-red-600
- Oscuro: zinc-900 (#18181b)
- Claro: white, zinc-50
- Borde: zinc-200
- Fuente: 'Arial', 'Helvetica Neue', sans-serif — NO importar Google Fonts

TAREA: Crear componentes de layout institucional

--- src/components/layout/NavbarInstitucional.tsx ---
'use client' — Navbar fijo (sticky top-0) con:

Logo:
  "AGRO" + "BICIUFFA" (BICIUFFA en rojo) + "SRL" pequeño
  Link href="/"

Menú desktop (md:flex, hidden en mobile):
  - Inicio → /
  - Nosotros → /nosotros
  - Productos (dropdown) → /productos
    Submenu: Tractores | Cosechadoras | Pulverizadores | Sembradoras | Tecnología
  - Repuestos → /repuestos
  - Servicio Técnico → /servicio-tecnico
  - Financiación → /financiacion
  - Novedades → /novedades
  - Contacto → /contacto

Acciones derecha:
  - Botón "Mi Cuenta" → /portal (link estilo outline, icono user)
  - Botón "Contactar" → /contacto (bg-red-600, texto white)

Menú mobile (hamburger):
  - Sheet/Drawer que abre desde la derecha
  - Mismo menú en vertical
  - Botones de acción al final

Comportamiento:
  - Fondo: blanco sólido al hacer scroll (usar useScrollY > 10)
  - Fondo: blanco/90 + backdrop-blur cuando arriba
  - Bordes inferiores: border-b zinc-200 cuando scrolleado

NO usar backdrop-filter en SSR — solo 'use client'.
Usar lucide-react para iconos (Menu, X, User, ChevronDown, Phone).

--- src/components/layout/FooterInstitucional.tsx ---
Footer corporativo completo. NO 'use client' (es estático).

Estructura en 4 columnas (grid md:grid-cols-4):
  Col 1 — Identidad:
    Logo AGROBICIUFFA SRL
    Breve descripción: "Concesionario oficial CASE IH. Venta de maquinaria, repuestos originales y servicio técnico especializado."
    Redes sociales si existen (Facebook, Instagram — usar iconos placeholder)

  Col 2 — Servicios:
    Productos
    Repuestos
    Servicio Técnico
    Financiación
    Usados (próximamente)

  Col 3 — Empresa:
    Nosotros
    Novedades
    Contacto
    Área de Clientes
    Política de Privacidad

  Col 4 — Contacto:
    Dirección: [placeholder — configurar con datos reales]
    Teléfono: [placeholder]
    WhatsApp: [link wa.me/54XXXXXXXXX]
    Email: [placeholder]
    Horario: Lun-Vie 8 a 18 hs / Sáb 8 a 13 hs

Parte inferior:
  Copyright 2026 Agro Biciuffa SRL. Todos los derechos reservados.
  Links: Política de Privacidad | Aviso Legal

ESTILO: Fondo zinc-900, texto white/70, links hover:text-white, rojo para acentos.

--- src/app/layout.tsx (MODIFICAR) ---
IMPORTANTE: Leer el archivo actual primero (muy importante — no romper el layout existente).
Solo agregar NavbarInstitucional y FooterInstitucional usando pathname para renderizado condicional.
Las rutas /portal/* y /admin/* tienen sus propios layouts — NO agregar nav/footer en esas rutas.
Solución: usar middleware o pathname check en el layout.
Alternativa más segura: NO modificar el layout raíz — en cambio, crear un layout para las rutas públicas:
  src/app/(public)/layout.tsx — layout que wrappea navbar + footer
  Y mover las páginas públicas (/, /nosotros, /productos, etc.) a src/app/(public)/
ELEGIR la alternativa más segura para no romper /portal y /admin.

CRITERIO DE ÉXITO: Navbar aparece en páginas públicas, NO aparece en /portal ni /admin. Footer ídem.
```

---

## Agente 2B — Componentes institucionales reutilizables
**Puede ejecutarse en paralelo con:** 2A, 2C
**Depende de:** Ola 1 completa

### Objetivo
Crear la librería de componentes visuales institucionales que usarán todas las páginas públicas.

### Archivos a crear
- `src/components/institucional/HeroSection.tsx` — Hero con imagen, título, subtítulo, CTAs
- `src/components/institucional/CategoriaCard.tsx` — Card de categoría de producto
- `src/components/institucional/FortalezaCard.tsx` — Card de atributo/fortaleza institucional
- `src/components/institucional/CTASection.tsx` — Sección de llamada a acción con fondo rojo
- `src/components/institucional/FormInstitucional.tsx` — Wrapper genérico de formulario con estado
- `src/components/institucional/PageHeader.tsx` — Header de página interna (título + breadcrumb + imagen de fondo)

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS, Lucide React)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/app/page.tsx (ver el estilo visual actual — referencia de diseño)
- src/components/ui/ (ver qué componentes UI base existen: Button, Input, etc.)
- src/types/institucional.ts (tipos creados en ola 1)

PALETA: rojo #c8102e (red-600), zinc palette, white — SIN Google Fonts.
ESTILO GENERAL: corporativo-agro — limpio, robusto, NO pasteles ni e-commerce.

TAREA: Crear 6 componentes en src/components/institucional/

--- HeroSection.tsx ---
'use client'
Props:
  titulo: string
  subtitulo?: string
  imagen_url?: string          // URL de imagen de fondo (Unsplash agro por defecto)
  ctas: Array<{ label: string; href: string; variant: 'primary' | 'outline' }>
  tag?: string                 // Texto pequeño encima del título ej: "Concesionario oficial CASE IH"

Layout:
  - Sección full-height (min-h-[600px]) con imagen de fondo + overlay oscuro
  - Content centrado (container mx-auto text-center)
  - Tag: texto pequeño rojo/blanco con borde
  - Título: text-4xl md:text-6xl font-bold text-white
  - Subtítulo: text-lg text-white/80
  - CTAs: botones usando <a href> (no Link de Next) para simplicidad
  - Botón primary: bg-red-600 hover:bg-red-700 text-white
  - Botón outline: border border-white text-white hover:bg-white/10

--- CategoriaCard.tsx ---
Props:
  slug: SlugCategoria
  nombre: string
  descripcion: string
  imagen_url?: string
  href: string

Card 280px width, hover:scale-105, sombra suave.
Imagen superior (object-cover, aspect-[4/3]).
Badge con el nombre de la categoría.
Descripción (2 líneas max, overflow hidden).
Botón "Ver más" → href.
Estilo: fondo blanco, borde zinc-200, hover border-red-200.

--- FortalezaCard.tsx ---
Props:
  icono: React.ReactNode
  titulo: string
  descripcion: string

Card cuadrada, centrada.
Ícono en círculo rojo (w-12 h-12 bg-red-50 text-red-600).
Título bold zinc-900.
Descripción text-sm zinc-600.
Sin borde — layout de grid 3-4 columnas.

--- CTASection.tsx ---
Props:
  titulo: string
  subtitulo?: string
  ctas: Array<{ label: string; href: string }>
  variante?: 'rojo' | 'oscuro' | 'claro'

Sección de ancho completo con padding py-16.
Variante rojo: bg-red-600 text-white.
Variante oscuro: bg-zinc-900 text-white.
Variante claro: bg-zinc-50 text-zinc-900.
CTAs: botones white (en rojo/oscuro) o red-600 (en claro).

--- FormInstitucional.tsx ---
'use client'
Props:
  titulo: string
  descripcion?: string
  children: React.ReactNode          // Los campos del formulario
  onSubmit: (e: React.FormEvent) => Promise<void>
  submitLabel?: string               // default "Enviar consulta"
  successMessage?: string            // default "¡Gracias! Te contactamos pronto."

Maneja estados: idle | loading | success | error.
Muestra spinner en loading, mensaje de éxito en success, error message en error.
Botón submit deshabilitado en loading.

--- PageHeader.tsx ---
Props:
  titulo: string
  subtitulo?: string
  breadcrumb?: Array<{ label: string; href?: string }>
  imagen_fondo?: string

Sección py-20 con imagen de fondo + overlay oscuro suave.
Breadcrumb links separados por " / ".
Título text-3xl md:text-5xl text-white font-bold.
Subtítulo text-white/80.

CRITERIO DE ÉXITO: Los 6 componentes existen, son 'use client' o Server Component según necesidad, compilan sin errores. NO crean páginas ni routes.
```

---

## Agente 2C — Chat Don Mario IA: componente de portal con contexto
**Puede ejecutarse en paralelo con:** 2A, 2B
**Depende de:** Ola 1 completa (necesita types/donmario.ts y el endpoint)

### Objetivo
Crear el componente de chat mejorado para el portal cliente (contextual, con acciones rápidas) y actualizar el ChatWindow de la landing para que apunte al nuevo endpoint.

### Archivos a crear
- `src/components/donmario/DonMarioChat.tsx` — Chat embebido para portal (con contexto cliente)
- `src/components/donmario/DonMarioAcciones.tsx` — Botones de acción sugeridos por el chat

### Archivos a modificar
- `src/components/ChatWindow.tsx` — Cambiar endpoint de chat al nuevo `/api/chat/don-mario`

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE:
- src/components/ChatWindow.tsx (componente a modificar — leer ENTERO)
- src/components/ChatWidget.tsx (FAB flotante — no modificar, solo referenciar)
- src/types/donmario.ts (DonMarioMessage, DonMarioRequest, DonMarioResponse)
- src/hooks/ (ver si hay hooks de chat existentes)

TAREA 1: Actualizar ChatWindow.tsx para usar el nuevo endpoint

En ChatWindow.tsx, cambiar el endpoint de chat:
- Buscar la URL del endpoint actual (probablemente /api/chat o /api/asistente o similar)
- Cambiar a POST /api/chat/don-mario
- El body debe ser: { message, session_id, history: messages previos (solo role+content) }
- La response tiene: { reply, session_id, acciones? }
- Si la response incluye acciones → mostrar DonMarioAcciones bajo el último mensaje del asistente
- NO cambiar la estructura visual del ChatWindow — solo el endpoint y el manejo de acciones

TAREA 2: Crear DonMarioAcciones.tsx
Props: { acciones: Array<{ label: string; href: string }> }
Renderiza botones pill horizontales (flex-wrap gap-2).
Estilo: border border-red-600 text-red-600 hover:bg-red-50 rounded-full px-3 py-1 text-sm.
Click en botón → navegar con router.push(href).
'use client' — usa useRouter de next/navigation.

TAREA 3: Crear DonMarioChat.tsx (para portal — embebido, NO flotante)
'use client'
Props:
  modo: 'portal'               // siempre portal en este componente
  tokenCliente?: string        // idToken de Firebase del cliente logueado
  className?: string

Este componente es el chat embebido en una página del portal (NO el widget flotante).
Diferencias vs ChatWindow:
  - No es un modal/overlay — está integrado en la página (height: h-[600px] o flex-1)
  - Envía el token en Authorization: Bearer ${tokenCliente} → el backend agrega contexto
  - Tiene un header: "Don Mario — Tu asistente de Agro Biciuffa" con avatar
  - Mensaje de bienvenida personalizado: "Hola [nombre del cliente si está disponible]. ¿En qué te ayudo?"
  - Soporta acciones sugeridas (DonMarioAcciones)
  - Input con placeholder "Consultá sobre repuestos, servicio técnico o maquinaria..."

Estructura visual:
  - Header: bg-red-600 text-white, avatar Don Mario (icono robot o tractor), título
  - Body: área de mensajes scrolleable
  - Input: fijo al fondo, fondo zinc-50, borde zinc-200

Fetch al endpoint /api/chat/don-mario con:
  - headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenCliente}` }
  - body: { message, session_id, history }

CRITERIO DE ÉXITO:
- ChatWindow.tsx actualizado para usar /api/chat/don-mario
- DonMarioAcciones.tsx existe y muestra botones pill clickeables
- DonMarioChat.tsx existe, embebible en página, envía token, muestra acciones
- tsc --noEmit sin errores
```

---

## Ola 3 — Páginas públicas principales
> Ejecutar solo después de que OLA 2 esté completa
> Ejecutar 3A + 3B + 3C en PARALELO

---

## Agente 3A — Página Inicio (upgrade institucional)
**Puede ejecutarse en paralelo con:** 3B, 3C
**Depende de:** Ola 2 completa

### Objetivo
Reemplazar la landing one-page actual por una Inicio institucional multi-sección que use los nuevos componentes y link a todas las páginas.

### Archivos a modificar
- `src/app/page.tsx` (o `src/app/(public)/page.tsx` si se usó route groups) — reemplazar completamente

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE:
- src/app/page.tsx (la página actual — entender qué hay y qué se reemplaza)
- src/components/institucional/ (todos los componentes de ola 2)
- src/types/institucional.ts
- src/components/forms/FormSolicitud.tsx (formulario existente — mantener o referenciar)

TAREA: Reemplazar completamente src/app/page.tsx con la nueva Inicio institucional.

IMPORTANTE: El archivo actual tiene el FormSolicitud al final — MANTENERLO o reemplazarlo por una sección de contacto que linkea a /contacto.

Secciones de la nueva página Inicio (en orden):

1. HERO PRINCIPAL (usar <HeroSection />)
   - titulo: "Maquinaria, Repuestos y Servicio Técnico CASE IH"
   - subtitulo: "Concesionario oficial. Acompañamos al productor antes, durante y después de la compra."
   - tag: "Concesionario Oficial CASE IH"
   - imagen_url: imagen agro de alta calidad (Unsplash agro existente o nueva)
   - ctas: [
       { label: "Ver Productos", href: "/productos", variant: "primary" },
       { label: "Contactar un Asesor", href: "/contacto", variant: "outline" }
     ]

2. ACCESOS RÁPIDOS (sección py-12 bg-white)
   - Grid 2x2 o 4 columnas de cards de acceso rápido con ícono + título + descripción breve + link
   - Maquinaria → /productos
   - Repuestos → /repuestos
   - Servicio Técnico → /servicio-tecnico
   - Mi Cuenta → /portal
   Iconos lucide: Tractor, Package, Wrench, User

3. LÍNEAS DE NEGOCIO (sección py-16 bg-zinc-50)
   - Título: "Todo lo que necesitás en un solo lugar"
   - Grid de CategoriaCard para las 6 categorías CASE IH
   - Imágenes: usar Unsplash agro por categoría (tractor, cosechadora, etc.)
   - Botón al final: "Ver todos los productos" → /productos

4. FORTALEZAS (sección py-16 bg-white)
   - Título: "¿Por qué elegir Agro Biciuffa?"
   - Grid 3 columnas de FortalezaCard:
     { icono: <Settings/>, titulo: "Técnicos Capacitados", descripcion: "Personal formado en fábrica con herramientas de diagnóstico especializadas." }
     { icono: <Package/>, titulo: "Stock de Repuestos", descripcion: "Repuestos originales CASE IH disponibles para respuesta rápida." }
     { icono: <HeadphonesIcon/>, titulo: "Atención Personalizada", descripcion: "Asesoramiento comercial y técnico adaptado a tu establecimiento." }
     { icono: <MapPin/>, titulo: "Cobertura Regional", descripcion: "Presencia en toda la zona con servicio en taller y en campo." }
     { icono: <Shield/>, titulo: "Respaldo de Marca", descripcion: "Garantía y soporte oficial CASE IH en cada operación." }
     { icono: <Zap/>, titulo: "Posventa Garantizada", descripcion: "Seguimiento del equipo durante toda su vida útil." }

5. RESUMEN INSTITUCIONAL (sección py-16 bg-zinc-900 text-white)
   - Texto de presentación de Agro Biciuffa SRL
   - Destacar: trayectoria, compromiso, cobertura territorial, respaldo
   - CTA: "Conocer más sobre nosotros" → /nosotros

6. CTA FINAL (usar <CTASection /> variante rojo)
   - titulo: "¿Listo para optimizar tu campo?"
   - subtitulo: "Hablá con un asesor o iniciá tu consulta ahora mismo."
   - ctas: [
       { label: "Contactar Asesor", href: "/contacto" },
       { label: "Solicitar Repuesto", href: "/repuestos" }
     ]

NOTAS:
- Es Server Component (no 'use client' en page.tsx) — los componentes interactivos ya son 'use client'
- Mantener el ChatWidget flotante (ya existe, importarlo como dynamic import sin ssr)
- Eliminar las secciones antiguas que queden redundantes con la nueva estructura

CRITERIO DE ÉXITO: La página compila, se ve profesional con todas las secciones, el ChatWidget sigue flotando, links a las páginas institucionales funcionan.
```

---

## Agente 3B — Páginas Nosotros y Contacto
**Puede ejecutarse en paralelo con:** 3A, 3C
**Depende de:** Ola 2 completa

### Objetivo
Crear las páginas `/nosotros` y `/contacto` institucionales completas.

### Archivos a crear
- `src/app/(public)/nosotros/page.tsx` — Página institucional empresa
- `src/app/(public)/contacto/page.tsx` — Contacto completo con formulario general

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/components/institucional/ (todos los componentes de ola 2)
- src/components/layout/ (NavbarInstitucional, FooterInstitucional)
- src/types/institucional.ts (FormContacto)

PALETA: rojo #c8102e, zinc, white — NO Google Fonts.

TAREA: Crear 2 páginas institucionales

--- src/app/(public)/nosotros/page.tsx ---
Server Component. Título: "Nosotros | Agro Biciuffa SRL"
Usar <PageHeader /> con: titulo="Quiénes Somos", subtitulo="Concesionario oficial CASE IH con presencia regional"

Secciones:
1. Historia y misión (py-16 bg-white)
   - Grid 2 columnas: texto izquierda, imagen derecha
   - Texto: párrafo de historia de la empresa (placeholder formal), misión, compromiso con el productor
   - Imagen: foto de instalaciones/taller (placeholder Unsplash)

2. Valores institucionales (py-16 bg-zinc-50)
   - Título: "Nuestros valores"
   - Grid 3 col de FortalezaCard: Integridad | Servicio | Excelencia técnica | Compromiso regional | Innovación | Transparencia

3. Cobertura y presencia (py-16 bg-white)
   - Texto sobre zona de cobertura
   - Posible mapa estático (iframe Google Maps o imagen placeholder)
   - Datos de contacto: dirección, teléfono, horarios

4. CTA (usar CTASection variante rojo)
   - "¿Querés trabajar con nosotros?" → /contacto

--- src/app/(public)/contacto/page.tsx ---
'use client' (tiene formulario interactivo). Título: "Contacto | Agro Biciuffa SRL"
Usar <PageHeader /> con: titulo="Contacto", subtitulo="Estamos para ayudarte"

Layout: 2 columnas en desktop — formulario izquierda (60%), datos derecha (40%)

COLUMNA DATOS (derecha):
  Dirección (placeholder), Teléfono (placeholder), WhatsApp (link wa.me/placeholder),
  Email (placeholder), Horarios (Lun-Vie 8-18 / Sáb 8-13)
  Mapa: <iframe> de Google Maps (usar placeholder con "Ubicación de Agro Biciuffa")
  Botones acceso rápido: "Consultar Repuesto" → /repuestos | "Servicio Técnico" → /servicio-tecnico

FORMULARIO (izquierda) — usar <FormInstitucional />:
  Campos (todos con label + validación básica):
  - nombre: string, required
  - empresa: string, opcional
  - localidad: string, required
  - telefono: string, required (min 8 dígitos)
  - email: email, required
  - area: select → ['Ventas', 'Repuestos', 'Servicio Técnico', 'Administración', 'Otro']
  - mensaje: textarea, required (min 10 chars)

  Submit → POST /api/public/contacto
  Validación básica en cliente antes de enviar.
  En éxito: mensaje "¡Gracias [nombre]! Nos comunicamos pronto."
  En error: mensaje de error.

Pre-selección de área desde query param: si la URL tiene ?area=ventas → seleccionar ese value.
Usar useSearchParams() para leer el query.

CRITERIO DE ÉXITO: Las 2 páginas compilan, /nosotros tiene todas las secciones, /contacto tiene formulario funcional que llama a la API.
```

---

## Agente 3C — Página Productos por categorías
**Puede ejecutarse en paralelo con:** 3A, 3B
**Depende de:** Ola 2 completa

### Objetivo
Crear la página `/productos` con catálogo por categorías CASE IH y la ficha por slug de categoría.

### Archivos a crear
- `src/app/(public)/productos/page.tsx` — Página catálogo por categorías
- `src/app/(public)/productos/[slug]/page.tsx` — Ficha de categoría con descripción y formulario de consulta

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/components/institucional/ (CategoriaCard, PageHeader, CTASection)
- src/types/institucional.ts (SlugCategoria, CategoriaProducto)

TAREA: Crear las páginas de productos

DATOS ESTÁTICOS de categorías (inline en el código por ahora — sin CMS):
const CATEGORIAS: CategoriaProducto[] = [
  { slug: 'tractores', nombre: 'Tractores', descripcion: 'Series Puma, Maxxum, Farmall y Magnum para toda escala de trabajo agrícola.', destacado: true, orden: 1 },
  { slug: 'cosechadoras', nombre: 'Cosechadoras', descripcion: 'Axial-Flow — tecnología de flujo axial para máxima eficiencia de cosecha.', destacado: true, orden: 2 },
  { slug: 'pulverizadores', nombre: 'Pulverizadores', descripcion: 'Patriot — pulverizadores autopropulsados de alta precisión.', destacado: true, orden: 3 },
  { slug: 'sembradoras', nombre: 'Sembradoras', descripcion: 'Early Riser — sembradoras de precisión para siembra directa.', destacado: false, orden: 4 },
  { slug: 'heno-forraje', nombre: 'Heno y Forraje', descripcion: 'Equipos para corte, acondicionamiento y empaque de forraje.', destacado: false, orden: 5 },
  { slug: 'tecnologia-precision', nombre: 'Tecnología de Precisión', descripcion: 'AFS Connect — conectividad, monitoreo y gestión de datos agronómicos.', destacado: false, orden: 6 },
];

--- src/app/(public)/productos/page.tsx ---
Server Component.
<PageHeader titulo="Línea de Productos" subtitulo="Maquinaria CASE IH para cada necesidad del productor" />

Sección destacados (py-16): grid de las 3 categorías destacadas con CategoriaCard grande.
Sección completa (py-16 bg-zinc-50): grid 3 columnas de todas las categorías.
Cada CategoriaCard → href: /productos/[slug]

CTASection al final: "¿No encontrás lo que buscás? Consultá con un asesor" → /contacto?area=ventas

--- src/app/(public)/productos/[slug]/page.tsx ---
Server Component con generateStaticParams.
Leer el slug de params, buscar en CATEGORIAS.
Si no existe el slug → notFound().

Layout:
  <PageHeader titulo={categoria.nombre} subtitulo={categoria.descripcion} />

  Sección descripción (py-16 bg-white):
    - Texto descriptivo de la categoría (contenido detallado por slug — hardcodeado por ahora)
    - Para tractores: mencionar series Puma/Maxxum/Farmall/Magnum
    - Para cosechadoras: mencionar Axial-Flow, eficiencia, telemetría
    - Para pulverizadores: Patriot, precisión, conectividad
    - Para el resto: descripción general de beneficios CASE IH
    - Imagen placeholder representativa

  Sección consulta (py-16 bg-zinc-50):
    Formulario simple 'use client': nombre, email, teléfono, mensaje
    Submit → POST /api/public/contacto con area='ventas' y mensaje pre-completado con la categoría
    Título: "Consultá sobre [categoria.nombre]"

  CTASection variante oscuro: "¿Necesitás repuestos o servicio para tu equipo CASE?" → /repuestos

generateStaticParams() → retorna los 6 slugs para generación estática.

CRITERIO DE ÉXITO: /productos muestra las 6 categorías con cards, /productos/tractores muestra la ficha, el formulario de consulta funciona.
```

---

## Ola 4 — Páginas de posventa y servicio
> Puede ejecutarse en PARALELO con Ola 3 (son páginas completamente independientes)
> Ejecutar 4A + 4B + 4C en PARALELO

---

## Agente 4A — Página Repuestos con formulario específico
**Puede ejecutarse en paralelo con:** 4B, 4C
**Depende de:** Ola 2 completa

### Objetivo
Crear la página `/repuestos` institucional con formulario de consulta de repuestos específico.

### Archivos a crear
- `src/app/(public)/repuestos/page.tsx` — Página repuestos + formulario de consulta

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/components/institucional/ (PageHeader, FormInstitucional, CTASection, FortalezaCard)
- src/types/institucional.ts (FormRepuesto)
- src/app/api/public/solicitudes/route.ts (ver qué campos acepta — el formulario envía a este endpoint con tipo=repuesto)

TAREA: Crear src/app/(public)/repuestos/page.tsx

La página tiene parte Server (estructura) + parte Client (formulario).
Estrategia: page.tsx es Server Component, el formulario se extrae a src/components/institucional/FormRepuestoSection.tsx ('use client').

Secciones de la página:

1. PageHeader: titulo="Repuestos Originales" subtitulo="Identificación, disponibilidad y asesoramiento técnico para tu equipo CASE IH"

2. Presentación del área (py-16 bg-white):
   Título: "Repuestos originales con respaldo de marca"
   Grid 3 col de FortalezaCard:
   - { icono: Package, titulo: "Stock Disponible", descripcion: "Inventario permanente de piezas de alta rotación." }
   - { icono: Search, titulo: "Identificación Técnica", descripcion: "Asesoramiento para identificar correctamente el repuesto por modelo y serie." }
   - { icono: Truck, titulo: "Respuesta Rápida", descripcion: "Optimizamos los tiempos para minimizar la parada del equipo." }
   Texto de apoyo: "Contamos con repuestos originales CASE IH para toda la línea de maquinaria. Si no tenemos el repuesto en stock, lo gestionamos."

3. Formulario de consulta (py-16 bg-zinc-50):
   Título: "Solicitá tu repuesto"
   Descripción: "Completá el formulario y te contactamos con disponibilidad y precio."

   Formulario con campos (enviar a POST /api/public/solicitudes con tipo='repuesto'):
   - nombre: text, required
   - telefono: text, required
   - email: email, opcional
   - localidad: text, opcional
   - maquina_marca: text default "CASE IH", required
   - maquina_modelo: text, required ("Ej: Puma 185, Axial-Flow 7130")
   - maquina_serie: text, opcional ("Número de serie del equipo")
   - descripcion_repuesto: textarea, required ("Describí la pieza o falla")
   - codigo_repuesto: text, opcional ("Código de parte si lo tenés")
   - urgencia: select ['Normal', 'Urgente'], required

   Mapeo al body de /api/public/solicitudes:
   { tipo: 'repuesto', cliente_nombre: nombre, cliente_telefono: telefono, cliente_email: email,
     localidad, equipo_modelo: `${maquina_marca} ${maquina_modelo}`, equipo_serie: maquina_serie,
     descripcion: descripcion_repuesto, codigo_repuesto, urgencia }

   En éxito: "¡Consulta recibida! Un asesor de repuestos te contacta a la brevedad."

4. CTASection variante oscuro:
   "¿Necesitás servicio técnico para tu equipo?" + CTA → /servicio-tecnico

CRITERIO DE ÉXITO: /repuestos compila, el formulario envía correctamente a /api/public/solicitudes, mensaje de éxito se muestra.
```

---

## Agente 4B — Página Servicio Técnico con formulario
**Puede ejecutarse en paralelo con:** 4A, 4C
**Depende de:** Ola 2 completa

### Objetivo
Crear la página `/servicio-tecnico` institucional con formulario de solicitud técnica.

### Archivos a crear
- `src/app/(public)/servicio-tecnico/page.tsx` — Página servicio técnico + formulario

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/components/institucional/ (PageHeader, FormInstitucional, CTASection, FortalezaCard)
- src/types/institucional.ts (FormServicio)
- src/app/api/public/solicitudes/route.ts (endpoint destino con tipo=servicio)

TAREA: Crear src/app/(public)/servicio-tecnico/page.tsx

Secciones:

1. PageHeader: titulo="Servicio Técnico" subtitulo="Atención preventiva y correctiva por técnicos capacitados CASE IH"

2. Capacidades del taller (py-16 bg-white):
   Título: "Nuestro servicio técnico"
   Grid 2 columnas: texto izquierda, imagen taller derecha.
   Texto: capacidad del taller, técnicos capacitados por fábrica, diagnóstico electrónico, herramientas especiales, literatura técnica actualizada.
   Grid 3 col FortalezaCard:
   - { icono: Cpu, titulo: "Diagnóstico Electrónico", descripcion: "Equipamiento de diagnóstico oficial CASE IH para todos los sistemas." }
   - { icono: Users, titulo: "Técnicos Certificados", descripcion: "Personal capacitado y actualizado permanentemente por fábrica." }
   - { icono: MapPin, titulo: "Servicio en Campo", descripcion: "Atención en taller o asistencia directa en el establecimiento." }

3. Formulario de solicitud (py-16 bg-zinc-50):
   Título: "Solicitá asistencia técnica"
   Descripción: "Completá el formulario y un técnico se comunica para coordinar la atención."

   Campos (enviar a POST /api/public/solicitudes con tipo='servicio'):
   - nombre: text, required
   - telefono: text, required
   - email: email, opcional
   - localidad: text, required ("¿Dónde se encuentra el equipo?")
   - maquina_marca: text default "CASE IH", required
   - maquina_modelo: text, required
   - maquina_serie: text, opcional
   - descripcion_problema: textarea, required ("Describí la falla o necesidad de mantenimiento")
   - tipo_atencion: select ['En taller', 'En campo', 'Sin preferencia'], required
   - urgencia: select ['Normal', 'Urgente — equipo parado'], required

   Mapeo al body de /api/public/solicitudes:
   { tipo: 'servicio', cliente_nombre: nombre, cliente_telefono: telefono, cliente_email: email,
     localidad, equipo_modelo: `${maquina_marca} ${maquina_modelo}`, equipo_serie: maquina_serie,
     descripcion: descripcion_problema, tipo_atencion, urgencia }

   En éxito: "¡Solicitud recibida! Un técnico se comunica pronto para coordinar la atención."

4. CTASection variante rojo:
   "¿Necesitás un repuesto para el equipo?" + CTA → /repuestos

CRITERIO DE ÉXITO: /servicio-tecnico compila, formulario funciona correctamente enviando a la API.
```

---

## Agente 4C — Páginas Financiación y Novedades
**Puede ejecutarse en paralelo con:** 4A, 4B
**Depende de:** Ola 2 completa

### Objetivo
Crear la página `/financiacion` con formulario de consulta financiera y la página `/novedades` que lista artículos desde Firestore.

### Archivos a crear
- `src/app/(public)/financiacion/page.tsx` — Presentación financiación + formulario
- `src/app/(public)/novedades/page.tsx` — Lista de novedades institucionales

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/components/institucional/ (PageHeader, FormInstitucional, CTASection, FortalezaCard)
- src/types/institucional.ts (FormFinanciacion, Novedad)
- src/app/api/public/financiacion/route.ts (endpoint de ola 1)
- src/app/api/public/novedades/route.ts (endpoint de ola 1)

TAREA: Crear 2 páginas

--- src/app/(public)/financiacion/page.tsx ---
'use client' (tiene formulario). Título: "Financiación | Agro Biciuffa SRL"

<PageHeader titulo="Financiación" subtitulo="Alternativas de financiación para maquinaria, repuestos y servicios" />

Sección informativa (py-16 bg-white):
  IMPORTANTE — disclaimers obligatorios:
  - "Las condiciones están sujetas a evaluación crediticia y vigencia."
  - "No realizamos aprobaciones automáticas ni garantizamos tasas por este medio."
  Texto: describir que existen alternativas de financiación para maquinaria nueva, repuestos y servicios según campaña vigente.
  FortalezaCard x3: Maquinaria nueva | Repuestos | Posventa

Formulario (py-16 bg-zinc-50):
  Título: "Consultá disponibilidad de financiación"
  Descripción: "Completá tus datos y un asesor comercial se comunica con las opciones disponibles."
  Campos:
  - nombre: text, required
  - empresa: text, opcional
  - email: email, required
  - telefono: text, required
  - localidad: text, required
  - interes: select ['Maquinaria Nueva', 'Repuestos', 'Servicio / Posventa', 'Usados'], required
  - descripcion: textarea, opcional ("Contanos más sobre lo que necesitás")

  Submit → POST /api/public/financiacion
  En éxito: "¡Gracias! Un asesor comercial se comunica con las opciones disponibles para tu caso."

CTASection: "¿Buscás maquinaria nueva?" → /productos

--- src/app/(public)/novedades/page.tsx ---
Server Component (carga datos en servidor).

Cargar novedades desde /api/public/novedades (fetch interno) o directamente desde Firestore Admin SDK.
Si no hay novedades → mostrar estado vacío elegante: "Próximamente — Novedades institucionales, campañas y eventos."

<PageHeader titulo="Novedades" subtitulo="Campañas, lanzamientos y novedades de Agro Biciuffa" />

Grid de cards de novedades:
  Card: imagen + titulo + resumen + fecha + link "Leer más" (por ahora sin subpágina — fase 2)
  Estado vacío: ilustración o ícono + texto placeholder

CRITERIO DE ÉXITO: /financiacion compila, formulario funciona con disclaimers visibles. /novedades compila y muestra estado vacío graceful si no hay contenido en Firestore.
```

---

## Ola 5 — Portal cliente: Dashboard mejorado + Chat Don Mario contextual
> Ejecutar solo después de que OLAS 2 y 3 estén completas
> Ejecutar 5A + 5B en PARALELO

---

## Agente 5A — Dashboard portal mejorado
**Puede ejecutarse en paralelo con:** 5B
**Depende de:** Olas 2 y 3 completas

### Objetivo
Crear/mejorar el dashboard del portal cliente con accesos rápidos, resumen de solicitudes y acceso prominente a Don Mario.

### Archivos a crear
- `src/app/(dashboard)/dashboard/page.tsx` — Dashboard principal del portal (puede ya existir — mejorar)

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE:
- src/app/(dashboard)/dashboard/page.tsx (puede ya existir — si existe, mejorar; si no, crear)
- src/app/(dashboard)/layout.tsx (ver el layout del dashboard)
- src/types/admin.ts (SolicitudAdmin — si ya existe de R51)
- src/types/donmario.ts (para el link al asistente)
- src/components/donmario/ (ver si DonMarioChat ya existe de ola 2)

TAREA: Crear/mejorar el dashboard del portal cliente

Si el archivo ya existe: leerlo completo y MEJORAR preservando lo que hay.
Si no existe: crear desde cero.

Layout del dashboard (grid md:grid-cols-3):

COLUMNA IZQUIERDA (col-span-2):
  1. Saludo personalizado: "Hola, [nombre del usuario]!" + fecha actual

  2. Accesos rápidos (grid 2x2):
     - Mis Solicitudes → /mis-solicitudes (ícono FileText, badge con cantidad pendientes)
     - Mis Equipos → /mis-equipos (ícono Tractor, badge con cantidad de equipos)
     - Nueva Solicitud → /nueva-solicitud (ícono Plus, destacado en rojo)
     - Mi Perfil → /mi-cuenta (ícono User)

  3. Solicitudes recientes (últimas 3):
     Carga GET /api/portal/mis-solicitudes?limit=3 (si existe el endpoint de R51)
     Muestra mini-cards con: tipo (badge), estado (badge color), equipo, fecha relativa
     Link "Ver todas" → /mis-solicitudes
     Si no hay solicitudes: "Todavía no tenés solicitudes. ¿Necesitás algo?"

COLUMNA DERECHA (col-span-1):
  4. Card de Don Mario IA:
     Header: "Don Mario" + ícono robot/tractor en rojo
     Texto: "Tu asistente digital. Consultá sobre repuestos, servicio técnico o el estado de tus solicitudes."
     Botón prominente: "Chatear con Don Mario" → /asistente (rojo, tamaño completo)
     Mini preview: los últimos 2 mensajes del historial si hay sesión activa (localStorage)

  5. Contacto rápido:
     Teléfono de Agro Biciuffa con botón "Llamar"
     WhatsApp con link directo
     "Atención: Lun-Vie 8-18 / Sáb 8-13"

ESTILO: Mobile-first. En mobile las columnas se apilan. Colores: rojo para CTAs principales, zinc palette para fondos.

CRITERIO DE ÉXITO: El dashboard compila, muestra el saludo, los accesos, las solicitudes recientes, y el acceso a Don Mario. Mobile-first.
```

---

## Agente 5B — Página /portal/asistente con Chat Don Mario contextual
**Puede ejecutarse en paralelo con:** 5A
**Depende de:** Olas 2 y 3 completas (necesita DonMarioChat del agente 2C)

### Objetivo
Crear la página dedicada del portal cliente para chatear con Don Mario IA, con contexto completo del cliente inyectado.

### Archivos a crear
- `src/app/(dashboard)/asistente/page.tsx` — Página de Chat Don Mario IA en el portal

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS, Firebase Auth)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE:
- src/app/(dashboard)/asistente/page.tsx (puede ya existir — si existe, REEMPLAZAR con la nueva versión)
- src/components/donmario/DonMarioChat.tsx (componente de ola 2 — usar como componente principal)
- src/app/(dashboard)/layout.tsx (layout del portal)
- src/types/donmario.ts

TAREA: Crear/reemplazar la página /asistente del portal

Esta es la página principal del Chat Don Mario IA para clientes autenticados.

--- src/app/(dashboard)/asistente/page.tsx ---
'use client'

Obtener el token del cliente desde localStorage 'portal_token' (o el key que use el portal).
Usar el componente DonMarioChat con el token.

Layout:
  - La página ocupa la mayor parte del viewport: flex flex-col h-full
  - Encabezado de página: "Don Mario — Asistente de Agro Biciuffa"
    Subtexto: "Consultá sobre tus solicitudes, equipos, repuestos o cualquier necesidad."
  - DonMarioChat ocupa el espacio restante: flex-1

  Información adicional debajo del chat (si hay espacio en desktop):
    "Don Mario puede ayudarte a..." con lista de capacidades:
    - Iniciar solicitudes de repuesto o servicio técnico
    - Consultar el estado de tus solicitudes
    - Informarte sobre maquinaria CASE IH
    - Conectarte con un asesor humano

IMPORTANTE sobre el token:
  El token se lee de localStorage dentro de useEffect (no en render inicial — evitar hydration mismatch).
  Mientras se carga el token: mostrar skeleton/loading del chat.
  Si no hay token → redirigir a /portal/login.

Patrón de implementación:
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = localStorage.getItem('portal_token');
    setToken(t);
    setLoading(false);
    if (!t) router.push('/portal/login');
  }, []);

CRITERIO DE ÉXITO: La página compila, DonMarioChat se renderiza con el token del cliente, el chat se conecta a /api/chat/don-mario con Authorization header.
```

---

## Verificación final

### Web institucional pública
- [ ] `/` — Inicio carga con todas las secciones, ChatWidget flotante visible
- [ ] `/nosotros` — Página institucional con historia, valores, cobertura
- [ ] `/productos` — Grid de 6 categorías CASE IH con cards funcionales
- [ ] `/productos/tractores` — Ficha de categoría con descripción y formulario de consulta
- [ ] `/repuestos` — Formulario de repuesto envía correctamente a Firestore
- [ ] `/servicio-tecnico` — Formulario técnico envía correctamente a Firestore
- [ ] `/financiacion` — Disclaimers visibles, formulario funciona
- [ ] `/novedades` — Estado vacío elegante (sin contenido real aún)
- [ ] `/contacto` — Formulario con selector de área, envía a `/api/public/contacto`
- [ ] Navbar aparece en todas las rutas públicas — NO en /portal ni /admin
- [ ] Footer aparece en todas las rutas públicas — NO en /portal ni /admin
- [ ] Diseño responsive (mobile, tablet, desktop)

### Chat Don Mario IA
- [ ] ChatWidget flotante en landing pública funciona con nuevo endpoint `/api/chat/don-mario`
- [ ] Don Mario responde en español argentino, sugiere acciones relevantes
- [ ] Botones de acción sugeridos son clickeables y navegan correctamente
- [ ] En portal: Don Mario recibe token, responde con contexto del cliente
- [ ] En modo anónimo (sin token): funciona sin contexto — no falla

### Portal cliente
- [ ] Dashboard muestra saludo, accesos rápidos, solicitudes recientes
- [ ] Acceso a Don Mario es prominente en el dashboard
- [ ] `/portal/asistente` carga DonMarioChat con el token del cliente
- [ ] El chat en portal NO muestra ChatWidget flotante (ya está embebido)

### TypeScript
- [ ] `tsc --noEmit` sin errores en toda la Landing-Agrobiciufa

### APIs
- [ ] `POST /api/public/contacto` → guarda en Firestore colección `contactos`
- [ ] `POST /api/public/financiacion` → guarda en colección `consultas_financieras`
- [ ] `GET /api/public/novedades` → retorna `{ novedades: [], total: 0 }` sin errores
- [ ] `POST /api/chat/don-mario` → responde correctamente en modo anónimo y con token

---

## Variables de entorno necesarias (verificar en .env.local de Landing)

```bash
# Ya debe estar si se usó en ola 1C:
ANTHROPIC_API_KEY=sk-ant-...

# Firebase (ya deben estar):
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...
```

---

## Dependencias a verificar antes de empezar

```bash
# En Landing-Agrobiciufa
npm ls @anthropic-ai/sdk      # debe estar (0.78.0)
npm ls firebase               # SDK cliente
npm ls firebase-admin         # SDK server
npm ls framer-motion          # para animaciones opcionales
npm ls zod                    # para validación de formularios
```

---

## Fases futuras (fuera de scope de este plan)

| Feature | Prioridad | Notas |
|---------|-----------|-------|
| Novedades con subpágina `/novedades/[slug]` | Media | Cuando haya contenido real |
| Panel admin `/admin/web` para editar novedades/productos | Media | CMS básico |
| Página Usados `/usados` | Baja | Cuando haya inventario real |
| Integración CRM externo (webhook) | Alta | Pendiente definición de API |
| Don Mario con historial persistente en Firestore | Media | Hoy es stateless por sesión |
| SEO avanzado — schema LocalBusiness | Baja | Post-lanzamiento |
| Google Analytics / Meta Pixel | Media | Configurar en producción |
