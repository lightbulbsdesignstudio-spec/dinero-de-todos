'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { humanizarNumero } from '@/lib/humanizar';
import { getShareLinks } from '@/components/ui/ShareAction'; // Import helper

interface MapPoint {
    name: string;
    value: number;
    description?: string;
    lat: number;
    lng: number;
    type?: string;
}

interface InteractiveMapProps {
    points: MapPoint[];
}

export default function InteractiveMap({ points }: InteractiveMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    // State for mobile interaction
    const [isInteracting, setIsInteracting] = useState(false);

    useEffect(() => {
        // Dynamic import of Leaflet primarily to avoid SSR issues with window object
        const initMap = async () => {
            if (!mapContainerRef.current) return;
            if (mapInstanceRef.current) return; // Map already initialized

            const L = (await import('leaflet')).default;

            const map = L.map(mapContainerRef.current, {
                center: [23.6345, -102.5528], // Center of Mexico
                zoom: 5,
                scrollWheelZoom: false, // Always false for UX
                dragging: !L.Browser.mobile, // Disable dragging on mobile initially
                zoomControl: false // We can add custom zoom or keep minimal
            });

            // Add standard OSM tiles (Light version usually looks better for data viz)
            // Or CartoDB Positron for a very clean look
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);

            // Add Zoom Control manually to top-right
            L.control.zoom({ position: 'topright' }).addTo(map);

            mapInstanceRef.current = map;

            // Render Points
            renderPoints(L, map, points);
        };

        if (typeof window !== 'undefined') {
            initMap();
        }

        return () => {
            // Cleanup logic if needed, but Leaflet map removal can be tricky in React StrictMode
            // Often better to check ref existence.
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Init once

    // Handle interaction state change
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        if (isInteracting) {
            map.dragging.enable();
            map.touchZoom.enable();
            map.scrollWheelZoom.enable();
        } else {
            // Re-disable if needed, though we usually just enable once clicked
            // map.dragging.disable();
        }
    }, [isInteracting]);


    // Update points when prop changes using a separate effect?
    // For simplicity with vanilla Leaflet, we might re-render layers.
    // But since we are mounting/unmounting, the init handles it.
    // Watching 'points' changes:
    useEffect(() => {
        if (!mapInstanceRef.current || !points.length) return;

        const updateMap = async () => {
            const L = (await import('leaflet')).default;
            // Clear existing layers logic would be here if points change dynamically without unmount
            // For now, assume points are static from initial load or we'd need a layerGroup ref.
        };

        // We will implement full rendering logic in init for now as data is static content.
    }, [points]);

    const renderPoints = (L: any, map: L.Map, dataPoints: MapPoint[]) => {
        // Determine scales
        const maxVal = Math.max(...dataPoints.map(p => p.value));
        const minVal = Math.min(...dataPoints.map(p => p.value));

        dataPoints.forEach(point => {
            // Calculate radius: Logarithmic or Sqrt scale is usually better for money
            // Linear: (val / max) * maxRadius
            // Sqrt: sqrt(val/max) * maxRadius -> Area is proportional
            const maxRadius = 50;
            const minRadius = 10;
            const radius = Math.sqrt(point.value / maxVal) * maxRadius + minRadius;

            // Color logic: Heatmap style
            // High value = Red/Hot, Low = Blue/Cold? Or consistent brand color with opacity?
            // User requested "Heatmap or Burbujas".
            // Let's use Brand Teal (#00A896) with variable opacity/size, 
            // OR a Red-Yellow-Green scale if user wants "Heatmap".
            // "El centro/sur tiene burbujas gigantes" -> Suggests emphasis.
            // Let's stick to size as primary, and color as impact.

            const circle = L.circleMarker([point.lat, point.lng], {
                radius: radius,
                fillColor: '#00A896',
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            }).addTo(map);

            // Tooltip Logic with Share Links
            const humanMoney = humanizarNumero(point.value).texto;
            const links = getShareLinks('map_bubble', {
                name: point.name,
                amount: point.value,
                location: 'México' // Or derive state?
            });

            const tooltipContent = `
                <div class="p-3 min-w-[200px]">
                    <h3 class="font-black text-sm text-gray-800 uppercase tracking-wider mb-1">${point.name}</h3>
                    <div class="flex items-baseline gap-2 mb-2">
                        <span class="text-lg font-black text-[#00A896]">${humanMoney}</span>
                    </div>
                     ${point.description ? `<p class="text-xs text-gray-500 mb-3 leading-relaxed border-b border-gray-100 pb-2">${point.description}</p>` : ''}
                     
                    <div class="flex gap-2">
                        <a href="${links.twitter}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-1.5 bg-black text-white text-[10px] items-center justify-center rounded hover:bg-gray-800 transition-colors flex gap-1" title="Compartir en X">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                             X
                        </a>
                        <a href="${links.whatsapp}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-1.5 bg-[#25D366] text-white text-[10px] items-center justify-center rounded hover:bg-[#128C7E] transition-colors flex gap-1" title="Compartir en WhatsApp">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.9 16.9c-2.5 2.5-6.6 2.5-9.1 0-.6-.6-1.1-1.4-1.4-2.2l-1 3.4 3.4-1c.8.4 1.7.9 2.5.9 3.5 0 6.6-2.6 7-6 .5-3.5-1.9-6.7-5.4-7.2-2.9-.4-5.6 1.3-6.6 4"/></svg>
                             Share
                        </a>
                    </div>
                </div>
            `;

            circle.bindPopup(tooltipContent, {
                className: 'leaflet-custom-popup shadow-xl border-0 rounded-xl p-0 overflow-hidden',
                minWidth: 220
            });

            // Interaction: Open Popup on click (User requested "Tooltip rápido" logic, popups handle links better)
            // But we can also keep hover interaction            // Interaction
            circle.on('mouseover', function (this: any, e: any) {
                this.setStyle({ fillOpacity: 0.9, weight: 2 });
                this.openPopup();
            });
            circle.on('mouseout', function (this: any, e: any) {
                this.setStyle({ fillOpacity: 0.6, weight: 1 });
                // this.closePopup(); // Don't auto close if we want them to click buttons
            });
        });
    };

    return (
        <div ref={mapContainerRef} className="w-full h-full rounded-[32px] overflow-hidden shadow-2xl z-0" style={{ zIndex: 0 }} />
    );
}

// Global styles for custom tooltip need to be in globals.css or injected.
// We'll rely on tailwind classes inside generic leaflet tooltip class if possible, 
// or accept default white box styles which are usually fine.
