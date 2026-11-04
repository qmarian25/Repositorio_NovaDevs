'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'documentos'>('usuarios');
  const [isModalUsuarioOpen, setIsModalUsuarioOpen] = useState(false);
  const [isModalDocumentoOpen, setIsModalDocumentoOpen] = useState(false);

  useEffect(() => {
    // Cargar FontAwesome dinámicamente si no está presente
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  const handleGuardarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Usuario actualizado con éxito');
    setIsModalUsuarioOpen(false);
  };

  const handleGuardarDocumento = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Documento guardado con éxito');
    setIsModalDocumentoOpen(false);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      {/* Navbar Admin */}
      <nav className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-lg flex items-center gap-2">
            <i className="fa-solid fa-shield-halved"></i> Panel Admin | IUJO
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition">Ver Repositorio</a>
            <a href="/login" className="text-sm text-red-300 hover:text-white transition"><i className="fa-solid fa-right-from-bracket"></i> Salir</a>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        
        {/* Pestañas de Navegación */}
        <div className="flex border-b border-gray-300 gap-4">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`pb-3 px-4 font-bold transition ${
              activeTab === 'usuarios'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600 font-semibold'
            }`}
          >
            <i className="fa-solid fa-users mr-2"></i> Gestionar Usuarios
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`pb-3 px-4 font-bold transition ${
              activeTab === 'documentos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600 font-semibold'
            }`}
          >
            <i className="fa-solid fa-book-open mr-2"></i> Gestionar Documentos
          </button>
        </div>

        {/* SECCIÓN 1: GESTIÓN DE USUARIOS */}
        {activeTab === 'usuarios' && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Listado de Usuarios Registrados</h2>
              <p className="text-xs text-gray-500">Los accesos son administrados directamente desde el sistema institucional.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                  <tr>
                    <th className="p-4">Cédula</th>
                    <th className="p-4">Contraseña</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">V-12345678</td>
                    <td className="p-4 text-gray-500">••••••</td>
                    <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">estudiante</span></td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => setIsModalUsuarioOpen(true)} className="text-blue-600 hover:text-blue-800" title="Editar Contraseña / Rol">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => confirm('¿Estás seguro de eliminar este usuario?')} className="text-red-600 hover:text-red-800" title="Eliminar Usuario">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECCIÓN 2: GESTIÓN DE DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Listado de Documentos (Tesis y Sistematizaciones)</h2>
              <button onClick={() => setIsModalDocumentoOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2">
                <i className="fa-solid fa-file-circle-plus"></i> Registrar Documento
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                  <tr>
                    <th className="p-4">Título</th>
                    <th className="p-4">Autor(es)</th>
                    <th className="p-4">Carrera</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Año</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Sistema de Gestión Integral...</td>
                    <td className="p-4">Alberth Rosario - Enmanuel Peña</td>
                    <td className="p-4">Informática</td>
                    <td className="p-4">Trabajo Especial de Grado</td>
                    <td className="p-4">2026</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => setIsModalDocumentoOpen(true)} className="text-blue-600 hover:text-blue-800" title="Editar Documento">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => confirm('¿Estás seguro de eliminar este documento?')} className="text-red-600 hover:text-red-800" title="Eliminar Documento">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {/* MODAL EDITAR USUARIO */}
      {isModalUsuarioOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800">Editar Datos de Usuario</h3>
            <form onSubmit={handleGuardarUsuario} className="space-y-4">
              <div className="flex gap-2">
                <select className="border p-2 rounded-lg bg-gray-50 text-sm" disabled defaultValue="V">
                  <option value="V">V-</option>
                  <option value="E">E-</option>
                  <option value="J">J-</option>
                </select>
                <input type="text" placeholder="Cédula" disabled defaultValue="12345678" className="w-full border p-2 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
                <input type="text" placeholder="Contraseña de acceso" required className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Rol</label>
                <select className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="estudiante">Estudiante</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalUsuarioOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DOCUMENTO (Registrar / Editar) */}
      {isModalDocumentoOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800">Registrar Documento</h3>
            <form onSubmit={handleGuardarDocumento} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Título del Documento</label>
                <input type="text" placeholder="Ej. Sistema de Gestión Integral..." required className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Autor(es)</label>
                <input type="text" placeholder="Ej. Alberth Rosario - Enmanuel Peña" required className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Carrera (Filtro)</label>
                  <select className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Informática">Informática</option>
                    <option value="Contaduría">Contaduría</option>
                    <option value="Administración de Empresas">Administración de Empresas</option>
                    <option value="Educación">Educación</option>
                    <option value="Electrónica">Electrónica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Documento (Filtro)</label>
                  <select className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Trabajo Especial de Grado">Trabajo Especial de Grado</option>
                    <option value="Sistematización">Sistematización</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Año de Publicación (Filtro)</label>
                <select className="w-full border p-2 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalDocumentoOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}