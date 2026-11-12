'use client';

import { ReactNode, useEffect, useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import { Search, Filter, X, LogOut, ChevronDown, UserCircle } from 'lucide-react';

interface NavbarAdminProps {
  children?: ReactNode;
}

function NavbarAdminContent({ children }: NavbarAdminProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filtroCarrera, setFiltroCarrera] = useState(searchParams.get('carrera') || '');
  const [filtroTipo, setFiltroTipo] = useState(searchParams.get('tipo') || '');
  const [filtroAnio, setFiltroAnio] = useState(searchParams.get('anio') || '');
  const [filtroRango, setFiltroRango] = useState(searchParams.get('rango') || '');

  const esVistaConBotonVolver = pathname.includes('/visor');

  // ✅ Sincronizar los estados locales con los parámetros de la URL
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setFiltroCarrera(searchParams.get('carrera') || '');
    setFiltroTipo(searchParams.get('tipo') || '');
    setFiltroAnio(searchParams.get('anio') || '');
    setFiltroRango(searchParams.get('rango') || '');
  }, [searchParams]);

  // ✅ Función para actualizar la URL (Filtrado en la página)
  const actualizarURL = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/repositorio?${params.toString()}`);
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
    router.push('/admin/repositorio');
  };

  const toggleDrawerAdmin = (abrir: boolean) => {
    const drawer = document.getElementById('drawerMovilAdmin');
    if (!drawer) return;
    if (abrir) drawer.classList.remove('hidden');
    else drawer.classList.add('hidden');
  };

  const chipsActivos = [
    filtroCarrera && { key: 'carrera', label: filtroCarrera },
    filtroTipo && { key: 'tipo', label: filtroTipo },
    filtroAnio && { key: 'anio', label: `Año: ${filtroAnio}` },
    filtroRango && { key: 'rango', label: filtroRango }
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <nav className="bg-blue-900 text-white shadow-md relative z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 w-full">
            
            <div className="font-bold text-base sm:text-lg tracking-wide flex-shrink-0 truncate max-w-[200px] sm:max-w-none">
              <a href="/admin/repositorio" className="text-white hover:text-blue-200 transition">
                Repositorio IUJO | Admin
              </a>
            </div>

            <div className="flex-1 max-w-xl relative hidden lg:block">
              <form onSubmit={handleBuscar}>
                <Search
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-500 transition"
                  onClick={handleBuscar}
                />
                <input 
                    type="text" 
                    id="inputBusquedaAdmin"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por título, autor, carrera..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </form>
            </div>

            <div className="relative flex-shrink-0 flex items-center gap-2 sm:gap-3">
              
              {esVistaConBotonVolver && (
                <button onClick={() => router.push('/admin/repositorio')} className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 p-2.5 rounded-lg transition" title="Volver al repositorio">
                  <LogOut className="h-5 w-5" />
                </button>
              )}

              <button onClick={() => router.push('/admin')} className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 p-2.5 rounded-lg transition" title="Ir al Panel de Administración">
                <span className="hidden sm:inline text-sm font-medium mr-1">Panel</span>
                <UserCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col">
          
          <div className="flex lg:hidden gap-3 mb-4 px-2">
            <form onSubmit={handleBuscar} className="relative flex-1">
              <Search
                className="absolute left-3 top-3 h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-500 transition"
                onClick={handleBuscar}
              />
              <input 
                  type="text" 
                  id="inputBusquedaAdminMovil"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por título, autor..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 text-sm"
              />
            </form>
            {!esVistaConBotonVolver && (
              <button onClick={() => toggleDrawerAdmin(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-lg font-medium text-sm flex-shrink-0 shadow-sm">
                <Filter className="h-5 w-5" /> Filtros
              </button>
            )}
          </div>

          {chipsActivos.length > 0 && (
            <div id="contenedorChipsAdmin" className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500">Filtros aplicados:</span>
              <div id="listaChipsAdmin" className="flex flex-wrap gap-2">
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
            
            {!esVistaConBotonVolver && (
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
                          id="inputAnioAdmin"
                          placeholder="Ej. 2024"
                          value={filtroAnio}
                          onChange={(e) => { setFiltroAnio(e.target.value); actualizarURL('anio', e.target.value); }}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Fecha</label>
                        <select
                          id="selectRangoAdmin"
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

        <div id="drawerMovilAdmin" className="hidden fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
          <div className="w-80 max-w-full bg-white h-full shadow-2xl p-6 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Filtros</h3>
              <button onClick={() => toggleDrawerAdmin(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-lg">
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
                    <button key={c} onClick={() => { setFiltroCarrera(c); actualizarURL('carrera', c); toggleDrawerAdmin(false); }} className={`block w-full text-left text-sm py-1.5 px-2 rounded hover:bg-blue-50 ${filtroCarrera === c ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600'}`}>{c}</button>
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
                    <button key={t} onClick={() => { setFiltroTipo(t); actualizarURL('tipo', t); toggleDrawerAdmin(false); }} className={`block w-full text-left text-sm py-1.5 px-2 rounded hover:bg-blue-50 ${filtroTipo === t ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600'}`}>{t}</button>
                  ))}
                </div>
              </details>

              <div className="pt-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Año de Publicación</label>
                  <input
                    type="number"
                    id="inputAnioMovilAdmin"
                    placeholder="Ej. 2024"
                    value={filtroAnio}
                    onChange={(e) => { setFiltroAnio(e.target.value); actualizarURL('anio', e.target.value); }}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Fecha</label>
                  <select
                    id="selectRangoMovilAdmin"
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
              <button onClick={() => { limpiarFiltros(); toggleDrawerAdmin(false); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 rounded-lg transition">
                Limpiar todos los filtros
              </button>
            </div>

            <style dangerouslySetInnerHTML={{__html: `#drawerMovilAdmin > div::-webkit-scrollbar { display: none !important; }`}} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function NavbarAdmin({ children }: NavbarAdminProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Cargando...</div>}>
      <NavbarAdminContent>{children}</NavbarAdminContent>
    </Suspense>
  );
}