'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SeccionUsuarios from './components/SeccionUsuarios';
import SeccionDocumentos from './components/SeccionDocumentos';
import SeccionTiposDoc from './components/SeccionTiposDoc';
import Footer from '@/components/Footer';
import { logout } from '@/lib/auth';

type Tab = 'usuarios' | 'documentos' | 'tipos';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('usuarios');
  const router = useRouter();

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'usuarios', label: 'Gestionar Usuarios', icon: 'fa-users' },
    { id: 'documentos', label: 'Gestionar Documentos', icon: 'fa-book-open' },
    { id: 'tipos', label: 'Tipos de Documento', icon: 'fa-tags' },
  ];

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col justify-between">
      <div>
        <nav className="bg-blue-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-lg flex items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i> Panel Admin | IUJO
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin/repositorio" className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition">
                Ver Repositorio
              </a>
              <a href="#" onClick={async (e) => { e.preventDefault(); await logout(); router.push('/login'); }} className="text-sm text-red-300 hover:text-white transition">
                <i className="fa-solid fa-right-from-bracket"></i> Salir
              </a>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
          {/* Pestañas mejoradas: Centradas, adaptativas y con una barra de desplazamiento estética y sutil si el espacio es muy reducido */}
          <div className="flex justify-center border-b border-gray-300 pb-1">
            <div className="flex gap-2 overflow-x-auto max-w-full px-2 py-1 scrollbar-thin scrollbar-thumb-gray-300">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`py-2 px-4 font-semibold text-sm rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === t.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <i className={`fa-solid ${t.icon}`}></i> {t.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'usuarios' && <SeccionUsuarios />}
          {activeTab === 'documentos' && <SeccionDocumentos />}
          {activeTab === 'tipos' && <SeccionTiposDoc />}
        </main>
      </div>

      <Footer />
    </div>
  );
}