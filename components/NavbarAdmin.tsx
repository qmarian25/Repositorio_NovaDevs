'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { Search, Filter, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavbarAdminProps {
  children?: ReactNode;
}

export default function NavbarAdmin({ children }: NavbarAdminProps) {
  const pathname = usePathname();
  const router = useRouter();
  const esVistaSimple = pathname === '/cuenta';
  const [searchQuery, setSearchQuery] = useState('');

  const handleBuscar = () => {
    if (searchQuery.trim()) {
      router.push(`/admin/repositorio?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    (window as any).toggleDrawerAdmin = (abrir: boolean) => {
      const drawer = document.getElementById('drawerMovilAdmin');
      if (!drawer) return;
      if (abrir) {
        drawer.classList.remove('hidden');
      } else {
        drawer.classList.add('hidden');
      }
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
      const input = document.getElementById('inputBusquedaAdmin');
      const inputDesde = document.getElementById('inputFechaDesdeAdmin');
      const inputHasta = document.getElementById('inputFechaHastaAdmin');
      if (input) (input as HTMLInputElement).value = '';
      if (inputDesde) (inputDesde as HTMLInputElement).value = '';
      if (inputHasta) (inputHasta as HTMLInputElement).value = '';
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
          lista.innerHTML += `
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  ${filtrosSeleccionadosAdmin[cat]} 
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
      const input = document.getElementById('inputBusquedaAdmin');
      const textoBusqueda = input ? (input as HTMLInputElement).value.toLowerCase() : '';
      const tarjetas = document.querySelectorAll('.documento-card');
      const contenedorContador = document.getElementById('contenedorContadorAdmin');
      const contador = document.getElementById('contadorResultadosAdmin');

      const inputDesde = document.getElementById('inputFechaDesdeAdmin') as HTMLInputElement | null;
      const inputHasta = document.getElementById('inputFechaHastaAdmin') as HTMLInputElement | null;
      const fechaDesde = inputDesde && inputDesde.value ? new Date(inputDesde.value) : null;
      const fechaHasta = inputHasta && inputHasta.value ? new Date(inputHasta.value) : null;

      const tieneFiltrosActivos =
        Object.keys(filtrosSeleccionadosAdmin).length > 0 ||
        textoBusqueda.length > 0 ||
        !!fechaDesde ||
        !!fechaHasta;

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

      tarjetas.forEach((card) => {
        const carreraCard = card.getAttribute('data-carrera');
        const tipoCard = card.getAttribute('data-tipo');
        const contenidoTexto = card.getAttribute('data-texto');
        const fechaCardStr = card.getAttribute('data-fecha');
        const fechaCard = fechaCardStr ? new Date(fechaCardStr) : null;

        let coincideCarrera = !filtrosSeleccionadosAdmin['carrera'] || filtrosSeleccionadosAdmin['carrera'] === carreraCard;
        let coincideTipo = !filtrosSeleccionadosAdmin['tipo'] || filtrosSeleccionadosAdmin['tipo'] === tipoCard;
        let coincideTexto = !textoBusqueda || contenidoTexto?.includes(textoBusqueda);

        let coincideFecha = true;
        if (fechaDesde || fechaHasta) {
          coincideFecha = Boolean(
            (!fechaDesde || (fechaCard && fechaCard >= fechaDesde)) &&
            (!fechaHasta || (fechaCard && fechaCard <= fechaHasta))
          );
        }

        if (coincideCarrera && coincideTipo && coincideTexto && coincideFecha) {
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
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <nav className="bg-blue-900 text-white shadow-md relative z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 w-full">
            
            {/* Izquierda: Título / Logo */}
            <div className="font-bold text-lg tracking-wide flex-shrink-0">
              <a href="/admin/repositorio" className="text-white hover:text-blue-200 transition">
                Repositorio IUJO | Admin
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
                  id="inputBusquedaAdmin"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  placeholder="Buscar por título, carrera..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Derecha: Botón volver y etiqueta de Admin */}
            <div className="relative flex-shrink-0 flex items-center gap-2">
              <button onClick={() => router.push('/admin')} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <LogOut className="h-4 w-4" /> Volver
              </button>
              <button className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3.5 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <span className="text-blue-100 font-medium">Admin</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col">
          
          {/* Barra de búsqueda móvil */}
          <div className="flex sm:hidden gap-3 mb-4 px-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-500 transition"
                onClick={handleBuscar}
              />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  placeholder="Buscar por título, carrera..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 text-sm"
              />
            </div>
            {!esVistaSimple && (
              <button onClick={() => (window as any).toggleDrawerAdmin(true)} className="flex items-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg font-medium text-sm flex-shrink-0 min-w-[auto]">
                <Filter className="h-5 w-5" /> Filtros
              </button>
            )}
          </div>

          {/* CHIPS DE FILTROS ACTIVOS */}
          {!esVistaSimple && (
            <div id="contenedorChipsAdmin" className="hidden flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500">Filtros aplicados:</span>
              <div id="listaChipsAdmin" className="flex flex-wrap gap-2"></div>
              <button onClick={() => (window as any).limpiarFiltrosAdmin()} className="text-xs text-red-600 hover:underline ml-auto font-medium">Limpiar todos</button>
            </div>
          )}

          {/* Layout Horizontal */}
          <div className="flex gap-6 items-start w-full">
            
            {/* SIDEBAR DE FILTROS POR FACETAS */}
            {!esVistaSimple && (
              <aside className="hidden md:block w-64 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6 flex-shrink-0 sticky top-6 max-h-[calc(100vh-6rem)] overflow-visible">
                <h3 className="font-bold text-gray-800 text-base border-b pb-2">Filtros por Facetas</h3>
                
                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Carrera</h4>
                  <div className="space-y-1">
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Informática')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Informática</button>
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Contaduría')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Contaduría</button>
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Administración de Empresas')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Integral')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Integral</button>
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Inicial')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Inicial</button>
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('carrera', 'Electrónica')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Electrónica</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Tipo de Documento</h4>
                  <div className="space-y-1">
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('tipo', 'Tesis')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Tesis</button>
                    <button onClick={() => (window as any).seleccionarFiltroAdmin('tipo', 'Sistematización')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Sistematización</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Rango de Fecha</h4>
                  <div className="space-y-2">
                    <input
                      type="date"
                      id="inputFechaDesdeAdmin"
                      onInput={() => (window as any).filtrarDocumentosAdmin()}
                      placeholder="Desde"
                      className="w-full pl-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                      type="date"
                      id="inputFechaHastaAdmin"
                      onInput={() => (window as any).filtrarDocumentosAdmin()}
                      placeholder="Hasta"
                      className="w-full pl-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </aside>
            )}

            {/* Contenido inyectado por la página */}
            <div className="flex-1 min-w-0 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
         {/* INTEGRACIÓN DEL FOOTER DENTRO DE NAVBAR */}
        <Footer/>

        {/* FILTROS PARA MÓVIL */}
        <div id="drawerMovilAdmin" className="hidden fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
          <div className="w-80 max-w-full bg-white h-full shadow-2xl p-6 flex flex-col space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-gray-900 text-lg">Filtros por Facetas</h3>
              <button onClick={() => (window as any).toggleDrawerAdmin(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-lg">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Carrera</h4>
                <div className="space-y-1">
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Informática'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Informática</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Contaduría'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Contaduría</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Administración de Empresas'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Integral'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Integral</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Educación Mención: Inicial'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Inicial</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('carrera', 'Electrónica'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Electrónica</button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Tipo de Documento</h4>
                <div className="space-y-1">
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('tipo', 'Tesis'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Tesis</button>
                  <button onClick={() => { (window as any).seleccionarFiltroAdmin('tipo', 'Sistematización'); (window as any).toggleDrawerAdmin(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Sistematización</button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Rango de Fecha</h4>
                <div className="space-y-2">
                  <input
                    type="date"
                    id="inputFechaDesdeAdmin"
                    onInput={() => (window as any).filtrarDocumentosAdmin()}
                    placeholder="Desde"
                    className="w-full pl-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="date"
                    id="inputFechaHastaAdmin"
                    onInput={() => (window as any).filtrarDocumentosAdmin()}
                    placeholder="Hasta"
                    className="w-full pl-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button onClick={() => { (window as any).limpiarFiltrosAdmin(); (window as any).toggleDrawerAdmin(false); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 rounded-lg transition">
                Limpiar todos los filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
