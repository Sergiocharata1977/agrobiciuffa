# Plan Demo Contenido Agrobiciufa — Ejecución multi-agente

**Fecha:** 2026-03-13
**Feature:** Datos de catálogo, repuestos, servicios y financiación hardcodeados para demo del día siguiente
**Proyecto afectado:** `Landing-Agrobiciufa`

---

## Contexto

El portal de clientes de Agro Biciufa (concesionaria CASE IH) necesita contenido de producto para la demo. Actualmente las páginas `/productos`, `/repuestos` y `/servicios` muestran solicitudes del cliente (demo simuladas) pero no tienen información del catálogo de la empresa.

**Estrategia:** todo hardcodeado en `src/data/`. Sin base de datos. Sin endpoints nuevos.

### Estado actual de las páginas
- `/productos/page.tsx` — muestra `EQUIPOS_DEMO` (equipos del cliente). Falta: sección "A la venta"
- `/repuestos/page.tsx` — muestra `REPUESTOS_DEMO` (solicitudes de repuesto). Falta: sección "Repuestos frecuentes"
- `/servicios/page.tsx` — muestra `SERVICIOS_DEMO` (solicitudes de servicio). Falta: sección "Nuestros servicios"
- `/api/asistente/route.ts` — `BASE_SYSTEM_PROMPT` no conoce precios, repuestos ni servicios de la empresa

---

## Resumen de olas

| Ola | Agentes | Paralelos entre sí | Dependen de |
|-----|---------|-------------------|-------------|
| 1 | 1A, 1B, 1C | Sí | Nada |
| 2 | 2A, 2B, 2C | Sí | Ola 1 completa |

---

## Ola 1 — Archivos de datos y system prompt
> Ejecutar 1A + 1B + 1C en PARALELO simultáneamente

---

## Agente 1A — Catálogo de equipos y financiación

**Puede ejecutarse en paralelo con:** 1B, 1C
**Depende de:** nada

### Objetivo
Crear `src/data/catalogo.ts` y `src/data/financiacion.ts` con datos CASE IH hardcodeados para demo.

### Archivos a crear
- `src/data/catalogo.ts` — array de equipos nuevos a la venta con tipos TypeScript
- `src/data/financiacion.ts` — array de planes CNH Capital con calculadora de cuota estimada

### Archivos a modificar
Ninguno.

### Prompt completo para el agente

Estás trabajando en el proyecto `Landing-Agrobiciufa` (Next.js 14 + TypeScript strict + Tailwind).
Es el portal de clientes de Agro Biciufa, concesionario oficial CASE IH en Argentina.

Crea exactamente estos dos archivos:

**1. `src/data/catalogo.ts`**

```typescript
export type EstadoStock = 'Disponible' | 'Consultar' | 'Bajo pedido';

export interface EquipoCatalogo {
    id: string;
    tipo: 'Tractor' | 'Cosechadora' | 'Pulverizadora' | 'Sembradora';
    marca: string;
    modelo: string;
    anio: number;
    precio_usd: number;
    estado_stock: EstadoStock;
    imagen: string;
    descripcion: string;
    potencia_hp?: number;
}

export const CATALOGO_EQUIPOS: EquipoCatalogo[] = [ ... ];
```

Incluye estos 7 equipos:
- Tractor CASE IH Farmall 75C, 2024, USD 68.000, Disponible, 75hp
  imagen: `https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/farmall-75c`
  descripcion: "Tractor compacto ideal para tareas diversas. Motor FPT 4 cilindros, transmisión PowerShuttle 12x12."
- Tractor CASE IH Maxxum 145, 2024, USD 142.000, Disponible, 145hp
  imagen: `https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/maxxum-145`
  descripcion: "Tractor mediano versátil. Motor FPT 4.5L, transmisión CVXDrive continua, cabina CommandARC."
- Tractor CASE IH Puma 185, 2024, USD 185.000, Disponible, 185hp
  imagen: `https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/def9156757604e15aaeb367a9b2da0bf?v=68d3d90f&t=size1200`
  descripcion: "Tractor de alta potencia para grandes superficies. Motor FPT 6.7L Tier 4, AFS Connect telemetría."
