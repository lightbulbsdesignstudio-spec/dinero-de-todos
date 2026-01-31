'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    AlertTriangle,
    ShieldAlert,
    FileText,
    ChevronRight,
    CircleAlert,
    Building2,
    Calendar,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { useContractors } from '@/hooks/useContractors';
import { humanizarNumero } from '@/lib/humanizar';

export default function ContractIntelligence() {
    const { data, loading } = useContractors();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    // Initial load selection
    useMemo(() => {
        if (data?.companies?.length && !selectedCompanyId) {
            setSelectedCompanyId(data.companies[0].id);
        }
    }, [data, selectedCompanyId]);

    const filteredCompanies = useMemo(() => {
        if (!data) return [];
        return data.companies.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.contracts.some(p => p.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
        ).sort((a, b) => b.total_amount - a.total_amount);
    }, [searchTerm, data]);

    const selectedCompany = useMemo(() =>
        data?.companies.find(c => c.id === selectedCompanyId) || null
        , [selectedCompanyId, data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="w-12 h-12 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Buscador Central (El Radar) */}
            <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-[#00A896]" />
                </div>
                <input
                    type="text"
                    placeholder="Escribe el nombre de una empresa o proyecto..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-8 pl-18 pr-6 text-2xl font-black text-white focus:outline-none focus:ring-4 focus:ring-[#00A896]/20 transition-all placeholder:text-white/10 shadow-2xl"
                    style={{ paddingLeft: '4.5rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#00A896]/10 border border-[#00A896]/20 rounded-xl">
                        <div className="w-2 h-2 bg-[#00A896] rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A896]">Radar Ciudadano 24/7</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* List View (Inspection Queue) */}
                <div className="lg:col-span-5 space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#020817] py-2 z-10">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Resultados del Radar</h3>
                        <span className="text-[10px] font-black bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">{filteredCompanies.length} hallazgos</span>
                    </div>

                    {filteredCompanies.map((company, index) => (
                        <button
                            key={company.id}
                            onClick={() => setSelectedCompanyId(company.id)}
                            className={`w-full group p-6 rounded-3xl border transition-all flex items-center gap-5 text-left ${selectedCompanyId === company.id
                                ? 'bg-[#004B57] border-[#00A896]/50 shadow-2xl shadow-[#00A896]/10'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${company.risk_score === 'high' ? 'bg-red-500/20 text-red-500' :
                                company.risk_score === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                                    'bg-[#00A896]/20 text-[#00A896]'
                                }`}>
                                #{index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-black text-sm md:text-base truncate transition-colors ${selectedCompanyId === company.id ? 'text-white' : 'text-gray-300'}`}>
                                    {company.name}
                                </h4>
                                <div className="hidden md:flex items-center gap-3 mt-1 font-mono text-[10px] font-bold text-gray-500">
                                    {company.rfc}
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-lg font-black text-white">
                                    ${humanizarNumero(company.total_amount).textoCorto}
                                </div>
                                {company.risk_score === 'high' && <ShieldAlert className="w-4 h-4 text-red-500 ml-auto mt-1" />}
                                {company.risk_score === 'medium' && <CircleAlert className="w-4 h-4 text-amber-500 ml-auto mt-1" />}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail View (Ficha Forense) */}
                <div className="lg:col-span-7 sticky top-32">
                    <AnimatePresence mode="wait">
                        {selectedCompany ? (
                            <motion.div
                                key={selectedCompany.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/[0.03] border border-white/10 rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                            >
                                {/* Background Glow */}
                                <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none ${selectedCompany.risk_score === 'high' ? 'bg-red-500' :
                                    selectedCompany.risk_score === 'medium' ? 'bg-amber-500' : 'bg-[#00A896]'
                                    }`} />

                                <div className="relative z-10 space-y-10">
                                    {/* Header Detail */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-xl">
                                                <Building2 className="w-6 h-6 text-[#00A896]" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00A896]">Inspección Forense</span>
                                        </div>
                                        <h2 className="text-4xl font-black tracking-tight leading-none">{selectedCompany.name}</h2>
                                        <div className="font-mono text-gray-500 font-bold uppercase tracking-widest text-lg">{selectedCompany.rfc}</div>
                                    </div>

                                    {/* Main Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Monto Total Ganado</span>
                                            <div className="text-4xl font-black text-white tracking-tighter">
                                                ${humanizarNumero(selectedCompany.total_amount).texto}
                                            </div>
                                        </div>
                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center gap-4">
                                                <Calendar className="w-5 h-5 text-[#00A896]" />
                                                <div>
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-600">Creación</span>
                                                    <span className="font-bold text-white text-sm">{selectedCompany.creation_date}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <MapPin className="w-5 h-5 text-[#00A896]" />
                                                <div>
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-600">Domicilio Fiscal</span>
                                                    <span className="font-bold text-white text-[11px] leading-tight">{selectedCompany.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk Verdict */}
                                    <div className={`p-8 rounded-[32px] border ${selectedCompany.risk_score === 'high' ? 'bg-red-500/10 border-red-500/30' :
                                        selectedCompany.risk_score === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                                            'bg-[#00A896]/10 border-[#00A896]/30'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-6">
                                            <ShieldAlert className={`w-5 h-5 ${selectedCompany.risk_score === 'high' ? 'text-red-500' :
                                                selectedCompany.risk_score === 'medium' ? 'text-amber-500' : 'text-[#00A896]'
                                                }`} />
                                            <span className="font-black text-sm uppercase tracking-widest">Veredicto Ciudadano</span>
                                        </div>
                                        {selectedCompany.risk_reasons.length > 0 ? (
                                            <div className="space-y-4">
                                                {selectedCompany.risk_reasons.map((reason, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${selectedCompany.risk_score === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                        <p className="font-bold text-white/90 leading-relaxed italic">
                                                            "{reason}"
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="font-bold text-[#00A896]">Empresa con madurez y domicilio verificado. Bajo riesgo aparente.</p>
                                        )}
                                    </div>

                                    {/* Contracts Detail */}
                                    <div className="space-y-6">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-600">Contratos Estratégicos</span>
                                        <div className="space-y-3">
                                            {selectedCompany.contracts.map((contract, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#00A896]/20 flex items-center justify-center font-black text-[#00A896] text-xs">
                                                            P{i + 1}
                                                        </div>
                                                        <span className="font-black text-white text-sm">{contract.project_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-lg font-black text-white">${humanizarNumero(contract.amount).textoCorto}</span>
                                                        <ArrowUpRight className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-[48px]">
                                <div className="text-center space-y-4 opacity-30">
                                    <Search className="w-16 h-16 mx-auto" />
                                    <p className="font-black uppercase tracking-widest text-sm">Selecciona una empresa <br /> para auditar sus datos</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
