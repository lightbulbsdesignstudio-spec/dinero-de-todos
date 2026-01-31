'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar, Zap } from 'lucide-react';

interface DependenciaMensual {
    dependencia: string;
    mensual: number[];
    color?: string;
}

interface RitmoMensualChartProps {
    data: DependenciaMensual[];
    titulo?: string;
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const TRIMESTRES = ['Q1', 'Q2', 'Q3', 'Q4'];

const COLORES_GRADIENTE = [
    '#004B57', '#00A896', '#F29100', '#3b82f6', '#8b5cf6',
    '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#6366f1'
];

export default function RitmoMensualChart({ data, titulo = 'Ritmo Fiscal 2025' }: RitmoMensualChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [vistaActiva, setVistaActiva] = useState<'mensual' | 'trimestral'>('mensual');
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        content: string;
    }>({ visible: false, x: 0, y: 0, content: '' });

    // Calcular totales mensuales
    const totalesMensuales = Array.from({ length: 12 }, (_, i) =>
        data.reduce((sum, dep) => sum + (dep.mensual[i] || 0), 0)
    );

    const totalGeneral = totalesMensuales.reduce((a, b) => a + b, 0);
    const mesMaximo = totalesMensuales.indexOf(Math.max(...totalesMensuales));
    const mesMinimo = totalesMensuales.indexOf(Math.min(...totalesMensuales));

    // Totales trimestrales
    const totalesTrimestrales = [
        totalesMensuales.slice(0, 3).reduce((a, b) => a + b, 0),
        totalesMensuales.slice(3, 6).reduce((a, b) => a + b, 0),
        totalesMensuales.slice(6, 9).reduce((a, b) => a + b, 0),
        totalesMensuales.slice(9, 12).reduce((a, b) => a + b, 0),
    ];

