import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { getSupabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

const SESSION_VERSION = 1

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error('TABLET_SESSION_SECRET no configurada')
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET)
}

export async function POST(request: NextRequest) {
  try {
    // Parsear form data (no JSON)
    const formData = await request.formData()
    const usuario = formData.get('usuario')?.toString() || ''
    const password = formData.get('password')?.toString() || ''

    console.log('[LOGIN-SIMPLE] Intento de login:', usuario)

    if (!usuario || !password) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Usuario y contraseña requeridos</p><a href="/login-simple">Volver</a></body></html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Consultar usuario_v2
    const usuarioNorm = usuario.trim()
    const { data: usuarios, error } = await getSupabase()
      .from('usuario_v2')
      .select('id_usuario, descp_usuario, email, password, password_hash, rol_id, categoria')
      .ilike('descp_usuario', usuarioNorm)
      .limit(1)

    console.log('[LOGIN-SIMPLE] Usuarios encontrados:', usuarios?.length || 0)

    if (error || !usuarios || usuarios.length === 0) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Usuario no encontrado</p><a href="/login-simple">Volver</a></body></html>`,
        { status: 401, headers: { 'Content-Type': 'text/html' } }
      )
    }

    const user = usuarios[0]
    const passwordClean = password.trim()

    console.log('[LOGIN-SIMPLE] Usuario encontrado:', user.descp_usuario, 'Rol:', user.rol_id)

    // Verificar contraseña
    let passwordOk = false

    if (user.password_hash) {
      console.log('[LOGIN-SIMPLE] Verificando con bcrypt...')
      passwordOk = await bcrypt.compare(passwordClean, user.password_hash)
      console.log('[LOGIN-SIMPLE] Bcrypt result:', passwordOk)

      if (!passwordOk && passwordClean) {
        passwordOk = await bcrypt.compare(`${passwordClean}\n`, user.password_hash)
        console.log('[LOGIN-SIMPLE] Bcrypt legacy result:', passwordOk)
      }
    } else if (user.password) {
      console.log('[LOGIN-SIMPLE] Verificando plaintext...')
      passwordOk = user.password === passwordClean
      console.log('[LOGIN-SIMPLE] Plaintext result:', passwordOk)
    }

    if (!passwordOk) {
      console.log('[LOGIN-SIMPLE] PASSWORD INCORRECTO')
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Contraseña incorrecta</p><a href="/login-simple">Volver</a></body></html>`,
        { status: 401, headers: { 'Content-Type': 'text/html' } }
      )
    }

    console.log('[LOGIN-SIMPLE] PASSWORD CORRECTO')

    // Validar rol
    if (user.rol_id !== 1 && (user.rol_id !== 2 || (user.categoria !== 'ADMIN' && user.categoria !== 'SU'))) {
      console.log('[LOGIN-SIMPLE] ROL NO PERMITIDO')
      return new NextResponse(
        `<html><body><h1>Error</h1><p>No tenés permisos para acceder</p><a href="/login-simple">Volver</a></body></html>`,
        { status: 403, headers: { 'Content-Type': 'text/html' } }
      )
    }

    console.log('[LOGIN-SIMPLE] ROL OK, creando JWT...')

    // Crear JWT
    const token = await new SignJWT({
      user_id: user.id_usuario,
      nombre: user.descp_usuario,
      email: user.email,
      rol_id: user.rol_id,
      categoria: user.categoria,
      version: SESSION_VERSION,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(getSecret())

    console.log('[LOGIN-SIMPLE] JWT creado, redirigiendo a /')

    // Redirigir con cookie
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('tablet-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[LOGIN-SIMPLE] ERROR:', error)
    return new NextResponse(
      `<html><body><h1>Error</h1><p>Error del servidor: ${error}</p><a href="/login-simple">Volver</a></body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}
