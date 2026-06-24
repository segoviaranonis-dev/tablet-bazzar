import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import {
  cancelarPedidoCompleto,
  editarLineasStaging,
  enviarStagingACaja,
  reabrirStagingCompleto,
  type LineaPatch,
} from "@/lib/server/tickets-staging";
import { getVendedorById } from "@/lib/server/vendedor-bazzar";

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const stagingId = Number(id);
  if (!Number.isFinite(stagingId)) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  let body: { cliente_id?: number; lineas?: LineaPatch[] };
  try {
    body = (await req.json()) as { cliente_id?: number; lineas?: LineaPatch[] };
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  const clienteId = Number(body.cliente_id);
  if (!Number.isFinite(clienteId) || !body.lineas?.length) {
    return NextResponse.json({ ok: false, error: "cliente_id y lineas requeridos" }, { status: 400 });
  }

  const result = await editarLineasStaging(stagingId, clienteId, body.lineas);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json({ ok: true, staging: result.staging });
}

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

  let body: { cliente_id?: number; accion?: string };
  try {
    body = (await req.json()) as { cliente_id?: number; accion?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  const clienteId = Number(body.cliente_id);
  if (!Number.isFinite(clienteId) || !body.accion) {
    return NextResponse.json({ ok: false, error: "cliente_id y accion requeridos" }, { status: 400 });
  }

  switch (body.accion) {
    case "cerrar":
    case "enviar_caja":
    case "promover": {
      const r = await enviarStagingACaja(stagingId, clienteId);
      if (!r.ok) return NextResponse.json(r, { status: 400 });
      const { ok: _ok, ...rest } = r;
      return NextResponse.json({ ok: true, ...rest });
    }
    case "reabrir":
    case "reabrir_caja":
    case "reabrir_completo": {
      const r = await reabrirStagingCompleto(stagingId, clienteId);
      if (!r.ok) return NextResponse.json(r, { status: 400 });
      const vb = await getVendedorById(r.staging.vendedor_bazzar_id, clienteId);
      return NextResponse.json({
        ok: true,
        staging: r.staging,
        vendedor: vb
          ? {
              id_vendedor: vb.id_vendedor,
              nombre_display: vb.nombre_display,
              ente_codigo: vb.ente_codigo,
            }
          : null,
      });
    }
    case "cancelar":
    case "cancelar_pedido": {
      const r = await cancelarPedidoCompleto(stagingId, clienteId);
      if (!r.ok) return NextResponse.json(r, { status: 400 });
      return NextResponse.json({ ok: true, staging: r.staging });
    }
    default:
      return NextResponse.json({ ok: false, error: "accion inválida" }, { status: 400 });
  }
}
