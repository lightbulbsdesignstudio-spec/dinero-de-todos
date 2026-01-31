// Humanización de números grandes
// Principio: "Un billón de pesos no significa nada para nadie"
// Nuevo enfoque: Dar PERSPECTIVA real, no alternativas matemáticas vacías

// Constantes de referencia (2024-2025)
const POBLACION_MEXICO = 130_000_000;
const SALARIO_MINIMO_MENSUAL = 7_468;
const SALARIO_MINIMO_ANUAL = SALARIO_MINIMO_MENSUAL * 12;

export interface NumeroHumanizado {
  valor: number;
  texto: string;
  textoCorto: string;
  perCapita: string;
  comparacion: string;
  comparacionIcono: string;
  contexto: string;
}

/**
 * Formatea un número en formato corto legible
 */
export function formatoCorto(valor: number): string {
  if (valor >= 1_000_000_000_000) {
    return `$${(valor / 1_000_000_000_000).toFixed(1)} billones`;
  }
  if (valor >= 1_000_000_000) {
    return `$${(valor / 1_000_000_000).toFixed(0)} mil millones`;
  }
  if (valor >= 1_000_000) {
    return `$${(valor / 1_000_000).toFixed(0)} millones`;
  }
  if (valor >= 1_000) {
    return `$${(valor / 1_000).toFixed(0)} mil`;
  }
  return `$${valor.toFixed(0)}`;
}

/**
 * Calcula el monto per cápita
 */
export function perCapita(valor: number): string {
  const porPersona = valor / POBLACION_MEXICO;
  if (porPersona >= 1000) {
    return `$${porPersona.toLocaleString('es-MX', { maximumFractionDigits: 0 })} por mexicano`;
  }
  return `$${porPersona.toFixed(0)} por mexicano`;
}

/**
 * Genera contextualizaciones comprensibles - NO alternativas, sino PERSPECTIVA real
 * El punto no es decir "con esto se harían X hospitales" sino poner la cifra en perspectiva
 */
export function generarComparacion(valor: number): { texto: string; icono: string } {
  const porMexicano = valor / POBLACION_MEXICO;
  const enSalariosMinimos = valor / SALARIO_MINIMO_ANUAL;

  // Para cifras muy grandes (>100 mil millones)
  // Para cifras muy grandes (>1 billón) - Comparar con Educación (algo tangible)
  if (valor >= 1_000_000_000_000) {
    const PRESUPUESTO_EDUCACION_ANUAL = 450_000_000_000; // Aprox 450 mil millones
    const aniosEducacion = valor / PRESUPUESTO_EDUCACION_ANUAL;

    // Si es cercano al total (8-10 billones)
    if (valor > 8_000_000_000_000) {
      return {
        texto: `Suficiente para financiar toda la educación pública de México por ${(aniosEducacion).toFixed(0)} años`,
        icono: '🎓'
      };
    }

    return {
      texto: `Equivale a ${aniosEducacion.toFixed(1)} veces todo el presupuesto anual de educación`,
      icono: '🎓'
    };
  }

  // Para cifras grandes (10-100 mil millones)
  if (valor >= 10_000_000_000) {
    // Comparar con presupuestos de estados
    const presupuestoChiapas = 80_000_000_000; // Aprox
    const vsFigura = valor / presupuestoChiapas;
    if (vsFigura >= 0.1) {
      return {
        texto: `Representa ${(vsFigura * 100).toFixed(0)}% del presupuesto anual de Chiapas`,
        icono: '🗺️'
      };
    }
    return {
      texto: `${porMexicano.toFixed(0)} pesos por cada mexicano`,
      icono: '🇲🇽'
    };
  }

  // Para cifras medianas (100 millones - 10 mil millones)
  if (valor >= 100_000_000) {
    // En términos de funcionarios
    const funcionariosAltos = Math.floor(valor / 2_000_000); // Sueldo anual promedio funcionario alto
    return {
      texto: `El sueldo anual de ${funcionariosAltos.toLocaleString('es-MX')} funcionarios de alto nivel`,
      icono: '👔'
    };
  }

  // Para cifras menores (1-100 millones)
  if (valor >= 1_000_000) {
    return {
      texto: `Lo que ganarían ${Math.floor(enSalariosMinimos).toLocaleString('es-MX')} trabajadores en un año`,
      icono: '👷'
    };
  }

  // Para cifras pequeñas
  const mesesTrabajo = valor / SALARIO_MINIMO_MENSUAL;
  if (mesesTrabajo >= 12) {
    return {
      texto: `${Math.floor(mesesTrabajo / 12)} años de salario mínimo`,
      icono: '⏱️'
    };
  }

  return {
    texto: `${Math.floor(mesesTrabajo)} meses de salario mínimo`,
    icono: '💰'
  };
}

/**
 * Genera contexto adicional basado en el tipo de gasto
 */
