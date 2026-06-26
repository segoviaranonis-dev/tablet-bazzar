import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error("TABLET_SESSION_SECRET no configurada");
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET);
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("tablet-session")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, getSecret());

    return NextResponse.json({
      user: {
        id: payload.user_id,
        nombre: payload.nombre,
        email: payload.email,
        rol_id: payload.rol_id,
        categoria: payload.categoria ?? null,
        ente_codigo: payload.ente_codigo != null ? Number(payload.ente_codigo) : null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
  }
}
