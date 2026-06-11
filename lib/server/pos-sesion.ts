import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";

const COOKIE = "tablet-pos-ingreso";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 h turno tienda

export type PosIngresoPayload = {
  cliente_id: number;
  marca: string;
  ingresado_at: string;
  v: 1;
};

function secret() {
  const s = process.env.TABLET_SESSION_SECRET?.trim();
  if (!s) throw new Error("TABLET_SESSION_SECRET no configurada");
  return new TextEncoder().encode(s);
}

export async function firmarPosIngreso(payload: Omit<PosIngresoPayload, "v">): Promise<string> {
  return new SignJWT({ ...payload, v: 1 })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(secret());
}

export async function leerPosIngreso(token: string | undefined): Promise<PosIngresoPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const cliente_id = Number(payload.cliente_id);
    const marca = String(payload.marca ?? "");
    if (!Number.isFinite(cliente_id) || !marca) return null;
    return {
      cliente_id,
      marca,
      ingresado_at: String(payload.ingresado_at ?? ""),
      v: 1,
    };
  } catch {
    return null;
  }
}

export function cookiePosIngreso(request: NextRequest): Promise<PosIngresoPayload | null> {
  return leerPosIngreso(request.cookies.get(COOKIE)?.value);
}

export function setCookiePosIngreso(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export { COOKIE as POS_INGRESO_COOKIE };
