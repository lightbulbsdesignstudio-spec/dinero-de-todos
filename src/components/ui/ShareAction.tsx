'use client';

import { Share2, Twitter, MessageCircle } from 'lucide-react';
import { humanizarNumero } from '@/lib/humanizar';

type ShareScenario = 'project' | 'map_bubble' | 'company_risk';

interface ShareActionProps {
    scenario: ShareScenario;
    data: {
        name?: string;
        amount?: number;
        location?: string;
        percentage?: number;
        risk_reason?: string;
    };
    compact?: boolean; // For limited spaces like tooltips
    className?: string; // For custom styling
}

export default function ShareAction({ scenario, data, compact = false, className = '' }: ShareActionProps) {
    const WEBSITE_URL = 'https://dinerodetodos.mx';

    const generateMessage = () => {
        const amountStr = data.amount ? `$${humanizarNumero(data.amount).textoCorto}` : '';
        const location = data.location || 'México';

        switch (scenario) {
            case 'project':
            case 'map_bubble':
                // Escenario A: Proyecto Costoso
                return `📉 En ${location} se están gastando ${amountStr} en ${data.name}. ¿Dónde está el análisis de crecimiento económico que justifique este gasto? Queremos inversión que multiplique, no deuda. Audítalo en ${WEBSITE_URL}`;

            case 'company_risk':
                // Escenario C: Empresas con Riesgo
                return `⚠️ Contratos millonarios a empresas sin experiencia comprobada reducen la calidad de la obra y el crecimiento del país. Aquí están los datos del contrato: ${WEBSITE_URL}`;

            default:
                return `Audita el gasto público en ${WEBSITE_URL}`;
        }
    };

    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);

    const links = {
        whatsapp: `https://wa.me/?text=${encodedMessage}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`
    };

    if (compact) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors" title="Compartir en X">
                    <Twitter className="w-3 h-3" />
                </a>
                <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] transition-colors" title="Compartir en WhatsApp">
                    <MessageCircle className="w-3 h-3" />
                </a>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">¿Indignado? Compártelo y exige calidad</span>
            <div className="flex gap-3">
                <a
                    href={links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-xs font-bold"
                >
                    <Twitter className="w-4 h-4" />
                    <span className="hidden sm:inline">Postear en X</span>
                </a>
                <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl hover:bg-[#128C7E] transition-colors text-xs font-bold"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Enviar por WhatsApp</span>
                </a>
            </div>
        </div>
    );
}

// Helper to generate raw links for non-React contexts (like Leaflet HTML strings)
export function getShareLinks(scenario: ShareScenario, data: any) {
    const component = ShareAction({ scenario, data }); // This wouldn't work easily as it returns JSX.
    // Reduplicating logic slightly for raw string usage in Leaflet

    const WEBSITE_URL = 'https://dinerodetodos.mx';
    const amountStr = data.amount ? `$${humanizarNumero(data.amount).textoCorto}` : '';
    const location = data.location || 'México';

    let message = '';
    if (scenario === 'project' || scenario === 'map_bubble') {
        message = `📉 En ${location} se están gastando ${amountStr} en ${data.name}. ¿Dónde está el análisis de crecimiento económico que justifique este gasto? Queremos inversión que multiplique, no deuda. Audítalo en ${WEBSITE_URL}`;
    } else if (scenario === 'company_risk') {
        message = `⚠️ Contratos millonarios a empresas sin experiencia comprobada reducen la calidad de la obra y el crecimiento del país. Aquí están los datos del contrato: ${WEBSITE_URL}`;
    }

    const encoded = encodeURIComponent(message);
    return {
        twitter: `https://twitter.com/intent/tweet?text=${encoded}`,
        whatsapp: `https://wa.me/?text=${encoded}`
    };
}
