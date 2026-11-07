'use server';

import { supabase } from '@/lib/supabase';
import argon2 from 'argon2';

export async function hashearPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}