/**
 * Diagnóstico cohorte Adultos/Niños + stock par L+R en 3 ubicaciones.
 *
 * Uso:
 *   node scripts/diagnostico-cohorte-stock.mjs <cliente_id> <linea> <referencia> [material_id] [color_id]
 *
 * Ejemplo (Fernando Adultos · ACTVITTA 4282.508):
 *   node scripts/diagnostico-cohorte-stock.mjs 2100 4282 508
 */
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const env = fs.readFileSync(envPath, "utf8");
const m = env.match(/^DATABASE_URL=(.+)$/m);
if (!m) {
  console.error("NO DATABASE_URL en .env.local");
  process.exit(1);
}
const url = m[1].trim().replace(/^"|"$/g, "");

const clienteId = Number(process.argv[2]);
const linea = (process.argv[3] ?? "").trim();
const referencia = (process.argv[4] ?? "").trim();
const materialId = process.argv[5] ? Number(process.argv[5]) : null;
const colorId = process.argv[6] ? Number(process.argv[6]) : null;

if (!clienteId || !linea || !referencia) {
  console.error("Args: cliente_id linea referencia [material_id] [color_id]");
  process.exit(1);
}

const COHORTE = {
  2100: { tipo: "Adultos", ente: "Fernando", ub: "fernando" },
  2900: { tipo: "Niños", ente: "Fernando", ub: "fernando" },
  2400: { tipo: "Adultos", ente: "San Martin", ub: "san_martin" },
  2700: { tipo: "Niños", ente: "San Martin", ub: "san_martin" },
  3100: { tipo: "Adultos", ente: "Palma", ub: "palma" },
  3200: { tipo: "Niños", ente: "Palma", ub: "palma" },
};

const TABLAS = {
  fernando: { Adultos: 2100, Niños: 2900 },
  san_martin: { Adultos: 2400, Niños: 2700 },
  palma: { Adultos: 3100, Niños: 3200 },
};

function tabla(id) {
  return `deposito_1_${id}_tienda`;
}

const base = COHORTE[clienteId];
if (!base) {
  console.error("cliente_id no es depósito Bazzar piso (2100–3200)");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: url,
  ssl: url.includes("localhost") ? false : { rejectUnauthorized: false },
});

async function stockPar(t, l, r) {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(cantidad::float8),0)::float8 AS total,
            COUNT(*)::int AS filas
     FROM public.${t}
     WHERE cantidad > 0
       AND trim(linea_codigo_proveedor::text) = $1
       AND trim(referencia_codigo_proveedor::text) = $2`,
    [l, r],
  );
  return rows[0];
}

async function stockMol(t, l, r, mid, cid) {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(cantidad::float8),0)::float8 AS total,
            COUNT(*)::int AS filas
     FROM public.${t}
     WHERE cantidad > 0
       AND trim(linea_codigo_proveedor::text) = $1
       AND trim(referencia_codigo_proveedor::text) = $2
       AND material_id = $3 AND color_id = $4`,
    [l, r, mid, cid],
  );
  return rows[0];
}

console.log("\n=== COHORTE TABLET (desde cliente_id sesión) ===");
console.log(`Sesión cliente_id=${clienteId} → cohorte ${base.tipo} (${base.ente})`);
console.log("\nUbicación          | cliente_id | tabla                          | par L+R pares | filas");
console.log("-------------------+------------+--------------------------------+---------------+------");

for (const [ubLabel, ids] of Object.entries(TABLAS)) {
  const cid = ids[base.tipo];
  const t = tabla(cid);
  try {
    const s = await stockPar(t, linea, referencia);
    console.log(
      `${ubLabel.padEnd(18)} | ${String(cid).padEnd(10)} | ${t.padEnd(30)} | ${String(s.total).padStart(13)} | ${s.filas}`,
    );
  } catch (e) {
    console.log(`${ubLabel.padEnd(18)} | ${cid} | ${t} | ERR ${e.message}`);
  }
}

if (materialId != null && colorId != null) {
  console.log(`\n=== MOLÉCULA material_id=${materialId} color_id=${colorId} ===`);
  for (const [ubLabel, ids] of Object.entries(TABLAS)) {
    const cid = ids[base.tipo];
    const t = tabla(cid);
    try {
      const s = await stockMol(t, linea, referencia, materialId, colorId);
      console.log(`${ubLabel}: ${s.total} p (${s.filas} filas) en ${t}`);
    } catch (e) {
      console.log(`${ubLabel}: ERR ${e.message}`);
    }
  }
}

console.log("\nSan Martín Adultos = cliente_id 2400 → deposito_1_2400_tienda");
console.log("Sync Report: staging.cliente_id=2400 + tiendas_marcas (ACTVITTA id_marca=7)\n");

await pool.end();
