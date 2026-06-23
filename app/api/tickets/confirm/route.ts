import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { crearStagingDesdeCarrito } from "@/lib/server/tickets-staging";
import type { ConfirmarTicketsInput } from "@/lib/server/tickets-confirm";
import { getVendedorById } from "@/lib/server/vendedor-bazzar";

export async function POST(req: NextRequest) {
  const sessionUser = await readTabletSession(req);
  if (!sessionUser) {
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

  const vendedorId = Number(body.vendedor_bazzar_id);
  if (!Number.isFinite(vendedorId)) {
    return NextResponse.json({ ok: false, error: "Identificá vendedor con PIN antes de cobrar" }, { status: 400 });
  }

  const vendedor = await getVendedorById(vendedorId, body.cliente_id);
  if (!vendedor) {
    return NextResponse.json({ ok: false, error: "Vendedor no válido para esta tienda" }, { status: 400 });
  }

  const result = await crearStagingDesdeCarrito({ ...body, vendedor_bazzar_id: vendedorId }, vendedor);

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    staging: result.staging,
    codigo_staging: result.codigo_staging,
    total_pares: result.total_pares,
    persisted: true,
    stock_decrementado: true,
    mensaje: "Ticket abierto — stock descontado en sesión. Cerralo y promové a ORO.",
  });
}
