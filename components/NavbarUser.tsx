'use client';

import { ReactNode, useEffect, useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import { logout } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { Search, UserCircle, ChevronDown, Settings, LogOut, Filter, X, Home } from 'lucide-react';

interface NavbarUserProps {
  children?: ReactNode;
}

function NavbarContent({ children }: NavbarUserProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { usuario } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filtroCarrera, setFiltroCarrera] = useState(searchParams.get('carrera') || '');
  const [filtroTipo, setFiltroTipo] = useState(searchParams.get('tipo') || '');
  const [filtroAnio, setFiltroAnio] = useState(searchParams.get('anio') || '');
  const [filtroRango, setFiltroRango] = useState(searchParams.get('rango') || '');

  const esVistaConBotonInicio = pathname.includes('/visor') || pathname === '/cuenta';

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setFiltroCarrera(searchParams.get('carrera') || '');
    setFiltroTipo(searchParams.get('tipo') || '');
    setFiltroAnio(searchParams.get('anio') || '');
    setFiltroRango(searchParams.get('rango') || '');
  }, [searchParams]);

  const actualizarURL = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleBuscar = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    actualizarURL('search', searchQuery.trim());
  };

  const removerFiltro = (key: string) => {
    if (key === 'carrera') setFiltroCarrera('');
    if (key === 'tipo') setFiltroTipo('');
    if (key === 'anio') setFiltroAnio('');
    if (key === 'rango') setFiltroRango('');
    actualizarURL(key, '');
  };

  const limpiarFiltros = () => {
    setSearchQuery('');
    setFiltroCarrera('');
    setFiltroTipo('');
    setFiltroAnio('');
    setFiltroRango('');
    router.push('/');
  };

  const toggleDrawer = (abrir: boolean) => {
    const drawer = document.getElementById('drawerMovil');
    if (!drawer) return;
    if (abrir) drawer.classList.remove('hidden');
    else drawer.classList.add('hidden');
  };

  useEffect(() => {
    (window as any).toggleMenuPerfil = (e: MouseEvent) => {
      e.stopPropagation();
      const menu = document.getElementById('menuPerfil');
      if (!menu) return;
      menu.classList.toggle('hidden');
      const cerrarFuera = (ev: MouseEvent) => {
        if (!menu.contains(ev.target as Node) && (ev.target as Element).closest('button[onclick*="toggleMenuPerfil"]') !== menu) {
          menu.classList.add('hidden');
          document.removeEventListener('click', cerrarFuera);
        }
      };
      document.addEventListener('click', cerrarFuera);
    };
  }, []);

  const chipsActivos = [
    filtroCarrera && { key: 'carrera', label: filtroCarrera },
    filtroTipo && { key: 'tipo', label: filtroTipo },
    filtroAnio && { key: 'anio', label: `Año: ${filtroAnio}` },
    filtroRango && { key: 'rango', label: filtroRango }
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <nav className="bg-blue-900 text-white shadow-md relative z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 w-full">
          
          <div className="font-bold text-lg tracking-wide flex-shrink-0">
            <a href="/" className="hover:text-blue-200 transition">Repositorio IUJO | NovaDevs</a>
          </div>

          <div className="flex-1 max-w-xl relative hidden lg:block">
            <form onSubmit={handleBuscar}>
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-500 transition" onClick={handleBuscar} />
              <input 
                  type="text" 
                  id="inputBusqueda"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por título, autor, carrera..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </form>
          </div>

          <div className="relative flex-shrink-0 flex items-center gap-2 sm:gap-3">
            {esVistaConBotonInicio && (
              <button onClick={() => router.push('/')} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition" title="Volver al inicio">
                <Home className="h-4 w-4" />
                <span className="hidden xl:inline">Inicio</span>
              </button>
            )}

            <button onClick={(e) => (window as any).toggleMenuPerfil(e)} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
              <UserCircle className="h-5 w-5 flex-shrink-0" />
              {usuario && <span className="hidden md:inline">{`${usuario.nombre} ${usuario.apellido}`}</span>}
              <ChevronDown className="h-4 w-4 hidden md:block" />
            </button>

            <div id="menuPerfil" className="hidden absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 text-gray-800 z-50">
              <div className="py-1">
                <a href="/cuenta" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition">
                  <Settings className="h-4 w-4 text-gray-600" /> Configuración de perfil
                </a>
              </div>
              <div className="border-t border-gray-100 pt-1">
                <a href="#" onClick={async (e) => { e.preventDefault(); await logout(); router.push('/login'); }} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col">
        
        <div className="flex lg:hidden gap-3 mb-4 px-2">
          <form onSubmit={handleBuscar} className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" onClick={handleBuscar} />
            <input 
                type="text" 
                id="inputBusquedaMovil"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, autor..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 text-sm"
            />
          </form>
          {!esVistaConBotonInicio && (
            <button onClick={() => toggleDrawer(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-lg font-medium text-sm flex-shrink-0 shadow-sm">
              <Filter className="h-5 w-5" /> Filtros
            </button>
          )}
        </div>

        {chipsActivos.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500">Filtros aplicados:</span>
            <div className="flex flex-wrap gap-2">
              {chipsActivos.map((chip) => (
                <span key={chip.key} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {chip.label}
                  <button onClick={() => removerFiltro(chip.key)} className="hover:text-blue-900 font-bold ml-1">×</button>
                </span>
              ))}
            </div>
            <button onClick={limpiarFiltros} className="text-xs text-red-600 hover:underline ml-auto font-medium">Limpiar todos</button>
          </div>
        )}

        <div className="flex gap-6 items-start w-full">
          
          {!esVistaConBotonInicio && (
            <div className="hidden lg:block w-64 flex-shrink-0 sticky top-6">
              <div className="overflow-hidden" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
                <aside className="w-full bg-white p-4 pb-12 rounded-xl border border-gray-200 shadow-sm overflow-y-auto" style={{ maxHeight: 'calc(100vh - 6rem)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  
                  <h3 className="font-bold text-gray-800 text-base border-b pb-3 mb-3">Filtros</h3>
                  
                  <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-gray-100 pb-2 mb-2">
                    <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-gray-700 hover:text-blue-600">
                      Carrera
                      <span className="transition group-open:rotate-180"><ChevronDown className="h-4 w-4" /></span>
                    </summary>
                    <div className="space-y-1 mt-2 pl-2">
                      {['Informática', 'Contaduría', 'Administración de Empresas', 'Educación Mención: Integral', 'Educación Mención: Inicial', 'Electrónica'].map(c => (
                        <button key={c} onClick={() => { setFiltroCarrera(c); actualizarURL('carrera', c); }} className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-blue-50 ${filtroCarrera === c ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600'}`}>{c}</button>
                      ))}
                    </div>
                  </details>

                  <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-gray-100 pb-2 mb-2">
                    <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-gray-700 hover:text-blue-600">
                      Tipo de Documento
                      <span className="transition group-open:rotate-180"><ChevronDown className="h-4 w-4" /></span>
                    </summary>
                    <div className="space-y-1 mt-2 pl-2">
                      {['Tesis', 'Sistematización'].map(t => (
                        <button key={t} onClick={() => { setFiltroTipo(t); actualizarURL('tipo', t); }} className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-blue-50 ${filtroTipo === t ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600'}`}>{t}</button>
                      ))}
                    </div>
                  </details>

                  <div className="pt-2 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Año de Publicación</label>
                      <input
                        type="number"
                        id="inputAnio"
                        placeholder="Ej. 2024"
                        value={filtroAnio}
                        onChange={(e) => { setFiltroAnio(e.target.value); actualizarURL('anio', e.target.value); }}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Fecha</label>
                      <select
                        id="selectRango"
                        value={filtroRango}
                        onChange={(e) => { setFiltroRango(e.target.value); actualizarURL('rango', e.target.value); }}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Cualquier fecha</option>
                        <option value="Último mes">Último mes</option>
                        <option value="Últimos 6 meses">Últimos 6 meses</option>
                        <option value="Último año">Último año</option>
                      </select>
                    </div>
                  </div>

                  <style dangerouslySetInnerHTML={{__html: `aside::-webkit-scrollbar { display: none !important; }`}} />
                </aside>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      <Footer/>

      <div id="drawerMovil" className="hidden fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
        <div className="w-80 max-w-full bg-white h-full shadow-2xl p-6 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Filtros</h3>
            <button onClick={() => toggleDrawer(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-gray-100 pb-2 mb-2">
              <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-gray-700">
                Carrera
                <span className="transition group-open:rotate-180"><ChevronDown className="h-4 w-4" /></span>
              </summary>
              <div className="space-y-1 mt-2 pl-2">
                {['Informática', 'Contaduría', 'Administración de Empresas', 'Educación Mención: Integral', 'Educación Mención: Inicial', 'Electrónica'].map(c => (
                  <button key={c} onClick={() => { setFiltroCarrera(c); actualizarURL('carrera', c); toggleDrawer(false); }} className={`block w-full text-left text-sm py-1.5 px-2 rounded hover:bg-blue-50 ${filtroCarrera === c ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600'}`}>{c}</button>
                ))}
              </div>
            </details>

            <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-gray-100 pb-2 mb-2">
              <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-gray-700">
                Tipo de Documento
                <span className="transition group-open:rotate-180"><ChevronDown className="h-4 w-4" /></span>
              </summary>
              <div className="space-y-1 mt-2 pl-2">
                {['Tesis', 'Sistematización'].map(t => (
                  <button key={t} onClick={() => { setFiltroTipo(t); actualizarURL('tipo', t); toggleDrawer(false); }} className={`block w-full text-left text-sm py-1.5 px-2 rounded hover:bg-blue-50 ${filtroTipo === t ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600'}`}>{t}</button>
                ))}
              </div>
            </details>

            <div className="pt-2 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Año de Publicación</label>
                <input
                  type="number"
                  id="inputAnioMovil"
                  placeholder="Ej. 2024"
                  value={filtroAnio}
                  onChange={(e) => { setFiltroAnio(e.target.value); actualizarURL('anio', e.target.value); }}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Fecha</label>
                <select
                  id="selectRangoMovil"
                  value={filtroRango}
                  onChange={(e) => { setFiltroRango(e.target.value); actualizarURL('rango', e.target.value); }}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Cualquier fecha</option>
                  <option value="Último mes">Último mes</option>
                  <option value="Últimos 6 meses">Últimos 6 meses</option>
                  <option value="Último año">Último año</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t mt-4">
            <button onClick={() => { limpiarFiltros(); toggleDrawer(false); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 rounded-lg transition">
              Limpiar todos los filtros
            </button>
          </div>

          <style dangerouslySetInnerHTML={{__html: `#drawerMovil > div::-webkit-scrollbar { display: none !important; }`}} />
        </div>
      </div>
    </div>
  );
}

export default function NavbarUser({ children }: NavbarUserProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Cargando...</div>}>
      <NavbarContent>{children}</NavbarContent>
    </Suspense>
  );
}