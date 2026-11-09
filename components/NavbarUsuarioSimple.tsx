'use client';

import { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { logout } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { ChevronDown, Settings, LogOut, UserCircle, Grid } from 'lucide-react';

interface NavbarUsuarioSimpleProps {
  children?: ReactNode;
}

export default function NavbarUsuarioSimple({ children }: NavbarUsuarioSimpleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const cerrarSesion = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <nav className="bg-blue-900 text-white shadow-md relative z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 w-full">
            
            {/* Izquierda: Título / Logo */}
            <div className="font-bold text-lg tracking-wide flex-shrink-0">
              <a href="/" className="text-white hover:text-blue-200 transition">
                Repositorio IUJO | Usuario
              </a>
            </div>

            {/* Derecha: Botón tarjetas, perfil y cerrar sesión */}
            <div className="relative flex-shrink-0 flex items-center gap-2">
              <button onClick={() => router.push('/')} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <Grid className="h-4 w-4" /> Tarjetas
              </button>

              <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none"
              >
                {usuario ? (
                  <>
                    <UserCircle className="h-4 w-4 mr-1" />
                    <span>{`${usuario.nombre} ${usuario.apellido}`}</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <UserCircle className="h-4 w-4 mr-1" />
                    <span className="text-gray-300">Usuario</span>
                  </>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 text-gray-800 z-50">
                  <a
                    href="/cuenta"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition block"
                  >
                    <Settings className="h-4 w-4 text-gray-600" /> Configuración
                  </a>
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={cerrarSesion}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition block w-full text-left"
                    >
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
              </div>
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
