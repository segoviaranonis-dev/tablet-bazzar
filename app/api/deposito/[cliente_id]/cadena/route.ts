import { NextRequest, NextResponse } from "next/server";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import {
  buildCadenaServer,
  filtrarParesServer,
  posicionInicialCadena,
} from "@/lib/server/cadena-server";
import { cookiePosIngreso } from "@/lib/server/pos-sesion";
import { filtrosFromSearchParams, sqlFilasStock } from "@/lib/server/catalogo-sql";
import type { DepositoFila } from "@/lib/cadena";

type RouteCtx = { params: Promise<{ cliente_id: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, error: "DATABASE_URL no configurada" }, { status: 500 });
  }

  const cliente_id = Number((await ctx.params).cliente_id);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json({ configured: true, error: "cliente_id inválido" }, { status: 400 });
  }

  const ingreso = await cookiePosIngreso(req);
  const filtros = filtrosFromSearchParams(req.nextUrl.searchParams);
  const marca = filtros.marcaCadena ?? ingreso?.marca;

  if (!marca) {
    return NextResponse.json(
      { configured: true, error: "marca requerida — ingresá desde /cadena" },
      { status: 400 },
    );
  }

  if (ingreso && ingreso.cliente_id !== cliente_id) {
    return NextResponse.json({ configured: true, error: "sesión POS otro depósito" }, { status: 403 });
  }

  filtros.marcaCadena = marca;
  const pool = getPool();
  const t0 = Date.now();

  try {
    const q = sqlFilasStock(config.tabla, filtros);
    const { rows } = await pool.query<DepositoFila>(q.text, q.params);
    const paresAll = buildCadenaServer(rows, marca);
    const pares = filtrarParesServer(paresAll, filtros);
    const paresNav = pares.length > 0 ? pares : paresAll;
    const posicion = posicionInicialCadena(paresNav, {
      refKey: filtros.referenciaKeys[0],
      buscar: filtros.buscar,
    });

    return NextResponse.json({
      configured: true,
      cliente_id,
      marca,
      pares,
      paresAll,
      posicion,
      totalFilas: rows.length,
      ingreso: ingreso?.ingresado_at ?? null,
      ms: Date.now() - t0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error cadena SQL";
    return NextResponse.json({ configured: true, error: msg }, { status: 500 });
  }
}
