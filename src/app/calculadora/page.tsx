'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calculator, Wallet, PieChart, ShieldCheck, Info, ChevronRight, ArrowRight } from 'lucide-react';
import { StatCard, NumeroHumano } from '@/components/ui';
import { calcularISRAnual, distribuirImpuestoPorRamos } from '@/lib/fiscal';
import { getPresupuestoRamos, RamoPresupuesto } from '@/lib/api/presupuesto';
import { formatCurrency } from '@/lib/utils';
import { humanizarNumero } from '@/lib/humanizar';

export default function CalculadoraFiscalPage() {
  const [ingresoMensual, setIngresoMensual] = useState<number>(25000);
  const [ramos, setRamos] = useState<RamoPresupuesto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos reales del presupuesto para la distribución
  useEffect(() => {
    async function loadBudget() {
      try {
        const data = await getPresupuestoRamos();
        setRamos(data);
      } catch (error) {
        console.error('Error cargando ramos para calculadora:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBudget();
  }, []);

  const ingresoAnual = ingresoMensual * 12;
  const isrAnual = useMemo(() => calcularISRAnual(ingresoAnual), [ingresoAnual]);
  const isrMensual = isrAnual / 12;

  const tasaEfectiva = ingresoAnual > 0 ? (isrAnual / ingresoAnual) * 100 : 0;
  const sueldoNetoMensual = ingresoMensual - isrMensual;

  const contribucionPorRamo = useMemo(() => {
    if (ramos.length === 0) return [];
    return distribuirImpuestoPorRamos(isrAnual, ramos);
  }, [isrAnual, ramos]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Preparando auditoría fiscal 2026...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero / Header */}
      <div className="bg-gradient-to-br from-[#004B57] to-[#01353d] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Calculator className="absolute -right-20 -bottom-20 w-96 h-96 rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00A896]/20 rounded-full text-[#00A896] text-sm font-bold mb-6 border border-[#00A896]/30">
              <ShieldCheck className="w-4 h-4" />
              Auditoría Matemática de Coherencia 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              ¿Cuánto de <span className="text-[#F29100]">TU</span> dinero <br />
              mueve a México?
            </h1>
            <p className="text-xl text-white/70 font-medium mb-8">
              Calcula tu contribución real y observa exactamente cómo se reparte tu ISR entre la salud, educación y seguridad del país.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Input Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-premium p-8 border border-gray-100 flex flex-col h-full">
              <h2 className="text-xl font-bold text-[#004B57] mb-8 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-[#00A896]" />
                Tus Ingresos
              </h2>

              <div className="space-y-8 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Ingreso Mensual Bruto (MXN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">$</span>
                    <input
                      type="number"
                      value={ingresoMensual}
                      onChange={(e) => setIngresoMensual(Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00A896] focus:bg-white rounded-2xl py-6 pl-12 pr-6 text-4xl font-black text-[#004B57] transition-all outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="1000"
                    value={ingresoMensual}
                    onChange={(e) => setIngresoMensual(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer mt-8 accent-[#00A896]"
                  />
                  <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                    <span>$5k</span>
                    <span>$100k</span>
                    <span>$200k+</span>
                  </div>
                </div>

                <div className="bg-[#004B57]/5 rounded-2xl p-6 border border-[#004B57]/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-bold">Tu Sueldo Neto Mensual</span>
                    <span className="text-2xl font-black text-[#00A896]">{formatCurrency(sueldoNetoMensual)}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00A896] h-full"
                      style={{ width: `${100 - tasaEfectiva}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 italic">
                    * Estimación basada en tablas ISR 2025-2026 vigentes. No incluye deducciones adicionales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="bg-white rounded-3xl shadow-premium p-8 border border-gray-100 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Contribución Anual</p>
                  <h3 className="text-5xl font-black text-[#004B57]">{formatCurrency(isrAnual)}</h3>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Tasa Efectiva</span>
                    <span className="font-black text-[#F29100]">{tasaEfectiva.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#00A896] rounded-3xl shadow-premium p-8 text-white flex flex-col justify-between">
                <div>
                  <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">Tu Esfuerzo Mensual</p>
                  <h3 className="text-5xl font-black text-white">{formatCurrency(isrMensual)}</h3>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 text-white/80 text-sm font-medium">
                  Este dinero alimenta hoy los servicios públicos de todo México.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Table */}
        <div className="mt-12 bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#004B57]">Tu Dinero en Acción</h2>
              <p className="text-gray-500 font-medium">Así se distribuyen tus {formatCurrency(isrAnual)} anuales según el Presupuesto Federal 2026</p>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-[#F29100] w-[15%]"></div>
              </div>
              <span className="text-[#F29100] font-bold text-sm">Proporción PEF 2026 Real</span>
            </div>
            <div className="flex items-center gap-2 bg-[#F29100]/10 px-4 py-2 rounded-xl border border-[#F29100]/20">
              <PieChart className="w-5 h-5 text-[#F29100]" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9FA] border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Sector de Gasto</th>
                  <th className="text-center py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Porcentaje</th>
                  <th className="text-right py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Tu Contribución Anual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contribucionPorRamo.slice(0, 10).map((ramo, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-[#00A896]/10 group-hover:bg-[#00A896] transition-all rounded-full" />
                        <div>
                          <p className="font-bold text-[#004B57]">{ramo.nombre}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Ramo Presupuestal</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-gray-600">
                        {ramo.porcentaje.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <p className="text-xl font-black text-[#004B57]">{formatCurrency(ramo.monto)}</p>
                      <p className="text-xs text-[#00A896] font-bold">Inversión Ciudadana</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-gray-50 text-center">
            <a href="/presupuesto" className="inline-flex items-center gap-2 text-[#00A896] font-black hover:gap-3 transition-all">
              Ver desglose completo de auditoría <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
