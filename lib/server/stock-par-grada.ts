import type { MoleculeFk } from "@/lib/deposito-cohorte";
import { hasMoleculeCodigo, hasMoleculeFk } from "@/lib/deposito-cohorte";
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

function hasMoleculeExcelCodes(m: MoleculeFk): boolean {
  return (
    m.linea_codigo_proveedor.trim() !== "" &&
    m.referencia_codigo_proveedor.trim() !== "" &&
    m.material_code.trim() !== "" &&
    m.color_code.trim() !== ""
  );
}

/** Stock por grada — molécula L+R+material+color (códigos+ids primero: FK NULL en otras tiendas). */
export async function queryMoleculeGradaEnTabla(
  pool: Pool,
  tabla: string,
  mol: MoleculeFk,
): Promise<Map<string, number>> {
  const merged = new Map<string, number>();

  if (hasMoleculeCodigo(mol)) {
    const { rows } = await pool.query<{ grada: string; cantidad: string }>(
      `
      SELECT btrim(grada::text) AS grada, SUM(cantidad::float8)::float8 AS cantidad
      FROM public.${tabla}
      WHERE cantidad > 0
        AND grada IS NOT NULL AND btrim(grada::text) <> ''
        AND trim(linea_codigo_proveedor::text) = $1
        AND trim(referencia_codigo_proveedor::text) = $2
        AND material_id = $3 AND color_id = $4
      GROUP BY btrim(grada::text)
      `,
      [
        mol.linea_codigo_proveedor.trim(),
        mol.referencia_codigo_proveedor.trim(),
        mol.material_id,
        mol.color_id,
      ],
    );
    for (const r of rows) merged.set(r.grada, Number(r.cantidad) || 0);
    return merged;
  }

  if (hasMoleculeFk(mol)) {
    const { rows } = await pool.query<{ grada: string; cantidad: string }>(
      `
      SELECT btrim(grada::text) AS grada, SUM(cantidad::float8)::float8 AS cantidad
      FROM public.${tabla}
      WHERE cantidad > 0
        AND grada IS NOT NULL AND btrim(grada::text) <> ''
        AND linea_id = $1 AND referencia_id = $2
        AND material_id = $3 AND color_id = $4
      GROUP BY btrim(grada::text)
      `,
      [mol.linea_id, mol.referencia_id, mol.material_id, mol.color_id],
    );
    for (const r of rows) merged.set(r.grada, Number(r.cantidad) || 0);
    return merged;
  }

  if (hasMoleculeExcelCodes(mol)) {
    const { rows } = await pool.query<{ grada: string; cantidad: string }>(
      `
      SELECT btrim(grada::text) AS grada, SUM(cantidad::float8)::float8 AS cantidad
      FROM public.${tabla}
      WHERE cantidad > 0
        AND grada IS NOT NULL AND btrim(grada::text) <> ''
        AND trim(linea_codigo_proveedor::text) = $1
        AND trim(referencia_codigo_proveedor::text) = $2
        AND trim(COALESCE(excel_material_code::text, '')) = $3
        AND trim(COALESCE(excel_color_code::text, '')) = $4
      GROUP BY btrim(grada::text)
      `,
      [
        mol.linea_codigo_proveedor.trim(),
        mol.referencia_codigo_proveedor.trim(),
        mol.material_code.trim(),
        mol.color_code.trim(),
      ],
    );
    for (const r of rows) merged.set(r.grada, Number(r.cantidad) || 0);
  }

  return merged;
}

export async function queryMoleculeTotalEnTabla(
  pool: Pool,
  tabla: string,
  mol: MoleculeFk,
): Promise<number> {
  const gm = await queryMoleculeGradaEnTabla(pool, tabla, mol);
  let total = 0;
  for (const n of gm.values()) total += n;
  return total;
}

export function moleculeFromSearchParams(
  sp: URLSearchParams,
  parFallback?: { linea: string; referencia: string },
): MoleculeFk | null {
  const parseIntParam = (v: string | null): number | null => {
    if (!v?.trim()) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const linea = (sp.get("linea") ?? sp.get("linea_codigo") ?? parFallback?.linea ?? "").trim();
  const referencia = (
    sp.get("referencia") ??
    sp.get("referencia_codigo") ??
    parFallback?.referencia ??
    ""
  ).trim();

  const mol: MoleculeFk = {
    linea_id: parseIntParam(sp.get("linea_id")),
    referencia_id: parseIntParam(sp.get("referencia_id")),
    material_id: parseIntParam(sp.get("material_id")),
    color_id: parseIntParam(sp.get("color_id")),
    linea_codigo_proveedor: linea,
    referencia_codigo_proveedor: referencia,
    material_code: (sp.get("material") ?? sp.get("material_code") ?? "").trim(),
    color_code: (sp.get("color") ?? sp.get("color_code") ?? "").trim(),
  };

  if (hasMoleculeFk(mol) || hasMoleculeCodigo(mol) || hasMoleculeExcelCodes(mol)) return mol;
  return null;
}