- Tractor CASE IH Puma 240, 2024, USD 220.000, Consultar, 240hp
  imagen: `https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/puma-240`
  descripcion: "El tractor más potente de la línea Puma. CVXDrive, suspensión delantera, GPS integrado."
- Cosechadora CASE IH Axial-Flow 7250, 2024, USD 390.000, Consultar
  imagen: `https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/axial-flow-7250`
  descripcion: "Cosechadora de alta eficiencia. Sistema Axial-Flow de rotor único, caudal de grano 45 t/h."
- Cosechadora CASE IH Axial-Flow 8250, 2024, USD 520.000, Consultar
  imagen: `https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/5ffa167ef892491cb6bfdfef66f259cd?v=98773893&t=size1900`
  descripcion: "La cosechadora más productiva de CASE IH. Rotor de 762mm, tanque 14.100L, AFS Connect."
- Pulverizadora CASE IH Patriot 250, 2024, USD 210.000, Disponible
  imagen: `https://cnhi-p-001-delivery.sitecorecontenthub.cloud/api/public/content/5a7bca29a5e7455d94157b309f959568?v=e5b97d4d&t=size1900`
  descripcion: "Pulverizadora autopropulsada. Barra Arag 36m, bomba centrífuga 757 L/min, AFS AccuGuide."

Para las URLs que tienen `cnhi-p-001-...` placeholder sin query params, usar la URL tal cual — el componente `onError` ya maneja imágenes rotas mostrando el ícono del tipo.

---

**2. `src/data/financiacion.ts`**

```typescript
export interface PlanFinanciacion {
    id: string;
    nombre: string;
    cuotas: number;
    tna: number;          // tasa nominal anual en porcentaje, ej: 45
    anticipo_pct: number; // porcentaje de anticipo mínimo, ej: 30
    descripcion: string;
}

export const PLANES_FINANCIACION: PlanFinanciacion[] = [ ... ];

/**
 * Calcula cuota mensual estimada (simplificado para demo).
 * No usar en producción sin validar con CNH Capital.
 */
export function calcularCuotaEstimada(
    precio_usd: number,
    plan: PlanFinanciacion,
    tipo_cambio_ars: number = 1200
): { cuota_usd: number; cuota_ars: number; total_usd: number } { ... }
```

Incluye 4 planes:
- CNH Capital Clásico: 12 cuotas, 45% TNA, 30% anticipo — "Ideal para equipos livianos y tractores compactos."
- CNH Capital Extendido: 24 cuotas, 52% TNA, 20% anticipo — "El plan más elegido para tractores medianos y altos."
- CNH Capital Harvest: 36 cuotas, 58% TNA, 15% anticipo — "Para cosechadoras y equipos de alta inversión."
- Leasing Agrícola: 48 cuotas, 60% TNA, 10% anticipo — "Máximo plazo, cuota más baja. Para flotas grandes."

La función `calcularCuotaEstimada`:
- `capital = precio_usd * (1 - anticipo_pct / 100)`
- `total_usd = capital * (1 + (tna / 100) * (cuotas / 12))`
- `cuota_usd = total_usd / cuotas`
- `cuota_ars = cuota_usd * tipo_cambio_ars`
- Retornar los tres valores redondeados a 2 decimales.

**Criterio de éxito:** `npx tsc --noEmit` sin errores. Los arrays exportados tienen los tipos correctos.

---

## Agente 1B — Repuestos frecuentes y datos de empresa

**Puede ejecutarse en paralelo con:** 1A, 1C
**Depende de:** nada

### Objetivo
Crear `src/data/repuestos-frecuentes.ts` y `src/data/empresa.ts` con datos hardcodeados para demo.

### Archivos a crear
- `src/data/repuestos-frecuentes.ts` — catálogo de repuestos CASE IH con part numbers reales
- `src/data/empresa.ts` — datos institucionales de Agro Biciufa + servicios técnicos disponibles

### Archivos a modificar
Ninguno.

### Prompt completo para el agente

