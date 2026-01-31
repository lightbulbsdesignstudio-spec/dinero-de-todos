'use client';

import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { humanizarNumero } from '@/lib/humanizar';

interface NumeroHumanoProps {
  valor: number;
  titulo?: string;
  mostrarDetalle?: boolean;
  tamano?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function NumeroHumano({ 
  valor, 
  titulo,
  mostrarDetalle = false,
  tamano = 'md',
  color
}: NumeroHumanoProps) {
  const [expandido, setExpandido] = useState(false);
  const humanizado = humanizarNumero(valor);

  const tamanos = {
    sm: { principal: 'text-lg', secundario: 'text-xs' },
    md: { principal: 'text-2xl', secundario: 'text-sm' },
    lg: { principal: 'text-4xl', secundario: 'text-base' },
  };

  return (
    <div className="space-y-1">
      {titulo && (
        <p className="text-sm text-gray-500">{titulo}</p>
      )}
      
      {/* Número principal */}
      <p 
        className={`font-bold tabular-nums ${tamanos[tamano].principal}`}
        style={color ? { color } : undefined}
      >
        {humanizado.texto}
      </p>
      
      {/* Per cápita */}
      <p className={`text-gray-600 ${tamanos[tamano].secundario}`}>
        {humanizado.perCapita}
      </p>

      {/* Botón para expandir */}
      {mostrarDetalle && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-1 text-xs text-[#006847] hover:underline mt-1"
        >
          <Info className="w-3 h-3" />
          {expandido ? 'Menos contexto' : '¿Qué significa este número?'}
          {expandido ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}

      {/* Detalle expandido */}
      {expandido && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-lg">{humanizado.comparacionIcono}</span>
            <span className="text-gray-700">{humanizado.comparacion}</span>
          </div>
          <p className="text-gray-500 text-xs">
            {humanizado.contexto}
          </p>
        </div>
      )}
    </div>
  );
}
