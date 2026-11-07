'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Autor, Carrera, Documento, TipoDocumento } from '../_types';
import ModalCrearDoc from '../modals/ModalCrearDoc';
import ModalEditarDoc from '../modals/ModalEditarDoc';
import ModalEliminarDoc from '../modals/ModalEliminarDoc';
import PdfThumbnail from '../modals/PdfThumbnail';

export default function SeccionDocumentos() {
  // Listas para los modales (solo activos)
  const [listaCarreras, setListaCarreras] = useState<Carrera[]>([]);
  const [listaTiposDoc, setListaTiposDoc] = useState<TipoDocumento[]>([]);
  const [usuariosActivos, setUsuariosActivos] = useState<Autor[]>([]);

  // Listas completas (activos e inactivos) para mostrar en las tarjetas
  const [todasCarreras, setTodasCarreras] = useState<Carrera[]>([]);
  const [todosTiposDoc, setTodosTiposDoc] = useState<TipoDocumento[]>([]);

  const [listaDocumentos, setListaDocumentos] = useState<Documento[]>([]);
  const [autoresPorDocumento, setAutoresPorDocumento] = useState<Record<number, Autor[]>>({});

  const [isModalCrearDocOpen, setIsModalCrearDocOpen] = useState(false);
  const [isModalEditarDocOpen, setIsModalEditarDocOpen] = useState(false);
  const [docEditando, setDocEditando] = useState<Documento | null>(null);
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
  const [docAEliminar, setDocAEliminar] = useState<Documento | null>(null);

  const cargarDatosReales = async () => {
    // 1. TODAS las carreras
    const { data: carrerasData } = await supabase
      .from('carrera')
      .select('*')
      .order('id_carrera', { ascending: true });
    if (carrerasData) {
      setTodasCarreras(carrerasData);
      setListaCarreras(carrerasData.filter(c => c.activo !== false));
    }

    // 2. TODOS los tipos de documento
    const { data: tiposData } = await supabase
      .from('tipo_documento')
      .select('*')
      .order('id_tipo_documento', { ascending: true });
    if (tiposData) {
      setTodosTiposDoc(tiposData);
      setListaTiposDoc(tiposData.filter(t => t.activo !== false));
    }

    // 3. TODOS los usuarios (para mapear autores en tarjetas)
    const { data: usuariosData } = await supabase.from('usuario').select('*');
    let todosAutoresMapeados: Autor[] = [];
    if (usuariosData) {
      todosAutoresMapeados = usuariosData.map((u: any) => ({
        id_usuario: u.id_usuario,
        nombre_usuario: u.nombre_usuario,
        nombreCompleto: `${u.nombre} ${u.apellido}`,
      }));
      // Solo los activos van al modal
      setUsuariosActivos(todosAutoresMapeados.filter(u => (u as any).activo !== false));
    }

    // 4. Documentos activos
    const { data: docsData } = await supabase
      .from('documentos')
      .select('*')
      .eq('activo', true)
      .order('id_documento', { ascending: true });
    if (docsData) setListaDocumentos(docsData);

    // 5. Relaciones de autores (usando TODOS los usuarios mapeados)
    if (docsData && docsData.length > 0 && todosAutoresMapeados.length > 0) {
      const idsDocs = docsData.map((d: any) => d.id_documento);
      const { data: relaciones } = await supabase
        .from('documentos_autores')
        .select('id_documento, id_usuario')
        .in('id_documento', idsDocs);

      if (relaciones) {
        const mapa: Record<number, Autor[]> = {};
        const autorPorId = new Map<number, Autor>(
          todosAutoresMapeados.map((a) => [a.id_usuario, a])
        );
        relaciones.forEach((r: any) => {
          const autor = autorPorId.get(r.id_usuario);
          if (!autor) return;
          if (!mapa[r.id_documento]) mapa[r.id_documento] = [];
          mapa[r.id_documento].push(autor);
        });
        setAutoresPorDocumento(mapa);
      }
    } else {
      setAutoresPorDocumento({});
    }
  };

  useEffect(() => {
    cargarDatosReales();
  }, []);

  const abrirEditar = (doc: Documento) => {
    setDocEditando(doc);
    setIsModalEditarDocOpen(true);
  };

  const abrirEliminar = (doc: Documento) => {
    setDocAEliminar(doc);
    setIsModalEliminarOpen(true);
  };

return (
    <div className="w-full flex justify-center px-4">
      <section className="space-y-4 w-full max-w-4xl">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-gray-800">Listado de Documentos</h2>
          {listaDocumentos.length > 0 && (
            <button
              onClick={() => setIsModalCrearDocOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              <i className="fa-solid fa-file-circle-plus mr-1"></i> Registrar Documento
            </button>
          )}
        </div>

        <div className="space-y-4 w-full">
          {listaDocumentos.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <i className="fa-solid fa-book-open text-2xl"></i>
              </div>
              <h3 className="text-base font-semibold text-gray-800">No hay documentos registrados</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Comienza añadiendo el primer documento al repositorio.
              </p>
              <button
                onClick={() => setIsModalCrearDocOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                <i className="fa-solid fa-file-circle-plus mr-1"></i> Registrar Documento
              </button>
            </div>
          ) : (
            listaDocumentos.map((doc) => {
              const autoresDoc = autoresPorDocumento[doc.id_documento] || [];
              return (
                <div
                  key={doc.id_documento}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 overflow-hidden w-full"
                >
                  <PdfThumbnail url={doc.url_archivo} titulo={doc.titulo} />

                  <div className="flex-1 min-w-0 w-full space-y-1.5">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-1 break-words" title={doc.titulo}>
                      {doc.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 leading-snug line-clamp-2 min-h-[2.5rem] break-words" title={doc.descripcion}>
                      {doc.descripcion}
                    </p>

                    <div className="pt-1 text-xs text-gray-500 min-w-0">
                      <span className="font-semibold text-gray-700 line-clamp-1 break-words block">
                        <i className="fa-solid fa-users text-blue-600 mr-1"></i>
                        {autoresDoc.length > 0
                          ? autoresDoc.map((a) => a.nombreCompleto).join(', ')
                          : 'Sin autores registrados'}
                      </span>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 min-w-0">
                      <span className="font-semibold text-gray-800 truncate max-w-full sm:max-w-[240px]">
                        <i className="fa-solid fa-user-graduate text-blue-600"></i>{' '}
                        {todasCarreras.find((c) => c.id_carrera === doc.id_carrera)?.nombre_carrera || 'Carrera no especificada'}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold max-w-full truncate">
                        {todosTiposDoc.find((t) => t.id_tipo_documento === doc.id_tipo_documento)?.nombre_tipo_documento || 'Tipo desconocido'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between w-full sm:w-auto sm:h-36 pt-2 sm:pt-0 sm:pl-4 sm:border-l border-gray-200 gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                      <button onClick={() => abrirEditar(doc)} className="text-gray-500 hover:text-blue-600 text-base" title="Editar documento">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => abrirEliminar(doc)} className="text-gray-400 hover:text-red-600 text-base transition" title="Eliminar documento">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                      Documento N° #{doc.id_documento}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {isModalCrearDocOpen && (
          <ModalCrearDoc
            onClose={() => setIsModalCrearDocOpen(false)}
            onGuardado={cargarDatosReales}
            listaCarreras={listaCarreras}
            listaTiposDoc={listaTiposDoc}
            usuariosRegistrados={usuariosActivos}
          />
        )}

        {isModalEditarDocOpen && docEditando && (
          <ModalEditarDoc
            doc={docEditando}
            onClose={() => { setIsModalEditarDocOpen(false); setDocEditando(null); }}
            onGuardado={cargarDatosReales}
            listaCarreras={listaCarreras}
            listaTiposDoc={listaTiposDoc}
            usuariosRegistrados={usuariosActivos}
          />
        )}

        {isModalEliminarOpen && docAEliminar && (
          <ModalEliminarDoc
            doc={docAEliminar}
            onClose={() => { setIsModalEliminarOpen(false); setDocAEliminar(null); }}
            onEliminado={() => {
              setListaDocumentos((prev) => prev.filter((d) => d.id_documento !== docAEliminar.id_documento));
              setIsModalEliminarOpen(false);
              setDocAEliminar(null);
            }}
          />
        )}
      </section>
    </div>
  );
}