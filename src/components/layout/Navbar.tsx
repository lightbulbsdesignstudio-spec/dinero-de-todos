'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Building2,
  Trophy,
  ChevronRight,
  BarChart3,
  GitBranch,
  Search,
  Plane,
  MapPin,
  Wallet,
  BookOpen,
  Home,
  LucideIcon
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: '¿Cómo va México?', href: '/mexico', icon: Trophy },
  { name: 'Historia del Gasto', href: '/analisis-del-gasto', icon: BookOpen },
  { name: 'Vigilemos el 2026', href: '/vigilancia-2026', icon: Search },
  { name: 'Inteligencia de Contratos', href: '/inteligencia-de-contratos', icon: Building2, highlight: true }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-[#004B57] text-white shadow-lg sticky top-0 z-50 patron-talavera">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Dinero de Todos */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
            <Image
              src="/logo-dinero-todos.png"
              alt="Dinero de Todos"
              width={56}
              height={56}
              className="w-12 h-12 object-contain"
              priority
            />
            <span className="hidden lg:block font-bold text-xl text-white whitespace-nowrap">
              Dinero <span className="text-[#00A896]">de Todos</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all duration-300 whitespace-nowrap ${item.highlight
                    ? 'bg-[#00A896] text-white hover:bg-[#008f80] shadow-lg shadow-[#00A896]/20'
                    : isActive
                      ? 'bg-[#003d47] text-[#00A896] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive && !item.highlight ? 'text-[#00A896]' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-[#00A896]/30">
          <div className="px-4 py-3 space-y-2 bg-[#003d47]">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${item.highlight
                  ? 'bg-[#00A896] text-white'
                  : 'text-white/80 hover:bg-[#00A896]/20'
                  }`}
              >
                <item.icon className="w-5 h-5 text-inherit" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
