export interface Autor {
  id_usuario: number;
  nombre_usuario: number;
  nombreCompleto: string;
}

export interface Documento {
  id_documento: number;
  titulo: string;
  descripcion: string;
  url_archivo: string;
  fecha_publicacion: string;
  id_carrera: number;
  id_tipo_documento: number;
}

export interface Carrera {
  id_carrera: number;
  nombre_carrera: string;
}

export interface TipoDocumento {
  id_tipo_documento: number;
  nombre_tipo_documento: string;
}

export type ErroresForm = {
  titulo?: string;
  descripcion?: string;
  carrera?: string;
  tipo_documento?: string;
  fecha_publicacion?: string;
  archivo?: string;
};

export interface Usuario {
  id_usuario?: number;
  nombre_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
  id_tipo_usuario?: number;
  rol?: string;
}

export type ErroresUsuario = {
  nombre_usuario?: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  contrasena?: string;
};