Estás trabajando en el proyecto `Landing-Agrobiciufa` (Next.js 14 + TypeScript strict + Tailwind).
Es el portal de clientes de Agro Biciufa, concesionario oficial CASE IH en Argentina.

Crea exactamente estos dos archivos:

**1. `src/data/repuestos-frecuentes.ts`**

```typescript
export type CategoriaRepuesto = 'Filtros' | 'Correas y Transmisión' | 'Lubricantes' | 'Sensores' | 'Pulverización';

export interface RepuestoFrecuente {
    id: string;
    part_number: string;
    descripcion: string;
    categoria: CategoriaRepuesto;
    compatibilidad: string;   // texto libre, ej: "Puma 150-240, Maxxum 145"
    precio_usd_ref: number;   // precio orientativo, para demo
    unidad: string;           // "unidad", "pack x20", "bidón 20L", etc.
}

export const REPUESTOS_FRECUENTES: RepuestoFrecuente[] = [ ... ];
```

Incluye exactamente estos 10 repuestos (son datos reales de CNH):

| part_number | descripcion | categoria | compatibilidad | precio_usd_ref | unidad |
|---|---|---|---|---|---|
| 84229862 | Filtro de aceite motor | Filtros | Puma 150-240, Maxxum 145, Farmall 75-105 | 45 | unidad |
| 87802885 | Filtro hidráulico de transmisión | Filtros | Puma, Maxxum, Axial-Flow 8240/8250 | 38 | unidad |
| 84282743 | Filtro de combustible primario | Filtros | Farmall 75-105, Maxxum 115-145 | 22 | unidad |
| 84223866 | Filtro de aire exterior (primario) | Filtros | Puma 185-215, Axial-Flow 7250/8250 | 65 | unidad |
| 1995311C1 | Kit correas de variador completo | Correas y Transmisión | Axial-Flow 8240, Axial-Flow 8250 | 890 | kit |
| 47488212 | Sensor de temperatura de motor | Sensores | Puma 185, Puma 215, Axial-Flow 8250 | 120 | unidad |
| 84224053 | Aceite hidráulico Akcela Nexplore | Lubricantes | Todos los modelos CASE IH | 95 | bidón 20L |
| 87546841 | Aceite motor Akcela 15W-40 | Lubricantes | Todos los modelos CASE IH | 80 | bidón 20L |
| 382109A1 | Pastilla difusora TeeJet 11004 | Pulverización | Patriot 250, Patriot 290 | 180 | pack x20 |
| 87300998 | Correa alternador | Correas y Transmisión | Farmall 75C, Maxxum 115-145 | 55 | unidad |

Agregar también este helper exportado:

```typescript
export function getRepuestosPorCategoria(): Record<CategoriaRepuesto, RepuestoFrecuente[]> {
    // agrupar REPUESTOS_FRECUENTES por categoria
}
```

---

**2. `src/data/empresa.ts`**

```typescript
export interface DatosEmpresa {
    nombre: string;
    razon_social: string;
    concesionario_oficial: string;
    regiones: string[];
    telefono: string;
    whatsapp: string;
    email: string;
    horario: string;
    descripcion: string;
}

export interface ServicioTecnico {
    id: string;
    nombre: string;
    descripcion: string;
    tiempo_estimado: string;
    icono: string; // emoji
    incluye?: string[]; // lista de items incluidos
}

export const EMPRESA: DatosEmpresa = { ... };
export const SERVICIOS_TECNICOS: ServicioTecnico[] = [ ... ];
```

Datos de empresa:
```
nombre: "Agro Biciufa"
razon_social: "Agro Biciufa S.A."
concesionario_oficial: "CASE IH Argentina"
regiones: ["Buenos Aires", "Entre Ríos", "Santa Fe"]
telefono: "+54 11 4700-0000"   ← simulado para demo
whatsapp: "+54 9 11 7000-0000" ← simulado para demo
email: "info@agrobiciufa.com.ar"
horario: "Lunes a Viernes 8:00-18:00 / Sábados 8:00-13:00"
descripcion: "Concesionario oficial CASE IH con más de 20 años de trayectoria en el agro argentino. Venta, posventa, repuestos y financiación CNH Capital."
```

