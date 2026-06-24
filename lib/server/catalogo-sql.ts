/**
 * SQL titanio — catálogo POS en servidor. Tabla solo desde depositos-config (nunca user input).
 *
 * Triángulo header: JOIN pilares en lectura (marca/género ← linea, estilo ← linea_referencia).
 * Doc: Nexus_Core/.claude/3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md
 */
import type { DepositoFila } from "@/lib/cadena";
import {
  PILAR_TRIANGULO_JOINS,
  SQL_ESTILO_LABEL,
  SQL_GENERO_LABEL,
  SQL_GRUPO_ESTILO_ID,
  SQL_GENERO_ID,
  SQL_MARCA_ID,
  SQL_MARCA_LABEL,
  SQL_TIPO_1_ID,
} from "@/lib/server/pilar-triangulo";
import {
  filtrosFromSearchParams as filtrosFromSp,
  filtrosToSearchParams as filtrosToSp,
} from "@/lib/filtros-url";
import {
  SQL_ORDER_LINEA_REF,
  SQL_ORDER_LINEA_REF_ALIASES,
  SQL_SOLO_CALZADO,
} from "@/lib/tipo-v2-scope";

export type FiltrosSql = {
  generos: string[];
  marcas: string[];
  estilos: string[];
  tipos: string[];
  tipo1s: string[];
  /** linea|referencia */
  referenciaKeys: string[];
  buscar: string;
  /** Obligatorio para cadena */
  marcaCadena?: string;
};

export const FILTROS_SQL_VACIOS: FiltrosSql = {
  generos: [],
  marcas: [],
  estilos: [],
  tipos: [],
  tipo1s: [],
  referenciaKeys: [],
  buscar: "",
};

export type ChipSql = { id: string; label: string; count: number };

export type ReferenciaSql = {
  key: string;
  linea: string;
  referencia: string;
  estilo: string;
  marca: string;
  pares: number;
  skus: number;
};

export type MarcaSql = { marca: string; skus: number; pares: number };

const SELECT_CORE = `
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
    COALESCE(NULLIF(btrim(t1.descp_tipo_1::text), ''), '(sin tipo 1)') AS tipo_1,
    NULLIF(btrim(mat.descripcion::text), '') AS descp_material,
    NULLIF(btrim(col.nombre::text), '') AS descp_color,
    NULLIF(btrim(s.imagen_nombre::text), '') AS imagen_nombre,
    trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text) AS lr_key
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
    LEFT JOIN public.tipo_1 t1 ON t1.id_tipo_1 = ${SQL_TIPO_1_ID}
  `;
}

type WhereBuild = { sql: string; params: unknown[] };

function appendGenero(f: FiltrosSql, w: WhereBuild, excluir: boolean): void {
  if (excluir || f.generos.length === 0) return;
  w.params.push(f.generos);
  w.sql += ` AND COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') = ANY($${w.params.length}::text[])`;
}

function appendMarcas(f: FiltrosSql, w: WhereBuild, excluir: boolean): void {
  if (excluir || f.marcas.length === 0) return;
  w.params.push(f.marcas);
  w.sql += ` AND COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') = ANY($${w.params.length}::text[])`;
}

function appendEstilos(f: FiltrosSql, w: WhereBuild, excluir: boolean): void {
  if (excluir || f.estilos.length === 0) return;
  w.params.push(f.estilos);
  w.sql += ` AND COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '(sin estilo)') = ANY($${w.params.length}::text[])`;
}

function appendTipos(f: FiltrosSql, w: WhereBuild, excluir: boolean): void {
  if (excluir || f.tipos.length === 0) return;
  w.params.push(f.tipos);
  w.sql += ` AND COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') = ANY($${w.params.length}::text[])`;
}

function appendTipo1(f: FiltrosSql, w: WhereBuild, excluir: boolean): void {
  if (excluir || f.tipo1s.length === 0) return;
  w.params.push(f.tipo1s);
  w.sql += ` AND COALESCE(NULLIF(btrim(t1.descp_tipo_1::text), ''), '(sin tipo 1)') = ANY($${w.params.length}::text[])`;
}

function appendRefs(f: FiltrosSql, w: WhereBuild, excluir: boolean): void {
  if (excluir || f.referenciaKeys.length === 0) return;
  w.params.push(f.referenciaKeys);
  w.sql += ` AND (trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text)) = ANY($${w.params.length}::text[])`;
}

