import type { NextRequest } from "next/server";
import { cookiePosIngreso } from "@/lib/server/pos-sesion";
import { resolveClienteIdFromUsuario } from "@/lib/usuario-deposito";

const CAJA_IDS = new Set([2100, 2900, 2400, 2700, 3100, 3200]);

export function isCajaClienteId(v: number): boolean {
  return CAJA_IDS.has(v);
}

/** Evita Number(null) === 0 — bug que vaciaba Empaque. */
export function parseClienteIdQuery(raw: string | null): number | null {
  if (raw == null || raw.trim() === "") return null;
  const n = Number(raw.trim());
  if (!Number.isFinite(n) || !isCajaClienteId(n)) return null;
  return n;
}

export type EmpaqueSessionCtx = {
  user_id: number;
  nombre: string;
  rol_id: number;
};

/**
 * Resuelve tienda Empaque: perfil BZZ → cookie POS ingreso → query (solo DIOS).
 */
export async function resolveEmpaqueClienteId(
  req: NextRequest,
  session: EmpaqueSessionCtx,
): Promise<{ clienteId: number } | { error: string; status: number }> {
  const paramId = parseClienteIdQuery(req.nextUrl.searchParams.get("cliente_id"));
  const fromProfile = resolveClienteIdFromUsuario(session.nombre);
  const ingreso = await cookiePosIngreso(req);
  const fromPos = ingreso?.cliente_id != null && isCajaClienteId(ingreso.cliente_id) ? ingreso.cliente_id : null;

  if (session.rol_id === 1) {
    if (paramId == null) {
      return {
        error: "Elegí tienda en el hub Empaque o indicá cliente_id en la URL",
        status: 400,
      };
    }
    return { clienteId: paramId };
  }

  const id = fromProfile ?? fromPos ?? paramId;
  if (id == null) {
    return {
      error: "Sin tienda asignada — perfil BZZFA/BZZFN o ingreso cadena requerido",
      status: 403,
    };
  }

  if (fromProfile != null && paramId != null && paramId !== fromProfile) {
    return { error: "Sin acceso a esta tienda", status: 403 };
  }

  return { clienteId: id };
}
