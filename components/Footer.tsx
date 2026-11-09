'use client';

import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-blue-900 text-white mt-auto border-t border-blue-800/80 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-8 pb-10 border-b border-blue-800/60">
  
          <div className="md:col-span-5 space-y-4 sm:space-y-6 pr-0 md:pr-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <h3 className="text-sm font-black tracking-wider uppercase text-blue-100">
                Repositorio IUJO <span className="text-white/80 font-normal">| NovaDevs</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed font-normal max-w-none sm:max-w-md">
              Plataforma digital institucional para la gestión, consulta y preservación de Trabajos Especiales de Grado del Instituto Universitario "Jesús Obrero".
            </p>
          </div>

          {/* Plataformas Institucionales*/}
          <div className="md:col-span-4 space-y-3 sm:space-y-3.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-blue-300">
              Plataformas Institucionales
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm font-medium text-blue-100">
              <li>
                <a 
                  href="https://aulaccs.iujoac.org.ve/login/index.php?loginredirect=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200"
                >
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">›</span>
                  <span className="group-hover:underline underline-offset-4">Aula Virtual IUJO</span>
                </a>
              </li>
              <li>
                <a 
                  href="http://sigea.ccs.iujo.edu.ve/sigea/index.php#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200"
                >
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">›</span>
                  <span className="group-hover:underline underline-offset-4">SIGEA</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://webiujocatia.wordpress.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200"
                >
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">›</span>
                  <span className="group-hover:underline underline-offset-4">Página Oficial (WordPress)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="md:col-span-3 space-y-3 sm:space-y-3.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-blue-300">
              Redes Sociales
            </h4>
            <p className="text-xs sm:text-sm text-blue-200/90 font-normal">
              Síguenos en nuestros canales oficiales institucionales.
            </p>
      
            <div className="flex items-center gap-2 pt-1">
              <a 
                href="https://www.instagram.com/iujocatia/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/40 hover:bg-blue-800 border border-blue-700/50 rounded-lg text-xs font-medium text-blue-100 hover:text-white transition-all duration-200 shadow-xs"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="hidden sm:inline">Instagram</span>
              </a>

              <a 
                href="https://www.facebook.com/iujocatia" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/40 hover:bg-blue-800 border border-blue-700/50 rounded-lg text-xs font-medium text-blue-100 hover:text-white transition-all duration-200 shadow-xs"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.714 5H18V0h-3.808C10.592 0 9 1.849 9 4.897V8z"/>
                </svg>
                <span className="hidden sm:inline">Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Derechos y créditos de NovaDevs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300/80 pt-6">
          <p className="text-center sm:text-left font-normal">
            © {currentYear} Instituto Universitario Jesús Obrero. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1.5 font-medium text-blue-200">
            <span>Desarrollado por</span>
            <span className="bg-blue-800/80 text-white font-bold px-2 py-0.5 rounded text-[11px] border border-blue-700/60 shadow-2xs">
              NovaDevs
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}