function appendBuscar(f: FiltrosSql, w: WhereBuild, excluir: boolean): void {
  const q = f.buscar.trim();
  if (excluir || !q) return;
  w.params.push(`%${q}%`);
  const p = `$${w.params.length}`;
  w.sql += ` AND (
    trim(s.linea_codigo_proveedor::text) ILIKE ${p}
    OR trim(s.referencia_codigo_proveedor::text) ILIKE ${p}
    OR (trim(s.linea_codigo_proveedor::text) || '.' || trim(s.referencia_codigo_proveedor::text)) ILIKE ${p}
    OR COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '') ILIKE ${p}
    OR COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '') ILIKE ${p}
    OR COALESCE(NULLIF(btrim(mat.descripcion::text), ''), '') ILIKE ${p}
    OR COALESCE(NULLIF(btrim(col.nombre::text), ''), '') ILIKE ${p}
    OR COALESCE(NULLIF(btrim(s.excel_material_code::text), ''), '') ILIKE ${p}
    OR COALESCE(NULLIF(btrim(s.excel_color_code::text), ''), '') ILIKE ${p}
  )`;
}

function appendMarcaCadena(f: FiltrosSql, w: WhereBuild): void {
  if (!f.marcaCadena) return;
  w.params.push(f.marcaCadena);
  w.sql += ` AND COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') = $${w.params.length}`;
}

function buildWhere(
  f: FiltrosSql,
  excluir: "generos" | "marcas" | "estilos" | "tipos" | "tipo1s" | "referenciaKeys" | "buscar" | null,
): WhereBuild {
  const w: WhereBuild = { sql: `s.cantidad > 0 AND ${SQL_SOLO_CALZADO}`, params: [] };
  appendGenero(f, w, excluir === "generos");
  appendMarcas(f, w, excluir === "marcas");
  appendEstilos(f, w, excluir === "estilos");
  appendTipos(f, w, excluir === "tipos");
  appendTipo1(f, w, excluir === "tipo1s");
  appendRefs(f, w, excluir === "referenciaKeys");
  appendBuscar(f, w, excluir === "buscar");
  appendMarcaCadena(f, w);
  return w;
}

export function sqlFilasStock(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, null);
  return {
    text: `${SELECT_CORE} ${fromClause(tabla)} WHERE ${w.sql}
      ORDER BY marca, ${SQL_ORDER_LINEA_REF}, material_code, color_code`,
    params: w.params,
  };
}

export function sqlMarcasAgregado(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, "marcas");
  return {
    text: `
      SELECT
        COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
        COUNT(*)::int AS skus,
        COALESCE(SUM(s.cantidad::float8), 0)::float8 AS pares
      ${fromClause(tabla)}
      WHERE ${w.sql}
      GROUP BY 1
      ORDER BY 1
    `,
    params: w.params,
  };
}

export function sqlChipsGenero(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, "generos");
  return {
    text: `
      SELECT
        COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') AS id,
        COUNT(*)::int AS cnt
      ${fromClause(tabla)}
      WHERE ${w.sql}
        AND COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') <> '(sin género)'
      GROUP BY 1 ORDER BY 1
    `,
    params: w.params,
  };
}

export function sqlChipsMarcas(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, "marcas");
  return {
    text: `
      SELECT
        COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS id,
        COUNT(*)::int AS cnt
      ${fromClause(tabla)}
      WHERE ${w.sql}
      GROUP BY 1 ORDER BY 1
    `,
    params: w.params,
  };
}

export function sqlChipsEstilo(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, "estilos");
  return {
    text: `
      SELECT
        COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '(sin estilo)') AS id,
        COUNT(*)::int AS cnt
      ${fromClause(tabla)}
      WHERE ${w.sql}
        AND COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '(sin estilo)') <> '(sin estilo)'
      GROUP BY 1 ORDER BY 1
    `,
    params: w.params,
  };
}

export function sqlChipsTipo(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, "tipos");
  return {
    text: `
      SELECT
        COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS id,
        COUNT(*)::int AS cnt
      ${fromClause(tabla)}
      WHERE ${w.sql}
      GROUP BY 1 ORDER BY 1
    `,
    params: w.params,
  };
}

export function sqlChipsTipo1(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, "tipo1s");
  return {
    text: `
      SELECT
        COALESCE(NULLIF(btrim(t1.descp_tipo_1::text), ''), '(sin tipo 1)') AS id,
        COUNT(*)::int AS cnt
      ${fromClause(tabla)}
      WHERE ${w.sql}
        AND COALESCE(NULLIF(btrim(t1.descp_tipo_1::text), ''), '(sin tipo 1)') <> '(sin tipo 1)'
      GROUP BY 1 ORDER BY 1
    `,
    params: w.params,
  };
}

