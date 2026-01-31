'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Wallet,
  GitBranch,
  Search,
  Map,
  TrendingUp,
  Users,
  Building,
  Clock,
  Info,
  ChevronRight
} from 'lucide-react';
import { StatCard, FeatureCard, NumeroHumano } from '@/components/ui';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { humanizarNumero } from '@/lib/humanizar';
import CivicNudge, {
  generarNudgePositivo,
  ProgresoCivico,
  LOGROS_CIVICOS
} from '@/components/ui/CivicNudge';
import { RamoPresupuesto, ResumenPresupuesto } from '@/lib/api/presupuesto';
import LandingHero from '@/components/sections/LandingHero';
import CountryCards from '@/components/sections/CountryCards';
import HistoryAnalysis from '@/components/sections/HistoryAnalysis';

export default function HomePage() {
  const [ramosData, setRamosData] = useState<RamoPresupuesto[]>([]);
  const [resumen, setResumen] = useState<ResumenPresupuesto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/presupuesto');
        const result = await response.json();
        if (result.success) {
          setRamosData(result.data.ramos || []);
          setResumen(result.data.resumen || null);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalAprobado = resumen?.totalAprobado || 0;
  const totalEjercido = resumen?.totalEjercido || 0;
  const porcentajeEjecucion = calculatePercentage(totalEjercido, totalAprobado);

  const nudgeEjercicio = useMemo(() =>
    generarNudgePositivo({
      tipo: 'gasto',
      valor: totalEjercido,
      maximo: totalAprobado
    }), [totalEjercido, totalAprobado]
  );

  const [logros, setLogros] = useState(LOGROS_CIVICOS);

  useEffect(() => {
    setLogros(prev => prev.map(l =>
      l.id === 'primera-visita' ? { ...l, completado: true } : l
    ));
  }, []);


  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Section - Dinero de Todos Redesign */}
      <LandingHero totalAprobado={totalAprobado} />

      {/* Country Comparison - La Receta del Futuro */}
      <CountryCards />
    </div>
  );
}
