/**
 * SQL filtros depósito — cascada paridad RIMEC Web · JOIN pilares en lectura.
 */
import type { DepositoFilterState } from "@/lib/deposito-filters";
import {
  PILAR_TRIANGULO_JOINS,
  SQL_ESTILO_LABEL,
  SQL_GENERO_ID,
  SQL_GENERO_LABEL,
  SQL_GRUPO_ESTILO_ID,
  SQL_MARCA_ID,
  SQL_MARCA_LABEL,
  SQL_TIPO_1_ID,
} from "@/lib/server/pilar-triangulo";

export type DepositoFilterItem = { id: number; label: string; count: number };

type WhereBuild = { sql: string; params: unknown[] };

function fromClause(tabla: string): string {
  return `
    FROM public.${tabla} s
    ${PILAR_TRIANGULO_JOINS}
    LEFT JOIN public.material mat ON mat.id = s.material_id
    LEFT JOIN public.color col ON col.id = s.color_id
    LEFT JOIN public.marca_v2 mv ON mv.id_marca = ${SQL_MARCA_ID}
    LEFT JOIN public.genero g ON g.id = ${SQL_GENERO_ID}
    LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = ${SQL_GRUPO_ESTILO_ID}
    LEFT JOIN public.tipo_v2 tv ON tv.id_tipo = s.tipo_v2_id
    LEFT JOIN public.tipo_1 t1 ON t1.id_tipo_1 = ${SQL_TIPO_1_ID}
  `;
}

const SKU_BASE = `
  s.cantidad > 0
  AND btrim(s.linea_codigo_proveedor::text) <> ''
  AND btrim(s.referencia_codigo_proveedor::text) <> ''
  AND s.material_id IS NOT NULL
  AND s.color_id IS NOT NULL
`;

type ExcluirDim =
  | "genero"
  | "marca"
  | "estilo"
  | "tipo1"
  | "linea"
  | "color"
  | "q"
  | null;

function buildWhere(f: DepositoFilterState, excluir: ExcluirDim): WhereBuild {
  const w: WhereBuild = { sql: SKU_BASE, params: [] };

  if (excluir !== "genero" && f.generoId) {
    w.params.push(Number(f.generoId));
    w.sql += ` AND ${SQL_GENERO_ID} = $${w.params.length}`;
  }
  if (excluir !== "marca" && f.marcaId) {
    w.params.push(Number(f.marcaId));
    w.sql += ` AND ${SQL_MARCA_ID} = $${w.params.length}`;
  }
  if (excluir !== "estilo" && f.grupoEstiloId) {
    w.params.push(Number(f.grupoEstiloId));
    w.sql += ` AND ${SQL_GRUPO_ESTILO_ID} = $${w.params.length}`;
  }
  if (excluir !== "tipo1" && f.tipo1Ids.length) {
    w.params.push(f.tipo1Ids);
    w.sql += ` AND ${SQL_TIPO_1_ID} = ANY($${w.params.length}::int[])`;
  }
  if (excluir !== "linea" && f.lineaIds.length) {
    w.params.push(f.lineaIds);
    w.sql += ` AND COALESCE(l.id, s.linea_id) = ANY($${w.params.length}::int[])`;
  }
  if (excluir !== "color" && f.colorIds.length) {
    w.params.push(f.colorIds);
    w.sql += ` AND s.color_id = ANY($${w.params.length}::int[])`;
  }
  if (excluir !== "q" && f.q.trim()) {
    w.params.push(`%${f.q.trim()}%`);
    const p = `$${w.params.length}`;
    w.sql += ` AND (
      trim(s.linea_codigo_proveedor::text) ILIKE ${p}
      OR trim(s.referencia_codigo_proveedor::text) ILIKE ${p}
      OR (trim(s.linea_codigo_proveedor::text) || '.' || trim(s.referencia_codigo_proveedor::text)) ILIKE ${p}
      OR COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '') ILIKE ${p}
      OR COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '') ILIKE ${p}
      OR COALESCE(NULLIF(btrim(mat.descripcion::text), ''), '') ILIKE ${p}
      OR COALESCE(NULLIF(btrim(col.nombre::text), ''), '') ILIKE ${p}
    )`;
  }

  return w;
}