export function sqlReferenciasAgregado(tabla: string, f: FiltrosSql): { text: string; params: unknown[] } {
  const w = buildWhere(f, null);
  return {
    text: `
      SELECT * FROM (
        SELECT
          trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text) AS key,
          trim(s.linea_codigo_proveedor::text) AS linea,
          trim(s.referencia_codigo_proveedor::text) AS referencia,
          COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '—') AS estilo,
          COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
          COALESCE(SUM(s.cantidad::float8), 0)::float8 AS pares,
          COUNT(*)::int AS skus
        ${fromClause(tabla)}
        WHERE ${w.sql}
        GROUP BY 1, 2, 3, 4, 5
      ) refs
      ORDER BY ${SQL_ORDER_LINEA_REF_ALIASES}
      LIMIT 500
    `,
    params: w.params,
  };
}

/** Conteo rápido depósito (health) */
export function sqlResumenDeposito(tabla: string): { text: string; params: unknown[] } {
  return {
    text: `
      SELECT
        COUNT(*) FILTER (WHERE cantidad > 0)::int AS skus,
        COALESCE(SUM(cantidad) FILTER (WHERE cantidad > 0), 0)::float8 AS pares,
        MAX(COALESCE(s.created_at, NOW())) AS ultima_carga
      FROM public.${tabla} s
      WHERE ${SQL_SOLO_CALZADO}
    `,
    params: [],
  };
}

/** Descuenta 1 par de una fila con stock (atómico por unidad). */
export function sqlDecrementarUnParMolecula(
  tabla: string,
  p: {
    linea_id: number;
    referencia_id: number;
    material_id: number;
    color_id: number;
    grada: string;
  },
): { text: string; params: unknown[] } {
  const grada = p.grada.trim();
  return {
    text: `
      UPDATE public.${tabla} s
      SET cantidad = cantidad - 1
      WHERE s.id = (
        SELECT id
        FROM public.${tabla}
        WHERE cantidad > 0
          AND linea_id = $1
          AND referencia_id = $2
          AND material_id = $3
          AND color_id = $4
          AND btrim(grada::text) = $5
        ORDER BY id
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      RETURNING cantidad
    `,
    params: [p.linea_id, p.referencia_id, p.material_id, p.color_id, grada],
  };
}

/** Devuelve 1 par a la sesión de stock (arrepentimiento / cancelación). */
export function sqlIncrementarUnParMolecula(
  tabla: string,
  p: {
    linea_id: number;
    referencia_id: number;
    material_id: number;
    color_id: number;
    grada: string;
  },
): { text: string; params: unknown[] } {
  const grada = p.grada.trim();
  return {
    text: `
      UPDATE public.${tabla} s
      SET cantidad = cantidad + 1
      WHERE s.id = (
        SELECT id
        FROM public.${tabla}
        WHERE linea_id = $1
          AND referencia_id = $2
          AND material_id = $3
          AND color_id = $4
          AND btrim(grada::text) = $5
        ORDER BY id
        FOR UPDATE
        LIMIT 1
      )
      RETURNING cantidad
    `,
    params: [p.linea_id, p.referencia_id, p.material_id, p.color_id, grada],
  };
}

/** Stock molécula local — 1 fila agregada */
export function sqlCantidadMolecula(
  tabla: string,
  p: {
    linea_id: number;
    referencia_id: number;
    material_id: number;
    color_id: number;
    grada?: string | null;
  },
): { text: string; params: unknown[] } {
  const params: unknown[] = [p.linea_id, p.referencia_id, p.material_id, p.color_id];
  let gradaSql = "";
  if (p.grada?.trim()) {
    params.push(p.grada.trim());
    gradaSql = ` AND btrim(grada::text) = $${params.length}`;
  }
  return {
    text: `
      SELECT COALESCE(SUM(cantidad::float8), 0)::float8 AS cantidad
      FROM public.${tabla} s
      WHERE cantidad > 0
        AND linea_id = $1 AND referencia_id = $2 AND material_id = $3 AND color_id = $4
        ${gradaSql}
    `,
    params,
  };
}

export type { DepositoFila };

export function filtrosFromBody(body: Record<string, unknown>): FiltrosSql {
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  return {
    generos: arr(body.generos),
    marcas: arr(body.marcas),
    estilos: arr(body.estilos),
    tipos: arr(body.tipos),
    tipo1s: arr(body.tipo1s),
    referenciaKeys: arr(body.referenciaKeys ?? body.refs),
    buscar: typeof body.buscar === "string" ? body.buscar : "",
    marcaCadena: typeof body.marca === "string" ? body.marca : undefined,
  };
}

export function filtrosFromSearchParams(sp: URLSearchParams): FiltrosSql {
  return filtrosFromSp(sp);
}

export function filtrosToSearchParams(f: FiltrosSql): URLSearchParams {
  return filtrosToSp(f);
}