Servicios técnicos (6 items):

| id | nombre | descripcion | tiempo_estimado | icono | incluye |
|---|---|---|---|---|---|
| service-250 | Service 250hs | Mantenimiento preventivo de las primeras 250 horas de trabajo | 4-6 horas | 🔧 | ["Cambio de aceite motor", "Filtro aceite y combustible", "Revisión general", "Informe técnico"] |
| service-500 | Service 500hs | Service completo incluyendo transmisión e hidráulico | 1 día | 🔩 | ["Todo el Service 250hs", "Filtro hidráulico y de transmisión", "Revisión frenos", "Ajuste de válvulas"] |
| service-1000 | Service 1000hs | Service mayor con ajuste general y calibración de sistemas | 2-3 días | ⚙️ | ["Todo el Service 500hs", "Calibración AFS", "Revisión motor completa", "Informe de estado de flota"] |
| diagnostico | Diagnóstico electrónico AFS | Lectura de códigos de falla con equipo oficial CNH | 1-2 horas | 💻 | ["Escáner ECU", "Informe de códigos activos", "Recomendaciones técnicas"] |
| campana | Taller de campaña | Técnico especializado se desplaza al campo del cliente | Coordinar | 🚛 | ["Reparaciones de urgencia en el lote", "Diagnóstico in situ", "Disponible las 24hs en temporada"] |
| garantia | Gestión de garantías | Tramitación de reclamos bajo garantía CASE IH de fábrica | Coordinar | 📋 | ["Diagnóstico de falla garantizable", "Gestión ante CNH Argentina", "Sin costo para el cliente en garantía"] |

**Criterio de éxito:** `npx tsc --noEmit` sin errores. Los exports tienen los tipos correctos.

---

## Agente 1C — Enriquecer system prompt del asistente

**Puede ejecutarse en paralelo con:** 1A, 1B
**Depende de:** nada

### Objetivo
Actualizar `BASE_SYSTEM_PROMPT` en `/api/asistente/route.ts` para que Don Mario IA conozca el catálogo, repuestos, servicios y financiación de Agro Biciufa.

### Archivos a crear
Ninguno.

### Archivos a modificar
- `src/app/api/asistente/route.ts` — ampliar `BASE_SYSTEM_PROMPT` con info de catálogo y empresa

### Prompt completo para el agente

Estás trabajando en el proyecto `Landing-Agrobiciufa` (Next.js 14 + TypeScript strict).
Lee primero el archivo `src/app/api/asistente/route.ts` para ver la estructura actual.

El archivo tiene:
```
const BASE_SYSTEM_PROMPT = `Sos Don Mario IA...`
```

Hay una línea que dice:
```
- No des precios concretos ni disponibilidad de stock (derivá al equipo comercial)
```

Reemplazá esa restricción por:
```
- Los precios que conozcas son ORIENTATIVOS para demo — siempre aclarás que el precio final lo confirma el equipo comercial
- Podés mencionar precios aproximados cuando el cliente pregunta, aclarando que pueden variar
```

Luego, al final de `BASE_SYSTEM_PROMPT` (antes del backtick de cierre), agregá este bloque:

