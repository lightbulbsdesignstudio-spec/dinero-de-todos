import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#004B57] text-white patron-talavera">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marca - Dinero de Todos */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo-dinero-todos.png"
                alt="Dinero de Todos"
                width={80}
                height={80}
                className="w-16 h-16 object-contain"
              />
              <span className="font-bold text-xl text-white">
                Dinero <span className="text-[#00A896]">de Todos</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Plataforma ciudadana para el seguimiento del gasto público y la rendición de cuentas en México.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-semibold text-white mb-4">Descubre</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mexico" className="text-gray-400 hover:text-white transition-colors text-sm">
                  ¿Cómo va México? (Score)
                </Link>
              </li>
              <li>
                <Link href="/analisis-del-gasto" className="text-gray-400 hover:text-white transition-colors text-sm">
                  ¿Cómo ha gastado el Gobierno?
                </Link>
              </li>
              <li>
                <Link href="/vigilancia-2026" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Vigilancia 2026 (Presupuesto)
                </Link>
              </li>
              <li>
                <Link href="/inteligencia-de-contratos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Inteligencia de Contratos (Forensic)
                </Link>
              </li>
            </ul>
          </div>

          {/* Fuentes de datos */}
          <div>
            <h3 className="font-semibold text-white mb-4">Fuentes de Datos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.transparenciapresupuestaria.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  SHCP <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.plataformadetransparencia.org.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  PNT / INAI <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.asf.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  ASF <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://datos.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  Datos Abiertos <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#00A896]/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2026 <span className="text-[#F29100]">$</span> Dinero de Todos. Datos con fines demostrativos.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <Link href="/metodologia" className="hover:text-[#00A896] transition-colors">
              Metodología
            </Link>
            <Link href="/api" className="hover:text-[#00A896] transition-colors">
              API
            </Link>
            <Link href="/privacidad" className="hover:text-[#00A896] transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
