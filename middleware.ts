import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { aplicarAccesoCanonicoBzz } from '@/lib/auth/bzz-acceso'

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error('TABLET_SESSION_SECRET no configurada')
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET)
}

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/login-simple', '/api/auth/login-simple', '/api/auth/auto-login']

/** Matriz: rol 2 ADMIN + VENDEDOR tienda → Tablet POS total. */
function categoriaTabletOk(categoria: unknown): boolean {
  const cat = String(categoria ?? '').toUpperCase().trim()
  return cat === 'ADMIN' || cat === 'SU' || cat === 'VENDEDOR'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('tablet-session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, getSecret())

    const nombre = String(payload.nombre ?? '')
    const bzz = aplicarAccesoCanonicoBzz(
      nombre,
      Number(payload.rol_id) || 0,
      payload.ente_codigo != null ? Number(payload.ente_codigo) : null,
    )
    const rolId = bzz.rol_id
    const categoria = String(payload.categoria ?? '').toUpperCase().trim()

    if (rolId === 1) {
      return NextResponse.next()
    }

    if (rolId === 2 && categoriaTabletOk(categoria)) {
      return NextResponse.next()
    }

    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('tablet-session')
    return response
  } catch {
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
