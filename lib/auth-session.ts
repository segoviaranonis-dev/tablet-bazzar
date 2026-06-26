import { SignJWT } from "jose";
import { getSupabase } from "@/lib/supabase";

export const TABLET_SESSION_VERSION = 2;

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error("TABLET_SESSION_SECRET no configurada");
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET);
}

export async function resolveEnteCodigo(enteId: number | null | undefined): Promise<number | null> {
  if (enteId == null) return null;
  const { data, error } = await getSupabase()
    .from("entes")
    .select("codigo")
    .eq("id_ente", enteId)
    .maybeSingle();
  if (error || data?.codigo == null) return null;
  return Number(data.codigo);
}

type UsuarioJwtInput = {
  id_usuario: number;
  descp_usuario: string;
  email?: string | null;
  rol_id: number;
  categoria?: string | null;
  ente_id?: number | null;
  ente_codigo?: number | null;
};

export async function signTabletSessionToken(user: UsuarioJwtInput): Promise<string> {
  let ente_codigo =
    user.ente_codigo != null ? Number(user.ente_codigo) : await resolveEnteCodigo(user.ente_id);

  const cat = String(user.categoria ?? "").toUpperCase().trim();
  if (user.rol_id === 1 && (cat === "DIOS" || ente_codigo == null)) {
    ente_codigo = 1;
  }

  return new SignJWT({
    user_id: user.id_usuario,
    nombre: user.descp_usuario,
    email: user.email ?? null,
    rol_id: user.rol_id,
    categoria: user.categoria ?? null,
    ente_codigo,
    version: TABLET_SESSION_VERSION,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export function tabletSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8,
    path: "/",
  };
}
