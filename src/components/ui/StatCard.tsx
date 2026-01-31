import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrencyShort } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isCurrency?: boolean;
  color?: 'green' | 'red' | 'blue' | 'purple' | 'orange' | 'gray';
}

const colorClasses = {
  green: 'bg-[#00A896]/5 text-[#00A896] border-[#00A896]/20', // Verde Talavera
  red: 'bg-red-50 text-red-700 border-red-200',
  blue: 'bg-[#004B57]/5 text-[#004B57] border-[#004B57]/20',   // Azul Vigilante
  purple: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  orange: 'bg-[#F29100]/5 text-[#F29100] border-[#F29100]/20', // Oro Ciudadano
  gray: 'bg-gray-50 text-gray-700 border-gray-200',
};

const iconBgClasses = {
  green: 'bg-[#00A896]/10',
  red: 'bg-red-100',
  blue: 'bg-[#004B57]/10',
  purple: 'bg-indigo-100',
  orange: 'bg-[#F29100]/10',
  gray: 'bg-gray-100',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  isCurrency = false,
  color = 'blue',
}: StatCardProps) {
  const displayValue = isCurrency && typeof value === 'number'
    ? formatCurrencyShort(value)
    : value;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={`rounded-xl border p-6 ${colorClasses[color]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2 tabular-nums">{displayValue}</p>
          {subtitle && (
            <p className="text-sm mt-1 opacity-70">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