export function generarContexto(valor: number, tipo?: string): string {
  const porcDelPIB = (valor / 29_000_000_000_000) * 100; // PIB aproximado de México

  if (porcDelPIB >= 1) {
    return `Representa el ${porcDelPIB.toFixed(1)}% de todo lo que produce México en un año`;
  }

  if (porcDelPIB >= 0.1) {
    return `Es ${porcDelPIB.toFixed(2)}% del PIB de México`;
  }

  const diasDeGobierno = valor / (9_000_000_000_000 / 365); // Gasto federal diario aprox
  if (diasDeGobierno >= 1) {
    return `El gobierno gasta esta cantidad en ${Math.round(diasDeGobierno)} días`;
  }

  return `Cada segundo, el gobierno gasta $${Math.round(9_000_000_000_000 / 365 / 24 / 60 / 60).toLocaleString('es-MX')}`;
}

/**
 * Humaniza completamente un número
 */
export function humanizarNumero(valor: number, tipo?: string): NumeroHumanizado {
  const comparacion = generarComparacion(valor);

  return {
    valor,
    texto: formatoCorto(valor),
    textoCorto: formatoCorto(valor),
    perCapita: perCapita(valor),
    comparacion: comparacion.texto,
    comparacionIcono: comparacion.icono,
    contexto: generarContexto(valor, tipo),
  };
}

/**
 * Componentes de texto para UI
 */
export function textoParaUI(valor: number): {
  principal: string;
  secundario: string;
  detalle: string;
} {
  const humanizado = humanizarNumero(valor);

  return {
    principal: humanizado.texto,
    secundario: humanizado.perCapita,
    detalle: `${humanizado.comparacionIcono} ${humanizado.comparacion}`,
  };
}
/**
 * Traduce nombres técnicos de Ramos (Dependencias) a lenguaje ciudadano
 */
const RAMO_HUMANIZADO: Record<string, string> = {
  'Entidades No Sectorizadas': 'Empresas y Organismos del Estado (IMSS, CFE, PEMEX, etc.)',
  'Entidades no sectorizadas': 'Empresas y Organismos del Estado (IMSS, CFE, PEMEX, etc.)',
  'Entidades no Sectorizadas': 'Empresas y Organismos del Estado (IMSS, CFE, PEMEX, etc.)',
  'Gobernación': 'Gobernación (Seguridad y Política Interna)',
  'Hacienda y Crédito Público': 'Hacienda (Impuestos y Finanzas)',
  'Defensa Nacional': 'Ejército y Fuerza Aérea (SEDENA)',
  'Relaciones Exteriores': 'Relaciones Exteriores (SRE)',
  'Agricultura y Desarrollo Rural': 'Agricultura (SADER)',
  'Infraestructura, Comunicaciones y Transportes': 'Comunicaciones y Transportes (SICT)',
  'Economía': 'Economía',
  'Educación Pública': 'Educación (SEP)',
  'Salud': 'Salud (SS)',
  'Marina': 'Marina (SEMAR)',
  'Trabajo y Previsión Social': 'Trabajo (STPS)',
  'Desarrollo Agrario, Territorial y Urbano': 'Desarrollo Urbano (SEDATU)',
  'Medio Ambiente y Recursos Naturales': 'Medio Ambiente (SEMARNAT)',
  'Energía': 'Energía (SENER)',
  'Turismo': 'Turismo (SECTUR)',
  'Función Pública': 'Función Pública (SFP)',
  'Cultura': 'Cultura',
  'Bienestar': 'Bienestar (Programas Sociales)',
}

export function humanizarRamo(nombre: string): string {
  // Normalizar un poco para evitar errores por mayúsculas/minúsculas simples
  if (RAMO_HUMANIZADO[nombre]) return RAMO_HUMANIZADO[nombre];

  // Buscar case-insensitive si no se encuentra directo
  const key = Object.keys(RAMO_HUMANIZADO).find(k => k.toLowerCase() === nombre.toLowerCase());
  return key ? RAMO_HUMANIZADO[key] : nombre;
}

/**
 * Traduce una cifra de gasto a su costo de oportunidad social (Para el ciudadano que no sabe de política)
 * NUEVO ENFOQUE: Perspectiva y proporción
 */
export function traducirAGastoSocial(monto: number): string {
  if (monto < 1_000_000) return "Equivalente al sueldo anual de un alto funcionario.";
  if (monto < 50_000_000) return "Lo que gana una pequeña empresa exitosa en 5 años.";
  if (monto < 500_000_000) return "Presupuesto anual de un municipio pequeño.";
  if (monto < 5_000_000_000) return "Equivalente al presupuesto de una universidad estatal.";
  return "Una cifra comparable al presupuesto completo de un estado pequeño.";
}

/**
 * Da un consejo "sin política" sobre el gasto de una dependencia
 */
export function getContextoVoto(peso: number, variacion: number): { emoji: string, mensaje: string, color: string } {
  if (variacion > 20) return {
    emoji: "🚩",
    mensaje: "¡Cuidado! Gastan mucho más que antes sin explicar por qué.",
    color: "#EF4444"
  };
  if (peso > 5) return {
    emoji: "🧐",
    mensaje: "Esta oficina gasta demasiado en sí misma comparado con lo que hace.",
    color: "#F59E0B"
  };
  if (variacion < -5) return {
    emoji: "✅",
    mensaje: "Parecen estar cuidando más tu dinero este año.",
    color: "#10B981"
  };
  return {
    emoji: "⚖️",
    mensaje: "Su gasto se mantiene dentro de lo normal.",
    color: "#6B7280"
  };
}
