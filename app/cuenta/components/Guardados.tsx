'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PdfThumbnail from '../../admin/modals/PdfThumbnail';
import { Bookmark, Eye, Users, Tag } from 'lucide-react';

// Paleta de colores pastel para las etiquetas
const COLORES_PASTEL = [
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-pink-50 text-pink-700 border-pink-100',
  'bg-amber-50 text-amber-700 border-amber-100',
];

export default function MisGuardados({ userId }: { userId?: number }) {
  const [guardados, setGuardados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  const cargarGuardados = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('guardados')
      .select(`
        id_documento,
        documentos ( 
          id_documento, 
          titulo, 
          descripcion, 
          url_archivo, 
          url_portada, 
          carrera ( nombre_carrera ), 
          tipo_documento ( nombre_tipo_documento ),
          documentos_autores ( usuario ( nombre, apellido ) ),
          documentos_etiquetas ( etiquetas ( nombre_etiqueta ) )
        )
      `)
      .eq('id_usuario', userId)
      .order('fecha_guardado', { ascending: false });

    if (data) {
      setGuardados(data.map((g: any) => {
        const doc = g.documentos;
        
        const autores = doc.documentos_autores
          ?.map((da: any) => `${da.usuario?.nombre || ''} ${da.usuario?.apellido || ''}`.trim())
          .filter((nombre: string) => nombre !== '')
          .join(', ') || 'Sin autores';

        const etiquetas = doc.documentos_etiquetas
          ?.map((de: any) => de.etiquetas?.nombre_etiqueta)
          .filter((tag: string) => tag) || [];

        return {
          id_documento: doc.id_documento,
          titulo: doc.titulo,
          descripcion: doc.descripcion,
          url_portada: doc.url_portada,
          carrera: doc.carrera?.nombre_carrera || 'Sin carrera',
          tipo: doc.tipo_documento?.nombre_tipo_documento || 'Sin tipo',
          autores,
          etiquetas: etiquetas.length > 0 ? etiquetas : [],
        };
      }));
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarGuardados();
  }, [userId]);

  const quitarGuardado = async (id_documento: number) => {
    if (!userId) return;
    await supabase.from('guardados').delete().match({ id_documento, id_usuario: userId });
    setGuardados(prev => prev.filter(item => item.id_documento !== id_documento));
  };

  if (cargando) return <div className="text-center py-10 text-gray-500">Cargando tus guardados...</div>;

  if (guardados.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
        <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">No tienes documentos guardados aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full max-w-4xl mx-auto">
      {guardados.map((doc) => (
        <div 
          key={doc.id_documento} 
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row items-start justify-between gap-5 sm:gap-6 overflow-hidden w-full"
        >
          
          <div className="relative w-full sm:w-32 h-40 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
            <PdfThumbnail urlPortada={doc.url_portada} titulo={doc.titulo} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full py-1">
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-1 break-words group-hover:text-blue-700 transition-colors" title={doc.titulo}>
                {doc.titulo}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[2.5rem] break-words" title={doc.descripcion}>
                {doc.descripcion}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Users className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
              <span className="font-medium text-gray-700 line-clamp-1 break-words">
                {doc.autores}
              </span>
            </div>

          {/* Etiquetas y Metadatos */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-blue-100/50 leading-none">
              {doc.tipo}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-gray-200 leading-none">
              {doc.carrera}
            </span>
            
            {/* Etiquetas dinámicas */}
            {doc.etiquetas && doc.etiquetas.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {doc.etiquetas.map((tag: string, idx: number) => (
                  <span 
                    key={idx} 
                    className={`flex items-center gap-1 text-[11px] border px-2 py-1 rounded-md font-medium leading-none ${COLORES_PASTEL[idx % COLORES_PASTEL.length]}`}
                  >
                    <Tag className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-center w-full sm:w-auto h-full pt-3 sm:pt-0 sm:pl-5 sm:border-l border-gray-100 gap-3 shrink-0">
            {/* Botón Azul Oscuro para el visor */}
            <button 
              onClick={() => router.push(`/visor?id=${doc.id_documento}`)} 
              className="flex items-center justify-center gap-2 w-full sm:w-32 bg-blue-800 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5" 
              title="Ver en visor"
            >
              <Eye className="h-4 w-4" /> Ver
            </button>
            
            {/* Botón de Guardado*/}
            <button 
                onClick={() => quitarGuardado(doc.id_documento)} 
                className="group flex items-center justify-center gap-2 w-full sm:w-32 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-700 border border-blue-200 hover:border-blue-300 text-sm font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 ease-in-out active:scale-95" 
                title="Quitar de guardados"
              >
                <Bookmark className="h-4 w-4 fill-blue-600 group-hover:fill-blue-600 transition-colors duration-300" /> 
                <div className="grid">
                  <span className="col-start-1 row-start-1 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                    Guardado
                  </span>
                  <span className="col-start-1 row-start-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    Quitar
                  </span>
                </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}