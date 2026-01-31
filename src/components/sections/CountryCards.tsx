'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Trophy,
    AlertTriangle,
    ExternalLink,
    ChevronRight,
    MousePointerClick,
    Search,
    GitBranch
} from 'lucide-react';

interface CountryData {
    name: string;
    score: number;
    status: 'winning' | 'trailing';
    breakdown: {
        label: string;
        percentage: string;
        value: number; // 0-10 for the progress bar
    }[];
    sources: {
        label: string;
        url: string;
    }[];
}

const COUNTRIES: CountryData[] = [
    {
        name: 'Corea del Sur',
        score: 9.8,
        status: 'winning',
        breakdown: [
            { label: 'Dinero para Innovación', percentage: '4.8%', value: 9.8 },
            { label: 'Educación para el Futuro', percentage: '18.5%', value: 9.5 },
            { label: 'Salud', percentage: '19.2%', value: 9.2 },
            { label: 'Infraestructura Enfocada en Desarrollo Económico', percentage: '11.2%', value: 9.9 },
            { label: 'Costo de Papeleo', percentage: '2.5%', value: 2.1 },
        ],
        sources: [
            { label: 'OCDE Data', url: 'https://data.oecd.org/' },
            { label: 'World Bank', url: 'https://data.worldbank.org/' },
        ]
    },
    {
        name: 'Singapur',
        score: 9.5,
        status: 'winning',
        breakdown: [
            { label: 'Dinero para Innovación', percentage: '4.4%', value: 9.4 },
            { label: 'Educación para el Futuro', percentage: '19.8%', value: 9.8 },
            { label: 'Salud', percentage: '15.5%', value: 9.0 },
            { label: 'Infraestructura Enfocada en Desarrollo Económico', percentage: '12.4%', value: 9.7 },
            { label: 'Costo de Papeleo', percentage: '1.8%', value: 1.5 },
        ],
        sources: [
            { label: 'FMI Social', url: 'https://www.imf.org/en/Data' },
            { label: 'UNESCO Education', url: 'https://uis.unesco.org/' },
        ]
    },
    {
        name: 'Argentina',
        score: 4.2,
        status: 'trailing',
        breakdown: [
            { label: 'Dinero para Innovación', percentage: '0.6%', value: 3.1 },
            { label: 'Educación para el Futuro', percentage: '6.2%', value: 5.2 },
            { label: 'Salud', percentage: '11.8%', value: 4.8 },
            { label: 'Infraestructura Enfocada en Desarrollo Económico', percentage: '3.1%', value: 4.0 },
            { label: 'Costo de Papeleo', percentage: '7.8%', value: 8.5 },
        ],
        sources: [
            { label: 'OCDE Profiles', url: 'https://www.oecd.org/en/countries/argentina.html' },
            { label: 'World Bank Data', url: 'https://data.worldbank.org/country/AR' },
        ]
    },
    {
        name: 'Nigeria',
        score: 3.5,
        status: 'trailing',
        breakdown: [
            { label: 'Dinero para Innovación', percentage: '0.2%', value: 2.5 },
            { label: 'Educación para el Futuro', percentage: '5.1%', value: 4.1 },
            { label: 'Salud', percentage: '4.8%', value: 3.8 },
            { label: 'Infraestructura Enfocada en Desarrollo Económico', percentage: '2.1%', value: 3.2 },
            { label: 'Costo de Papeleo', percentage: '9.2%', value: 9.2 },
        ],
        sources: [
            { label: 'FMI Data', url: 'https://www.imf.org/en/Countries/NGA' },
            { label: 'UNESCO Stats', url: 'http://uis.unesco.org/en/country/ng' },
        ]
    }
];

