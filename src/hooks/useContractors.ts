'use client';

import { useState, useEffect } from 'react';

export interface Contract {
    project_id: string;
    project_name: string;
    amount: number;
}

export interface Company {
    id: string;
    name: string;
    rfc: string;
    total_amount: number;
    creation_date: string;
    address: string;
    risk_score: 'low' | 'medium' | 'high';
    risk_reasons: string[];
    contracts: Contract[];
}

export interface StrategicNode {
    id: string;
    name: string;
    value: number;
}

export interface ContractorsData {
    meta: {
        version: string;
        last_updated: string;
    };
    companies: Company[];
    strategic_nodes: StrategicNode[];
}

export function useContractors() {
    const [data, setData] = useState<ContractorsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMasterData() {
            try {
                const masterData = await import('@/data/contractors_master.json');

                // Zero Latency: Carga directa
                // await new Promise(resolve => setTimeout(resolve, 300));

                setData(masterData.default as unknown as ContractorsData);
                setLoading(false);
            } catch (err) {
                console.error('Error loading Contractors Master Data:', err);
                setError('No se pudo cargar la base de datos de contratistas.');
                setLoading(false);
            }
        }

        fetchMasterData();
    }, []);

    return { data, loading, error };
}
