'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { formatCurrency } from '@/lib/utils';
import { GitBranch, Plane, Coffee, Droplets, HelpCircle } from 'lucide-react';

interface ViaticoDesglose {
    vuelosYPasajes: number;
    comidasYHoteles: number;
    gasolinaYMovilidad: number;
}

interface DependenciaMovilidad {
    dependencia: string;
    monto: number;
    desglose: ViaticoDesglose;
}

interface MobilitySankeyChartProps {
    data: DependenciaMovilidad[];
    titulo?: string;
    maxDependencias?: number;
}

interface ProcessedNode {
    id: string;
    name: string;
    column?: number;
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    value?: number;
    index?: number;
}

interface ProcessedLink {
    source: ProcessedNode;
    target: ProcessedNode;
    value: number;
    width?: number;
    y0?: number;
    y1?: number;
}

const NODE_COLORS: Record<string, string> = {
    // Fuentes (Izquierda)
    'presupuesto-federal': '#004B57',

    // Categorías finales (Derecha)  
    'vuelos': '#3b82f6',
    'comidas': '#f59e0b',
    'gasolina': '#10b981',
};

const CATEGORIA_ICONS: Record<string, React.ReactNode> = {
    'vuelos': <Plane className="w-4 h-4" />,
    'comidas': <Coffee className="w-4 h-4" />,
    'gasolina': <Droplets className="w-4 h-4" />,
};

