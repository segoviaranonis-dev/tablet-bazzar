import { NextRequest, NextResponse } from "next/server";
import { cohortePorUbicacion } from "@/lib/deposito-cohorte";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import {
  queryParGradaEnTabla,
  queryParTotalEnTabla,
  type ParStockQuery,
} from "@/lib/server/stock-par-grada";
import { buildStockBloques, emptyUbicaciones } from "@/lib/stock-otros-locales";
import { UBICACIONES, ubicacionIdFromClienteId } from "@/lib/ubicaciones";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

function parseIntParam(v: string | null): number | null {
  if (!v?.trim()) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parsePar(sp: URLSearchParams): ParStockQuery | null {
  const linea = (sp.get("linea") ?? sp.get("linea_codigo") ?? "").trim();
  const referencia = (sp.get("referencia") ?? sp.get("referencia_codigo") ?? "").trim();
  const linea_id = parseIntParam(sp.get("linea_id"));
  const referencia_id = parseIntParam(sp.get("referencia_id"));

  if (linea && referencia) {
    return {
      linea_id,
      referencia_id,
      linea_codigo_proveedor: linea,
      referencia_codigo_proveedor: referencia,
    };
  }
  if (linea_id != null && referencia_id != null) {
    return {
      linea_id,
      referencia_id,
      linea_codigo_proveedor: linea,
      referencia_codigo_proveedor: referencia,
    };
  }
  return null;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, error: "DATABASE_URL no configurada" }, { status: 500 });
  }

  const cliente_id = Number((await ctx.params).cliente_id);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json({ configured: true, error: "cliente_id inválido" }, { status: 400 });
  }

  const par = parsePar(req.nextUrl.searchParams);
  if (!par) {
    return NextResponse.json(
      { configured: true, error: "Par L+R incompleto (linea+referencia o FK)" },
      { status: 400 },
    );
  }

  const pool = getPool();
  const ubicacionActualId = ubicacionIdFromClienteId(cliente_id);
  const cohorte = cohortePorUbicacion(cliente_id);
  const t0 = Date.now();

  try {
    const cantidad_local = await queryParTotalEnTabla(pool, config.tabla, par);

    const gradasPorUb = new Map<string, Map<string, number>>();
    await Promise.all(
      UBICACIONES.map(async (ub) => {
        const dep = cohorte.get(ub.id);
        if (!dep) {
          gradasPorUb.set(ub.id, new Map());
          return;
        }
        const gm = await queryParGradaEnTabla(pool, dep.tabla, par);
        gradasPorUb.set(ub.id, gm);
      }),
    );

    const ubicaciones = buildStockBloques(gradasPorUb, ubicacionActualId);

    return NextResponse.json({
      configured: true,
      server_time: new Date().toISOString(),
      cantidad_local,
      ubicaciones,
      scope: "par_lr",
      ms: Date.now() - t0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error live stock";
    return NextResponse.json(
      {
        configured: true,
        cantidad_local: 0,
        ubicaciones: emptyUbicaciones(ubicacionActualId),
        error: msg,
      },
      { status: 500 },
    );
  }
}
