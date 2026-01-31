/**
 * Formatea un número como moneda mexicana
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-MX').format(value);
}

/**
 * Formatea un número grande de forma abreviada (millones, billones)
 */
export function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}k M`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return formatCurrency(value);
}

/**
 * Calcula el porcentaje
 */
export function calculatePercentage(partial: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((partial / total) * 100 * 10) / 10;
}

/**
 * Genera un color basado en el porcentaje de ejecución
 */
export function getExecutionColor(percentage: number): string {
  if (percentage >= 90) return '#22c55e'; // Verde
  if (percentage >= 70) return '#eab308'; // Amarillo
  if (percentage >= 50) return '#f97316'; // Naranja
  return '#ef4444'; // Rojo
}

/**
 * Clase helper para combinar clases de Tailwind
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
