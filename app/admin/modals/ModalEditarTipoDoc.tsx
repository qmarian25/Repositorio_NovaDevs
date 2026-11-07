'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import type { TipoDocumento } from '../_types';

interface Props {
  tipo: TipoDocumento;
  onClose: () => void;
  onGuardado: () => void;
}

export default function ModalEditarTipoDoc({ tipo, onClose, onGuardado }: Props) {
  const [montado, setMontado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nombre, setNombre] = useState(tipo.nombre_tipo_documento);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'exito' | 'error'; titulo: string; mensaje: string } | null>(null);

  useEffect(() => { setMontado(true); }, []);

  // ✅ Validación: Solo letras y espacios
  const soloLetras = (valor: string) => valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

  const handleActualizar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    const nombreLimpio = nombre.trim();

    // Validaciones
    if (!nombreLimpio) {
      setError('El nombre del tipo es obligatorio.');
      return;
    }
    if (nombreLimpio.length < 5) {
      setError('El nombre debe tener al menos 5 caracteres.');
      return;
    }
    
    // Validar que no exista otro con el mismo nombre
    const { data: existe } = await supabase
      .from('tipo_documento')
      .select('id_tipo_documento')
      .ilike('nombre_tipo_documento', nombreLimpio)
      .eq('activo', true)
      .neq('id_tipo_documento', tipo.id_tipo_documento)
      .maybeSingle();
      
    if (existe) {
      setError('Este tipo de documento ya existe.');
      return;
    }

    setGuardando(true);
    try {
      const { error: err } = await supabase
        .from('tipo_documento')
        .update({ nombre_tipo_documento: nombreLimpio })
        .eq('id_tipo_documento', tipo.id_tipo_documento);
        
      if (err) throw err;

      setAviso({ tipo: 'exito', titulo: 'Cambios guardados', mensaje: 'El tipo de documento se ha actualizado correctamente.' });
      onGuardado();
      setTimeout(onClose, 800);
    } catch (err: any) {
      setAviso({ tipo: 'error', titulo: 'Error', mensaje: err.message || 'Error inesperado.' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-pen-to-square text-blue-600"></i> Editar Tipo de Documento
          </h3>
          <form onSubmit={handleActualizar} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre del Tipo *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => { 
                  setNombre(soloLetras(e.target.value)); 
                  setError(null); 
                }}
                className={`w-full border p-2 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} disabled={guardando} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={guardando} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60">{guardando ? 'Actualizando...' : 'Actualizar'}</button>
            </div>
          </form>
        </div>
      </div>

      {montado && aviso && createPortal(
        <div className="fixed inset-0 z-[10000] flex min-h-screen items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${aviso.tipo === 'exito' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              <i className={`text-2xl ${aviso.tipo === 'exito' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}`}></i>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{aviso.titulo}</h3>
            <p className="mb-6 break-words text-sm leading-6 text-gray-600">{aviso.mensaje}</p>
            <button type="button" onClick={() => setAviso(null)} className={`w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${aviso.tipo === 'exito' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>Entendido</button>
          </div>
        </div>, document.body
      )}
    </>
  );
}