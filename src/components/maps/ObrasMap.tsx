'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ObraPublicaAPI } from '@/lib/api/obras';
import { formatCurrency, getExecutionColor } from '@/lib/utils';
import { getCalificacionMexicana } from '@/lib/fiscal';

interface ObrasMapProps {
  obras: ObraPublicaAPI[];
  onObraSelect?: (obra: ObraPublicaAPI | null) => void;
  selectedObra?: ObraPublicaAPI | null;
}

const tipoColors: Record<string, string> = {
  infraestructura: '#64748b',
  educacion: '#3b82f6',
  salud: '#ef4444',
  transporte: '#10b981',
  agua: '#06b6d4',
  otro: '#94a3b8',
};

const tipoLabels: Record<string, string> = {
  infraestructura: 'Infraestructura',
  educacion: 'Educación',
  salud: 'Salud',
  transporte: 'Transporte',
  agua: 'Agua y Saneamiento',
  otro: 'Otro',
};

export default function ObrasMap({ obras, onObraSelect, selectedObra }: ObrasMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Mexico
    const map = L.map(mapRef.current).setView([23.6345, -102.5528], 5);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each obra
    obras.forEach(obra => {
      const color = tipoColors[obra.tipo] || '#666';

      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([obra.lat, obra.lng], { icon })
        .addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 240px; font-family: system-ui, sans-serif;">
          <div style="margin-bottom: 8px; display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <span style="
                  display: inline-block;
                  padding: 2px 8px;
                  background: ${color}20;
                  color: ${color};
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 4px;
                ">${tipoLabels[obra.tipo]}</span>
            <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; line-height: 1.2;">${obra.nombre}</h3>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">${obra.municipio}, ${obra.estado}</p>
          </div>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 8px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; color: #64748b;">Costo Actual 2026</span>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${formatCurrency(obra.monto)}</span>
          </div>
          ${obra.costoInicial && obra.costoInicial < obra.monto ? `
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #cbd5e1; padding-top: 4px; margin-top: 4px;">
                  <span style="font-size: 11px; color: #64748b; font-style: italic;">
                    Estimación Inicial 
                    ${!['tren-maya-tramo-5', 'refineria-dos-bocas', 'aifa-conexion'].includes(obra.id) ?
            `<span title="Dato proyectado para ejercicio 2026. Ayúdanos a verificarlo." style="cursor: help; border-bottom: 1px dotted #94a3b8;">(Simulada)</span>`
            : `<span title="Dato verificado en fuentes periodísticas y oficiales" style="color: #059669; font-weight:600;">(Verificada)</span>`
          }
                  </span>
                  <span style="font-size: 11px; color: #64748b; text-decoration: line-through;">${formatCurrency(obra.costoInicial)}</span>
                </div>
                <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 6px;">
                   ${(() => {
            const overCostPercent = ((obra.monto - obra.costoInicial!) / obra.costoInicial! * 100);
            // Lógica de castigo: -1 punto por cada 10% de sobrecosto
            const score = Math.max(0, Math.min(10, 10 - (overCostPercent / 10)));
            const calif = getCalificacionMexicana(score);
            return `
                       <div style="display: flex; align-items: center; gap: 8px; background: ${calif.color}15; border: 1px solid ${calif.color}40; padding: 4px 8px; border-radius: 8px; width: 100%;">
                          <div style="font-size: 24px; font-weight: 900; color: ${calif.color};">${calif.calificacion.toFixed(1)}</div>
                          <div>
                            <div style="font-size: 9px; font-weight: 800; color: ${calif.color}; text-transform: uppercase; line-height: 1;">${calif.mensaje}</div>
                            <div style="font-size: 9px; color: #64748b; line-height: 1.1;">Ojo Crítico: +${overCostPercent.toFixed(1)}% sobrecosto</div>
                          </div>
                       </div>
                     `;
          })()}
                </div>
             ` : ''}
        </div>

          ${obra.detallesEducacion ? `
            <div style="margin-bottom: 12px; background: #eff6ff; padding: 8px; border-radius: 6px; border: 1px solid #dbeafe;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 11px; color: #1e40af; font-weight: 600;">🎓 Impacto Educativo</span>
                    <span style="font-size: 10px; padding: 1px 6px; background: ${obra.detallesEducacion.enOperacion ? '#dcfce7' : '#f1f5f9'}; color: ${obra.detallesEducacion.enOperacion ? '#166534' : '#64748b'}; border-radius: 10px; border: 1px solid ${obra.detallesEducacion.enOperacion ? '#bbf7d0' : '#e2e8f0'}; font-weight: 600;">
                        ${obra.detallesEducacion.enOperacion ? '🟢 En Operación' : '🚧 En Construcción'}
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                        <p style="margin: 0; font-size: 10px; color: #60a5fa;">Capacidad</p>
                        <p style="margin: 0; font-size: 12px; font-weight: 700; color: #1e3a8a;">${obra.detallesEducacion.capacidad.toLocaleString()} alumnos</p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 10px; color: #60a5fa;">Oferta</p>
                        <p style="margin: 0; font-size: 11px; font-weight: 600; color: #1e3a8a; line-height: 1.1;">
                            ${obra.detallesEducacion.carreras.join(', ')}
                        </p>
                    </div>
                </div>
            </div>
          ` : ''}

          ${obra.preguntasCiudadanas && obra.preguntasCiudadanas.length > 0 ? `
            <div style="margin-top: 12px; border-top: 2px solid #f1f5f9; pt-2;">
                <p style="margin: 8px 0 4px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                    👁️ Ojo Crítico Ciudadano
                </p>
                <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #475569;">
                    ${obra.preguntasCiudadanas.map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                </ul>
            </div>
          ` : ''}

        <div style="display: flex; gap: 4px; margin-bottom: 12px; margin-top: 12px;">
          ${obra.tipoFinanciamiento ? `
                <span style="
                  font-size: 10px; 
                  font-weight: 600; 
                  padding: 2px 6px; 
                  border-radius: 4px; 
                  background: ${obra.tipoFinanciamiento === 'autosuficiente' ? '#f0fdf4' : '#fffbeb'}; 
                  color: ${obra.tipoFinanciamiento === 'autosuficiente' ? '#166534' : '#b45309'};
                  border: 1px solid ${obra.tipoFinanciamiento === 'autosuficiente' ? '#bbf7d0' : '#fde68a'};
                ">
                  ${obra.tipoFinanciamiento === 'autosuficiente' ? '💰 Se mantiene con sus propios ingresos' : '🏛️ Opera con dinero de tus impuestos'}
                </span>
             ` : ''}
          <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; color: #475569;">
            ${obra.avance}% Avance
          </span>
        </div>

        <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
          <div style="width: ${obra.avance}%; height: 100%; background: ${getExecutionColor(obra.avance)};"></div>
        </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onObraSelect) {
          onObraSelect(obra);
        }
      });

      markersRef.current.push(marker);
    });

  }, [obras, onObraSelect]);

  // Fly to selected obra
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedObra) return;

    mapInstanceRef.current.flyTo([selectedObra.lat, selectedObra.lng], 10, {
      duration: 1,
    });

    // Find and open the popup for the selected obra
    markersRef.current.forEach(marker => {
      const latlng = marker.getLatLng();
      if (latlng.lat === selectedObra.lat && latlng.lng === selectedObra.lng) {
        marker.openPopup();
      }
    });
  }, [selectedObra]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[400px] rounded-xl"
      style={{ zIndex: 1 }}
    />
  );
}
