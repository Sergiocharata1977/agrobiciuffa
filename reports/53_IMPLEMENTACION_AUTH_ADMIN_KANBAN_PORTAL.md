# Implementación Auth + Admin Kanban + Portal Cliente

**Fecha:** 2026-03-14
**Proyecto:** Landing-Agrobiciufa
**Basado en:** Report 51 (Plan de olas)
**Estado:** ✅ Completo — TypeScript limpio

---

## Resumen

Se implementó el sistema standalone de Landing Agrobiciufa desconectado de 9001app-firebase:
- Firebase Auth propio con roles (mecanico / repuestero / admin / cliente)
- Panel `/admin` con kanban Taller + kanban Repuestos (DnD real)
- Portal `/portal` para clientes logueados
- API routes admin y portal propias en Firestore de Landing

---

## Archivos creados / modificados

### Ola 1 — Types + Auth + Firestore (✅ Agentes 1A, 1B, 1C)
| Archivo | Descripción |
|---------|-------------|
| `src/types/admin.ts` | EstadoSolicitudServicio, EstadoSolicitudRepuesto, SolicitudAdmin |
| `src/types/clientes.ts` | Cliente, EquipoCliente |
| `src/types/auth.ts` | UserRole, UserClaims, AuthUser *(modificado)* |
| `src/lib/auth/customClaims.ts` | setUserRole, getUserRole, verifyIdToken (Firebase Admin) |
| `src/lib/auth/serverAuth.ts` | getAuthenticatedUser, requireRole |
| `src/lib/clientes/clientesService.ts` | upsertCliente, getClienteByEmail, listClientes, incrementSolicitudes |

### Ola 2 — Middleware + API Routes (✅ Agentes 2A, 2B; ⚠️ 2C N/A)
| Archivo | Descripción |
|---------|-------------|
| `middleware.ts` | Guards: /admin/* → roles admin/mecanico/repuestero; /portal/* → cliente |
| `src/app/api/admin/solicitudes/route.ts` | **GET** lista solicitudes por tipo (nuevo — faltaba) |
| `src/app/api/admin/solicitudes/[id]/route.ts` | **PATCH** estado |
| `src/app/api/admin/clientes/route.ts` | **GET** lista clientes |
| `src/app/api/admin/clientes/[id]/route.ts` | **GET/PATCH** ficha cliente |
| `src/app/api/portal/mis-solicitudes/route.ts` | **GET** solicitudes del cliente autenticado |

> **⚠️ Agente 2C (vincular cliente_id en solicitudes públicas):** No aplica aún.
> Las solicitudes del portal cliente vienen de `9001app-firebase` vía `NEXT_PUBLIC_9001APP_URL`.
> El admin kanban de Landing usa su propia colección `solicitudes` en Firestore local.
> Cuando se migre la creación de solicitudes a Landing, este punto se retoma.

### Ola 3 — Layouts (✅ Agentes 3A, 3B)
| Archivo | Descripción |
|---------|-------------|
| `src/app/admin/layout.tsx` | Layout admin con sidebar |
| `src/app/admin/login/page.tsx` | Login admin (email+password Firebase) |
| `src/app/admin/unauthorized/page.tsx` | Página de acceso denegado |
| `src/components/admin/AdminNav.tsx` | Nav lateral por rol |
| `src/app/portal/layout.tsx` | Layout portal cliente (mobile-first) |
| `src/app/portal/login/page.tsx` | Login portal cliente |
| `src/app/portal/registro/page.tsx` | Registro nuevo cliente |
| `src/components/portal/PortalAuthProvider.tsx` | Context Firebase Auth cliente |
| `src/components/portal/PortalNav.tsx` | Bottom nav mobile |

### Ola 4 — Páginas Admin (✅ Agentes 4A, 4B completados; 4C por agente)
| Archivo | Descripción |
|---------|-------------|
| `src/app/admin/taller/page.tsx` | Kanban Servicios Técnicos — 6 columnas, DnD @atlaskit |
| `src/app/admin/repuestos/page.tsx` | Kanban Repuestos — 6 columnas, DnD @atlaskit *(completado manualmente — agente 4B no terminó)* |
| `src/app/admin/clientes/page.tsx` | Lista de clientes con búsqueda |
| `src/app/admin/clientes/[id]/page.tsx` | Ficha individual con historial |

### Ola 5 — Portal Cliente (✅ Agente 5A; 5B completado manualmente)
| Archivo | Descripción |
|---------|-------------|
| `src/app/portal/mis-solicitudes/page.tsx` | Lista solicitudes del cliente |
| `src/app/portal/mis-equipos/page.tsx` | Equipos registrados + botones solicitar *(completado manualmente — agente 5B no terminó)* |
| `src/app/api/portal/mis-equipos/route.ts` | GET/POST equipos del cliente *(ídem)* |

---

## Agentes que no completaron (completados manualmente)

| Agente | Problema | Resolución |
|--------|----------|------------|
| **4B** | No creó `/admin/repuestos/page.tsx` | Creado manualmente — copia del taller con estados de repuesto y acento ámbar |
| **5B** | No creó `/portal/mis-equipos/` | Creado manualmente — página + API route con DnD del formulario al formulario |
| **GET admin/solicitudes** | La route GET `[id]` solo tenía PATCH, faltaba el GET de lista | Creado `src/app/api/admin/solicitudes/route.ts` (faltaba, kanban taller lo requería) |

---

## Colecciones Firestore de Landing (propias)

| Colección | Descripción |
|-----------|-------------|
| `solicitudes` | Solicitudes del admin kanban (taller + repuestos). **Distinta** de las de 9001app. |
| `clientes` | Clientes propios de Landing. Identificador: email. |
| `equipos_cliente` | Equipos registrados por los clientes del portal. |

---

## Roles Firebase Auth

| Role (custom claim) | Acceso |
|---------------------|--------|
| `cliente` | `/portal/*` |
| `mecanico` | `/admin/taller` |
| `repuestero` | `/admin/repuestos` |
| `admin` | Todo: `/admin/*` + `/portal/*` |

---

## Pendiente siguiente fase

- Conectar formulario `nueva-solicitud` del portal para crear solicitudes en Firestore local (hoy van a 9001app)
- Asignar roles desde panel super-admin
- Notificaciones por email cuando cambia estado en kanban
- Ver report 52 para web institucional + Don Mario IA integrado en portal
