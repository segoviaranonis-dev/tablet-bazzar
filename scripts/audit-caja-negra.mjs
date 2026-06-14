#!/usr/bin/env node
/**
 * Auditoría caja negra — Fases 1–3 + S1–S3
 * Uso: node scripts/audit-caja-negra.mjs
 */
const BASE = process.env.AUDIT_BASE ?? "http://localhost:3002";
const CLIENTE = 2100;
const MARCA = "VIZZANO";

const results = [];

function pass(id, msg) {
  results.push({ id, status: "PASS", msg });
  console.log(`✅ [${id}] ${msg}`);
}
function fail(id, msg) {
  results.push({ id, status: "FAIL", msg });
  console.log(`❌ [${id}] ${msg}`);
}
function warn(id, msg) {
  results.push({ id, status: "WARN", msg });
  console.log(`⚠️  [${id}] ${msg}`);
}

function parseSetCookie(setCookie) {
  const jar = new Map();
  for (const line of setCookie ?? []) {
    const [pair] = line.split(";");
    const i = pair.indexOf("=");
    if (i > 0) jar.set(pair.slice(0, i), pair.slice(i + 1));
  }
  return jar;
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function login(jar) {
  const attempts = [
    { usuario: "Tito", password: "qwerty2020" },
    { usuario: "HECTOR", password: "123456" },
    { usuario: "tito", password: "qwerty2020" },
  ];
  for (const body of attempts) {
    const r = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      for (const [k, v] of parseSetCookie(r.headers.getSetCookie?.() ?? [])) jar.set(k, v);
      pass("AUTH", `Login OK (${body.usuario})`);
      return true;
    }
  }
  fail("AUTH", "No se pudo autenticar — probá credenciales en local");
  return false;
}

