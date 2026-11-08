'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarUser from '@/components/NavbarUser';
import { supabase } from '@/lib/supabase';
import { File, Heart, Bookmark, Download, ZoomOut, ZoomIn } from 'lucide-react';

interface DocumentoVisor {
  id_documento: number;
  titulo: string;
  descripcion: string;
  url_archivo: string;
  url_portada: string;
  fecha_publicacion: string;
  carrera_nombre: string;
  tipo_nombre: string;
}

function VisorContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? Number(idParam) : null;

  const [documento, setDocumento] = useState<DocumentoVisor | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
            id_documento,
            titulo,
            descripcion,
            url_archivo,
            url_portada,
            fecha_publicacion,
            carrera ( nombre_carrera ),
            tipo_documento ( nombre_tipo_documento )
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

        setDocumento({
          id_documento: data.id_documento,
          titulo: data.titulo,
          descripcion: data.descripcion,
          url_archivo: data.url_archivo,
          url_portada: data.url_portada || '',
          fecha_publicacion: data.fecha_publicacion,
          carrera_nombre: (data as any).carrera?.nombre_carrera || 'Sin carrera',
          tipo_nombre: (data as any).tipo_documento?.nombre_tipo_documento || 'Sin tipo',
        });
      } catch (err: any) {
        setError(err.message || 'Error al cargar el documento');
      } finally {
        setCargando(false);
      }
    };

    cargarDocumento();
  }, [id]);

  if (cargando) {
    return (
      <NavbarUser>
        <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
          Cargando visor...
        </div>
      </NavbarUser>
    );
  }

  if (error || !documento) {
    return (
      <NavbarUser>
        <main className="w-full flex items-center justify-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <File className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900">{error || 'Documento no encontrado'}</h2>
            <p className="text-gray-500 mt-2">{error ? '' : 'El documento solicitado no existe o no está disponible.'}</p>
            <a
              href="/"
              className="mt-4 inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Volver al repositorio
            </a>
          </div>
        </main>
      </NavbarUser>
    );
  }

  return (
    <NavbarUser>
      <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 h-fit">
          <div>
            <span
              className={`bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full ${
                documento.tipo_nombre.toLowerCase().includes('tesis')
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {documento.tipo_nombre}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full ml-1">
              {documento.carrera_nombre}
            </span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 leading-snug">
            {documento.titulo}
          </h1>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <button
              onClick={() => setIsLiked((prev) => !prev)}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>Me gusta</span>
            </button>
            <div className="h-5 w-px bg-gray-200"></div>
            <button
              onClick={() => setIsSaved((prev) => !prev)}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                isSaved ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>{isSaved ? 'Guardado' : 'Guardar documento'}</span>
            </button>
          </div>

          <div className="border-t border-b py-4 space-y-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700 block">Fecha de publicación:</span>
              <span className="text-gray-600">
                {new Date(documento.fecha_publicacion).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Resumen del Documento</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {documento.descripcion}
            </p>
          </div>

          {documento.url_archivo ? (
            <a
              href={documento.url_archivo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="h-4 w-4" /> Descargar Documento (PDF)
            </a>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm cursor-not-allowed"
            >
              <Download className="h-4 w-4" /> PDF no disponible
            </button>
          )}
        </section>

        <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Visor PDF:</span>
              <span className="text-xs font-medium text-gray-600">Página 1 de --</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Alejar">
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="text-xs font-medium text-gray-600">100%</span>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Acercar">
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div id="visorContenedor" className="flex-1 bg-gray-600 flex items-center justify-center p-6 min-h-[600px] overflow-auto">
            {documento.url_archivo ? (
              <embed
                src={documento.url_archivo}
                type="application/pdf"
                className="w-full h-full max-w-full max-h-full object-contain"
                title="Visor de PDF"
              />
            ) : (
              <div className="text-gray-300 text-sm font-medium">
                No hay archivo PDF disponible para este documento.
              </div>
            )}
          </div>
        </section>
      </main>

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
          `,
        }}
      />
    </NavbarUser>
  );
}

export default function DetalleVisorPage() {
  return <VisorContent />;
}