    useEffect(() => {
        if (!svgRef.current || !containerRef.current || data.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 350;
        const margin = { top: 30, right: 30, bottom: 50, left: 80 };

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        if (vistaActiva === 'mensual') {
            // Escala X para meses
            const xScale = d3.scaleBand()
                .domain(MESES)
                .range([0, innerWidth])
                .padding(0.2);

            // Escala Y
            const maxValue = Math.max(...totalesMensuales) * 1.1;
            const yScale = d3.scaleLinear()
                .domain([0, maxValue])
                .range([innerHeight, 0]);

            // Gradient definition
            const defs = svg.append('defs');
            const gradient = defs.append('linearGradient')
                .attr('id', 'barGradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');

            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#00A896');

            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#004B57');

            // Grid lines
            g.append('g')
                .attr('class', 'grid')
                .call(d3.axisLeft(yScale)
                    .ticks(5)
                    .tickSize(-innerWidth)
                    .tickFormat(() => '')
                )
                .selectAll('line')
                .attr('stroke', '#e5e7eb')
                .attr('stroke-dasharray', '3,3');

            g.selectAll('.grid path').attr('stroke', 'none');

            // Bars con animación
            g.selectAll('.bar')
                .data(totalesMensuales)
                .join('rect')
                .attr('class', 'bar')
                .attr('x', (_, i) => xScale(MESES[i]) || 0)
                .attr('y', innerHeight)
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .attr('fill', (_, i) => i === mesMaximo ? '#F29100' : i === mesMinimo ? '#ef4444' : 'url(#barGradient)')
                .attr('rx', 6)
                .style('cursor', 'pointer')
                .on('mouseenter', function (event, d) {
                    const i = totalesMensuales.indexOf(d);
                    d3.select(this).attr('opacity', 0.85);
                    setHoveredMonth(i);
                    const rect = container.getBoundingClientRect();
                    setTooltip({
                        visible: true,
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top - 10,
                        content: `${MESES[i]}: ${formatCurrency(d)}`
                    });
                })
                .on('mouseleave', function () {
                    d3.select(this).attr('opacity', 1);
                    setHoveredMonth(null);
                    setTooltip(prev => ({ ...prev, visible: false }));
                })
                .transition()
                .duration(800)
                .delay((_, i) => i * 50)
                .ease(d3.easeBackOut)
                .attr('y', d => yScale(d))
                .attr('height', d => innerHeight - yScale(d));

            // Línea de tendencia
            const line = d3.line<number>()
                .x((_, i) => (xScale(MESES[i]) || 0) + xScale.bandwidth() / 2)
                .y(d => yScale(d))
                .curve(d3.curveCatmullRom);

            g.append('path')
                .datum(totalesMensuales)
                .attr('fill', 'none')
                .attr('stroke', '#F29100')
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', '0')
                .attr('d', line)
                .attr('opacity', 0)
                .transition()
                .delay(600)
                .duration(500)
                .attr('opacity', 0.6);

            // Eje X
            g.append('g')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(d3.axisBottom(xScale))
                .selectAll('text')
                .attr('font-size', '12px')
                .attr('font-weight', '600')
                .attr('fill', '#6b7280');

            // Eje Y
            g.append('g')
                .call(d3.axisLeft(yScale)
                    .ticks(5)
                    .tickFormat(d => `$${(+d / 1_000_000).toFixed(0)}M`)
                )
                .selectAll('text')
                .attr('font-size', '11px')
                .attr('fill', '#9ca3af');

        } else {
            // Vista trimestral
            const xScale = d3.scaleBand()
                .domain(TRIMESTRES)
                .range([0, innerWidth])
                .padding(0.3);

            const maxValue = Math.max(...totalesTrimestrales) * 1.1;
            const yScale = d3.scaleLinear()
                .domain([0, maxValue])
                .range([innerHeight, 0]);

            // Gradient para trimestrales
            const defs = svg.append('defs');

            TRIMESTRES.forEach((q, i) => {
                const gradient = defs.append('linearGradient')
                    .attr('id', `q${i}Gradient`)
                    .attr('x1', '0%')
                    .attr('y1', '0%')
                    .attr('x2', '0%')
                    .attr('y2', '100%');

                gradient.append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', COLORES_GRADIENTE[i]);

                gradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', d3.color(COLORES_GRADIENTE[i])?.darker(1)?.toString() || '#000');
            });

            // Barras trimestrales
            g.selectAll('.bar')
                .data(totalesTrimestrales)
                .join('rect')
                .attr('class', 'bar')
                .attr('x', (_, i) => xScale(TRIMESTRES[i]) || 0)
                .attr('y', innerHeight)
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .attr('fill', (_, i) => `url(#q${i}Gradient)`)
                .attr('rx', 10)
                .style('cursor', 'pointer')
                .on('mouseenter', function (event, d) {
                    d3.select(this).attr('opacity', 0.85);
                    const rect = container.getBoundingClientRect();
                    const i = totalesTrimestrales.indexOf(d);
                    setTooltip({
                        visible: true,
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top - 10,
                        content: `${TRIMESTRES[i]}: ${formatCurrency(d)} (${((d / totalGeneral) * 100).toFixed(1)}%)`
                    });
                })
                .on('mouseleave', function () {
                    d3.select(this).attr('opacity', 1);
                    setTooltip(prev => ({ ...prev, visible: false }));
                })
                .transition()
                .duration(800)
                .delay((_, i) => i * 100)
                .ease(d3.easeElasticOut.amplitude(1).period(0.4))
                .attr('y', d => yScale(d))
                .attr('height', d => innerHeight - yScale(d));

            // Labels dentro de barras
            g.selectAll('.bar-label')
                .data(totalesTrimestrales)
                .join('text')
                .attr('class', 'bar-label')
                .attr('x', (_, i) => (xScale(TRIMESTRES[i]) || 0) + xScale.bandwidth() / 2)
                .attr('y', d => yScale(d) + 30)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', 'white')
                .text(d => `${((d / totalGeneral) * 100).toFixed(0)}%`)
                .attr('opacity', 0)
                .transition()
                .delay(800)
                .duration(300)
                .attr('opacity', 1);

            // Eje X
            g.append('g')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(d3.axisBottom(xScale))
                .selectAll('text')
                .attr('font-size', '14px')
                .attr('font-weight', '700')
                .attr('fill', '#374151');

            // Eje Y
            g.append('g')
                .call(d3.axisLeft(yScale)
                    .ticks(4)
                    .tickFormat(d => `$${(+d / 1_000_000_000).toFixed(0)}B`)
                )
                .selectAll('text')
                .attr('font-size', '11px')
                .attr('fill', '#9ca3af');
        }

        // Remove axis lines
        g.selectAll('.domain').attr('stroke', 'none');

    }, [data, vistaActiva, totalesMensuales, totalesTrimestrales, mesMaximo, mesMinimo, totalGeneral]);

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-[32px] shadow-premium p-12 border border-gray-100 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">Cargando datos de ritmo fiscal...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] shadow-premium border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-6 h-6 text-[#F29100]" />
                            <h2 className="text-2xl font-black text-[#004B57]">{titulo}</h2>
                        </div>
                        <p className="text-gray-500">
                            ¿Cuándo se gasta más el dinero? Identifica picos de gasto estacionales.
                        </p>
                    </div>

                    {/* Toggle de vista */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setVistaActiva('mensual')}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${vistaActiva === 'mensual'
                                ? 'bg-white shadow-sm text-[#004B57]'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setVistaActiva('trimestral')}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${vistaActiva === 'trimestral'
                                ? 'bg-white shadow-sm text-[#004B57]'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Trimestral
                        </button>
                    </div>
                </div>

                {/* Insights con contexto REAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {/* Por qué el mes pico es el pico */}
                    <div className="bg-[#F29100]/10 rounded-2xl p-5 border border-[#F29100]/20">
                        <div className="flex items-center gap-2 text-[#F29100] text-xs font-bold mb-2">
                            <TrendingUp className="w-4 h-4" /> MAYOR GASTO: {MESES[mesMaximo]}
                        </div>
                        <p className="font-black text-[#004B57] text-2xl mb-2">{formatCurrency(totalesMensuales[mesMaximo])}</p>
                        <p className="text-sm text-gray-600">
                            {mesMaximo >= 10 || mesMaximo <= 1
                                ? '🔍 Fin e inicio de año fiscal: típicamente hay prisa por ejercer presupuesto antes de que "se pierda" o compromisos de arranque.'
                                : mesMaximo >= 3 && mesMaximo <= 5
                                    ? '🔍 Segundo trimestre: suele coincidir con eventos internacionales, cumbres y giras oficiales programadas.'
                                    : '🔍 Este pico merece atención. ¿Hubo algún evento especial, elección o cumbre que lo explique?'}
                        </p>
                    </div>

                    {/* Qué significa el mes bajo */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 text-xs font-bold mb-2">
                            <Calendar className="w-4 h-4" /> MENOR GASTO: {MESES[mesMinimo]}
                        </div>
                        <p className="font-black text-[#004B57] text-2xl mb-2">{formatCurrency(totalesMensuales[mesMinimo])}</p>
                        <p className="text-sm text-gray-600">
                            {mesMinimo === 0 || mesMinimo === 11
                                ? '📊 Normal: enero y diciembre suelen ser meses de menor actividad operativa por vacaciones y cierres.'
                                : mesMinimo >= 6 && mesMinimo <= 7
                                    ? '📊 Típico: el periodo vacacional de verano reduce viajes oficiales.'
                                    : '📊 Este mes bajo podría indicar mejor planeación o simplemente menos actividad programada.'}
                        </p>
                    </div>
                </div>

                {/* Variación CON CONTEXTO */}
                {((totalesMensuales[mesMaximo] - totalesMensuales[mesMinimo]) / totalesMensuales[mesMinimo] * 100) > 30 && (
                    <div className="mt-4 bg-amber-50 rounded-2xl p-5 border border-amber-200">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">⚠️</span>
                            </div>
                            <div>
                                <p className="font-bold text-amber-800 mb-1">
                                    Variación de {((totalesMensuales[mesMaximo] - totalesMensuales[mesMinimo]) / totalesMensuales[mesMinimo] * 100).toFixed(0)}% entre el mes más alto y el más bajo
                                </p>
                                <p className="text-sm text-amber-700">
                                    Una diferencia mayor al 30% sugiere que el gasto no es constante.
                                    <strong> Pregunta clave:</strong> ¿Hay razones operativas (cumbres, emergencias, elecciones)
                                    o es falta de planeación que genera "picos" de última hora?
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Chart */}
            <div ref={containerRef} className="relative p-6">
                <svg ref={svgRef} className="w-full" />
                {tooltip.visible && (
                    <div
                        className="d3-tooltip"
                        style={{
                            left: tooltip.x,
                            top: tooltip.y,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        {tooltip.content}
                    </div>
                )}
            </div>

            {/* Footer con pregunta investigativa */}
            <div className="bg-[#004B57] px-8 py-5">
                <p className="text-sm text-white/90">
                    <strong className="text-[#00A896]">🔎 Para investigar:</strong>{' '}
                    {mesMaximo >= 9 || mesMaximo <= 1
                        ? '¿Cuántos viajes se realizaron en el último trimestre? ¿Son los mismos funcionarios viajando repetidamente o son viajes únicos justificados?'
                        : mesMaximo >= 3 && mesMaximo <= 5
                            ? '¿A qué eventos internacionales asistió México en este periodo? ¿Las delegaciones fueron del tamaño adecuado?'
                            : '¿Qué dependencias concentran el gasto en los meses pico? ¿Hay patrones que se repitan año con año?'}
                </p>
            </div>
        </div>
    );
}
