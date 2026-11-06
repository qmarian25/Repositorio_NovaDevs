'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

interface NavbarUserProps {
  children?: ReactNode;
}

export default function NavbarUser({ children }: NavbarUserProps) {
  const pathname = usePathname();
  const esVistaSimple = pathname === '/visor' || pathname === '/cuenta';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest';
    script.async = true;
    script.onload = () => {
      if ((window as any).lucide) {
        (window as any).lucide.createIcons();
      }
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Navbar Institucional IUJO con la barra de búsqueda integrada al centro */}
        <nav className="bg-blue-900 text-white shadow-md relative z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 w-full">
            
            {/* 1. Izquierda: Título / Logo */}
            <div className="font-bold text-lg tracking-wide flex-shrink-0">
              <a href="/">Repositorio IUJO | NovaDevs</a>
            </div>
            
            {/* 2. Centro: Barra de Búsqueda Integrada en el Navbar */}
            <div className="flex-1 max-w-xl relative hidden sm:block">
              <i data-lucide="search" className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"></i>
              <input 
                  type="text" 
                  id="inputBusqueda"
                  onInput={() => (window as any).filtrarDocumentos()}
                  placeholder="Buscar por título, autor, carrera..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* 3. Derecha: Menú de Perfil */}
            <div className="relative flex-shrink-0">
              <button onClick={(e) => (window as any).toggleMenuPerfil(e)} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-3.5 py-2 rounded-lg text-sm font-medium transition focus:outline-none">
                <i data-lucide="user-circle" className="h-5 w-5"></i>
                <span>Mariam Quesada</span>
                <i data-lucide="chevron-down" className="h-4 w-4"></i>
              </button>

              <div id="menuPerfil" className="hidden absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 text-gray-800">
                <div className="py-1">
                  <a href="/cuenta" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition">
                    <i data-lucide="settings" className="h-4 w-4 text-gray-600"></i> Configuración de perfil
                  </a>
                </div>
                <div className="border-t border-gray-100 pt-1">
                  <a href="#" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                    <i data-lucide="log-out" className="h-4 w-4"></i> Cerrar sesión
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenedor General */}
        <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col">
          
          {/* Barra de búsqueda móvil (visible solo en pantallas pequeñas) */}
          <div className="flex sm:hidden gap-3 mb-4">
            <div className="relative flex-1">
              <i data-lucide="search" className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"></i>
              <input 
                  type="text" 
                  onInput={() => (window as any).filtrarDocumentos()}
                  placeholder="Buscar por título, autor, carrera..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 text-sm"
              />
            </div>
            {!esVistaSimple && (
              <button onClick={() => (window as any).toggleDrawer(true)} className="flex items-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg font-medium text-sm flex-shrink-0">
                <i data-lucide="filter" className="h-5 w-5"></i> Filtros
              </button>
            )}
          </div>

          {/* CHIPS DE FILTROS ACTIVOS */}
          {!esVistaSimple && (
            <div id="contenedorChips" className="hidden flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500">Filtros aplicados:</span>
              <div id="listaChips" className="flex flex-wrap gap-2"></div>
              <button onClick={() => (window as any).limpiarFiltros()} className="text-xs text-red-600 hover:underline ml-auto font-medium">Limpiar todos</button>
            </div>
          )}

          {/* Layout Horizontal */}
          <div className="flex gap-6 items-start w-full">
            
            {/* SIDEBAR DE FILTROS POR FACETAS */}
            {!esVistaSimple && (
              <aside className="hidden md:block w-64 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6 flex-shrink-0">
                <h3 className="font-bold text-gray-800 text-base border-b pb-2">Filtros por Facetas</h3>
                
                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Carrera</h4>
                  <div className="space-y-1">
                    <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Informática')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Informática</button>
                    <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Contaduría')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Contaduría</button>
                    <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Administración de Empresas')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                    <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Educación Mención: Integral')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Integral</button>
                    <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Educación Mención: Inicial')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Inicial</button>
                    <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Electrónica')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Electrónica</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Tipo de Documento</h4>
                  <div className="space-y-1">
                    <button onClick={() => (window as any).seleccionarFiltro('tipo', 'Tesis')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Tesis</button>
                    <button onClick={() => (window as any).seleccionarFiltro('tipo', 'Sistematización')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Sistematización</button>
                  </div>
                </div>
              {/*
                <div>
                  <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Año de Publicación</h4>
                  <div className="space-y-1">
                    <button onClick={() => (window as any).seleccionarFiltro('anio', '2026')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">2026</button>
                    <button onClick={() => (window as any).seleccionarFiltro('anio', '2025')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">2025</button>
                  </div>
                </div>
              */}
              </aside>
            )}

            {/* Contenido inyectado por las páginas */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
         {/* INTEGRACIÓN DEL FOOTER DENTRO DE NAVBAR */}
        <Footer/>
      </div>

      {/* FILTROS PARA MÓVIL */}
      <div id="drawerMovil" className="hidden fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
        <div className="w-80 max-w-full bg-white h-full shadow-2xl p-6 flex flex-col space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-gray-900 text-lg">Filtros por Facetas</h3>
            <button onClick={() => (window as any).toggleDrawer(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-lg">
              <i data-lucide="x" className="h-6 w-6"></i>
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Carrera</h4>
              <div className="space-y-1">
                <button onClick={() => { (window as any).seleccionarFiltro('carrera', 'Informática'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Informática</button>
                <button onClick={() => { (window as any).seleccionarFiltro('carrera', 'Contaduría'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Contaduría</button>
                <button onClick={() => { (window as any).seleccionarFiltro('carrera', 'Administración de Empresas'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Administración de Empresas</button>
                <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Educación Mención: Integral')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Integral</button>
                <button onClick={() => (window as any).seleccionarFiltro('carrera', 'Educación Mención: Inicial')} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50">Educación Mención: Inicial</button>
                <button onClick={() => { (window as any).seleccionarFiltro('carrera', 'Electrónica'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Electrónica</button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Tipo de Documento</h4>
              <div className="space-y-1">
                <button onClick={() => { (window as any).seleccionarFiltro('tipo', 'Tesis'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Tesis</button>
                <button onClick={() => { (window as any).seleccionarFiltro('tipo', 'Sistematización'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">Sistematización</button>
              </div>
            </div>

            {/* <div>
              <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Año de Publicación</h4>
              <div className="space-y-1">
                <button onClick={() => { (window as any).seleccionarFiltro('anio', '2026'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">2026</button>
                <button onClick={() => { (window as any).seleccionarFiltro('anio', '2025'); (window as any).toggleDrawer(false); }} className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-blue-50">2025</button>
              </div>
            </div> */}

          </div>

          <div className="pt-4 border-t">
            <button onClick={() => { (window as any).limpiarFiltros(); (window as any).toggleDrawer(false); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 rounded-lg transition">
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function toggleMenuPerfil(event) {
                event.stopPropagation();
                const menu = document.getElementById('menuPerfil');
                if (menu) menu.classList.toggle('hidden');
            }

            function toggleDrawer(abrir) {
                const drawer = document.getElementById('drawerMovil');
                if (!drawer) return;
                if (abrir) {
                    drawer.classList.remove('hidden');
                } else {
                    drawer.classList.add('hidden');
                }
            }

            window.addEventListener('click', function() {
                const menu = document.getElementById('menuPerfil');
                if (menu && !menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            });

            let filtrosSeleccionados = {};

            function seleccionarFiltro(categoria, valor) {
                filtrosSeleccionados[categoria] = valor;
                actualizarChips();
                filtrarDocumentos();
            }

            function removerFiltro(categoria) {
                delete filtrosSeleccionados[categoria];
                actualizarChips();
                filtrarDocumentos();
            }

            function limpiarFiltros() {
                filtrosSeleccionados = {};
                const input = document.getElementById('inputBusqueda');
                if (input) input.value = '';
                actualizarChips();
                filtrarDocumentos();
            }

            function actualizarChips() {
                const contenedor = document.getElementById('contenedorChips');
                const lista = document.getElementById('listaChips');
                if (!contenedor || !lista) return;
                lista.innerHTML = '';

                const keys = Object.keys(filtrosSeleccionados);
                if (keys.length > 0) {
                    contenedor.classList.remove('hidden');
                    contenedor.classList.add('flex');
                    keys.forEach(cat => {
                        lista.innerHTML += \`
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                \${filtrosSeleccionados[cat]} 
                                <button onclick="removerFiltro('\${cat}')" class="hover:text-blue-900 font-bold ml-1">×</button>
                            </span>
                        \`;
                    });
                } else {
                    contenedor.classList.remove('flex');
                    contenedor.classList.add('hidden');
                }
            }

            function filtrarDocumentos() {
                const input = document.getElementById('inputBusqueda');
                const textoBusqueda = input ? input.value.toLowerCase() : '';
                const tarjetas = document.querySelectorAll('.documento-card');
                const estadoVacio = document.getElementById('estadoVacio');
                const contenedorContador = document.getElementById('contenedorContador');
                const contador = document.getElementById('contadorResultados');
                
                const tieneFiltrosActivos = Object.keys(filtrosSeleccionados).length > 0 || textoBusqueda.length > 0;

                if (!tieneFiltrosActivos) {
                    if (contenedorContador) {
                        contenedorContador.classList.remove('flex');
                        contenedorContador.classList.add('hidden');
                    }
                    if (estadoVacio) estadoVacio.classList.add('hidden');
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
                    const anioCard = card.getAttribute('data-anio');
                    const contenidoTexto = card.getAttribute('data-texto');

                    let coincideCarrera = !filtrosSeleccionados['carrera'] || filtrosSeleccionados['carrera'] === carreraCard;
                    let coincideTipo = !filtrosSeleccionados['tipo'] || filtrosSeleccionados['tipo'] === tipoCard;
                    let coincideAnio = !filtrosSeleccionados['anio'] || filtrosSeleccionados['anio'] === anioCard;
                    let coincideTexto = !textoBusqueda || contenidoTexto.includes(textoBusqueda);

                    if (coincideCarrera && coincideTipo && coincideAnio && coincideTexto) {
                        card.style.display = 'flex';
                        visibles++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (contador) contador.innerText = \`Resultados encontrados (\${visibles})\`;

                if (visibles === 0) {
                    if (estadoVacio) estadoVacio.classList.remove('hidden');
                } else {
                    if (estadoVacio) estadoVacio.classList.add('hidden');
                }
            }
          `,
        }}
      />
    </>
  );
}