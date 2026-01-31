'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, ArrowUpDown, Loader2 } from 'lucide-react';
import { StatCard, ProgressBar } from '@/components/ui';
import OjoCriticoWidget from '@/components/ui/OjoCriticoWidget';
import { SankeyChart } from '@/components/charts';
import { useBudgetData } from '@/hooks/useBudgetData';
import { getPresupuestoRamos, getProgramasPorRamo, RamoPresupuesto } from '@/lib/api/presupuesto';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import ActionTrigger from '@/components/ui/ActionTrigger';

type SortField = 'nombre' | 'aprobado' | 'ejercido' | 'porcentaje';
type SortOrder = 'asc' | 'desc';

export default function PresupuestoPage() {
  const { data: masterData, loading: masterLoading } = useBudgetData();
  const [ramosData, setRamosData] = useState<RamoPresupuesto[]>([]);
  const [ramoPrograms, setRamoPrograms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRamo, setSelectedRamo] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('aprobado');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPresupuestoRamos();
        setRamosData(data);
      } catch (error) {
        console.error('Error fetching budget data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchRamoDetails() {
      if (selectedRamo) {
        const progs = await getProgramasPorRamo(selectedRamo);
        setRamoPrograms(progs);
      } else {
        setRamoPrograms([]);
      }
    }
    fetchRamoDetails();
  }, [selectedRamo]);

  const totalAprobado = ramosData.reduce((sum, r) => sum + r.aprobado, 0);
  const totalEjercido = ramosData.reduce((sum, r) => sum + r.ejercido, 0);
  const porcentajeTotal = calculatePercentage(totalEjercido, totalAprobado);

  // Generar datos para Ojo Crítico (Simulación para demo)
  const datosOjoCritico = useMemo(() => {
    return ramosData.map(r => {
      // Simular variaciones y gastos de movilidad basados en el ID o nombre para consistencia
      const nombre = r.nombre || '';
      const esSedena = nombre.includes('Defensa');
      const esSalud = nombre.includes('Salud');
      const esTurismo = nombre.includes('Turismo');

      let pesoMovilidad = 1.5;
      let variacionAnual = 4.5;
      let desglose = { vuelos: 0, comidas: 0, gasolina: 0 };

      if (esSedena) {
        pesoMovilidad = 14.5; // ALERTA CRÍTICA
        variacionAnual = 22; // ALERTA VARIACIÓN
        desglose = { vuelos: r.aprobado * 0.08, comidas: r.aprobado * 0.01, gasolina: r.aprobado * 0.055 };
      } else if (esSalud) {
        pesoMovilidad = 0.8;
        variacionAnual = 12;
      } else if (esTurismo) {
        pesoMovilidad = 8.5; // ALERTA ALTA
        variacionAnual = 2.0;
      }

      const montoMovilidad = r.aprobado * (pesoMovilidad / 100);

      return {
        nombre: r.nombre,
        montoMovilidad,
        presupuestoTotal: r.aprobado,
        pesoMovilidad,
        variacionAnual,
        desglose: desglose.vuelos > 0 ? desglose : undefined
      };
    });
  }, [ramosData]);

  const totalMovilidad = datosOjoCritico.reduce((sum, d) => sum + d.montoMovilidad, 0);

  // Filter and sort ramos
  const filteredRamos = ramosData
    .filter(ramo =>
      ramo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ramo.numero.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'aprobado':
          comparison = a.aprobado - b.aprobado;
          break;
        case 'ejercido':
          comparison = a.ejercido - b.ejercido;
          break;
        case 'porcentaje':
          comparison = calculatePercentage(a.ejercido, a.aprobado) - calculatePercentage(b.ejercido, b.aprobado);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Los programas se obtienen via useEffect [selectedRamo]

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-[#00A896] transition-colors"
    >
      {children}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-[#00A896]' : 'text-gray-400'}`} />
    </button>
  );

  if (isLoading || masterLoading || !masterData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-[#00A896] animate-spin" />
          <p className="text-gray-500 font-medium">Cargando Presupuesto 2026...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#004B57]">¿Cuánto <span className="text-[#F29100]">$</span>dinero hay en 2026?</h1>
              <p className="text-gray-600 mt-2">
                Todo el dinero que el gobierno puede gastar este año, área por área
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#00A896] hover:bg-[#008E7D] text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-not-allowed opacity-80" title="Próximamente">
              <Download className="w-5 h-5" />
              Descargar CSV 2026
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Dinero planeado"
            value={masterData.budget_totals.grand_total}
            isCurrency
            color="green"
          />
          <StatCard
            title="Ya se gastó"
            value={totalEjercido}
            subtitle="Basado en ejecución real"
            isCurrency
            color="blue"
          />
          <StatCard
            title="Soberanía de Inversión"
            value={masterData.budget_totals.physical_investment}
            subtitle="Inversión física productiva"
            isCurrency
            color="orange"
          />
        </div>

        {/* New Ojo Crítico Integration */}
        {ramosData.length > 0 && (
          <div className="mb-12">
            <OjoCriticoWidget
              dependencias={datosOjoCritico}
              totalMovilidad={totalMovilidad}
              totalPEF={masterData.budget_totals.grand_total}
            />
          </div>
        )}

        {/* Sankey Chart Integration */}
        <div className="mb-12 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#004B57] mb-2">Flujo del Dinero</h2>
            <p className="text-gray-500 text-sm">De dónde viene el dinero (izquierda) y a dónde va (derecha)</p>
          </div>
          <div className="h-[500px] w-full">
            <SankeyChart nodes={masterData.sankey_data.links.map(l => ({ name: l.target, id: l.target, color: '#00A896' }))} links={masterData.sankey_data.links} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ramos List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar área por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        <SortButton field="nombre">Área</SortButton>
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                        <SortButton field="aprobado">Planeado</SortButton>
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                        <SortButton field="ejercido">Gastado</SortButton>
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                        <SortButton field="porcentaje">Avance</SortButton>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRamos.map((ramo) => {
                      const porcentaje = calculatePercentage(ramo.ejercido, ramo.aprobado);
                      const isSelected = selectedRamo === ramo.id;

                      return (
                        <tr
                          key={ramo.id}
                          onClick={() => setSelectedRamo(isSelected ? null : ramo.id)}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#00A896]/10' : 'hover:bg-gray-50'
                            }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: ramo.color }}
                              />
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{ramo.nombre}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900 text-sm tabular-nums">
                            {formatCurrency(ramo.aprobado)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-700 text-sm tabular-nums">
                            {formatCurrency(ramo.ejercido)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`text-sm font-semibold tabular-nums ${porcentaje >= 90 ? 'text-[#00A896]' :
                              porcentaje >= 70 ? 'text-[#F29100]' :
                                'text-red-500'
                              }`}>
                              {porcentaje}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredRamos.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron áreas con ese nombre
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              {selectedRamo ? (
                <>
                  {(() => {
                    const ramo = ramosData.find(r => r.id === selectedRamo);
                    if (!ramo) return null;
                    const porcentaje = calculatePercentage(ramo.ejercido, ramo.aprobado);

                    return (
                      <>
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: ramo.color }}
                            />
                            <h2 className="text-lg font-bold text-[#004B57]">{ramo.nombre}</h2>
                          </div>
                          {ramo.descripcion && (
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                              {ramo.descripcion}
                            </p>
                          )}
                        </div>

                        <div className="space-y-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Dinero planeado</p>
                            <p className="text-2xl font-bold text-gray-900 tabular-nums">
                              {formatCurrency(ramo.aprobado)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Ya se gastó</p>
                            <p className="text-xl font-semibold text-gray-700 tabular-nums">
                              {formatCurrency(ramo.ejercido)}
                            </p>
                          </div>
                          <ProgressBar value={porcentaje} />
                        </div>

                        {ramoPrograms.length > 0 && (
                          <>
                            <h3 className="font-semibold text-gray-900 mb-3">
                              ¿En qué se usa este dinero?
                            </h3>
                            <div className="space-y-3">
                              {ramoPrograms.slice(0, 4).map((prog) => {
                                const progPorcentaje = calculatePercentage(prog.ejercido, prog.aprobado);
                                return (
                                  <div key={prog.id} className="p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-sm text-gray-900 mb-1">
                                      {prog.nombre}
                                    </p>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-600">
                                        {formatCurrency(prog.ejercido)}
                                      </span>
                                      <span className={`font-medium ${progPorcentaje >= 90 ? 'text-[#00A896]' :
                                        progPorcentaje >= 70 ? 'text-[#F29100]' :
                                          'text-red-500'
                                        }`}>
                                        {progPorcentaje}%
                                      </span>
                                    </div>
                                    <ProgressBar value={progPorcentaje} showLabel={false} size="sm" />
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Selecciona un área</p>
                  <p className="text-sm">Haz clic en cualquier área para ver en qué se gasta</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Trigger */}
        <div className="mt-8">
          <ActionTrigger
            contexto={{
              seccion: 'Presupuesto por área',
              elemento: selectedRamo ? ramosData.find(r => r.id === selectedRamo)?.nombre : undefined,
              fuente: 'Presupuesto de Egresos de la Federación 2026'
            }}
          />
        </div>
      </div>
    </div>
  );
}
