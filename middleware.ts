import { NextResponse, type NextRequest } from 'next/server';

interface SessionUser {
  id_usuario: number;
  nombre_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  id_tipo_usuario: number;
}

function getSession(request: NextRequest): SessionUser | null {
  const cookie = request.cookies.get('session');
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value) as SessionUser;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const session = getSession(request);
  const pathname = request.nextUrl.pathname;

  const isPublic = pathname === '/login' || pathname.startsWith('/invitado');

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && pathname === '/login') {
    const dest = session.id_tipo_usuario === 2 ? '/admin' : '/';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (session && pathname === '/' && session.id_tipo_usuario === 2) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (session && pathname.startsWith('/admin') && session.id_tipo_usuario !== 2) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
