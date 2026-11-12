'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarUser from '@/components/NavbarUser';
import { supabase } from '@/lib/supabase';
import { SearchX } from 'lucide-react';
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
  autores: string;
  etiquetas: string[];
}

function DocumentosContent() {
  const searchParams = useSearchParams();
  
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const filtroCarrera = searchParams.get('carrera') || '';
  const filtroTipo = searchParams.get('tipo') || '';
  const filtroAnio = searchParams.get('anio') || '';
  const filtroRango = searchParams.get('rango') || '';

  const [documentos, setDocumentos] = useState<DocumentoReal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDocumentos = async () => {
      // ✅ Consulta limpia con autores y etiquetas
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
          tipo_documento ( nombre_tipo_documento ),
          documentos_autores ( usuario ( nombre, apellido ) ),
          documentos_etiquetas ( etiquetas ( nombre_etiqueta ) )
        `)
        .eq('activo', true)
        .order('id_documento', { ascending: false });

      if (error) {
        console.error("Error cargando documentos:", error);
      }

      if (data) {
        const docsMapeados: DocumentoReal[] = data.map((doc: any) => {
          const autoresArray = doc.documentos_autores
            ?.map((da: any) => `${da.usuario?.nombre || ''} ${da.usuario?.apellido || ''}`.trim()) || [];
          
          const etiquetasArray = doc.documentos_etiquetas
            ?.map((de: any) => de.etiquetas?.nombre_etiqueta)
            .filter(Boolean) || [];

          return {
            id_documento: doc.id_documento,
            titulo: doc.titulo,
            descripcion: doc.descripcion,
            url_archivo: doc.url_archivo,
            url_portada: doc.url_portada || '',
            fecha_publicacion: doc.fecha_publicacion,
            carrera_nombre: doc.carrera?.nombre_carrera || 'Sin carrera',
            tipo_nombre: doc.tipo_documento?.nombre_tipo_documento || 'Sin tipo',
            autores: autoresArray.filter(Boolean).join(', '),
            etiquetas: etiquetasArray,
          };
        });
        setDocumentos(docsMapeados);
      }
      setCargando(false);
    };

    cargarDocumentos();
  }, []);

  // ✅ Filtrado en tiempo real
  const documentosFiltrados = documentos.filter((doc) => {
    let coincideTexto = true;
    if (searchQuery) {
      const busquedaCompleta = `${doc.titulo} ${doc.descripcion} ${doc.carrera_nombre} ${doc.tipo_nombre} ${doc.autores} ${doc.etiquetas.join(' ')}`.toLowerCase();
      coincideTexto = busquedaCompleta.includes(searchQuery);
    }

    let coincideCarrera = !filtroCarrera || doc.carrera_nombre === filtroCarrera;
    let coincideTipo = !filtroTipo || doc.tipo_nombre === filtroTipo;

    let coincideAnio = true;
    let coincideRango = true;
    
    if (doc.fecha_publicacion) {
      const fecha = new Date(doc.fecha_publicacion);
      const anioDoc = fecha.getFullYear().toString();
      const hoy = new Date();
      const mesesDiferencia = (hoy.getFullYear() - fecha.getFullYear()) * 12 + (hoy.getMonth() - fecha.getMonth());

      if (filtroAnio) coincideAnio = anioDoc === filtroAnio;

      if (filtroRango) {
        if (filtroRango === 'Último mes') coincideRango = mesesDiferencia <= 1;
        else if (filtroRango === 'Últimos 6 meses') coincideRango = mesesDiferencia <= 6;
        else if (filtroRango === 'Último año') coincideRango = mesesDiferencia <= 12;
      }
    }

    return coincideTexto && coincideCarrera && coincideTipo && coincideAnio && coincideRango;
  });

  return (
    <section className="space-y-3 sm:space-y-4 md:space-y-6 w-full pb-16 min-w-0">
      
      <div id="contenedorContador" className="flex justify-between items-center mb-1.5 sm:mb-2 px-0.5 sm:px-1">
        <h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-700" id="contadorResultados">
          Resultados encontrados ({documentosFiltrados.length})
        </h2>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center py-20 w-full col-span-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : documentosFiltrados.length === 0 ? (
        <div id="no-resultados" className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center space-y-4 w-full">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No hay documentos registrados</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Aún no se han subido documentos al repositorio o no coinciden con tu búsqueda.
          </p>
        </div>
      ) : (
        <div 
          id="listaResultados" 
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full min-w-0"
        >
          {documentosFiltrados.map((doc) => (
            <div 
              key={doc.id_documento}
              className="documento-card bg-white border border-gray-200/90 rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-2.5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative bg-gradient-to-b from-white to-gray-50/30 w-full min-w-0 overflow-hidden"
            >
              <div className="space-y-1.5 sm:space-y-2 min-w-0 flex flex-col h-full">
                
                <div className="relative min-w-0">
                  <a href={`/visor?id=${doc.id_documento}`} className="block w-full aspect-[3/4] bg-white border border-gray-200/80 rounded-md sm:rounded-lg md:rounded-xl overflow-hidden shadow-inner relative group-hover:border-blue-300 transition p-0.5 sm:p-1">
                    <div className="w-full h-full rounded-sm sm:rounded-md md:rounded-lg overflow-hidden relative">
                      <PdfThumbnail urlPortada={doc.url_portada} titulo={doc.titulo} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-0 left-0 bg-black text-white text-[7px] sm:text-[8px] md:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded-tl-sm rounded-br-md tracking-wider uppercase shadow-sm z-10">
                        PDF
                      </span>
                    </div>
                  </a>
                </div>

                <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                  <span className="inline-block bg-blue-50 text-blue-700 text-[7px] sm:text-[8px] md:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full uppercase tracking-wider max-w-full truncate">
                    {doc.tipo_nombre}
                  </span>
                  
                  <a href={`/visor?id=${doc.id_documento}`} className="block min-w-0">
                    <h3 className="font-bold text-gray-900 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs line-clamp-2 leading-tight sm:leading-snug group-hover:text-blue-700 transition break-words">
                      {doc.titulo}
                    </h3>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Page() {
  return (
    <NavbarUser>
      <Suspense fallback={<div className="flex justify-center py-20 w-full"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div></div>}>
        <DocumentosContent />
      </Suspense>
    </NavbarUser>
  );
}