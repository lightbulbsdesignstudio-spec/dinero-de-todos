'use client';

import { useState } from 'react';
import { MessageCircleQuestion, AlertTriangle, HelpCircle, X, Send, ExternalLink } from 'lucide-react';

interface ActionTriggerProps {
  // Contexto del dato que se está viendo
  contexto: {
    seccion: string;        // ej: "Presupuesto por estado"
    elemento?: string;      // ej: "Chiapas"
    valor?: string;         // ej: "$19,526 por habitante"
    fuente?: string;        // ej: "SHCP 2024"
  };
  // Estilo
  variant?: 'inline' | 'floating' | 'compact';
  className?: string;
}

type AccionTipo = 'error' | 'anomalia' | 'explicacion' | null;

export default function ActionTrigger({ contexto, variant = 'inline', className = '' }: ActionTriggerProps) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [accionSeleccionada, setAccionSeleccionada] = useState<AccionTipo>(null);
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const acciones = [
    {
      id: 'error' as AccionTipo,
      icono: AlertTriangle,
      titulo: '¿Ves un error?',
      descripcion: 'Los datos no coinciden con la realidad o hay un error de cálculo',
      placeholder: 'Describe el error que encontraste. Por ejemplo: "El porcentaje de pobreza de mi estado es diferente según CONEVAL..."',
      color: '#dc2626'
    },
    {
      id: 'anomalia' as AccionTipo,
      icono: MessageCircleQuestion,
      titulo: 'Reportar anomalía',
      descripcion: 'Algo no parece correcto o requiere investigación',
      placeholder: 'Describe qué te parece extraño. Por ejemplo: "¿Por qué este municipio recibe tanto más que los demás?"',
      color: '#f59e0b'
    },
    {
      id: 'explicacion' as AccionTipo,
      icono: HelpCircle,
      titulo: 'Pedir explicación',
      descripcion: 'No entiendes algo y necesitas más información',
      placeholder: '¿Qué te gustaría que te expliquemos? Por ejemplo: "¿Cómo se calcula la fórmula de distribución?"',
      color: '#2563eb'
    }
  ];

  const handleEnviar = () => {
    // En producción, esto enviaría a un backend/API
    console.log('Reporte enviado:', {
      tipo: accionSeleccionada,
      contexto,
      mensaje,
      timestamp: new Date().toISOString()
    });
    setEnviado(true);
    setTimeout(() => {
      setModalAbierto(false);
      setEnviado(false);
      setAccionSeleccionada(null);
      setMensaje('');
    }, 2000);
  };

  const abrirModal = (tipo: AccionTipo) => {
    setAccionSeleccionada(tipo);
    setModalAbierto(true);
  };

  // Versión compacta (solo iconos)
  if (variant === 'compact') {
    return (
      <>
        <div className={`flex items-center gap-1 ${className}`}>
          {acciones.map(accion => (
            <button
              key={accion.id}
              onClick={() => abrirModal(accion.id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
              title={accion.titulo}
            >
              <accion.icono 
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600" 
              />
            </button>
          ))}
        </div>
        {modalAbierto && <Modal />}
      </>
    );
  }

  // Versión flotante (para esquina de visualizaciones)
  if (variant === 'floating') {
    return (
      <>
        <div className={`flex items-center gap-2 ${className}`}>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MessageCircleQuestion className="w-4 h-4" />
            <span>¿Dudas o errores?</span>
          </button>
        </div>
        {modalAbierto && <Modal />}
      </>
    );
  }

  // Versión inline (para tablas y listas)
  function Modal() {
    const accionActual = acciones.find(a => a.id === accionSeleccionada);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">
              {accionSeleccionada ? accionActual?.titulo : 'Participa como auditor ciudadano'}
            </h3>
            <button 
              onClick={() => {
                setModalAbierto(false);
                setAccionSeleccionada(null);
                setMensaje('');
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {enviado ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">¡Gracias por participar!</h4>
                <p className="text-gray-600">
                  Tu reporte ha sido registrado. Un equipo lo revisará pronto.
                </p>
              </div>
            ) : !accionSeleccionada ? (
              <>
                {/* Contexto del dato */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estás viendo</p>
                  <p className="font-medium text-gray-900">{contexto.seccion}</p>
                  {contexto.elemento && (
                    <p className="text-sm text-gray-600">{contexto.elemento}</p>
                  )}
                  {contexto.valor && (
                    <p className="text-sm font-semibold text-emerald-600 mt-1">{contexto.valor}</p>
                  )}
                  {contexto.fuente && (
                    <p className="text-xs text-gray-400 mt-2">Fuente: {contexto.fuente}</p>
                  )}
                </div>

                {/* Opciones de acción */}
                <p className="text-sm text-gray-600 mb-4">
                  Como ciudadano, tienes derecho a cuestionar, reportar y pedir explicaciones sobre los datos públicos.
                </p>
                <div className="space-y-2">
                  {acciones.map(accion => (
                    <button
                      key={accion.id}
                      onClick={() => setAccionSeleccionada(accion.id)}
                      className="w-full flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
                    >
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${accion.color}15` }}
                      >
                        <accion.icono className="w-5 h-5" style={{ color: accion.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{accion.titulo}</p>
                        <p className="text-sm text-gray-500">{accion.descripcion}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Formulario de reporte */}
                <button
                  onClick={() => setAccionSeleccionada(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                  ← Volver
                </button>

                <div 
                  className="p-4 rounded-xl mb-4"
                  style={{ backgroundColor: `${accionActual?.color}10` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {accionActual && <accionActual.icono className="w-5 h-5" style={{ color: accionActual.color }} />}
                    <span className="font-medium" style={{ color: accionActual?.color }}>
                      {accionActual?.titulo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{accionActual?.descripcion}</p>
                </div>

                {/* Contexto */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-gray-500">
                    Reportando sobre: <strong className="text-gray-700">{contexto.seccion}</strong>
                    {contexto.elemento && <> — {contexto.elemento}</>}
                  </p>
                </div>

                {/* Textarea */}
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder={accionActual?.placeholder}
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm"
                />

                {/* Nota de privacidad */}
                <p className="text-xs text-gray-400 mt-2 mb-4">
                  Tu reporte es anónimo. No recopilamos datos personales.
                </p>

                {/* Botón enviar */}
                <button
                  onClick={handleEnviar}
                  disabled={!mensaje.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#006847] text-white py-3 rounded-xl font-medium hover:bg-[#005438] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Enviar reporte
                </button>
              </>
            )}
          </div>

          {/* Footer con enlaces */}
          {!enviado && !accionSeleccionada && (
            <div className="px-4 pb-4">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 mb-2">También puedes:</p>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="https://www.plataformadetransparencia.org.mx/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#006847] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Solicitar información (INAI)
                  </a>
                  <a 
                    href="https://www.asf.gob.mx/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#006847] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Auditoría Superior de la Federación
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl ${className}`}>
        <p className="text-sm text-gray-600 flex-1">
          ¿Ves algo que no cuadra?
        </p>
        <div className="flex items-center gap-2">
          {acciones.map(accion => (
            <button
              key={accion.id}
              onClick={() => abrirModal(accion.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ 
                backgroundColor: `${accion.color}10`,
                color: accion.color
              }}
            >
              <accion.icono className="w-3.5 h-3.5" />
              {accion.titulo}
            </button>
          ))}
        </div>
      </div>
      {modalAbierto && <Modal />}
    </>
  );
}
