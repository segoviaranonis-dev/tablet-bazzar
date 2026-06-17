import type { Pool } from "pg";

/** Clave par L+R — FK si existen; si no, códigos proveedor (retail sin FK linea/ref). */
export type ParStockQuery = {
  linea_id: number | null;
  referencia_id: number | null;
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
};

export function hasParFk(p: ParStockQuery): boolean {
  return p.linea_id != null && p.referencia_id != null;
}

function parWhereSql(p: ParStockQuery, startIdx: number): { sql: string; params: unknown[] } {
  const linea = p.linea_codigo_proveedor.trim();
  const ref = p.referencia_codigo_proveedor.trim();
  if (hasParFk(p)) {
    return {
      sql: `(linea_id = $${startIdx} AND referencia_id = $${startIdx + 1})`,
      params: [p.linea_id, p.referencia_id],
    };
  }
  return {
    sql: `(trim(linea_codigo_proveedor::text) = $${startIdx} AND trim(referencia_codigo_proveedor::text) = $${startIdx + 1})`,
    params: [linea, ref],
  };
}

/** Stock por grada agregado en par L+R (todos colores/materiales) — cuadra con INGRESAR «214 p». */
export async function queryParGradaEnTabla(
  pool: Pool,
  tabla: string,
  par: ParStockQuery,
): Promise<Map<string, number>> {
  const w = parWhereSql(par, 1);
  const { rows } = await pool.query<{ grada: string; cantidad: string }>(
    `
    SELECT btrim(grada::text) AS grada, SUM(cantidad::float8)::float8 AS cantidad
    FROM public.${tabla}
    WHERE cantidad > 0
      AND grada IS NOT NULL AND btrim(grada::text) <> ''
      AND ${w.sql}
    GROUP BY btrim(grada::text)
    `,
    w.params,
  );
  const merged = new Map<string, number>();
  for (const r of rows) {
    merged.set(r.grada, (merged.get(r.grada) ?? 0) + (Number(r.cantidad) || 0));
  }
  return merged;
}

export async function queryParTotalEnTabla(
  pool: Pool,
  tabla: string,
  par: ParStockQuery,
): Promise<number> {
  const w = parWhereSql(par, 1);
  const { rows } = await pool.query<{ cantidad: string }>(
    `
    SELECT COALESCE(SUM(cantidad::float8), 0)::float8 AS cantidad
    FROM public.${tabla}
    WHERE cantidad > 0 AND ${w.sql}
    `,
    w.params,
  );
  return Number(rows[0]?.cantidad) || 0;
}
