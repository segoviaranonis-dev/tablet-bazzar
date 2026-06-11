import { NextRequest, NextResponse } from "next/server";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { buildStockBloques, emptyUbicaciones } from "@/lib/stock-otros-locales";
import { UBICACIONES, ubicacionIdFromClienteId } from "@/lib/ubicaciones";
import { sqlCantidadMolecula } from "@/lib/server/catalogo-sql";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

async function queryUbicacionGrada(
  pool: ReturnType<typeof getPool>,
  tablas: string[],
  fk: { linea_id: number; referencia_id: number; material_id: number; color_id: number },
): Promise<Map<string, number>> {
  const merged = new Map<string, number>();
  const sql = `
    SELECT btrim(grada::text) AS grada, SUM(cantidad::float8)::float8 AS cantidad
    FROM public.__TABLA__
    WHERE cantidad > 0
      AND linea_id = $1 AND referencia_id = $2 AND material_id = $3 AND color_id = $4
      AND grada IS NOT NULL AND btrim(grada::text) <> ''
    GROUP BY btrim(grada::text)
  `;
  const params = [fk.linea_id, fk.referencia_id, fk.material_id, fk.color_id];
  const results = await Promise.all(
    tablas.map((tabla) =>
      pool.query<{ grada: string; cantidad: string }>(sql.replace("__TABLA__", tabla), params),
    ),
  );
  for (const { rows } of results) {
    for (const r of rows) {
      merged.set(r.grada, (merged.get(r.grada) ?? 0) + (Number(r.cantidad) || 0));
    }
  }
  return merged;
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

  const sp = req.nextUrl.searchParams;
  const linea_id = Number(sp.get("linea_id"));
  const referencia_id = Number(sp.get("referencia_id"));
  const material_id = Number(sp.get("material_id"));
  const color_id = Number(sp.get("color_id"));
  const grada = sp.get("grada");

  if (![linea_id, referencia_id, material_id, color_id].every(Number.isFinite)) {
    return NextResponse.json({ configured: true, error: "FK molécula incompletas" }, { status: 400 });
  }

  const pool = getPool();
  const ubicacionActualId = ubicacionIdFromClienteId(cliente_id);
  const t0 = Date.now();

  try {
    const qLocal = sqlCantidadMolecula(config.tabla, {
      linea_id,
      referencia_id,
      material_id,
      color_id,
      grada,
    });
    const localR = await pool.query<{ cantidad: number }>(qLocal.text, qLocal.params);
    const cantidad_local = Number(localR.rows[0]?.cantidad) || 0;

    const gradasPorUb = new Map<string, Map<string, number>>();
    await Promise.all(
      UBICACIONES.map(async (ub) => {
        const tablas = ub.depositos.map((d) => d.tabla);
        const gm = await queryUbicacionGrada(pool, tablas, {
          linea_id,
          referencia_id,
          material_id,
          color_id,
        });
        gradasPorUb.set(ub.id, gm);
      }),
    );

    const ubicaciones = buildStockBloques(gradasPorUb, ubicacionActualId);

    return NextResponse.json({
      configured: true,
      server_time: new Date().toISOString(),
      cantidad_local,
      ubicaciones,
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
