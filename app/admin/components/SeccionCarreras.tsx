'use client';

import React from 'react';

export default function SeccionCarreras() {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Carreras</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          <i className="fa-solid fa-plus"></i> Añadir Carrera
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500 text-sm">
        Próximamente: CRUD de carreras.
      </div>
    </section>
  );
}