/**
 * Auditoría hero SKU 4215.1034 — Protocolo Imágenes Nexus.
 * Uso: npx tsx scripts/auditar_hero_4215_1034.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const SKU = {
  linea: "4215",
  referencia: "1034",
  material: "28458",
  color: "98904",
  stem: "4215-1034-28458-98904.jpg",
};

function loadEnvLocal(): string {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    const m = raw.match(/^NEXT_PUBLIC_SUPABASE_URL=(.+)$/m);
    return (m?.[1] ?? "").trim().replace(/^["']|["']$/g, "");
  } catch {
    return "";
  }
}

function url(tier: "sm" | "md" | "lg" | "flat"): string {
  const base = loadEnvLocal().replace(/\/$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing in .env.local");
  if (tier === "flat") return `${base}/storage/v1/object/public/productos/${SKU.stem}`;
  return `${base}/storage/v1/object/public/productos/${tier}/${SKU.stem}`;
}

async function probe(u: string) {
  const res = await fetch(u, { method: "HEAD" });
  const get = res.ok ? await fetch(u) : null;
  const buf = get?.ok ? Buffer.from(await get.arrayBuffer()) : null;
  let width = 0;
  let height = 0;
  if (buf && buf.length > 8) {
    // JPEG SOF0
    if (buf[0] === 0xff && buf[1] === 0xd8) {
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
    }
  }
  return {
    url: u,
    http: res.status,
    bytes: buf?.length ?? 0,
    width,
    height,
  };
}

async function main() {
  const tiers = ["sm", "lg", "flat"] as const;
  const storage: Record<string, Awaited<ReturnType<typeof probe>>> = {};
  for (const t of tiers) {
    storage[t] = await probe(url(t));
  }

  const out = {
    fecha: new Date().toISOString().slice(0, 10),
    sku: `${SKU.linea}.${SKU.referencia}`,
    archivo: SKU.stem,
    storage,
    diagnostico: {
      sm_ok: storage.sm.http === 200,
      lg_ok: storage.lg.http === 200,
      mismo_aspect_sm: storage.sm.width && storage.sm.height ? storage.sm.width / storage.sm.height : null,
    },
  };

  const dir = join(process.cwd(), "docs", "evidencia");
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, "HERO_AUDIT_4215_1034.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  console.log("\nWrote", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
