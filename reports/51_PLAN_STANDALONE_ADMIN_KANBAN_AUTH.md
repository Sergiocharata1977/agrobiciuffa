# Plan Standalone Agrobiciufa — Auth + Admin Kanban + Portal Cliente

**Fecha:** 2026-03-14
**Feature:** Desconectar Landing Agrobiciufa de 9001app-firebase. Implementar Auth propia (Firebase), panel `/admin` con roles (mecánico / repuestero / admin), kanban Taller + kanban Repuestos, y portal `/portal` para clientes.
**Proyecto:** `Landing-Agrobiciufa`

---

## Contexto y decisiones de arquitectura

### Roles definidos
| Rol | Acceso |
|-----|--------|
| `cliente` | `/portal` — sus propias solicitudes y equipos |
| `mecanico` | `/admin/taller` — kanban Servicios Técnicos |
| `repuestero` | `/admin/repuestos` — kanban Repuestos |
| `admin` | Todo: ambos kanbans + gestión clientes + web |

### Mapa de rutas
```
agrobiciufa.com/
├── /                       → Landing pública (ya existe)
├── /portal                 → Clientes logueados
│   ├── /portal/mis-solicitudes
│   ├── /portal/mis-equipos
│   ├── /portal/login
│   └── /portal/registro
├── /admin                  → Panel interno (protegido por Firebase Auth + rol)
│   ├── /admin/taller       → Kanban mecánicos (Servicios Técnicos)
│   ├── /admin/repuestos    → Kanban repuesteros
│   ├── /admin/clientes     → Ficha y lista de clientes
│   └── /admin/web          → Gestión contenido (fase futura)
└── /api/
    ├── /api/public/solicitudes → POST sin auth (ya existe, actualizar)
    └── /api/admin/*            → Con auth admin
```

### Colecciones Firestore (Landing propia)
- `solicitudes` — ya existe. Agregar campo `cliente_id` (opcional hasta ola 2)
- `clientes` — nueva. Creada/actualizada en cada solicitud nueva
- `equipos_cliente` — nueva. Equipos registrados por número de serie

### Auth
- Firebase Auth propio en Landing (independiente de 9001app)
- Custom claims: `{ role: 'cliente' | 'mecanico' | 'repuestero' | 'admin' }`
- Middleware Next.js protege `/admin/*` y `/portal/*`

### Pendiente (bloqueado por CRM externo)
- Identificador único del cliente: usar `email` por ahora, migrar cuando se defina con dev del CRM
- Sincronización con CRM externo: pendiente API/webhook del CRM de Agrobiciufa

---

## Resumen de olas

| Ola | Agentes | Paralelos entre sí | Dependen de |
|-----|---------|-------------------|-------------|
| 1 | 1A, 1B, 1C | Sí | Nada |
| 2 | 2A, 2B, 2C | Sí | Ola 1 completa |
| 3 | 3A, 3B | Sí | Ola 2 completa |
| 4 | 4A, 4B, 4C | Sí | Ola 3 completa |
| 5 | 5A, 5B, 5C | Sí | Ola 3 completa |

---

## Ola 1 — Fundaciones: Types + Auth helpers + Firestore utils
> Ejecutar 1A + 1B + 1C en PARALELO

---

## Agente 1A — Types: auth, clientes, admin
**Puede ejecutarse en paralelo con:** 1B, 1C
**Depende de:** nada

### Objetivo
Crear todos los tipos TypeScript del sistema standalone (roles, clientes, equipos, solicitudes admin, kanban).

### Archivos a crear
- `src/types/auth.ts` — UserRole enum, UserClaims interface, DecodedToken
- `src/types/clientes.ts` — Cliente, EquipoCliente interfaces
- `src/types/admin.ts` — SolicitudAdmin (extiende solicitud existente con cliente_id), EstadoSolicitud union

### Archivos a modificar
- Ninguno

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Firestore)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer estos archivos para entender los tipos existentes:
- src/types/ (hacer glob para ver qué existe)
- src/app/api/public/solicitudes/route.ts (ver estructura de solicitud actual)

TAREA: Crear 3 archivos de tipos en src/types/

--- src/types/auth.ts ---
export type UserRole = 'cliente' | 'mecanico' | 'repuestero' | 'admin';

export interface UserClaims {
  role: UserRole;
  organizationId?: string; // futuro: multi-tenant
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}

