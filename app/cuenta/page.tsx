'use client';

import React, { useState } from 'react';
import NavbarUser from '@/components/NavbarUser';
import { User, Bookmark, Heart, FileText } from 'lucide-react';

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<'cuenta' | 'guardados' | 'likes'>('cuenta');
  
  // Estados para los botones interactivos de las tarjetas
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <NavbarUser mostrarTarjetas>
      <div className="w-full flex flex-col space-y-8 pb-16 overflow-x-hidden">
        
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-gray-200/90 shadow-xs py-7 px-6 sm:px-12 -mt-6 mb-8">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            
            {/* Avatar circular con degradado azul-indigo premium y halo */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-blue-600/25 blur-md scale-110" aria-hidden="true" />
              <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-950 via-indigo-900 to-blue-600 text-white text-2xl font-black rounded-full flex items-center justify-center shadow-xl ring-4 ring-white tracking-wider overflow-hidden">
                <span className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-white/20 blur-sm" aria-hidden="true" />
                <span className="relative">MA</span>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Cuenta
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Gestiona tu información personal y tus documentos de interés.
              </p>
            </div>

          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-8">
          
          {/* Sistema de Pestañas Centrado */}
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

          {/* CONTENIDO DE LA PESTAÑA: DATOS DE LA CUENTA */}
          {activeTab === 'cuenta' && (
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6 w-full">
              <div className="border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">Información Personal</h2>
                <p className="text-xs text-gray-500">Actualiza los datos básicos de tu perfil de usuario.</p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Nombre</label>
                    <input 
                      type="text" 
                      placeholder="Ingrese su nombre" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Apellido</label>
                    <input 
                      type="text"
                      placeholder="Ingrese su apellido" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Correo Electrónico</label>
                  <input 
                    type="email"  
                    placeholder="Ingrese su correo electrónico" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="border-t pt-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Contraseña Nueva</label>
                    <input 
                      type="password" 
                      placeholder="Dejar en blanco para mantener la actual" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-7 py-3 rounded-xl transition shadow-sm"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CONTENIDO DE LA PESTAÑA: DOCUMENTOS GUARDADOS */}
          {activeTab === 'guardados' && (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Títulos Guardados</h2>
                <span className="text-xs text-gray-500 font-medium">0 documentos guardados</span>
              </div>

              <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No tienes documentos guardados aún.</p>
                <p className="text-gray-400 text-xs mt-1">Guarda un documento desde el repositorio para que aparezca aquí.</p>
              </div>
            </div>
          )}

          {/* CONTENIDO DE LA PESTAÑA: ME GUSTA */}
          {activeTab === 'likes' && (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Documentos que te gustan</h2>
                <span className="text-xs text-gray-500 font-medium">0 documentos con 'Me gusta'</span>
              </div>

              <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No tienes documentos con 'Me gusta' aún.</p>
                <p className="text-gray-400 text-xs mt-1">Dale 'Me gusta' a un documento desde el visor para que aparezca aquí.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </NavbarUser>
  );
}
