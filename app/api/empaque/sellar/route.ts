import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { parseClienteIdQuery, resolveEmpaqueClienteId } from "@/lib/empaque-cliente-id";
import { sellarFacturaEmpaqueTablet } from "@/lib/server/tickets-bobeda";

/** POST /api/empaque/sellar — control completo → ENTREGADO (bóveda de oro) */
export async function POST(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  let body: { cliente_id?: number | string; staging_id?: number | null; nombre_confirmado?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const resolved = await resolveEmpaqueClienteId(req, session);
  let clienteId = "error" in resolved ? null : resolved.clienteId;
  if (clienteId == null && body.cliente_id != null) {
    clienteId = parseClienteIdQuery(String(body.cliente_id));
  }
  if (clienteId == null) {
    const err = "error" in resolved ? resolved.error : "cliente_id inválido";
    const status = "error" in resolved ? resolved.status : 400;
    return NextResponse.json({ ok: false, error: err }, { status });
  }

  const r = await sellarFacturaEmpaqueTablet({
    clienteId,
    stagingId: body.staging_id ?? null,
    nombreConfirmado: body.nombre_confirmado ?? "",
  });
  if (!r.ok) return NextResponse.json(r, { status: 400 });
  return NextResponse.json(r);
}
