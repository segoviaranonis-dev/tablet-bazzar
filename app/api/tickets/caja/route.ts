import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { listarFacturasCajaPendientes } from "@/lib/server/tickets-caja-read";

/** GET /api/tickets/caja?cliente_id= — bandeja cajero (ticket_bandeja_cajero), solo lectura. */
export async function GET(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  const clienteId = Number(req.nextUrl.searchParams.get("cliente_id"));
  if (!Number.isFinite(clienteId)) {
    return NextResponse.json({ ok: false, error: "cliente_id requerido" }, { status: 400 });
  }

  const facturas = await listarFacturasCajaPendientes(clienteId);
  return NextResponse.json({ ok: true, facturas });
}