export default function MobilitySankeyChart({
    data,
    titulo = 'Flujo del Gasto en Movilidad',
    maxDependencias = 8
}: MobilitySankeyChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        content: string;
    }>({ visible: false, x: 0, y: 0, content: '' });

    // Preparar datos para Sankey
    const topDependencias = data
        .sort((a, b) => b.monto - a.monto)
        .slice(0, maxDependencias);

    const totalGeneral = topDependencias.reduce((sum, d) => sum + d.monto, 0);
    const totalVuelos = topDependencias.reduce((sum, d) => sum + d.desglose.vuelosYPasajes, 0);
    const totalComidas = topDependencias.reduce((sum, d) => sum + d.desglose.comidasYHoteles, 0);
    const totalGasolina = topDependencias.reduce((sum, d) => sum + d.desglose.gasolinaYMovilidad, 0);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current || topDependencias.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 500;
        const margin = { top: 20, right: 200, bottom: 20, left: 120 };

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Crear nodos
        const nodes: { id: string; name: string }[] = [
            { id: 'presupuesto-federal', name: 'PEF 2025' },
            ...topDependencias.map(d => ({
                id: `dep-${d.dependencia}`,
                name: d.dependencia.length > 25 ? d.dependencia.slice(0, 22) + '...' : d.dependencia
            })),
            { id: 'vuelos', name: '✈️ Vuelos y Pasajes' },
            { id: 'comidas', name: '🍽️ Comidas y Hoteles' },
            { id: 'gasolina', name: '⛽ Gasolina' },
        ];

        // Crear links (PEF → Dependencias → Categorías)
        const links: { source: string; target: string; value: number }[] = [];

        topDependencias.forEach(dep => {
            // PEF → Dependencia
            links.push({
                source: 'presupuesto-federal',
                target: `dep-${dep.dependencia}`,
                value: dep.monto
            });

            // Dependencia → Categoría (solo si hay valor)
            if (dep.desglose.vuelosYPasajes > 0) {
                links.push({
                    source: `dep-${dep.dependencia}`,
                    target: 'vuelos',
                    value: dep.desglose.vuelosYPasajes
                });
            }
            if (dep.desglose.comidasYHoteles > 0) {
                links.push({
                    source: `dep-${dep.dependencia}`,
                    target: 'comidas',
                    value: dep.desglose.comidasYHoteles
                });
            }
            if (dep.desglose.gasolinaYMovilidad > 0) {
                links.push({
                    source: `dep-${dep.dependencia}`,
                    target: 'gasolina',
                    value: dep.desglose.gasolinaYMovilidad
                });
            }
        });

        // Crear mapa de índices
        const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));

        const sankeyLinks = links.map(l => ({
            source: nodeMap.get(l.source) as number,
            target: nodeMap.get(l.target) as number,
            value: l.value,
        }));

        // Configurar generador Sankey
        const sankeyGenerator = sankey<{ id: string; name: string }, { value: number }>()
            .nodeId((d: { index?: number }) => d.index ?? 0)
            .nodeWidth(24)
            .nodePadding(12)
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

        const sankeyData = sankeyGenerator({
            nodes: nodes.map(n => ({ ...n })),
            links: sankeyLinks,
        });

        const processedNodes = sankeyData.nodes as ProcessedNode[];
        const processedLinks = sankeyData.links as unknown as ProcessedLink[];

        // Definir gradientes
        const defs = svg.append('defs');

        // Gradiente principal
        const mainGradient = defs.append('linearGradient')
            .attr('id', 'sankeyGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        mainGradient.append('stop').attr('offset', '0%').attr('stop-color', '#004B57');
        mainGradient.append('stop').attr('offset', '100%').attr('stop-color', '#00A896');

        // Gradientes por categoría
        ['vuelos', 'comidas', 'gasolina'].forEach(cat => {
            const gradient = defs.append('linearGradient')
                .attr('id', `${cat}Gradient`)
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%');

            gradient.append('stop').attr('offset', '0%').attr('stop-color', NODE_COLORS[cat]).attr('stop-opacity', 0.3);
            gradient.append('stop').attr('offset', '100%').attr('stop-color', NODE_COLORS[cat]);
        });

        // Dibujar links
        svg.append('g')
            .attr('fill', 'none')
            .selectAll('path')
            .data(processedLinks)
            .join('path')
            .attr('d', sankeyLinkHorizontal() as unknown as string)
            .attr('stroke', d => {
                const targetId = d.target.id;
                if (targetId === 'vuelos') return 'url(#vuelosGradient)';
                if (targetId === 'comidas') return 'url(#comidasGradient)';
                if (targetId === 'gasolina') return 'url(#gasolinaGradient)';
                return 'url(#sankeyGradient)';
            })
            .attr('stroke-opacity', d => selectedNode && d.source.id !== selectedNode && d.target.id !== selectedNode ? 0.1 : 0.5)
            .attr('stroke-width', d => Math.max(2, d.width || 0))
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, d) {
                d3.select(this).attr('stroke-opacity', 0.8);
                const rect = container.getBoundingClientRect();
                const porcentaje = ((d.value / totalGeneral) * 100).toFixed(1);
                setTooltip({
                    visible: true,
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top - 10,
                    content: `${d.source.name} → ${d.target.name}\n${formatCurrency(d.value)} (${porcentaje}%)`
                });
            })
            .on('mouseleave', function () {
                d3.select(this).attr('stroke-opacity', selectedNode ? 0.1 : 0.5);
                setTooltip(prev => ({ ...prev, visible: false }));
            })
            .transition()
            .duration(800)
            .delay((_, i) => i * 20);

        // Dibujar nodos
        svg.append('g')
            .selectAll('rect')
            .data(processedNodes)
            .join('rect')
            .attr('x', d => d.x0 || 0)
            .attr('y', d => d.y0 || 0)
            .attr('height', d => Math.max(4, (d.y1 || 0) - (d.y0 || 0)))
            .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
            .attr('fill', d => NODE_COLORS[d.id] || '#004B57')
            .attr('rx', 6)
            .attr('opacity', d => selectedNode && d.id !== selectedNode ? 0.3 : 1)
            .style('cursor', 'pointer')
            .on('click', (_, d) => {
                setSelectedNode(prev => prev === d.id ? null : d.id);
            })
            .on('mouseenter', function (event, d) {
                d3.select(this).attr('opacity', 0.8);
                const rect = container.getBoundingClientRect();
                const porcentaje = d.value ? ((d.value / totalGeneral) * 100).toFixed(1) : '0';
                setTooltip({
                    visible: true,
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top - 10,
                    content: `${d.name}\n${formatCurrency(d.value || 0)} (${porcentaje}%)`
                });
            })
            .on('mouseleave', function () {
                d3.select(this).attr('opacity', selectedNode ? 0.3 : 1);
                setTooltip(prev => ({ ...prev, visible: false }));
            });

        // Labels
        svg.append('g')
            .selectAll('text')
            .data(processedNodes)
            .join('text')
            .attr('x', d => (d.x0 || 0) < width / 2
                ? (d.x0 || 0) - 8
                : (d.x1 || 0) + 8
            )
            .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => (d.x0 || 0) < width / 2 ? 'end' : 'start')
            .attr('font-size', d => d.id === 'presupuesto-federal' ? 14 : 11)
            .attr('font-weight', d => d.id.startsWith('dep-') ? 500 : 700)
            .attr('fill', '#374151')
            .text(d => d.name)
            .attr('opacity', 0)
            .transition()
            .delay(500)
            .duration(300)
            .attr('opacity', 1);

    }, [topDependencias, selectedNode, totalGeneral]);

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-[32px] shadow-premium p-12 border border-gray-100 text-center">
                <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">Cargando flujo de movilidad...</p>
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
                            <GitBranch className="w-6 h-6 text-[#00A896]" />
                            <h2 className="text-2xl font-black text-[#004B57]">{titulo}</h2>
                        </div>
                        <p className="text-gray-500">
                            ¿A dónde fluye el dinero de movilidad? Visualiza el camino desde el presupuesto hasta el gasto final.
                        </p>
                    </div>

                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                        onClick={() => setSelectedNode(null)}
                    >
                        <HelpCircle className="w-4 h-4" />
                        Clic en un nodo para aislar
                    </button>
                </div>

                {/* Resumen de categorías */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedNode(selectedNode === 'vuelos' ? null : 'vuelos')}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                {CATEGORIA_ICONS['vuelos']}
                            </div>
                            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Vuelos y Pasajes</span>
                        </div>
                        <p className="text-2xl font-black text-[#004B57]">{formatCurrency(totalVuelos)}</p>
                        <p className="text-blue-600 font-bold text-sm mt-1">
                            {((totalVuelos / totalGeneral) * 100).toFixed(1)}% del total
                        </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedNode(selectedNode === 'comidas' ? null : 'comidas')}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                                {CATEGORIA_ICONS['comidas']}
                            </div>
                            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Comidas y Hoteles</span>
                        </div>
                        <p className="text-2xl font-black text-[#004B57]">{formatCurrency(totalComidas)}</p>
                        <p className="text-amber-600 font-bold text-sm mt-1">
                            {((totalComidas / totalGeneral) * 100).toFixed(1)}% del total
                        </p>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedNode(selectedNode === 'gasolina' ? null : 'gasolina')}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                {CATEGORIA_ICONS['gasolina']}
                            </div>
                            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Gasolina</span>
                        </div>
                        <p className="text-2xl font-black text-[#004B57]">{formatCurrency(totalGasolina)}</p>
                        <p className="text-emerald-600 font-bold text-sm mt-1">
                            {((totalGasolina / totalGeneral) * 100).toFixed(1)}% del total
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div ref={containerRef} className="relative p-6 min-h-[520px]">
                <svg ref={svgRef} className="w-full" />
                {tooltip.visible && (
                    <div
                        className="d3-tooltip whitespace-pre-line"
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

            {/* Footer con preguntas investigativas */}
            <div className="bg-[#004B57] px-8 py-5">
                <p className="text-sm text-white/90">
                    <strong className="text-[#00A896]">🔎 Para investigar:</strong>{' '}
                    {totalVuelos > totalGasolina && totalVuelos > totalComidas
                        ? '¿Cuántos vuelos son en aerolíneas comerciales vs. aviones oficiales? ¿Viajan en business o economy? ¿Hay funcionarios que vuelan cada semana?'
                        : totalGasolina > totalComidas
                            ? '¿Cuántos vehículos oficiales tiene cada dependencia? ¿Se justifica el kilometraje reportado? ¿Hay chofer asignado o el funcionario maneja?'
                            : '¿Qué tipo de hospedaje se autoriza? ¿Hay funcionarios que siempre se hospedan en hoteles de 5 estrellas? ¿Se facturan comidas excesivas?'}
                </p>
            </div>
        </div>
    );
}
