'use client';

import { useState, useMemo } from 'react';
import { Info, Download, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';
import { SankeyChart } from '@/components/charts';
import { useBudgetData } from '@/hooks/useBudgetData';
import { humanizarNumero } from '@/lib/humanizar';
import ActionTrigger from '@/components/ui/ActionTrigger';

// Población de México para cálculos per cápita
const POBLACION_MX = 130_000_000;

export default function FlujoRecursosPage() {
  const [showInfo, setShowInfo] = useState(false);
  const { data, loading } = useBudgetData();

  const totalIngresos = data ? data.income_sources.reduce((sum, f) => sum + f.monto, 0) : 0;
  const totalGastos = data ? data.budget_totals.grand_total : 0;

  // Calcular porcentajes para destinos
  const ramosConPorcentaje = useMemo(() => {
    if (!data) return [];
    // Mapeamos los links del sankey que van al destino final como "ramos" para esta vista
    // O mejor, usamos los proyectos estrategicos como ejemplo de destino
    return data.strategic_projects.slice(0, 6).map(proj => ({
      id: proj.name,
      nombre: proj.name,
      aprobado: proj.value * 1000000,
      color: '#00A896',
      porcentaje: ((proj.value * 1000000 / totalGastos) * 100).toFixed(1)
    }));
  }, [data, totalGastos]);

  const sankeyDataMemo = useMemo(() => {
    if (!data) return null;
    return {
      nodes: [
        { name: 'Impuestos', id: 'total', color: '#00A896' },
        { name: 'Comprometido', id: 'comprometido', color: '#EF4444' },
        { name: 'Programable', id: 'programable', color: '#4F46E5' },
        { name: 'Deuda', id: 'deuda', color: '#EF4444' },
        { name: 'Estados', id: 'participaciones', color: '#EF4444' },
        { name: 'Salud', id: 'salud', color: '#10B981' },
        { name: 'Jubilados', id: 'jubilados', color: '#F29100' },
        { name: 'Bienestar', id: 'bienestar', color: '#F29100' },
        { name: 'Sembrando', id: 'sembrando', color: '#10B981' },
        { name: 'Jóvenes', id: 'jovenes', color: '#10B981' },
        { name: 'Inversión', id: 'inversion', color: '#00A896' },
        { name: 'Operación', id: 'operacion', color: '#1E293B' }
      ],
      links: data.sankey_data.links
    };
  }, [data]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#00A896] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#004B57]">¿De dónde viene y a dónde va tu <span className="text-[#F29100]">$</span>dinero?</h1>
              <p className="text-gray-600 mt-1">
                Sigue el camino de tus impuestos desde que entran hasta que se gastan
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Info className="w-4 h-4" />
                Cómo leer
              </button>
              <button className="inline-flex items-center gap-2 bg-[#00A896] text-white px-4 py-2 rounded-lg hover:bg-[#00937f] transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">¿Cómo leer este diagrama?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Izquierda:</strong> De dónde viene el dinero (tus impuestos, petróleo, préstamos)</li>
              <li>• <strong>Derecha:</strong> En qué se gasta (escuelas, hospitales, carreteras, etc.)</li>
              <li>• <strong>Líneas gruesas:</strong> Más dinero fluye por ahí</li>
              <li>• <strong>Toca o pasa el mouse:</strong> Para ver las cantidades exactas</li>
            </ul>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Resumen humanizado */}
        <div className="bg-gradient-to-r from-[#00A896]/10 to-[#004B57]/10 border border-[#00A896]/30 rounded-xl p-5 mb-6">
          <p className="text-lg text-gray-800">
            En total, el gobierno maneja <strong className="text-[#004B57]"><span className="text-[#F29100]">$</span>{humanizarNumero(totalIngresos).texto.replace('$', '')}</strong> al año.
            Eso equivale a <strong className="text-[#00A896]">${Math.round(totalIngresos / POBLACION_MX).toLocaleString('es-MX')}</strong> por cada mexicano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sources - Ingresos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">¿De dónde sale el dinero?</h2>
            <p className="text-sm text-gray-500 mb-4">Lo que recauda el gobierno</p>
            <div className="space-y-4">
              {data.income_sources.map((fuente) => {
                const perCapita = Math.round(fuente.monto / POBLACION_MX);
                return (
                  <div key={fuente.id} className="group">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: fuente.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{fuente.nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 tabular-nums">
                          {humanizarNumero(fuente.monto).texto}
                        </p>
                        <p className="text-xs text-gray-500">{fuente.porcentaje}% del total</p>
                      </div>
                    </div>
                    {/* Barra de proporción */}
                    <div className="ml-6 mt-1.5">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${fuente.porcentaje}%`,
                            backgroundColor: fuente.color
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ${perCapita.toLocaleString('es-MX')} por persona al año
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-900">Total que entra</span>
                <div className="text-right">
                  <span className="font-bold text-xl text-gray-900 tabular-nums">{humanizarNumero(totalIngresos).texto}</span>
                  <p className="text-xs text-gray-500">${Math.round(totalIngresos / POBLACION_MX).toLocaleString('es-MX')} por mexicano</p>
                </div>
              </div>
            </div>
          </div>

          {/* Destinations - Gastos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">¿A dónde va el dinero?</h2>
            <p className="text-sm text-gray-500 mb-4">Las 6 áreas que más reciben</p>
            <div className="space-y-4">
              {ramosConPorcentaje.map((ramo) => {
                const perCapita = Math.round(ramo.aprobado / POBLACION_MX);
                return (
                  <div key={ramo.id} className="group">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: ramo.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{ramo.nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 tabular-nums">
                          {humanizarNumero(ramo.aprobado).texto}
                        </p>
                        <p className="text-xs text-gray-500">{ramo.porcentaje}% del gasto</p>
                      </div>
                    </div>
                    {/* Barra de proporción */}
                    <div className="ml-6 mt-1.5">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${parseFloat(ramo.porcentaje) * 2}%`, // Escalado para visibilidad
                            backgroundColor: ramo.color
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ${perCapita.toLocaleString('es-MX')} por persona al año
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
              <a href="/presupuesto" className="text-[#006847] text-sm font-medium hover:underline">
                Ver todas las áreas →
              </a>
              <a href="/tu-estado" className="text-[#006847] text-sm font-medium hover:underline">
                Ver por estado →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sankey Diagram */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">El camino del dinero</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <SankeyChart nodes={sankeyDataMemo?.nodes || []} links={sankeyDataMemo?.links || []} />

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <strong>Nota:</strong> Este diagrama muestra una simplificación del flujo presupuestario.
              Los montos representan cifras aprobadas en el PEF 2026.
              Para datos oficiales completos, consulte{' '}
              <a
                href="https://www.transparenciapresupuestaria.gob.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006847] hover:underline"
              >
                Transparencia Presupuestaria
              </a>.
            </p>
          </div>

          {/* Acción ciudadana */}
          <div className="mt-6">
            <ActionTrigger
              variant="floating"
              contexto={{
                seccion: 'Flujo de ingresos y gastos del gobierno',
                valor: humanizarNumero(totalIngresos).texto,
                fuente: `Presupuesto de Egresos de la Federación ${data.meta.version}`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
