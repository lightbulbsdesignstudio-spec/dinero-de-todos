'use client';

import { useState, useEffect, ReactNode, Suspense } from 'react';
import { Wifi, WifiOff, Eye, Loader2 } from 'lucide-react';

// ============================================
// HOOK: Detectar conexión lenta
// ============================================

interface ConnectionInfo {
  isSlowConnection: boolean;
  effectiveType: string;
  saveData: boolean;
  downlink: number;
}

export function useConnectionQuality(): ConnectionInfo {
  const [connection, setConnection] = useState<ConnectionInfo>({
    isSlowConnection: false,
    effectiveType: '4g',
    saveData: false,
    downlink: 10
  });

  useEffect(() => {
    // @ts-ignore - Navigator.connection no está en todos los tipos
    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (conn) {
      const updateConnection = () => {
        const effectiveType = conn.effectiveType || '4g';
        const isSlowConnection = 
          effectiveType === 'slow-2g' || 
          effectiveType === '2g' || 
          effectiveType === '3g' ||
          conn.saveData === true ||
          (conn.downlink && conn.downlink < 1.5);

        setConnection({
          isSlowConnection,
          effectiveType,
          saveData: conn.saveData || false,
          downlink: conn.downlink || 10
        });
      };

      updateConnection();
      conn.addEventListener('change', updateConnection);
      return () => conn.removeEventListener('change', updateConnection);
    }
  }, []);

  return connection;
}

// ============================================
// COMPONENTE: Wrapper con fallback para visualizaciones
// ============================================

interface PerformanceWrapperProps {
  children: ReactNode;
  fallback: ReactNode;
  loadingMessage?: string;
  ariaLabel: string;
  forceSimple?: boolean;
}

export default function PerformanceWrapper({
  children,
  fallback,
  loadingMessage = 'Cargando visualización...',
  ariaLabel,
  forceSimple = false
}: PerformanceWrapperProps) {
  const { isSlowConnection, saveData } = useConnectionQuality();
  const [prefersSimple, setPrefersSimple] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Detectar preferencia de movimiento reducido
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersSimple(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersSimple(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Simular carga completada
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const shouldShowSimple = forceSimple || isSlowConnection || saveData || prefersSimple;

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center p-8 bg-gray-50 rounded-xl"
        role="status"
        aria-label={loadingMessage}
      >
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin mr-3" />
        <span className="text-gray-600">{loadingMessage}</span>
      </div>
    );
  }

  // Error boundary fallback
  if (hasError) {
    return (
      <div 
        className="p-6 bg-red-50 rounded-xl border border-red-200"
        role="alert"
      >
        <p className="text-red-700 font-medium">Error al cargar la visualización</p>
        <p className="text-red-600 text-sm mt-1">Mostrando versión simplificada</p>
        <div className="mt-4">{fallback}</div>
      </div>
    );
  }

  return (
    <div 
      role="region" 
      aria-label={ariaLabel}
    >
      {/* Indicador de modo simplificado */}
      {shouldShowSimple && (
        <div 
          className="mb-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg"
          role="status"
        >
          <WifiOff className="w-4 h-4" />
          <span>Vista simplificada para mejor rendimiento</span>
          <button
            onClick={() => setPrefersSimple(false)}
            className="ml-auto text-[#006847] font-medium hover:underline"
          >
            Ver completa
          </button>
        </div>
      )}

      {/* Contenido principal o fallback */}
      {shouldShowSimple ? fallback : children}
    </div>
  );
}

// ============================================
// COMPONENTE: Fallback estático para Sankey
// ============================================

interface SankeyFallbackProps {
  ingresos: Array<{ nombre: string; monto: number; porcentaje: number }>;
  gastos: Array<{ nombre: string; monto: number; porcentaje: number }>;
}

export function SankeyFallback({ ingresos, gastos }: SankeyFallbackProps) {
  const formatMonto = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}B`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(0)}MM`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
    return `$${n.toLocaleString('es-MX')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
      {/* Ingresos */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full" aria-hidden="true" />
          De dónde viene el dinero
        </h3>
        <ul className="space-y-2" role="list" aria-label="Fuentes de ingreso">
          {ingresos.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.nombre}</span>
                  <span className="text-gray-500">{item.porcentaje}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${item.porcentaje}%` }}
                    role="progressbar"
                    aria-valuenow={item.porcentaje}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.nombre}: ${item.porcentaje}%`}
                  />
                </div>
                <span className="text-xs text-gray-500">{formatMonto(item.monto)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Gastos */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full" aria-hidden="true" />
          A dónde va el dinero
        </h3>
        <ul className="space-y-2" role="list" aria-label="Destinos del gasto">
          {gastos.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.nombre}</span>
                  <span className="text-gray-500">{item.porcentaje}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.porcentaje}%` }}
                    role="progressbar"
                    aria-valuenow={item.porcentaje}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.nombre}: ${item.porcentaje}%`}
                  />
                </div>
                <span className="text-xs text-gray-500">{formatMonto(item.monto)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Flecha central (visual) */}
      <div className="hidden md:flex col-span-2 justify-center -mt-4" aria-hidden="true">
        <div className="text-4xl text-gray-300">→</div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Fallback estático para Treemap
// ============================================

interface TreemapFallbackProps {
  items: Array<{ 
    nombre: string; 
    monto: number; 
    porcentaje: number;
    color?: string;
  }>;
  total: number;
}

export function TreemapFallback({ items, total }: TreemapFallbackProps) {
  const formatMonto = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(1)} billones`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(0)} mil millones`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)} millones`;
    return `$${n.toLocaleString('es-MX')}`;
  };

  // Ordenar por monto
  const sorted = [...items].sort((a, b) => b.monto - a.monto);

  return (
    <div role="list" aria-label="Distribución del presupuesto">
      {/* Resumen accesible */}
      <div className="sr-only">
        <h3>Resumen: {items.length} áreas de gasto, total {formatMonto(total)}</h3>
      </div>

      {/* Lista visual */}
      <div className="space-y-3">
        {sorted.map((item, i) => (
          <div 
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            role="listitem"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: item.color || '#6b7280' }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.nombre}</p>
                  <p className="text-sm text-gray-500">{formatMonto(item.monto)}</p>
                </div>
              </div>
              <div className="text-right">
                <span 
                  className="inline-block px-2 py-1 bg-gray-100 rounded text-sm font-bold text-gray-700"
                  aria-label={`${item.porcentaje} por ciento del total`}
                >
                  {item.porcentaje}%
                </span>
              </div>
            </div>
            
            {/* Barra de proporción */}
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${item.porcentaje}%`,
                  backgroundColor: item.color || '#6b7280'
                }}
                role="progressbar"
                aria-valuenow={item.porcentaje}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Nota de accesibilidad */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Vista de lista • Los porcentajes muestran la proporción del presupuesto total
      </p>
    </div>
  );
}

// ============================================
// COMPONENTE: Toggle de alto contraste
// ============================================

export function AccessibilityToggle() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    // Aplicar estilos globales
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [highContrast, largeText]);

  return (
    <div 
      className="fixed bottom-4 left-4 z-50"
      role="region"
      aria-label="Opciones de accesibilidad"
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Accesibilidad</p>
        
        <div className="space-y-2">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              highContrast 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={highContrast}
          >
            <Eye className="w-4 h-4" />
            Alto contraste
          </button>

          <button
            onClick={() => setLargeText(!largeText)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              largeText 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={largeText}
          >
            <span className="text-lg font-bold">A</span>
            Texto grande
          </button>
        </div>
      </div>
    </div>
  );
}
