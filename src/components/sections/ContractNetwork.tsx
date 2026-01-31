'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { humanizarNumero } from '@/lib/humanizar';
import { useContractors } from '@/hooks/useContractors';
import ShareAction from '@/components/ui/ShareAction';
import {
    ShieldAlert,
    CircleAlert,
    Building2,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';

export default function ContractNetwork() {
    const { data, loading } = useContractors();

    const projectsWithData = useMemo(() => {
        if (!data) return [];

        return data.strategic_nodes.map(project => {
            // Find companies that have contracts for this project
            const winners = data.companies.filter(c =>
                c.contracts.some(contract => contract.project_id === project.id)
            ).map(c => ({
                ...c,
                projectAmount: c.contracts.find(con => con.project_id === project.id)?.amount || 0
            })).sort((a, b) => b.projectAmount - a.projectAmount);

            const totalProjectContracts = winners.reduce((sum, w) => sum + w.projectAmount, 0);
            const highRiskCount = winners.filter(w => w.risk_score === 'high').length;
            const mediumRiskCount = winners.filter(w => w.risk_score === 'medium').length;

            let statusColor = 'bg-[#00A896]';
            let statusText = 'Confiable';
            if (highRiskCount > 0) {
                statusColor = 'bg-red-500';
                statusText = 'ALTO RIESGO';
            } else if (mediumRiskCount > 0) {
                statusColor = 'bg-amber-500';
                statusText = 'RIESGO MEDIO';
            }

            return {
                ...project,
                winners,
                totalProjectContracts,
                highRiskCount,
                statusColor,
                statusText
            };
        });
    }, [data]);

    const [selectedProject, setSelectedProject] = React.useState<any>(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="w-12 h-12 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectsWithData.map((project, idx) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedProject(project)}
                        className="group bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden hover:bg-white/[0.04] transition-all flex flex-col h-full shadow-xl cursor-pointer"
                    >
                        {/* Project Header */}
                        <div className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${project.statusColor}`}>
                                    {project.statusText}
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-gray-400 group-hover:text-[#00A896] transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black mb-1 group-hover:text-[#00A896] transition-colors leading-tight">{project.name}</h3>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Proyecto Estratégico</p>
                        </div>

                        {/* Money Metric */}
                        <div className="px-8 py-6 bg-white/[0.02] border-y border-white/5">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Contratado Real (Muestra)</span>
                            <div className="flex items-end gap-2">
                                <div className="text-3xl font-black text-white leading-none">
                                    ${humanizarNumero(project.totalProjectContracts).textoCorto}
                                </div>
                                <TrendingUp className="w-4 h-4 text-[#00A896] mb-1" />
                            </div>
                        </div>

                        {/* Top Winners Snippet */}
                        <div className="p-8 flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Auditando Ganadores</span>
                                <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded text-gray-400">{project.winners.length} Emp.</span>
                            </div>

                            <div className="space-y-4">
                                {project.winners.slice(0, 3).map((winner: any) => (
                                    <div key={winner.id} className="flex items-center justify-between group/item">
                                        <div className="flex items-center gap-3">
                                            {winner.risk_score === 'high' ? (
                                                <ShieldAlert className="w-4 h-4 text-red-500" />
                                            ) : winner.risk_score === 'medium' ? (
                                                <CircleAlert className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-[#00A896]" />
                                            )}
                                            <div className="min-w-0">
                                                <span className="block text-sm font-bold text-gray-300 truncate w-32 group-hover/item:text-white transition-colors">{winner.name}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-white">${humanizarNumero(winner.projectAmount).textoCorto}</span>
                                    </div>
                                ))}
                                {project.winners.length === 0 && (
                                    <div className="text-center py-4 border-2 border-dashed border-white/5 rounded-2xl">
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Sin datos forenses aún</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="px-8 py-4 bg-[#00A896]/5 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#00A896]">Ver detalles forenses</span>
                            <ArrowUpRight className="w-4 h-4 text-[#00A896]" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Drill-Down Modal (Slide Over) */}
            <AnimatePresence>
                {selectedProject && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Slide Over Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#0F172A] border-l border-white/10 shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-white/10 bg-[#0F172A] z-10">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${selectedProject.statusColor}`}>
                                        {selectedProject.statusText}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-[#00A896]" />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black text-white mb-2 leading-tight">{selectedProject.name}</h2>
                                <div className="flex items-baseline gap-2 text-gray-400 font-medium">
                                    <span>Inversión Total Auditada:</span>
                                    <span className="text-white font-bold">${humanizarNumero(selectedProject.totalProjectContracts).texto}</span>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-8 bg-[#0F172A]">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#00A896] mb-6 sticky top-0 bg-[#0F172A] py-2">
                                    Ganadores del Contrato ({selectedProject.winners.length})
                                </h3>

                                <div className="space-y-4">
                                    {selectedProject.winners.map((winner: any, idx: number) => (
                                        <motion.div
                                            key={winner.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-[#00A896]/30 rounded-2xl p-4 flex items-center justify-between transition-all"
                                        >
                                            {/* Left: Company Data */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-sm group-hover:text-[#00A896] transition-colors">{winner.name}</span>
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">RFC: {winner.rfc}</span>
                                                </div>
                                            </div>

                                            {/* Right: Amount & Risk Badge */}
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className="block text-sm font-black text-white">${humanizarNumero(winner.projectAmount).textoCorto}</span>
                                                    <span className="text-[10px] text-gray-500">Monto Asignado</span>
                                                </div>

                                                {/* Risk Badge with Tooltip */}
                                                <div className="relative group/badge">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${winner.risk_score === 'high' ? 'bg-red-500/20 text-red-500' :
                                                        winner.risk_score === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                                                            'bg-[#00A896]/20 text-[#00A896]'
                                                        }`}>
                                                        {winner.risk_score === 'high' ? <ShieldAlert className="w-4 h-4" /> :
                                                            winner.risk_score === 'medium' ? <CircleAlert className="w-4 h-4" /> :
                                                                <div className="w-2 h-2 rounded-full bg-current" />}
                                                    </div>

                                                    {/* Tooltip */}
                                                    {(winner.risk_score === 'high' || winner.risk_score === 'medium') && (
                                                        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white text-slate-800 rounded-xl shadow-xl opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none z-50 text-xs font-medium border border-slate-100">
                                                            <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                                                <ShieldAlert className="w-3 h-3 text-red-500" />
                                                                Motivo de Riesgo:
                                                            </div>
                                                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                                                                {winner.risk_reasons.map((r: string, i: number) => (
                                                                    <li key={i}>{r}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {selectedProject.winners.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                                            <p className="text-sm text-gray-500 font-medium">No hay registros públicos disponibles para este proyecto.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer / Share Action */}
                            <div className="p-8 border-t border-white/10 bg-[#0F172A] z-20 sticky bottom-0">
                                <ShareAction
                                    scenario="project"
                                    data={{
                                        name: selectedProject.name,
                                        amount: selectedProject.totalProjectContracts,
                                        location: 'México'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
