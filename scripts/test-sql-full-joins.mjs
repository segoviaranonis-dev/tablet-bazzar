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
const params = [["1184|1101"], "%1184%", "VIZZANO"];

const text = `
  SELECT COUNT(*)::int AS n
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

const { rows } = await pool.query(text, params);
console.log("full joins count:", rows[0].n);

// Check if tipo_v2_id exists
try {
  await pool.query(`SELECT tipo_v2_id FROM public.${tabla} LIMIT 1`);
  console.log("tipo_v2_id: OK");
} catch (e) {
  console.log("tipo_v2_id: FAIL", e.message);
}

await pool.end();
