# Cierre Plan 52 — Web Institucional Agrobiciufa + Chat Don Mario IA

**Fecha:** 2026-03-14
**Estado:** ✅ COMPLETADO, BUILD LOCAL OK, PUSHEADO
**Commits:**
- `2901ed7` — feat principal: web institucional + Don Mario IA
- `fc36256` — fix: conflicto de ruta /repuestos (dashboard vs público)
- `bf6684b` — fix: errores de prerenderizado estático en Vercel
**Plan de referencia:** `reports/52_PLAN_WEB_INSTITUCIONAL_CHAT_DON_MARIO.md`
**Build local:** ✅ `npm run build` OK
**TypeScript:** ✅ `tsc --noEmit` sin errores

---

## Resumen ejecutivo

Se convirtió la landing one-page de Agro Biciuffa en una **web institucional oficial** alineada al estándar de concesionario CASE IH, con múltiples páginas, componentes corporativos reutilizables y el asistente **Chat Don Mario IA** integrado tanto en la landing pública (modo anónimo) como en el portal cliente (modo contextual).

**Alcance del commit:** 33 archivos, +4.936 líneas, −747 líneas.

---

## Qué se entregó

### Web pública institucional

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio mejorado: hero, accesos rápidos, 6 categorías CASE IH, fortalezas, resumen institucional, CTA |
| `/nosotros` | Historia, misión, valores, cobertura regional |
| `/productos` | Catálogo por las 6 categorías CASE IH |
| `/productos/[slug]` | Ficha por categoría (tractores, cosechadoras, pulverizadores, sembradoras, heno-forraje, tecnología-precisión) |
| `/repuestos` | Presentación del área + formulario específico (modelo, serie, código de repuesto) |
| `/servicio-tecnico` | Descripción del taller + formulario técnico (urgencia, tipo de atención) |
| `/financiacion` | Presentación con disclaimers legales + formulario de consulta financiera |
| `/novedades` | Lista desde Firestore, estado vacío elegante |
| `/contacto` | Formulario multi-área + mapa + datos de contacto completos |

### APIs públicas nuevas

| Endpoint | Método | Destino Firestore |
|----------|--------|-------------------|
| `/api/public/contacto` | POST | Colección `contactos` |
| `/api/public/financiacion` | POST | Colección `consultas_financieras` |
| `/api/public/novedades` | GET | Colección `novedades` (publicada=true) |

### Chat Don Mario IA

| Archivo | Rol |
|---------|-----|
| `src/lib/donmario/donMarioService.ts` | Servicio LLM (Claude Haiku) — mode anónimo + contextual, detección de acciones |
| `src/app/api/chat/don-mario/route.ts` | Endpoint unificado con Zod, manejo de token |
| `src/components/donmario/DonMarioChat.tsx` | Chat embebido para portal, envía Bearer token |
| `src/components/donmario/DonMarioAcciones.tsx` | Botones pill sugeridos por el asistente |
| `src/components/ChatWindow.tsx` | Actualizado para usar `/api/chat/don-mario` |

### Componentes institucionales

| Componente | Rol |
|-----------|-----|
| `NavbarInstitucional` | Navbar sticky, dropdown productos, mobile hamburger |
| `FooterInstitucional` | 4 columnas corporativas, fondo zinc-900 |
| `PublicSiteShell` | Wrapper condicional: chrome institucional solo en rutas públicas |
| `HeroSection` | Hero con imagen de fondo, tag, título, CTAs |
| `CategoriaCard` | Card de categoría de producto con hover |
| `FortalezaCard` | Card de atributo institucional con ícono |
| `CTASection` | Sección de llamada a la acción (variantes rojo/oscuro/claro) |
| `FormInstitucional` | Formulario wrapper con estados idle/loading/success/error |
| `PageHeader` | Header de páginas internas con breadcrumb e imagen |
| `FormRepuestoSection` | Formulario específico de repuestos (client component) |

### Portal cliente mejorado

| Ruta | Mejoras |
|------|---------|
| `/dashboard` | Saludo, accesos rápidos, solicitudes recientes, card Don Mario prominente |
| `/asistente` | Página dedicada Don Mario con contexto del cliente autenticado |
| `/mis-equipos` | Gestión de equipos por número de serie |

---

## Arquitectura de layout

