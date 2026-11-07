'use client';

import React from 'react';

interface Props {
  url: string;
  titulo: string;
}

export default function PdfThumbnail({ url, titulo }: Props) {
  return (
    <div className="relative w-full sm:w-28 h-36 bg-gray-100 border border-gray-300 rounded shadow-sm flex-shrink-0 overflow-hidden flex items-center justify-center">
      <span className="absolute top-1.5 left-1.5 z-10 bg-black text-white px-1 py-0.5 rounded font-bold text-[9px]">
        PDF
      </span>
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
        className="w-full h-full pointer-events-none border-0 scale-50 origin-top-left"
        style={{ width: '200%', height: '200%' }}
        title={titulo}
      />
    </div>
  );
}