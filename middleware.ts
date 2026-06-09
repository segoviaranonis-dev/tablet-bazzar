import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error('TABLET_SESSION_SECRET no configurada')
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET)
}

const PUBLIC_PATHS = ['/login', '/api/auth/login']

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

    // Verificar que sea rol 1 (Admin) o rol 2 (Retail)
    if (payload.rol_id !== 1 && payload.rol_id !== 2) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('tablet-session')
      return response
    }

    return NextResponse.next()
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
