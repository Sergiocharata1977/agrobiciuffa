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
  icono: string;
  incluye?: string[];
}

export const EMPRESA: DatosEmpresa = {
  nombre: 'Agro Biciufa',
  razon_social: 'Agro Biciufa S.A.',
  concesionario_oficial: 'CASE IH Argentina',
  regiones: ['Buenos Aires', 'Entre R\u00edos', 'Santa Fe'],
  telefono: '+54 11 4700-0000',
  whatsapp: '+54 9 11 7000-0000',
  email: 'info@agrobiciufa.com.ar',
  horario: 'Lunes a Viernes 8:00-18:00 / S\u00e1bados 8:00-13:00',
  descripcion:
    'Concesionario oficial CASE IH con m\u00e1s de 20 a\u00f1os de trayectoria en el agro argentino. Venta, posventa, repuestos y financiaci\u00f3n CNH Capital.',
};

export const SERVICIOS_TECNICOS: ServicioTecnico[] = [
  {
    id: 'service-250',
    nombre: 'Service 250hs',
    descripcion: 'Mantenimiento preventivo de las primeras 250 horas de trabajo',
    tiempo_estimado: '4-6 horas',
    icono: '\u{1F527}',
    incluye: [
      'Cambio de aceite motor',
      'Filtro aceite y combustible',
      'Revisi\u00f3n general',
      'Informe t\u00e9cnico',
    ],
  },
  {
    id: 'service-500',
    nombre: 'Service 500hs',
    descripcion: 'Service completo incluyendo transmisi\u00f3n e hidr\u00e1ulico',
    tiempo_estimado: '1 d\u00eda',
    icono: '\u{1F529}',
    incluye: [
      'Todo el Service 250hs',
      'Filtro hidr\u00e1ulico y de transmisi\u00f3n',
      'Revisi\u00f3n frenos',
      'Ajuste de v\u00e1lvulas',
    ],
  },
  {
    id: 'service-1000',
    nombre: 'Service 1000hs',
    descripcion: 'Service mayor con ajuste general y calibraci\u00f3n de sistemas',
    tiempo_estimado: '2-3 d\u00edas',
    icono: '\u2699\uFE0F',
    incluye: [
      'Todo el Service 500hs',
      'Calibraci\u00f3n AFS',
      'Revisi\u00f3n motor completa',
      'Informe de estado de flota',
    ],
  },
  {
    id: 'diagnostico',
    nombre: 'Diagn\u00f3stico electr\u00f3nico AFS',
    descripcion: 'Lectura de c\u00f3digos de falla con equipo oficial CNH',
    tiempo_estimado: '1-2 horas',
    icono: '\u{1F4BB}',
    incluye: ['Esc\u00e1ner ECU', 'Informe de c\u00f3digos activos', 'Recomendaciones t\u00e9cnicas'],
  },
  {
    id: 'campana',
    nombre: 'Taller de campa\u00f1a',
    descripcion: 'T\u00e9cnico especializado se desplaza al campo del cliente',
    tiempo_estimado: 'Coordinar',
    icono: '\u{1F69B}',
    incluye: [
      'Reparaciones de urgencia en el lote',
      'Diagn\u00f3stico in situ',
      'Disponible las 24hs en temporada',
    ],
  },
  {
    id: 'garantia',
    nombre: 'Gesti\u00f3n de garant\u00edas',
    descripcion: 'Tramitaci\u00f3n de reclamos bajo garant\u00eda CASE IH de f\u00e1brica',
    tiempo_estimado: 'Coordinar',
    icono: '\u{1F4CB}',
    incluye: [
      'Diagn\u00f3stico de falla garantizable',
      'Gesti\u00f3n ante CNH Argentina',
      'Sin costo para el cliente en garant\u00eda',
    ],
  },
];
