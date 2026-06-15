import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { confirmarTicketsPos, type ConfirmarTicketsInput } from "@/lib/server/tickets-confirm";

export async function POST(req: NextRequest) {
  const vendedor = await readTabletSession(req);
  if (!vendedor) {
    return NextResponse.json({ ok: false, error: "Sesión expirada — volvé a ingresar" }, { status: 401 });
  }

  let body: ConfirmarTicketsInput;
  try {
    body = (await req.json()) as ConfirmarTicketsInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  if (!Number.isFinite(body.cliente_id) || !body.marca?.trim()) {
    return NextResponse.json({ ok: false, error: "Tienda no identificada" }, { status: 400 });
  }

  const result = await confirmarTicketsPos(body, vendedor);

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
