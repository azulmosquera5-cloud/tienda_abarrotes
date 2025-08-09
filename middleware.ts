import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login']
  
  // Si está en una ruta pública, permitir acceso
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Verificar si hay token de sesión
  const token = request.cookies.get('auth-token')
  
  // Si no hay token y no está en login, redirigir a login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Si hay token pero está en login, redirigir al dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