--- src/types/clientes.ts ---
export interface Cliente {
  id: string; // Firestore doc ID
  email: string; // identificador principal por ahora
  nombre: string;
  telefono?: string;
  localidad?: string;
  cuit?: string; // pendiente definición con CRM
  created_at: string; // ISO date
  updated_at: string;
  total_solicitudes: number;
  // Futura FK a CRM externo:
  crm_id?: string;
}

export interface EquipoCliente {
  id: string;
  cliente_id: string;
  numero_serie: string;
  marca: string;
  modelo: string;
  anio?: number;
  tipo: 'Tractor' | 'Cosechadora' | 'Pulverizadora' | string;
  created_at: string;
}

--- src/types/admin.ts ---
// Importar el tipo de solicitud existente si hay, extenderlo
// EstadoSolicitud debe coincidir con los estados usados en el kanban existente

export type EstadoSolicitudServicio =
  | 'nueva'
  | 'diagnostico'
  | 'presupuestada'
  | 'aprobada'
  | 'en_trabajo'
  | 'completada';

export type EstadoSolicitudRepuesto =
  | 'nueva'
  | 'verificando_stock'
  | 'cotizada'
  | 'aprobada'
  | 'en_preparacion'
  | 'entregada';

export interface SolicitudAdmin {
  id: string;
  cliente_id?: string; // FK a colección clientes
  cliente_nombre: string;
  cliente_email?: string;
  cliente_telefono?: string;
  tipo: 'servicio' | 'repuesto' | 'comercial';
  estado: string;
  equipo_serie?: string;
  equipo_modelo?: string;
  descripcion?: string;
  created_at: string;
  updated_at?: string;
  asignado_a?: string; // uid del mecánico/repuestero
  notas?: string;
}

CRITERIO DE ÉXITO: Los 3 archivos existen en src/types/ y compilan sin errores (tsc --noEmit).
NO modificar ningún archivo existente.
```

---

## Agente 1B — Firebase Admin + Custom Claims helpers
**Puede ejecutarse en paralelo con:** 1A, 1C
**Depende de:** nada

### Objetivo
Crear helpers para manejar Firebase Auth custom claims (asignar roles, verificar rol en server side).

### Archivos a crear
- `src/lib/auth/customClaims.ts` — setUserRole, getUserRole, verifySessionCookie
- `src/lib/auth/serverAuth.ts` — getAuthenticatedUser (lee cookie/header, devuelve AuthUser)

### Archivos a modificar
- Ninguno (no tocar firebase-admin.ts existente si ya existe)

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Admin SDK)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer estos archivos para entender el setup existente:
- src/lib/ (glob para ver qué hay)
- package.json (verificar que firebase-admin está instalado)
- Cualquier archivo que ya use firebase-admin

TAREA: Crear helpers de auth en src/lib/auth/

--- src/lib/auth/customClaims.ts ---
import { getAuth } from 'firebase-admin/auth';
import type { UserRole } from '@/types/auth';

// Asignar rol a un usuario (llamar desde API admin)
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await getAuth().setCustomUserClaims(uid, { role });
}

// Obtener rol actual de un usuario
export async function getUserRole(uid: string): Promise<UserRole | null> {
  const user = await getAuth().getUser(uid);
  return (user.customClaims?.role as UserRole) ?? null;
}

// Verificar token ID de Firebase y extraer claims
export async function verifyIdToken(token: string) {
  const decoded = await getAuth().verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    role: (decoded.role as UserRole) ?? 'cliente',
  };
}

--- src/lib/auth/serverAuth.ts ---
// Extraer y verificar el usuario autenticado desde un Request de Next.js
// Lee el header Authorization: Bearer <token>
import { verifyIdToken } from './customClaims';
import type { AuthUser } from '@/types/auth';

export async function getAuthenticatedUser(request: Request): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const decoded = await verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      displayName: null,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

// Helper para API routes: lanza 401/403 si no tiene el rol requerido
export async function requireRole(request: Request, allowedRoles: string[]) {
  const user = await getAuthenticatedUser(request);
  if (!user) throw new Error('UNAUTHORIZED');
  if (!allowedRoles.includes(user.role)) throw new Error('FORBIDDEN');
  return user;
}

NOTAS:
- Usar firebase-admin/auth (no el SDK cliente)
- Si no existe src/lib/firebase-admin.ts con initializeApp, crearlo también
- NO crear endpoints ni páginas, solo los helpers de lib/

CRITERIO DE ÉXITO: Los archivos existen, TypeScript compila, no importan nada del SDK cliente de Firebase.
```

