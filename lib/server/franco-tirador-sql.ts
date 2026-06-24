/**
 * Franco Tirador — SQL paridad catalogo-sql (labels + WHERE laxo + grada flexible).
 */
import type { FrancoTiradorSearchInput } from "@/lib/franco-tirador-filters";
import type { FrancoTiradorFilterState } from "@/lib/franco-tirador-filters";
import { esTipoCalzadoScope } from "@/lib/franco-tirador-filters";
import {
  PILAR_TRIANGULO_JOINS,
  SQL_ESTILO_LABEL,
  SQL_GENERO_LABEL,
  SQL_GRUPO_ESTILO_ID,
  SQL_GENERO_ID,
  SQL_MARCA_ID,
  SQL_MARCA_LABEL,
} from "@/lib/server/pilar-triangulo";
import { SQL_ORDER_LINEA_REF, SQL_SOLO_CALZADO } from "@/lib/tipo-v2-scope";

const SQL_COLOR_LABEL = `COALESCE(NULLIF(btrim(col.nombre::text), ''), '')`;

const SELECT_FRANCO = `
  SELECT
    s.linea_id,
    s.referencia_id,
    s.material_id,
    s.color_id,
    s.marca_id,
    trim(s.linea_codigo_proveedor::text) AS linea_codigo_proveedor,
    trim(s.referencia_codigo_proveedor::text) AS referencia_codigo_proveedor,
    COALESCE(
      NULLIF(btrim(s.excel_material_code::text), ''),
      CASE WHEN mat.id IS NULL OR mat.codigo_proveedor = -999001::bigint THEN NULL
           ELSE trim(mat.codigo_proveedor::text) END,
      ''
    ) AS material_code,
    COALESCE(
      NULLIF(btrim(s.excel_color_code::text), ''),
      CASE WHEN col.id IS NULL OR col.codigo_proveedor = -999001::bigint THEN NULL
           ELSE trim(col.codigo_proveedor::text) END,
      ''
    ) AS color_code,
    btrim(s.grada::text) AS grada,
    s.cantidad::float8 AS cantidad,
    ${SQL_MARCA_LABEL} AS marca,
    ${SQL_GENERO_LABEL} AS genero,
    ${SQL_ESTILO_LABEL} AS estilo,
    COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS tipo_v2,
    NULLIF(btrim(mat.descripcion::text), '') AS descp_material,
    NULLIF(btrim(col.nombre::text), '') AS descp_color,
    NULLIF(btrim(s.imagen_nombre::text), '') AS imagen_nombre
`;

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
  `;
}

/** Misma base que catalogo-sql — no excluir filas sin FK material/color. */
const SKU_BASE = `s.cantidad > 0 AND ${SQL_SOLO_CALZADO}`;

type ExcluirDim = "marca" | "estilo" | "color" | null;

type WhereBuild = { sql: string; params: unknown[] };

function appendTipo(f: FrancoTiradorFilterState, w: WhereBuild): void {
  const tipo = f.tipo.trim();
  if (!tipo) return;
  if (esTipoCalzadoScope(tipo)) {
    w.sql += ` AND (
      lower(COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)')) IN ('calzados', 'calzado', 'calz', '(sin tipo)')
      OR tv.descp_tipo IS NULL
    )`;
    return;
  }
  w.params.push(tipo);
  w.sql += ` AND lower(COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)')) = lower(btrim($${w.params.length}::text))`;
}

function buildFrancoWhere(f: FrancoTiradorFilterState, excluir: ExcluirDim): WhereBuild {
  const w: WhereBuild = { sql: SKU_BASE, params: [] };

  appendTipo(f, w);

  if (excluir !== "marca" && f.marcas.length) {
    w.params.push(f.marcas.map((m) => m.trim()).filter(Boolean));
    w.sql += ` AND ${SQL_MARCA_LABEL} = ANY($${w.params.length}::text[])`;
  }

  if (excluir !== "estilo" && f.estilos.length) {
    w.params.push(f.estilos.map((e) => e.trim()).filter(Boolean));
    w.sql += ` AND ${SQL_ESTILO_LABEL} = ANY($${w.params.length}::text[])`;
  }

  if (excluir !== "color") {
    const lista = f.colores.map((c) => c.trim()).filter(Boolean);
    const buscar = f.colorBuscar?.trim() ?? "";
    if (lista.length) {
      w.params.push(lista);
      w.sql += ` AND ${SQL_COLOR_LABEL} = ANY($${w.params.length}::text[])`;
    } else if (buscar.length >= 2) {
      w.params.push(`%${buscar}%`);
      w.sql += ` AND lower(${SQL_COLOR_LABEL}) LIKE lower($${w.params.length})`;
    }
  }

  return w;
}

/** Talla numérica — paridad formatGradaDisplay / gradas abiertas Bazzar. */
export function sqlGradaTallaMatch(paramIndex: number): string {
  return `(
    btrim(s.grada::text) = $${paramIndex}
    OR substring(btrim(s.grada::text) from '^(\\d{2,3})') = $${paramIndex}
    OR btrim(s.grada::text) ~ ('^' || $${paramIndex} || '([^0-9]|$)')
    OR btrim(s.grada::text) ~ ('[^0-9]' || $${paramIndex} || '([^0-9]|$)')
  )`;
}

export function sqlFrancoTiradorOpcionesMarcas(
  tabla: string,
  f: FrancoTiradorFilterState,
): { text: string; params: unknown[] } {
  const w = buildFrancoWhere(f, "marca");
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

export function sqlFrancoTiradorOpcionesEstilos(
  tabla: string,
  f: FrancoTiradorFilterState,
): { text: string; params: unknown[] } {
  const w = buildFrancoWhere(f, "estilo");
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

export function sqlFrancoTiradorOpcionesColores(
  tabla: string,
  f: FrancoTiradorFilterState,
): { text: string; params: unknown[] } {
  const w = buildFrancoWhere(f, "color");
  return {
    text: `
      SELECT ${SQL_COLOR_LABEL} AS label,
        COUNT(*)::int AS count
      ${fromClause(tabla)}
      WHERE ${w.sql} AND ${SQL_COLOR_LABEL} <> ''
      GROUP BY 1 ORDER BY 1
      LIMIT 400
    `,
    params: w.params,
  };
}

export function sqlFrancoTirador(
  tabla: string,
  input: FrancoTiradorSearchInput,
): { text: string; params: unknown[] } {
  const grada = input.grada?.trim() ?? "";
  const w = buildFrancoWhere(input, null);

  let whereSql = w.sql;
  if (grada) {
    w.params.push(grada);
    whereSql += ` AND ${sqlGradaTallaMatch(w.params.length)}`;
  }

  const text = `
    ${SELECT_FRANCO}
    ${fromClause(tabla)}
    WHERE ${whereSql}
    ORDER BY ${SQL_ORDER_LINEA_REF}, s.material_id, s.color_id, s.grada
    LIMIT 500
  `;

  return { text, params: w.params };
}
