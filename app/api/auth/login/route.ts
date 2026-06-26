import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verificarPasswordUsuario } from "@/lib/auth/verifyPassword";
import { aplicarAccesoCanonicoBzz } from "@/lib/auth/bzz-acceso";
import { signTabletSessionToken, tabletSessionCookieOptions } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  try {
    const { usuario: usuarioInput, password } = await request.json();

    if (!usuarioInput || !password) {
      return NextResponse.json({ error: "Usuario y contraseña requeridos" }, { status: 400 });
    }

    const usuarioNorm = usuarioInput.trim();
    const { data: usuarios, error } = await getSupabase()
      .from("usuario_v2")
      .select("id_usuario, descp_usuario, email, password, password_hash, rol_id, categoria, ente_id")
      .ilike("descp_usuario", usuarioNorm)
      .limit(1);

    if (error || !usuarios || usuarios.length === 0) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const usuario = usuarios[0];
    const passwordClean = password.trim();

    const { ok: passwordOk } = await verificarPasswordUsuario(
      passwordClean,
      usuario.password,
      usuario.password_hash,
    );

    if (!passwordOk) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const bzz = aplicarAccesoCanonicoBzz(
      usuario.descp_usuario,
      Number(usuario.rol_id) || 0,
      null,
    );
    const rolId = bzz.rol_id;
    const categoria = String(usuario.categoria ?? "").toUpperCase();

    if (rolId === 1) {
      // RIMEC holding — acceso total tablet (Director / Nivel Dios)
    } else if (rolId === 2) {
      const ok =
        categoria === "ADMIN" ||
        categoria === "SU" ||
        categoria === "VENDEDOR";
      if (!ok) {
        return NextResponse.json(
          { error: "Acceso no autorizado para este perfil Bazzar." },
          { status: 403 },
        );
      }
    } else {
      return NextResponse.json({ error: "Acceso no autorizado." }, { status: 403 });
    }

    const token = await signTabletSessionToken({
      id_usuario: usuario.id_usuario,
      descp_usuario: usuario.descp_usuario,
      email: usuario.email,
      rol_id: rolId,
      categoria: usuario.categoria,
      ente_id: usuario.ente_id,
      ente_codigo: rolId === 1 ? 1 : undefined,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: usuario.id_usuario,
        nombre: usuario.descp_usuario,
        email: usuario.email,
        rol_id: rolId,
        categoria: usuario.categoria,
        ente_codigo: rolId === 1 ? 1 : null,
        scope: rolId === 1 ? "dios" : "tienda",
      },
    });

    response.cookies.set("tablet-session", token, tabletSessionCookieOptions());

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
