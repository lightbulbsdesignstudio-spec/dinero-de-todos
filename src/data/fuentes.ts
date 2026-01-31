// Registro centralizado de fuentes de datos
// Cada dato en el portal debe tener trazabilidad a su origen

import { FuenteDatos } from '@/components/ui/SourceLink';

export const FUENTES: Record<string, FuenteDatos[]> = {
  // === PRESUPUESTO FEDERAL ===
  presupuesto_federal: [
    {
      id: 'pef-2024',
      nombre: 'Presupuesto de Egresos de la Federación 2024',
      descripcion: 'Documento oficial aprobado por la Cámara de Diputados con el gasto autorizado por ramo y programa',
      url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/PEF_2024.pdf',
      tipo: 'oficial',
      formato: 'pdf',
      fechaPublicacion: '15 noviembre 2023',
      fechaConsulta: 'enero 2024',
      notas: 'Este es el presupuesto aprobado. El gasto real puede variar durante el año.'
    },
    {
      id: 'tp-analiticos',
      nombre: 'Transparencia Presupuestaria - Analíticos',
      descripcion: 'Datos abiertos del presupuesto en formato procesable',
      url: 'https://www.transparenciapresupuestaria.gob.mx/es/PTP/Datos_Abiertos',
      tipo: 'oficial',
      formato: 'csv',
      fechaConsulta: 'enero 2024',
      metodologia: 'Descarga directa de archivos CSV del portal oficial'
    }
  ],

  // === DISTRIBUCIÓN A ESTADOS ===
  participaciones_estados: [
    {
      id: 'lcf',
      nombre: 'Ley de Coordinación Fiscal',
      descripcion: 'Define las fórmulas de distribución de participaciones (Ramo 28) y aportaciones (Ramo 33)',
      url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/31_300118.pdf',
      tipo: 'oficial',
      formato: 'pdf',
      fechaConsulta: 'enero 2024'
    },
    {
      id: 'shcp-participaciones',
      nombre: 'SHCP - Participaciones Pagadas',
      descripcion: 'Montos efectivamente transferidos a cada estado',
      url: 'https://www.finanzaspublicas.hacienda.gob.mx/es/Finanzas_Publicas/Participaciones',
      tipo: 'oficial',
      formato: 'xlsx',
      fechaConsulta: 'enero 2024',
      metodologia: 'Los montos per cápita se calcularon dividiendo entre población de cada estado (INEGI 2020)'
    }
  ],

  // === POBREZA POR ESTADO ===
  pobreza_estados: [
    {
      id: 'coneval-2022',
      nombre: 'CONEVAL - Medición de Pobreza 2022',
      descripcion: 'Porcentaje de población en situación de pobreza por entidad federativa',
      url: 'https://www.coneval.org.mx/Medicion/MP/Paginas/Pobreza_2022.aspx',
      tipo: 'oficial',
      formato: 'xlsx',
      fechaPublicacion: 'agosto 2023',
      fechaConsulta: 'enero 2024'
    }
  ],

  // === FLUJO DE INGRESOS ===
  ingresos_federacion: [
    {
      id: 'lif-2024',
      nombre: 'Ley de Ingresos de la Federación 2024',
      descripcion: 'Estimación de ingresos por fuente (ISR, IVA, petróleo, etc.)',
      url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LIF_2024.pdf',
      tipo: 'oficial',
      formato: 'pdf',
      fechaPublicacion: '13 noviembre 2023',
      fechaConsulta: 'enero 2024'
    },
    {
      id: 'shcp-estadisticas',
      nombre: 'SHCP - Estadísticas Oportunas de Finanzas Públicas',
      descripcion: 'Datos mensuales de recaudación efectiva',
      url: 'https://www.finanzaspublicas.hacienda.gob.mx/es/Finanzas_Publicas/Estadisticas_Oportunas_de_Finanzas_Publicas',
      tipo: 'oficial',
      formato: 'xlsx',
      fechaConsulta: 'enero 2024'
    }
  ],

  // === OBRAS PÚBLICAS ===
  obras_publicas: [
    {
      id: 'compranet',
      nombre: 'CompraNet - Contratos de Obra Pública',
      descripcion: 'Sistema de contrataciones gubernamentales',
      url: 'https://compranet.hacienda.gob.mx/web/login.html',
      tipo: 'oficial',
      formato: 'api',
      fechaConsulta: 'enero 2024',
      notas: 'Requiere filtrar por tipo de contrato y dependencia'
    },
    {
      id: 'pnt-obras',
      nombre: 'Plataforma Nacional de Transparencia',
      descripcion: 'Obligaciones de transparencia sobre obra pública',
      url: 'https://www.plataformadetransparencia.org.mx/',
      tipo: 'oficial',
      formato: 'html',
      fechaConsulta: 'enero 2024'
    }
  ],

  // === POBLACIÓN ===
  poblacion: [
    {
      id: 'inegi-censo-2020',
      nombre: 'INEGI - Censo de Población y Vivienda 2020',
      descripcion: 'Población total por entidad federativa',
      url: 'https://www.inegi.org.mx/programas/ccpv/2020/',
      tipo: 'oficial',
      formato: 'xlsx',
      fechaPublicacion: '2021',
      fechaConsulta: 'enero 2024'
    }
  ],

  // === CALCULADORA ISR ===
  isr_tablas: [
    {
      id: 'sat-tarifas-2024',
      nombre: 'SAT - Tarifas ISR 2024',
      descripcion: 'Tablas oficiales para cálculo del Impuesto Sobre la Renta',
      url: 'https://www.sat.gob.mx/consulta/61196/conoce-las-tablas-de-isr',
      tipo: 'oficial',
      formato: 'pdf',
      fechaPublicacion: 'enero 2024',
      fechaConsulta: 'enero 2024',
      notas: 'El cálculo de IVA es una estimación basada en patrones de consumo promedio'
    }
  ],

  // === DATOS DEMO ===
  datos_demo: [
    {
      id: 'master-data-2026',
      nombre: 'Master Data File PEF 2026',
      descripcion: 'Fuente única de verdad para el portal, consolidando datos auditados de la SHCP y proyecciones de inversión estratégica.',
      url: '/data/pef_2026_master.json',
      tipo: 'procesado',
      formato: 'api',
      fechaConsulta: 'enero 2026',
      metodologia: 'Consolidación de Presupuesto de Egresos de la Federación (PEF) 2026 y Ley de Coordinación Fiscal.',
      notas: 'Este archivo es la fuente central de datos para todos los cálculos y visualizaciones del portal.'
    }
  ]
};

// Función helper para obtener fuentes por sección
export function getFuentes(seccion: keyof typeof FUENTES): FuenteDatos[] {
  return FUENTES[seccion] || FUENTES.datos_demo;
}

// Fuentes combinadas para páginas que usan múltiples datasets
export const FUENTES_POR_PAGINA = {
  '/': ['presupuesto_federal', 'datos_demo'],
  '/presupuesto': ['presupuesto_federal', 'datos_demo'],
  '/flujo-recursos': ['ingresos_federacion', 'presupuesto_federal', 'datos_demo'],
  '/explorador': ['presupuesto_federal', 'datos_demo'],
  '/tu-estado': ['participaciones_estados', 'pobreza_estados', 'poblacion', 'datos_demo'],
  '/calculadora': ['isr_tablas'],
  '/mapa-obras': ['obras_publicas', 'datos_demo']
};
