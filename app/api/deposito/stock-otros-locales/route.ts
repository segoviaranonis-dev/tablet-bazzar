import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import {
  buildStockBloques,
  emptyUbicaciones,
  type StockMoleculaQuery,
  type StockOtrosLocalesResponse,
} from "@/lib/stock-otros-locales";
import { UBICACIONES, ubicacionIdFromClienteId } from "@/lib/ubicaciones";

function parseIntParam(v: string | null): number | null {
  if (!v?.trim()) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function hasFk(q: StockMoleculaQuery): boolean {
  return (
    q.linea_id != null &&
    q.referencia_id != null &&
    q.material_id != null &&
    q.color_id != null
  );
}

async function queryTablaGrada(
  tabla: string,
  q: StockMoleculaQuery,
): Promise<{ grada: string; cantidad: number }[]> {
  const pool = getPool();

  if (hasFk(q)) {
    const { rows } = await pool.query<{ grada: string; cantidad: string }>(
      `
      SELECT btrim(grada::text) AS grada, SUM(cantidad::float8)::text AS cantidad
      FROM public.${tabla}
      WHERE linea_id = $1
        AND referencia_id = $2
        AND material_id = $3
        AND color_id = $4
        AND cantidad > 0
        AND grada IS NOT NULL
        AND btrim(grada::text) <> ''
      GROUP BY btrim(grada::text)
      `,
      [q.linea_id, q.referencia_id, q.material_id, q.color_id],
    );
    return rows.map((r) => ({ grada: r.grada, cantidad: Number(r.cantidad) || 0 }));
  }

  const { rows } = await pool.query<{ grada: string; cantidad: string }>(
    `
    SELECT btrim(grada::text) AS grada, SUM(cantidad::float8)::text AS cantidad
    FROM public.${tabla}
    WHERE trim(linea_codigo_proveedor::text) = $1
      AND trim(referencia_codigo_proveedor::text) = $2
      AND trim(COALESCE(excel_material_code::text, '')) = $3
      AND trim(COALESCE(excel_color_code::text, '')) = $4
      AND cantidad > 0
      AND grada IS NOT NULL
      AND btrim(grada::text) <> ''
    GROUP BY btrim(grada::text)
    `,
    [
      q.linea_codigo_proveedor.trim(),
      q.referencia_codigo_proveedor.trim(),
      q.material_code.trim(),
      q.color_code.trim(),
    ],
  );
  return rows.map((r) => ({ grada: r.grada, cantidad: Number(r.cantidad) || 0 }));
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

  const q: StockMoleculaQuery = {
    linea_id: parseIntParam(sp.get("linea_id")),
    referencia_id: parseIntParam(sp.get("referencia_id")),
    material_id: parseIntParam(sp.get("material_id")),
    color_id: parseIntParam(sp.get("color_id")),
    linea_codigo_proveedor: sp.get("linea") ?? "",
    referencia_codigo_proveedor: sp.get("referencia") ?? "",
    material_code: sp.get("material") ?? "",
    color_code: sp.get("color") ?? "",
  };

  if (!q.linea_codigo_proveedor.trim() && q.linea_id == null) {
    return NextResponse.json(
      { configured: true, ubicaciones: [], error: "molécula incompleta" } satisfies StockOtrosLocalesResponse,
      { status: 400 },
    );
  }

  const ubicacionActualId = ubicacionIdFromClienteId(cliente_id);

  try {
    const gradasPorUb = new Map<string, Map<string, number>>();

    for (const ub of UBICACIONES) {
      const merged = new Map<string, number>();
      for (const dep of ub.depositos) {
        const part = await queryTablaGrada(dep.tabla, q);
        for (const p of part) {
          merged.set(p.grada, (merged.get(p.grada) ?? 0) + p.cantidad);
        }
      }
      gradasPorUb.set(ub.id, merged);
    }

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
