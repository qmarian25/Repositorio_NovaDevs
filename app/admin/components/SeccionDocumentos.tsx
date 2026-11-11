'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Autor, Carrera, Documento, TipoDocumento } from '../_types';
import ModalCrearDoc from '../modals/ModalCrearDoc';
import ModalEditarDoc from '../modals/ModalEditarDoc';
import ModalEliminarDoc from '../modals/ModalEliminarDoc';
import PdfThumbnail from '../modals/PdfThumbnail';
import { Users, Tag } from 'lucide-react';

const COLORES_PASTEL = [
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-pink-50 text-pink-700 border-pink-100',
  'bg-amber-50 text-amber-700 border-amber-100',
];

export default function SeccionDocumentos() {
  const [listaCarreras, setListaCarreras] = useState<Carrera[]>([]);
  const [listaTiposDoc, setListaTiposDoc] = useState<TipoDocumento[]>([]);
  const [usuariosActivos, setUsuariosActivos] = useState<Autor[]>([]);

  const [todasCarreras, setTodasCarreras] = useState<Carrera[]>([]);
  const [todosTiposDoc, setTodosTiposDoc] = useState<TipoDocumento[]>([]);

  const [listaDocumentos, setListaDocumentos] = useState<any[]>([]);
  const [autoresPorDocumento, setAutoresPorDocumento] = useState<Record<number, Autor[]>>({});
  // ✅ Estado para guardar las etiquetas de cada documento
  const [etiquetasPorDocumento, setEtiquetasPorDocumento] = useState<Record<number, string[]>>({});

  const [isModalCrearDocOpen, setIsModalCrearDocOpen] = useState(false);
  const [isModalEditarDocOpen, setIsModalEditarDocOpen] = useState(false);
  const [docEditando, setDocEditando] = useState<Documento | null>(null);
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
  const [docAEliminar, setDocAEliminar] = useState<Documento | null>(null);

  const cargarDatosReales = async () => {
    const { data: carrerasData } = await supabase
      .from('carrera')
      .select('*')
      .order('id_carrera', { ascending: true });
    if (carrerasData) {
      setTodasCarreras(carrerasData);
      setListaCarreras(carrerasData.filter(c => c.activo !== false));
    }

    const { data: tiposData } = await supabase
      .from('tipo_documento')
      .select('*')
      .order('id_tipo_documento', { ascending: true });
    if (tiposData) {
      setTodosTiposDoc(tiposData);
      setListaTiposDoc(tiposData.filter(t => t.activo !== false));
    }

    const { data: usuariosData } = await supabase.from('usuario').select('*');
    let todosAutoresMapeados: Autor[] = [];
    if (usuariosData) {
      todosAutoresMapeados = usuariosData.map((u: any) => ({
        id_usuario: u.id_usuario,
        nombre_usuario: u.nombre_usuario,
        nombreCompleto: `${u.nombre} ${u.apellido}`,
        id_tipo_usuario: u.id_tipo_usuario,
        activo: u.activo,
      }));
      setUsuariosActivos(todosAutoresMapeados.filter(u => (u as any).activo !== false));
    }

    const { data: docsData } = await supabase
      .from('documentos')
      .select('*')
      .eq('activo', true)
      .order('id_documento', { ascending: true });
    if (docsData) setListaDocumentos(docsData);

    if (docsData && docsData.length > 0) {
      const idsDocs = docsData.map((d: any) => d.id_documento);
      
      // Cargar Autores
      if (todosAutoresMapeados.length > 0) {
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
      }

      // ✅ Cargar Etiquetas para mostrarlas en las tarjetas
      const { data: etiquetasData } = await supabase
        .from('documentos_etiquetas')
        .select('id_documento, etiquetas(nombre_etiqueta)')
        .in('id_documento', idsDocs);

      if (etiquetasData) {
        const mapaEtiquetas: Record<number, string[]> = {};
        etiquetasData.forEach((rel: any) => {
          if (!mapaEtiquetas[rel.id_documento]) mapaEtiquetas[rel.id_documento] = [];
          if (rel.etiquetas?.nombre_etiqueta) {
            mapaEtiquetas[rel.id_documento].push(rel.etiquetas.nombre_etiqueta);
          }
        });
        setEtiquetasPorDocumento(mapaEtiquetas);
      }
    } else {
      setAutoresPorDocumento({});
      setEtiquetasPorDocumento({});
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

        <div className="space-y-5 w-full">
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
              const etiquetasDoc = etiquetasPorDocumento[doc.id_documento] || [];
              return (
                <div
                  key={doc.id_documento}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row items-start justify-between gap-5 sm:gap-6 overflow-hidden w-full"
                >
                  
                  {/*PORTADA: Ahora es un enlace que abre en una nueva ventana */}
                  <a 
                    href={doc.url_archivo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative w-full sm:w-32 h-40 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner group block cursor-pointer"
                  >
                    <PdfThumbnail 
                      urlPortada={doc.url_portada} 
                      titulo={doc.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </a>

                  <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full py-1">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-1 break-words" title={doc.titulo}>
                        {doc.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[2.5rem] break-words" title={doc.descripcion}>
                        {doc.descripcion}
                      </p>
                    </div>

                    {/* Autores */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Users className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700 line-clamp-1 break-words">
                        {autoresDoc.length > 0 ? autoresDoc.map((a) => a.nombreCompleto).join(', ') : 'Sin autores registrados'}
                      </span>
                    </div>

                    {/* Etiquetas y Metadatos */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-blue-100/50 leading-none uppercase tracking-wider">
                        {todosTiposDoc.find((t) => t.id_tipo_documento === doc.id_tipo_documento)?.nombre_tipo_documento || 'Tipo desconocido'}
                      </span>
                      <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-[11px] font-medium border border-purple-100 leading-none">
                        {todasCarreras.find((c) => c.id_carrera === doc.id_carrera)?.nombre_carrera || 'Carrera no especificada'}
                      </span>
                      
                      {/* Etiquetas dinámicas con colores pastel */}
                      {etiquetasDoc.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {etiquetasDoc.map((tag: string, idx: number) => (
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
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between w-full sm:w-auto sm:h-40 pt-2 sm:pt-0 sm:pl-5 sm:border-l border-gray-100 gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                      <button onClick={() => abrirEditar(doc)} className="text-gray-500 hover:text-blue-600 text-lg transition" title="Editar documento">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => abrirEliminar(doc)} className="text-gray-400 hover:text-red-600 text-lg transition" title="Eliminar documento">
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