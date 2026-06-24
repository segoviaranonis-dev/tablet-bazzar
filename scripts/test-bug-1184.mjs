/** Reproduce bug cadena vista 1184|1101 */
import { readFileSync } from "fs";
import pg from "pg";
import { buildCadenaFromFilas } from "../lib/cadena.ts";
import { filtrarParesServer } from "../lib/server/cadena-server.ts";
import { sqlFilasStock, filtrosFromSearchParams } from "../lib/server/catalogo-sql.ts";

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

const sp = new URLSearchParams(
  "refs=1184|1101&q=1184&marca=VIZZANO&cliente_id=2100&pi=0&gi=0&c1=0&c2=0",
);
const filtros = filtrosFromSearchParams(sp);
filtros.marcaCadena = "VIZZANO";
const tabla = "deposito_2_fernando_adultos_tienda";

const q = sqlFilasStock(tabla, filtros);
const { rows } = await pool.query(q.text, q.params);
console.log("filas SQL:", rows.length);
if (rows.length) {
  console.log("sample linea:", JSON.stringify(rows[0].linea_codigo_proveedor));
  console.log("sample marca:", JSON.stringify(rows[0].marca));
}

const paresAll = buildCadenaFromFilas(rows, "VIZZANO");
console.log("paresAll:", paresAll.length, paresAll[0]?.key);

const pares = filtrarParesServer(paresAll, filtros);
console.log("pares filtrados:", pares.length);

await pool.end();
