'use client';

import React, { useState, useEffect } from 'react';
import { actualizarPerfil } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function MiCuenta({ user }: { user: AuthUser | null }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
      }));
    }
  }, [user]);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
    setMessage(null);
  };

  const validar = (): boolean => {
    if (!form.nombre.trim()) { setMessage({ text: 'El nombre es obligatorio', type: 'error' }); return false; }
    if (!form.apellido.trim()) { setMessage({ text: 'El apellido es obligatorio', type: 'error' }); return false; }
    if (!form.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) { setMessage({ text: 'Correo inválido', type: 'error' }); return false; }
    if (form.contrasena && form.contrasena.length < 8) { setMessage({ text: 'La contraseña debe tener al menos 8 caracteres', type: 'error' }); return false; }
    if (form.contrasena && form.contrasena !== form.confirmarContrasena) { setMessage({ text: 'Las contraseñas no coinciden', type: 'error' }); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id_usuario || !validar()) return;
    setLoading(true);
    setMessage(null);

    try {
      await actualizarPerfil({
        id_usuario: user.id_usuario,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        contrasena: form.contrasena || undefined,
      });
      window.dispatchEvent(new CustomEvent('session-changed'));
      setMessage({ text: 'Perfil actualizado correctamente', type: 'success' });
      
      // Limpiar las contraseñas después de guardar
      setForm(prev => ({ ...prev, contrasena: '', confirmarContrasena: '' }));
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'No se pudo actualizar el perfil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6 w-full">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold text-gray-900">Información Personal</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Nombre</label>
            <input 
              type="text" 
              value={form.nombre} 
              onChange={handleChange('nombre')} 
              placeholder="Ingresa tu nombre"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" 
              disabled={loading} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Apellido</label>
            <input 
              type="text" 
              value={form.apellido} 
              onChange={handleChange('apellido')} 
              placeholder="Ingresa tu apellido"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" 
              disabled={loading} 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Correo Electrónico</label>
          <input 
            type="email" 
            value={form.correo} 
            onChange={handleChange('correo')} 
            placeholder="Ingresa tu correo electrónico"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" 
            disabled={loading} 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Contraseña Nueva</label>
            <input 
              type="password" 
              value={form.contrasena} 
              onChange={handleChange('contrasena')} 
              placeholder="Dejar en blanco..." 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" 
              disabled={loading} 
            />
            <p className="text-[10px] text-gray-400 mt-1">Mínimo 8 caracteres</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Confirmar Contraseña</label>
            <input 
              type="password" 
              value={form.confirmarContrasena} 
              onChange={handleChange('confirmarContrasena')} 
              placeholder="Repita la contraseña nueva"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" 
              disabled={loading} 
            />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-7 py-3 rounded-xl transition shadow-sm disabled:opacity-60">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}