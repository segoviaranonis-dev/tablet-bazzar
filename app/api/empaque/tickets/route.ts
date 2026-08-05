import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { resolveEmpaqueClienteId } from "@/lib/empaque-cliente-id";
import { listarEmpaqueFacturas } from "@/lib/server/tickets-bobeda";

/** GET /api/empaque/tickets?cliente_id= — Bobeda PENDIENTE_ENTREGA agrupado por factura */
export async function GET(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  const resolved = await resolveEmpaqueClienteId(req, session);
  if ("error" in resolved) {
    return NextResponse.json({ ok: false, error: resolved.error }, { status: resolved.status });
  }

  const facturas = await listarEmpaqueFacturas(resolved.clienteId);
  return NextResponse.json({
    ok: true,
    cliente_id: resolved.clienteId,
    facturas,
    total_pares: facturas.reduce((s, f) => s + f.pares, 0),
  });
}
