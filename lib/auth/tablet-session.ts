import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export type TabletSessionUser = {
  user_id: number;
  nombre: string;
  email?: string;
  rol_id: number;
};

function secret() {
  const s = process.env.TABLET_SESSION_SECRET?.trim();
  if (!s) throw new Error("TABLET_SESSION_SECRET no configurada");
  return new TextEncoder().encode(s);
}

export async function readTabletSession(request: NextRequest): Promise<TabletSessionUser | null> {
  const token = request.cookies.get("tablet-session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const user_id = Number(payload.user_id);
    if (!Number.isFinite(user_id)) return null;
    return {
      user_id,
      nombre: String(payload.nombre ?? ""),
      email: payload.email ? String(payload.email) : undefined,
      rol_id: Number(payload.rol_id ?? 0),
    };
  } catch {
    return null;
  }
}
