'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Search, Filter, X, LogOut, ChevronDown, UserCircle } from 'lucide-react';

interface NavbarAdminProps {
  children?: ReactNode;
}

export default function NavbarAdmin({ children }: NavbarAdminProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [anioFiltro, setAnioFiltro] = useState('');
  const [rangoFiltro, setRangoFiltro] = useState('');

  const esVistaConBotonVolver = pathname.includes('/visor');

  // ✅ Redirige a /admin/repositorio y no al panel principal
  const handleBuscar = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/repositorio?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/admin/repositorio');
    }
  };

  const aplicarFiltroAnio = (anio: string) => {
    setAnioFiltro(anio);
    setRangoFiltro(''); 
    
    const selectRango = document.getElementById('selectRangoAdmin') as HTMLSelectElement;
    const selectRangoMovil = document.getElementById('selectRangoMovilAdmin') as HTMLSelectElement;
    if (selectRango) selectRango.value = '';
    if (selectRangoMovil) selectRangoMovil.value = '';

    if (!anio.trim()) {
      (window as any).removerFiltroAdmin('anio');
    } else {
      (window as any).seleccionarFiltroAdmin('anio', anio.trim());
    }
  };

  const aplicarFiltroRango = (rango: string) => {
    setRangoFiltro(rango);
    setAnioFiltro(''); 
    
    const inputAnio = document.getElementById('inputAnioAdmin') as HTMLInputElement;
    const inputAnioMovil = document.getElementById('inputAnioMovilAdmin') as HTMLInputElement;
    if (inputAnio) inputAnio.value = '';
    if (inputAnioMovil) inputAnioMovil.value = '';

    if (!rango) {
      (window as any).removerFiltroAdmin('rango');
    } else {
      (window as any).seleccionarFiltroAdmin('rango', rango);
    }
  };

  useEffect(() => {
    (window as any).toggleDrawerAdmin = (abrir: boolean) => {
      const drawer = document.getElementById('drawerMovilAdmin');
      if (!drawer) return;
      if (abrir) drawer.classList.remove('hidden');
      else drawer.classList.add('hidden');
    };

    let filtrosSeleccionadosAdmin: Record<string, string> = {};

    (window as any).seleccionarFiltroAdmin = (categoria: string, valor: string) => {
      filtrosSeleccionadosAdmin[categoria] = valor;
      actualizarChipsAdmin();
      (window as any).filtrarDocumentosAdmin();
    };

    (window as any).removerFiltroAdmin = (categoria: string) => {
      delete filtrosSeleccionadosAdmin[categoria];
      actualizarChipsAdmin();
      (window as any).filtrarDocumentosAdmin();
    };

    (window as any).limpiarFiltrosAdmin = () => {
      filtrosSeleccionadosAdmin = {};
      setSearchQuery('');
      setAnioFiltro('');
      setRangoFiltro('');
      
      const input = document.getElementById('inputBusquedaAdmin') as HTMLInputElement;
      const inputMovil = document.getElementById('inputBusquedaAdminMovil') as HTMLInputElement;
      const inputAnio = document.getElementById('inputAnioAdmin') as HTMLInputElement;
      const inputAnioMovil = document.getElementById('inputAnioMovilAdmin') as HTMLInputElement;
      const selectRango = document.getElementById('selectRangoAdmin') as HTMLSelectElement;
      const selectRangoMovil = document.getElementById('selectRangoMovilAdmin') as HTMLSelectElement;
      
      if (input) input.value = '';
      if (inputMovil) inputMovil.value = '';
      if (inputAnio) inputAnio.value = '';
      if (inputAnioMovil) inputAnioMovil.value = '';
      if (selectRango) selectRango.value = '';
      if (selectRangoMovil) selectRangoMovil.value = '';
      
      actualizarChipsAdmin();
      (window as any).filtrarDocumentosAdmin();
    };

    const actualizarChipsAdmin = () => {
      const contenedor = document.getElementById('contenedorChipsAdmin');
      const lista = document.getElementById('listaChipsAdmin');
      if (!contenedor || !lista) return;
      lista.innerHTML = '';

      const keys = Object.keys(filtrosSeleccionadosAdmin);
      if (keys.length > 0) {
        contenedor.classList.remove('hidden');
        contenedor.classList.add('flex');
        keys.forEach((cat) => {
          let textoChip = filtrosSeleccionadosAdmin[cat];
          if (cat === 'anio') textoChip = 'Año: ' + filtrosSeleccionadosAdmin[cat];
          if (cat === 'rango') textoChip = 'Rango: ' + filtrosSeleccionadosAdmin[cat];

          lista.innerHTML += `
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  ${textoChip} 
                  <button onclick="(window as any).removerFiltroAdmin('${cat}')" class="hover:text-blue-900 font-bold ml-1">×</button>
              </span>
          `;
        });
      } else {
        contenedor.classList.remove('flex');
        contenedor.classList.add('hidden');
      }
    };

    (window as any).filtrarDocumentosAdmin = () => {
      const input = document.getElementById('inputBusquedaAdmin') as HTMLInputElement;
      const inputMovil = document.getElementById('inputBusquedaAdminMovil') as HTMLInputElement;
      
      const valorEscritorio = input?.value || '';
      const valorMovil = inputMovil?.value || '';
      const textoBusqueda = (valorEscritorio || valorMovil).toLowerCase();
      
      const tarjetas = document.querySelectorAll('.documento-card');
      const contenedorContador = document.getElementById('contenedorContadorAdmin');
      const contador = document.getElementById('contadorResultadosAdmin');

      const tieneFiltrosActivos = Object.keys(filtrosSeleccionadosAdmin).length > 0 || textoBusqueda.length > 0;

      if (!tieneFiltrosActivos) {
        if (contenedorContador) {
          contenedorContador.classList.remove('flex');
          contenedorContador.classList.add('hidden');
        }
        tarjetas.forEach((card) => {
          (card as HTMLElement).style.display = 'flex';
        });
        return;
      }

      if (contenedorContador) {
        contenedorContador.classList.remove('hidden');
        contenedorContador.classList.add('flex');
      }

      let visibles = 0;
      const hoy = new Date();

      tarjetas.forEach((card) => {
        const carreraCard = card.getAttribute('data-carrera');
        const tipoCard = card.getAttribute('data-tipo');
        const contenidoTexto = card.getAttribute('data-texto');
        const fechaCardStr = card.getAttribute('data-fecha');
        
        const fechaCard = fechaCardStr ? new Date(fechaCardStr) : null;
        let anioCard = fechaCard ? fechaCard.getFullYear().toString() : '';

        let coincideCarrera = !filtrosSeleccionadosAdmin['carrera'] || filtrosSeleccionadosAdmin['carrera'] === carreraCard;
        let coincideTipo = !filtrosSeleccionadosAdmin['tipo'] || filtrosSeleccionadosAdmin['tipo'] === tipoCard;
        let coincideTexto = !textoBusqueda || contenidoTexto?.includes(textoBusqueda);
        
        let coincideAnio = true;
        if (filtrosSeleccionadosAdmin['anio']) {
          coincideAnio = anioCard === filtrosSeleccionadosAdmin['anio'];
        }

        let coincideRango = true;
        if (filtrosSeleccionadosAdmin['rango'] && fechaCard) {
          const mesesDiferencia = (hoy.getFullYear() - fechaCard.getFullYear()) * 12 + (hoy.getMonth() - fechaCard.getMonth());
          
          if (filtrosSeleccionadosAdmin['rango'] === 'Último mes') {
            coincideRango = mesesDiferencia <= 1;
          } else if (filtrosSeleccionadosAdmin['rango'] === 'Últimos 6 meses') {
            coincideRango = mesesDiferencia <= 6;
          } else if (filtrosSeleccionadosAdmin['rango'] === 'Último año') {
            coincideRango = mesesDiferencia <= 12;
          }
        }

        if (coincideCarrera && coincideTipo && coincideTexto && coincideAnio && coincideRango) {
          (card as HTMLElement).style.display = 'flex';
          visibles++;
        } else {
          (card as HTMLElement).style.display = 'none';
        }
      });

      if (contador) contador.innerText = `Resultados encontrados (${visibles})`;
    };
  }, []);

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
                    placeholder="Buscar por título, carrera..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </form>
            </div>

            <div className="relative flex-shrink-0 flex items-center gap-2 sm:gap-3">
              
              {/* ✅ Botón Volver al Panel (Solo si estás en el visor) */}
              {esVistaConBotonVolver && (
                <button onClick={() => router.push('/admin/repositorio')} className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 p-2.5 rounded-lg transition" title="Volver al repositorio">
                  <LogOut className="h-5 w-5" />
                </button>
              )}

              {/* ✅ Botón Panel (Siempre visible, responsive) */}
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
                  placeholder="Buscar por título..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 text-sm"
              />
            </form>
            {!esVistaConBotonVolver && (
              <button onClick={() => (window as any).toggleDrawerAdmin(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-lg font-medium text-sm flex-shrink-0 shadow-sm">
                <Filter className="h-5 w-5" /> Filtros
              </button>
            )}
          </div>

          {!esVistaConBotonVolver && (
            <div id="contenedorChipsAdmin" className="hidden flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500">Filtros aplicados:</span>
              <div id="listaChipsAdmin" className="flex flex-wrap gap-2"></div>
              <button onClick={() => (window as any).limpiarFiltrosAdmin()} className="text-xs text-red-600 hover:underline ml-auto font-medium">Limpiar todos</button>
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
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Informática')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Informática</button>
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Contaduría')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Contaduría</button>
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Administración de Empresas')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Integral')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Integral</button>
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Inicial')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Inicial</button>
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Electrónica')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Electrónica</button>
                      </div>
                    </details>

                    <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-gray-100 pb-2 mb-2">
                      <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-gray-700 hover:text-blue-600">
                        Tipo de Documento
                        <span className="transition group-open:rotate-180"><ChevronDown className="h-4 w-4" /></span>
                      </summary>
                      <div className="space-y-1 mt-2 pl-2">
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('tipo', 'Tesis')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Tesis</button>
                        <button onClick={() => (window as any).seleccionarFiltroAdmin('tipo', 'Sistematización')} className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Sistematización</button>
                      </div>
                    </details>

                    <div className="pt-2 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Año de Publicación</label>
                        <input
                          type="number"
                          id="inputAnioAdmin"
                          placeholder="Ej. 2024"
                          value={anioFiltro}
                          onChange={(e) => aplicarFiltroAnio(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                          min="1900"
                          max="2100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Fecha</label>
                        <select
                          id="selectRangoAdmin"
                          value={rangoFiltro}
                          onChange={(e) => aplicarFiltroRango(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">Cualquier fecha</option>
                          <option value="Último mes">Último mes</option>
                          <option value="Últimos 6 meses">Últimos 6 meses</option>
                          <option value="Último año">Último año</option>
                        </select>
                      </div>
                    </div>

                    <style dangerouslySetInnerHTML={{__html: `
                      aside::-webkit-scrollbar { display: none !important; }
                    `}} />
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
              <button onClick={() => (window as any).toggleDrawerAdmin(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-lg">
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
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Informática'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Informática</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Contaduría'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Contaduría</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Administración de Empresas'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Integral'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Educación Mención: Integral</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Inicial'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Educación Mención: Inicial</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Electrónica'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Electrónica</button>
                </div>
              </details>

              <details className="group [&_summary::-webkit-details-marker]:hidden border-b border-gray-100 pb-2 mb-2">
                <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-gray-700">
                  Tipo de Documento
                  <span className="transition group-open:rotate-180"><ChevronDown className="h-4 w-4" /></span>
                </summary>
                <div className="space-y-1 mt-2 pl-2">
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('tipo', 'Tesis'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Tesis</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('tipo', 'Sistematización'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-600 py-1.5 px-2 rounded hover:bg-blue-50">Sistematización</button>
                </div>
              </details>

              <div className="pt-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Año de Publicación</label>
                  <input
                    type="number"
                    id="inputAnioMovilAdmin"
                    placeholder="Ej. 2024"
                    value={anioFiltro}
                    onChange={(e) => aplicarFiltroAnio(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    min="1900"
                    max="2100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Fecha</label>
                  <select
                    id="selectRangoMovilAdmin"
                    value={rangoFiltro}
                    onChange={(e) => aplicarFiltroRango(e.target.value)}
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
              <button onClick={() => { (window as any).limpiarFiltrosAdmin(); (window as any).toggleDrawerAdmin(false); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 rounded-lg transition">
                Limpiar todos los filtros
              </button>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
              #drawerMovilAdmin > div::-webkit-scrollbar { display: none !important; }
            `}} />
          </div>
        </div>
      </div>
    </>
  );
}