```

CATÁLOGO DE EQUIPOS DISPONIBLES (precios orientativos USD, pueden variar):
• Tractor CASE IH Farmall 75C 2024 — desde USD 68.000 (75hp, ideal para tareas diversas)
• Tractor CASE IH Maxxum 145 2024 — desde USD 142.000 (145hp, CVXDrive continua)
• Tractor CASE IH Puma 185 2024 — desde USD 185.000 (185hp, AFS Connect telemetría)
• Tractor CASE IH Puma 240 2024 — desde USD 220.000 (240hp, máxima potencia línea Puma)
• Cosechadora CASE IH Axial-Flow 7250 2024 — desde USD 390.000 (rotor único, 45t/h)
• Cosechadora CASE IH Axial-Flow 8250 2024 — desde USD 520.000 (la más productiva, tanque 14.100L)
• Pulverizadora CASE IH Patriot 250 2024 — desde USD 210.000 (barra 36m, AFS AccuGuide)

FINANCIACIÓN CNH CAPITAL (tasas vigentes aproximadas, consultar condiciones actualizadas):
• Plan Clásico: 12 cuotas, 45% TNA, anticipo mínimo 30%
• Plan Extendido: 24 cuotas, 52% TNA, anticipo mínimo 20% — el más elegido
• Plan Harvest: 36 cuotas, 58% TNA, anticipo mínimo 15% — para cosechadoras
• Leasing Agrícola: 48 cuotas, 60% TNA, anticipo mínimo 10% — mayor plazo

REPUESTOS FRECUENTES CASE IH (precios orientativos USD por unidad):
• Filtro aceite motor (p/n 84229862) — ~USD 45 — Puma, Maxxum, Farmall
• Filtro hidráulico (p/n 87802885) — ~USD 38 — Puma, Maxxum, Axial-Flow
• Kit correas variador Axial-Flow (p/n 1995311C1) — ~USD 890 — Axial-Flow 8240/8250
• Filtro combustible (p/n 84282743) — ~USD 22 — Farmall, Maxxum
• Pastilla difusora TeeJet 11004 (p/n 382109A1) — ~USD 180 pack x20 — Patriot 250
• Aceite hidráulico Akcela (p/n 84224053) — ~USD 95 bidón 20L — todos los modelos

SERVICIOS TÉCNICOS DISPONIBLES:
• Service 250hs — 4-6 horas — cambio aceite, filtros, revisión general
• Service 500hs — 1 día — incluye transmisión e hidráulico
• Service 1000hs — 2-3 días — service mayor con calibración AFS
• Diagnóstico electrónico AFS — 1-2 horas — lectura de códigos de falla
• Taller de campaña — técnico va al campo, disponible 24hs en temporada
• Gestión de garantías CASE IH — sin costo para el cliente dentro del período

DATOS DE CONTACTO AGRO BICIUFA:
• Teléfono: +54 11 4700-0000
• WhatsApp: +54 9 11 7000-0000
• Email: info@agrobiciufa.com.ar
• Horario: Lunes a Viernes 8:00-18:00 / Sábados 8:00-13:00
• Regiones: Buenos Aires, Entre Ríos, Santa Fe`;
```

**IMPORTANTE:** Solo modificá la constante `BASE_SYSTEM_PROMPT`. No toques `buildSystemPrompt`, `POST`, ni ninguna otra función.

**Criterio de éxito:** `npx tsc --noEmit` sin errores. El archivo sigue compilando correctamente.

---

## Ola 2 — Páginas del portal
> Ejecutar solo después de que OLA 1 esté completa
> Ejecutar 2A + 2B + 2C en PARALELO simultáneamente

---

## Agente 2A — Página Productos: sección catálogo a la venta

**Puede ejecutarse en paralelo con:** 2B, 2C
**Depende de:** 1A (necesita `src/data/catalogo.ts`)

### Objetivo
Agregar una sección "Equipos disponibles para la venta" en `/productos/page.tsx` usando `CATALOGO_EQUIPOS` y `PLANES_FINANCIACION`.

### Archivos a crear
Ninguno.

### Archivos a modificar
- `src/app/(dashboard)/productos/page.tsx` — agregar sección catálogo después de "Mis Equipos"

### Prompt completo para el agente

Estás trabajando en el proyecto `Landing-Agrobiciufa` (Next.js 14 + TypeScript strict + Tailwind).
Lee primero `src/app/(dashboard)/productos/page.tsx` para ver la estructura actual.
Lee también `src/data/catalogo.ts` para ver los tipos `EquipoCatalogo`, `CATALOGO_EQUIPOS`, y `PLANES_FINANCIACION`.

La página actual muestra "Mis Equipos" (equipos del cliente). Tenés que agregar una **segunda sección** debajo titulada "Equipos disponibles" con el catálogo de equipos nuevos a la venta.

**Qué agregar:**

1. Importar `CATALOGO_EQUIPOS` y `PLANES_FINANCIACION` desde `@/data/catalogo` y `@/data/financiacion`.

2. Crear el componente `CatalogoCard` (dentro del mismo archivo):
   - Tarjeta similar a `EquipoCard` pero para equipos del catálogo
   - Muestra: imagen del equipo, nombre (marca + modelo), año, potencia_hp si existe, precio_usd formateado como "desde USD 185.000", badge `estado_stock` (verde=Disponible, amarillo=Consultar, zinc=Bajo pedido)
   - Botón "Cotizar este equipo" → Link a `/nueva-solicitud?tipo=comercial&modelo=${equipo.modelo}`
   - El grid usa las mismas clases que el grid de `EquipoCard`

3. En el JSX del `return`, luego del bloque `{/* Content */}` existente (las tarjetas/lista de equipos del cliente), agregar:

```jsx
{/* Catálogo a la venta */}
<div className="pt-6 border-t border-zinc-200">
    <div className="flex items-center justify-between mb-4">
        <div>
            <h2 className="text-lg font-bold text-zinc-900">Equipos disponibles</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
                Catálogo CASE IH — precios orientativos, consultar condiciones actualizadas
            </p>
        </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATALOGO_EQUIPOS.map(equipo => (
            <CatalogoCard key={equipo.id} equipo={equipo} />
        ))}
    </div>
    {/* Financiación */}
    <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
        <h3 className="font-semibold text-zinc-900 mb-3">Planes de financiación CNH Capital</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLANES_FINANCIACION.map(plan => (
                <div key={plan.id} className="bg-white rounded-lg border border-zinc-200 p-3">
                    <p className="font-semibold text-zinc-900 text-sm">{plan.nombre}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{plan.cuotas} cuotas · {plan.tna}% TNA</p>
                    <p className="text-xs text-zinc-400">Anticipo {plan.anticipo_pct}%</p>
                </div>
            ))}
        </div>
        <p className="text-xs text-zinc-400 mt-3">Tasas orientativas para demo. Consultar condiciones vigentes con el equipo comercial.</p>
    </div>
