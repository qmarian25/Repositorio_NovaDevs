'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import type { TipoDocumento } from '../_types';

interface Props {
  tipo: TipoDocumento;
  onClose: () => void;
  onEliminado: () => void;
}

export default function ModalEliminarTipoDoc({ tipo, onClose, onEliminado }: Props) {
  const [montado, setMontado] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setMontado(true); }, []);

  const confirmar = async () => {
    if (eliminando) return;
    setEliminando(true);
    setError(null);

    try {
      // SOFT DELETE: Solo lo marcamos como inactivo
      const { error: err } = await supabase
        .from('tipo_documento')
        .update({ activo: false })
        .eq('id_tipo_documento', tipo.id_tipo_documento);
      
      if (err) throw err;
      onEliminado();
    } catch (err: any) {
      setError(err.message || 'No se pudo deshabilitar el tipo de documento.');
    } finally {
      setEliminando(false);
    }
  };

  if (!montado) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-black/60 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget && !eliminando) onClose(); }}>
      <div className="relative mx-auto w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900">¿Eliminar tipo de documento?</h3>
        <p className="mb-6 break-words text-sm leading-6 text-gray-600">
          Estás a punto de eliminar el tipo <span className="font-semibold text-gray-900">“{tipo.nombre_tipo_documento}”</span>. Esta acción no se puede deshacer.
        </p>
        
        {error && <p className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</p>}

        <div className="flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button type="button" disabled={eliminando} onClick={onClose} className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50">Cancelar</button>
          <button type="button" disabled={eliminando} onClick={confirmar} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">{eliminando ? 'Eliminando...' : 'Sí, eliminar'}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}