export default function CountryCards() {
    return (
        <section id="la-receta" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-[#004B57] mb-6 tracking-tight">
                        La Receta del Futuro <br />
                        <span className="text-[#00A896]">¿Cómo vamos vs el mundo?</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                        Comparamos a México con los líderes mundiales y con los que se están quedando atrás.
                        Calificaciones en escala del 0 al 10 basadas en inversión estratégica.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {COUNTRIES.map((country) => (
                        <FlipCard key={country.name} country={country} />
                    ))}
                </div>
                <div className="mt-24 mb-12 flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link
                        href="/mexico"
                        className="group inline-flex items-center gap-4 bg-gradient-to-r from-[#00A896] to-[#008f80] text-white px-12 py-5 rounded-[24px] font-black text-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    >
                        ¿Cómo va México?
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">
                        Análisis ciudadano del presupuesto nacional
                    </p>
                </div>
            </div>
        </section>
    );
}

function FlipCard({ country }: { country: any }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const getStatusIcon = (status: 'winning' | 'trailing') => {
        if (status === 'winning') {
            return { icon: Trophy, color: 'text-[#F29100]' };
        }
        return { icon: AlertTriangle, color: 'text-red-500' };
    };

    const { icon: StatusIcon, color: statusColor } = getStatusIcon(country.status);

    return (
        <div className="group h-[540px]" style={{ perspective: '1000px' }}>
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
                    className="absolute inset-0 bg-white rounded-[32px] shadow-xl p-8 border border-gray-100 flex flex-col"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        zIndex: isFlipped ? 0 : 1
                    }}
                >
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-black text-[#004B57]">{country.name}</h3>
                        <StatusIcon className={`w-8 h-8 ${statusColor}`} />
                    </div>

                    <div className="mb-10">
                        <div className="text-6xl font-black text-[#004B57] tracking-[0.05em] mb-2">
                            {country.score}
                        </div>
                        <div className="text-[11px] font-bold text-[#00A896]/70 uppercase tracking-[0.2em] ml-1">
                            Calificación País
                        </div>
                    </div>

                    <div className="space-y-5 flex-1 mt-2">
                        {country.breakdown.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-1.5 focus:outline-none">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.05em] leading-none">
                                        {item.label}
                                    </span>
                                    <div className={`text-[12px] font-black tabular-nums tracking-[0.1em] leading-none ${country.status === 'winning' ? 'text-[#00A896]' : 'text-red-500'
                                        }`}>
                                        {item.percentage}
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${country.status === 'winning' ? 'bg-[#00A896]' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${item.value * 10}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 bg-[#004B57] rounded-[32px] shadow-2xl p-8 border border-white/10 flex flex-col text-white"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        zIndex: isFlipped ? 1 : 0
                    }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <ExternalLink className="w-6 h-6 text-[#00A896]" />
                        </div>
                        <h3 className="text-2xl font-black">Fuentes Oficiales</h3>
                    </div>

                    <div className="space-y-4 flex-1">
                        {country.sources.map((source: any, idx: number) => (
                            <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00A896]/50 transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#00A896] uppercase tracking-widest mb-1">
                                        Proveedor de Datos
                                    </span>
                                    <span className="font-bold text-base tracking-tight">{source.label}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/30 group-hover/link:text-[#00A896] group-hover/link:translate-x-1 transition-all" />
                            </a>
                        ))}
                    </div>

                    <div className="mt-8 text-center bg-black/20 p-4 rounded-xl">
                        <p className="text-[10px] text-white/50 font-medium leading-relaxed italic">
                            * Los datos internacionales provienen de reportes consolidados 2024-2025.
                            La comparativa es proporcional al PIB por habitante.
                        </p>
                    </div>
                </div>
            </div>

            {/* Control Label - External to card for better UX */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="group flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00A896]/50 transition-all font-sans"
                >
                    <MousePointerClick className={`w-4 h-4 text-gray-400 group-hover:text-[#00A896] transition-transform ${isFlipped ? 'rotate-180' : ''}`} />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#004B57]">
                        {isFlipped ? 'Ver Indicadores' : 'Fuentes Oficiales'}
                    </span>
                </button>
            </div>
        </div>
    );
}
