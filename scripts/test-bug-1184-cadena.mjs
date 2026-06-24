import { readFileSync } from "fs";
import pg from "pg";
import { buildCadenaFromFilas } from "../lib/cadena.ts";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

const tabla = "deposito_2_fernando_adultos_tienda";
const marca = "VIZZANO";
const referenciaKeys = ["1184|1101"];
const buscar = "1184";

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
    COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
    COALESCE(NULLIF(btrim(g.descripcion::text), ''), '(sin género)') AS genero,
    COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '(sin estilo)') AS estilo,
    COALESCE(NULLIF(btrim(tv.descp_tipo::text), ''), '(sin tipo)') AS tipo_v2,
    NULLIF(btrim(mat.descripcion::text), '') AS descp_material,
    NULLIF(btrim(col.nombre::text), '') AS descp_color,
    NULLIF(btrim(s.imagen_nombre::text), '') AS imagen_nombre
  FROM public.${tabla} s
  LEFT JOIN public.material mat ON mat.id = s.material_id
  LEFT JOIN public.color col ON col.id = s.color_id
  LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
  LEFT JOIN public.genero g ON g.id = s.genero_id
  LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = s.grupo_estilo_id
  LEFT JOIN public.tipo_v2 tv ON tv.id_tipo = s.tipo_v2_id
  WHERE s.cantidad > 0
    AND (trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text)) = ANY($1::text[])
    AND (
      trim(s.linea_codigo_proveedor::text) ILIKE $2
      OR trim(s.referencia_codigo_proveedor::text) ILIKE $2
      OR (trim(s.linea_codigo_proveedor::text) || '.' || trim(s.referencia_codigo_proveedor::text)) ILIKE $2
    )
    AND COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') = $3
`;

const { rows } = await pool.query(SELECT_CORE, [referenciaKeys, `%${buscar}%`, marca]);
console.log("filas:", rows.length);
const paresAll = buildCadenaFromFilas(rows, marca);
console.log("paresAll:", paresAll.length, paresAll[0]?.key);

await pool.end();
