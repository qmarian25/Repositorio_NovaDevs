'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import type { Autor, Carrera, ErroresForm, TipoDocumento } from '../_types';

interface Props {
  onClose: () => void;
  onGuardado: () => void;
  listaCarreras: Carrera[];
  listaTiposDoc: TipoDocumento[];
  usuariosRegistrados: Autor[];
}

export default function ModalCrearDoc({
  onClose,
  onGuardado,
  listaCarreras,
  listaTiposDoc,
  usuariosRegistrados,
}: Props) {
  const [componenteMontado, setComponenteMontado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [erroresForm, setErroresForm] = useState<ErroresForm>({});
  const [modalAviso, setModalAviso] = useState<{
    tipo: 'exito' | 'error' | 'advertencia';
    titulo: string;
    mensaje: string;
  } | null>(null);

  const [docForm, setDocForm] = useState({
    titulo: '',
    descripcion: '',
    carrera: '',
    tipo_documento: '',
    fecha_publicacion: '',
  });

  const [busquedaAutor, setBusquedaAutor] = useState('');
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<Autor[]>([]);
  const [inputEtiqueta, setInputEtiqueta] = useState('');
  const [etiquetasDoc, setEtiquetasDoc] = useState<string[]>([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);

  useEffect(() => {
    setComponenteMontado(true);
    // Cargar PDF.js dinámicamente para generar la portada
    if (!(window as any).pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      document.body.appendChild(script);
    }
  }, []);

  const mostrarAviso = (
    tipo: 'exito' | 'error' | 'advertencia',
    titulo: string,
    mensaje: string
  ) => setModalAviso({ tipo, titulo, mensaje });

  const hoyISO = () => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
  };

  const handleKeyDownEtiqueta = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputEtiqueta.trim() !== '') {
      e.preventDefault();
      if (etiquetasDoc.length >= 10) {
        mostrarAviso('advertencia', 'Límite de etiquetas', 'Máximo 10 etiquetas por documento.');
        return;
      }
      const nuevaTag = inputEtiqueta.trim().toLowerCase();
      if (!etiquetasDoc.includes(nuevaTag)) setEtiquetasDoc([...etiquetasDoc, nuevaTag]);
      setInputEtiqueta('');
    }
  };

  const agregarAutor = (autor: Autor) => {
    if (!autoresSeleccionados.some((a) => a.id_usuario === autor.id_usuario)) {
      setAutoresSeleccionados([...autoresSeleccionados, autor]);
    }
    setBusquedaAutor('');
  };

  const eliminarAutor = (id_usuario: number) => {
    setAutoresSeleccionados(autoresSeleccionados.filter((a) => a.id_usuario !== id_usuario));
  };

  const validarFormulario = (): boolean => {
    const e: ErroresForm = {};

    const t = docForm.titulo.trim();
    if (!t) e.titulo = 'El título es obligatorio.';
    else if (t.length < 5) e.titulo = 'Mínimo 5 caracteres.';

    const d = docForm.descripcion.trim();
    if (!d) e.descripcion = 'La descripción es obligatoria.';
    else if (d.length < 5) e.descripcion = 'Mínimo 5 caracteres.';

    if (!docForm.carrera) e.carrera = 'Selecciona una carrera.';
    if (!docForm.tipo_documento) e.tipo_documento = 'Selecciona un tipo.';
    if (!docForm.fecha_publicacion) e.fecha_publicacion = 'La fecha es obligatoria.';
    else if (docForm.fecha_publicacion > hoyISO())
      e.fecha_publicacion = 'No se permiten fechas futuras.';

    if (!archivoSeleccionado) e.archivo = 'El archivo PDF es obligatorio.';

    setErroresForm(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validarFormulario()) return;

    if (autoresSeleccionados.length === 0) {
      mostrarAviso('advertencia', 'Autor requerido', 'Debes seleccionar al menos un autor.');
      return;
    }
    if (etiquetasDoc.length === 0) {
      mostrarAviso('advertencia', 'Etiqueta requerida', 'Debes ingresar al menos una etiqueta.');
      return;
    }

    setGuardando(true);
    try {
      //  SUBIR EL ARCHIVO A SUPABASE STORAGE
      let urlPublica = '';
      if (archivoSeleccionado) {
        const nombreLimpio = archivoSeleccionado.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/ñ/g, 'n')
          .replace(/Ñ/g, 'N')
          .replace(/[^a-zA-Z0-9.-]/g, '_');
        
        const nombreArchivo = `${Date.now()}_${nombreLimpio}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documentos')
          .upload(nombreArchivo, archivoSeleccionado);

        if (uploadError) throw new Error(`Error al subir el PDF: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from('documentos')
          .getPublicUrl(uploadData.path);

        urlPublica = urlData.publicUrl;
      }

      // GENERAR Y SUBIR LA MINIATURA (PORTADA)
      let urlPortada = '';
      try {
        const pdfjsLib = (window as any).pdfjsLib;
        if (pdfjsLib) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const loadingTask = pdfjsLib.getDocument(urlPublica);
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);
          
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport } as any).promise;
            
            const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.8));
            if (blob) {
              const nombreMiniatura = `portada_${Date.now()}.jpg`;
              const { data: uploadMini } = await supabase.storage
                .from('documentos')
                .upload(nombreMiniatura, blob);
              
              if (uploadMini) {
                const { data: urlMini } = supabase.storage.from('documentos').getPublicUrl(uploadMini.path);
                urlPortada = urlMini.publicUrl;
              }
            }
          }
        }
      } catch (err) {
        console.warn('No se pudo generar la miniatura:', err);
      }

      // INSERTAR EL REGISTRO EN LA BASE DE DATOS
      const { data: docData, error: docError } = await supabase
        .from('documentos')
        .insert([
          {
            titulo: docForm.titulo.trim(),
            descripcion: docForm.descripcion.trim(),
            url_archivo: urlPublica,
            url_portada: urlPortada, 
            fecha_publicacion: docForm.fecha_publicacion,
            id_usuario: 1,
            id_tipo_documento: parseInt(docForm.tipo_documento),
            id_carrera: parseInt(docForm.carrera),
          },
        ])
        .select();

      if (docError) throw docError;
      const nuevoDocumentoId = docData[0].id_documento;

      // Guardar Autores
      const autoresInserts = autoresSeleccionados.map((a) => ({
        id_documento: nuevoDocumentoId,
        id_usuario: a.id_usuario,
      }));
      await supabase.from('documentos_autores').insert(autoresInserts);

      // Guardar Etiquetas
      for (const etiquetaNombre of etiquetasDoc) {
        let { data: etiquetaData } = await supabase
          .from('etiquetas')
          .select('id_etiqueta')
          .eq('nombre_etiqueta', etiquetaNombre)
          .maybeSingle();

        let etiquetaId;
        if (!etiquetaData) {
          const { data: nueva, error } = await supabase
            .from('etiquetas')
            .insert([{ nombre_etiqueta: etiquetaNombre }])
            .select()
            .single();
          if (error) throw error;
          etiquetaId = nueva.id_etiqueta;
        } else {
          etiquetaId = etiquetaData.id_etiqueta;
        }

        await supabase
          .from('documentos_etiquetas')
          .insert([{ id_documento: nuevoDocumentoId, id_etiqueta: etiquetaId }]);
      }

      mostrarAviso('exito', 'Documento registrado', 'El documento se ha registrado correctamente.');
      onGuardado();
      setTimeout(onClose, 800);
    } catch (err: any) {
      console.error('Error al guardar:', err.message);
      mostrarAviso('error', 'No se pudo registrar', err.message || 'Error inesperado.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-file-circle-plus text-blue-600"></i> Registrar Documento
          </h3>
          <form onSubmit={handleGuardar} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Título del Documento *</label>
              <input
                type="text"
                placeholder="Escribe el título..."
                value={docForm.titulo}
                onChange={(e) => {
                  setDocForm({ ...docForm, titulo: e.target.value });
                  if (erroresForm.titulo) setErroresForm({ ...erroresForm, titulo: undefined });
                }}
                className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${
                  erroresForm.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {erroresForm.titulo && <p className="text-[11px] text-red-600 mt-1">{erroresForm.titulo}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción del Documento *</label>
              <textarea
                rows={3}
                placeholder="Resumen detallado..."
                value={docForm.descripcion}
                onChange={(e) => {
                  setDocForm({ ...docForm, descripcion: e.target.value });
                  if (erroresForm.descripcion) setErroresForm({ ...erroresForm, descripcion: undefined });
                }}
                className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${
                  erroresForm.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {erroresForm.descripcion && (
                <p className="text-[11px] text-red-600 mt-1">{erroresForm.descripcion}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Autores (Buscar por Cédula) *</label>
              <input
                type="text"
                placeholder="Escribe la cédula del autor..."
                value={busquedaAutor}
                onChange={(e) => setBusquedaAutor(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              {busquedaAutor.length > 0 && (
                <div className="border rounded-lg bg-gray-50 max-h-32 overflow-y-auto mb-2 text-xs">
                  {usuariosRegistrados
                    .filter((u) => u.nombre_usuario.toString().includes(busquedaAutor))
                    .map((u) => (
                      <div
                        key={u.id_usuario}
                        onClick={() => agregarAutor(u)}
                        className="p-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-bold text-gray-800">{u.nombre_usuario}</span>
                        <span className="text-gray-600">{u.nombreCompleto}</span>
                      </div>
                    ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {autoresSeleccionados.map((autor) => (
                  <span
                    key={autor.id_usuario}
                    className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold"
                  >
                    <i className="fa-solid fa-id-card"></i> {autor.nombre_usuario} - {autor.nombreCompleto}
                    <button
                      type="button"
                      onClick={() => eliminarAutor(autor.id_usuario)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Etiquetas (Máx. 10 - Presiona Enter) *
              </label>
              <input
                type="text"
                placeholder="Ej. Tesis, PHP..."
                value={inputEtiqueta}
                onChange={(e) => setInputEtiqueta(e.target.value)}
                onKeyDown={handleKeyDownEtiqueta}
                className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {etiquetasDoc.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setEtiquetasDoc(etiquetasDoc.filter((t) => t !== tag))}
                      className="text-emerald-900 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Carrera *</label>
                <select
                  value={docForm.carrera}
                  onChange={(e) => {
                    setDocForm({ ...docForm, carrera: e.target.value });
                    if (erroresForm.carrera) setErroresForm({ ...erroresForm, carrera: undefined });
                  }}
                  className={`w-full border p-2 rounded-lg text-sm bg-gray-50 text-gray-900 outline-none ${
                    erroresForm.carrera ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione carrera</option>
                  {listaCarreras.map((c) => (
                    <option key={c.id_carrera} value={c.id_carrera}>
                      {c.nombre_carrera}
                    </option>
                  ))}
                </select>
                {erroresForm.carrera && <p className="text-[11px] text-red-600 mt-1">{erroresForm.carrera}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Documento *</label>
                <select
                  value={docForm.tipo_documento}
                  onChange={(e) => {
                    setDocForm({ ...docForm, tipo_documento: e.target.value });
                    if (erroresForm.tipo_documento)
                      setErroresForm({ ...erroresForm, tipo_documento: undefined });
                  }}
                  className={`w-full border p-2 rounded-lg text-sm bg-gray-50 text-gray-900 outline-none ${
                    erroresForm.tipo_documento ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione tipo</option>
                  {listaTiposDoc.map((t) => (
                    <option key={t.id_tipo_documento} value={t.id_tipo_documento}>
                      {t.nombre_tipo_documento}
                    </option>
                  ))}
                </select>
                {erroresForm.tipo_documento && (
                  <p className="text-[11px] text-red-600 mt-1">{erroresForm.tipo_documento}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Publicación *</label>
              <input
                type="date"
                value={docForm.fecha_publicacion}
                max={hoyISO()}
                onChange={(e) => {
                  setDocForm({ ...docForm, fecha_publicacion: e.target.value });
                  if (erroresForm.fecha_publicacion)
                    setErroresForm({ ...erroresForm, fecha_publicacion: undefined });
                }}
                className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 ${
                  erroresForm.fecha_publicacion ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {erroresForm.fecha_publicacion && (
                <p className="text-[11px] text-red-600 mt-1">{erroresForm.fecha_publicacion}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Archivo PDF del documento *</label>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition text-center group ${
                  erroresForm.archivo
                    ? 'border-red-400 bg-red-50/40'
                    : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50'
                }`}
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
                </div>
                <span className="text-xs font-semibold text-blue-900">
                  {archivoSeleccionado
                    ? archivoSeleccionado.name
                    : 'Haz clic para seleccionar el PDF o arrástralo aquí'}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">Solo archivos en formato PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    setArchivoSeleccionado(e.target.files?.[0] || null);
                    if (erroresForm.archivo) setErroresForm({ ...erroresForm, archivo: undefined });
                  }}
                  className="hidden"
                />
              </label>
              {erroresForm.archivo && <p className="text-[11px] text-red-600 mt-1">{erroresForm.archivo}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={guardando}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : 'Guardar Documento'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {componenteMontado &&
        modalAviso &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex min-h-screen items-center justify-center bg-black/60 p-4"
            role="presentation"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setModalAviso(null);
            }}
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                  modalAviso.tipo === 'exito'
                    ? 'bg-emerald-100 text-emerald-600'
                    : modalAviso.tipo === 'error'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                <i
                  className={`text-2xl ${
                    modalAviso.tipo === 'exito'
                      ? 'fa-solid fa-circle-check'
                      : modalAviso.tipo === 'error'
                      ? 'fa-solid fa-circle-xmark'
                      : 'fa-solid fa-circle-exclamation'
                  }`}
                ></i>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{modalAviso.titulo}</h3>
              <p className="mb-6 break-words text-sm leading-6 text-gray-600">{modalAviso.mensaje}</p>
              <button
                type="button"
                onClick={() => setModalAviso(null)}
                className={`w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${
                  modalAviso.tipo === 'exito'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : modalAviso.tipo === 'error'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                Entendido
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}