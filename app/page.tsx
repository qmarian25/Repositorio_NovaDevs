'use client';

import React, { useEffect, useState } from 'react';
import NavbarUser from '@/components/NavbarUser';
import Footer from '@/components/Footer';

export default function Page() {
  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      titulo: 'Repositorio Web Institucional de Tesis y Sistematizaciones',
      categoria: 'Tesis',
      portada: 'https://imgv2-2-f.scribdassets.com/img/document/784044070/original/e9a4f964af/1?v=1',
      guardado: true,
    },
    {
      id: 2,
      titulo: 'Cisco CCNA 2 Module 6: EtherChannel y Redes',
      categoria: 'Sistematización',
      portada: 'https://website-assets.studocu.com/img/document_thumbnails/48b0618d11356cd674ea7ebfb902d872/thumb_300_388.png',
      guardado: false,
    },
    {
      id: 3,
      titulo: 'Arquitectura de Redes y Seguridad Informática Avanzada',
      categoria: 'Tesis',
      portada: 'https://imgv2-2-f.scribdassets.com/img/document/200506656/original/ef88cf9f1e/1?v=1',
      guardado: false,
    },
    {
      id: 4,
      titulo: 'Gestión de Bases de Datos Normalizadas con PHP y MySQL',
      categoria: 'Tesis',
      portada: 'https://imgv2-2-f.scribdassets.com/img/document/658295236/original/49032fcde1/1?v=1',
      guardado: true,
    },
    {
      id: 5,
      titulo: 'Desarrollo de Aplicaciones Web con Next.js y Tailwind CSS',
      categoria: 'Sistematización',
      portada: 'https://imgv2-1-f.scribdassets.com/img/document/450099540/original/16409224f3/1?v=1',
      guardado: false,
    }
  ]);

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
  }, [documentos]);

  const toggleGuardado = (id: number) => {
    setDocumentos(docs => 
      docs.map(doc => doc.id === id ? { ...doc, guardado: !doc.guardado } : doc)
    );
  };

  return (
    <NavbarUser>
      <section className="space-y-3 sm:space-y-4 md:space-y-6 w-full pb-16 min-w-0">
        
        {/* Contador de Resultados */}
        <div id="contenedorContador" className="flex justify-between items-center mb-1.5 sm:mb-2 px-0.5 sm:px-1">
          <h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-700" id="contadorResultados">
            Resultados encontrados ({documentos.length})
          </h2>
        </div>

        {/* GRILLA: 3 columnas mínimo, sin huecos, tarjetas llenan su celda */}
        <div 
          id="listaResultados" 
          className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 w-full min-w-0"
        >
          {documentos.map((doc) => (
            <div 
              key={doc.id}
              className="documento-card bg-white border border-gray-200/90 rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between group relative bg-gradient-to-b from-white to-gray-50/30 w-full min-w-0 overflow-hidden"
              data-carrera={doc.categoria === 'Tesis' ? 'Informática' : 'Sistematización'}
              data-tipo={doc.categoria}
              data-anio="2025"
              data-texto={doc.titulo.toLowerCase()}
            >
              <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 min-w-0">
                
                {/* Portada con Etiqueta PDF */}
                <div className="relative min-w-0">
                  <a href="/visor" className="block w-full h-24 xs:h-28 sm:h-36 md:h-40 lg:h-48 bg-white border border-gray-200/80 rounded-md sm:rounded-lg md:rounded-xl overflow-hidden shadow-inner relative group-hover:border-blue-300 transition p-0.5 sm:p-1 md:p-1.5">
                    <div className="w-full h-full rounded-sm sm:rounded-md md:rounded-lg overflow-hidden relative">
                      <img 
                        src={doc.portada} 
                        alt={doc.titulo} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      
                      {/* ETIQUETA PDF */}
                      <span className="absolute top-0 left-0 bg-black text-white text-[7px] sm:text-[8px] md:text-[10px] font-black px-1 sm:px-1.5 md:px-2.5 py-0.5 rounded-tl-sm rounded-br-md tracking-wider sm:tracking-widest uppercase shadow-sm z-10">
                        PDF
                      </span>
                    </div>
                  </a>

                  {/* Botón de guardado */}
                  <button 
                    onClick={() => toggleGuardado(doc.id)}
                    title={doc.guardado ? "Quitar de guardados" : "Guardar documento"}
                    className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2.5 md:right-2.5 p-0.5 sm:p-1 md:p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm transition z-10"
                  >
                    <i data-lucide="bookmark" className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 transition-colors ${doc.guardado ? 'fill-blue-700 text-blue-700' : 'text-gray-500 hover:text-blue-700'}`}></i>
                  </button>
                </div>

                {/* Información del documento */}
                <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 min-w-0">
                  <span className="inline-block bg-blue-50 text-blue-700 text-[7px] sm:text-[8px] md:text-[10px] font-semibold px-1 sm:px-1.5 md:px-2.5 py-0.5 rounded-full uppercase tracking-wider max-w-full truncate">
                    {doc.categoria}
                  </span>
                  
                  <a href="/visor" className="block min-w-0">
                    <h3 className="font-bold text-gray-900 text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm line-clamp-2 leading-tight sm:leading-snug group-hover:text-blue-700 transition break-words">
                      {doc.titulo}
                    </h3>
                  </a>
                </div>
              </div>
              <div className="pt-0.5 sm:pt-1"></div>
            </div>
          ))}
        </div>

        {/* ESTADO VACÍO */}
        <div 
          id="estadoVacio" 
          className="hidden bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center space-y-4 col-span-full"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <i data-lucide="search-x" className="h-8 w-8"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-800">No se encontraron documentos</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            No hay registros que coincidan con la combinación de filtros seleccionados. Intenta restablecer los criterios.
          </p>
          <button 
            onClick={() => (window as any).limpiarFiltros()} 
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Limpiar Filtros
          </button>
        </div>

      </section>
      
    </NavbarUser>
  );
}