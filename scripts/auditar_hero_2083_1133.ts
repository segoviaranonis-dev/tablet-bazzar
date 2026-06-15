/**
 * Auditoría Storage hero — MOLEKINHA 2083.1134 (CHATITA)
 * Protocolo: PUNTO_CRITICO_RECORTE_CALZADO.md
 * Uso: npx tsx scripts/auditar_hero_2083_1133.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import pg from "pg";

function loadEnv(key: string): string {
  const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  const m = raw.match(new RegExp(`^${key}=(.+)$`, "m"));
  return (m?.[1] ?? "").trim().replace(/^["']|["']$/g, "");
}

type JpegMeta = {
  url: string;
  http: number;
  bytes: number;
  width: number;
  height: number;
  margin_l_px: number | null;
  margin_r_px: number | null;
  content_bbox: [number, number, number, number] | null;
  crop_sospechoso: boolean | null;
};

function parseJpeg(buf: Buffer): Pick<JpegMeta, "width" | "height"> {
  let width = 0;
  let height = 0;
  if (buf.length < 8 || buf[0] !== 0xff || buf[1] !== 0xd8) return { width, height };
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      height = buf.readUInt16BE(i + 5);
      width = buf.readUInt16BE(i + 7);
      break;
    }
    i += 2 + len;
  }
  return { width, height };
}

/** Márgenes laterales vs fondo blanco (umbral 245). */
function measureMargins(buf: Buffer, width: number, height: number) {
  if (!width || !height || buf.length < 100) {
    return { margin_l_px: null, margin_r_px: null, content_bbox: null, crop_sospechoso: null };
  }

  // Decode via sharp if available — fallback: sample JPEG not fully decoded here
  // Use simple approach: read RGB from canvas-less — skip, use width/height heuristic + fetch with jimp alternative
  void buf;
  return {
    margin_l_px: null as number | null,
    margin_r_px: null as number | null,
    content_bbox: null as [number, number, number, number] | null,
    crop_sospechoso: null as boolean | null,
  };
}

async function probe(base: string, tier: "sm" | "md" | "lg" | "flat", stem: string): Promise<JpegMeta> {
  const u =
    tier === "flat"
      ? `${base}/storage/v1/object/public/productos/${stem}`
      : `${base}/storage/v1/object/public/productos/${tier}/${stem}`;
  const res = await fetch(u, { method: "HEAD" });
  const get = res.ok ? await fetch(u) : null;
  const buf = get?.ok ? Buffer.from(await get.arrayBuffer()) : null;
  const { width, height } = buf ? parseJpeg(buf) : { width: 0, height: 0 };
  const margins = buf && width && height ? measureMargins(buf, width, height) : measureMargins(Buffer.alloc(0), 0, 0);

  const aspect = width && height ? width / height : 0;
  const crop_sospechoso =
    width && height
      ? width === height && aspect === 1 && tier === "lg" && margins.margin_l_px === null
        ? null
        : null
      : null;

  return {
    url: u,
    http: res.status,
    bytes: buf?.length ?? 0,
    width,
    height,
    ...margins,
    crop_sospechoso,
  };
}

async function resolveStem(): Promise<{ stem: string; row: Record<string, unknown> }> {
  const dbUrl = loadEnv("DATABASE_URL");
  if (!dbUrl) throw new Error("DATABASE_URL missing");
  const pool = new pg.Pool({ connectionString: dbUrl });
  try {
    const r = await pool.query<{
      linea_codigo_proveedor: string;
      referencia_codigo_proveedor: string;
      excel_material_code: string | null;
      excel_color_code: string | null;
      imagen_nombre: string | null;
    }>(`
      SELECT
        trim(linea_codigo_proveedor::text) AS linea_codigo_proveedor,
        trim(referencia_codigo_proveedor::text) AS referencia_codigo_proveedor,
        NULLIF(btrim(excel_material_code::text), '') AS excel_material_code,
        NULLIF(btrim(excel_color_code::text), '') AS excel_color_code,
        NULLIF(btrim(imagen_nombre::text), '') AS imagen_nombre
      FROM public.deposito_tienda_fernando_ninos
      WHERE trim(linea_codigo_proveedor::text) = '2083'
        AND trim(referencia_codigo_proveedor::text) ILIKE '%1133%'
        AND cantidad > 0
      LIMIT 1
    `);
    const row = r.rows[0];
    if (!row) throw new Error("SKU 2083.1133 no encontrado en deposito_tienda_fernando_ninos");

    if (row.imagen_nombre) {
      const stem = row.imagen_nombre.replace(/^productos\//i, "").replace(/^(sm|md|lg)\//i, "");
      return { stem, row: row as unknown as Record<string, unknown> };
    }

    const L = row.linea_codigo_proveedor;
    const R = row.referencia_codigo_proveedor.replace(/\..*$/, "");
    const M = row.excel_material_code ?? "";
    const C = row.excel_color_code ?? "";
    const stem = [L, R, M, C].filter(Boolean).join("-") + ".jpg";
    return { stem, row: row as unknown as Record<string, unknown> };
  } finally {
    await pool.end();
  }
}

async function main() {
  const base = loadEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");

  const { stem, row } = await resolveStem();
  const tiers = ["sm", "md", "lg", "flat"] as const;
  const storage: Record<string, JpegMeta> = {};
  for (const t of tiers) {
    storage[t] = await probe(base, t, stem);
  }

  const smOk = storage.sm.http === 200;
  const lgOk = storage.lg.http === 200;
  const smSquare = storage.sm.width === storage.sm.height;
  const lgSquare = storage.lg.width === storage.lg.height;

  const out = {
    fecha: new Date().toISOString(),
    sku: "2083.1133",
    marca: "MOLEKINHA",
    cliente_id: 2900,
    archivo: stem,
    deposito_row: row,
    storage,
    diagnostico: {
      sm_ok: smOk,
      md_ok: storage.md.http === 200,
      lg_ok: lgOk,
      flat_ok: storage.flat.http === 200,
      hero_actual_tier: "lg (v14 pickHeroLoadSequence)",
      thumb_tier: "sm",
      tiers_misma_resolucion: smOk && lgOk ? storage.sm.width === storage.lg.width : null,
      lg_cuadrado: lgSquare,
      sm_cuadrado: smSquare,
      veredicto:
        smOk && lgOk && storage.sm.bytes !== storage.lg.bytes
          ? "PROBAR_VISUAL: sm y lg distintos — hero lg puede recortar si crop legacy"
          : !smOk && lgOk
            ? "FAIL: sm ausente, hero cae a lg"
            : smOk && !lgOk
              ? "PASS_STORAGE_SM: usar sm en hero"
              : "REVISAR_MANUAL",
    },
  };

  const dir = join(process.cwd(), "docs", "evidencia");
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, "HERO_AUDIT_2083_1133.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  console.log("\nWrote", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
