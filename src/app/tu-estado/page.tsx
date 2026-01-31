'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, AlertTriangle, Info, MapPin, Loader2 } from 'lucide-react';
import { useBudgetData } from '@/hooks/useBudgetData';
import { evaluarEquidad, Estado } from '@/lib/fiscal';
import { formatCurrency } from '@/lib/utils';
import { humanizarNumero } from '@/lib/humanizar';
import ActionTrigger from '@/components/ui/ActionTrigger';
import SourceLink from '@/components/ui/SourceLink';
import { FUENTES } from '@/data/fuentes';

type SortField = 'nombre' | 'totalFederal' | 'perCapita' | 'pobrezaPorcentaje';
type SortOrder = 'asc' | 'desc';

export default function TuEstadoPage() {
  const { data, loading } = useBudgetData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<Estado | null>(null);
  const [sortField, setSortField] = useState<SortField>('totalFederal');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const estadosFiltrados = useMemo(() => {
    if (!data) return [];
    const estados: Estado[] = data.state_finances.estados;
    return estados
      .filter(e => e.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const multiplier = sortOrder === 'desc' ? -1 : 1;
        if (sortField === 'nombre') {
          return multiplier * a.nombre.localeCompare(b.nombre);
        }
        return multiplier * (a[sortField as keyof Estado] as number - (b[sortField as keyof Estado] as number));
      });
  }, [data, searchTerm, sortField, sortOrder]);

  const totalNacional = useMemo(() =>
    data ? data.state_finances.estados.reduce((sum, e) => sum + e.totalFederal, 0) : 0,
    [data]
  );

  const promedioNacionalPerCapita = data?.state_finances.promedio_nacional_per_capita || 0;

  // Análisis de equidad - estados que necesitan más
  const estadosConProblemas = useMemo(() =>
    data ? data.state_finances.estados.filter(e => evaluarEquidad(e, promedioNacionalPerCapita).categoria === 'necesita_mas') : [],
    [data, promedioNacionalPerCapita]
  );

  // Estados ordenados por per cápita
  const estadoMasRecibe = useMemo(() =>
    data ? [...data.state_finances.estados].sort((a, b) => b.perCapita - a.perCapita)[0] : null,
    [data]
  );
  const estadoMenosRecibe = useMemo(() =>
    data ? [...data.state_finances.estados].sort((a, b) => a.perCapita - b.perCapita)[0] : null,
    [data]
  );

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#10B981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#004B57] to-[#003540] text-white  relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2">
            ¿Cuánto dinero recibe tu estado?
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            El gobierno federal reparte {humanizarNumero(totalNacional).texto} entre los 32 estados.
            Aquí puedes ver cuánto le toca a cada uno y si es equitativo.
          </p>
        </div>
      </div>

      {/* Explicación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">¿Por qué es importante?</p>
              <p className="mb-2">
                El dinero federal se divide en dos tipos:
              </p>
              <ul className="space-y-1 ml-4">
                <li><strong>Participaciones:</strong> El gobernador decide cómo gastarlo</li>
                <li><strong>Aportaciones:</strong> Solo puede usarse en educación, salud o infraestructura</li>
              </ul>
              <p className="mt-2">
                La fórmula de reparto considera población, pobreza y recaudación local.
                Pero... ¿realmente llega más a quien más lo necesita?
              </p>
            </div>
          </div>
        </div>

        {/* Resumen rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#00A896]/10 rounded-xl border border-[#00A896]/30 p-5">
            <p className="text-sm text-[#004B57] mb-1">Promedio nacional por habitante</p>
            <p className="text-2xl font-bold text-[#004B57]">
              ${Math.round(promedioNacionalPerCapita).toLocaleString('es-MX')}
            </p>
            <p className="text-sm text-[#00A896]">al año por cada persona</p>
          </div>
          {estadoMasRecibe && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Estado que más recibe por habitante</p>
              <p className="text-2xl font-bold text-[#00A896]">
                {estadoMasRecibe.nombre}
              </p>
              <p className="text-sm text-gray-500">
                ${estadoMasRecibe.perCapita.toLocaleString('es-MX')} por persona
              </p>
            </div>
          )}
          {estadoMenosRecibe && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Estado que menos recibe por habitante</p>
              <p className="text-2xl font-bold text-red-600">
                {estadoMenosRecibe.nombre}
              </p>
              <p className="text-sm text-gray-500">
                ${estadoMenosRecibe.perCapita.toLocaleString('es-MX')} por persona
              </p>
            </div>
          )}
        </div>

        {/* Alerta de equidad */}
        {estadosConProblemas.length > 0 && (
          <button
            onClick={() => setMostrarAnalisis(!mostrarAnalisis)}
            className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">
                  {estadosConProblemas.length} estados con alta pobreza reciben menos de ${Math.round(promedioNacionalPerCapita).toLocaleString('es-MX')} por habitante (el promedio)
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {estadosConProblemas.map(e => e.nombre).join(', ')}
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  {mostrarAnalisis ? 'Ocultar análisis' : 'Ver análisis detallado →'}
                </p>
              </div>
            </div>
          </button>
        )}

        {/* Análisis expandido */}
        {mostrarAnalisis && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">¿Por qué algunos estados reciben menos?</h3>

            {/* Explicación del promedio */}
            <div className="bg-[#00A896]/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-[#004B57]">
                <strong>Referencia: El promedio nacional es ${Math.round(promedioNacionalPerCapita).toLocaleString('es-MX')} por habitante al año.</strong>
              </p>
            </div>

            <p className="text-gray-600 mb-4">
              La fórmula de distribución considera población, recaudación local y otros factores.
              Sin embargo, algunos estados con <strong>alta pobreza reciben menos del promedio</strong>,
              lo que podría indicar que la fórmula no compensa suficientemente las necesidades sociales:
            </p>
            <div className="space-y-3">
              {estadosConProblemas.map(estado => {
                const eval_ = evaluarEquidad(estado, promedioNacionalPerCapita);
                return (
                  <div key={estado.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{estado.nombre}</p>
                        <p className="text-sm text-gray-600 mt-1">{eval_.explicacion}</p>
                      </div>
                      <div className="text-right text-sm flex-shrink-0 ml-4">
                        <p className="text-red-600 font-semibold">{estado.pobrezaPorcentaje}% pobreza</p>
                        <p className="text-gray-500">${estado.perCapita.toLocaleString('es-MX')}/hab</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-white/60 rounded text-sm text-gray-600">
                      <strong>¿Por qué importa?</strong> {eval_.razon}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota importante:</strong> Esto no significa que la fórmula sea incorrecta.
                La Ley de Coordinación Fiscal balancea múltiples factores. Sin embargo, estos datos
                invitan a reflexionar sobre si la distribución actual responde a las necesidades reales.
              </p>
            </div>
          </div>
        )}

        {/* Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Busca tu estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Leyenda visual */}
        <div className="flex flex-wrap items-center gap-6 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-[#00A896]/100 rounded-full" />
            <span>Arriba del promedio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gray-400 rounded-full" />
            <span>Cerca del promedio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-amber-500 rounded-full" />
            <span>Debajo del promedio</span>
          </div>
          <div className="text-gray-400">|</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-red-500 rounded-full" />
            <span>Pobreza alta (&gt;50%)</span>
          </div>
        </div>

        {/* Tabla de estados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-4">
                    <button
                      onClick={() => handleSort('nombre')}
                      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#00A896]"
                    >
                      Estado
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right py-4 px-4">
                    <button
                      onClick={() => handleSort('totalFederal')}
                      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#00A896] ml-auto"
                    >
                      Total federal
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right py-4 px-4">
                    <button
                      onClick={() => handleSort('perCapita')}
                      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#00A896] ml-auto"
                    >
                      Por persona
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right py-4 px-4">
                    <button
                      onClick={() => handleSort('pobrezaPorcentaje')}
                      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#00A896] ml-auto"
                    >
                      Pobreza
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-4">
                    <span className="font-semibold text-gray-700">Comparación</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {estadosFiltrados.map((estado) => {
                  const eval_ = evaluarEquidad(estado, promedioNacionalPerCapita);
                  const isSelected = selectedEstado?.id === estado.id;

                  return (
                    <tr
                      key={estado.id}
                      onClick={() => setSelectedEstado(isSelected ? null : estado)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#00A896]/10' : 'hover:bg-gray-50'
                        }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{estado.nombre}</p>
                            <p className="text-xs text-gray-500">
                              {(estado.poblacion / 1_000_000).toFixed(1)}M habitantes
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-semibold text-gray-900 tabular-nums">
                          {humanizarNumero(estado.totalFederal).texto}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* Barra visual */}
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <div
                              className={`h-full rounded-full transition-all ${estado.perCapita > promedioNacionalPerCapita
                                ? 'bg-[#00A896]/100'
                                : estado.perCapita < promedioNacionalPerCapita * 0.9
                                  ? 'bg-amber-500'
                                  : 'bg-gray-400'
                                }`}
                              style={{
                                width: `${Math.min((estado.perCapita / 35000) * 100, 100)}%`
                              }}
                            />
                          </div>
                          {/* Número */}
                          <div className="text-right flex-1">
                            <p className={`font-semibold tabular-nums ${estado.perCapita > promedioNacionalPerCapita
                              ? 'text-[#00A896]'
                              : 'text-gray-900'
                              }`}>
                              ${estado.perCapita.toLocaleString('es-MX')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {estado.perCapita > promedioNacionalPerCapita ? '+' : ''}
                              {Math.round(((estado.perCapita / promedioNacionalPerCapita) - 1) * 100)}% vs promedio
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* Barra visual de pobreza */}
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <div
                              className={`h-full rounded-full ${estado.pobrezaPorcentaje > 50 ? 'bg-red-500' :
                                estado.pobrezaPorcentaje > 35 ? 'bg-amber-500' :
                                  'bg-[#00A896]/100'
                                }`}
                              style={{ width: `${estado.pobrezaPorcentaje}%` }}
                            />
                          </div>
                          <p className={`font-semibold tabular-nums text-right ${estado.pobrezaPorcentaje > 50 ? 'text-red-600' :
                            estado.pobrezaPorcentaje > 35 ? 'text-amber-600' :
                              'text-gray-900'
                            }`}>
                            {estado.pobrezaPorcentaje}%
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium"
                          style={{ backgroundColor: `${eval_.color}15`, color: eval_.color }}
                        >
                          <span>{eval_.icono}</span>
                          <span>{eval_.etiqueta}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detalle del estado seleccionado */}
        {selectedEstado && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedEstado.nombre}</h2>
                <p className="text-gray-500">
                  {(selectedEstado.poblacion / 1_000_000).toFixed(1)} millones de habitantes
                </p>
              </div>
              <button
                onClick={() => setSelectedEstado(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participaciones */}
              <div className="p-4 bg-teal-50 rounded-xl">
                <h3 className="font-semibold text-teal-800 mb-2">
                  Participaciones (uso libre)
                </h3>
                <p className="text-3xl font-bold text-teal-700 tabular-nums">
                  {humanizarNumero(selectedEstado.participaciones).texto}
                </p>
                <p className="text-sm text-teal-600 mt-1">
                  ${selectedEstado.perCapitaParticipaciones.toLocaleString('es-MX')} por persona
                </p>
                <p className="text-xs text-teal-600 mt-2">
                  El gobernador decide en qué gastarlo
                </p>
              </div>

              {/* Aportaciones */}
              <div className="p-4 bg-orange-50 rounded-xl">
                <h3 className="font-semibold text-orange-800 mb-2">
                  Aportaciones (uso etiquetado)
                </h3>
                <p className="text-3xl font-bold text-orange-700 tabular-nums">
                  {humanizarNumero(selectedEstado.aportaciones).texto}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  ${selectedEstado.perCapitaAportaciones.toLocaleString('es-MX')} por persona
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Solo para educación, salud e infraestructura
                </p>
              </div>
            </div>

            {/* Evaluación con explicación completa */}
            {(() => {
              const eval_ = evaluarEquidad(selectedEstado, promedioNacionalPerCapita);
              return (
                <div className="mt-6 p-5 rounded-xl border-2" style={{
                  backgroundColor: `${eval_.color}08`,
                  borderColor: `${eval_.color}30`
                }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{eval_.icono}</span>
                    <div>
                      <p className="font-bold text-lg" style={{ color: eval_.color }}>
                        {eval_.etiqueta}
                      </p>
                      <p className="text-gray-700 mt-1">
                        {eval_.explicacion}
                      </p>
                    </div>
                  </div>

                  {/* Razón/explicación detallada */}
                  <div className="mt-4 p-4 bg-white/60 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">¿Por qué?</p>
                    <p className="text-sm text-gray-600">
                      {eval_.razon}
                    </p>
                  </div>

                  {/* Contexto adicional */}
                  <div className="mt-4 text-xs text-gray-500">
                    <p>
                      <strong>Promedio nacional:</strong> ${Math.round(promedioNacionalPerCapita).toLocaleString('es-MX')} por habitante al año
                    </p>
                    <p>
                      <strong>Este estado:</strong> ${selectedEstado.perCapita.toLocaleString('es-MX')} por habitante al año
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Acción ciudadana */}
        <div className="mt-8">
          <ActionTrigger
            contexto={{
              seccion: 'Distribución de recursos por estado',
              elemento: selectedEstado?.nombre,
              valor: selectedEstado ? `$${selectedEstado.perCapita.toLocaleString('es-MX')} por habitante` : undefined,
              fuente: 'Ley de Coordinación Fiscal / SHCP'
            }}
          />
        </div>

        {/* Trazabilidad de fuentes */}
        <div className="mt-6">
          <SourceLink
            variant="detailed"
            fuentes={[
              ...FUENTES.participaciones_estados,
              ...FUENTES.pobreza_estados,
              ...FUENTES.poblacion,
              ...FUENTES.datos_demo
            ]}
          />
        </div>
      </div>
    </div>
  );
}
