/** SQL-only repro for bug 1184 */
import { readFileSync } from "fs";
import pg from "pg";

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
const refs = ["1184|1101"];
const buscar = "1184";

const text = `
  SELECT
    trim(s.linea_codigo_proveedor::text) AS linea_codigo_proveedor,
    trim(s.referencia_codigo_proveedor::text) AS referencia_codigo_proveedor,
    COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
    s.cantidad::float8 AS cantidad
  FROM public.${tabla} s
  LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
  WHERE s.cantidad > 0
    AND (trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text)) = ANY($1::text[])
    AND (
      trim(s.linea_codigo_proveedor::text) ILIKE $2
      OR trim(s.referencia_codigo_proveedor::text) ILIKE $2
      OR (trim(s.linea_codigo_proveedor::text) || '.' || trim(s.referencia_codigo_proveedor::text)) ILIKE $2
    )
    AND COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') = $3
  LIMIT 5
`;

const { rows } = await pool.query(text, [refs, `%${buscar}%`, marca]);
console.log("rows:", rows.length);
for (const r of rows) {
  console.log(JSON.stringify(r));
}

// Check marca mismatch in buildCadena simulation
const deMarca = rows.filter((f) => f.marca === marca && f.cantidad > 0);
const deMarcaTrim = rows.filter((f) => f.marca?.trim() === marca.trim() && f.cantidad > 0);
console.log("deMarca strict:", deMarca.length, "deMarca trim:", deMarcaTrim.length);

await pool.end();
