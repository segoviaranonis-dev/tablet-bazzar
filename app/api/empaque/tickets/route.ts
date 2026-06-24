import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { listarBobedaPendienteEntrega } from "@/lib/server/tickets-bobeda";

/** GET /api/empaque/tickets?cliente_id= — Bobeda PENDIENTE_ENTREGA */
export async function GET(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  const clienteId = Number(req.nextUrl.searchParams.get("cliente_id"));
  if (!Number.isFinite(clienteId)) {
    return NextResponse.json({ ok: false, error: "cliente_id requerido" }, { status: 400 });
  }

  const tickets = await listarBobedaPendienteEntrega(clienteId);
  return NextResponse.json({ ok: true, tickets });
}
