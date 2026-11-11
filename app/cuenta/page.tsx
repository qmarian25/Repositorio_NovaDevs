'use client';

import React, { useState } from 'react';
import NavbarUser from '@/components/NavbarUser';
import { useAuth } from '@/lib/auth-context';
import type { AuthUser } from '@/lib/auth';
import { User, Bookmark, Heart } from 'lucide-react';
import Cuenta from './components/Cuenta';
import Guardados from './components/Guardados';
import Likes from './components/Likes';

type Tab = 'cuenta' | 'guardados' | 'likes';

export default function PerfilPage() {
  const { usuario } = useAuth();
  const user = (usuario as AuthUser | null);
  const [activeTab, setActiveTab] = useState<Tab>('cuenta');

  const tabs = [
    { id: 'cuenta', label: 'Datos de la Cuenta', icon: User },
    { id: 'guardados', label: 'Documentos Guardados', icon: Bookmark },
    { id: 'likes', label: 'Me Gusta', icon: Heart },
  ] as const;

  //Page
  return (
    <NavbarUser>
      <div className="w-full flex flex-col space-y-8 pb-16 overflow-x-hidden">
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-gray-200/90 shadow-xs py-7 px-6 sm:px-12 -mt-6 mb-8">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-blue-600/25 blur-md scale-110" aria-hidden="true" />
              <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-950 via-indigo-900 to-blue-600 text-white text-2xl font-black rounded-full flex items-center justify-center shadow-xl ring-4 ring-white tracking-wider overflow-hidden">
                <span className="relative">
                  {user?.nombre?.[0] || ''}{user?.apellido?.[0] || ''}
                </span>
              </div>
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Cuenta</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">Gestiona tu información personal y tus documentos de interés.</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-center border-b border-gray-200 gap-2 pb-4 sm:pb-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`py-3 px-4 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 w-full sm:w-auto ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'cuenta' && <Cuenta key={user?.id_usuario || 'no-user'} user={user} />}
          {activeTab === 'guardados' && <Guardados userId={user?.id_usuario} />}
          {activeTab === 'likes' && <Likes userId={user?.id_usuario} />}
        </div>
      </div>
    </NavbarUser>
  );
}