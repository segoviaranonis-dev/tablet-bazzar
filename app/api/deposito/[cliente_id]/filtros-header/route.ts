import { NextRequest, NextResponse } from "next/server";
import { resolverColorHex } from "@/lib/color-hex";
import { parseDepositoFiltersFromSearchParams } from "@/lib/deposito-filters";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { sqlResumenDeposito } from "@/lib/server/catalogo-sql";
import {
  sqlDepositoChipsColor,
  sqlDepositoChipsEstilo,
  sqlDepositoChipsGenero,
  sqlDepositoChipsLinea,
  sqlDepositoChipsMarca,
  sqlDepositoChipsTipo1,
  type DepositoFilterItem,
} from "@/lib/server/deposito-filtros-sql";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

/** Header pilares depósito con fotos — IDs FK paridad RIMEC (sin ETA/Ofertas). */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, error: "DATABASE_URL no configurada" }, { status: 500 });
  }

  const cliente_id = Number((await ctx.params).cliente_id);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json({ configured: true, error: "cliente_id inválido" }, { status: 400 });
  }

  const filtros = parseDepositoFiltersFromSearchParams(req.nextUrl.searchParams);
  const pool = getPool();
  const tabla = config.tabla;
  const t0 = Date.now();

  try {
    const qGen = sqlDepositoChipsGenero(tabla, filtros);
    const qMar = sqlDepositoChipsMarca(tabla, filtros);
    const qEst = sqlDepositoChipsEstilo(tabla, filtros);
    const qT1 = sqlDepositoChipsTipo1(tabla, filtros);
    const qLin = sqlDepositoChipsLinea(tabla, filtros);
    const qCol = sqlDepositoChipsColor(tabla, filtros);
    const qRes = sqlResumenDeposito(tabla);

    const [generos, marcas, estilos, tipo1, lineas, colores, resumen] = await Promise.all([
      pool.query<DepositoFilterItem>(qGen.text, qGen.params),
      pool.query<DepositoFilterItem>(qMar.text, qMar.params),
      pool.query<DepositoFilterItem>(qEst.text, qEst.params),
      pool.query<DepositoFilterItem>(qT1.text, qT1.params),
      pool.query<DepositoFilterItem>(qLin.text, qLin.params),
      pool.query<DepositoFilterItem>(qCol.text, qCol.params),
      pool.query<{ skus: number; pares: number }>(qRes.text, qRes.params),
    ]);

    const coloresConHex = colores.rows.map((c) => ({
      ...c,
      hex: resolverColorHex({ label: c.label }),
    }));

    const hexPalette = [...new Map(coloresConHex.map((c) => [c.hex, c.hex])).values()].slice(0, 24);

    return NextResponse.json({
      configured: true,
      cliente_id,
      ente: config.ente,
      tipo: config.tipo,
      generos: generos.rows,
      marcas: marcas.rows,
      estilos: estilos.rows,
      tipo1: tipo1.rows,
      lineas: lineas.rows,
      colores: coloresConHex,
      hexPalette,
      resumen: resumen.rows[0] ?? { skus: 0, pares: 0 },
      ms: Date.now() - t0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error SQL filtros header";
    return NextResponse.json({ configured: true, error: msg }, { status: 500 });
  }
}
