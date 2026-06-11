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

const tabla = "deposito_tienda_fernando_adultos";
const marca = "VIZZANO";
const buscar = "1184";

const fromClause = `
  FROM public.${tabla} s
  LEFT JOIN public.material mat ON mat.id = s.material_id
  LEFT JOIN public.color col ON col.id = s.color_id
  LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
  LEFT JOIN public.genero g ON g.id = s.genero_id
  LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = s.grupo_estilo_id
  LEFT JOIN public.tipo_v2 tv ON tv.id_tipo = s.tipo_v2_id
`;

const SELECT = `
  SELECT
    trim(s.linea_codigo_proveedor::text) AS linea_codigo_proveedor,
    trim(s.referencia_codigo_proveedor::text) AS referencia_codigo_proveedor,
    '' AS material_code, '' AS color_code, 'g' AS grada,
    s.cantidad::float8 AS cantidad,
    COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
    'x' AS genero, 'CHATITA' AS estilo, 'CALZ' AS tipo_v2,
    null AS descp_material, null AS descp_color, null AS imagen_nombre,
    null AS linea_id, null AS referencia_id, null AS material_id, null AS color_id, null AS marca_id
  ${fromClause}
  WHERE s.cantidad > 0
    AND trim(s.linea_codigo_proveedor::text) ILIKE $1
    AND COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') = $2
`;

const { rows } = await pool.query(SELECT, [`%${buscar}%`, marca]);
const paresAll = buildCadenaFromFilas(rows, marca);
console.log("filas:", rows.length, "paresAll:", paresAll.length);
console.log("keys:", paresAll.map((p) => p.key).join(", "));

await pool.end();
