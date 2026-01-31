'use client';

import { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

interface Columna<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TablaVigilanciaProps<T> {
  datos: T[];
  columnas: Columna<T>[];
  keyExtractor: (item: T) => string;
  titulo?: string;
  busqueda?: boolean;
  filtros?: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

// Componente de Monto con formato y color
export function Monto({ 
  valor, 
  formato = 'completo' 
}: { 
  valor: number; 
  formato?: 'completo' | 'corto' | 'millones';
}) {
  const formatear = (n: number) => {
    if (formato === 'millones') {
      return `${(n / 1_000_000).toFixed(1)}M`;
    }
    if (formato === 'corto') {
      if (n >= 1e12) return `${(n / 1e12).toFixed(1)}B`;
      if (n >= 1e9) return `${(n / 1e9).toFixed(1)}MM`;
      if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    }
    return n.toLocaleString('es-MX');
  };

  return (
    <span className="monto-dinero tabular-nums">
      <span className="signo-peso">$</span>
      {formatear(valor)}
    </span>
  );
}

// Skeleton para carga
function SkeletonTabla({ columnas }: { columnas: number }) {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-row">
          {[...Array(columnas)].map((_, j) => (
            <div key={j} className="skeleton skeleton-text" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function TablaVigilancia<T extends Record<string, any>>({
  datos,
  columnas,
  keyExtractor,
  titulo,
  busqueda = false,
  filtros,
  loading = false,
  emptyMessage = 'No hay datos disponibles'
}: TablaVigilanciaProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Filtrar por búsqueda
  const datosFiltrados = searchTerm 
    ? datos.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : datos;

  // Ordenar
  const datosOrdenados = sortConfig
    ? [...datosFiltrados].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : datosFiltrados;

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header con título y controles */}
      {(titulo || busqueda || filtros) && (
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {titulo && (
              <h3 className="font-display text-lg font-bold text-[#004B57]">
                {titulo}
              </h3>
            )}
            
            <div className="flex items-center gap-3">
              {busqueda && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:border-[#00A896]"
                  />
                </div>
              )}
              {filtros}
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <SkeletonTabla columnas={columnas.length} />
        ) : datosOrdenados.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full tabla-vigilancia">
            <thead>
              <tr>
                {columnas.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`py-3 px-4 text-${col.align || 'left'} ${col.width || ''}`}
                    style={{ width: col.width }}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(String(col.key))}
                        className="inline-flex items-center gap-1 hover:text-[#00A896] transition-colors"
                      >
                        {col.header}
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronUp className="w-4 h-4 opacity-30" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosOrdenados.map((item) => (
                <tr key={keyExtractor(item)}>
                  {columnas.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`py-3 px-4 text-${col.align || 'left'}`}
                    >
                      {col.render 
                        ? col.render(item) 
                        : item[col.key as keyof T] as ReactNode
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer con conteo */}
      {!loading && datosOrdenados.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">
          Mostrando {datosOrdenados.length} de {datos.length} registros
        </div>
      )}
    </div>
  );
}

// Componente de filtro píldora
interface FiltroPildoraProps {
  label: string;
  activo: boolean;
  onClick: () => void;
  icono?: ReactNode;
}

export function FiltroPildora({ 
  label, 
  activo, 
  onClick,
  icono
}: FiltroPildoraProps) {
  return (
    <button
      onClick={onClick}
      className={`filtro-pildora ${activo ? 'activo' : ''}`}
    >
      {icono}
      {label}
    </button>
  );
}
