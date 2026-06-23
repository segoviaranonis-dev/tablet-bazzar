import { NextRequest, NextResponse } from "next/server";
import { cohortePorUbicacion } from "@/lib/deposito-cohorte";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { moleculeFromSearchParams, queryMoleculeGradaEnTabla } from "@/lib/server/stock-par-grada";
import {
  buildStockBloques,
  emptyUbicaciones,
  type StockOtrosLocalesResponse,
} from "@/lib/stock-otros-locales";
import { UBICACIONES, ubicacionIdFromClienteId } from "@/lib/ubicaciones";

function parseIntParam(v: string | null): number | null {
  if (!v?.trim()) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const cliente_id = parseIntParam(sp.get("cliente_id"));

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      ubicaciones: emptyUbicaciones(null),
      error: "DATABASE_URL no configurada",
    } satisfies StockOtrosLocalesResponse);
  }

  if (cliente_id == null) {
    return NextResponse.json(
      { configured: true, ubicaciones: [], error: "cliente_id requerido" } satisfies StockOtrosLocalesResponse,
      { status: 400 },
    );
  }

  const molecule = moleculeFromSearchParams(sp);
  if (!molecule) {
    return NextResponse.json(
      { configured: true, ubicaciones: [], error: "molécula incompleta" } satisfies StockOtrosLocalesResponse,
      { status: 400 },
    );
  }

  const ubicacionActualId = ubicacionIdFromClienteId(cliente_id);
  const cohorte = cohortePorUbicacion(cliente_id);
  const pool = getPool();

  try {
    const gradasPorUb = new Map<string, Map<string, number>>();

    await Promise.all(
      UBICACIONES.map(async (ub) => {
        const dep = cohorte.get(ub.id);
        if (!dep) {
          gradasPorUb.set(ub.id, new Map());
          return;
        }
        const gm = await queryMoleculeGradaEnTabla(pool, dep.tabla, molecule);
        gradasPorUb.set(ub.id, gm);
      }),
    );

    const ubicaciones = buildStockBloques(gradasPorUb, ubicacionActualId);

    return NextResponse.json({
      configured: true,
      ubicaciones,
    } satisfies StockOtrosLocalesResponse);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error consultando stock";
    return NextResponse.json(
      {
        configured: true,
        ubicaciones: emptyUbicaciones(ubicacionActualId),
        error: msg,
      } satisfies StockOtrosLocalesResponse,
      { status: 500 },
    );
  }
}
