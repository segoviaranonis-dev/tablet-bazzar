import { NextRequest, NextResponse } from "next/server";

import type { DepositoFila } from "@/lib/cadena";
import { TONOS_ESTANDAR_FALLBACK, type TonoEstandarRow, sqlLoadTonosEstandar } from "@/lib/color-canon-franco";
import { parseFrancoFiltersFromSearchParams } from "@/lib/franco-tirador-filters";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { enrichDepositoFilaImagenes } from "@/lib/product-image";
import {
  sqlFrancoTirador,
  sqlFrancoTiradorOpcionesEstilos,
  sqlFrancoTiradorOpcionesMarcas,
} from "@/lib/server/franco-tirador-sql";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

async function loadTonosEstandar(pool: ReturnType<typeof getPool>): Promise<TonoEstandarRow[]> {
  try {
    const q = sqlLoadTonosEstandar();
    const { rows } = await pool.query<TonoEstandarRow>(q.text, q.params);
    if (rows.length) return rows;
  } catch {
    /* tabla aún no migrada — fallback */
  }
  return TONOS_ESTANDAR_FALLBACK;
}

/**
 * GET /api/deposito/[cliente_id]/franco-tirador
 * ?modo=opciones&tipo=CALZADOS&marcas=BEIRA+RIO
 * ?tipo=CALZADOS&tono_estandar=Negro&color_texto=bronce&grada=39
 */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, hits: [], error: "DATABASE_URL no configurada" }, { status: 500 });
  }

  const cliente_id = Number((await ctx.params).cliente_id);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json({ configured: true, hits: [], error: "cliente_id inválido" }, { status: 400 });
  }

  const sp = req.nextUrl.searchParams;
  const filtros = parseFrancoFiltersFromSearchParams(sp);

  if (!filtros.tipo) {
    return NextResponse.json({ configured: true, hits: [], error: "tipo requerido" }, { status: 400 });
  }

  const pool = getPool();

  if (sp.get("modo") === "opciones") {
    const t0 = Date.now();
    const qMar = sqlFrancoTiradorOpcionesMarcas(config.tabla, filtros);
    const qEst = sqlFrancoTiradorOpcionesEstilos(config.tabla, filtros);

    const [marcas, estilos, tonosEstandar] = await Promise.all([
      pool.query<{ id: number; label: string; count: number }>(qMar.text, qMar.params),
      pool.query<{ id: number; label: string; count: number }>(qEst.text, qEst.params),
      loadTonosEstandar(pool),
    ]);

    return NextResponse.json({
      configured: true,
      cliente_id,
      marcas: marcas.rows,
      estilos: estilos.rows,
      tonosEstandar,
      ms: Date.now() - t0,
    });
  }

  const grada = sp.get("grada")?.trim() ?? "";
  const t0 = Date.now();
  try {
    const q = sqlFrancoTirador(config.tabla, { ...filtros, grada });
    const { rows } = await pool.query<DepositoFila>(q.text, q.params);

    const seen = new Set<string>();
    const hits: DepositoFila[] = [];
    for (const row of rows) {
      const key = `${row.linea_codigo_proveedor}|${row.referencia_codigo_proveedor}|${row.material_code}|${row.color_code}|${row.grada}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push(enrichDepositoFilaImagenes(row));
    }

    const totalPares = hits.reduce((s, h) => s + (Number(h.cantidad) || 0), 0);

    return NextResponse.json({
      configured: true,
      cliente_id,
      ente: config.ente,
      criterios: { ...filtros, grada },
      hits,
      total: hits.length,
      total_pares: totalPares,
      ms: Date.now() - t0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error SQL Franco Tirador";
    return NextResponse.json({ configured: true, hits: [], error: msg }, { status: 500 });
  }
}
