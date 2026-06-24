/** Test filtros SQL — node scripts/test-filtros-sql.mjs */
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

const queries = {
  refs: `
      SELECT * FROM (
        SELECT
          trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text) AS key,
          trim(s.linea_codigo_proveedor::text) AS linea,
          trim(s.referencia_codigo_proveedor::text) AS referencia,
          COALESCE(NULLIF(btrim(ge.descp_grupo_estilo::text), ''), '—') AS estilo,
          COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') AS marca,
          COALESCE(SUM(s.cantidad::float8), 0)::float8 AS pares,
          COUNT(*)::int AS skus
        FROM public.${tabla} s
        LEFT JOIN public.grupo_estilo_v2 ge ON ge.id_grupo_estilo = s.grupo_estilo_id
        LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
        WHERE s.cantidad > 0
        GROUP BY 1, 2, 3, 4, 5
      ) refs
      ORDER BY NULLIF(refs.linea, '')::bigint NULLS LAST, NULLIF(refs.referencia, '')::bigint NULLS LAST
      LIMIT 5
    `,
};

for (const [name, sql] of Object.entries(queries)) {
  try {
    const r = await pool.query(sql);
    console.log(`OK ${name}: ${r.rows.length} rows`);
  } catch (e) {
    console.error(`FAIL ${name}:`, e.message);
  }
}

await pool.end();
