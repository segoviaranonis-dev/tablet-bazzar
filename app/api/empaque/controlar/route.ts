import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { parseClienteIdQuery, resolveEmpaqueClienteId } from "@/lib/empaque-cliente-id";
import { toggleLineaControladaEmpaque } from "@/lib/server/tickets-bobeda";

/** POST /api/empaque/controlar — alternar controlado ↔ pendiente */
export async function POST(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  let body: { cliente_id?: number | string; codigo_oro?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const codigo = body.codigo_oro?.trim();
  if (!codigo) {
    return NextResponse.json({ ok: false, error: "codigo_oro requerido" }, { status: 400 });
  }

  const resolved = await resolveEmpaqueClienteId(req, session);
  const bodyClienteId =
    body.cliente_id != null ? parseClienteIdQuery(String(body.cliente_id)) : null;
  const clienteId = bodyClienteId ?? ("error" in resolved ? null : resolved.clienteId);
  if (clienteId == null) {
    const err = "error" in resolved ? resolved.error : "cliente_id inválido";
    const status = "error" in resolved ? resolved.status : 400;
    return NextResponse.json({ ok: false, error: err }, { status });
  }

  const r = await toggleLineaControladaEmpaque(clienteId, codigo, session.nombre);
  if (!r.ok) return NextResponse.json(r, { status: 400 });
  return NextResponse.json({ ok: true, controlado: r.controlado });
}
