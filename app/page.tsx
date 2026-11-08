'use client';

import React, { useEffect, useState } from 'react';
import NavbarUser from '@/components/NavbarUser';
import { supabase } from '@/lib/supabase';
import { SearchX, Bookmark } from 'lucide-react';
import PdfThumbnail from './admin/modals/PdfThumbnail';

interface DocumentoReal {
  id_documento: number;
  titulo: string;
  descripcion: string;
  url_archivo: string;
  url_portada: string;
  fecha_publicacion: string;
  carrera_nombre: string;
  tipo_nombre: string;
  guardado?: boolean;
}

export default function Page() {
  const [documentos, setDocumentos] = useState<DocumentoReal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDocumentos = async () => {
      const { data, error } = await supabase
        .from('documentos')
        .select(`
          id_documento,
          titulo,
          descripcion,
          url_archivo,
          url_portada,
          fecha_publicacion,
          carrera ( nombre_carrera ),
          tipo_documento ( nombre_tipo_documento )
        `)
        .eq('activo', true)
        .order('id_documento', { ascending: false });

      if (data) {
        const docsMapeados: DocumentoReal[] = data.map((doc: any) => ({
          id_documento: doc.id_documento,
          titulo: doc.titulo,
          descripcion: doc.descripcion,
          url_archivo: doc.url_archivo,
          url_portada: doc.url_portada || '',
          fecha_publicacion: doc.fecha_publicacion,
          carrera_nombre: doc.carrera?.nombre_carrera || 'Sin carrera',
          tipo_nombre: doc.tipo_documento?.nombre_tipo_documento || 'Sin tipo',
          guardado: false,
        }));
        setDocumentos(docsMapeados);
      }
      setCargando(false);
    };

    cargarDocumentos();
  }, []);

  const toggleGuardado = (id: number) => {
    setDocumentos((docs) =>
      docs.map((doc) =>
        doc.id_documento === id ? { ...doc, guardado: !doc.guardado } : doc
      )
    );
  };

  return (
    <NavbarUser>
      <section className="space-y-3 sm:space-y-4 md:space-y-6 w-full pb-16 min-w-0">
        
        <div id="contenedorContador" className="flex justify-between items-center mb-1.5 sm:mb-2 px-0.5 sm:px-1">
          <h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-700" id="contadorResultados">
            Resultados encontrados ({documentos.length})
          </h2>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center py-20 w-full col-span-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        ) : documentos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center space-y-4 w-full">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <SearchX className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No hay documentos registrados</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Aún no se han subido documentos al repositorio, o los filtros no coinciden.
            </p>
          </div>
        ) : (
          <div 
            id="listaResultados" 
            className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 w-full min-w-0"
          >
            {documentos.map((doc) => (
              <div 
                key={doc.id_documento}
                className="documento-card bg-white border border-gray-200/90 rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between group relative bg-gradient-to-b from-white to-gray-50/30 w-full min-w-0 overflow-hidden"
                data-carrera={doc.carrera_nombre}
                data-tipo={doc.tipo_nombre}
                data-anio={new Date(doc.fecha_publicacion).getFullYear()}
                data-texto={doc.titulo.toLowerCase()}
              >
                <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 min-w-0">
                  
                  <div className="relative min-w-0">
                    <a href={`/visor?id=${doc.id_documento}`} className="block w-full h-24 xs:h-28 sm:h-36 md:h-40 lg:h-48 bg-white border border-gray-200/80 rounded-md sm:rounded-lg md:rounded-xl overflow-hidden shadow-inner relative group-hover:border-blue-300 transition p-0.5 sm:p-1 md:p-1.5">
                      <div className="w-full h-full rounded-sm sm:rounded-md md:rounded-lg overflow-hidden relative">
                        
                        {/* URL DE LA PORTADA (IMAGEN RÁPIDA) */}
                        <PdfThumbnail urlPortada={doc.url_portada} titulo={doc.titulo} className="w-full h-full" />
                        
                        <span className="absolute top-0 left-0 bg-black text-white text-[7px] sm:text-[8px] md:text-[10px] font-black px-1 sm:px-1.5 md:px-2.5 py-0.5 rounded-tl-sm rounded-br-md tracking-wider sm:tracking-widest uppercase shadow-sm z-10">
                          PDF
                        </span>
                      </div>
                    </a>

                    <button 
                      onClick={(e) => { e.preventDefault(); toggleGuardado(doc.id_documento); }}
                      title={doc.guardado ? "Quitar de guardados" : "Guardar documento"}
                      className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2.5 md:right-2.5 p-0.5 sm:p-1 md:p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm transition z-10"
                    >
                      <Bookmark className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 transition-colors ${doc.guardado ? 'fill-blue-700 text-blue-700' : 'text-gray-500 hover:text-blue-700'}`} />
                    </button>
                  </div>

                  <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 min-w-0">
                    <span className="inline-block bg-blue-50 text-blue-700 text-[7px] sm:text-[8px] md:text-[10px] font-semibold px-1 sm:px-1.5 md:px-2.5 py-0.5 rounded-full uppercase tracking-wider max-w-full truncate">
                      {doc.tipo_nombre}
                    </span>
                    
                    <a href={`/visor?id=${doc.id_documento}`} className="block min-w-0">
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
        )}
      </section>
    </NavbarUser>
  );
}