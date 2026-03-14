export type CategoriaRepuesto =
  | 'Filtros'
  | 'Correas y Transmisi\u00f3n'
  | 'Lubricantes'
  | 'Sensores'
  | 'Pulverizaci\u00f3n';

export interface RepuestoFrecuente {
  id: string;
  part_number: string;
  descripcion: string;
  categoria: CategoriaRepuesto;
  compatibilidad: string;
  precio_usd_ref: number;
  unidad: string;
}

export const REPUESTOS_FRECUENTES: RepuestoFrecuente[] = [
  {
    id: 'repuesto-84229862',
    part_number: '84229862',
    descripcion: 'Filtro de aceite motor',
    categoria: 'Filtros',
    compatibilidad: 'Puma 150-240, Maxxum 145, Farmall 75-105',
    precio_usd_ref: 45,
    unidad: 'unidad',
  },
  {
    id: 'repuesto-87802885',
    part_number: '87802885',
    descripcion: 'Filtro hidr\u00e1ulico de transmisi\u00f3n',
    categoria: 'Filtros',
    compatibilidad: 'Puma, Maxxum, Axial-Flow 8240/8250',
    precio_usd_ref: 38,
    unidad: 'unidad',
  },
  {
    id: 'repuesto-84282743',
    part_number: '84282743',
    descripcion: 'Filtro de combustible primario',
    categoria: 'Filtros',
    compatibilidad: 'Farmall 75-105, Maxxum 115-145',
    precio_usd_ref: 22,
    unidad: 'unidad',
  },
  {
    id: 'repuesto-84223866',
    part_number: '84223866',
    descripcion: 'Filtro de aire exterior (primario)',
    categoria: 'Filtros',
    compatibilidad: 'Puma 185-215, Axial-Flow 7250/8250',
    precio_usd_ref: 65,
    unidad: 'unidad',
  },
  {
    id: 'repuesto-1995311C1',
    part_number: '1995311C1',
    descripcion: 'Kit correas de variador completo',
    categoria: 'Correas y Transmisi\u00f3n',
    compatibilidad: 'Axial-Flow 8240, Axial-Flow 8250',
    precio_usd_ref: 890,
    unidad: 'kit',
  },
  {
    id: 'repuesto-47488212',
    part_number: '47488212',
    descripcion: 'Sensor de temperatura de motor',
    categoria: 'Sensores',
    compatibilidad: 'Puma 185, Puma 215, Axial-Flow 8250',
    precio_usd_ref: 120,
    unidad: 'unidad',
  },
  {
    id: 'repuesto-84224053',
    part_number: '84224053',
    descripcion: 'Aceite hidr\u00e1ulico Akcela Nexplore',
    categoria: 'Lubricantes',
    compatibilidad: 'Todos los modelos CASE IH',
    precio_usd_ref: 95,
    unidad: 'bid\u00f3n 20L',
  },
  {
    id: 'repuesto-87546841',
    part_number: '87546841',
    descripcion: 'Aceite motor Akcela 15W-40',
    categoria: 'Lubricantes',
    compatibilidad: 'Todos los modelos CASE IH',
    precio_usd_ref: 80,
    unidad: 'bid\u00f3n 20L',
  },
  {
    id: 'repuesto-382109A1',
    part_number: '382109A1',
    descripcion: 'Pastilla difusora TeeJet 11004',
    categoria: 'Pulverizaci\u00f3n',
    compatibilidad: 'Patriot 250, Patriot 290',
    precio_usd_ref: 180,
    unidad: 'pack x20',
  },
  {
    id: 'repuesto-87300998',
    part_number: '87300998',
    descripcion: 'Correa alternador',
    categoria: 'Correas y Transmisi\u00f3n',
    compatibilidad: 'Farmall 75C, Maxxum 115-145',
    precio_usd_ref: 55,
    unidad: 'unidad',
  },
];

export function getRepuestosPorCategoria(): Record<CategoriaRepuesto, RepuestoFrecuente[]> {
  return REPUESTOS_FRECUENTES.reduce<Record<CategoriaRepuesto, RepuestoFrecuente[]>>(
    (acumulado, repuesto) => {
      acumulado[repuesto.categoria].push(repuesto);
      return acumulado;
    },
    {
      Filtros: [],
      'Correas y Transmisi\u00f3n': [],
      Lubricantes: [],
      Sensores: [],
      'Pulverizaci\u00f3n': [],
    }
  );
}
