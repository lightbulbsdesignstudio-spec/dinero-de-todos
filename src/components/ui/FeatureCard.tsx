import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

// Colores de marca "Dinero de Todos"
const gradients = {
  green: 'from-[#00A896] to-[#007d6e]',      // Verde Talavera
  blue: 'from-[#004B57] to-[#003540]',        // Azul Vigilante
  purple: 'from-[#00A896] to-[#004B57]',      // Combinación marca
  orange: 'from-[#F29100] to-[#d97f00]',      // Oro Ciudadano
};

const bgHovers = {
  green: 'hover:bg-[#00A896]/5',
  blue: 'hover:bg-[#004B57]/5',
  purple: 'hover:bg-[#00A896]/5',
  orange: 'hover:bg-[#F29100]/5',
};

export default function FeatureCard({
  title,
  description,
  href,
  icon: Icon,
  color,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`group block p-8 rounded-[32px] border border-gray-100 bg-white hover:bg-white/80 transition-all duration-500 hover:shadow-premium hover:-translate-y-2 relative overflow-hidden`}
    >
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${gradients[color]} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full`} />

      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-black text-[#004B57] mb-3 group-hover:text-gradient-premium transition-all">
        {title}
      </h3>

      <p className="text-gray-500 text-base leading-relaxed mb-6 font-medium">
        {description}
      </p>

      <div className="flex items-center gap-2 text-[#00A896] font-bold text-sm uppercase tracking-widest">
        <span>Explorar</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
      </div>
    </Link>
  );
}
