'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  Share2,
  Bell,
  CheckCircle2,
  Sparkles,
  Calendar,
  MessageSquare
} from 'lucide-react';

// Tipos de nudge
type NudgeType = 'progreso' | 'oportunidad' | 'celebracion' | 'recordatorio' | 'comparacion';

interface NudgeData {
  tipo: NudgeType;
  titulo: string;
  mensaje: string;
  accion?: {
    texto: string;
    url?: string;
    onClick?: () => void;
  };
  meta?: string;         // "3 de 5 completados"
  porcentaje?: number;   // Para barras de progreso
}

interface CivicNudgeProps {
  nudge: NudgeData;
  variant?: 'card' | 'banner' | 'toast';
  className?: string;
  onDismiss?: () => void;
}

// Configuración visual por tipo
const NUDGE_CONFIG = {
  progreso: {
    icono: TrendingUp,
    color: '#00A896',      // Verde Talavera
    bgColor: '#f0fcf9',
    borderColor: '#ccf2ee'
  },
  oportunidad: {
    icono: Lightbulb,
    color: '#F29100',      // Oro Ciudadano
    bgColor: '#fffcf5',
    borderColor: '#fdf3d9'
  },
  celebracion: {
    icono: Sparkles,
    color: '#004B57',      // Azul Vigilante
    bgColor: '#f0f7f8',
    borderColor: '#ccdee1'
  },
  recordatorio: {
    icono: Bell,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe'
  },
  comparacion: {
    icono: Target,
    color: '#00A896',      // Verde Talavera
    bgColor: '#f0fcf9',
    borderColor: '#ccf2ee'
  }
};

