import type { Pool } from "pg";
import { buildStockBloques, type StockUbicacionBloque } from "@/lib/stock-otros-locales";
import {
  cohortePorUbicacion,
  hasMoleculeCodigo,
  hasMoleculeFk,
  moleculeKey,
  type MoleculeFk,
} from "@/lib/deposito-cohorte";
import type { UbicacionId } from "@/lib/ubicaciones";

type GradaHit = { molKey: string; grada: string; cantidad: number };

async function queryTablaFkBatch(pool: Pool, tabla: string, molecules: MoleculeFk[]): Promise<GradaHit[]> {
  const fkMols = molecules.filter(hasMoleculeFk);
  if (fkMols.length === 0) return [];

  const lineaIds = fkMols.map((m) => m.linea_id!);
  const refIds = fkMols.map((m) => m.referencia_id!);
  const matIds = fkMols.map((m) => m.material_id!);
  const colIds = fkMols.map((m) => m.color_id!);

  const { rows } = await pool.query<{
    linea_id: string;
    referencia_id: string;
    material_id: string;
    color_id: string;
    grada: string;
    cantidad: string;
  }>(
    `
    WITH molecules AS (
      SELECT * FROM unnest($1::bigint[], $2::bigint[], $3::bigint[], $4::bigint[])
        AS t(linea_id, referencia_id, material_id, color_id)
    )
    SELECT
      s.linea_id::text,
      s.referencia_id::text,
      s.material_id::text,
      s.color_id::text,
      btrim(s.grada::text) AS grada,
      SUM(s.cantidad::float8)::text AS cantidad
    FROM public.${tabla} s
    INNER JOIN molecules m
      ON s.linea_id = m.linea_id
     AND s.referencia_id = m.referencia_id
     AND s.material_id = m.material_id
     AND s.color_id = m.color_id
    WHERE s.cantidad > 0
      AND s.grada IS NOT NULL
      AND btrim(s.grada::text) <> ''
    GROUP BY s.linea_id, s.referencia_id, s.material_id, s.color_id, btrim(s.grada::text)
    `,
    [lineaIds, refIds, matIds, colIds],
  );

  return rows.map((r) => ({
    molKey: moleculeKey({
      linea_id: Number(r.linea_id),
      referencia_id: Number(r.referencia_id),
      material_id: Number(r.material_id),
      color_id: Number(r.color_id),
      linea_codigo_proveedor: "",
      referencia_codigo_proveedor: "",
      material_code: "",
      color_code: "",
    }),
    grada: r.grada,
    cantidad: Number(r.cantidad) || 0,
  }));
}

async function queryTablaCodigoBatch(
  pool: Pool,
  tabla: string,
  molecules: MoleculeFk[],
): Promise<GradaHit[]> {
  const codMols = molecules.filter(hasMoleculeCodigo);
  if (codMols.length === 0) return [];

  const lineas = codMols.map((m) => m.linea_codigo_proveedor.trim());
  const refs = codMols.map((m) => m.referencia_codigo_proveedor.trim());
  const matIds = codMols.map((m) => Number(m.material_id));
  const colIds = codMols.map((m) => Number(m.color_id));

  const { rows } = await pool.query<{
    linea: string;
    referencia: string;
    material_id: string;
    color_id: string;
    grada: string;
    cantidad: string;
  }>(
    `
    WITH molecules AS (
      SELECT * FROM unnest($1::text[], $2::text[], $3::bigint[], $4::bigint[])
        AS t(linea, referencia, material_id, color_id)
    )
    SELECT
      trim(s.linea_codigo_proveedor::text) AS linea,
      trim(s.referencia_codigo_proveedor::text) AS referencia,
      s.material_id::text,
      s.color_id::text,
      btrim(s.grada::text) AS grada,
      SUM(s.cantidad::float8)::text AS cantidad
    FROM public.${tabla} s
    INNER JOIN molecules m
      ON trim(s.linea_codigo_proveedor::text) = m.linea
     AND trim(s.referencia_codigo_proveedor::text) = m.referencia
     AND s.material_id = m.material_id
     AND s.color_id = m.color_id
    WHERE s.cantidad > 0
      AND s.grada IS NOT NULL
      AND btrim(s.grada::text) <> ''
    GROUP BY 1, 2, s.material_id, s.color_id, btrim(s.grada::text)
    `,
    [lineas, refs, matIds, colIds],
  );

  return rows.map((r) => ({
    molKey: moleculeKey({
      linea_id: null,
      referencia_id: null,
      material_id: Number(r.material_id),
      color_id: Number(r.color_id),
      linea_codigo_proveedor: r.linea,
      referencia_codigo_proveedor: r.referencia,
      material_code: "",
      color_code: "",
    }),
    grada: r.grada,
    cantidad: Number(r.cantidad) || 0,
  }));
}

async function queryTablaGradaBatch(
  pool: Pool,
  tabla: string,
  molecules: MoleculeFk[],
): Promise<GradaHit[]> {
  const [fkRows, codRows] = await Promise.all([
    queryTablaFkBatch(pool, tabla, molecules),
    queryTablaCodigoBatch(pool, tabla, molecules),
  ]);
  return [...fkRows, ...codRows];
}

/**
 * Stock por grada en las 3 ubicaciones de la cohorte (Adultos o Niños).
 * Una query por tabla — sin N+1 por card.
 */
export async function fetchStockRedBatch(
  pool: Pool,
  clienteId: number,
  molecules: MoleculeFk[],
  ubicacionActualId: UbicacionId | null,
): Promise<Map<string, StockUbicacionBloque[]>> {
  const out = new Map<string, StockUbicacionBloque[]>();
  if (molecules.length === 0) return out;

  const gradasPorMolUb = new Map<string, Map<string, Map<string, number>>>();
  for (const mol of molecules) {
    gradasPorMolUb.set(moleculeKey(mol), new Map());
  }

  const cohorte = cohortePorUbicacion(clienteId);

  await Promise.all(
    [...cohorte.entries()].map(async ([ubId, dep]) => {
      const rows = await queryTablaGradaBatch(pool, dep.tabla, molecules);
      for (const r of rows) {
        let byUb = gradasPorMolUb.get(r.molKey);
        if (!byUb) {
          byUb = new Map();
          gradasPorMolUb.set(r.molKey, byUb);
        }
        let gm = byUb.get(ubId);
        if (!gm) {
          gm = new Map();
          byUb.set(ubId, gm);
        }
        gm.set(r.grada, (gm.get(r.grada) ?? 0) + r.cantidad);
      }
    }),
  );

  for (const [mk, byUb] of gradasPorMolUb) {
    out.set(mk, buildStockBloques(byUb, ubicacionActualId));
  }

  return out;
}
