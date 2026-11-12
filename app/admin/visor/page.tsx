'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NavbarAdminSimple from '@/components/NavbarAdmin';
import { supabase } from '@/lib/supabase';
import PdfThumbnail from '../modals/PdfThumbnail';
import { File, Download, Users, Tag } from 'lucide-react';

const COLORES_PASTEL = [
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-pink-50 text-pink-700 border-pink-100',
  'bg-amber-50 text-amber-700 border-amber-100',
];

interface DocumentoVisor {
  id_documento: number;
  titulo: string;
  descripcion: string;
  url_archivo: string;
  url_portada: string;
  fecha_publicacion: string;
  carrera_nombre: string;
  tipo_nombre: string;
  id_carrera: number;
  autores: string;
  etiquetas: string[];
}

function VisorContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? Number(idParam) : null;
  const router = useRouter();

  const [documento, setDocumento] = useState<DocumentoVisor | null>(null);
  const [recomendados, setRecomendados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica para el carrusel fluido
  const carruselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const cargarDocumento = async () => {
      if (!id) {
        setError('ID de documento no válido');
        setCargando(false);
        return;
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('documentos')
          .select(`
            id_documento, titulo, descripcion, url_archivo, url_portada, fecha_publicacion, id_carrera,
            carrera ( nombre_carrera ),
            tipo_documento ( nombre_tipo_documento ),
            documentos_autores ( usuario ( nombre, apellido ) ),
            documentos_etiquetas ( etiquetas ( nombre_etiqueta ) )
          `)
          .eq('id_documento', id)
          .eq('activo', true)
          .maybeSingle();

        if (supabaseError) throw supabaseError;
        if (!data) {
          setError('Documento no encontrado');
          setCargando(false);
          return;
        }

        const autores = data.documentos_autores
          ?.map((da: any) => `${da.usuario?.nombre || ''} ${da.usuario?.apellido || ''}`.trim())
          .filter((n: string) => n !== '')
          .join(', ') || 'Sin autores';

        const etiquetas = data.documentos_etiquetas
          ?.map((de: any) => de.etiquetas?.nombre_etiqueta)
          .filter((t: string) => t) || [];

        setDocumento({
          id_documento: data.id_documento,
          titulo: data.titulo,
          descripcion: data.descripcion,
          url_archivo: data.url_archivo,
          url_portada: data.url_portada || '',
          fecha_publicacion: data.fecha_publicacion,
          carrera_nombre: (data as any).carrera?.nombre_carrera || 'Sin carrera',
          tipo_nombre: (data as any).tipo_documento?.nombre_tipo_documento || 'Sin tipo',
          id_carrera: data.id_carrera,
          autores,
          etiquetas,
        });

        // Cargar recomendados de la misma carrera
        const { data: recs } = await supabase
          .from('documentos')
          .select(`
            id_documento, titulo, url_portada,
            tipo_documento ( nombre_tipo_documento )
          `)
          .eq('id_carrera', data.id_carrera)
          .eq('activo', true)
          .neq('id_documento', id)
          .limit(8);
          
        if (recs) setRecomendados(recs);

      } catch (err: any) {
        setError(err.message || 'Error al cargar el documento');
      } finally {
        setCargando(false);
      }
    };

    cargarDocumento();
  }, [id]);

  // Auto-scroll del carrusel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recomendados.length > 3 && !isDragging) {
      interval = setInterval(() => {
        if (carruselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carruselRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            carruselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            carruselRef.current.scrollBy({ left: 220, behavior: 'smooth' });
          }
        }
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [recomendados, isDragging]);

  // Lógica de arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (carruselRef.current) {
      setStartX(e.pageX - carruselRef.current.offsetLeft);
      setScrollLeft(carruselRef.current.scrollLeft);
    }
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carruselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carruselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carruselRef.current.scrollLeft = scrollLeft - walk;
  };

  if (cargando) return <NavbarAdminSimple><div className="flex justify-center py-20 text-gray-500">Cargando visor...</div></NavbarAdminSimple>;
  if (error || !documento) return <NavbarAdminSimple><div className="text-center py-20 text-red-500">{error}</div></NavbarAdminSimple>;

  return (
    <NavbarAdminSimple>
      <main className="w-full max-w-7xl mx-auto space-y-8 pb-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel Izquierdo: Metadatos */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 h-fit">
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-100">
                {documento.tipo_nombre}
              </span>
              <span className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-purple-100">
                {documento.carrera_nombre}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {documento.titulo}
            </h1>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-blue-600 mt-0.5" />
              <span>
                <span className="font-semibold text-gray-900">Autores: </span>
                {documento.autores}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Fecha de Publicación</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{new Date(documento.fecha_publicacion).toLocaleDateString('es-ES')}</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Resumen del Documento</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{documento.descripcion}</p>
            </div>

            {documento.etiquetas.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {documento.etiquetas.map((tag, idx) => (
                    <span key={idx} className={`flex items-center gap-1.5 text-xs border px-2.5 py-1 rounded-md font-medium ${COLORES_PASTEL[idx % COLORES_PASTEL.length]}`}>
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {documento.url_archivo && (
              <a href={documento.url_archivo} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm mt-2">
                <Download className="h-4 w-4" /> Descargar Documento (PDF)
              </a>
            )}
          </section>

          {/* Panel Derecho: Visor PDF Limpio (Sin toolbar) */}
          <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Visor de PDF</span>
            </div>
            <div className="flex-1 bg-gray-800 flex items-center justify-center p-4 min-h-[600px]">
              {documento.url_archivo ? (
                <embed src={documento.url_archivo} type="application/pdf" className="w-full h-full rounded-lg" />
              ) : (
                <div className="text-gray-400">No hay archivo PDF disponible.</div>
              )}
            </div>
          </section>
        </div>

        {/* ✅ CARRUSEL AUTOMÁTICO Y ARRASTRABLE (SOLO RECOMENDADOS) */}
        {recomendados.length > 0 && (
          <section className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Trabajos Recomendados de esta Carrera</h2>
            
            <div 
              ref={carruselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className={`flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden ${
                isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-proximity'
              }`}
            >
              {recomendados.map((rec) => (
                <div 
                  key={rec.id_documento} 
                  onClick={() => { 
                  if(!isDragging) {
                    const rutaActual = window.location.pathname;
                    router.push(`${rutaActual}?id=${rec.id_documento}`);
                  } 
                }}
                  className="snap-start flex-shrink-0 w-[160px] sm:w-[200px] bg-white border border-gray-200 rounded-xl p-2 cursor-pointer hover:shadow-md transition group select-none"
                >
                  <div className="w-full h-48 sm:h-60 bg-gray-50 rounded-lg overflow-hidden mb-3 border border-gray-100 pointer-events-none">
                    <PdfThumbnail urlPortada={rec.url_portada} titulo={rec.titulo} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  
                  <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 pointer-events-none">
                    {rec.tipo_documento?.nombre_tipo_documento}
                  </span>
                  
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-blue-700 transition pointer-events-none">
                    {rec.titulo}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </NavbarAdminSimple>
  );
}

export default function AdminVisorPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gray-500">Cargando...</div>}>
      <VisorContent />
    </Suspense>
  );
}