import { NextRequest, NextResponse } from "next/server";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { sqlFilasStock, filtrosFromSearchParams, FILTROS_SQL_VACIOS } from "@/lib/server/catalogo-sql";
import type { DepositoFila } from "@/lib/cadena";
import { enrichDepositoFilaImagenes } from "@/lib/product-image";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, filas: [], error: "DATABASE_URL no configurada" }, { status: 500 });
  }

  const cliente_id = Number((await ctx.params).cliente_id);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json({ configured: true, filas: [], error: "cliente_id inválido" }, { status: 400 });
  }

  const filtros = req.nextUrl.searchParams.size
    ? filtrosFromSearchParams(req.nextUrl.searchParams)
    : FILTROS_SQL_VACIOS;

  const pool = getPool();
  const t0 = Date.now();
  const q = sqlFilasStock(config.tabla, filtros);
  const { rows } = await pool.query<DepositoFila>(q.text, q.params);

  return NextResponse.json({
    configured: true,
    cliente_id,
    ente: config.ente,
    tipo: config.tipo,
    codigo: config.codigo,
    filas: rows.map(enrichDepositoFilaImagenes),
    total: rows.length,
    ms: Date.now() - t0,
  });
}
