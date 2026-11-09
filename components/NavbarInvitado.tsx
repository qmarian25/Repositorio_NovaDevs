'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Search, Filter, X, LogOut, Grid } from 'lucide-react';

interface NavbarInvitadoProps {
  children?: ReactNode;
}

export default function NavbarInvitado({ children }: NavbarInvitadoProps) {
  const pathname = usePathname();
  const router = useRouter();
  const esVistaSimple = pathname === '/invitado/visor' || pathname === '/cuenta';

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
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                  type="text" 
                  id="inputBusquedaInvitado"
                  onInput={() => (window as any).filtrarDocumentosInvitado()}
                  placeholder="Buscar por título, carrera..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Derecha: Botón Volver, Tarjetas y etiqueta de Invitado */}
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
          
          {/* Barra de búsqueda móvil */}
          <div className="flex sm:hidden gap-3 mb-4 px-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input 
                  type="text" 
                  onInput={() => (window as any).filtrarDocumentosInvitado()}
                  placeholder="Buscar por título, carrera..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 text-sm"
              />
            </div>
            {!esVistaSimple && (
              <button onClick={() => (window as any).toggleDrawerInvitado(true)} className="flex items-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg font-medium text-sm flex-shrink-0 min-w-[auto]">
                <Filter className="h-5 w-5" /> Filtros
              </button>
            )}
          </div>

          {/* CHIPS DE FILTROS ACTIVOS */}
          {!esVistaSimple && (
            <div id="contenedorChipsInvitado" className="hidden flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500">Filtros aplicados:</span>
              <div id="listaChipsInvitado" className="flex flex-wrap gap-2"></div>
              <button onClick={() => (window as any).limpiarFiltrosInvitado()} className="text-xs text-red-600 hover:underline ml-auto font-medium">Limpiar todos</button>
            </div>
          )}

          {/* Layout Horizontal */}
          <div className="flex gap-6 items-start w-full">
            
            {/* SIDEBAR DE FILTROS POR FACETAS */}
            {!esVistaSimple && (
              <aside className="hidden md:block w-64 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6 flex-shrink-0 sticky top-6 max-h-[calc(100vh-14rem)] overflow-y-auto">
                <h3 className="font-bold text-gray-800 text-base border-b pb-2">Filtros por Facetas</h3>
                
                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Carrera</h4>
                  <div className="space-y-1">
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('carrera', 'Informática')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Informática</button>
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('carrera', 'Contaduría')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Contaduría</button>
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('carrera', 'Administración de Empresas')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('carrera', 'Educación Mención: Integral')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Integral</button>
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('carrera', 'Educación Mención: Inicial')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Inicial</button>
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('carrera', 'Electrónica')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Electrónica</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Tipo de Documento</h4>
                  <div className="space-y-1">
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('tipo', 'Tesis')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Tesis</button>
                    <button onClick={() => (window as any).seleccionarFiltroInvitado('tipo', 'Sistematización')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Sistematización</button>
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
        <div id="drawerMovilInvitado" className="hidden fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
          <div className="w-80 max-w-full bg-white h-full shadow-2xl p-6 flex flex-col space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-gray-900 text-lg">Filtros por Facetas</h3>
              <button onClick={() => (window as any).toggleDrawerInvitado(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-lg">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Carrera</h4>
                <div className="space-y-1">
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('carrera', 'Informática'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Informática</button>
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('carrera', 'Contaduría'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Contaduría</button>
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('carrera', 'Administración de Empresas'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('carrera', 'Educación Mención: Integral'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Integral</button>
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('carrera', 'Educación Mención: Inicial'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Inicial</button>
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('carrera', 'Electrónica'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Electrónica</button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Tipo de Documento</h4>
                <div className="space-y-1">
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('tipo', 'Tesis'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Tesis</button>
                  <button onClick={() => { (window as any).seleccionarFiltroInvitado('tipo', 'Sistematización'); (window as any).toggleDrawerInvitado(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Sistematización</button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button onClick={() => { (window as any).limpiarFiltrosInvitado(); (window as any).toggleDrawerInvitado(false); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 rounded-lg transition">
                Limpiar todos los filtros
              </button>
            </div>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              function toggleDrawerInvitado(abrir) {
                  const drawer = document.getElementById('drawerMovilInvitado');
                  if (!drawer) return;
                  if (abrir) {
                      drawer.classList.remove('hidden');
                  } else {
                      drawer.classList.add('hidden');
                  }
              }

              let filtrosSeleccionadosInvitado = {};

              function seleccionarFiltroInvitado(categoria, valor) {
                  filtrosSeleccionadosInvitado[categoria] = valor;
                  actualizarChipsInvitado();
                  filtrarDocumentosInvitado();
              }

              function removerFiltroInvitado(categoria) {
                  delete filtrosSeleccionadosInvitado[categoria];
                  actualizarChipsInvitado();
                  filtrarDocumentosInvitado();
              }

              function limpiarFiltrosInvitado() {
                  filtrosSeleccionadosInvitado = {};
                  const input = document.getElementById('inputBusquedaInvitado');
                  if (input) input.value = '';
                  actualizarChipsInvitado();
                  filtrarDocumentosInvitado();
              }

              function actualizarChipsInvitado() {
                  const contenedor = document.getElementById('contenedorChipsInvitado');
                  const lista = document.getElementById('listaChipsInvitado');
                  if (!contenedor || !lista) return;
                  lista.innerHTML = '';

                  const keys = Object.keys(filtrosSeleccionadosInvitado);
                  if (keys.length > 0) {
                      contenedor.classList.remove('hidden');
                      contenedor.classList.add('flex');
                      keys.forEach(cat => {
                          lista.innerHTML += \`
                              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  \${filtrosSeleccionadosInvitado[cat]} 
                                  <button onclick="removerFiltroInvitado('\${cat}')" class="hover:text-blue-900 font-bold ml-1">×</button>
                              </span>
                          \`;
                      });
                  } else {
                      contenedor.classList.remove('flex');
                      contenedor.classList.add('hidden');
                  }
              }

              function filtrarDocumentosInvitado() {
                  const input = document.getElementById('inputBusquedaInvitado');
                  const textoBusqueda = input ? input.value.toLowerCase() : '';
                  const tarjetas = document.querySelectorAll('.documento-card');
                  const contenedorContador = document.getElementById('contenedorContadorInvitado');
                  const contador = document.getElementById('contadorResultadosInvitado');
                  
                  const tieneFiltrosActivos = Object.keys(filtrosSeleccionadosInvitado).length > 0 || textoBusqueda.length > 0;

                  if (!tieneFiltrosActivos) {
                      if (contenedorContador) {
                          contenedorContador.classList.remove('flex');
                          contenedorContador.classList.add('hidden');
                      }
                      tarjetas.forEach(card => card.style.display = 'flex');
                      return;
                  }

                  if (contenedorContador) {
                      contenedorContador.classList.remove('hidden');
                      contenedorContador.classList.add('flex');
                  }

                  let visibles = 0;

                  tarjetas.forEach(card => {
                      const carreraCard = card.getAttribute('data-carrera');
                      const tipoCard = card.getAttribute('data-tipo');
                      const contenidoTexto = card.getAttribute('data-texto');

                      let coincideCarrera = !filtrosSeleccionadosInvitado['carrera'] || filtrosSeleccionadosInvitado['carrera'] === carreraCard;
                      let coincideTipo = !filtrosSeleccionadosInvitado['tipo'] || filtrosSeleccionadosInvitado['tipo'] === tipoCard;
                      let coincideTexto = !textoBusqueda || contenidoTexto.includes(textoBusqueda);

                      if (coincideCarrera && coincideTipo && coincideTexto) {
                          card.style.display = 'flex';
                          visibles++;
                      } else {
                          card.style.display = 'none';
                      }
                  });

                  if (contador) contador.innerText = \`Resultados encontrados (\${visibles})\`;
              }
            `,
          }}
        />
      </div>
    </>
  );
}