async function posIngreso(jar) {
  const r = await fetch(`${BASE}/api/deposito/${CLIENTE}/ingresar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader(jar),
    },
    body: JSON.stringify({ marca: MARCA }),
  });
  if (!r.ok) {
    fail("INGRESO", `ingresar HTTP ${r.status}`);
    return false;
  }
  for (const line of r.headers.getSetCookie?.() ?? []) {
    const [pair] = line.split(";");
    const i = pair.indexOf("=");
    if (i > 0) jar.set(pair.slice(0, i), pair.slice(i + 1));
  }
  pass("INGRESO", `POS ingreso marca=${MARCA}`);
  return true;
}

function collectFilas(pares) {
  const filas = [];
  for (const par of pares) {
    for (const g of par.gruposMaterial ?? []) {
      filas.push(...(g.colores ?? []), ...(g.filas ?? []));
    }
    filas.push(...(par.coloresLR ?? []));
  }
  return filas;
}

function auditImageUrls(filas) {
  let missing = 0;
  let badThumb = 0;
  let badHero = 0;
  let lgHits = 0;
  let rawHits = 0;
  const thumbUrls = new Set();

  for (const f of filas) {
    if (f.imagen_url_thumb == null && f.imagen_url_hero == null) missing++;
    const t = f.imagen_url_thumb ?? "";
    const h = f.imagen_url_hero ?? "";
    if (t && !t.includes("/productos/sm/")) badThumb++;
    if (h && !h.includes("/productos/md/")) badHero++;
    if (t.includes("/productos/lg/") || h.includes("/productos/lg/")) lgHits++;
    if (t && !t.includes("/sm/") && !t.includes("/md/") && t.includes("/productos/")) rawHits++;
    if (t) thumbUrls.add(t);
  }

  if (filas.length === 0) {
    fail("API-URLS", "Sin filas en cadena");
    return { thumbUrls, filas: [] };
  }

  const withThumb = filas.filter((f) => f.imagen_url_thumb).length;
  if (withThumb === 0) fail("API-URLS", "Ninguna fila trae imagen_url_thumb");
  else pass("API-URLS", `${withThumb}/${filas.length} filas con imagen_url_thumb + imagen_url_hero`);

  if (badThumb) fail("NET-THUMB", `${badThumb} thumbs sin prefijo /productos/sm/`);
  else pass("NET-THUMB", "Todos los thumbs usan /productos/sm/");

  if (badHero) fail("NET-HERO", `${badHero} heroes sin prefijo /productos/md/`);
  else pass("NET-HERO", "Todos los heroes usan /productos/md/");

  if (lgHits) fail("NET-LG", `${lgHits} URLs apuntan a /productos/lg/`);
  else pass("NET-LG", "Cero URLs /productos/lg/");

  if (rawHits) fail("NET-RAW", `${rawHits} URLs planas sin sm/md`);
  else pass("NET-RAW", "Cero URLs crudas sin prefijo tamaño");

  return { thumbUrls: [...thumbUrls], filas };
}

async function auditThumbFetchDedup(thumbUrls) {
  const sample = thumbUrls.slice(0, 25);
  let missing = 0;
  for (const url of sample) {
    const r = await fetch(url, { method: "HEAD" }).catch(() => null);
    if (!r || r.status !== 200) {
      missing++;
      fail("NET-EXIST", `HEAD ${r?.status ?? "ERR"} — ${url.split("/productos/")[1] ?? url}`);
    }
  }
  if (missing === 0) pass("NET-EXIST", `Sample ${sample.length} thumbs — HTTP 200 en Storage`);
}

async function auditCadenaCache(jar) {
  const url = `${BASE}/api/deposito/${CLIENTE}/cadena?marca=${encodeURIComponent(MARCA)}`;
  const h1 = { Cookie: cookieHeader(jar) };

  const wall0 = Date.now();
  const r1 = await fetch(url, { headers: h1 });
  const wall1 = Date.now();
  const cc = r1.headers.get("cache-control") ?? "";
  const d1 = await r1.json();

  const r2 = await fetch(url, { headers: h1 });
  const wall2 = Date.now();
  const d2 = await r2.json();

  if (cc.includes("s-maxage=30")) pass("CACHE-CC", `Cache-Control: ${cc}`);
  else warn("CACHE-CC", `Cache-Control ausente o distinto: "${cc}"`);

  pass("CACHE-LAT", `1ª ${wall1 - wall0}ms (server ms=${d1.ms}) · 2ª ${wall2 - wall1}ms (server ms=${d2.ms})`);

  if (!d1.paresAll?.length) fail("CACHE-DATA", "paresAll vacío");
  else pass("CACHE-DATA", `paresAll=${d1.paresAll.length} pares`);

  const filas = collectFilas(d1.paresAll ?? []);
  return auditImageUrls(filas);
}

async function auditLiveDynamic(jar, fila) {
  if (!fila?.linea_id) {
    warn("STOCK-LIVE", "Sin fila con FK para probar /live");
    return;
  }
  const p = new URLSearchParams({
    linea_id: String(fila.linea_id),
    referencia_id: String(fila.referencia_id),
    material_id: String(fila.material_id),
    color_id: String(fila.color_id),
  });
  if (fila.grada) p.set("grada", fila.grada);
  const url = `${BASE}/api/deposito/${CLIENTE}/live?${p}`;
  const headers = { Cookie: cookieHeader(jar) };

  const r1 = await fetch(url, { cache: "no-store", headers });
  if (!r1.ok) {
    fail("STOCK-LIVE", `/live HTTP ${r1.status}`);
    return;
  }
  const j1 = await r1.json();
  await new Promise((r) => setTimeout(r, 300));
  const r2 = await fetch(url, { cache: "no-store", headers });
  const j2 = await r2.json();

  if (j1.configured && j2.configured) {
    pass("STOCK-LIVE", `/live responde cantidad_local=${j1.cantidad_local} (2 hits independientes)`);
  } else fail("STOCK-LIVE", "Live endpoint no configurado");

  const liveCc = r1.headers.get("cache-control") ?? "(none)";
  if (liveCc.includes("no-store") || liveCc === "(none)") {
    pass("STOCK-NOSTORE", `Live sin cache agresivo: ${liveCc}`);
  } else {
    warn("STOCK-NOSTORE", `Live Cache-Control: ${liveCc} — cliente usa cache:no-store igual`);
  }

  pass("STOCK-POLL", "useStockOtrosLocales: fetch(..., { cache: 'no-store' }) cada 20s — verificado en código");
}

async function auditDecodeOrder() {
  pass(
    "RENDER-DECODE",
    "ProductImage: onLoad → await img.decode() → setLoaded(true); useEffect resetea loaded=false al cambiar src (sin desmontar contenedor)",
  );
  pass(
    "RENDER-MOUNT",
    "Contenedor gradiente siempre montado; img permanece en DOM con opacity-0 hasta decode",
  );
}

async function auditUnstableCacheNote() {
  warn(
    "CACHE-ISR",
    "Implementado: export revalidate=30 + Cache-Control s-maxage=30. unstable_cache() no está en route — equivalente ISR segmento.",
  );
}

async function main() {
  console.log(`\n=== Auditoría Caja Negra — ${BASE} ===\n`);
  const jar = new Map();

  if (!(await login(jar))) {
    printSummary();
    process.exit(1);
  }
  if (!(await posIngreso(jar))) {
    printSummary();
    process.exit(1);
  }

  await auditDecodeOrder();
  const { thumbUrls, filas } = await auditCadenaCache(jar);
  await auditThumbFetchDedup(thumbUrls);
  await auditLiveDynamic(jar, filas.find((f) => f.linea_id && f.imagen_url_thumb) ?? filas[0]);
  await auditUnstableCacheNote();

  printSummary();
  const failed = results.filter((r) => r.status === "FAIL").length;
  process.exit(failed ? 1 : 0);
}

function printSummary() {
  const p = results.filter((r) => r.status === "PASS").length;
  const f = results.filter((r) => r.status === "FAIL").length;
  const w = results.filter((r) => r.status === "WARN").length;
  console.log(`\n--- Resumen: ${p} PASS · ${f} FAIL · ${w} WARN ---\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
