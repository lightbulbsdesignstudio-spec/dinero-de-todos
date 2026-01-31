'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Home, Search, RotateCcw, Info } from 'lucide-react';
import ActionTrigger from '@/components/ui/ActionTrigger';
import SourceLink from '@/components/ui/SourceLink';
import { FUENTES } from '@/data/fuentes';
import { TreemapChart } from '@/components/charts';
import PerformanceWrapper, { TreemapFallback } from '@/components/ui/PerformanceWrapper';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import type { RamoPresupuesto as Ramo, ProgramaPresupuesto as Programa } from '@/lib/api/presupuesto';
import { humanizarNumero } from '@/lib/humanizar';

const POBLACION_MX = 130_000_000;

interface TreemapNode {
  name: string;
  nombreCiudadano?: string;
  descripcion?: string;
  value?: number;
  ejercido?: number;
  children?: TreemapNode[];
  color?: string;
}

export default function ExploradorPage() {
  const [ramosData, setRamosData] = useState<Ramo[]>([]);
  const [selectedRamo, setSelectedRamo] = useState<Ramo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Presupuesto Federal']);
  const [isLoading, setIsLoading] = useState(true);
  const [programasData, setProgramasData] = useState<Programa[]>([]);

  // Fetch real data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/presupuesto');
        const result = await response.json();
        if (result.success && result.data.ramos) {
          setRamosData(result.data.ramos);

          // También intentamos cargar programas si hay un ramo seleccionado o para el buscador
          // Por simplicidad en este explorador, cargaremos una muestra o todos los "estratégicos"
          const progRes = await fetch('/api/presupuesto/ramo-1'); // Placeholder o endpoint general
          const progResult = await progRes.json();
          if (progResult.success) {
            setProgramasData(progResult.data.programas);
          }
        }
      } catch (error) {
        console.error('Error fetching budget data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Build treemap data based on selection
  const treemapData = useMemo((): TreemapNode => {
    if (selectedRamo) {
      const ramoPrograms = programasData.filter(p => p.ramoId === selectedRamo.id);
      return {
        name: selectedRamo.nombre,
        children: ramoPrograms.map(prog => ({
          name: prog.nombre,
          value: prog.aprobado,
          ejercido: prog.ejercido,
          color: selectedRamo.color,
        })),
      };
    }

    // Show all ramos from real data
    return {
      name: 'Presupuesto Federal 2026',
      children: ramosData.map(ramo => ({
        name: ramo.nombre,
        nombreCiudadano: ramo.nombreCiudadano,
        descripcion: ramo.descripcion,
        value: ramo.aprobado,
        ejercido: ramo.ejercido,
        color: ramo.color,
      })),
    };
  }, [selectedRamo, ramosData]);

  const handleNodeClick = (node: TreemapNode, path: string[]) => {
    if (!selectedRamo) {
      // Find the clicked ramo
      const clickedRamo = ramosData.find(r => r.nombre === node.name);
      if (clickedRamo) {
        setSelectedRamo(clickedRamo);
        setBreadcrumb(['Presupuesto Federal', clickedRamo.nombre]);
      }
    }
  };

  const handleReset = () => {
    setSelectedRamo(null);
    setBreadcrumb(['Presupuesto Federal']);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      handleReset();
    }
  };

  // Filter for search
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();

    const matchingRamos = ramosData.filter(r =>
      r.nombre.toLowerCase().includes(term)
    );

    const matchingProgramas = programasData.filter(p =>
      p.nombre.toLowerCase().includes(term)
    );

    return [...matchingRamos.map(r => ({ type: 'ramo' as const, data: r })),
    ...matchingProgramas.map(p => ({ type: 'programa' as const, data: p }))].slice(0, 8);
  }, [searchTerm, ramosData]);

  // Stats for current view
  const currentStats = useMemo(() => {
    if (selectedRamo) {
      const ramoPrograms = programasData.filter(p => p.ramoId === selectedRamo.id);
      return {
        count: ramoPrograms.length,
        total: selectedRamo.aprobado,
        ejercido: selectedRamo.ejercido,
        label: 'programas',
      };
    }
    return {
      count: ramosData.length,
      total: ramosData.reduce((sum, r) => sum + r.aprobado, 0),
      ejercido: ramosData.reduce((sum, r) => sum + r.ejercido, 0),
      label: 'ramos',
    };
  }, [selectedRamo, ramosData]);

  const porcentaje = calculatePercentage(currentStats.ejercido, currentStats.total);

  // Datos para fallback accesible (conexión lenta / lectores de pantalla)
  const fallbackItems = useMemo(() => {
    const items = treemapData.children || [];
    return items.map(item => ({
      nombre: item.nombreCiudadano || item.name,
      monto: item.value || 0,
      porcentaje: Math.round(((item.value || 0) / currentStats.total) * 100),
      color: item.color
    })).sort((a, b) => b.monto - a.monto);
  }, [treemapData, currentStats.total]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">¿En qué se gasta el dinero?</h1>
              <p className="text-gray-600 mt-1">
                Toca cualquier área para ver cómo se distribuye el dinero
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar área o programa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent"
              />

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (result.type === 'ramo') {
                          setSelectedRamo(result.data as Ramo);
                          setBreadcrumb(['Presupuesto Federal', (result.data as Ramo).nombre]);
                        } else {
                          const prog = result.data as Programa;
                          const ramo = ramosData.find((r: Ramo) => r.id === prog.ramoId);
                          if (ramo) {
                            setSelectedRamo(ramo);
                            setBreadcrumb(['Presupuesto Federal', ramo.nombre]);
                          }
                        }
                        setSearchTerm('');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${result.type === 'ramo'
                          ? 'bg-[#00A896]/20 text-[#004B57]'
                          : 'bg-blue-100 text-blue-700'
                          }`}>
                          {result.type === 'ramo' ? 'Área' : 'Programa'}
                        </span>
                        <span className="font-medium text-gray-900">
                          {result.type === 'ramo'
                            ? (result.data as Ramo).nombre
                            : (result.data as Programa).nombre}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contexto y resumen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Resumen humanizado */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <p className="text-lg text-gray-700 leading-relaxed">
                {selectedRamo ? (
                  <>
                    <strong className="text-gray-900">{selectedRamo.nombreCiudadano || selectedRamo.nombre}</strong> tiene un presupuesto de{' '}
                    <strong className="text-[#004B57]">{humanizarNumero(currentStats.total).texto}</strong>.
                    {selectedRamo.descripcion && (
                      <span className="block mt-2 text-base text-gray-600">
                        {selectedRamo.descripcion}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    El gobierno federal tiene <strong className="text-[#004B57]">{humanizarNumero(currentStats.total).texto}</strong> para gastar este año.
                    Eso equivale a <strong className="text-[#004B57]">${Math.round(currentStats.total / POBLACION_MX).toLocaleString('es-MX')}</strong> por cada mexicano.
                  </>
                )}
              </p>
            </div>

            {/* Stats compactas */}
            <div className="flex gap-4 lg:gap-6">
              <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm">
                <p className="text-2xl font-bold text-gray-900">{currentStats.count}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{currentStats.label}</p>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm">
                <p className={`text-2xl font-bold ${porcentaje >= 90 ? 'text-[#00A896]' :
                  porcentaje >= 70 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>{porcentaje}%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Avance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-gray-500 hover:text-[#00A896] transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`${index === breadcrumb.length - 1
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-[#00A896]'
                    } transition-colors`}
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Treemap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedRamo
                  ? `¿En qué se gasta "${selectedRamo.nombreCiudadano || selectedRamo.nombre}"?`
                  : '¿En qué gasta el gobierno?'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                El tamaño de cada cuadro representa cuánto dinero recibe. Toca cualquiera para ver más detalles.
              </p>
            </div>
            {selectedRamo && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Ver todas las áreas
              </button>
            )}
          </div>

          <PerformanceWrapper
            ariaLabel={selectedRamo
              ? `Programas de ${selectedRamo.nombreCiudadano || selectedRamo.nombre}`
              : 'Distribución del presupuesto federal por áreas'
            }
            loadingMessage="Cargando visualización del presupuesto..."
            fallback={
              <TreemapFallback
                items={fallbackItems}
                total={currentStats.total}
              />
            }
          >
            <TreemapChart data={treemapData} onNodeClick={handleNodeClick} />
          </PerformanceWrapper>

          {/* Leyenda mejorada */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>¿Cómo leer este gráfico?</strong> Cada rectángulo representa un área de gasto.
                  Mientras más grande, más dinero recibe. Los porcentajes muestran qué parte del total representa.
                </p>
                <p className="text-sm text-gray-500">
                  💡 <strong>Tip:</strong> Pasa el mouse o toca para ver detalles, haz clic para explorar el desglose interno.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Table */}
        {selectedRamo && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Detalle de los programas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Programa</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Quién lo maneja</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Planeado</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Gastado</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Avance</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Personas beneficiadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {programasData
                    .filter(p => p.ramoId === selectedRamo.id)
                    .map((prog) => {
                      const pct = calculatePercentage(prog.ejercido, prog.aprobado);
                      return (
                        <tr key={prog.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{prog.nombre}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{prog.ramoId}</td>
                          <td className="py-3 px-4 text-right text-sm tabular-nums">{formatCurrency(prog.aprobado)}</td>
                          <td className="py-3 px-4 text-right text-sm tabular-nums">{formatCurrency(prog.ejercido)}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`text-sm font-semibold ${pct >= 90 ? 'text-[#00A896]' :
                              pct >= 70 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                              {pct}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-gray-600 tabular-nums">
                            {prog.beneficiarios?.toLocaleString('es-MX') || '-'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Acción ciudadana */}
        <div className="mt-8">
          <ActionTrigger
            contexto={{
              seccion: selectedRamo
                ? `Programas de ${selectedRamo.nombreCiudadano || selectedRamo.nombre}`
                : 'Distribución del presupuesto federal',
              elemento: selectedRamo?.nombreCiudadano || selectedRamo?.nombre,
              valor: selectedRamo
                ? humanizarNumero(selectedRamo.aprobado).texto
                : humanizarNumero(currentStats.total).texto,
              fuente: 'Presupuesto de Egresos de la Federación 2026'
            }}
          />
        </div>

        {/* Trazabilidad de fuentes */}
        <div className="mt-6">
          <SourceLink
            variant="detailed"
            fuentes={[
              ...FUENTES.presupuesto_federal,
              ...FUENTES.datos_demo
            ]}
          />
        </div>
      </div>
    </div>
  );
}
