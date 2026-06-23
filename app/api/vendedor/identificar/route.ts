import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { identificarVendedorPin } from "@/lib/server/vendedor-bazzar";

export async function POST(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  let body: { cliente_id?: number; pin?: string };
  try {
    body = (await req.json()) as { cliente_id?: number; pin?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  const clienteId = Number(body.cliente_id);
  if (!Number.isFinite(clienteId)) {
    return NextResponse.json({ ok: false, error: "Tienda no identificada" }, { status: 400 });
  }

  const result = await identificarVendedorPin(clienteId, String(body.pin ?? ""));
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({ ok: true, vendedor: result.vendedor });
}