export default function CivicNudge({
  nudge,
  variant = 'card',
  className = '',
  onDismiss
}: CivicNudgeProps) {
  const config = NUDGE_CONFIG[nudge.tipo];
  const Icono = config.icono;

  // Versión toast (flotante temporal)
  if (variant === 'toast') {
    return (
      <div
        className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-xl shadow-lg border-l-4 animate-slide-up ${className}`}
        style={{
          backgroundColor: config.bgColor,
          borderLeftColor: config.color
        }}
      >
        <div className="flex items-start gap-3">
          <Icono className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: config.color }} />
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{nudge.titulo}</p>
            <p className="text-sm text-gray-600 mt-1">{nudge.mensaje}</p>
            {nudge.accion && (
              <button
                onClick={nudge.accion.onClick}
                className="mt-2 text-sm font-medium flex items-center gap-1 hover:underline"
                style={{ color: config.color }}
              >
                {nudge.accion.texto}
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  // Versión banner (horizontal)
  if (variant === 'banner') {
    return (
      <div
        className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${className}`}
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icono className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{nudge.titulo}</p>
            <p className="text-sm text-gray-600">{nudge.mensaje}</p>
          </div>
        </div>

        {nudge.accion && (
          <a
            href={nudge.accion.url || '#'}
            onClick={nudge.accion.onClick}
            className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ backgroundColor: config.color }}
          >
            {nudge.accion.texto}
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  // Versión card (por defecto)
  return (
    <div
      className={`p-5 rounded-xl border ${className}`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Icono className="w-5 h-5" style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{nudge.titulo}</p>
          {nudge.meta && (
            <p className="text-xs mt-0.5" style={{ color: config.color }}>
              {nudge.meta}
            </p>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4">{nudge.mensaje}</p>

      {/* Barra de progreso si aplica */}
      {nudge.porcentaje !== undefined && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${nudge.porcentaje}%`,
                backgroundColor: config.color
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {nudge.porcentaje}% completado
          </p>
        </div>
      )}

      {nudge.accion && (
        <a
          href={nudge.accion.url || '#'}
          onClick={nudge.accion.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: config.color }}
        >
          {nudge.accion.texto}
          <ArrowRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

// ============================================
// GENERADORES DE NUDGES CONTEXTUALES
// ============================================

// Transforma datos negativos en framing positivo
export function generarNudgePositivo(datos: {
  tipo: 'asistencia' | 'gasto' | 'participacion' | 'transparencia';
  valor: number;
  maximo: number;
  nombre?: string;
}): NudgeData {
  const porcentaje = Math.round((datos.valor / datos.maximo) * 100);
  const falta = datos.maximo - datos.valor;

  switch (datos.tipo) {
    case 'asistencia':
      // En lugar de "Faltista", framing positivo
      if (porcentaje >= 90) {
        return {
          tipo: 'celebracion',
          titulo: '¡Excelente asistencia!',
          mensaje: `${datos.nombre || 'Este representante'} ha asistido al ${porcentaje}% de las sesiones. ¡Reconócelo!`,
          accion: { texto: 'Compartir', url: '#compartir' },
          porcentaje
        };
      } else if (porcentaje >= 70) {
        return {
          tipo: 'oportunidad',
          titulo: 'Espacio para mejorar',
          mensaje: `${datos.nombre || 'Este representante'} ha asistido al ${porcentaje}% de sesiones. Faltan ${falta} para llegar al 100%. ¡Exígele más!`,
          accion: { texto: 'Enviar mensaje', url: '#contacto' },
          porcentaje,
          meta: `${datos.valor} de ${datos.maximo} sesiones`
        };
      } else {
        return {
          tipo: 'oportunidad',
          titulo: 'Tu voz importa',
          mensaje: `Con solo ${porcentaje}% de asistencia, tu representante necesita saber que lo estás observando. Tu participación puede cambiar esto.`,
          accion: { texto: 'Tomar acción', url: '#accion' },
          porcentaje,
          meta: `${datos.valor} de ${datos.maximo} sesiones`
        };
      }

    case 'gasto':
      // Para ejercicio presupuestal
      if (porcentaje >= 95) {
        return {
          tipo: 'progreso',
          titulo: 'Presupuesto casi ejercido',
          mensaje: `Se ha utilizado el ${porcentaje}% del presupuesto asignado. Verifica que se haya gastado correctamente.`,
          accion: { texto: 'Ver detalles', url: '#detalles' },
          porcentaje
        };
      } else if (porcentaje >= 50) {
        return {
          tipo: 'comparacion',
          titulo: 'Avance presupuestal',
          mensaje: `Va ${porcentaje}% de ejercicio. ¿Es el ritmo adecuado para este punto del año?`,
          accion: { texto: 'Comparar con otros', url: '#comparar' },
          porcentaje
        };
      } else {
        return {
          tipo: 'recordatorio',
          titulo: 'Subejercicio detectado',
          mensaje: `Solo ${porcentaje}% ejercido. El dinero no gastado podría estar ayudando a tu comunidad. Pregunta por qué.`,
          accion: { texto: 'Solicitar información', url: '#solicitud' },
          porcentaje
        };
      }

    case 'participacion':
      // Para participación ciudadana
      return {
        tipo: 'progreso',
        titulo: '¡Vas muy bien!',
        mensaje: `Has completado ${porcentaje}% de tu perfil cívico. Cada acción cuenta para fortalecer la democracia.`,
        accion: { texto: 'Siguiente paso', url: '#siguiente' },
        porcentaje,
        meta: `${datos.valor} de ${datos.maximo} acciones`
      };

    case 'transparencia':
      // Para índice de transparencia
      if (porcentaje >= 80) {
        return {
          tipo: 'celebracion',
          titulo: 'Alta transparencia',
          mensaje: `Esta institución cumple con ${porcentaje}% de sus obligaciones de transparencia. ¡Buen trabajo ciudadano por vigilar!`,
          porcentaje
        };
      } else {
        return {
          tipo: 'oportunidad',
          titulo: 'Transparencia mejorable',
          mensaje: `Solo ${porcentaje}% de cumplimiento. Puedes solicitar la información faltante a través del INAI.`,
          accion: { texto: 'Hacer solicitud', url: 'https://www.plataformadetransparencia.org.mx/' },
          porcentaje
        };
      }

    default:
      return {
        tipo: 'progreso',
        titulo: 'Progreso',
        mensaje: `${porcentaje}% completado`,
        porcentaje
      };
  }
}

// Nudges para la página de inicio / dashboard
export function generarNudgesContextuales(contexto: {
  visitaAnterior?: Date;
  seccionesVistas?: string[];
  accionesRealizadas?: number;
}): NudgeData[] {
  const nudges: NudgeData[] = [];

  // Si es primera visita o hace mucho que no viene
  if (!contexto.visitaAnterior) {
    nudges.push({
      tipo: 'celebracion',
      titulo: '¡Bienvenido, ciudadano vigilante!',
      mensaje: 'Cada visita tuya fortalece la democracia. Explora cómo se gasta tu dinero y qué puedes hacer al respecto.',
      accion: { texto: 'Comenzar tour', url: '#tour' }
    });
  }

  // Sugerir siguiente sección no vista
  const seccionesDisponibles = ['explorador', 'tu-estado', 'calculadora', 'flujo-recursos'];
  const noVistas = seccionesDisponibles.filter(s => !contexto.seccionesVistas?.includes(s));

  if (noVistas.length > 0) {
    const sugerencias: Record<string, NudgeData> = {
      'explorador': {
        tipo: 'oportunidad',
        titulo: '¿Ya exploraste el presupuesto?',
        mensaje: 'Descubre exactamente cómo se distribuyen los 9 billones de pesos del presupuesto federal.',
        accion: { texto: 'Explorar', url: '/explorador' }
      },
      'tu-estado': {
        tipo: 'oportunidad',
        titulo: '¿Cuánto recibe tu estado?',
        mensaje: 'Compara cuánto dinero federal llega a tu estado vs. el promedio nacional.',
        accion: { texto: 'Ver mi estado', url: '/tu-estado' }
      },
      'calculadora': {
        tipo: 'oportunidad',
        titulo: '¿Cuánto aportas tú?',
        mensaje: 'Calcula cuánto de tu sueldo va a impuestos y en qué se gasta.',
        accion: { texto: 'Calcular', url: '/calculadora' }
      },
      'flujo-recursos': {
        tipo: 'oportunidad',
        titulo: 'Sigue el dinero',
        mensaje: 'Ve de dónde viene y a dónde va el dinero público.',
        accion: { texto: 'Ver flujo', url: '/flujo-recursos' }
      }
    };

    nudges.push(sugerencias[noVistas[0]]);
  }

  // Celebrar acciones
  if (contexto.accionesRealizadas && contexto.accionesRealizadas > 0) {
    nudges.push({
      tipo: 'progreso',
      titulo: '¡Tu participación cuenta!',
      mensaje: `Has realizado ${contexto.accionesRealizadas} acción${contexto.accionesRealizadas > 1 ? 'es' : ''} ciudadana${contexto.accionesRealizadas > 1 ? 's' : ''}. Cada una ayuda a mejorar la transparencia.`,
      porcentaje: Math.min(contexto.accionesRealizadas * 20, 100),
      meta: `${contexto.accionesRealizadas} de 5 para siguiente nivel`
    });
  }

  return nudges;
}

// ============================================
// COMPONENTE DE PROGRESO CÍVICO
// ============================================

interface LogroCivico {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  completado: boolean;
  progreso?: number;
}

export function ProgresoCivico({
  logros,
  className = ''
}: {
  logros: LogroCivico[];
  className?: string;
}) {
  const completados = logros.filter(l => l.completado).length;
  const porcentaje = Math.round((completados / logros.length) * 100);

  return (
    <div className={`bg-gradient-to-br from-[#004B57]/5 to-[#00A896]/10 rounded-xl p-5 border border-[#00A896]/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-[#004B57]">Tu progreso cívico</h3>
          <p className="text-sm text-gray-600">{completados} de {logros.length} logros</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#00A896]">{porcentaje}%</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-3 bg-white rounded-full overflow-hidden mb-4 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#004B57] to-[#00A896] rounded-full transition-all duration-700"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      {/* Lista de logros */}
      <div className="space-y-2">
        {logros.map(logro => (
          <div
            key={logro.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${logro.completado ? 'bg-green-50' : 'bg-white/50'
              }`}
          >
            <span className="text-xl">{logro.icono}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium ${logro.completado ? 'text-green-700' : 'text-gray-700'}`}>
                {logro.nombre}
              </p>
              <p className="text-xs text-gray-500">{logro.descripcion}</p>
            </div>
            {logro.completado ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : logro.progreso !== undefined ? (
              <span className="text-xs text-gray-400">{logro.progreso}%</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// Logros predefinidos del portal
export const LOGROS_CIVICOS: LogroCivico[] = [
  {
    id: 'primera-visita',
    nombre: 'Ciudadano curioso',
    descripcion: 'Visitaste el portal por primera vez',
    icono: '👀',
    completado: false
  },
  {
    id: 'explorador',
    nombre: 'Explorador fiscal',
    descripcion: 'Revisaste el presupuesto de al menos 3 áreas',
    icono: '🔍',
    completado: false
  },
  {
    id: 'calculadora',
    nombre: 'Contribuyente informado',
    descripcion: 'Calculaste tu aportación fiscal',
    icono: '🧮',
    completado: false
  },
  {
    id: 'tu-estado',
    nombre: 'Vigilante local',
    descripcion: 'Revisaste los recursos de tu estado',
    icono: '🏠',
    completado: false
  },
  {
    id: 'reporte',
    nombre: 'Auditor ciudadano',
    descripcion: 'Reportaste un error o anomalía',
    icono: '📝',
    completado: false
  },
  {
    id: 'compartir',
    nombre: 'Multiplicador cívico',
    descripcion: 'Compartiste información con otros',
    icono: '📢',
    completado: false
  },
  {
    id: 'solicitud-inai',
    nombre: 'Demandante de transparencia',
    descripcion: 'Hiciste una solicitud de información',
    icono: '📋',
    completado: false
  }
];
