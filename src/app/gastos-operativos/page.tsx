'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Plane, Search, AlertTriangle,
  Coffee, Droplets, Calendar, BarChart3,
  ArrowUpRight, ArrowDownRight, Target, History,
  ChevronRight, ShieldAlert, TrendingUp, GitBranch
} from 'lucide-react';
import { humanizarNumero, humanizarRamo } from '@/lib/humanizar';
import ActionTrigger from '@/components/ui/ActionTrigger';
import OjoCriticoWidget from '@/components/ui/OjoCriticoWidget';
import RitmoMensualChart from '@/components/charts/RitmoMensualChart';
import MobilitySankeyChart from '@/components/charts/MobilitySankeyChart';
import { ViaticoResumen } from '@/lib/api/viaticos';
import { formatCurrency } from '@/lib/utils';

type ViewMode = 'grid' | 'timeline' | 'sankey';

export default function GastosOperativosPage() {
  const [busqueda, setBusqueda] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [viaticosReales, setViaticosReales] = useState<ViaticoResumen[]>([]);
  const [totalGlobalPEF, setTotalGlobalPEF] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/viaticos');
        const result = await response.json();
        if (result.success && result.data.viaticos) {
          setViaticosReales(result.data.viaticos);
          setTotalGlobalPEF(result.data.totalGlobalPEF || 9300000000000);
        }
      } catch (error) {
        console.error('Error cargando viáticos reales:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const viaticosFiltrados = useMemo(() => {
    return viaticosReales.filter(v =>
      v.dependencia.toLowerCase().includes(busqueda.toLowerCase()) ||
      humanizarRamo(v.dependencia).toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [viaticosReales, busqueda]);

  const totalMobility = useMemo(() =>
    viaticosReales.reduce((sum, v) => sum + v.monto, 0),
    [viaticosReales]
  );

  const pesoNacional = (totalMobility / (totalGlobalPEF || 9300000000000)) * 100;

  // Preparar datos para RitmoMensualChart
  const datosMensuales = useMemo(() =>
    viaticosReales.slice(0, 10).map(v => ({
      dependencia: humanizarRamo(v.dependencia),
      mensual: v.mensual || Array(12).fill(v.monto / 12),
    })),
    [viaticosReales]
  );

  // Preparar datos para MobilitySankeyChart
  const datosSankey = useMemo(() =>
    viaticosReales.map(v => ({
      dependencia: humanizarRamo(v.dependencia),
      monto: v.monto,
      desglose: v.desglose,
    })),
    [viaticosReales]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F29100] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[#004B57] font-black text-xl tracking-tight">INTELIGENCIA FISCAL 2026</p>
          <p className="text-gray-400 font-medium mt-2">Calculando impacto vs. Presupuesto Nacional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Premium Header - World Class Brand Style */}
      <div className="bg-gradient-to-br from-[#004B57] via-[#002d35] to-black text-white relative overflow-hidden pb-40 pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00A896]/10 rounded-full blur-[140px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F29100]/5 rounded-full blur-[120px] -ml-20 -mb-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white/80 text-sm font-bold mb-8">
                <Target className="w-4 h-4 text-[#F29100]" />
                Auditoría de Impacto Nacional
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
                El Peso de <br />
                <span className="text-gradient-premium">Moverse</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl">
                El gobierno gasta <strong>{formatCurrency(totalMobility)}</strong> en transportarse. Esto representa el <span className="text-[#F29100] font-black">{pesoNacional.toFixed(3)}%</span> del presupuesto nacional de México.
              </p>
            </div>

            <div className="glass-dark p-10 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Escala del Gasto</span>
                <History className="w-5 h-5 text-[#F29100]" />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-black text-white tabular-nums">{humanizarNumero(totalMobility).texto}</p>
                  <p className="text-white/40 text-sm font-medium mt-1">Gasto total en movilidad 2026</p>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-emerald-400 font-bold text-lg leading-tight">
                    {humanizarNumero(totalMobility).comparacion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controller Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
        <div className="bg-white rounded-3xl shadow-premium p-4 md:p-6 flex flex-col lg:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
            <input
              type="text"
              placeholder="¿Qué dependencia quieres fiscalizar? (ej: SEDENA, Salud, SEP)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-[#004B57] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#004B57] text-lg"
            />
          </div>
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-sm ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#004B57]' : 'text-gray-400'}`}
            >
              <BarChart3 className="w-4 h-4" /> Tarjetas
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-sm ${viewMode === 'timeline' ? 'bg-white shadow-sm text-[#004B57]' : 'text-gray-400'}`}
            >
              <Calendar className="w-4 h-4" /> Ritmo
            </button>
            <button
              onClick={() => setViewMode('sankey')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-sm ${viewMode === 'sankey' ? 'bg-white shadow-sm text-[#004B57]' : 'text-gray-400'}`}
            >
              <GitBranch className="w-4 h-4" /> Flujo
            </button>
          </div>
        </div>
      </div>

      {/* Global Insight Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#004B57]/5 rounded-3xl p-6 border border-[#004B57]/10 flex flex-wrap gap-8 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <AlertTriangle className="text-[#F29100] w-6 h-6" />
            </div>
            <div>
              <p className="text-[#004B57] font-black">Alerta de Variación</p>
              <p className="text-gray-500 text-sm font-medium">Hay {viaticosFiltrados.filter(v => v.variacionVsAnterior > 15).length} dependencias con aumentos superiores al 15%</p>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-200 hidden lg:block" />
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Peso Promedio en Movilidad</span>
            <span className="text-2xl font-black text-[#004B57]">{pesoNacional.toFixed(3)}%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

        {/* Vista: Tarjetas (Grid) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {viaticosFiltrados.map((item) => (
              <div key={item.id} className="bg-white rounded-[40px] shadow-premium p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className="flex items-start justify-between mb-8">
                  <div className="max-w-[70%]">
                    <h3 className="text-xl font-black text-[#004B57] leading-tight mb-2 group-hover:text-[#00A896] transition-colors">
                      {humanizarRamo(item.dependencia)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <div className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${item.variacionVsAnterior > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {item.variacionVsAnterior > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(item.variacionVsAnterior).toFixed(1)}% vs 2024
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {item.pesoPresupuestal.toFixed(2)}% de su presupuesto total
                      </div>
                    </div>
                  </div>
                  {/* Nivel de Alerta en lugar de Score opaco */}
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-colors ${item.pesoPresupuestal > 12 ? 'bg-red-50 border-red-100 text-red-700' :
                    item.pesoPresupuestal > 5 ? 'bg-amber-50 border-amber-100 text-amber-700' :
                      'bg-emerald-50 border-emerald-100 text-emerald-700'
                    }`}>
                    <div className="text-center">
                      <p className="text-[8px] font-bold uppercase leading-none mb-1 opacity-70">Riesgo</p>
                      <p className="text-[10px] font-black leading-none uppercase">
                        {item.pesoPresupuestal > 12 ? 'ALTO' :
                          item.pesoPresupuestal > 5 ? 'MEDIO' : 'BAJO'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col">
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Gasto en Operación y Viaje</span>
                    <span className="text-3xl font-black text-[#004B57] group-hover:text-[#F29100] transition-colors">{formatCurrency(item.monto)}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-gray-400">Impacto en Dependencia</span>
                      <span className={`${item.pesoPresupuestal > 0.5 ? 'text-red-500' : 'text-[#00A896]'}`}>
                        {item.pesoPresupuestal > 0.5 ? 'Gasto Elevado' : 'Eficiente'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full transition-all duration-1000 ${item.pesoPresupuestal > 0.5 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-[#00A896] to-emerald-400'
                          }`}
                        style={{ width: `${Math.min(item.pesoPresupuestal * 20, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50">
                    <div className="text-center">
                      <Plane className="w-4 h-4 text-blue-500 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Aviones</p>
                      <p className="text-xs font-black text-gray-900">{formatCurrency(item.desglose.vuelosYPasajes)}</p>
                    </div>
                    <div className="text-center border-x border-gray-50">
                      <Coffee className="w-4 h-4 text-orange-500 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Comidas</p>
                      <p className="text-xs font-black text-gray-900">{formatCurrency(item.desglose.comidasYHoteles)}</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="w-4 h-4 text-green-500 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Gasolina</p>
                      <p className="text-xs font-black text-gray-900">{formatCurrency(item.desglose.gasolinaYMovilidad)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shadow-sm" title="Historial"><History className="w-4 h-4 text-blue-500" /></div>
                    <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center shadow-sm" title="Auditoría"><ShieldAlert className="w-4 h-4 text-orange-500" /></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center shadow-sm" title="Tendencia"><TrendingUp className="w-4 h-4 text-emerald-500" /></div>
                  </div>
                  <button className="text-[#00A896] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1 group/btn">
                    Ver Inteligencia <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista: Timeline (Ritmo Mensual) */}
        {viewMode === 'timeline' && (
          <RitmoMensualChart
            data={datosMensuales}
            titulo="Ritmo Fiscal de Movilidad 2025"
          />
        )}

        {/* Vista: Sankey (Flujo de Recursos) */}
        {viewMode === 'sankey' && (
          <MobilitySankeyChart
            data={datosSankey}
            titulo="Flujo del Gasto en Movilidad"
            maxDependencias={10}
          />
        )}

        {/* Widget de Ojo Crítico - Análisis fiscalizador REAL */}
        <div className="mt-16">
          <OjoCriticoWidget
            dependencias={viaticosReales.slice(0, 20).map(v => ({
              nombre: humanizarRamo(v.dependencia),
              montoMovilidad: v.monto,
              presupuestoTotal: v.totalPresupuestoDependencia,
              pesoMovilidad: v.pesoPresupuestal,
              variacionAnual: v.variacionVsAnterior,
              desglose: {
                vuelos: v.desglose.vuelosYPasajes,
                comidas: v.desglose.comidasYHoteles,
                gasolina: v.desglose.gasolinaYMovilidad,
              },
            }))}
            totalMovilidad={totalMobility}
            totalPEF={totalGlobalPEF}
          />
        </div>

        {/* Action Trigger */}
        <div className="mt-16">
          <ActionTrigger
            contexto={{
              seccion: 'Auditoría de Movilidad Avanzada',
              elemento: `Gasto Total: ${formatCurrency(totalMobility)}`,
              valor: `${pesoNacional.toFixed(3)}% del Presupuesto Nacional`,
              fuente: 'Analítico de Ramos SHCP 2025-2026'
            }}
          />
        </div>
      </div>
    </div>
  );
}
