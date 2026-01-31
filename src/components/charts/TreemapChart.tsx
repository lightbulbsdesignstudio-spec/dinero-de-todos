'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { humanizarNumero } from '@/lib/humanizar';

// Población de México para cálculos per cápita
const POBLACION_MX = 130_000_000;

interface TreemapNode {
  name: string;
  nombreCiudadano?: string;
  descripcion?: string;
  value?: number;
  ejercido?: number;
  children?: TreemapNode[];
  color?: string;
}

interface TreemapChartProps {
  data: TreemapNode;
  onNodeClick?: (node: TreemapNode, path: string[]) => void;
}

interface TreemapLayoutNode extends d3.HierarchyRectangularNode<TreemapNode> {
  data: TreemapNode;
}

export default function TreemapChart({ data, onNodeClick }: TreemapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: {
      name: string;
      nombreCiudadano?: string;
      descripcion?: string;
      value: number;
      porcentaje: number;
      perCapita: number;
    };
  }>({ visible: false, x: 0, y: 0, content: { name: '', value: 0, porcentaje: 0, perCapita: 0 } });

  // Calculate total for percentages
  const totalValue = data.children?.reduce((sum, child) => sum + (child.value || 0), 0) || 0;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 600; // Más alto para mejor visualización

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3.treemap<TreemapNode>()
      .size([width, height])
      .padding(4)
      .round(true);

    treemapLayout(root);

    const leaves = root.leaves() as TreemapLayoutNode[];

    // Paleta de colores Dinero de Todos
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.children?.map(d => d.name) || [])
      .range([
        '#004B57', // Azul Vigilante
        '#00A896', // Verde Talavera
        '#F29100', // Oro Ciudadano
        '#003d47', // Azul Vigilante Oscuro
        '#007d6e', // Verde Talavera Oscuro
        '#d97f00', // Oro Oscuro
        '#10b981', // Emerald (complementary)
        '#3b82f6', // Blue (complementary)
        '#8b5cf6', // Violet (complementary)
        '#ef4444', // Red (alert)
      ]);

    const cell = svg.selectAll('g')
      .data(leaves)
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Rectángulos con mejor estilo
    cell.append('rect')
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0))
      .attr('fill', d => {
        let current: d3.HierarchyNode<TreemapNode> = d;
        while (current.depth > 1 && current.parent) {
          current = current.parent;
        }
        return d.data.color || colorScale(current.data.name);
      })
      .attr('rx', 12)
      .attr('stroke', 'rgba(255,255,255,0.3)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'filter 0.2s ease')
      .on('mouseenter', function (event, d) {
        const nodeWidth = d.x1 - d.x0;
        const nodeHeight = d.y1 - d.y0;
        // Tooltip para cuadros donde NO se muestra la descripción completa
        // (cuadros que no son XL con descripción visible)
        const hasFullDescription = nodeWidth > 350 && nodeHeight > 280 && d.data.descripcion;
        const needsTooltip = !hasFullDescription;

        d3.select(this).style('filter', 'brightness(1.1)');

        if (needsTooltip) {
          const rect = container.getBoundingClientRect();
          const value = d.value || 0;
          const porcentaje = totalValue > 0 ? (value / totalValue) * 100 : 0;
          const perCapita = Math.round(value / POBLACION_MX);

          setTooltip({
            visible: true,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 10,
            content: {
              name: d.data.name,
              nombreCiudadano: d.data.nombreCiudadano,
              descripcion: d.data.descripcion,
              value,
              porcentaje,
              perCapita
            }
          });
        }
      })
      .on('mousemove', function (event, d) {
        const nodeWidth = d.x1 - d.x0;
        const nodeHeight = d.y1 - d.y0;
        const hasFullDescription = nodeWidth > 350 && nodeHeight > 280 && d.data.descripcion;
        const needsTooltip = !hasFullDescription;

        if (needsTooltip) {
          const rect = container.getBoundingClientRect();
          setTooltip(prev => ({
            ...prev,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 10,
          }));
        }
      })
      .on('mouseleave', function () {
        d3.select(this).style('filter', null);
        setTooltip(prev => ({ ...prev, visible: false }));
      })
      .on('click', function (event, d) {
        if (onNodeClick) {
          const path: string[] = [];
          let current: d3.HierarchyNode<TreemapNode> | null = d;
          while (current) {
            path.unshift(current.data.name);
            current = current.parent;
          }
          onNodeClick(d.data, path);
        }
      });

    // Contenido mejorado con foreignObject
    cell.each(function (d) {
      const nodeWidth = d.x1 - d.x0;
      const nodeHeight = d.y1 - d.y0;
      const g = d3.select(this);

      // Umbrales basados en área real
      const isXL = nodeWidth > 350 && nodeHeight > 280;
      const isLarge = nodeWidth > 280 && nodeHeight > 220;
      const isMedium = nodeWidth > 180 && nodeHeight > 150;
      const isSmall = nodeWidth >= 90 && nodeHeight >= 65;

      if (nodeWidth < 80 || nodeHeight < 55) return;

      // Padding adaptable al tamaño
      const padding = isLarge ? 18 : isMedium ? 14 : 12;
      const contentWidth = nodeWidth - padding * 2;
      const contentHeight = nodeHeight - padding * 2;

      const fo = g.append('foreignObject')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .attr('x', padding)
        .attr('y', padding)
        .style('pointer-events', 'none')
        .style('overflow', 'hidden');

      const value = d.value || 0;
      const porcentaje = totalValue > 0 ? (value / totalValue) * 100 : 0;
      const perCapita = Math.round(value / POBLACION_MX);
      const displayName = d.data.nombreCiudadano || d.data.name;
      const humanizado = humanizarNumero(value);

      // Contenedor principal
      const mainContainer = fo.append('xhtml:div')
        .style('width', '100%')
        .style('height', '100%')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('color', 'white')
        .style('overflow', 'hidden')
        .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

      // === CONTENIDO ADAPTADO AL TAMAÑO ===

      // Título - siempre visible
      const titleSize = isXL ? '20px' : isLarge ? '18px' : isMedium ? '15px' : '13px';
      mainContainer.append('xhtml:div')
        .style('font-weight', '700')
        .style('font-size', titleSize)
        .style('line-height', '1.25')
        .style('margin-bottom', isMedium ? '6px' : '4px')
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.3)')
        .text(displayName);

      // Monto - siempre visible
      const montoSize = isXL ? '26px' : isLarge ? '22px' : isMedium ? '18px' : '15px';
      mainContainer.append('xhtml:div')
        .style('font-size', montoSize)
        .style('font-weight', '800')
        .style('opacity', '0.95')
        .style('margin-bottom', isMedium ? '6px' : '4px')
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.2)')
        .text(humanizado.texto);

      // Porcentaje - SIEMPRE visible, nunca se corta
      const pctSize = isLarge ? '12px' : isMedium ? '11px' : '10px';
      const pctPadding = isLarge ? '5px 10px' : '4px 8px';

      const pctBadge = mainContainer.append('xhtml:div')
        .style('display', 'inline-block')
        .style('background', 'rgba(255,255,255,0.25)')
        .style('padding', pctPadding)
        .style('border-radius', '12px')
        .style('font-size', pctSize)
        .style('font-weight', '700')
        .style('flex-shrink', '0')
        .style('white-space', 'nowrap');

      // Solo mostrar "del total" si hay espacio horizontal
      const pctText = nodeWidth > 140 ? `${porcentaje.toFixed(1)}% del total` : `${porcentaje.toFixed(1)}%`;
      pctBadge.text(pctText);

      // === CONTENIDO ADICIONAL SEGÚN ESPACIO ===

      // Per cápita - solo si hay espacio vertical suficiente
      if (nodeHeight > 180 && nodeWidth > 150) {
        mainContainer.append('xhtml:div')
          .style('font-size', '13px')
          .style('opacity', '0.9')
          .style('margin-top', '8px')
          .html(`👤 $${perCapita.toLocaleString('es-MX')} por mexicano`);
      }

      // Descripción - solo en cuadros grandes
      if (isLarge && d.data.descripcion) {
        const descContainer = mainContainer.append('xhtml:div')
          .style('font-size', '13px')
          .style('line-height', '1.55')
          .style('opacity', '0.92')
          .style('padding', '12px')
          .style('background', 'rgba(0,0,0,0.18)')
          .style('border-radius', '10px')
          .style('margin-top', '10px')
          .style('flex', '1')
          .style('overflow', 'hidden')
          .style('min-height', '0');

        descContainer.text(d.data.descripcion);
      }
    });

  }, [data, onNodeClick, totalValue]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" style={{ minHeight: '600px' }} />

      {/* Tooltip mejorado */}
      {tooltip.visible && (
        <div
          className="absolute bg-gray-900/95 backdrop-blur-sm text-white rounded-2xl p-5 shadow-2xl z-50 max-w-sm border border-white/10"
          style={{
            left: Math.min(tooltip.x, (containerRef.current?.clientWidth || 400) - 320),
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {/* Nombre ciudadano */}
          {tooltip.content.nombreCiudadano && tooltip.content.nombreCiudadano !== tooltip.content.name && (
            <div className="text-emerald-400 text-sm font-semibold mb-1">
              {tooltip.content.nombreCiudadano}
            </div>
          )}

          {/* Nombre oficial */}
          <div className="font-bold text-xl mb-3">{tooltip.content.name}</div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Monto</div>
              <div className="text-lg font-bold text-emerald-300">
                {humanizarNumero(tooltip.content.value).texto}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Del total</div>
              <div className="text-lg font-bold text-blue-300">
                {tooltip.content.porcentaje.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Per cápita */}
          <div className="bg-white/5 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <div>
                <div className="text-xs text-gray-400">Por cada mexicano</div>
                <div className="font-semibold text-white">
                  ${tooltip.content.perCapita.toLocaleString('es-MX')} al año
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {tooltip.content.descripcion && (
            <div className="text-sm text-gray-300 border-t border-white/10 pt-3">
              {tooltip.content.descripcion}
            </div>
          )}

          {/* Click hint */}
          <div className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <span>Haz clic para ver el desglose</span>
            <span>→</span>
          </div>
        </div>
      )}
    </div>
  );
}
