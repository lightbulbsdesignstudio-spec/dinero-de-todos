// Configuración de APIs de datos abiertos de México

export const API_CONFIG = {
  // API CKAN de datos.gob.mx
  DATOS_GOB_MX: {
    BASE_URL: 'https://datos.gob.mx/busca/api/3/action',
    ENDPOINTS: {
      PACKAGE_SEARCH: '/package_search',
      PACKAGE_SHOW: '/package_show',
      RESOURCE_SHOW: '/resource_show',
    },
  },

  // URLs directas de datasets conocidos
  DATASETS: {
    // Presupuesto de Egresos de la Federación (Paquete Económico 2025)
    PEF_2025: {
      ANALITICO_RAMOS: 'https://www.transparenciapresupuestaria.gob.mx/work/models/PTP/DatosAbiertos/Bases_de_datos_presupuesto/CSV/PEF_2025.csv',
      PROGRAMAS: 'https://www.transparenciapresupuestaria.gob.mx/work/models/PTP/DatosAbiertos/Bases_de_datos_presupuesto/CSV/PEF_2025.csv',
    },
    PEF_2024: {
      ANALITICO_RAMOS: 'https://www.transparenciapresupuestaria.gob.mx/work/models/PTP/DatosAbiertos/Bases_de_datos_presupuesto/CSV/PEF_2024.csv',
      PROGRAMAS: 'https://www.transparenciapresupuestaria.gob.mx/work/models/PTP/DatosAbiertos/Bases_de_datos_presupuesto/CSV/PEF_2024.csv',
    },
    // Cuenta Pública (gasto ejercido)
    CUENTA_PUBLICA: {
      TRIMESTRAL: 'https://www.transparenciapresupuestaria.gob.mx/work/models/PTP/DatosAbiertos/Presupuesto/avance_trimestral_2024.csv',
    },
    // Obras públicas
    OBRAS: {
      PROYECTOS_INVERSION: 'https://www.transparenciapresupuestaria.gob.mx/work/models/PTP/DatosAbiertos/Obra/proyectos_inversion.csv',
    },
  },

  // Configuración de cache
  CACHE: {
    TTL_MINUTES: 60, // Tiempo de vida del cache en minutos
    STALE_WHILE_REVALIDATE: true,
  },
};

// Mapeo de códigos de ramo a nombres legibles
export const RAMO_NAMES: Record<string, string> = {
  '01': 'Poder Legislativo',
  '02': 'Oficina de la Presidencia',
  '03': 'Poder Judicial',
  '04': 'Gobernación',
  '05': 'Relaciones Exteriores',
  '06': 'Hacienda y Crédito Público',
  '07': 'Defensa Nacional',
  '08': 'Agricultura y Desarrollo Rural',
  '09': 'Comunicaciones y Transportes',
  '10': 'Economía',
  '11': 'Educación Pública',
  '12': 'Salud',
  '13': 'Marina',
  '14': 'Trabajo y Previsión Social',
  '15': 'Desarrollo Agrario',
  '16': 'Medio Ambiente',
  '17': 'Procuraduría General',
  '18': 'Energía',
  '19': 'Aportaciones a Seguridad Social',
  '20': 'Bienestar',
  '21': 'Turismo',
  '22': 'INE',
  '23': 'Provisiones Salariales',
  '24': 'Deuda Pública',
  '25': 'Previsiones y Aportaciones',
  '26': 'Función Pública',
  '27': 'CONACYT',
  '28': 'Participaciones a Entidades',
  '33': 'Aportaciones Federales',
  '35': 'CJEF',
  '36': 'Seguridad y Protección Ciudadana',
  '38': 'CONEVAL',
  '40': 'INEGI',
  '41': 'COFECE',
  '42': 'IFT',
  '43': 'INAI',
  '44': 'INEE',
  '45': 'Cultura',
  '47': 'Entidades no Sectorizadas',
  '48': 'Cultura',
  '50': 'IMSS',
  '51': 'ISSSTE',
  '52': 'Pemex',
  '53': 'CFE',
};

// Colores para visualización por tipo de gasto
export const GASTO_COLORS: Record<string, string> = {
  corriente: '#3b82f6',
  inversion: '#10b981',
  deuda: '#ef4444',
  participaciones: '#8b5cf6',
  aportaciones: '#f59e0b',
};