</div>
```

**No modificar** la sección "Mis Equipos" ni los componentes `EquipoCard`/`EquipoRow` existentes.
**No agregar** estado ni lógica de filtrado — solo renderizado de arrays estáticos.

**Criterio de éxito:** `npx tsc --noEmit` sin errores. La página muestra ambas secciones sin romper la vista de tarjetas/lista del cliente.

---

## Agente 2B — Página Repuestos: sección repuestos frecuentes

**Puede ejecutarse en paralelo con:** 2A, 2C
**Depende de:** 1B (necesita `src/data/repuestos-frecuentes.ts`)

### Objetivo
Agregar una sección "Repuestos frecuentes" informativa en `/repuestos/page.tsx` usando `REPUESTOS_FRECUENTES`.

### Archivos a crear
Ninguno.

### Archivos a modificar
- `src/app/(dashboard)/repuestos/page.tsx` — agregar sección repuestos frecuentes al final

### Prompt completo para el agente

Estás trabajando en el proyecto `Landing-Agrobiciufa` (Next.js 14 + TypeScript strict + Tailwind).
Lee primero `src/app/(dashboard)/repuestos/page.tsx` para ver la estructura actual.
Lee también `src/data/repuestos-frecuentes.ts` para ver los tipos `RepuestoFrecuente`, `CategoriaRepuesto` y `REPUESTOS_FRECUENTES`.

La página actual muestra solicitudes de repuesto del cliente. Tenés que agregar una **sección informativa** al final titulada "Repuestos frecuentes CASE IH".

**Qué agregar:**

1. Importar `REPUESTOS_FRECUENTES` y `getRepuestosPorCategoria` desde `@/data/repuestos-frecuentes`.

2. Crear el componente `RepuestoRow` para el catálogo (diferente al `SolicitudRow` existente):
   - Fila de tabla o card compacta mostrando: part_number (monospace), descripcion, compatibilidad (truncada), precio_usd_ref ("~USD X"), unidad
   - Badge de categoría (colores: Filtros=blue, Correas=amber, Lubricantes=green, Sensores=purple, Pulverización=cyan)
   - Botón "Solicitar" → Link a `/nueva-solicitud?tipo=repuesto&repuesto=${item.part_number}&desc=${encodeURIComponent(item.descripcion)}`

3. Al final del JSX (después de todo el contenido existente), agregar:

```jsx
{/* Repuestos frecuentes */}
<div className="pt-6 border-t border-zinc-200">
    <div className="mb-4">
        <h2 className="text-lg font-bold text-zinc-900">Repuestos frecuentes CASE IH</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
            Referencia rápida de part numbers y precios orientativos
        </p>
    </div>
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {/* tabla o lista de repuestos */}
    </div>
    <p className="text-xs text-zinc-400 mt-2">
        Precios orientativos para demo. Disponibilidad y precio final sujetos a stock.
    </p>
