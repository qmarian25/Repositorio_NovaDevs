'use client';

import React from 'react';

interface Props {
  urlPortada?: string;
  titulo: string;
  className?: string;
}

export default function PdfThumbnail({ urlPortada, titulo, className }: Props) {
  const baseClasses = `relative flex items-center justify-center overflow-hidden bg-gray-100 ${className || 'w-full h-full'}`;

  if (!urlPortada) {
    return (
      <div className={baseClasses}>
        <i className="fa-solid fa-file-pdf text-gray-400 text-2xl"></i>
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <img
        src={urlPortada}
        alt={titulo}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
}