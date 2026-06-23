import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import {
  cambiarEstadoStaging,
  editarLineasStaging,
  promoverStagingAOro,
  type LineaPatch,
} from "@/lib/server/tickets-staging";

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
    case "cerrar": {
      const r = await cambiarEstadoStaging(stagingId, clienteId, "CERRADO");
      if (!r.ok) return NextResponse.json(r, { status: 400 });
      return NextResponse.json({ ok: true, staging: r.staging });
    }
    case "reabrir": {
      const r = await cambiarEstadoStaging(stagingId, clienteId, "ABIERTO");
      if (!r.ok) return NextResponse.json(r, { status: 400 });
      return NextResponse.json({ ok: true, staging: r.staging });
    }
    case "cancelar": {
      const r = await cambiarEstadoStaging(stagingId, clienteId, "CANCELADO");
      if (!r.ok) return NextResponse.json(r, { status: 400 });
      return NextResponse.json({ ok: true, staging: r.staging });
    }
    case "promover": {
      const r = await promoverStagingAOro(stagingId, clienteId);
      if (!r.ok) return NextResponse.json(r, { status: 400 });
      const { ok: _ok, ...rest } = r;
      return NextResponse.json({ ok: true, ...rest });
    }
    default:
      return NextResponse.json({ ok: false, error: "accion inválida" }, { status: 400 });
  }
}
