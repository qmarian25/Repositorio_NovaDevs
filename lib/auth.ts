'use server';

import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id_usuario: number;
  nombre_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  id_tipo_usuario: number;
}

export async function login(cedula: string, password: string) {
  const { data: user, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('nombre_usuario', cedula)
    .eq('activo', true)
    .single();

  if (error || !user) {
    return { error: 'Credenciales inválidas', user: null };
  }

  if (!user.contrasena) {
    return { error: 'Cuenta no configurada', user: null };
  }

  if (user.contrasena !== password) {
    return { error: 'Credenciales inválidas', user: null };
  }

  const authUser: AuthUser = {
    id_usuario: user.id_usuario,
    nombre_usuario: user.nombre_usuario,
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.correo,
    id_tipo_usuario: user.id_tipo_usuario,
  };

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(authUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { error: null, user: authUser };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    return JSON.parse(session) as AuthUser;
  } catch {
    return null;
  }
}
