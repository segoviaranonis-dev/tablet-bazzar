import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { sincronizarStagingDesdeCarrito } from "@/lib/server/tickets-staging";
import type { ConfirmarTicketsInput } from "@/lib/server/tickets-confirm";
import { getVendedorById } from "@/lib/server/vendedor-bazzar";

type RouteCtx = { params: Promise<{ id: string }> };

/** Persiste carrito tablet → staging ABIERTO sin enviar a caja (edición en vivo). */
export async function POST(req: NextRequest, ctx: RouteCtx) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const stagingId = Number(id);
  if (!Number.isFinite(stagingId)) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  let body: ConfirmarTicketsInput;
  try {
    body = (await req.json()) as ConfirmarTicketsInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  const clienteId = Number(body.cliente_id);
  if (!Number.isFinite(clienteId)) {
    return NextResponse.json({ ok: false, error: "cliente_id requerido" }, { status: 400 });
  }

  const vendedorId = Number(body.vendedor_bazzar_id);
  if (!Number.isFinite(vendedorId)) {
    return NextResponse.json({ ok: false, error: "vendedor_bazzar_id requerido" }, { status: 400 });
  }

  const vendedor = await getVendedorById(vendedorId, clienteId);
  if (!vendedor) {
    return NextResponse.json({ ok: false, error: "Vendedor no válido para esta tienda" }, { status: 400 });
  }

  const result = await sincronizarStagingDesdeCarrito(
    stagingId,
    { ...body, vendedor_bazzar_id: vendedorId },
    vendedor,
  );
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    staging: result.staging,
    total_pares: result.total_pares,
    cancelled: result.total_pares === 0,
  });
}
