/** diag FK deposito — node scripts/diag-deposito-fk.mjs */
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

const counts = await pool.query(`
  SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE cantidad > 0)::int AS con_cantidad,
    COUNT(*) FILTER (
      WHERE cantidad > 0
        AND linea_id IS NOT NULL AND referencia_id IS NOT NULL
        AND material_id IS NOT NULL AND color_id IS NOT NULL
    )::int AS fk_ok
  FROM public.${tabla}
`);
console.log("counts", counts.rows[0]);

const sample = await pool.query(`
  SELECT linea_id, referencia_id, material_id, color_id, cantidad
  FROM public.${tabla} WHERE cantidad > 0 LIMIT 5
`);
console.log("sample", sample.rows);

const mol = await pool.query(`
  SELECT COUNT(*)::int AS molecules FROM (
    SELECT linea_codigo_proveedor, referencia_codigo_proveedor, material_id, color_id
    FROM public.${tabla}
    WHERE cantidad > 0 AND material_id IS NOT NULL AND color_id IS NOT NULL
    GROUP BY 1, 2, 3, 4
  ) x
`);
console.log("molecule_groups", mol.rows[0]);

await pool.end();
