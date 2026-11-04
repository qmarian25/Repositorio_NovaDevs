'use client';

import React, { useEffect } from 'react';
import NavbarUser from '@/components/NavbarUser';

export default function DetalleVisorPage() {
  useEffect(() => {
    // Inicializar los iconos de Lucide al cargar el componente
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
    <NavbarUser>
      {/* Contenedor Principal */}
      <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 h-fit">
          <div>
            <span id="badgeTipoDoc" className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">Cargando tipo...</span>
            <span id="badgeCarrera" className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full ml-1">Cargando carrera...</span>
          </div>

          <h1 id="tituloDocumento" className="text-xl font-bold text-gray-900 leading-snug">
            Cargando título del documento...
          </h1>

          {/* Barra de Interacción del Usuario: Me Gusta y Guardar */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <button onClick={(e) => (window as any).toggleAccion(e.currentTarget, 'like')} className="text-gray-500 hover:text-red-500 transition flex items-center gap-1.5 text-sm font-medium">
              <i data-lucide="heart" className="h-5 w-5"></i> <span id="contadorLikes">Me gusta (0)</span>
            </button>
            <div className="h-5 w-px bg-gray-200"></div>
            <button onClick={(e) => (window as any).toggleAccion(e.currentTarget, 'bookmark')} className="text-gray-500 hover:text-blue-600 transition flex items-center gap-1.5 text-sm font-medium">
              <i data-lucide="bookmark" className="h-5 w-5"></i> <span>Guardar documento</span>
            </button>
          </div>

          <div className="border-t border-b py-4 space-y-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700 block">Autores participantes:</span>
              <span id="autoresDocumento" className="text-gray-600">Cargando autores...</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block">Año de Publicación:</span>
              <span id="anioDocumento" className="text-gray-600">----</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Resumen del Documento</h3>
            <p id="resumenDocumento" className="text-gray-600 text-sm leading-relaxed">
              Cargando resumen...
            </p>
          </div>

          {/* Botón de Descarga Directa */}
          <a id="btnDescarga" href="#" target="_blank" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-sm pointer-events-none opacity-50">
            <i data-lucide="download" className="h-4 w-4"></i> Descargar Documento (PDF)
          </a>
        </section>

        {/* Columna Derecha: Visor PDF Integrado Nativamente */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          
          {/* Controles del Visor PDF */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Controles:</span>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Anterior">
                <i data-lucide="chevron-left" className="h-5 w-5"></i>
              </button>
              <span className="text-xs font-medium text-gray-600">Página 1 de --</span>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Siguiente">
                <i data-lucide="chevron-right" className="h-5 w-5"></i>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Alejar">
                <i data-lucide="zoom-out" className="h-5 w-5"></i>
              </button>
              <span className="text-xs font-medium text-gray-600">100%</span>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Acercar">
                <i data-lucide="zoom-in" className="h-5 w-5"></i>
              </button>
              <div className="h-4 w-px bg-gray-300 mx-1"></div>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition flex items-center gap-1 text-xs font-medium">
                <i data-lucide="maximize" className="h-4 w-4"></i> Ajustar
              </button>
            </div>
          </div>

          {/* Área del Visor */}
          <div id="visorContenedor" className="flex-1 bg-gray-600 flex items-center justify-center p-6 min-h-[600px] overflow-auto">
            <div className="text-white text-sm font-medium">Seleccione o cargue un documento para visualizar</div>
          </div>

        </section>

      </main>

      {/* Script con la lógica original intacta */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function toggleMenuPerfil(event) {
                event.stopPropagation();
                const menu = document.getElementById('menuPerfil');
                if (menu) menu.classList.toggle('hidden');
            }

            window.addEventListener('click', function() {
                const menu = document.getElementById('menuPerfil');
                if (menu && !menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            });

            function toggleAccion(button, tipo) {
                if (tipo === 'like') {
                    button.classList.toggle('text-red-500');
                    button.classList.toggle('text-gray-500');
                    const icon = button.querySelector('svg');
                    if (icon) icon.classList.toggle('fill-current');
                } else if (tipo === 'bookmark') {
                    button.classList.toggle('text-blue-600');
                    button.classList.toggle('text-gray-500');
                    const icon = button.querySelector('svg');
                    if (icon) icon.classList.toggle('fill-current');
                }
            }
          `,
        }}
      />
    </NavbarUser>
  );
}
