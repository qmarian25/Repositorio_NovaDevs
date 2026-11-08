'use client';

import React, { useState } from 'react';
import NavbarUser from '@/components/NavbarUser';
import { User, Bookmark, Heart, FileText } from 'lucide-react';

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<'cuenta' | 'guardados' | 'likes'>('cuenta');
  
  // Estados para los botones interactivos de las tarjetas
  const [isSaved, setIsSaved] = useState(true);
  const [isLiked, setIsLiked] = useState(true);

  return (
    <NavbarUser>
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
                <span className="text-xs text-gray-500 font-medium">1 documento guardado</span>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition">
                <div className="flex items-center gap-6 w-full">
                  <div className="w-28 h-36 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-inner flex-shrink-0">
                    <FileText className="h-10 w-10 mb-2 text-blue-600" />
                    <span>PDF</span>
                  </div>
                  <div className="space-y-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Tesis
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">
                      Repositorio Web Institucional de Tesis y Sistematizaciones
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
                  <a href="/visor" className="flex-1 sm:flex-initial text-center text-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-xl transition shadow-sm">
                    Ver en Visor
                  </a>
                  <button 
                    onClick={() => setIsSaved(!isSaved)}
                    title={isSaved ? "Quitar de guardados" : "Guardar documento"}
                    className="p-3 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition"
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-blue-600" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO DE LA PESTAÑA: ME GUSTA */}
          {activeTab === 'likes' && (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Documentos que te gustan</h2>
                <span className="text-xs text-gray-500 font-medium">1 documento con "Me gusta"</span>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition">
                <div className="flex items-center gap-6 w-full">
                  <div className="w-28 h-36 bg-red-50 border border-red-200 text-red-700 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-inner flex-shrink-0">
                    <FileText className="h-10 w-10 mb-2 text-red-600" />
                    <span>PDF</span>
                  </div>
                  <div className="space-y-3">
                    <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Sistematización
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">
                      Cisco CCNA 2 Module 6: EtherChannel y Redes
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
                  <a href="/visor" className="flex-1 sm:flex-initial text-center text-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-xl transition shadow-sm">
                    Ver en Visor
                  </a>
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    title={isLiked ? "Quitar Me gusta" : "Dar Me gusta"}
                    className="p-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </NavbarUser>
  );
}
