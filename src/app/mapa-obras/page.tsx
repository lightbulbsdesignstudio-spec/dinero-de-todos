'use client';

import { useBudgetData } from '@/hooks/useBudgetData';
import InteractiveMap from '@/components/ui/InteractiveMap';
import { useMemo } from 'react';
import { ArrowLeft, Info, Map as MapIcon } from 'lucide-react';
import Link from 'next/link';
import { humanizarNumero } from '@/lib/humanizar';

export default function MapaObrasPage() {
  const { data, loading } = useBudgetData();

  const mapPoints = useMemo(() => {
    if (!data) return [];
    return data.strategic_projects
      .filter(p => p.coordinates) // Only those with coords
      .map(p => ({
        name: p.name,
        value: p.value,
        description: p.description,
        lat: p.coordinates!.lat,
        lng: p.coordinates!.lng
      }));
  }, [data]);

  const totalInvestment = useMemo(() => {
    if (!mapPoints.length) return 0;
    return mapPoints.reduce((acc, curr) => acc + curr.value, 0);
  }, [mapPoints]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header / Nav */}
      <div className="bg-white border-b border-gray-200 z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <MapIcon className="w-6 h-6 text-[#00A896]" />
                  Territorio de Inversión
                </h1>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Georreferenciación de Proyectos Estratégicos 2026
                </p>
              </div>
            </div>

            <div className="hidden md:block text-right">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Inversión Mapeada</span>
              <span className="text-2xl font-black text-[#00A896]">
                {totalInvestment > 0 ? `$${humanizarNumero(totalInvestment).textoCorto}` : '---'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Map */}
      <div className="flex-1 relative p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col">
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-xl flex-1 relative overflow-hidden min-h-[600px]">
          {mapPoints.length > 0 ? (
            <InteractiveMap points={mapPoints} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <p>No hay datos geográficos disponibles.</p>
            </div>
          )}

          {/* Overlay Legend */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur border border-gray-100 p-4 rounded-2xl shadow-lg max-w-xs z-[400] pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">¿Cómo leerlo?</span>
            </div>
            <p className="text-xs text-gray-600 leading-snug">
              El tamaño de cada <span className="text-[#00A896] font-bold">burbuja</span> indica la cantidad de presupuesto asignado.
              Las zonas con burbujas más grandes reciben mayor inversión prioritaria.
            </p>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-sky-50 border border-sky-100 rounded-2xl max-w-3xl mx-auto">
          <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-sky-800 leading-relaxed font-medium">
            Nota: El Pacto Fiscal existe para apoyar a regiones rezagadas, y eso es positivo. Lo que auditamos aquí es que ese apoyo se invierta en proyectos productivos con análisis técnico que generen riqueza real a largo plazo, no en obras sin justificación de crecimiento.
          </p>
        </div>
      </div>
    </div>
  );
}
