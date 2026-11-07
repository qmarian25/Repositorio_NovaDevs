'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { TipoDocumento } from '../_types';
import ModalCrearTipoDoc from '../modals/ModalCrearTipoDoc';
import ModalEditarTipoDoc from '../modals/ModalEditarTipoDoc';
import ModalEliminarTipoDoc from '../modals/ModalEliminarTipoDoc';

export default function SeccionTiposDoc() {
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [cargando, setCargando] = useState(true);

  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<TipoDocumento | null>(null);
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
  const [tipoAEliminar, setTipoAEliminar] = useState<TipoDocumento | null>(null);

  const cargarTipos = async () => {
    const { data } = await supabase
      .from('tipo_documento')
      .select('*')
      .eq('activo', true) // ✅ FILTRO CLAVE: Solo trae los activos
      .order('id_tipo_documento', { ascending: true });
    if (data) setTipos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Tipos de Documento</h2>
        {tipos.length > 0 && (
          <button
            onClick={() => setIsModalCrearOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            <i className="fa-solid fa-plus mr-1"></i> Añadir Tipo
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {cargando ? (
          <p className="p-8 text-center text-sm text-gray-500">Cargando tipos de documento...</p>
        ) : tipos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
              <i className="fa-solid fa-tags text-2xl"></i>
            </div>
            <h3 className="text-base font-semibold text-gray-800">No hay tipos de documento</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Añade el primer tipo de documento para clasificar tu repositorio.
            </p>
            <button
              onClick={() => setIsModalCrearOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              <i className="fa-solid fa-plus mr-1"></i> Añadir Tipo
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                <tr>
                  <th className="p-4 w-24">ID</th>
                  <th className="p-4">Nombre del Tipo</th>
                  <th className="p-4 text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {tipos.map((t) => (
                  <tr key={t.id_tipo_documento} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-400">#{t.id_tipo_documento}</td>
                    <td className="p-4 font-semibold text-gray-900">{t.nombre_tipo_documento}</td>
                    <td className="p-4 text-center space-x-3">
                      <button
                        onClick={() => { setTipoEditando(t); setIsModalEditarOpen(true); }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar tipo"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => { setTipoAEliminar(t); setIsModalEliminarOpen(true); }}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar tipo"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalCrearOpen && (
        <ModalCrearTipoDoc onClose={() => setIsModalCrearOpen(false)} onGuardado={cargarTipos} />
      )}

      {isModalEditarOpen && tipoEditando && (
        <ModalEditarTipoDoc
          tipo={tipoEditando}
          onClose={() => { setIsModalEditarOpen(false); setTipoEditando(null); }}
          onGuardado={cargarTipos}
        />
      )}

      {isModalEliminarOpen && tipoAEliminar && (
        <ModalEliminarTipoDoc
          tipo={tipoAEliminar}
          onClose={() => { setIsModalEliminarOpen(false); setTipoAEliminar(null); }}
          onEliminado={() => {
            setTipos((prev) => prev.filter((t) => t.id_tipo_documento !== tipoAEliminar.id_tipo_documento));
            setIsModalEliminarOpen(false);
            setTipoAEliminar(null);
          }}
        />
      )}
    </section>
  );
}