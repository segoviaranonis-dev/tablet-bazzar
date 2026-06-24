/** Test all filtros SQL queries */
import { readFileSync } from "fs";
import pg from "pg";
import {
  sqlChipsEstilo,
  sqlChipsGenero,
  sqlChipsMarcas,
  sqlChipsTipo,
  sqlMarcasAgregado,
  sqlReferenciasAgregado,
  sqlResumenDeposito,
  FILTROS_SQL_VACIOS,
} from "../lib/server/catalogo-sql.ts";

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
const f = FILTROS_SQL_VACIOS;

const tests = {
  genero: sqlChipsGenero(tabla, f),
  marcas: sqlChipsMarcas(tabla, f),
  estilo: sqlChipsEstilo(tabla, f),
  tipo: sqlChipsTipo(tabla, f),
  marcasAgg: sqlMarcasAgregado(tabla, f),
  refs: sqlReferenciasAgregado(tabla, f),
  resumen: sqlResumenDeposito(tabla),
};

for (const [name, q] of Object.entries(tests)) {
  try {
    const r = await pool.query(q.text, q.params);
    console.log(`OK ${name}: ${r.rows.length} rows`);
  } catch (e) {
    console.error(`FAIL ${name}:`, e.message);
  }
}

await pool.end();
