import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const SESSION_VERSION = 1

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error('TABLET_SESSION_SECRET no configurada')
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET)
}

export async function GET(request: NextRequest) {
  try {
    console.log('[AUTO-LOGIN] Generando sesión automática para HECTOR...')

    // Crear JWT directamente para HECTOR
    const token = await new SignJWT({
      user_id: 1,
      nombre: 'HECTOR',
      email: 'hectorvidalsegoviaportillo@gmail.com',
      rol_id: 1,
      categoria: 'DIOS',
      version: SESSION_VERSION,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(getSecret())

    console.log('[AUTO-LOGIN] JWT creado, redirigiendo a /cadena')

    // Redirigir a cadena con cookie establecida
    const response = NextResponse.redirect(new URL('/cadena', request.url))
    response.cookies.set('tablet-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[AUTO-LOGIN] ERROR:', error)
    return NextResponse.json(
      { error: 'Error creando sesión automática' },
      { status: 500 }
    )
  }
}
