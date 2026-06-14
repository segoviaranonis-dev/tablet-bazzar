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
    const { usuario: usuarioInput, password } = await request.json()

    if (!usuarioInput || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña requeridos' },
        { status: 400 }
      )
    }

    // Consultar usuario_v2 por descp_usuario
    const usuarioNorm = usuarioInput.trim()
    const { data: usuarios, error } = await getSupabase()
      .from('usuario_v2')
      .select('id_usuario, descp_usuario, email, password, password_hash, rol_id, categoria')
      .ilike('descp_usuario', usuarioNorm)
      .limit(1)

    if (error || !usuarios || usuarios.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const usuario = usuarios[0]
    const passwordClean = password.trim()

    console.log('[LOGIN DEBUG] Usuario encontrado:', usuario.descp_usuario)
    console.log('[LOGIN DEBUG] Password hash existe:', !!usuario.password_hash)
    console.log('[LOGIN DEBUG] Password plain existe:', !!usuario.password)
    console.log('[LOGIN DEBUG] Password ingresado:', passwordClean)
    console.log('[LOGIN DEBUG] Rol ID:', usuario.rol_id)
    console.log('[LOGIN DEBUG] Categoria:', usuario.categoria)

    // Verificar contraseña con bcrypt (mismo sistema que Report)
    let passwordOk = false

    if (usuario.password_hash) {
      // Verificar con bcrypt si existe hash
      console.log('[LOGIN DEBUG] Verificando con bcrypt...')
      passwordOk = await bcrypt.compare(passwordClean, usuario.password_hash)
      console.log('[LOGIN DEBUG] Bcrypt result:', passwordOk)

      // Legacy: algunos hashes se crearon con \n al final
      if (!passwordOk && passwordClean) {
        console.log('[LOGIN DEBUG] Probando con \\n legacy...')
        passwordOk = await bcrypt.compare(`${passwordClean}\n`, usuario.password_hash)
        console.log('[LOGIN DEBUG] Bcrypt legacy result:', passwordOk)
      }
    } else if (usuario.password) {
      // Fallback: verificar contra texto plano (usuarios legacy)
      console.log('[LOGIN DEBUG] Verificando plaintext...')
      passwordOk = usuario.password === passwordClean
      console.log('[LOGIN DEBUG] Plaintext result:', passwordOk)
    }

    console.log('[LOGIN DEBUG] Password final OK:', passwordOk)

    if (!passwordOk) {
      console.log('[LOGIN DEBUG] Password RECHAZADO')
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    console.log('[LOGIN DEBUG] Password ACEPTADO, continuando...')

    // Validación de acceso a Tablet Bazzar
    // ROL 1: Acceso total (sin restricciones)
    // ROL 2: Solo ADMIN y SU (no VENDEDOR)
    if (usuario.rol_id === 1) {
      // Rol 1: Acceso total, sin restricciones
      // Continuar con el flujo normal
    } else if (usuario.rol_id === 2) {
      // Rol 2: Validar categoría
      const categoriaPermitida = usuario.categoria === 'ADMIN' || usuario.categoria === 'SU'
      if (!categoriaPermitida) {
        return NextResponse.json(
          { error: 'Acceso no autorizado. Solo usuarios ADMIN y SU pueden acceder a Tablet Bazzar.' },
          { status: 403 }
        )
      }
    } else {
      // Rol diferente de 1 o 2: no permitido
      return NextResponse.json(
        { error: 'Acceso no autorizado.' },
        { status: 403 }
      )
    }

    // Crear JWT
    const token = await new SignJWT({
      user_id: usuario.id_usuario,
      nombre: usuario.descp_usuario,
      email: usuario.email,
      rol_id: usuario.rol_id,
      categoria: usuario.categoria,
      version: SESSION_VERSION,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(getSecret())

    const response = NextResponse.json({
      success: true,
      user: {
        id: usuario.id_usuario,
        nombre: usuario.descp_usuario,
        email: usuario.email,
        rol_id: usuario.rol_id,
        categoria: usuario.categoria,
      },
    })

    // Set cookie
    response.cookies.set('tablet-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
