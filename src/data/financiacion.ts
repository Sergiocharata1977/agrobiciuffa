export interface PlanFinanciacion {
    id: string;
    nombre: string;
    cuotas: number;
    tna: number;
    anticipo_pct: number;
    descripcion: string;
}

export const PLANES_FINANCIACION: PlanFinanciacion[] = [
    {
        id: 'clasico',
        nombre: 'CNH Capital Clásico',
        cuotas: 12,
        tna: 45,
        anticipo_pct: 30,
        descripcion: 'Ideal para equipos livianos y tractores compactos.',
    },
    {
        id: 'extendido',
        nombre: 'CNH Capital Extendido',
        cuotas: 24,
        tna: 52,
        anticipo_pct: 20,
        descripcion: 'El plan más elegido para tractores medianos y altos.',
    },
    {
        id: 'harvest',
        nombre: 'CNH Capital Harvest',
        cuotas: 36,
        tna: 58,
        anticipo_pct: 15,
        descripcion: 'Para cosechadoras y equipos de alta inversión.',
    },
    {
        id: 'leasing',
        nombre: 'Leasing Agrícola',
        cuotas: 48,
        tna: 60,
        anticipo_pct: 10,
        descripcion: 'Máximo plazo, cuota más baja. Para flotas grandes.',
    },
];

/**
 * Calcula cuota mensual estimada (simplificado para demo).
 * No usar en producción sin validar con CNH Capital.
 */
export function calcularCuotaEstimada(
    precio_usd: number,
    plan: PlanFinanciacion,
    tipo_cambio_ars: number = 1200
): { cuota_usd: number; cuota_ars: number; total_usd: number } {
    const capital = precio_usd * (1 - plan.anticipo_pct / 100);
    const total_usd = capital * (1 + (plan.tna / 100) * (plan.cuotas / 12));
    const cuota_usd = total_usd / plan.cuotas;
    const cuota_ars = cuota_usd * tipo_cambio_ars;
    return {
        cuota_usd: Math.round(cuota_usd * 100) / 100,
        cuota_ars: Math.round(cuota_ars * 100) / 100,
        total_usd: Math.round(total_usd * 100) / 100,
    };
}