---

## Agente 1C — clientesService: CRUD Firestore
**Puede ejecutarse en paralelo con:** 1A, 1B
**Depende de:** nada

### Objetivo
Crear el servicio Firestore para la colección `clientes` — crear, buscar por email, actualizar contador de solicitudes.

### Archivos a crear
- `src/lib/clientes/clientesService.ts` — upsertCliente, getClienteByEmail, getClienteById, listClientes

### Archivos a modificar
- Ninguno

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Admin SDK, Firestore)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer estos archivos para entender el patrón existente:
- src/lib/ (glob)
- src/app/api/public/solicitudes/route.ts (ver cómo se escribe a Firestore hoy)

TAREA: Crear src/lib/clientes/clientesService.ts

La colección en Firestore se llama 'clientes'.
Identificador principal por ahora: email (string normalizado a lowercase).

Implementar estas funciones (todas server-side, usando firebase-admin Firestore):

1. upsertCliente(data: { email: string; nombre: string; telefono?: string; localidad?: string }): Promise<string>
   - Busca cliente por email en la colección
   - Si existe: actualiza nombre/telefono/localidad si vienen, retorna el id existente
   - Si no existe: crea documento nuevo con created_at = now, total_solicitudes = 0
   - Retorna el id del cliente (string)

2. getClienteByEmail(email: string): Promise<Cliente | null>
   - Query Firestore por campo email == email.toLowerCase()
   - Retorna el primer match o null

3. getClienteById(id: string): Promise<Cliente | null>
   - getDoc por id, retorna null si no existe

4. listClientes(opts?: { limit?: number; offset?: number }): Promise<Cliente[]>
   - Query colección clientes ordenado por created_at desc
   - limit default 50

5. incrementSolicitudes(clienteId: string): Promise<void>
   - FieldValue.increment(1) en campo total_solicitudes

Importar el tipo Cliente desde @/types/clientes (que crea agente 1A).
Usar firebase-admin Firestore (getFirestore() from 'firebase-admin/firestore').

