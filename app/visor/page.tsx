'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarUsuarioSimple from '@/components/NavbarUsuarioSimple';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
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
  const { usuario } = useAuth(); // ✅ Obtenemos el usuario logueado

  const [documento, setDocumento] = useState<DocumentoVisor | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para Me Gusta y Guardado
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalSaves, setTotalSaves] = useState(0);

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

        // ✅ Cargar totales de me gusta y guardados del documento
        const { count: likesCount } = await supabase
          .from('me_gusta')
          .select('*', { count: 'exact', head: true })
          .eq('id_documento', id);
        
        const { count: savesCount } = await supabase
          .from('guardados')
          .select('*', { count: 'exact', head: true })
          .eq('id_documento', id);

        setTotalLikes(likesCount || 0);
        setTotalSaves(savesCount || 0);

        // ✅ Verificar si el usuario actual ya dio like o guardó
        if (usuario) {
          const { data: userLike } = await supabase
            .from('me_gusta')
            .select('id_me_gusta')
            .eq('id_documento', id)
            .eq('id_usuario', usuario.id_usuario)
            .maybeSingle();
          setIsLiked(!!userLike);

          const { data: userSave } = await supabase
            .from('guardados')
            .select('id_guardado')
            .eq('id_documento', id)
            .eq('id_usuario', usuario.id_usuario)
            .maybeSingle();
          setIsSaved(!!userSave);
        }

      } catch (err: any) {
        setError(err.message || 'Error al cargar el documento');
      } finally {
        setCargando(false);
      }
    };

    cargarDocumento();
  }, [id, usuario]);

  // ✅ Función para dar o quitar "Me gusta"
  const toggleLike = async () => {
    if (!usuario) {
      alert('Debes iniciar sesión para dar me gusta');
      return;
    }
    if (!documento) return;

    if (isLiked) {
      // Quitar like
      await supabase.from('me_gusta').delete().match({ id_documento: documento.id_documento, id_usuario: usuario.id_usuario });
      setIsLiked(false);
      setTotalLikes((prev) => prev - 1);
    } else {
      // Dar like
      await supabase.from('me_gusta').insert([{ id_documento: documento.id_documento, id_usuario: usuario.id_usuario }]);
      setIsLiked(true);
      setTotalLikes((prev) => prev + 1);
    }
  };

  // ✅ Función para guardar o quitar guardado
  const toggleSave = async () => {
    if (!usuario) {
      alert('Debes iniciar sesión para guardar');
      return;
    }
    if (!documento) return;

    if (isSaved) {
      await supabase.from('guardados').delete().match({ id_documento: documento.id_documento, id_usuario: usuario.id_usuario });
      setIsSaved(false);
      setTotalSaves((prev) => prev - 1);
    } else {
      await supabase.from('guardados').insert([{ id_documento: documento.id_documento, id_usuario: usuario.id_usuario }]);
      setIsSaved(true);
      setTotalSaves((prev) => prev + 1);
    }
  };

  if (cargando) {
    return (
      <NavbarUsuarioSimple>
        <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
          Cargando visor...
        </div>
      </NavbarUsuarioSimple>
    );
  }

  if (error || !documento) {
    return (
      <NavbarUsuarioSimple>
        <main className="w-full flex items-center justify-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <File className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900">{error || 'Documento no encontrado'}</h2>
            <a href="/" className="mt-4 inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Volver al repositorio
            </a>
          </div>
        </main>
      </NavbarUsuarioSimple>
    );
  }

  return (
    <NavbarUsuarioSimple>
      <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 h-fit">
          <div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {documento.tipo_nombre}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full ml-1">
              {documento.carrera_nombre}
            </span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 leading-snug">
            {documento.titulo}
          </h1>

          {/* ✅ BOTONES DE INTERACCIÓN CON CONTADOR */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <button
              onClick={toggleLike}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{totalLikes} Me gusta</span>
            </button>
            <div className="h-5 w-px bg-gray-200"></div>
            <button
              onClick={toggleSave}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                isSaved ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>{totalSaves} Guardados</span>
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

          {documento.url_archivo && (
            <a
              href={documento.url_archivo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="h-4 w-4" /> Descargar Documento (PDF)
            </a>
          )}
        </section>

        <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Visor PDF:</span>
            </div>
          </div>
          <div className="flex-1 bg-gray-600 flex items-center justify-center p-6 min-h-[600px] overflow-auto">
            {documento.url_archivo ? (
              <embed
                src={documento.url_archivo}
                type="application/pdf"
                className="w-full h-full max-w-full max-h-full object-contain"
                title="Visor de PDF"
              />
            ) : (
              <div className="text-gray-300 text-sm font-medium">No hay archivo PDF disponible.</div>
            )}
          </div>
        </section>
      </main>
    </NavbarUsuarioSimple>
  );
}

export default function DetalleVisorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-gray-500">Cargando visor...</div>}>
      <VisorContent />
    </Suspense>
  );
}