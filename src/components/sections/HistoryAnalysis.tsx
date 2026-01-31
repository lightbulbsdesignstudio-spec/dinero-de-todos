'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Search,
    ChevronRight,
    Info,
    History,
    Target,
    Plane
} from 'lucide-react';
import * as d3 from 'd3';

// --- DATASET HISTÓRICO (2011-2026) ---
interface DataPoint {
    year: number;
    innovacion: number;
    educacion: number;
    salud: number;
    infraestructura: number;
    burocracia: number;
}

const HISTORICAL_DATA: DataPoint[] = [
    { year: 2011, innovacion: 0.35, educacion: 3.8, salud: 2.8, infraestructura: 2.9, burocracia: 12.5 },
    { year: 2012, innovacion: 0.38, educacion: 3.9, salud: 2.9, infraestructura: 3.1, burocracia: 12.2 },
    { year: 2013, innovacion: 0.42, educacion: 4.0, salud: 3.0, infraestructura: 3.0, burocracia: 12.0 },
    { year: 2014, innovacion: 0.48, educacion: 4.1, salud: 3.0, infraestructura: 2.9, burocracia: 11.8 },
    { year: 2015, innovacion: 0.50, educacion: 4.1, salud: 3.1, infraestructura: 2.8, burocracia: 11.5 },
    { year: 2016, innovacion: 0.49, educacion: 4.0, salud: 3.1, infraestructura: 2.7, burocracia: 11.3 },
    { year: 2017, innovacion: 0.47, educacion: 3.9, salud: 3.0, infraestructura: 2.6, burocracia: 11.0 },
    { year: 2018, innovacion: 0.45, educacion: 3.8, salud: 2.9, infraestructura: 2.5, burocracia: 10.8 },
    { year: 2019, innovacion: 0.43, educacion: 3.7, salud: 2.8, infraestructura: 2.4, burocracia: 10.6 },
    { year: 2020, innovacion: 0.42, educacion: 3.6, salud: 2.7, infraestructura: 2.3, burocracia: 10.5 },
    { year: 2021, innovacion: 0.41, educacion: 3.5, salud: 2.8, infraestructura: 2.4, burocracia: 10.4 },
    { year: 2022, innovacion: 0.40, educacion: 3.4, salud: 3.0, infraestructura: 2.5, burocracia: 10.2 },
    { year: 2023, innovacion: 0.40, educacion: 3.3, salud: 3.1, infraestructura: 2.4, burocracia: 10.1 },
    { year: 2024, innovacion: 0.40, educacion: 3.2, salud: 3.0, infraestructura: 2.3, burocracia: 10.0 },
    { year: 2025, innovacion: 0.40, educacion: 3.2, salud: 2.8, infraestructura: 2.1, burocracia: 10.0 },
    { year: 2026, innovacion: 0.40, educacion: 3.2, salud: 2.5, infraestructura: 2.1, burocracia: 10.0 }
];

const RUBROS = [
    { id: 'innovacion' as keyof DataPoint, label: 'Innovación', color: '#00A896', target: 4.5, unit: '%' },
    { id: 'educacion' as keyof DataPoint, label: 'Educación', color: '#4F46E5', target: 15.0, unit: '%' },
    { id: 'salud' as keyof DataPoint, label: 'Salud', color: '#EF4444', target: 20.0, unit: '%' },
    { id: 'infraestructura' as keyof DataPoint, label: 'Infraestructura para el desarrollo económico', color: '#004B57', target: 10.0, unit: '%' },
    { id: 'burocracia' as keyof DataPoint, label: 'Costo de la burocracia', color: '#F29100', target: 5.0, unit: '%', inverse: true }
];