CRITERIO DE ÉXITO: El archivo compila con tsc --noEmit. No crea endpoints ni páginas.
```

---

## Ola 2 — Middleware + API routes admin
> Ejecutar solo después de que OLA 1 esté completa
> Ejecutar 2A + 2B + 2C en PARALELO

---

## Agente 2A — Middleware Next.js con guards de rol
**Puede ejecutarse en paralelo con:** 2B, 2C
**Depende de:** Ola 1 completa (necesita types/auth.ts)

### Objetivo
Actualizar (o crear) el middleware de Next.js para proteger `/admin/*` y `/portal/*` verificando Firebase Auth token y rol.

### Archivos a modificar
- `middleware.ts` (raíz del proyecto) — agregar guards para /admin y /portal

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Auth)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- middleware.ts (raíz del proyecto — puede no existir)
- src/types/auth.ts (creado en ola 1)
- next.config.mjs o next.config.ts

TAREA: Crear/actualizar middleware.ts en la raíz del proyecto.

Reglas de protección:
- /admin/* → requiere token válido con role en ['mecanico', 'repuestero', 'admin']
  - /admin/taller → role in ['mecanico', 'admin']
  - /admin/repuestos → role in ['repuestero', 'admin']
  - /admin/clientes → role in ['admin']
- /portal/* → requiere token válido con role in ['cliente', 'admin']
- /api/admin/* → requiere token válido con role in ['mecanico', 'repuestero', 'admin']
- Todo lo demás → libre (landing pública)

El middleware debe:
1. Leer el token desde header Authorization O desde cookie 'session'
2. Verificar con Firebase Admin Auth (verifyIdToken)
3. Si no hay token → redirect a /portal/login (para /portal) o /admin/login (para /admin)
4. Si hay token pero rol incorrecto → redirect a /unauthorized

IMPORTANTE: El middleware de Next.js corre en Edge Runtime — NO puede usar firebase-admin directamente.
Usar verificación JWT manual o llamar a un endpoint interno /api/auth/verify.
Alternativa preferida: usar el campo 'role' del JWT de Firebase (custom claim) decodificando sin verificar firma en el middleware, y verificar la firma en cada API route.

CRITERIO DE ÉXITO: El middleware existe, compila, y las rutas protegidas redirigen correctamente.
```

---

## Agente 2B — API routes admin (solicitudes + clientes)
**Puede ejecutarse en paralelo con:** 2A, 2C
**Depende de:** Ola 1 completa

### Objetivo
Crear las API routes del panel admin: PATCH estado de solicitud, GET lista de clientes, GET detalle cliente.

### Archivos a crear
- `src/app/api/admin/solicitudes/[id]/route.ts` — PATCH estado
- `src/app/api/admin/clientes/route.ts` — GET lista
- `src/app/api/admin/clientes/[id]/route.ts` — GET detalle + PATCH datos

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Admin SDK)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/app/api/public/solicitudes/route.ts (patrón existente)
- src/lib/auth/serverAuth.ts (creado en ola 1)
- src/lib/clientes/clientesService.ts (creado en ola 1)
- src/types/admin.ts (creado en ola 1)

TAREA: Crear 3 API routes en src/app/api/admin/

--- src/app/api/admin/solicitudes/[id]/route.ts ---
PATCH: Actualizar estado de una solicitud
- requireRole(request, ['mecanico', 'repuestero', 'admin'])
- Leer { estado, notas? } del body
- Validar que el estado sea válido (según tipo de solicitud)
- Actualizar en Firestore colección 'solicitudes' → campos: estado, updated_at, notas
- Retornar { success: true, id, estado }

--- src/app/api/admin/clientes/route.ts ---
GET: Listar clientes
- requireRole(request, ['admin'])
- Query params: limit (default 50), offset (default 0)
- Llamar listClientes() del clientesService
- Retornar { clientes: Cliente[], total: number }

--- src/app/api/admin/clientes/[id]/route.ts ---
GET: Detalle de cliente con sus solicitudes
- requireRole(request, ['mecanico', 'repuestero', 'admin'])
- getClienteById(id)
- También query solicitudes donde cliente_id == id, ordenadas por created_at desc
- Retornar { cliente: Cliente, solicitudes: SolicitudAdmin[] }

PATCH: Actualizar datos del cliente
- requireRole(request, ['admin'])
- Actualizar campos: nombre, telefono, localidad, cuit
- Retornar { success: true }

Patrón de error: return NextResponse.json({ success: false, error: '...' }, { status: 401|403|404|500 })
CRITERIO DE ÉXITO: Las routes existen, compilan, usan requireRole correctamente.
```

---

## Agente 2C — Actualizar endpoint público solicitudes (vincular cliente)
**Puede ejecutarse en paralelo con:** 2A, 2B
**Depende de:** Ola 1 completa

### Objetivo
Actualizar `POST /api/public/solicitudes` para que en cada nueva solicitud, cree o actualice automáticamente el cliente en la colección `clientes` y guarde el `cliente_id` en la solicitud.

### Archivos a modificar
- `src/app/api/public/solicitudes/route.ts` — agregar upsertCliente + vincular cliente_id

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, Firebase Admin SDK)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/app/api/public/solicitudes/route.ts (archivo a modificar)
- src/lib/clientes/clientesService.ts (creado en ola 1)

TAREA: Modificar el handler POST en src/app/api/public/solicitudes/route.ts

Cambios a hacer:
1. Importar upsertCliente e incrementSolicitudes de @/lib/clientes/clientesService
2. Después de validar el body y ANTES de guardar la solicitud en Firestore:
   - Si el body tiene email (string no vacío):
     - Llamar: const clienteId = await upsertCliente({ email, nombre, telefono, localidad })
     - Agregar cliente_id: clienteId al objeto que se guarda en Firestore
     - Llamar: await incrementSolicitudes(clienteId) después de guardar la solicitud
   - Si no hay email: guardar solicitud normalmente sin cliente_id

3. No cambiar nada más — no cambiar validaciones, no cambiar response format, no cambiar otros campos.

El campo 'email' puede o no estar en el body actual. Si no está en el schema de validación Zod, agregarlo como opcional: email: z.string().email().optional()

CRITERIO DE ÉXITO: El endpoint sigue funcionando para solicitudes sin email. Para solicitudes con email, crea/actualiza el cliente y guarda cliente_id en la solicitud.
```

---

## Ola 3 — Layouts y navegación
> Ejecutar solo después de que OLA 2 esté completa
> Ejecutar 3A + 3B en PARALELO

---

## Agente 3A — Layout /admin con nav por rol
**Puede ejecutarse en paralelo con:** 3B
**Depende de:** Ola 2 completa

### Objetivo
Crear el layout del panel admin con navegación lateral que muestra las secciones según el rol del usuario logueado.

### Archivos a crear
- `src/app/admin/layout.tsx` — layout con sidebar
- `src/app/admin/login/page.tsx` — página de login admin
- `src/components/admin/AdminNav.tsx` — sidebar nav por rol
- `src/app/admin/unauthorized/page.tsx` — página de acceso denegado

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/app/(dashboard)/layout.tsx (ver el layout del dashboard existente de clientes)
- src/types/auth.ts (roles)
- src/components/ (glob para ver componentes existentes y el estilo visual)

TAREA: Crear layout del panel admin

ESTILO VISUAL: Usar la paleta de Agrobiciufa:
- Primario: rojo #c8102e (bg-red-600, hover:bg-red-700)
- Fondo: zinc-50, zinc-100
- Texto: zinc-900, zinc-600
- Bordes: zinc-200
- Sin Google Fonts — usar 'system-ui' o 'Arial'

--- src/app/admin/login/page.tsx ---
Página simple de login con Firebase Auth (email/password).
Después del login, redirigir a /admin/taller si rol=mecanico, /admin/repuestos si rol=repuestero, /admin si rol=admin.
Usar signInWithEmailAndPassword del SDK cliente de Firebase.
Guardar el idToken en localStorage como 'admin_token' para usarlo en headers de API calls.

--- src/components/admin/AdminNav.tsx ---
Sidebar de navegación 'use client'.
Props: { role: UserRole }
Links según rol:
- mecanico: [{ href: '/admin/taller', label: 'Taller', icon: wrench }]
- repuestero: [{ href: '/admin/repuestos', label: 'Repuestos', icon: package }]
- admin: todos los anteriores + [{ href: '/admin/clientes', label: 'Clientes' }, { href: '/admin/web', label: 'Gestión Web' }]
Mostrar el rol del usuario en la parte inferior del sidebar.
Botón de cerrar sesión (signOut Firebase).

--- src/app/admin/layout.tsx ---
Server component que verifica auth desde cookie/header.
Si no hay auth → redirect('/admin/login').
Render: <AdminNav role={role} /> + {children}.
Layout: flex, sidebar fijo 240px, contenido ocupa el resto.

--- src/app/admin/unauthorized/page.tsx ---
Página simple: "No tenés acceso a esta sección" con link para volver.

CRITERIO DE ÉXITO: El layout existe, compila, y AdminNav muestra los links correctos por rol.
```

---

## Agente 3B — Layout /portal para clientes
**Puede ejecutarse en paralelo con:** 3A
**Depende de:** Ola 2 completa

### Objetivo
Crear el layout del portal de clientes logueados con navegación bottom (mobile-first) y auth provider.

### Archivos a crear
- `src/app/portal/layout.tsx` — layout portal
- `src/app/portal/login/page.tsx` — login cliente
- `src/app/portal/registro/page.tsx` — registro cliente
- `src/components/portal/PortalNav.tsx` — navegación bottom mobile
- `src/components/portal/PortalAuthProvider.tsx` — context de auth cliente

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS, Firebase Auth)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/app/(dashboard)/layout.tsx (layout existente de clientes para copiar el estilo)
- src/components/ (glob — ver si hay PortalNav o similar ya)
- src/types/auth.ts

TAREA: Crear portal de clientes

ESTILO: Mismo que el dashboard existente — rojo #c8102e, zinc palette, mobile-first.

--- src/components/portal/PortalAuthProvider.tsx ---
'use client' — Context que expone { user: AuthUser | null, loading: boolean, signOut }
Usa onAuthStateChanged de Firebase SDK cliente.
Guarda el idToken en localStorage 'portal_token' para API calls.

--- src/components/portal/PortalNav.tsx ---
'use client' — Bottom nav para mobile. Links:
- Inicio (/portal)
- Mis Solicitudes (/portal/mis-solicitudes)
- Mis Equipos (/portal/mis-equipos)
- Mi Perfil (/portal/perfil)
Estilo: barra fija abajo, fondo blanco, borde top zinc-200, iconos + label.

--- src/app/portal/login/page.tsx ---
Formulario email + password. signInWithEmailAndPassword.
Link a /portal/registro para nuevos usuarios.
Después del login → redirect a /portal/mis-solicitudes.

--- src/app/portal/registro/page.tsx ---
Formulario: nombre, email, password, teléfono (opcional).
createUserWithEmailAndPassword + updateProfile(displayName).
Después: llamar POST /api/public/clientes (si existe) para crear el perfil.
Redirect a /portal/mis-solicitudes.

--- src/app/portal/layout.tsx ---
'use client' — Usa PortalAuthProvider.
Si no hay user y no está en /portal/login o /portal/registro → redirect a /portal/login.
Render: {children} + <PortalNav />.
Padding bottom 64px para que el contenido no quede detrás del bottom nav.

CRITERIO DE ÉXITO: El portal compila, el login funciona con Firebase Auth, el bottom nav se muestra.
```

---

## Ola 4 — Páginas admin: kanbans y clientes
> Ejecutar solo después de que OLA 3 esté completa
> Ejecutar 4A + 4B + 4C en PARALELO

---

## Agente 4A — /admin/taller — Kanban Servicios Técnicos
**Puede ejecutarse en paralelo con:** 4B, 4C
**Depende de:** Ola 3 completa

### Objetivo
Crear la página `/admin/taller` con un kanban de servicios técnicos funcional (DnD con @atlaskit), cargando datos reales de Firestore colección `solicitudes` tipo=servicio.

### Archivos a crear
- `src/app/admin/taller/page.tsx` — página kanban servicios técnicos

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer COMPLETAMENTE estos archivos (son el modelo a seguir):
- src/app/(dashboard)/solicitudes/page.tsx (si existe — ver cómo lista solicitudes)
- src/types/admin.ts (SolicitudAdmin, EstadoSolicitudServicio)

CONTEXTO DE DnD: El proyecto usa @atlaskit/pragmatic-drag-and-drop v1.7.7.
Importar: import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

TAREA: Crear src/app/admin/taller/page.tsx

Columnas del kanban (en orden):
1. Nueva → estado: 'nueva'
2. Diagnóstico → estado: 'diagnostico'
3. Presupuestada → estado: 'presupuestada'
4. Aprobada → estado: 'aprobada'
5. En trabajo → estado: 'en_trabajo'
6. Completada → estado: 'completada'

Cada tarjeta muestra:
- Nombre del cliente (cliente_nombre)
- Equipo: modelo + número de serie
- Descripción del problema (primeras 80 chars)
- Fecha de creación (relativa: "hace 2 días")
- Badge de estado con color
- Botón "Ver cliente" si tiene cliente_id

Funcionalidad DnD:
- Cada tarjeta es draggable (useRef + draggable())
- Cada columna es dropTarget (dropTargetForElements())
- Al soltar: optimistic update local + PATCH /api/admin/solicitudes/[id] con { estado: nuevoEstado }
- Header Authorization: Bearer ${localStorage.getItem('admin_token')}

Carga de datos:
- 'use client' — useEffect al montar, GET /api/admin/solicitudes?tipo=servicio
- Estado local: Record<EstadoSolicitudServicio, SolicitudAdmin[]>
- Loading skeleton mientras carga

Filtro rápido arriba del kanban: input de búsqueda por nombre cliente o número de serie.

ESTILO: Kanban horizontal con scroll, columnas de 280px min-width, cards con sombra suave.
Colores de columnas coherentes con el resto del proyecto (zinc palette + rojo CASE IH).

CRITERIO DE ÉXITO: La página compila, muestra el kanban con 6 columnas, el DnD funciona, llama a la API con auth.
```

---

## Agente 4B — /admin/repuestos — Kanban Repuestos
**Puede ejecutarse en paralelo con:** 4A, 4C
**Depende de:** Ola 3 completa

### Objetivo
Crear la página `/admin/repuestos` con kanban de repuestos funcional (DnD con @atlaskit), cargando datos de Firestore tipo=repuesto.

### Archivos a crear
- `src/app/admin/repuestos/page.tsx` — página kanban repuestos

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos\ISO -conjunto\Landing-Agrobiciufa

Primero leer:
- src/types/admin.ts (EstadoSolicitudRepuesto, SolicitudAdmin)

CONTEXTO DnD: @atlaskit/pragmatic-drag-and-drop v1.7.7
Import: import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

TAREA: Crear src/app/admin/repuestos/page.tsx

Columnas del kanban (en orden):
1. Nueva → estado: 'nueva'
2. Verificando stock → estado: 'verificando_stock'
3. Cotizada → estado: 'cotizada'
4. Aprobada → estado: 'aprobada'
5. En preparación → estado: 'en_preparacion'
6. Entregada → estado: 'entregada'

Cada tarjeta muestra:
- Nombre del cliente
- Equipo (modelo + serie)
- Repuesto solicitado / descripción (80 chars)
- Número de parte si está disponible (campo codigo_repuesto)
- Fecha relativa
- Botón "Ver cliente" si tiene cliente_id

DnD igual que agente 4A — optimistic update + PATCH /api/admin/solicitudes/[id].
Carga: GET /api/admin/solicitudes?tipo=repuesto con Authorization Bearer.

Filtro: búsqueda por nombre cliente, número de serie, o código de repuesto.

ESTILO: Mismo patrón visual que 4A. Usar color ámbar (#d97706) como acento para diferenciar de taller.

CRITERIO DE ÉXITO: La página compila, kanban 6 columnas, DnD funcional, llama a API con auth.
```

---

## Agente 4C — /admin/clientes — Lista y ficha de clientes
**Puede ejecutarse en paralelo con:** 4A, 4B
**Depende de:** Ola 3 completa

### Objetivo
Crear la página `/admin/clientes` con lista de clientes y vista de detalle (ficha) con sus solicitudes.

### Archivos a crear
- `src/app/admin/clientes/page.tsx` — lista de clientes
- `src/app/admin/clientes/[id]/page.tsx` — ficha individual del cliente

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/types/clientes.ts (Cliente, EquipoCliente)
- src/types/admin.ts (SolicitudAdmin)

TAREA: Crear dos páginas de clientes

--- src/app/admin/clientes/page.tsx ---
'use client' — Lista de clientes
- Carga GET /api/admin/clientes con Authorization Bearer
- Tabla o lista de cards con: nombre, email, teléfono, localidad, total_solicitudes, fecha de registro
- Buscador por nombre o email
- Click en un cliente → link a /admin/clientes/[id]
- Botón "Agregar cliente" (modal simple: nombre + email + teléfono)

--- src/app/admin/clientes/[id]/page.tsx ---
'use client' — Ficha del cliente
- Carga GET /api/admin/clientes/[id]
- Sección superior: datos del cliente (nombre, email, teléfono, localidad, CUIT si existe)
- Sección equipos registrados (lista de numero_serie + modelo)
- Sección historial solicitudes: tabla con fecha, tipo, estado, descripción
  - Click en solicitud → link al kanban correspondiente (/admin/taller o /admin/repuestos)
- Botón editar datos (inline edit o modal)

ESTILO: Limpio, tabla con hover states zinc, badges de estado con colores de EstadoSolicitudServicio.
Breadcrumb: Inicio > Clientes > [Nombre Cliente]

CRITERIO DE ÉXITO: Las dos páginas compilan, muestran datos de la API, navegación funciona.
```

---

## Ola 5 — Portal cliente (páginas)
> Ejecutar en paralelo con Ola 4 (son independientes — 4 toca /admin, 5 toca /portal)
> Ejecutar 5A + 5B en PARALELO

---

## Agente 5A — /portal/mis-solicitudes
**Puede ejecutarse en paralelo con:** 5B
**Depende de:** Ola 3 completa

### Objetivo
Crear la página del portal cliente donde ve el historial y estado de sus solicitudes.

### Archivos a crear
- `src/app/portal/mis-solicitudes/page.tsx`
- `src/app/api/portal/mis-solicitudes/route.ts` — GET solicitudes del cliente autenticado

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/types/admin.ts (SolicitudAdmin)
- src/components/portal/ (ver qué existe)

TAREA: Crear página y API de mis solicitudes

--- src/app/api/portal/mis-solicitudes/route.ts ---
GET: Requiere token Firebase válido con role='cliente'.
Obtener el uid del usuario del token.
Buscar en Firestore colección 'solicitudes' donde uid_cliente == uid O cliente_email == email del token.
Retornar lista ordenada por created_at desc.

--- src/app/portal/mis-solicitudes/page.tsx ---
'use client' — Lista de solicitudes del cliente logueado.
Carga GET /api/portal/mis-solicitudes con Authorization Bearer (token de localStorage 'portal_token').
Muestra cards de solicitudes con: tipo (chip), estado (badge con color), equipo, fecha, descripción.
Estado vacío: "Todavía no tenés solicitudes. ¿Necesitás repuestos o servicio técnico?"
Botón flotante: "Nueva solicitud" → /nueva-solicitud (formulario ya existente)
Filtro: tabs Todas / Servicios / Repuestos

ESTILO: Mobile-first, cards apiladas, badges de estado coloridos.
CRITERIO DE ÉXITO: La página compila, carga solicitudes del cliente autenticado.
```

---

## Agente 5B — /portal/mis-equipos
**Puede ejecutarse en paralelo con:** 5A
**Depende de:** Ola 3 completa

### Objetivo
Crear la página donde el cliente ve sus equipos registrados y puede agregar nuevos.

### Archivos a crear
- `src/app/portal/mis-equipos/page.tsx`
- `src/app/api/portal/mis-equipos/route.ts` — GET y POST equipos del cliente

### Prompt completo para el agente
```
Proyecto: Landing-Agrobiciufa (Next.js 14, TypeScript strict, React 18, Tailwind CSS)
Directorio raíz: c:/Users/Usuario/Documents/Proyectos/ISO -conjunto/Landing-Agrobiciufa

Primero leer:
- src/app/(dashboard)/productos/page.tsx (ver los cards de equipos existentes — EQUIPOS_DEMO)
- src/types/clientes.ts (EquipoCliente)

TAREA: Crear página de mis equipos del portal cliente

--- src/app/api/portal/mis-equipos/route.ts ---
GET: Token Firebase válido role='cliente' → retornar equipos de la colección 'equipos_cliente' donde cliente_id == clienteId del usuario.
POST: Agregar equipo nuevo { numero_serie, marca, modelo, anio?, tipo }.
  - Verificar que el numero_serie no esté ya registrado para este cliente.
  - Crear en 'equipos_cliente'.

--- src/app/portal/mis-equipos/page.tsx ---
'use client' — Lista de equipos del cliente.
Carga GET /api/portal/mis-equipos.
Muestra cards estilo EquipoCard del dashboard existente (ver productos/page.tsx como referencia):
  - Foto placeholder o imagen según tipo
  - Marca, modelo, número de serie
  - Botones: "Pedir repuesto" → /nueva-solicitud?tipo=repuesto&serie=X&modelo=Y
            "Servicio técnico" → /nueva-solicitud?tipo=servicio&serie=X&modelo=Y

Botón "Agregar equipo" → modal con campos: número de serie, marca (CASE IH por defecto), modelo, año, tipo.

Estado vacío: "Registrá tus equipos para hacer solicitudes más rápido."

CRITERIO DE ÉXITO: La página compila, lista equipos del cliente, botón agregar funciona.
```

---

## Verificación final

Después de completar todas las olas, verificar manualmente:

### Auth
- [ ] Login admin funciona con usuario real de Firebase (/admin/login)
- [ ] Login cliente funciona (/portal/login)
- [ ] Mecánico solo ve /admin/taller (no ve /admin/repuestos ni /admin/clientes)
- [ ] Repuestero solo ve /admin/repuestos
- [ ] Admin ve todo
- [ ] Sin auth → redirect al login correcto

### Kanban admin
- [ ] Taller carga solicitudes tipo=servicio de Firestore
- [ ] Repuestos carga solicitudes tipo=repuesto de Firestore
- [ ] Drag & drop mueve tarjetas entre columnas
- [ ] PATCH actualiza el estado en Firestore

### Clientes
- [ ] Nueva solicitud desde web sin login → no crea cliente (sin email)
- [ ] Nueva solicitud desde web con email → crea/actualiza cliente automáticamente
- [ ] Lista de clientes visible desde /admin/clientes
- [ ] Ficha del cliente muestra historial de solicitudes

### Portal cliente
- [ ] Cliente logueado ve solo sus propias solicitudes
- [ ] Puede agregar equipos por número de serie
- [ ] Desde equipo registrado puede crear solicitud pre-completada

### TypeScript
- [ ] `tsc --noEmit` sin errores en toda la Landing

---

## Dependencias externas a verificar antes de empezar

```bash
# En Landing-Agrobiciufa
npm ls firebase-admin    # debe estar instalado
npm ls @atlaskit/pragmatic-drag-and-drop  # debe estar instalado
npm ls firebase          # SDK cliente, debe estar instalado
```

Si alguno falta: `npm install firebase-admin firebase @atlaskit/pragmatic-drag-and-drop`