export function sqlDepositoChipsGenero(
  tabla: string,
  f: DepositoFilterState,
): { text: string; params: unknown[] } {
  const w = buildWhere(f, "genero");
  return {
    text: `
      SELECT ${SQL_GENERO_ID}::int AS id,
        COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') AS label,
        COUNT(*)::int AS count
      ${fromClause(tabla)}
      WHERE ${w.sql} AND ${SQL_GENERO_ID} IS NOT NULL
      GROUP BY 1, 2 ORDER BY 2
    `,
    params: w.params,
  };
}

export function sqlDepositoChipsMarca(
  tabla: string,
  f: DepositoFilterState,
): { text: string; params: unknown[] } {
  const w = buildWhere(f, "marca");
  return {
    text: `
      SELECT ${SQL_MARCA_ID}::int AS id,
        ${SQL_MARCA_LABEL} AS label,
        COUNT(*)::int AS count
      ${fromClause(tabla)}
      WHERE ${w.sql} AND ${SQL_MARCA_ID} IS NOT NULL
      GROUP BY 1, 2 ORDER BY 2
    `,
    params: w.params,
  };
}

export function sqlDepositoChipsEstilo(
  tabla: string,
  f: DepositoFilterState,
): { text: string; params: unknown[] } {
  const w = buildWhere(f, "estilo");
  return {
    text: `
      SELECT ${SQL_GRUPO_ESTILO_ID}::int AS id,
        ${SQL_ESTILO_LABEL} AS label,
        COUNT(*)::int AS count
      ${fromClause(tabla)}
      WHERE ${w.sql}
        AND ${SQL_GRUPO_ESTILO_ID} IS NOT NULL
        AND ${SQL_ESTILO_LABEL} <> '(sin estilo)'
      GROUP BY 1, 2 ORDER BY 2
    `,
    params: w.params,
  };
}

export function sqlDepositoChipsTipo1(
  tabla: string,
  f: DepositoFilterState,
): { text: string; params: unknown[] } {
  const w = buildWhere(f, "tipo1");
  return {
    text: `
      SELECT ${SQL_TIPO_1_ID}::int AS id,
        COALESCE(NULLIF(btrim(t1.descp_tipo_1::text), ''), 'Tipo ' || ${SQL_TIPO_1_ID}::text) AS label,
        COUNT(*)::int AS count
      ${fromClause(tabla)}
      WHERE ${w.sql} AND ${SQL_TIPO_1_ID} IS NOT NULL
      GROUP BY 1, 2 ORDER BY 2
    `,
    params: w.params,
  };
}

export function sqlDepositoChipsLinea(
  tabla: string,
  f: DepositoFilterState,
): { text: string; params: unknown[] } {
  const w = buildWhere(f, "linea");
  return {
    text: `
      SELECT COALESCE(l.id, s.linea_id)::int AS id,
        COALESCE(
          NULLIF(btrim(l.codigo_proveedor::text), ''),
          trim(s.linea_codigo_proveedor::text)
        ) AS label,
        COUNT(*)::int AS count
      ${fromClause(tabla)}
      WHERE ${w.sql} AND COALESCE(l.id, s.linea_id) IS NOT NULL
      GROUP BY 1, 2
      ORDER BY NULLIF(
        COALESCE(NULLIF(btrim(l.codigo_proveedor::text), ''), trim(s.linea_codigo_proveedor::text)),
        ''
      )::bigint NULLS LAST,
      2
      LIMIT 400
    `,
    params: w.params,
  };
}

