import { NextRequest, NextResponse } from "next/server";
import { signTabletSessionToken, tabletSessionCookieOptions } from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  try {
    const token = await signTabletSessionToken({
      id_usuario: 1,
      descp_usuario: "HECTOR",
      email: "hectorvidalsegoviaportillo@gmail.com",
      rol_id: 1,
      categoria: "DIOS",
      ente_codigo: 1,
    });

    const response = NextResponse.redirect(new URL("/cadena", request.url));
    response.cookies.set("tablet-session", token, tabletSessionCookieOptions());

    return response;
  } catch (error) {
    console.error("[AUTO-LOGIN] ERROR:", error);
    return NextResponse.json({ error: "Error creando sesión automática" }, { status: 500 });
  }
}