export default function HistoryAnalysis() {
    const [selectedYear, setSelectedYear] = useState(2026);
    const [activeRubro, setActiveRubro] = useState<keyof DataPoint>('innovacion');

    const currentData = useMemo(() =>
        HISTORICAL_DATA.find(d => d.year === selectedYear) || HISTORICAL_DATA[0]
        , [selectedYear]);

    const rubroInfo = useMemo(() =>
        RUBROS.find(r => r.id === activeRubro) || RUBROS[0]
        , [activeRubro]);


    return (
        <section id="gasto-gobierno" className="py-24 bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-[#004B57] mb-6 tracking-tight">
                        ¿Cómo ha gastado <span className="text-[#00A896]">el Gobierno?</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                        Radiografía histórica del presupuesto mexicano (2011-2026).
                        Desliza el tiempo para ver cómo ha cambiado nuestra prioridad nacional.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Panel de Control y Métricas */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-8">
                                <div className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                    Año Seleccionado
                                </div>
                                <div className="p-3 bg-[#004B57]/5 rounded-2xl">
                                    <History className="w-6 h-6 text-[#004B57]" />
                                </div>
                            </div>

                            <motion.div
                                key={selectedYear}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-7xl font-black text-[#004B57] tracking-tighter mb-4"
                            >
                                {selectedYear}
                            </motion.div>

                            <div className="space-y-4">
                                {RUBROS.map(rubro => (
                                    <button
                                        key={rubro.id}
                                        onClick={() => setActiveRubro(rubro.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${activeRubro === rubro.id
                                            ? 'bg-[#004B57] text-white shadow-lg scale-[1.02]'
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: activeRubro === rubro.id ? '#FFF' : rubro.color }}
                                            />
                                            <span className="text-sm font-bold truncate max-w-[150px]">{rubro.label}</span>
                                        </div>
                                        <span className="text-sm font-black underline decoration-2 decoration-[#00A896]">
                                            {currentData[rubro.id as keyof typeof currentData]}{rubro.unit}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Carrusel de Narrativa Simplificada */}
                        <SimplifiedNarrativeCarousel activeRubro={activeRubro} />
                    </div>

                    {/* Visualización Principal */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Gráfico de Área */}
                        <div className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 flex-1 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-[#004B57]">Evolución: {rubroInfo.label}</h3>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <Target className="w-4 h-4 text-[#00A896]" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        Meta Ideal: <span className="text-[#00A896]">{rubroInfo.target}%</span>
                                    </span>
                                </div>
                            </div>

                            <div className="h-[300px] w-full relative">
                                <HistoryChart
                                    data={HISTORICAL_DATA}
                                    activeRubro={activeRubro}
                                    selectedYear={selectedYear}
                                    color={rubroInfo.color}
                                />
                            </div>

                            {/* Slider de Tiempo Táctil */}
                            <div className="mt-12 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[12px] font-black text-gray-400 uppercase tracking-widest px-2">
                                        <span>2011</span>
                                        <span>2026</span>
                                    </div>
                                    <div className="relative group px-1">
                                        <input
                                            type="range"
                                            min="2011"
                                            max="2026"
                                            step="1"
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                            className="w-full h-8 bg-transparent appearance-none cursor-pointer focus:outline-none"
                                            style={{
                                                WebkitAppearance: 'none'
                                            }}
                                        />
                                        {/* Custom Slider Styling via CSS below */}
                                        <style jsx>{`
                                            input[type=range]::-webkit-slider-runnable-track {
                                                width: 100%;
                                                height: 12px;
                                                background: #f1f5f9;
                                                border-radius: 6px;
                                                border: 1px solid #e2e8f0;
                                            }
                                            input[type=range]::-webkit-slider-thumb {
                                                -webkit-appearance: none;
                                                height: 28px;
                                                width: 28px;
                                                border-radius: 50%;
                                                background: #004B57;
                                                border: 4px solid #fff;
                                                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                                                cursor: pointer;
                                                margin-top: -9px;
                                                transition: all 0.2s;
                                            }
                                            input[type=range]:active::-webkit-slider-thumb {
                                                transform: scale(1.2);
                                                background: #00A896;
                                            }
                                        `}</style>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-center md:justify-start">
                                    <a href="/vigilancia-2026" className="group inline-flex items-center gap-3 bg-[#00A896] hover:bg-[#008f80] text-white px-8 py-4 rounded-[20px] font-black text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] uppercase tracking-widest">
                                        Vigilemos el Presupuesto 2026
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> {/* Cierre del grid */}

            </div> {/* Cierre del container max-w-7xl */}
        </section>
    );
}

// --- CARRUSEL DE NARRATIVA SIMPLIFICADA ---
function SimplifiedNarrativeCarousel({ activeRubro }: { activeRubro: keyof DataPoint }) {
    const narratives = useMemo(() => [
        {
            id: 'infraestructura',
            title: 'Goteras en el Techo',
            text: "En 2012 arreglábamos calles en todo el país. Hoy casi todo se va a 3 estados. Es como pintar la sala cuando el techo de toda la casa tiene goteras.",
            icon: <Plane className="w-5 h-5 text-[#00A896]" />,
            color: '#004B57'
        },
        {
            id: 'burocracia',
            title: 'La Factura del Papeleo',
            text: "De cada 100 pesos, 10 se van en papeleo y oficinas. La meta son 5. Esos 5 pesos extra son las medicinas que hoy faltan en tu clínica.",
            icon: <AlertCircle className="w-5 h-5 text-[#F29100]" />,
            color: '#F29100'
        },
        {
            id: 'innovacion',
            title: 'Soluciones para México',
            text: "Invertimos 0.4% en innovación. No es para inventar lo que ya existe, sino para usar la tecnología que hoy tenemos y encontrar soluciones reales a los retos de nuestro país.",
            icon: <Search className="w-5 h-5 text-[#00A896]" />,
            color: '#00A896'
        },
        {
            id: 'educacion',
            title: 'La Mochila Vacía',
            text: "Hace 10 años dábamos 4 pesos a las escuelas. Hoy apenas 3. Estamos quitando herramientas a los niños que mañana tendrán que trabajar.",
            icon: <TrendingUp className="w-5 h-5 text-[#4F46E5]" />,
            color: '#4F46E5'
        },
        {
            id: 'salud',
            title: 'Médicos de Guardia',
            text: "El presupuesto de salud bajará de 3.1% a 2.5% para 2026. Imagina que hoy hay 3 médicos en tu clínica, pero mañana solo quedarán 2.",
            icon: <Target className="w-5 h-5 text-[#EF4444]" />,
            color: '#EF4444'
        }
    ], []);

    // Encontrar el índice del rubro activo para priorizarlo en el carrusel
    const activeIndex = useMemo(() =>
        narratives.findIndex(n => n.id === activeRubro) || 0
        , [activeRubro, narratives]);

    const [currentIndex, setCurrentIndex] = useState(activeIndex);

    useEffect(() => {
        setCurrentIndex(activeIndex);
    }, [activeIndex]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % narratives.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + narratives.length) % narratives.length);

    return (
        <div className="relative group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-[#004B57] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden h-[300px] flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-xl">
                                {narratives[currentIndex].icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A896]">
                                Ojo Crítico: {narratives[currentIndex].title}
                            </span>
                        </div>
                        <p className="text-xl font-bold leading-relaxed italic opacity-95">
                            "{narratives[currentIndex].text}"
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                        <div className="flex gap-1">
                            {narratives.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-[#00A896]' : 'w-2 bg-white/20'}`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={prev}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 rotate-180" />
                            </button>
                            <button
                                onClick={next}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#00A896]/10 rounded-full blur-2xl" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Subcomponente para el gráfico con D3 (SVG)
function HistoryChart({ data, activeRubro, selectedYear, color }: any) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([2011, 2026])
        .range([0, width]);

    const maxValue = d3.max(data, (d: any) => d[activeRubro] as number) || 10;
    const yScale = d3.scaleLinear()
        .domain([0, maxValue * 1.2])
        .range([height, 0]);

    const areaBuilder = d3.area<any>()
        .x(d => xScale(d.year))
        .y0(height)
        .y1(d => yScale(d[activeRubro]))
        .curve(d3.curveMonotoneX);

    const lineBuilder = d3.line<any>()
        .x(d => xScale(d.year))
        .y(d => yScale(d[activeRubro]))
        .curve(d3.curveMonotoneX);

    const areaPath = areaBuilder(data) || '';
    const linePath = lineBuilder(data) || '';

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}
            preserveAspectRatio="none"
        >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Grids horizontales */}
                {[0, 0.25, 0.5, 0.75, 1].map(t => (
                    <line
                        key={t}
                        x1={0}
                        x2={width}
                        y1={yScale(maxValue * 1.2 * t)}
                        y2={yScale(maxValue * 1.2 * t)}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                    />
                ))}

                {/* Área con gradiente */}
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={areaPath}
                    fill="url(#areaGradient)"
                />

                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Indicador de año seleccionado */}
                <motion.line
                    animate={{ x1: xScale(selectedYear), x2: xScale(selectedYear) }}
                    y1={0}
                    y2={height}
                    stroke="#004B57"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <motion.circle
                    animate={{ cx: xScale(selectedYear), cy: yScale(data.find((d: any) => d.year === selectedYear)[activeRubro]) }}
                    r="8"
                    fill="#004B57"
                    stroke="#fff"
                    strokeWidth="3"
                    className="shadow-lg"
                />
            </g>
        </svg>
    );
}