</div>
```

Mostrá todos los repuestos en una tabla con columnas: **Part Number**, **Descripción**, **Compatibilidad**, **Precio ref.**, **Acción**.
En mobile, usar layout comprimido (2 líneas por item).

**No modificar** el código de solicitudes del cliente (SolicitudCard, SolicitudRow, NuevaSolicitudModal).

**Criterio de éxito:** `npx tsc --noEmit` sin errores. Se ven los 10 repuestos con sus part numbers.

---

## Agente 2C — Página Servicios: sección servicios disponibles

**Puede ejecutarse en paralelo con:** 2A, 2B
**Depende de:** 1B (necesita `src/data/empresa.ts`)

### Objetivo
Agregar una sección "Nuestros servicios" con los paquetes de mantenimiento disponibles en `/servicios/page.tsx`.

### Archivos a crear
Ninguno.

### Archivos a modificar
- `src/app/(dashboard)/servicios/page.tsx` — agregar sección servicios técnicos disponibles

### Prompt completo para el agente

Estás trabajando en el proyecto `Landing-Agrobiciufa` (Next.js 14 + TypeScript strict + Tailwind).
Lee primero `src/app/(dashboard)/servicios/page.tsx` para ver la estructura actual.
Lee también `src/data/empresa.ts` para ver el tipo `ServicioTecnico` y el array `SERVICIOS_TECNICOS`.

La página muestra solicitudes de servicio del cliente (SERVICIOS_DEMO). Tenés que agregar una **sección informativa** ANTES de las solicitudes del cliente, que muestre los servicios técnicos disponibles.

**Qué agregar:**

1. Importar `SERVICIOS_TECNICOS` desde `@/data/empresa`.

2. Crear el componente `ServicioCard`:
   - Card limpia con: ícono (emoji, en un circle bg-amber-50), nombre, descripcion, tiempo_estimado como badge zinc, lista `incluye` con checkmarks
   - Sin hover interactivo fuerte (es informativo, no accionable)
   - Botón "Solicitar este servicio" → usa `onClick={() => setShowModal(true)}`

3. Agregar la sección en el JSX, **entre el header y el banner isDemo**:

```jsx
{/* Servicios disponibles */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {SERVICIOS_TECNICOS.map(srv => (
        <ServicioCard key={srv.id} servicio={srv} onSolicitar={() => setShowModal(true)} />
    ))}
</div>

<div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
    <span className="h-px flex-1 bg-zinc-200" />
    <span>Tus solicitudes de servicio</span>
    <span className="h-px flex-1 bg-zinc-200" />
</div>
```

**No modificar** el código de solicitudes del cliente. `setShowModal` ya está definido en el componente padre.

**Criterio de éxito:** `npx tsc --noEmit` sin errores. Se ven las 6 cards de servicios encima de las solicitudes del cliente.

---

## Verificación final

- [ ] `npx tsc --noEmit` sin errores en Landing-Agrobiciufa
- [ ] `/productos` muestra "Mis Equipos" + "Equipos disponibles" + grid de financiación
- [ ] `/repuestos` muestra solicitudes del cliente + tabla de 10 repuestos con part numbers
- [ ] `/servicios` muestra 6 cards de servicios + solicitudes del cliente debajo
- [ ] `/asistente` — Don Mario IA responde preguntas sobre precios, repuestos y servicios
- [ ] Commit y push a main
