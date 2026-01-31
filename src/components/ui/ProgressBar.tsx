import { getExecutionColor } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const color = getExecutionColor(percentage);

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{percentage.toFixed(1)}% gastado</span>
          <span>{max.toLocaleString('es-MX')}</span>
        </div>
      )}
    </div>
  );
}
