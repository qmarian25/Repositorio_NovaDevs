'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarUser from '@/components/NavbarUser';
import { DOCUMENTOS, getDocumentoById } from '@/lib/documents';

function VisorContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? Number(idParam) : null;
  const documento = id ? getDocumentoById(id) : undefined;

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(!!documento?.guardado);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest';
    script.async = true;
    script.onload = () => {
      if ((window as any).lucide) {
        (window as any).lucide.createIcons();
      }
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  if (!documento) {
    return (
      <main className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
          <i data-lucide="file-off" className="h-12 w-12 text-red-500 mx-auto mb-4"></i>
          <h2 className="text-lg font-bold text-gray-900">Documento no encontrado</h2>
          <p className="text-gray-500 mt-2">El documento solicitado no existe.</p>
          <a
            href="/"
            className="mt-4 inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Volver al repositorio
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 h-fit">
        <div>
          <span
            id="badgeTipoDoc"
            className={`bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full ${
              documento.categoria === 'Tesis' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}
          >
            {documento.categoria}
          </span>
          <span
            id="badgeCarrera"
            className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full ml-1"
          >
            {documento.carrera}
          </span>
        </div>

        <h1 id="tituloDocumento" className="text-xl font-bold text-gray-900 leading-snug">
          {documento.titulo}
        </h1>

        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
          <button
            onClick={() => setIsLiked((prev) => !prev)}
            className={`text-sm font-medium transition flex items-center gap-1.5 ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <i data-lucide="heart" className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}></i>
            <span id="contadorLikes">Me gusta</span>
          </button>
          <div className="h-5 w-px bg-gray-200"></div>
          <button
            onClick={() => setIsSaved((prev) => !prev)}
            className={`text-sm font-medium transition flex items-center gap-1.5 ${
              isSaved ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <i data-lucide="bookmark" className={`h-5 w-5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`}></i>
            <span>{isSaved ? 'Guardado' : 'Guardar documento'}</span>
          </button>
        </div>

        <div className="border-t border-b py-4 space-y-3 text-sm">
          <div>
            <span className="font-semibold text-gray-700 block">Autores participantes:</span>
            <span id="autoresDocumento" className="text-gray-600">
              {documento.autor}
            </span>
            
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-1">Resumen del Documento</h3>
          <p id="resumenDocumento" className="text-gray-600 text-sm leading-relaxed">
            {documento.resumen}
          </p>
        </div>

        {documento.pdfUrl ? (
          <a
            id="btnDescarga"
            href={documento.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
          >
            <i data-lucide="download" className="h-4 w-4"></i> Descargar Documento (PDF)
          </a>
        ) : (
          <button
            id="btnDescarga"
            disabled
            className="w-full bg-gray-300 text-gray-500 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm cursor-not-allowed"
          >
            <i data-lucide="download" className="h-4 w-4"></i> PDF no disponible
          </button>
        )}
      </section>

      <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Visor PDF:</span>
            <span className="text-xs font-medium text-gray-600">
              Página 1 de {documento.pdfUrl ? '--' : '--'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Alejar">
              <i data-lucide="zoom-out" className="h-5 w-5"></i>
            </button>
            <span className="text-xs font-medium text-gray-600">100%</span>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition" title="Acercar">
              <i data-lucide="zoom-in" className="h-5 w-5"></i>
            </button>
          </div>
        </div>

        <div id="visorContenedor" className="flex-1 bg-gray-600 flex items-center justify-center p-6 min-h-[600px] overflow-auto">
          {documento.pdfUrl ? (
            <embed
              src={documento.pdfUrl}
              type="application/pdf"
              className="w-full h-full max-w-full max-h-full object-contain"
              title="Visor de PDF"
            />
          ) : (
            <div className="text-gray-300 text-sm font-medium">
              No hay archivo PDF disponible para este documento.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function DetalleVisorPage() {
  return (
    <NavbarUser>
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-gray-500">Cargando visor...</div>}>
        <VisorContent />
      </Suspense>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function toggleMenuPerfil(event) {
                event.stopPropagation();
                const menu = document.getElementById('menuPerfil');
                if (menu) menu.classList.toggle('hidden');
            }

            window.addEventListener('click', function() {
                const menu = document.getElementById('menuPerfil');
                if (menu && !menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            });
          `,
        }}
      />
    </NavbarUser>
  );
}