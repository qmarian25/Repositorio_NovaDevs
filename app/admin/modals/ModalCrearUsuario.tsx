'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import type { ErroresUsuario, Usuario } from '../_types';
import { hashearPassword } from '../actions/usuarios';

interface Props {
  onClose: () => void;
  onGuardado: () => void;
}

export default function ModalCrearUsuario({ onClose, onGuardado }: Props) {
  const [montado, setMontado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<ErroresUsuario>({});
  const [aviso, setAviso] = useState<{
    tipo: 'exito' | 'error' | 'advertencia';
    titulo: string;
    mensaje: string;
  } | null>(null);

  const [form, setForm] = useState<Usuario>({
    nombre_usuario: 0,
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    id_tipo_usuario: 1, // Por defecto Estudiante
  });

  useEffect(() => { setMontado(true); }, []);

  // Solo permite letras y espacios
  const soloLetras = (valor: string) => valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

  const validar = async (): Promise<boolean> => {
    const e: ErroresUsuario = {};

    // Cédula: 7 u 8 dígitos exactos
    const cedula = String(form.nombre_usuario).trim();
    if (!cedula || cedula === '0') {
      e.nombre_usuario = 'La cédula es obligatoria.';
    } else if (cedula.length < 7) {
      e.nombre_usuario = 'Debe tener mínimo 7 dígitos.';
    } else {
      const { data: existeCedula } = await supabase
        .from('usuario')
        .select('id_usuario')
        .eq('nombre_usuario', parseInt(cedula))
        .maybeSingle();
      if (existeCedula) e.nombre_usuario = 'Esta cédula ya está registrada.';
    }

    // Nombre
    const nombre = form.nombre.trim();
    if (!nombre) e.nombre = 'El nombre es obligatorio.';
    else if (nombre.length < 2) e.nombre = 'Mínimo 2 caracteres.';

    // Apellido
    const apellido = form.apellido.trim();
    if (!apellido) e.apellido = 'El apellido es obligatorio.';
    else if (apellido.length < 2) e.apellido = 'Mínimo 2 caracteres.';

    // Correo
    const correo = form.correo.trim();
    if (!correo) e.correo = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) e.correo = 'Correo inválido.';
    else {
      const { data: existeCorreo } = await supabase
        .from('usuario')
        .select('id_usuario')
        .eq('correo', correo)
        .maybeSingle();
      if (existeCorreo) e.correo = 'Este correo ya está registrado.';
    }

    // Contraseña
    const pass = form.contrasena || '';
    if (!pass) e.contrasena = 'La contraseña es obligatoria.';
    else if (pass.length < 8) e.contrasena = 'Mínimo 8 caracteres.';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!(await validar())) return;

    setGuardando(true);
    try {
      const hash = await hashearPassword(form.contrasena!);

      const { error } = await supabase.from('usuario').insert([{
        nombre_usuario: parseInt(String(form.nombre_usuario)),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        contrasena: hash,
        id_tipo_usuario: form.id_tipo_usuario,
      }]);

      if (error) throw error;

      setAviso({ tipo: 'exito', titulo: 'Usuario creado', mensaje: 'El usuario se ha registrado correctamente.' });
      onGuardado();
      setTimeout(onClose, 800);
    } catch (err: any) {
      setAviso({ tipo: 'error', titulo: 'No se pudo crear', mensaje: err.message || 'Error inesperado.' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-user-plus text-blue-600"></i> Añadir Usuario
          </h3>
          <form onSubmit={handleGuardar} noValidate className="space-y-4">
            
            {/* Cédula */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Cédula *</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="Ej. 30123456"
                value={form.nombre_usuario || ''}
                onChange={(e) => {
                  // Bloquea letras y limita a 8 caracteres
                  const soloNum = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setForm({ ...form, nombre_usuario: parseInt(soloNum) || 0 });
                  if (errores.nombre_usuario) setErrores({ ...errores, nombre_usuario: undefined });
                }}
                className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${errores.nombre_usuario ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errores.nombre_usuario && <p className="text-[11px] text-red-600 mt-1">{errores.nombre_usuario}</p>}
            </div>

            {/* Nombre y Apellido en Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre *</label>
                <input
                  type="text"
                  placeholder="Ej. Juan"
                  value={form.nombre}
                  onChange={(e) => {
                    setForm({ ...form, nombre: soloLetras(e.target.value) });
                    if (errores.nombre) setErrores({ ...errores, nombre: undefined });
                  }}
                  className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${errores.nombre ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errores.nombre && <p className="text-[11px] text-red-600 mt-1">{errores.nombre}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Apellido *</label>
                <input
                  type="text"
                  placeholder="Ej. Pérez"
                  value={form.apellido}
                  onChange={(e) => {
                    setForm({ ...form, apellido: soloLetras(e.target.value) });
                    if (errores.apellido) setErrores({ ...errores, apellido: undefined });
                  }}
                  className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${errores.apellido ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errores.apellido && <p className="text-[11px] text-red-600 mt-1">{errores.apellido}</p>}
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Correo *</label>
              <input
                type="email"
                placeholder="Ej. juan@iujo.edu.ve"
                value={form.correo}
                onChange={(e) => {
                  setForm({ ...form, correo: e.target.value });
                  if (errores.correo) setErrores({ ...errores, correo: undefined });
                }}
                className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${errores.correo ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errores.correo && <p className="text-[11px] text-red-600 mt-1">{errores.correo}</p>}
            </div>

            {/* Tipo de Usuario */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Usuario *</label>
              <select
                value={form.id_tipo_usuario}
                onChange={(e) => setForm({ ...form, id_tipo_usuario: parseInt(e.target.value) })}
                className="w-full border p-2 rounded-lg text-sm bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              >
                <option value={1}>Estudiante</option>
                <option value={2}>Administrador</option>
              </select>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña *</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.contrasena}
                onChange={(e) => {
                  setForm({ ...form, contrasena: e.target.value });
                  if (errores.contrasena) setErrores({ ...errores, contrasena: undefined });
                }}
                className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${errores.contrasena ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errores.contrasena && <p className="text-[11px] text-red-600 mt-1">{errores.contrasena}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} disabled={guardando} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={guardando} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60">{guardando ? 'Guardando...' : 'Guardar Usuario'}</button>
            </div>
          </form>
        </div>
      </div>

      {montado && aviso && createPortal(
        <div className="fixed inset-0 z-[10000] flex min-h-screen items-center justify-center bg-black/60 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setAviso(null); }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${aviso.tipo === 'exito' ? 'bg-emerald-100 text-emerald-600' : aviso.tipo === 'error' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              <i className={`text-2xl ${aviso.tipo === 'exito' ? 'fa-solid fa-circle-check' : aviso.tipo === 'error' ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-exclamation'}`}></i>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{aviso.titulo}</h3>
            <p className="mb-6 break-words text-sm leading-6 text-gray-600">{aviso.mensaje}</p>
            <button type="button" onClick={() => setAviso(null)} className={`w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${aviso.tipo === 'exito' ? 'bg-emerald-600 hover:bg-emerald-700' : aviso.tipo === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}`}>Entendido</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}