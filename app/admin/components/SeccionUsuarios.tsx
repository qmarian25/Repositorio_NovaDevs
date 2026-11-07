'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Usuario } from '../_types'; // Ajustado a types.ts
import ModalCrearUsuario from '../modals/ModalCrearUsuario';
import ModalEditarUsuario from '../modals/ModalEditarUsuario';
import ModalEliminarUsuario from '../modals/ModalEliminarUsuario';

export default function SeccionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  const cargarUsuarios = async () => {
    const { data } = await supabase
      .from('usuario')
      .select('*')
      .eq('activo', true) // ✅ FILTRO CLAVE: Solo trae los activos
      .order('id_usuario', { ascending: true });
    if (data) setUsuarios(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const abrirEditar = (u: Usuario) => {
    setUsuarioEditando(u);
    setIsModalEditarOpen(true);
  };

  const abrirEliminar = (u: Usuario) => {
    setUsuarioAEliminar(u);
    setIsModalEliminarOpen(true);
  };

  // Mostrar contraseña truncada (solo los primeros 6 caracteres del hash + ...)
  const mostrarPassword = (hash?: string) => {
    if (!hash) return '—';
    if (hash.length <= 6) return hash.substring(0, 3) + '...';
    return hash.substring(0, 6) + '...';
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Listado de Usuarios</h2>
        {/* ✅ Ocultamos el botón si no hay usuarios para no duplicar */}
        {usuarios.length > 0 && (
          <button
            onClick={() => setIsModalCrearOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            <i className="fa-solid fa-user-plus mr-1"></i> Añadir Usuario
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {cargando ? (
          <p className="p-8 text-center text-sm text-gray-500">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
              <i className="fa-solid fa-users text-2xl"></i>
            </div>
            <h3 className="text-base font-semibold text-gray-800">No hay usuarios registrados</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Comienza añadiendo el primer usuario al sistema.</p>
            <button
              onClick={() => setIsModalCrearOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              <i className="fa-solid fa-user-plus mr-1"></i> Añadir Usuario
            </button>
          </div>
        ) : (
          <>
            {/* Tabla desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                  <tr>
                    <th className="p-4">Cédula</th>
                    <th className="p-4">Nombre Completo</th>
                    <th className="p-4">Correo</th>
                    <th className="p-4">Contraseña</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm text-gray-700">
                  {usuarios.map((u) => (
                    <tr key={u.id_usuario} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{u.nombre_usuario}</td>
                      <td className="p-4">{u.nombre} {u.apellido}</td>
                      <td className="p-4 text-gray-500">{u.correo}</td>
                      <td className="p-4 text-gray-400 font-mono text-xs">{mostrarPassword(u.contrasena)}</td>
                      <td className="p-4 text-center space-x-3">
                        <button onClick={() => abrirEditar(u)} className="text-blue-600 hover:text-blue-800" title="Editar usuario">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => abrirEliminar(u)} className="text-red-500 hover:text-red-700" title="Eliminar usuario">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas móvil */}
            <div className="md:hidden divide-y divide-gray-200">
              {usuarios.map((u) => (
                <div key={u.id_usuario} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{u.nombre} {u.apellido}</p>
                      <p className="text-xs text-gray-500">C.I. {u.nombre_usuario}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => abrirEditar(u)} className="text-blue-600 text-sm">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => abrirEliminar(u)} className="text-red-500 text-sm">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 break-all">{u.correo}</p>
                  <p className="text-xs text-gray-400 font-mono">{mostrarPassword(u.contrasena)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalCrearOpen && (
        <ModalCrearUsuario onClose={() => setIsModalCrearOpen(false)} onGuardado={cargarUsuarios} />
      )}

      {isModalEditarOpen && usuarioEditando && (
        <ModalEditarUsuario
          usuario={usuarioEditando}
          onClose={() => { setIsModalEditarOpen(false); setUsuarioEditando(null); }}
          onGuardado={cargarUsuarios}
        />
      )}

      {isModalEliminarOpen && usuarioAEliminar && (
        <ModalEliminarUsuario
          usuario={usuarioAEliminar}
          onClose={() => { setIsModalEliminarOpen(false); setUsuarioAEliminar(null); }}
          onEliminado={() => {
            setUsuarios((prev) => prev.filter((u) => u.id_usuario !== usuarioAEliminar.id_usuario));
            setIsModalEliminarOpen(false);
            setUsuarioAEliminar(null);
          }}
        />
      )}
    </section>
  );
}