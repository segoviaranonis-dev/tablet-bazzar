import { NextRequest, NextResponse } from "next/server";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import {
  buildCadenaServer,
  filtrarParesServer,
  posicionInicialCadena,
  resolverMarcaIngreso,
} from "@/lib/server/cadena-server";
import {
  filtrosFromBody,
  filtrosToSearchParams,
  sqlFilasStock,
  sqlMarcasAgregado,
  sqlReferenciasAgregado,
  type MarcaSql,
  type ReferenciaSql,
} from "@/lib/server/catalogo-sql";
import { firmarPosIngreso, setCookiePosIngreso } from "@/lib/server/pos-sesion";
import type { DepositoFila } from "@/lib/cadena";
import { enrichDepositoFilaImagenes } from "@/lib/product-image";
import { buildCadenaWireResponse } from "@/lib/server/cadena-payload";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL no configurada" }, { status: 500 });
  }

  const cliente_id = Number((await ctx.params).cliente_id);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json({ ok: false, error: "cliente_id inválido" }, { status: 400 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const filtros = filtrosFromBody(body);
  const pool = getPool();
  const tabla = config.tabla;
  const t0 = Date.now();

  try {
    const qMarcas = sqlMarcasAgregado(tabla, filtros);
    const qRefs = sqlReferenciasAgregado(tabla, filtros);
    const [marcasR, refsR] = await Promise.all([
      pool.query<MarcaSql>(qMarcas.text, qMarcas.params),
      pool.query<ReferenciaSql>(qRefs.text, qRefs.params),
    ]);

    const dest = resolverMarcaIngreso(filtros, marcasR.rows, refsR.rows);
    if (!dest) {
      return NextResponse.json(
        { ok: false, error: "Elegí una marca o acotá la búsqueda" },
        { status: 400 },
      );
    }

    filtros.marcaCadena = dest.marca;
    if (dest.refKey) {
      filtros.referenciaKeys = [dest.refKey];
    }

    const qFilas = sqlFilasStock(tabla, filtros);
    const filasR = await pool.query<DepositoFila>(qFilas.text, qFilas.params);
    const rows = filasR.rows.map(enrichDepositoFilaImagenes);
    const paresAll = buildCadenaServer(rows, dest.marca);
    const pares = filtrarParesServer(paresAll, filtros);
    const paresNav = pares.length > 0 ? pares : paresAll;
    const posicion = posicionInicialCadena(paresNav, {
      refKey: dest.refKey,
      buscar: filtros.buscar,
    });

    const vistaParams = filtrosToSearchParams({ ...filtros, marcaCadena: dest.marca });
    vistaParams.set("cliente_id", String(cliente_id));
    const vistaUrl = `/cadena/vista?${vistaParams.toString()}`;
    const wire = buildCadenaWireResponse(paresAll, pares);

    const token = await firmarPosIngreso({
      cliente_id,
      marca: dest.marca,
      ingresado_at: new Date().toISOString(),
    });

    const response = NextResponse.json({
      ok: true,
      vistaUrl,
      marca: dest.marca,
      posicion,
      ...wire,
      stats: {
        filas: rows.length,
        pares: paresNav.length,
      },
      ms: Date.now() - t0,
    });

    setCookiePosIngreso(response, token);
    return response;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error ingreso POS";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
