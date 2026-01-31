'use client';

import { useState } from 'react';
import {
    Flag,
    Trophy,
    AlertTriangle,
    ExternalLink,
    ChevronRight,
    MousePointerClick,
    Search,
    GitBranch,
    Info,
    Loader2
} from 'lucide-react';
import { useBudgetData } from '@/hooks/useBudgetData';

// MEXICO_DATA removido - ahora se consume via useBudgetData

export default function MexicoScore() {
    const { data, loading } = useBudgetData();

    if (loading || !data) {
        return (
            <div className="h-[400px] flex items-center justify-center bg-[#004B57]/5">
                <Loader2 className="w-12 h-12 text-[#004B57] animate-spin" />
            </div>
        );
    }

    const mexicoData = {
        name: 'México',
        score: data.indicators.national_score,
        breakdown: [
            { label: 'Dinero para Innovación', percentage: `${data.indicators.innovation_gdp}%`, value: data.indicators.innovation_gdp * 3 }, // Multiplicador visual
            { label: 'Salud', percentage: `${data.indicators.health_budget_share}%`, value: 4.8 },
            { label: 'Infraestructura', percentage: `${data.indicators.infrastructure_gdp}%`, value: 3.1 },
            { label: 'Educación', percentage: `${data.indicators.education_budget_share}%`, value: data.indicators.education_budget_share },
            { label: 'Costo de Papeleo', percentage: `${data.indicators.bureaucracy_budget_share}%`, value: data.indicators.bureaucracy_budget_share },
        ],
        sources: [
            { label: 'SHCP - Presupuesto de Egresos', url: data.meta.source_url },
            { label: 'INEGI - Gasto Público', url: 'https://www.inegi.org.mx/' },
            { label: 'Transparencia Presupuestaria', url: 'https://www.transparenciapresupuestaria.gob.mx/' }
        ]
    };

    return (
        <section id="mexico-score" className="py-24 bg-[#004B57]/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* Tarjeta de Datos - Columna Izquierda */}
                        <div className="lg:col-span-5 order-2 lg:order-1">
                            <MexicoFlipCard data={mexicoData} />
                        </div>

                        {/* Panel de Interpretación - Columna Derecha */}
                        <div className="lg:col-span-7 order-1 lg:order-2">
                            <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-white/60 shadow-sm">
                                <h2 className="text-3xl font-black text-[#004B57] mb-10 tracking-tight flex items-center gap-4">
                                    <div className="p-3 bg-[#004B57] text-white rounded-2xl">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    ¿Cómo leer esta tarjeta?
                                </h2>

                                <div className="space-y-10">
                                    <section className="space-y-3">
                                        <h3 className="text-lg font-black text-[#004B57] uppercase tracking-wider flex items-center gap-3">
                                            <span className="w-2 h-6 bg-[#00A896] rounded-full" />
                                            No buscamos ser Corea del Sur
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            El éxito no es copiar porcentajes de otros, sino dejar de gastar en cosas que no sirven.
                                            Un <span className="text-red-600 font-bold">{mexicoData.score}</span> significa que México está en modo <span className="italic font-bold">"supervivencia"</span>, no en modo <span className="italic font-bold">"desarrollo"</span>.
                                        </p>
                                    </section>

                                    <section className="space-y-3">
                                        <h3 className="text-lg font-black text-[#004B57] uppercase tracking-wider flex items-center gap-3">
                                            <span className="w-2 h-6 bg-[#F29100] rounded-full" />
                                            Ser "cliente" no es el problema
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            Está bien usar tecnología global. Lo que está mal es que el presupuesto de
                                            Innovación (<span className="text-[#00A896] font-bold">{mexicoData.breakdown[0].percentage}</span>) sea tan bajo que ni siquiera podamos aprovechar esas herramientas para resolver problemas locales.
                                        </p>
                                    </section>

                                    {/* ... rest of the sections remain same or can be updated but score/innovation are most critical ... */}
                                    <section className="space-y-3">
                                        <h3 className="text-lg font-black text-[#004B57] uppercase tracking-wider flex items-center gap-3">
                                            <span className="w-2 h-6 bg-[#004B57] rounded-full" />
                                            Infraestructura para el desarrollo
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            Hoy, la infraestructura representa solo el <span className="text-[#004B57] font-bold">{mexicoData.breakdown[2].percentage}</span> del PIB enfocado a proyectos estratégicos, mientras que la concentración extrema en pocas obras sigue siendo el reto.
                                        </p>
                                    </section>

                                    <section className="pt-6 border-t border-[#004B57]/10 space-y-4">
                                        <a
                                            href="/analisis-del-gasto"
                                            className="group flex items-center justify-between w-full p-6 bg-[#004B57] hover:bg-[#003842] text-white rounded-[24px] shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A896]">
                                                    Análisis Profundo
                                                </span>
                                                <span className="text-lg font-bold">
                                                    ¿Cómo ha gastado el país en los últimos 15 años?
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </a>

                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MexicoFlipCard({ data }: { data: any }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="group h-[640px]" style={{ perspective: '1000px' }}>
            <div
                className="relative w-full h-full duration-700 cursor-pointer"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100 flex flex-col"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        zIndex: isFlipped ? 0 : 1
                    }}
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#004B57]/10 flex items-center justify-center">
                                <Flag className="w-7 h-7 text-[#004B57]" />
                            </div>
                            <h3 className="text-3xl font-black text-[#004B57]">{data.name}</h3>
                        </div>
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <div className="mb-10">
                        <div className="text-7xl font-black text-[#004B57] tracking-[0.05em] mb-2">
                            {data.score}
                        </div>
                        <div className="text-[12px] font-bold text-[#00A896]/70 uppercase tracking-[0.3em] ml-1">
                            Calificación País
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 mt-2">
                        {data.breakdown.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] leading-none">
                                        {item.label}
                                    </span>
                                    <div className="text-[14px] font-black tabular-nums tracking-[0.1em] leading-none text-red-500">
                                        {item.percentage}
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 bg-red-500"
                                        style={{ width: `${item.value * 10}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 bg-[#004B57] rounded-[40px] shadow-2xl p-10 border border-white/10 flex flex-col text-white"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        zIndex: isFlipped ? 1 : 0
                    }}
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-white/10 rounded-[24px]">
                            <ExternalLink className="w-8 h-8 text-[#00A896]" />
                        </div>
                        <h3 className="text-3xl font-black">Fuentes Oficiales</h3>
                    </div>

                    <div className="space-y-5 flex-1">
                        {data.sources.map((source: any, idx: number) => (
                            <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link flex items-center justify-between p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00A896]/50 transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-[#00A896] uppercase tracking-widest mb-1">
                                        Transparencia MX
                                    </span>
                                    <span className="font-bold text-lg tracking-tight">{source.label}</span>
                                </div>
                                <ChevronRight className="w-6 h-6 text-white/30 group-hover/link:text-[#00A896] group-hover/link:translate-x-1 transition-all" />
                            </a>
                        ))}
                    </div>

                    <div className="mt-6 flex items-start gap-4 bg-white/5 border border-white/10 p-5 rounded-[24px]">
                        <div className="p-2 bg-[#00A896]/10 rounded-xl">
                            <Info className="w-4 h-4 text-[#00A896]" />
                        </div>
                        <div className="flex-1">
                            <span className="block text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mb-1">
                                Verificación Oficial PEF 2026
                            </span>
                            <p className="text-[10px] text-white/30 font-medium leading-relaxed">
                                Datos actualizados vía transparencia presupuestaria.
                                Comparativa histórica en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex justify-center">
                <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-white border border-gray-200 shadow-xl hover:shadow-2xl hover:border-[#00A896]/50 transition-all font-sans"
                >
                    <MousePointerClick className={`w-5 h-5 text-gray-400 group-hover:text-[#00A896] transition-transform ${isFlipped ? 'rotate-180' : ''}`} />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#004B57]">
                        {isFlipped ? 'Ver Indicadores' : 'Fuentes Oficiales'}
                    </span>
                </button>
            </div>
        </div>
    );
}
