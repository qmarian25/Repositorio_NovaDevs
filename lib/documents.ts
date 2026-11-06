export interface Documento {
  id: number;
  titulo: string;
  categoria: 'Tesis' | 'Sistematización';
  portada: string;
  guardado: boolean;
  autor: string;
  anio: number;
  carrera: string;
  resumen: string;
  pdfUrl: string | null;
}

export const DOCUMENTOS: Documento[] = [
  {
    id: 1,
    titulo: 'Repositorio Web Institucional de Tesis y Sistematizaciones',
    categoria: 'Tesis',
    portada: 'https://imgv2-2-f.scribdassets.com/img/document/784044070/original/e9a4f964af/1?v=1',
    guardado: true,
    autor: 'Alberth Rosario - Enmanuel Peña',
    anio: 2026,
    carrera: 'Informática',
    resumen: 'Sistema web para la gestión, consulta y preservación de Trabajos Especiales de Grado del Instituto Universitario "Jesús Obrero", permitiendo la búsqueda por facetas, descarga de PDF y panel administrativo.',
    pdfUrl: '/documentos/Tesis de informatica 1.pdf',
  },
  {
    id: 2,
    titulo: 'Cisco CCNA 2 Module 6: EtherChannel y Redes',
    categoria: 'Sistematización',
    portada: 'https://website-assets.studocu.com/img/document_thumbnails/48b0618d11356cd674ea7ebfb902d872/thumb_300_388.png',
    guardado: false,
    autor: 'Estudiante IUJO',
    anio: 2025,
    carrera: 'Informática',
    resumen: 'Sistematización sobre configuración de EtherChannel, protocolos de redundancia y topologías de red en entornos Cisco.',
    pdfUrl: null,
  },
  {
    id: 3,
    titulo: 'Arquitectura de Redes y Seguridad Informática Avanzada',
    categoria: 'Tesis',
    portada: 'https://imgv2-2-f.scribdassets.com/img/document/200506656/original/ef88cf9f1e/1?v=1',
    guardado: false,
    autor: 'J. Pérez - M. Gómez',
    anio: 2025,
    carrera: 'Informática',
    resumen: 'Análisis de arquitecturas de red seguras, firewalls, VPN y estrategias de mitigación de amenazas cibernéticas.',
    pdfUrl: null,
  },
  {
    id: 4,
    titulo: 'Gestión de Bases de Datos Normalizadas con PHP y MySQL',
    categoria: 'Tesis',
    portada: 'https://imgv2-2-f.scribdassets.com/img/document/658295236/original/49032fcde1/1?v=1',
    guardado: true,
    autor: 'A. Rojas',
    anio: 2025,
    carrera: 'Informática',
    resumen: 'Diseño e implementación de una base de datos relacional normalizada con PHP y MySQL para la gestión institucional.',
    pdfUrl: null,
  },
  {
    id: 5,
    titulo: 'Desarrollo de Aplicaciones Web con Next.js y Tailwind CSS',
    categoria: 'Sistematización',
    portada: 'https://imgv2-1-f.scribdassets.com/img/document/450099540/original/16409224f3/1?v=1',
    guardado: false,
    autor: 'S. Martínez',
    anio: 2026,
    carrera: 'Informática',
    resumen: 'Sistematización sobre el desarrollo de aplicaciones web modernas utilizando el framework Next.js y Tailwind CSS.',
    pdfUrl: null,
  },
];

export function getDocumentoById(id: number): Documento | undefined {
  return DOCUMENTOS.find((d) => d.id === id);
}
