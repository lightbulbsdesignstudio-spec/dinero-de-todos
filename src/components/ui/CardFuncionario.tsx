'use client';

import Image from 'next/image';

interface Funcionario {
  id: string;
  nombre: string;
  cargo: string;
  foto?: string;
  partido?: string;
  tipoEleccion?: 'directo' | 'plurinominal';
  asistencia?: number;      // 0-100
  desempeno?: number;       // 0-100
  votacionesAFavor?: number;
  iniciativas?: number;
}

interface CardFuncionarioProps {
  funcionario: Funcionario;
  onClick?: () => void;
  compact?: boolean;
}

// Mini barra de progreso
function MiniBarra({ 
  valor, 
  color = 'talavera',
  label 
}: { 
  valor: number; 
  color?: 'talavera' | 'oro' | 'danger';
  label?: string;
}) {
  const colores = {
    talavera: '#00A896',
    oro: '#F29100',
    danger: '#f87171'
  };
  
  const colorFinal = valor >= 80 ? colores.talavera 
    : valor >= 60 ? colores.oro 
    : colores.danger;

  return (
    <div className="flex-1">
      {label && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label}</span>
          <span className="font-medium" style={{ color: colorFinal }}>{valor}%</span>
        </div>
      )}
      <div className="mini-barra">
        <div 
          className="mini-barra-fill"
          style={{ width: `${valor}%`, backgroundColor: colorFinal }}
        />
      </div>
    </div>
  );
}

// Badge de tipo de elección
function BadgeEleccion({ tipo }: { tipo: 'directo' | 'plurinominal' }) {
  return (
    <span className={`badge ${tipo === 'directo' ? 'badge-exito' : 'badge-neutro'}`}>
      {tipo === 'directo' ? 'Elección Directa' : 'Plurinominal'}
    </span>
  );
}

export default function CardFuncionario({ 
  funcionario, 
  onClick,
  compact = false 
}: CardFuncionarioProps) {
  const {
    nombre,
    cargo,
    foto,
    partido,
    tipoEleccion,
    asistencia = 0,
    desempeno = 0,
    votacionesAFavor,
    iniciativas
  } = funcionario;

  // Versión compacta
  if (compact) {
    return (
      <div 
        className="card-funcionario flex items-center gap-4 cursor-pointer"
        onClick={onClick}
      >
        <div className="relative">
          {foto ? (
            <Image 
              src={foto} 
              alt={nombre}
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-[#00A896]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#004B57] flex items-center justify-center text-white font-bold">
              {nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#004B57] truncate">{nombre}</p>
          <p className="text-sm text-gray-500 truncate">{cargo}</p>
        </div>

        <MiniBarra valor={asistencia} />
      </div>
    );
  }

  // Versión completa
  return (
    <div 
      className="card-funcionario cursor-pointer"
      onClick={onClick}
    >
      {/* Header con foto y datos básicos */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          {foto ? (
            <Image 
              src={foto} 
              alt={nombre}
              width={64}
              height={64}
              className="foto"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#004B57] flex items-center justify-center text-white font-bold text-xl border-3 border-[#00A896]">
              {nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#004B57] text-lg leading-tight">{nombre}</h4>
          <p className="text-sm text-gray-600 mt-0.5">{cargo}</p>
          {partido && (
            <p className="text-xs text-gray-400 mt-1">{partido}</p>
          )}
        </div>

        {tipoEleccion && (
          <BadgeEleccion tipo={tipoEleccion} />
        )}
      </div>

      {/* Mini gráficas de desempeño */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <MiniBarra valor={asistencia} label="Asistencia" />
        <MiniBarra valor={desempeno} label="Desempeño" />
      </div>

      {/* Stats adicionales */}
      {(votacionesAFavor !== undefined || iniciativas !== undefined) && (
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          {votacionesAFavor !== undefined && (
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-[#004B57]">{votacionesAFavor}</p>
              <p className="text-xs text-gray-500">Votaciones a favor</p>
            </div>
          )}
          {iniciativas !== undefined && (
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-[#F29100]">{iniciativas}</p>
              <p className="text-xs text-gray-500">Iniciativas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Grid de funcionarios
export function GridFuncionarios({
  funcionarios,
  onSelect,
  loading = false,
  compact = false
}: {
  funcionarios: Funcionario[];
  onSelect?: (f: Funcionario) => void;
  loading?: boolean;
  compact?: boolean;
}) {
  if (loading) {
    return (
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-funcionario animate-pulse">
            <div className="flex items-center gap-4">
              <div className="skeleton skeleton-avatar" />
              <div className="flex-1">
                <div className="skeleton h-4 w-2/3 mb-2" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {funcionarios.map(func => (
        <CardFuncionario 
          key={func.id}
          funcionario={func}
          onClick={() => onSelect?.(func)}
          compact={compact}
        />
      ))}
    </div>
  );
}
