import { readFileSync } from "fs";
import pg from "pg";

// Inline filtros + sqlFilasStock (mirror catalogo-sql.ts)
const filtros = {
  generos: [],
  marcas: [],
  estilos: [],
  tipos: [],
  referenciaKeys: ["1184|1101"],
  buscar: "1184",
  marcaCadena: "VIZZANO",
};

const tabla = "deposito_tienda_fernando_adultos";

function appendRefs(f, w, excluir) {
  if (excluir || f.referenciaKeys.length === 0) return;
  w.params.push(f.referenciaKeys);
  w.sql += ` AND (trim(s.linea_codigo_proveedor::text) || '|' || trim(s.referencia_codigo_proveedor::text)) = ANY($${w.params.length}::text[])`;
}

function appendBuscar(f, w, excluir) {
  const q = f.buscar.trim();
  if (excluir || !q) return;
  w.params.push(`%${q}%`);
  const p = `$${w.params.length}`;
  w.sql += ` AND (
    trim(s.linea_codigo_proveedor::text) ILIKE ${p}
    OR trim(s.referencia_codigo_proveedor::text) ILIKE ${p}
    OR (trim(s.linea_codigo_proveedor::text) || '.' || trim(s.referencia_codigo_proveedor::text)) ILIKE ${p}
  )`;
}

function appendMarcaCadena(f, w) {
  if (!f.marcaCadena) return;
  w.params.push(f.marcaCadena);
  w.sql += ` AND COALESCE(NULLIF(btrim(mv.descp_marca::text), ''), '(sin marca)') = $${w.params.length}`;
}

function buildWhere(f) {
  const w = { sql: "s.cantidad > 0", params: [] };
  appendRefs(f, w, false);
  appendBuscar(f, w, false);
  appendMarcaCadena(f, w);
  return w;
}

const fromClause = `
  FROM public.${tabla} s
  LEFT JOIN public.marca_v2 mv ON mv.id_marca = s.marca_id
`;

const w = buildWhere(filtros);
const text = `SELECT COUNT(*)::int AS n ${fromClause} WHERE ${w.sql}`;

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

const { rows } = await pool.query(text, w.params);
console.log("SQL:", text);
console.log("params:", w.params);
console.log("count:", rows[0].n);

await pool.end();
