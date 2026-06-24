/** Full cadena pipeline repro (no Next aliases) */
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

function keyLR(row) {
  return `${String(row.linea_codigo_proveedor).trim()}|${String(row.referencia_codigo_proveedor).trim()}`;
}

function buildCadenaFromFilas(filas, marcaFiltro) {
  const mf = marcaFiltro?.trim() ?? "";
  const deMarca = filas.filter((f) => (f.marca?.trim() ?? "") === mf && f.cantidad > 0);
  const porLR = new Map();
  for (const f of deMarca) {
    const k = keyLR(f);
    if (!porLR.has(k)) porLR.set(k, []);
    porLR.get(k).push(f);
  }
  return [...porLR.keys()];
}

function filtrarParesServer(keys, referenciaKeys) {
  if (referenciaKeys.length === 0) return keys;
  const set = new Set(referenciaKeys.map((k) => k.trim()));
  return keys.filter((k) => set.has(k.trim()));
}

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
`;

const { rows } = await pool.query(SELECT_CORE, [referenciaKeys, `%${buscar}%`, marca]);
console.log("filas:", rows.length);

const keysOld = buildCadenaFromFilas(
  rows,
  marca,
);
// simulate OLD bug (strict marca without trim on filter - but marca already trimmed from SQL)
function buildOld(filas, marcaFiltro) {
  const deMarca = filas.filter((f) => f.marca === marcaFiltro && f.cantidad > 0);
  return [...new Set(deMarca.map(keyLR))];
}
console.log("paresAll (old):", buildOld(rows, marca).length);
console.log("paresAll (trim):", keysOld.length);
console.log("pares filtrados:", filtrarParesServer(keysOld, referenciaKeys).length);

await pool.end();
