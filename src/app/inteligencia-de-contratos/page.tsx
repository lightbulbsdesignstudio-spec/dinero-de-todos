import React from 'react';
import ContractIntelligence from '@/components/sections/ContractIntelligence';
import ContractNetwork from '@/components/sections/ContractNetwork';
import { ShieldAlert, Search, Database } from 'lucide-react';

export const metadata = {
    title: 'Inteligencia de Contratos | Dinero de Todos',
    description: 'Auditoría forense de contratos públicos y redes de riesgo de proveedores.',
};

export default function ContractIntelligencePage() {
    return (
        <main className="min-h-screen bg-[#020817] text-white">

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Unidad de Inteligencia Ciudadana</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
                        ¿Qué empresas ganan con <br className="hidden md:block" />
                        <span className="text-[#00A896]">el gasto de gobierno?</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        Auditamos la red de contratos de los 13 Proyectos Estratégicos. Detectamos riesgos analizando la madurez de la empresa, listados EFOS del SAT y transparencia de domicilios.
                    </p>
                </div>

                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#004B57]/20 to-transparent pointer-events-none" />
            </section>

            {/* Main Forensic Tool */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-24">

                    {/* Section 1: Project Spotlight */}
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black flex items-center gap-4">
                                    <Database className="w-8 h-8 text-[#00A896]" />
                                    Spotlight de Proyectos
                                </h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Los 13 Megaproyectos bajo la lupa ciudadana</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-gray-400">
                                    <span className="text-red-500 mr-2">●</span> ALTO RIESGO
                                </div>
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-gray-400">
                                    <span className="text-[#00A896] mr-2">●</span> CONFIABLE
                                </div>
                            </div>
                        </div>
                        <ContractNetwork />
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Section 2: Radar Search & Leaderboard */}
                    <div className="space-y-12">
                        <div className="space-y-4 text-center">
                            <h2 className="text-3xl font-black">Radar de Inspección</h2>
                            <p className="text-gray-400 font-medium">Busca una empresa ganadora o explora el ranking global de contratos.</p>
                        </div>
                        <ContractIntelligence />
                    </div>

                </div>
            </section>

        </main>
    );
}
