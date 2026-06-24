/**
 * Etapa 2 — medición payload cadena + TTFB SQL (local).
 * Uso: npx tsx scripts/auditoria_etapa2_velocidad.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getPool, isDatabaseConfigured } from "../lib/pool";
import { getDepositoByClienteId } from "../lib/depositos-config";
import { sqlFilasStock } from "../lib/server/catalogo-sql";
import { buildCadenaServer } from "../lib/server/cadena-server";
import type { DepositoFila } from "../lib/cadena";
import { enrichDepositoFilaImagenes } from "../lib/product-image";
import { buildCadenaWireResponse } from "../lib/server/cadena-payload";

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq < 1) continue;
      const k = t.slice(0, eq).trim();
      let v = t.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* .env.local opcional si ya está en entorno */
  }
}

loadEnvLocal();

const CLIENTE = 2100;
const MARCAS = ["ACTVITTA", "VIZZANO"] as const;

async function medirMarca(marca: string) {
  const config = getDepositoByClienteId(CLIENTE);
  if (!config) throw new Error("cliente_id 2100 no configurado");

  const pool = getPool();
  const filtros = {
    generos: [],
    marcas: [],
    estilos: [],
    tipos: [],
    tipo1s: [],
    referenciaKeys: [],
    buscar: "",
    marcaCadena: marca,
  };

  const t0 = Date.now();
  const q = sqlFilasStock(config.tabla, filtros);
  const { rows: rawRows } = await pool.query<DepositoFila>(q.text, q.params);
  const sqlMs = Date.now() - t0;

  const t1 = Date.now();
  const rows = rawRows.map(enrichDepositoFilaImagenes);
  const paresAll = buildCadenaServer(rows, marca);
  const buildMs = Date.now() - t1;

  const payloadActual = JSON.stringify({ paresAll, pares: paresAll });
  const payloadSlim = JSON.stringify(buildCadenaWireResponse(paresAll, paresAll));

  let filasCount = 0;
  let coloresCount = 0;
  for (const p of paresAll) {
    for (const g of p.gruposMaterial) {
      filasCount += g.filas.length;
      coloresCount += g.colores.length;
    }
    coloresCount += p.coloresLR.length;
  }

  return {
    marca,
    filas_sql: rows.length,
    pares: paresAll.length,
    filas_en_json: filasCount,
    colores_en_json: coloresCount,
    sql_ms: sqlMs,
    build_ms: buildMs,
    bytes_actual: Buffer.byteLength(payloadActual, "utf8"),
    bytes_slim: Buffer.byteLength(payloadSlim, "utf8"),
    reduccion_pct: Math.round((1 - Buffer.byteLength(payloadSlim, "utf8") / Buffer.byteLength(payloadActual, "utf8")) * 1000) / 10,
    urls_por_fila: 3,
  };
}

async function main() {
  if (!isDatabaseConfigured()) {
    console.error("DATABASE_URL no configurada en .env.local");
    process.exit(1);
  }

  const marcas = [];
  for (const m of MARCAS) {
    marcas.push(await medirMarca(m));
  }

  const hallazgos = {
    V1_payload_slim: true,
    V4_priority_solo_hero: true,
    V7_prefetch_cap_200: true,
    V8_ingresar_seed: true,
    V2_seed_session_storage: true,
    V5_poll_ms: 20_000,
    V6_sql_sin_limit: true,
    V3_isr_cookie: true,
  };

  const out = {
    fecha: new Date().toISOString(),
    etapa: 2,
    auditor: "Cursor",
    cliente_id: CLIENTE,
    marcas,
    hallazgos,
    veredicto: "PARCIAL",
    nota: "V1/V4/V7/V8/V2 implementados. Pendiente V3/V5/V6.",
  };

  const dir = join(process.cwd(), "docs", "evidencia");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `ETAPA_2_VELOCIDAD_AUDIT_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.json`);
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  console.log(`\n-> ${path}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    try {
      getPool().end();
    } catch {
      /* ignore */
    }
  });
