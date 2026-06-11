import { NextRequest, NextResponse } from "next/server";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import {
  filtrosFromSearchParams,
  sqlChipsEstilo,
  sqlChipsGenero,
  sqlChipsMarcas,
  sqlChipsTipo,
  sqlMarcasAgregado,
  sqlReferenciasAgregado,
  sqlResumenDeposito,
  type ChipSql,
  type MarcaSql,
  type ReferenciaSql,
} from "@/lib/server/catalogo-sql";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

function toChips(rows: { id: string; cnt: number }[]): ChipSql[] {
  return rows.map((r) => ({ id: r.id, label: r.id, count: r.cnt }));
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

  const filtros = filtrosFromSearchParams(req.nextUrl.searchParams);
  const pool = getPool();
  const t0 = Date.now();
  const tabla = config.tabla;

  try {
    const qGen = sqlChipsGenero(tabla, filtros);
    const qMar = sqlChipsMarcas(tabla, filtros);
    const qEst = sqlChipsEstilo(tabla, filtros);
    const qTip = sqlChipsTipo(tabla, filtros);
    const qMarcasAgg = sqlMarcasAgregado(tabla, filtros);
    const qRefs = sqlReferenciasAgregado(tabla, filtros);
    const qRes = sqlResumenDeposito(tabla);

    const [generos, marcas, estilos, tipos, marcasAgg, refs, resumen] = await Promise.all([
      pool.query<{ id: string; cnt: number }>(qGen.text, qGen.params),
      pool.query<{ id: string; cnt: number }>(qMar.text, qMar.params),
      pool.query<{ id: string; cnt: number }>(qEst.text, qEst.params),
      pool.query<{ id: string; cnt: number }>(qTip.text, qTip.params),
      pool.query<MarcaSql>(qMarcasAgg.text, qMarcasAgg.params),
      pool.query<ReferenciaSql>(qRefs.text, qRefs.params),
      pool.query<{ skus: number; pares: number; ultima_carga: string }>(qRes.text, qRes.params),
    ]);

    return NextResponse.json({
      configured: true,
      cliente_id,
      ente: config.ente,
      tipo: config.tipo,
      generos: toChips(generos.rows),
      marcas: toChips(marcas.rows),
      estilos: toChips(estilos.rows),
      tipos: toChips(tipos.rows),
      marcasEntrada: marcasAgg.rows,
      referencias: refs.rows,
      resumen: resumen.rows[0] ?? { skus: 0, pares: 0, ultima_carga: null },
      ms: Date.now() - t0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error SQL filtros";
    return NextResponse.json({ configured: true, error: msg }, { status: 500 });
  }
}
