// lib/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  usuario: any | null;
  isAuthenticated: boolean;
  refrescarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<any | null>(null);

  const cargarSesion = async () => {
    try {
      // ✅ Consultamos a la API en lugar de usar getSession() directamente en el cliente
      const res = await fetch('/api/auth');
      const data = await res.json();
      setUsuario(data.user);
    } catch {
      setUsuario(null);
    }
  };

  useEffect(() => {
    cargarSesion();
    const handleSesionCambiada = () => cargarSesion();
    window.addEventListener('session-changed', handleSesionCambiada);
    return () => window.removeEventListener('session-changed', handleSesionCambiada);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, refrescarSesion: cargarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};