'use client';

import { GitBranch, Search } from 'lucide-react';
import { humanizarNumero } from '@/lib/humanizar';

interface LandingHeroProps {
    totalAprobado: number;
}

export default function LandingHero({ totalAprobado }: LandingHeroProps) {
    return (
        <section className="relative bg-gradient-to-br from-[#004B57] via-[#003d47] to-[#001d25] text-white overflow-hidden pb-32 pt-24">
            {/* Dynamic Light Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#00A896]/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-[#F29100]/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl stagger-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-[#F29100] animate-pulse shadow-[0_0_8px_#F29100]"></span>
                        <span className="text-white/90">Monitor Ciudadano Activo • PEF 2026</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tighter">
                        El Dinero <br />
                        <span className="text-gradient-premium">de Todos</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-3xl font-medium">
                        Dices que la política no es lo tuyo. <span className="text-[#F29100] font-bold">Los políticos cuentan con eso.</span> <br className="hidden md:block" />
                        Mientras tú no miras, ellos se gastan tus impuestos y hacen acuerdos con empresas para que lleguen a sus bolsillos y no a formar un país con futuro. <br className="hidden md:block" />
                        En <span className="text-[#00A896] font-bold">Dinero de Todos</span> queremos que rápidamente puedas saber en qué se está gastando el presupuesto nacional y quiénes tienen esos contratos para que tengas más información cuando te prometan cosas en campañas y decidas mejor a quiénes quieres gobernando.
                    </p>

                    <div className="flex flex-wrap gap-5">
                        <a
                            href="#la-receta"
                            className="group relative inline-flex items-center gap-3 bg-[#00A896] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#00937f] transition-all shadow-[0_20px_40px_rgba(0,168,150,0.35)] hover:-translate-y-1"
                        >
                            <GitBranch className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            ¿Cómo vamos vs el mundo?
                        </a>
                        <a
                            href="#la-receta"
                            className="group inline-flex items-center gap-3 glass-dark text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/20 hover:-translate-y-1"
                        >
                            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            Mide la Receta del Futuro
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
