'use server';

import { cookies } from 'next/headers';
import argon2 from 'argon2';
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

  let passwordValida = false;

  if (typeof user.contrasena === 'string' && user.contrasena.startsWith('$argon2')) {
    passwordValida = await argon2.verify(user.contrasena, password);
  } else {
    passwordValida = user.contrasena === password;
  }

  if (!passwordValida) {
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

export async function actualizarPerfil(data: {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
}) {
  const updateData: Record<string, string | undefined> = {
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    correo: data.correo.trim(),
  };

  if (data.contrasena && data.contrasena.trim() !== '') {
    updateData.contrasena = await argon2.hash(data.contrasena);
  }

  const { error } = await supabase
    .from('usuario')
    .update(updateData)
    .eq('id_usuario', data.id_usuario);

  if (error) throw new Error(error.message || 'No se pudo actualizar el perfil');

  // Leer el usuario actualizado y refrescar la cookie de sesión
  const { data: updatedUser, error: fetchError } = await supabase
    .from('usuario')
    .select('*')
    .eq('id_usuario', data.id_usuario)
    .single();

  if (fetchError || !updatedUser) throw new Error('No se pudo refrescar la sesión');

  const authUser: AuthUser = {
    id_usuario: updatedUser.id_usuario,
    nombre_usuario: updatedUser.nombre_usuario,
    nombre: updatedUser.nombre,
    apellido: updatedUser.apellido,
    correo: updatedUser.correo,
    id_tipo_usuario: updatedUser.id_tipo_usuario,
  };

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(authUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { success: true, user: authUser };
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
