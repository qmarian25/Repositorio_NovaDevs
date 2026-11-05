'use client';

import React, { useState, useEffect } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo(null);

    // Simulación local de login (sin Supabase)
    setTimeout(() => {
      if (cedula.length < 6) {
        setAlertInfo({
          message: 'Por favor, ingresa una cédula válida.',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      setAlertInfo({
        message: '¡Acceso concedido! Redirigiendo...',
        type: 'success',
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    }, 600);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-200">
        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Iniciar Sesión</h2>
          <p className="text-slate-500 text-sm mt-1">Accede con tu Cédula y Contraseña</p>
        </div>

        {/* Alerta de Respuesta */}
        {alertInfo && (
          <div
            className={`mb-5 p-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              alertInfo.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            <i
              className={`fa-solid ${
                alertInfo.type === 'success' ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-rose-600'
              } text-lg`}
            ></i>
            <span>{alertInfo.message}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo Cédula */}
          <div>
            <label htmlFor="cedula" className="block text-sm font-semibold text-slate-700 mb-1">
              Cédula de Identidad
            </label>
            <input
              type="text"
              id="cedula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="12345678"
              maxLength={10}
              required
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 p-3 outline-none"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 p-3 pr-10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <div className="text-right mt-2">
            <button
              type="button"
              onClick={() => {
                setAlertInfo({
                  message: 'Se enviará un enlace de recuperación a tu correo registrado.',
                  type: 'success',
                });
              }}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}