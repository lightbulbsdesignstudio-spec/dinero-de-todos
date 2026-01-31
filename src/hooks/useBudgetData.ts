'use client';

import { useState, useEffect } from 'react';

export interface BudgetData {
    meta: {
        version: string;
        last_updated: string;
        source_url: string;
    };
    indicators: {
        national_score: number;
        innovation_gdp: number;
        health_budget_share: number;
        infrastructure_gdp: number;
        education_budget_share: number;
        bureaucracy_budget_share: number;
        state_rescues_share: number;
    };
    income_sources: {
        id: string;
        nombre: string;
        monto: number;
        porcentaje: number;
        color: string;
    }[];
    budget_totals: {
        grand_total: number;
        programmable: number;
        debt_cost: number;
        physical_investment: number;
    };
    strategic_projects: {
        name: string;
        value: number;
        description: string;
        coordinates?: { lat: number; lng: number };
        impact_radius?: string;
    }[];
    strategic_projects_concentration: {
        share_of_investment: number;
        regional_concentration: number;
    };
    sankey_data: {
        links: {
            source: string;
            target: string;
            value: number;
        }[];
    };
    state_finances: {
        promedio_nacional_per_capita: number;
        estados: {
            id: string;
            nombre: string;
            poblacion: number;
            totalFederal: number;
            participaciones: number;
            aportaciones: number;
            perCapita: number;
            perCapitaParticipaciones: number;
            perCapitaAportaciones: number;
            pobrezaPorcentaje: number;
        }[];
    };
}

export function useBudgetData() {
    const [data, setData] = useState<BudgetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMasterData() {
            try {
                // En el futuro esto será un fetch('/api/pef-2026')
                const response = await fetch('/data/pef_2026_master.json');

                // Como el archivo está en src/data, Next.js no lo sirve via HTTP directamente en public
                // Pero para este hack de "Fuente Única de Verdad", podemos importarlo dinámicamente
                // o moverlo a public. El usuario pidió src/data/pef_2026_master.json.
                // Usaremos import dinámico para simular el comportamiento de red.

                const masterData = await import('@/data/pef_2026_master.json');

                // Eliminamos latencia artificial para carga instantánea
                // await new Promise(resolve => setTimeout(resolve, 500));

                setData(masterData.default);
                setLoading(false);
            } catch (err) {
                console.error('Error loading Master Data:', err);
                setError('No se pudo cargar la Fuente Única de Verdad.');
                setLoading(false);
            }
        }

        fetchMasterData();
    }, []);

    return { data, loading, error };
}
