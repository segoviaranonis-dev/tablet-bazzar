import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { listarVendedoresPorEnte } from "@/lib/server/vendedor-bazzar";

export async function GET(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  const clienteId = Number(new URL(req.url).searchParams.get("cliente_id"));
  if (!Number.isFinite(clienteId)) {
    return NextResponse.json({ ok: false, error: "Tienda no identificada" }, { status: 400 });
  }

  const result = await listarVendedoresPorEnte(clienteId);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({ ok: true, vendedores: result.vendedores });
}
