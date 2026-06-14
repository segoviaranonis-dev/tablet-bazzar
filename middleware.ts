import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error('TABLET_SESSION_SECRET no configurada')
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET)
}

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/login-simple', '/api/auth/login-simple', '/api/auth/auto-login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rutas públicas
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar token
  const token = request.cookies.get('tablet-session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, getSecret())

    // Validación de acceso a Tablet Bazzar
    // ROL 1: Acceso total (sin restricciones)
    // ROL 2: Solo ADMIN y SU (no VENDEDOR)
    if (payload.rol_id === 1) {
      // Rol 1: Acceso total
      return NextResponse.next()
    } else if (payload.rol_id === 2) {
      // Rol 2: Validar categoría
      const categoriaPermitida = payload.categoria === 'ADMIN' || payload.categoria === 'SU'
      if (!categoriaPermitida) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('tablet-session')
        return response
      }
      return NextResponse.next()
    } else {
      // Rol no permitido
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('tablet-session')
      return response
    }
  } catch (error) {
    // Token inválido o expirado
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('tablet-session')
    return response
  }
}

export const config = {
  matcher: [
    '/',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
