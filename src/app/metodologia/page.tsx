'use client';

import { ShieldCheck, FileText, Download, AlertTriangle, Scale, Target, ExternalLink } from 'lucide-react';
import { FUENTES } from '@/data/fuentes';
import Link from 'next/link';
import { humanizarNumero } from '@/lib/humanizar';

export default function MetodologiaPage() {
  // Collect all relevant sources
  const officialSources = [
    ...FUENTES.presupuesto_federal,
    ...FUENTES.obras_publicas,
    ...FUENTES.ingresos_federacion
  ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i && v.tipo === 'oficial');

  const handleDownload = async () => {
    try {
      // Import data dynamically to avoid bundling issues if large, though master json is small.
      const data = await import('@/data/pef_2026_master.json');
      const blob = new Blob([JSON.stringify(data.default, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pef_2026_master.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error('Error downloading data', e);
      alert('Error al descargar los datos. Intente más tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* 1. Hero Section */}
      <div className="bg-[#0F172A] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00A896]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-bold tracking-widest uppercase mb-6 text-[#00A896]">
            <ShieldCheck className="w-4 h-4" />
            Transparencia Radical
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Cuentas Claras
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            No somos un partido, somos datos. Aquí explicamos de dónde sale cada número.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 space-y-16">

        {/* 2. The Evidence Locker (Fuentes Oficiales) */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#00A896]" />
            The Evidence Locker
          </h2>
          <div className="grid gap-4">
            {officialSources.slice(0, 5).map((source) => (
              <div key={source.id} className="group p-4 border border-gray-100 rounded-xl hover:border-[#00A896]/30 hover:bg-[#00A896]/5 transition-all flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{source.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-2">{source.descripcion}</p>
                  <div className="flex gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    <span>{source.formato}</span>
                    <span>•</span>
                    <span>{source.fechaConsulta || source.fechaPublicacion}</span>
                  </div>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-50 rounded-lg group-hover:bg-white text-gray-400 group-hover:text-[#00A896] transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Black Box Open (Algoritmo) */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-4">¿Por qué una empresa sale en Rojo?</h3>
            <p className="text-gray-600 leading-relaxed">
              No es opinión, es matemática. Una empresa recibe alerta roja si:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3 text-sm text-gray-700">
                <span className="text-red-500 font-bold">•</span>
                Su RFC aparece en la lista del 69-B del SAT (Empresas Fantasma).
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <span className="text-red-500 font-bold">•</span>
                Se creó menos de 6 meses antes de recibir un contrato millonario.
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <span className="text-red-500 font-bold">•</span>
                Tiene domicilio fiscal en una zona residencial o lote baldío verificado.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-4">¿Cómo medimos la concentración?</h3>
            <p className="text-gray-600 leading-relaxed">
              Analizamos la equidad del gasto regional:
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl font-mono text-xs text-gray-600 border border-gray-200">
              (Suma de 13 Proyectos Estratégicos) / (Inversión Física Total del PEF)
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Si el resultado es mayor al 40%, consideramos que hay una <strong className="text-gray-800">Alta Concentración de Riesgo</strong>, ya que se descuidan otras necesidades de infraestructura básica en el resto del país.
            </p>
          </div>
        </div>

        {/* 4. Open Data Download */}
        <div className="bg-[#00A896] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <Download className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-black mb-4">Tus Datos, Tu Derecho</h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
              No escondemos nada. Descarga la base de datos maestra completa (JSON) tal cual la usa este sitio web. Audita nuestro trabajo.
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#004B57] rounded-xl font-bold hover:bg-gray-100 transition-transform active:scale-95 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Descargar Base de Datos (.JSON)
            </button>
          </div>
          {/* Decorative pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        </div>

        {/* 5. Manifesto */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-6 border border-gray-100">
            <Target className="w-8 h-8 text-gray-900" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Nuestro Lente</h3>
          <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-3xl mx-auto leading-relaxed">
            "No auditamos regiones, auditamos <span className="text-[#00A896] font-bold">Rentabilidad Social</span>. Creemos que cada peso gastado debe tener un análisis técnico que garantice crecimiento económico para el país, sin importar dónde se invierta."
          </p>
        </div>

      </div>
    </div>
  );
}
