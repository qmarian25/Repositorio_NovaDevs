'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Search, Grid, LogOut } from 'lucide-react';

interface NavbarInvitadoSimpleProps {
  children?: ReactNode;
}

export default function NavbarInvitadoSimple({ children }: NavbarInvitadoSimpleProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBuscar = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <nav className="bg-blue-900 text-white shadow-md relative z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 w-full">
            
            {/* Izquierda: Título / Logo */}
            <div className="font-bold text-lg tracking-wide flex-shrink-0">
              <a href="/invitado" className="text-white hover:text-blue-200 transition">
                Repositorio IUJO | Invitado
              </a>
            </div>

            {/* Centro: Barra de Búsqueda */}
            <div className="flex-1 max-w-xl relative hidden sm:block">
              <Search
                className="absolute left-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-500 transition"
                onClick={handleBuscar}
              />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  placeholder="Buscar documentos..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Derecha: Botón volver, volver al repositorio y etiqueta de Invitado */}
            <div className="relative flex-shrink-0 flex items-center gap-2">
              <button onClick={() => router.push('/login')} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <LogOut className="h-4 w-4" /> Volver
              </button>
              <button onClick={() => router.push('/invitado')} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <Grid className="h-4 w-4" /> Tarjetas
              </button>
              <button className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3.5 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <span className="text-blue-100 font-medium">Invitado</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col">
          {/* Contenido inyectado por la página */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </div>
        </div>

        <Footer/>
      </div>
    </>
  );
}
