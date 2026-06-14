/**
 * Evidencia DOM hero SKU 4215.1034 — ejecutar con dev en :3002.
 * npx tsx scripts/evidencia_dom_hero_4215.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const TARGET = { linea: "4215", referencia: "1034" };
const STEM = "4215-1034-28458-98904.jpg";

async function main() {
  const login = await fetch("http://localhost:3002/api/auth/auto-login", { redirect: "manual" });
  const cookie = login.headers.getSetCookie?.()?.join("; ") ?? "";

  const cadena = await fetch(
    `http://localhost:3002/api/deposito/2100/cadena?marca=ACTIVITTA`,
    { headers: cookie ? { Cookie: cookie } : {} },
  );
  const data = await cadena.json();
  const pares = (data.paresAll ?? data.pares ?? []) as Array<{ linea: string; referencia: string }>;
  const parIndex = pares.findIndex(
    (p) => String(p.linea) === TARGET.linea && String(p.referencia) === TARGET.referencia,
  );

  const url =
    parIndex >= 0
      ? `http://localhost:3002/cadena/vista?marcas=ACTIVITTA&marca=ACTIVITTA&cliente_id=2100&pi=${parIndex}`
      : null;

  const out = {
    fecha: new Date().toISOString(),
    sku: `${TARGET.linea}.${TARGET.referencia}`,
    archivo: STEM,
    parIndex,
    vista_url: url,
    storage_audit: join("docs", "evidencia", "HERO_AUDIT_4215_1034.json"),
    causa_raiz: "JPEG sm/lg tienen zapato ancho completo (margin 0). Recorte = CSS img > contenedor.",
    fix_aplicado: "v13: absolute inset-0 + h/w-full object-contain (paridad ProductImage thumb), padding en contenedor, lg/ para hero",
  };

  const dir = join(process.cwd(), "docs", "evidencia");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "HERO_CASO_4215_1034.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
