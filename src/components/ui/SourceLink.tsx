'use client';

import { useState } from 'react';
import { 
  ExternalLink, 
  FileText, 
  Database, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Clock,
  ChevronDown,
  ChevronUp,
  Code,
  Info
} from 'lucide-react';

export interface FuenteDatos {
  id: string;
  nombre: string;                    // "Secretaría de Hacienda (SHCP)"
  descripcion?: string;              // Qué contiene esta fuente
  url: string;                       // Enlace directo al documento/API
  tipo: 'oficial' | 'procesado' | 'estimado';
  formato: 'pdf' | 'csv' | 'api' | 'xlsx' | 'html';
  fechaPublicacion?: string;         // Cuándo se publicó el dato original
  fechaConsulta: string;             // Cuándo lo consultamos nosotros
  metodologia?: string;              // Cómo se procesó (si aplica)
  scriptUrl?: string;                // Enlace al código de extracción
  notas?: string;                    // Advertencias o limitaciones
}

interface SourceLinkProps {
  fuentes: FuenteDatos[];
  variant?: 'inline' | 'badge' | 'detailed';
  className?: string;
}

// Configuración de confiabilidad por tipo
const CONFIABILIDAD = {
  oficial: {
    label: 'Fuente oficial',
    descripcion: 'Dato publicado directamente por una institución gubernamental',
    icono: ShieldCheck,
    color: '#10b981',
    bgColor: '#ecfdf5'
  },
  procesado: {
    label: 'Dato procesado',
    descripcion: 'Extraído de fuente oficial y transformado para visualización',
    icono: Shield,
    color: '#3b82f6',
    bgColor: '#eff6ff'
  },
  estimado: {
    label: 'Estimación',
    descripcion: 'Calculado a partir de múltiples fuentes o metodología propia',
    icono: ShieldAlert,
    color: '#f59e0b',
    bgColor: '#fffbeb'
  }
};

const FORMATO_ICONOS = {
  pdf: FileText,
  csv: Database,
  api: Code,
  xlsx: FileText,
  html: ExternalLink
};

export default function SourceLink({ fuentes, variant = 'badge', className = '' }: SourceLinkProps) {
  const [expandido, setExpandido] = useState(false);
  
  const fuentePrincipal = fuentes[0];
  const config = CONFIABILIDAD[fuentePrincipal.tipo];
  const IconoConfianza = config.icono;
  const IconoFormato = FORMATO_ICONOS[fuentePrincipal.formato];

  // Versión inline (solo icono con tooltip)
  if (variant === 'inline') {
    return (
      <a
        href={fuentePrincipal.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 ${className}`}
        title={`Fuente: ${fuentePrincipal.nombre}`}
      >
        <IconoConfianza className="w-3 h-3" style={{ color: config.color }} />
        <span className="underline">{fuentePrincipal.nombre}</span>
      </a>
    );
  }

  // Versión badge (compacta)
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <a
          href={fuentePrincipal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
          style={{ backgroundColor: config.bgColor, color: config.color }}
        >
          <IconoConfianza className="w-3.5 h-3.5" />
          <span>{config.label}</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
        {fuentes.length > 1 && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            +{fuentes.length - 1} más
          </button>
        )}
      </div>
    );
  }

  // Versión detailed (panel completo)
  return (
    <div className={`bg-gray-50 rounded-xl border border-gray-200 ${className}`}>
      {/* Header */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: config.bgColor }}
          >
            <IconoConfianza className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              Fuentes de estos datos
            </p>
            <p className="text-xs text-gray-500">
              {fuentes.length} fuente{fuentes.length > 1 ? 's' : ''} • {config.label}
            </p>
          </div>
        </div>
        {expandido ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Contenido expandido */}
      {expandido && (
        <div className="px-4 pb-4 space-y-4">
          {/* Indicador de confianza */}
          <div 
            className="p-3 rounded-lg text-sm"
            style={{ backgroundColor: config.bgColor }}
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: config.color }} />
              <p style={{ color: config.color }}>
                <strong>{config.label}:</strong> {config.descripcion}
              </p>
            </div>
          </div>

          {/* Lista de fuentes */}
          <div className="space-y-3">
            {fuentes.map((fuente) => {
              const FuenteIcono = FORMATO_ICONOS[fuente.formato];
              const fuenteConfig = CONFIABILIDAD[fuente.tipo];
              
              return (
                <div 
                  key={fuente.id}
                  className="p-4 bg-white rounded-lg border border-gray-100"
                >
                  {/* Nombre y enlace */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <a
                        href={fuente.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-[#006847] flex items-center gap-2"
                      >
                        <FuenteIcono className="w-4 h-4 text-gray-400" />
                        {fuente.nombre}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {fuente.descripcion && (
                        <p className="text-sm text-gray-500 mt-1">{fuente.descripcion}</p>
                      )}
                    </div>
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                      style={{ backgroundColor: fuenteConfig.bgColor, color: fuenteConfig.color }}
                    >
                      {fuente.formato.toUpperCase()}
                    </span>
                  </div>

                  {/* Fechas */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                    {fuente.fechaPublicacion && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Publicado: {fuente.fechaPublicacion}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Consultado: {fuente.fechaConsulta}</span>
                    </div>
                  </div>

                  {/* Metodología y script */}
                  {(fuente.metodologia || fuente.scriptUrl) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {fuente.metodologia && (
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>Procesamiento:</strong> {fuente.metodologia}
                        </p>
                      )}
                      {fuente.scriptUrl && (
                        <a
                          href={fuente.scriptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#006847] hover:underline"
                        >
                          <Code className="w-3 h-3" />
                          Ver código de extracción
                        </a>
                      )}
                    </div>
                  )}

                  {/* Notas/advertencias */}
                  {fuente.notas && (
                    <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-700">
                      <strong>Nota:</strong> {fuente.notas}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pie con enlaces útiles */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">¿Quieres verificar estos datos?</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.transparenciapresupuestaria.gob.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
              >
                <ExternalLink className="w-3 h-3" />
                Transparencia Presupuestaria
              </a>
              <a
                href="https://datos.gob.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
              >
                <ExternalLink className="w-3 h-3" />
                datos.gob.mx
              </a>
              <a
                href="https://www.plataformadetransparencia.org.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
              >
                <ExternalLink className="w-3 h-3" />
                Solicitar al INAI
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para mostrar fuente inline en cualquier número
export function FuenteInline({ 
  nombre, 
  url, 
  tipo = 'oficial' 
}: { 
  nombre: string; 
  url: string; 
  tipo?: 'oficial' | 'procesado' | 'estimado';
}) {
  const config = CONFIABILIDAD[tipo];
  const Icono = config.icono;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs hover:underline"
      style={{ color: config.color }}
      title={`${config.label}: ${nombre}`}
    >
      <Icono className="w-3 h-3" />
      <span>Fuente</span>
    </a>
  );
}
