'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Grid, LogOut } from 'lucide-react';

interface NavbarAdminSimpleProps {
  children?: ReactNode;
}

export default function NavbarAdminSimple({ children }: NavbarAdminSimpleProps) {
  const router = useRouter();

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <nav className="bg-blue-900 text-white shadow-md relative z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 w-full">
            
            {/* Izquierda: Título / Logo */}
            <div className="font-bold text-lg tracking-wide flex-shrink-0">
              <a href="/admin/repositorio" className="text-white hover:text-blue-200 transition">
                Repositorio IUJO | Admin
              </a>
            </div>

            {/* Derecha: Botón volver, volver al repositorio y etiqueta de Admin */}
            <div className="relative flex-shrink-0 flex items-center gap-2">
              <button onClick={() => router.push('/admin')} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <LogOut className="h-4 w-4" /> Volver
              </button>
              <button onClick={() => router.push('/admin/repositorio')} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <Grid className="h-4 w-4" /> Tarjetas
              </button>
              <button className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3.5 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <span className="text-blue-100 font-medium">Admin</span>
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