export function sqlDepositoChipsColor(
  tabla: string,
  f: DepositoFilterState,
): { text: string; params: unknown[] } {
  const w = buildWhere(f, "color");
  return {
    text: `
      SELECT s.color_id::int AS id,
        COALESCE(NULLIF(btrim(col.nombre::text), ''), trim(s.excel_color_code::text), 'Color ' || s.color_id::text) AS label,
        COUNT(*)::int AS count
      ${fromClause(tabla)}
      WHERE ${w.sql} AND s.color_id IS NOT NULL
      GROUP BY 1, 2 ORDER BY 2
      LIMIT 200
    `,
    params: w.params,
  };
}

export function sqlDepositoMolecules(
  tabla: string,
  f: DepositoFilterState,
  limit: number | null,
): { text: string; params: unknown[] } {
  const w = buildWhere(f, null);
  const limitClause = limit != null && limit > 0 ? `WHERE rank_por_marca <= ${limit}` : "";
  return {
    text: `
    WITH sku_rows AS (
      SELECT
        s.linea_id,
        s.referencia_id,
        s.material_id,
        s.color_id,
        trim(s.linea_codigo_proveedor::text) AS linea_codigo_proveedor,
        trim(s.referencia_codigo_proveedor::text) AS referencia_codigo_proveedor,
        COALESCE(
          NULLIF(btrim(s.excel_material_code::text), ''),
          CASE WHEN mat.id IS NULL OR mat.codigo_proveedor = -999001::bigint THEN NULL
               ELSE trim(mat.codigo_proveedor::text) END, ''
        ) AS material_code,
        COALESCE(
          NULLIF(btrim(s.excel_color_code::text), ''),
          CASE WHEN col.id IS NULL OR col.codigo_proveedor = -999001::bigint THEN NULL
               ELSE trim(col.codigo_proveedor::text) END, ''
        ) AS color_code,
        s.cantidad::float8 AS cantidad,
        ${SQL_MARCA_LABEL} AS marca,
        ${SQL_MARCA_ID} AS marca_id,
        ${SQL_GENERO_LABEL} AS genero,
        ${SQL_ESTILO_LABEL} AS estilo,
        COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS tipo_v2,
        NULLIF(btrim(mat.descripcion::text), '') AS descp_material,
        NULLIF(btrim(col.nombre::text), '') AS descp_color,
        NULLIF(btrim(s.imagen_nombre::text), '') AS imagen_nombre
      ${fromClause(tabla)}
      WHERE ${w.sql}
    ),
    molecule_agg AS (
      SELECT
        MAX(linea_id) AS linea_id,
        MAX(referencia_id) AS referencia_id,
        material_id,
        color_id,
        linea_codigo_proveedor,
        referencia_codigo_proveedor,
        MAX(material_code) AS material_code,
        MAX(color_code) AS color_code,
        MAX(marca) AS marca,
        MAX(marca_id) AS marca_id,
        MAX(genero) AS genero,
        MAX(estilo) AS estilo,
        MAX(tipo_v2) AS tipo_v2,
        MAX(descp_material) AS descp_material,
        MAX(descp_color) AS descp_color,
        SUM(cantidad) AS cantidad_local,
        MAX(imagen_nombre) AS imagen_nombre
      FROM sku_rows
      GROUP BY linea_codigo_proveedor, referencia_codigo_proveedor, material_id, color_id
    ),
    ranked_molecules AS (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY marca ORDER BY cantidad_local DESC) AS rank_por_marca
      FROM molecule_agg
    )
    SELECT
      linea_id, referencia_id, material_id, color_id,
      linea_codigo_proveedor, referencia_codigo_proveedor,
      material_code, color_code, marca, genero, estilo, tipo_v2,
      descp_material, descp_color, cantidad_local, imagen_nombre
    FROM ranked_molecules
    ${limitClause}
    ORDER BY marca, cantidad_local DESC
    `,
    params: w.params,
  };
}
