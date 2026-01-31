'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    AlertCircle,
    TrendingDown,
    TrendingUp,
    PieChart,
    ShieldAlert,
    ExternalLink,
    ChevronRight,
    Search,
    Info,
    History,
    Target,
    LucideIcon,
    Loader2
} from 'lucide-react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';
import { useBudgetData } from '@/hooks/useBudgetData';
import Link from 'next/link';

// BUDGET_TOTAL, SANKEY_DATA y STRATEGIC_PROJECTS removidos - ahora se consumen via useBudgetData

// TREEMAP_DATA removido - ahora se genera dinámicamente dentro del componente

export default function BudgetVigilante() {
    const [activeView, setActiveView] = useState<'flow' | 'map'>('flow');
    const { data, loading } = useBudgetData();

    const sankeyData = useMemo(() => {
        if (!data) return null;
        return {
            nodes: [
                { name: 'Tus Impuestos', id: 'total', color: '#00A896' },
                { name: 'Pagos Obligatorios', id: 'comprometido', color: '#EF4444' },
                { name: 'Dinero para la Gente', id: 'programable', color: '#4F46E5' },
                { name: 'Intereses de Deudas', id: 'deuda', color: '#EF4444' },
                { name: 'Dinero para Estados', id: 'participaciones', color: '#EF4444' },
                { name: 'Salud y Medicinas', id: 'salud', color: '#10B981' },
                { name: 'Jubilados', id: 'jubilados', color: '#F29100' },
                { name: 'Apoyo Adultos Mayores', id: 'bienestar', color: '#F29100' },
                { name: 'Sembrando Vida', id: 'sembrando', color: '#10B981' },
                { name: 'Jóvenes Const. Futuro', id: 'jovenes', color: '#10B981' },
                { name: 'Obra Pública / Construcción', id: 'inversion', color: '#00A896' },
                { name: 'Sueldos y Oficinas', id: 'operacion', color: '#1E293B' }
            ],
            links: data.sankey_data.links
        };
    }, [data]);

    const treemapData = useMemo(() => {
        if (!data) return null;
        return {
            name: "Inversión Total",
            children: [
                {
                    name: `Proyectos Estratégicos (${data.strategic_projects.length})`,
                    children: data.strategic_projects.map((p: any) => ({
                        ...p,
                        type: 'strategic'
                    }))
                },
                {
                    name: "Programas Locales (886)",
                    children: Array(886).fill(0).map((_, i) => ({
                        name: `Obra Local #${i + 1}`,
                        value: 650,
                        type: 'local',
                        description: "Escuelas, clínicas rurales, bacheo y caminos que dependen de los recursos restantes."
                    }))
                }
            ]
        };
    }, [data]);

    if (loading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020817]">
                <Loader2 className="w-16 h-16 text-[#00A896] animate-spin" />
            </div>
        );
    }

    const budgetTotalBillions = (data.budget_totals.grand_total / 1000000000000).toFixed(2);

    return (
        <section className="py-12 bg-[#020817] text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-[#00A896]/20 border border-[#00A896]/30 rounded-full text-[#00A896] text-[10px] font-black uppercase tracking-[0.2em]">
                                PEF 2026: Auditoría Ciudadana
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">
                            ¿A dónde van <span className="text-[#00A896]">Tus Impuestos?</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-medium">
                            El gobierno va a gastar <span className="text-white font-bold">${budgetTotalBillions} billones</span> este año.
                            Descubre si ese dinero se va a tu calle o a los megaproyectos de siempre.
                        </p>
                    </div>

                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <button
                            onClick={() => setActiveView('flow')}
                            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeView === 'flow' ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Activity className="w-4 h-4" />
                            EL FLUJO
                        </button>
                        <button
                            onClick={() => setActiveView('map')}
                            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeView === 'map' ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <PieChart className="w-4 h-4" />
                            EL MAPA
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeView === 'flow' ? (
                        <motion.div
                            key="flow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-6 md:p-12 relative overflow-hidden h-[800px]">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-[#00A896] rounded-full" />
                                    La Ruta del Dinero
                                </h3>
                                <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md z-10">
                                    <ShieldAlert className="w-4 h-4 text-[#00A896]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00A896]">PEF 2026 AUDITADO</span>
                                </div>

                                {/* Mobile Scroll Hint */}
                                <div className="md:hidden absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 text-white/70 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm animate-pulse">
                                        <ArrowRight className="w-3 h-3" />
                                        Desliza Horizontalmente
                                    </div>
                                </div>

                                {/* Scrollable Container */}
                                <div className="w-full h-full overflow-x-auto pb-8 custom-scrollbar">
                                    <div className="min-w-[800px] h-full">
                                        <SankeyChart data={sankeyData} totalBudget={data.budget_totals.grand_total / 1000000} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <OjoCriticoCard
                                    title="Visión de Estado"
                                    value="2.5%"
                                    status="alert"
                                    description="Países como Corea o Singapur despegaron invirtiendo +4% en ciencia y conectividad. En México, el 2.5% federal se concentra en cemento de megaproyectos, dejando casi nada para el futuro digital y el talento."
                                    criticalQuestion="¿Estamos construyendo un México con internet en cada rincón y logística de clase mundial, o solo estamos manteniendo el pasado?"
                                />
                                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8">
                                    <div className="flex items-center gap-3 mb-6 text-red-500">
                                        <AlertCircle className="w-6 h-6" />
                                        <span className="font-black text-sm uppercase tracking-widest">Alerta de Recorte</span>
                                    </div>
                                    <h4 className="text-2xl font-black mb-2 italic text-white">Menos dinero para Medicinas: -4.7%</h4>
                                    <p className="text-gray-400 font-medium leading-relaxed">
                                        Este año habrá menos presupuesto para salud. Traducción: Es más probable que no encuentres medicinas en la clínica o que las citas tarden aún más. No es estadística, es tu salud.
                                    </p>
                                    <a
                                        href="https://www.ppef.hacienda.gob.mx/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-8 flex items-center gap-3 text-[#00A896] font-black text-sm uppercase tracking-widest group"
                                    >
                                        Ver en PEF 2026
                                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                                <div className="bg-[#004B57] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            <Target className="w-5 h-5 text-[#00A896]" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A896]">Programas Sociales</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Bienestar Adultos</span>
                                            <span className="text-sm font-black text-[#00A896]">$482,000 M</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Sembrando Vida</span>
                                            <span className="text-sm font-black text-[#00A896]">$38,900 M</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold">Jóvenes Const. Futuro</span>
                                            <span className="text-sm font-black text-[#00A896]">$24,200 M</span>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-[11px] text-white/50 leading-relaxed font-medium">
                                        *Montos extraídos de la Fuente Única de Verdad ({data.meta.version}).
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            <div className="lg:col-span-9 bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden min-h-[900px]">
                                <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-[#F29100] rounded-full" />
                                    Mapa de la Desigualdad
                                </h3>
                                <p className="text-gray-400 mb-8 max-w-2xl font-medium">
                                    Contrasta los <span className="text-white font-bold">13 megaproyectos</span> frente al <span className="text-red-500 font-bold">reparto gotera</span>: miles de programas locales con presupuestos mínimos.
                                </p>
                                <TreemapChart data={treemapData} />
                            </div>

                            <div className="lg:col-span-3 space-y-6">
                                <div className="bg-[#00A896]/10 border border-[#00A896]/30 rounded-[32px] p-8">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00A896] mb-4">Gasto de Desarrollo (🟢)</span>
                                    <div className="space-y-4">
                                        <RubroItem label="Innovación" value={`${data.indicators.innovation_gdp}%`} tooltip="Invertimos la mitad de lo que deberíamos para dejar de comprar tecnología de fuera." />
                                        <RubroItem label="Educación" value={`${data.indicators.education_budget_share}%`} />
                                        <RubroItem label="Construcción" value={`${data.indicators.infrastructure_gdp}%`} tooltip="Cada peso aquí es una obra que nos ayuda a producir más y movernos más rápido." />
                                    </div>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-[32px] p-8">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-4">Gasto Inerte (🔴)</span>
                                    <div className="space-y-4">
                                        <RubroItem
                                            label="Gasto Operativo (Burocracia)"
                                            value={`${data.indicators.bureaucracy_budget_share}%`}
                                            tooltip={OPPORTUNITY_COSTS.burocracia}
                                        />
                                        <RubroItem
                                            label="Subsidios a Pérdidas (Pemex/CFE)"
                                            value={`${data.indicators.state_rescues_share}%`}
                                            tooltip={OPPORTUNITY_COSTS.rescates}
                                        />
                                        <RubroItem
                                            label="Concentración Regional (Centro)"
                                            value="51.4%"
                                            tooltip={OPPORTUNITY_COSTS.concentracion}
                                        />
                                        <RubroItem
                                            label="Concentración en 13 Obras"
                                            value={`${data.strategic_projects_concentration.share_of_investment}%`}
                                            tooltip={OPPORTUNITY_COSTS.gotera}
                                        />
                                    </div>
                                </div>
                                <Link
                                    href="/inteligencia-de-contratos"
                                    className="block w-full bg-[#00A896] hover:bg-[#008c7d] text-white p-6 rounded-[32px] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80 mb-1">
                                                <Search className="w-3 h-3" />
                                                Vigilancia 2026
                                            </div>
                                            <div className="text-xl font-black leading-tight">
                                                ¿Quién recibe<br />estos contratos?
                                            </div>
                                        </div>
                                        <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                                            <ChevronRight className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-xs font-medium text-white/90">
                                        Audita a las empresas ganadoras
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section >
    );
}

function RubroItem({ label, value, tooltip }: { label: string, value: string, tooltip?: string }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            className="flex justify-between items-center group cursor-pointer relative py-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{label}</span>
            <span className="text-sm font-black tabular-nums">{value}</span>
            <AnimatePresence>
                {isHovered && tooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-[calc(100%+20px)] top-0 w-64 p-4 bg-[#004B57] border border-[#00A896]/30 rounded-2xl shadow-2xl z-50 pointer-events-none"
                    >
                        <p className="text-[11px] font-bold text-white leading-relaxed">
                            {tooltip}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const OPPORTUNITY_COSTS = {
    burocracia: "Son sueldos, oficinas y papelería. NO es inversión. Cada peso aquí es un peso que no se usa para medicinas.",
    rescates: "Dinero 'quemado' para pagar deudas de PEMEX y CFE. No genera luz más barata, solo cubre pérdidas financieras.",
    concentracion: "El 51% del presupuesto se gasta en solo 3 estados (CDMX, Tabasco, Campeche). El resto del país recibe las sobras.",
    gotera: "El 42.3% de toda la inversión del país se va a solo 13 megaproyectos. Los otros 886 proyectos locales se pelean por migajas."
};

function OjoCriticoCard({ title, value, description, criticalQuestion, status }: any) {
    return (
        <div className="bg-[#004B57] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-xl">
                    <ShieldAlert className="w-5 h-5 text-[#00A896]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A896]">Ojo Crítico</span>
            </div>
            <div className="mb-6">
                <div className="text-6xl font-black mb-1">{value}</div>
                <div className="text-sm font-black text-[#00A896] uppercase tracking-widest">{title}</div>
            </div>
            <p className="text-white/80 font-medium leading-relaxed mb-6 italic">
                "{description}"
            </p>
            <div className="pt-6 border-t border-white/10">
                <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-[#00A896] mt-1 flex-shrink-0" />
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Pregunta Crítica:</span>
                        <p className="text-sm font-bold text-white leading-relaxed">
                            {criticalQuestion}
                        </p>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#00A896]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </div>
    );
}

// --- SUBCOMPONENTES DE D3 ---

function SankeyChart({ data, totalBudget }: any) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const width = 800;
        const height = 700; // Aumentado para dar oxígeno

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const generator = sankey()
            .nodeWidth(12)
            .nodePadding(35) // Más espacio entre nodos
            .extent([[1, 1], [width - 1, height - 1]])
            .nodeId((d: any) => d.id)
            .nodeAlign(sankeyCenter);

        const { nodes, links } = generator({
            nodes: data.nodes.map((d: any) => ({ ...d })),
            links: data.links.map((d: any) => ({ ...d }))
        });

        // Dibujar links
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.15)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke", (d: any) => d.source.color || "#4F46E5")
            .attr("stroke-width", (d: any) => Math.max(1, d.width))
            .on("mouseenter", function () { d3.select(this).attr("stroke-opacity", 0.5); })
            .on("mouseleave", function () { d3.select(this).attr("stroke-opacity", 0.15); });

        // Dibujar nodos
        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`);

        node.append("rect")
            .attr("height", (d: any) => d.y1 - d.y0)
            .attr("width", (d: any) => d.x1 - d.x0)
            .attr("fill", (d: any) => d.color)
            .attr("rx", 4);

        node.append("text")
            .attr("x", (d: any) => d.x0 < width / 2 ? 18 : -10)
            .attr("y", (d: any) => (d.y1 - d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", (d: any) => d.x0 < width / 2 ? "start" : "end")
            .attr("fill", "#fff")
            .each(function (d: any) {
                const el = d3.select(this);
                const perc = ((d.value / totalBudget) * 100).toFixed(1);
                const billions = (d.value / 1000000).toFixed(2);

                el.append("tspan")
                    .attr("font-size", "14px")
                    .attr("font-weight", "900")
                    .text(d.name);

                el.append("tspan")
                    .attr("x", d.x0 < width / 2 ? 18 : -10)
                    .attr("dy", "1.4em")
                    .attr("font-size", "12px")
                    .attr("font-weight", "800")
                    .attr("fill", "#00A896")
                    .text(`${((d.value / totalBudget) * 100).toFixed(1)}%`);
            });

    }, [data]);

    return (
        <div className="w-full h-full">
            <svg ref={svgRef} viewBox="0 0 800 700" preserveAspectRatio="xMidYMid meet" className="w-full h-full" />
        </div>
    );
}

function TreemapChart({ data }: any) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const width = 1000;
        const height = 800; // Escala vertical aumentada

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value! - a.value!);

        d3.treemap()
            .size([width, height])
            .paddingInner(4)
            .paddingOuter(4)
            (root);

        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`);

        // Paleta táctica ampliada para proyectos específicos
        const strategicColors = [
            '#00A896', // Teal Innovación
            '#7C3AED', // Violeta PEMEX
            '#F59E0B', // Ambar CFE
            '#EF4444', // Rojo Trenes
            '#3B82F6', // Azul Seguridad
            '#10B981', // Esmeralda Aduanas
            '#F97316', // Naranja Carreteras
            '#84CC16', // Lima Riego
            '#6366F1', // Indigo Interoceánico
            '#EC4899', // Rosa Sistema Salud
            '#14B8A6', // Turquesa Aeropuertos
            '#F43F5E', // Rose Infra Urbana
            '#06B6D4'  // Cyan puertos
        ];

        leaf.append("rect")
            .attr("width", (d: any) => Math.max(0, d.x1 - d.x0))
            .attr("height", (d: any) => Math.max(0, d.y1 - d.y0))
            .attr("fill", (d: any) => {
                if (d.data.type === 'strategic') {
                    // Gradiente visual basado en el índice para romper la monotonía
                    const index = d.parent.children.indexOf(d);
                    return strategicColors[index % strategicColors.length];
                }
                return '#1E293B'; // Gasto 'gotera' en gris oscuro tecnológico
            })
            .attr("stroke", (d: any) => d.data.type === 'strategic' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)')
            .attr("stroke-width", 1)
            .attr("rx", (d: any) => d.data.type === 'strategic' ? 8 : 2)
            .style("transition", "all 0.3s")
            .on("mouseenter", function (event, d: any) {
                d3.select(this)
                    .attr("fill-opacity", 0.8)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 2);

                const tooltip = d3.select("#treemap-tooltip");
                tooltip.style("opacity", 1);
                d3.select("#tt-title").text(d.data.name);
                d3.select("#tt-desc").text(d.data.description);
            })
            .on("mousemove", function (event) {
                d3.select("#treemap-tooltip")
                    .style("left", (event.layerX + 20) + "px")
                    .style("top", (event.layerY - 20) + "px");
            })
            .on("mouseleave", function (event, d: any) {
                d3.select(this)
                    .attr("fill-opacity", 1)
                    .attr("stroke", d.data.type === 'strategic' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)')
                    .attr("stroke-width", 1);

                d3.select("#treemap-tooltip").style("opacity", 0);
            });

        // Tipografía Adaptativa y Jerárquica
        leaf.filter((d: any) => (d.x1 - d.x0) > 60 && (d.y1 - d.y0) > 30)
            .append("text")
            .attr("x", 8)
            .attr("y", 20)
            .attr("fill", "#fff")
            .style("font-size", (d: any) => {
                const area = (d.x1 - d.x0) * (d.y1 - d.y0);
                if (area > 50000) return "16px";
                if (area > 20000) return "13px";
                return "11px";
            })
            .style("font-weight", "900")
            .style("text-transform", "uppercase")
            .style("letter-spacing", "0.02em")
            .style("pointer-events", "none")
            .each(function (d: any) {
                const el = d3.select(this);
                const words = d.data.name.split(/\s+/);
                const totalInversion = 976800;
                const perc = ((d.value / totalInversion) * 100).toFixed(1);
                const label = d.data.type === 'strategic' ? `${d.data.name} (${perc}%)` : d.data.name;

                if (words.length > 2 && (d.x1 - d.x0) < 150 && d.data.type === 'strategic') {
                    el.text("");
                    words.forEach((word: string, i: number) => {
                        el.append("tspan")
                            .attr("x", 8)
                            .attr("dy", i === 0 ? 0 : "1.2em")
                            .text(i === words.length - 1 ? `${word} (${perc}%)` : word);
                    });
                } else {
                    el.text(label);
                }
            });

        leaf.filter((d: any) => (d.x1 - d.x0) > 120 && (d.y1 - d.y0) > 100)
            .append("text")
            .attr("x", 8)
            .attr("y", (d: any) => (d.y1 - d.y0) - 12)
            .attr("fill", "rgba(255,255,255,0.4)")
            .style("font-size", "8px")
            .style("font-weight", "700")
            .style("pointer-events", "none")
            .text("BLOQUE ESTRATÉGICO");

    }, [data]);

    return (
        <div className="w-full h-full min-h-[800px] bg-[#020817]/50 rounded-[32px] p-4 border border-white/5 relative shadow-inner group/treemap">
            <svg ref={svgRef} viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" className="w-full h-full drop-shadow-2xl" />

            {/* Tooltip Dinámico Simple */}
            <div id="treemap-tooltip" className="absolute opacity-0 pointer-events-none bg-[#004B57] border border-[#00A896]/30 p-4 rounded-2xl shadow-2xl z-50 text-white max-w-[200px]">
                <div id="tt-title" className="font-black text-xs uppercase mb-1" />
                <div id="tt-desc" className="text-[10px] text-white/70" />
            </div>

            <div className="absolute bottom-6 right-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#00A896] rounded-sm" />
                    Prioritarios
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#1E293B] rounded-sm" />
                    'Gotera' Local
                </div>
            </div>
        </div>
    );
}
