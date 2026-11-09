'use client';

import React, { useState } from 'react';
import NavbarUser from '@/components/NavbarUser';
import { useAuth } from '@/lib/auth-context';
import { actualizarPerfil } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';
import { User, Bookmark, Heart, CheckCircle, AlertCircle } from 'lucide-react';

type Tab = 'cuenta' | 'guardados' | 'likes';

interface PerfilForm {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

function PerfilFormContent({ user }: { user: AuthUser | null }) {
  const [form, setForm] = useState<PerfilForm>({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    correo: user?.correo || '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (key: keyof PerfilForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
    setMessage(null);
  };

  const validar = (): boolean => {
    if (!form.nombre.trim()) {
      setMessage({ text: 'El nombre es obligatorio', type: 'error' });
      return false;
    }
    if (form.nombre.trim().length < 2) {
      setMessage({ text: 'El nombre debe tener al menos 2 caracteres', type: 'error' });
      return false;
    }
    if (!form.apellido.trim()) {
      setMessage({ text: 'El apellido es obligatorio', type: 'error' });
      return false;
    }
    if (form.apellido.trim().length < 2) {
      setMessage({ text: 'El apellido debe tener al menos 2 caracteres', type: 'error' });
      return false;
    }
    if (!form.correo.trim()) {
      setMessage({ text: 'El correo es obligatorio', type: 'error' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      setMessage({ text: 'Correo inválido', type: 'error' });
      return false;
    }
    if (form.contrasena && form.contrasena.length < 8) {
      setMessage({ text: 'La contraseña debe tener al menos 8 caracteres', type: 'error' });
      return false;
    }
    if (form.contrasena && form.contrasena !== form.confirmarContrasena) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id_usuario) return;
    if (!validar()) return;

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
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'No se pudo actualizar el perfil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6 w-full">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold text-gray-900">Informaci&oacute;n Personal</h2>
        <p className="text-xs text-gray-500">Actualiza los datos b&aacute;sicos de tu perfil de usuario.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
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
              placeholder="Ingrese su nombre"
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Apellido</label>
            <input
              type="text"
              value={form.apellido}
              onChange={handleChange('apellido')}
              placeholder="Ingrese su apellido"
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Correo Electr&oacute;nico</label>
          <input
            type="email"
            value={form.correo}
            onChange={handleChange('correo')}
            placeholder="Ingrese su correo electr&oacute;nico"
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Contrase&ntilde;a Nueva</label>
            <input
              type="password"
              value={form.contrasena}
              onChange={handleChange('contrasena')}
              placeholder="Dejar en blanco para mantener la actual"
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            />
            <p className="text-[10px] text-gray-400 mt-1">M&iacute;nimo 8 caracteres</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Confirmar Contrase&ntilde;a</label>
            <input
              type="password"
              value={form.confirmarContrasena}
              onChange={handleChange('confirmarContrasena')}
              placeholder="Repita la contrase&ntilde;a nueva"
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-7 py-3 rounded-xl transition shadow-sm disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PerfilPage() {
  const { usuario } = useAuth();
  const user = (usuario as AuthUser | null);
  const [activeTab, setActiveTab] = useState<Tab>('cuenta');

  return (
    <NavbarUser mostrarTarjetas>
      <div className="w-full flex flex-col space-y-8 pb-16 overflow-x-hidden">
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-gray-200/90 shadow-xs py-7 px-6 sm:px-12 -mt-6 mb-8">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-blue-600/25 blur-md scale-110" aria-hidden="true" />
              <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-950 via-indigo-900 to-blue-600 text-white text-2xl font-black rounded-full flex items-center justify-center shadow-xl ring-4 ring-white tracking-wider overflow-hidden">
                <span className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-white/20 blur-sm" aria-hidden="true" />
                <span className="relative">
                  {user?.nombre?.[0] || ''}{user?.apellido?.[0] || ''}
                </span>
              </div>
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Cuenta</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Gestiona tu información personal y tus documentos de inter&eacute;s.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-8">
          <div className="flex justify-center border-b border-gray-200 gap-6 sm:gap-8">
            <button
              onClick={() => setActiveTab('cuenta')}
              className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'cuenta'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <User className="h-4 w-4" /> Datos de la Cuenta
            </button>
            <button
              onClick={() => setActiveTab('guardados')}
              className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'guardados'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Bookmark className="h-4 w-4" /> Documentos Guardados
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'likes'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Heart className="h-4 w-4" /> Me Gusta
            </button>
          </div>

          {activeTab === 'cuenta' && (
            <PerfilFormContent key={user?.id_usuario || 'no-user'} user={user} />
          )}

          {activeTab === 'guardados' && (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">T&iacute;tulos Guardados</h2>
                <span className="text-xs text-gray-500 font-medium">0 documentos guardados</span>
              </div>
              <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No tienes documentos guardados a&uacute;n.</p>
                <p className="text-gray-400 text-xs mt-1">Guarda un documento desde el repositorio para que aparezca aqu&iacute;.</p>
              </div>
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Documentos que te gustan</h2>
                <span className="text-xs text-gray-500 font-medium">0 documentos con &lsquo;Me gusta&rsquo;</span>
              </div>
              <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No tienes documentos con &lsquo;Me gusta&rsquo; a&uacute;n.</p>
                <p className="text-gray-400 text-xs mt-1">Dale &lsquo;Me gusta&rsquo; a un documento desde el visor para que aparezca aqu&iacute;.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </NavbarUser>
  );
}
