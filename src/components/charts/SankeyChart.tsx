'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { formatCurrencyShort } from '@/lib/utils';

interface SankeyDataNode {
  id: string;
  name: string;
}

interface SankeyDataLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyChartProps {
  nodes: SankeyDataNode[];
  links: SankeyDataLink[];
}

interface ProcessedNode {
  id: string;
  name: string;
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

const nodeColors: Record<string, string> = {
  // Fuentes (Izquierda) - Colores de marca
  isr: '#004B57',             // Azul Vigilante
  iva: '#00A896',             // Verde Talavera
  ieps: '#F29100',            // Oro Ciudadano
  petroleros: '#003d47',      // Azul Oscuro
  otros: '#64748b',           // Gris Slate
  deuda: '#ef4444',           // Rojo Alerta

  // Destinos (Derecha) - Colores armonizados
  educacion: '#3b82f6',       // Azul
  salud: '#ef4444',          // Rojo
  bienestar: '#8b5cf6',       // Violeta
  seguridad: '#f59e0b',       // Ámbar
  infraestructura: '#10b981', // Esmeralda
  'deuda-pago': '#dc2626',    // Rojo fuerte
  estados: '#00A896',         // Verde Talavera
};

export default function SankeyChart({ nodes, links }: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;
    const margin = { top: 20, right: 150, bottom: 20, left: 150 };

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create node index map
    const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));

    // Convert links to use indices
    const sankeyLinks = links.map(l => ({
      source: nodeMap.get(l.source) as number,
      target: nodeMap.get(l.target) as number,
      value: l.value,
    }));

    // Create sankey generator with proper typing
    const sankeyGenerator = sankey<{ id: string; name: string }, { value: number }>()
      .nodeId((d: { index?: number }) => d.index ?? 0)
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    // Generate sankey data
    const sankeyData = sankeyGenerator({
      nodes: nodes.map(n => ({ ...n })),
      links: sankeyLinks,
    });

    const processedNodes = sankeyData.nodes as ProcessedNode[];
    const processedLinks = sankeyData.links as unknown as ProcessedLink[];

    // Draw links
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.4)
      .selectAll('path')
      .data(processedLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal() as unknown as string)
      .attr('stroke', d => nodeColors[d.source.id] || '#999')
      .attr('stroke-width', d => Math.max(1, d.width || 0))
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('stroke-opacity', 0.7);
        const rect = container.getBoundingClientRect();
        setTooltip({
          visible: true,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10,
          content: `${d.source.name} → ${d.target.name}: ${formatCurrencyShort(d.value)}`,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-opacity', 0.4);
        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Draw nodes
    svg.append('g')
      .selectAll('rect')
      .data(processedNodes)
      .join('rect')
      .attr('x', d => d.x0 || 0)
      .attr('y', d => d.y0 || 0)
      .attr('height', d => Math.max(1, (d.y1 || 0) - (d.y0 || 0)))
      .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', d => nodeColors[d.id] || '#999')
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        const rect = container.getBoundingClientRect();
        const totalValue = d.value || 0;
        setTooltip({
          visible: true,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10,
          content: `${d.name}: ${formatCurrencyShort(totalValue)}`,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1);
        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Add labels
    svg.append('g')
      .selectAll('text')
      .data(processedNodes)
      .join('text')
      .attr('x', d => (d.x0 || 0) < width / 2 ? (d.x0 || 0) - 6 : (d.x1 || 0) + 6)
      .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => (d.x0 || 0) < width / 2 ? 'end' : 'start')
      .attr('font-size', 12)
      .attr('font-weight', 500)
      .attr('fill', '#374151')
      .text(d => d.name);

  }, [nodes, links]);

  return (
    <div ref={containerRef} className="relative w-full">
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
  );
}
