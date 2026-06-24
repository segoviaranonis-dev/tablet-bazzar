import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { marcarEntregadoBobeda } from "@/lib/server/tickets-bobeda";

/** POST /api/empaque/entregar — body: { cliente_id, codigos: string[] } */
export async function POST(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  let body: { cliente_id?: number; codigos?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const clienteId = Number(body.cliente_id);
  if (!Number.isFinite(clienteId)) {
    return NextResponse.json({ ok: false, error: "cliente_id inválido" }, { status: 400 });
  }

  const codigos = Array.isArray(body.codigos) ? body.codigos.filter(Boolean) : [];
  const r = await marcarEntregadoBobeda(clienteId, codigos);
  if (!r.ok) {
    return NextResponse.json(r, { status: 400 });
  }
  return NextResponse.json(r);
}