```
RootLayout
└── PublicSiteShell ('use client')
    ├── [rutas públicas /] → NavbarInstitucional + contenido + FooterInstitucional
    ├── [/(public)/*]     → NavbarInstitucional + contenido + FooterInstitucional
    ├── [/(auth)/*]       → solo contenido (sin chrome institucional)
    ├── [/(dashboard)/*]  → solo contenido (tiene su propio layout)
    ├── [/admin/*]        → solo contenido (tiene su propio layout)
    └── [/portal/*]       → solo contenido (tiene su propio layout)
```

**PublicSiteShell** verifica pathname y oculta navbar/footer en rutas privadas. Solución limpia sin duplicar layouts.

---

## Identidad visual aplicada

- **Rojo CASE IH:** `#c8102e` → `bg-red-600`, `hover:bg-red-700`
- **Paleta base:** `zinc-50/100/200/600/900`
- **Tipografía:** `Arial, 'Helvetica Neue', sans-serif` (sin Google Fonts)
- **Estilo:** corporativo-agro, sobrio, no e-commerce

---

## Metadata SEO

```ts
title: 'Agro Biciuffa SRL — Concesionario Oficial CASE IH'
description: 'Concesionario oficial CASE IH en Argentina. Venta de maquinaria agrícola, repuestos originales y servicio técnico especializado.'
keywords: ['CASE IH', 'maquinaria agrícola', 'tractores', 'cosechadoras', ...]
openGraph: { locale: 'es_AR', siteName: 'Agro Biciuffa SRL' }
```

---

## Fixes post-deploy (commits fc36256 y bf6684b)

### Fix 1 — Conflicto de ruta `/repuestos`
Next.js no permite que dos route groups resuelvan al mismo path URL.
`(dashboard)/repuestos` y `(public)/repuestos` ambos → `/repuestos`.

| Acción | Detalle |
|--------|---------|
| Renombrar | `(dashboard)/repuestos` → `(dashboard)/mis-repuestos` |
| Nav dashboard | `href: '/repuestos'` → `href: '/mis-repuestos'` |
| PublicSiteShell | Agregar `/mis-repuestos` a PRIVATE_EXACT_PATHS |

### Fix 2 — Errores de prerenderizado estático (Vercel)

| Archivo | Error | Fix |
|---------|-------|-----|
| `/contacto/page.tsx` | `useSearchParams()` sin Suspense → bailout de static gen | Envuelto en `<Suspense>` |
| `/novedades/page.tsx` | Firebase Admin en build time → falla en prerenderizado | `export const dynamic = 'force-dynamic'` |
| `/api/public/novedades/route.ts` | Firebase Admin en edge + `request.url` en build | `dynamic = 'force-dynamic'` + `request.nextUrl.searchParams` |

---

## Deuda pendiente (fuera de scope del Plan 52)

| Item | Prioridad | Notas |
|------|-----------|-------|
| Datos reales de contacto (dirección, teléfono, WhatsApp) | Alta | Completar en `.env` o `_data.ts` |
| Fotos reales de instalaciones/taller | Alta | Reemplazar Unsplash por fotos propias |
| Activar novedades: crear primeros artículos en Firestore | Media | Colección `novedades`, campo `publicada: true` |
| Panel `/admin/web` para gestionar novedades y productos | Media | Fase futura: CMS básico |
| Página `/usados` con inventario | Baja | Cuando haya stock disponible |
| Don Mario: historial persistente en Firestore | Media | Hoy es stateless por sesión |
| Integración CRM externo (webhook) | Alta | Pendiente definición de API del CRM |
| Subpáginas de novedades `/novedades/[slug]` | Baja | Cuando haya contenido real |
| Schema LocalBusiness para SEO local | Baja | Post-lanzamiento |
| ANTHROPIC_API_KEY en Vercel/producción | Alta | Verificar antes del deploy |

---

## Verificación de push

```
Remote: github.com/Sergiocharata1977/agrobiciuffa
Branch: main
Commits: a659752 → 2901ed7
Archivos: 33 modificados/creados
```

---

## Prerrequisito para producción

Antes de hacer el deploy final, verificar estas variables en el entorno de producción (Vercel/similar):

```bash
ANTHROPIC_API_KEY=sk-ant-...          # Requerido para Don Mario IA
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...
```
