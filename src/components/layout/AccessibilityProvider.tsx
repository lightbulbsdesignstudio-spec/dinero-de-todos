'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Eye, Type, X, Settings } from 'lucide-react';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export default function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Cargar preferencias guardadas
  useEffect(() => {
    const saved = localStorage.getItem('a11y-preferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setHighContrast(prefs.highContrast || false);
      setLargeText(prefs.largeText || false);
    }
  }, []);

  // Aplicar y guardar preferencias
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }

    localStorage.setItem('a11y-preferences', JSON.stringify({ highContrast, largeText }));
  }, [highContrast, largeText]);

  return (
    <>
      {/* Skip link para navegación por teclado */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Saltar al contenido principal
      </a>

      {children}

      {/* Botón flotante de accesibilidad */}
      <div className="fixed bottom-4 left-4 z-50 no-print">
        {isOpen ? (
          <div 
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64"
            role="dialog"
            aria-label="Opciones de accesibilidad"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">Accesibilidad</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Cerrar menú de accesibilidad"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  highContrast 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={highContrast}
              >
                <Eye className="w-4 h-4" />
                <div className="text-left flex-1">
                  <p className="font-medium">Alto contraste</p>
                  <p className={`text-xs ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
                    Mejora visibilidad
                  </p>
                </div>
                <span className={`w-2 h-2 rounded-full ${highContrast ? 'bg-green-400' : 'bg-gray-300'}`} />
              </button>

              <button
                onClick={() => setLargeText(!largeText)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  largeText 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={largeText}
              >
                <Type className="w-4 h-4" />
                <div className="text-left flex-1">
                  <p className="font-medium">Texto grande</p>
                  <p className={`text-xs ${largeText ? 'text-gray-300' : 'text-gray-500'}`}>
                    Aumenta tamaño 20%
                  </p>
                </div>
                <span className={`w-2 h-2 rounded-full ${largeText ? 'bg-green-400' : 'bg-gray-300'}`} />
              </button>
            </div>

            <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              Las preferencias se guardan automáticamente
            </p>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
            aria-label="Abrir opciones de accesibilidad"
            title="Accesibilidad"
          >
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            {(highContrast || largeText) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </button>
        )}
      </div>
    </>
  );
}
