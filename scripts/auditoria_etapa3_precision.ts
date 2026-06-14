/**
 * Etapa 3 — auditoría precisión UX (estática + checklist piso).
 * Uso: npx tsx scripts/auditoria_etapa3_precision.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

function check(pattern: RegExp, files: string[]): boolean {
  return files.every((f) => pattern.test(read(f)));
}

function checkAbsent(pattern: RegExp, files: string[]): boolean {
  return files.every((f) => !pattern.test(read(f)));
}

function main() {
  const hero = read("components/cadena/HeroProductImage.tsx");
  const productImage = read("components/ProductImage.tsx");
  const vista = read("app/cadena/vista/page.tsx");
  const boot = existsSync(join(ROOT, "lib/cadena-boot.ts")) ? read("lib/cadena-boot.ts") : "";

  const hallazgos = {
    R1_hero_pickHeroLoadSequence: hero.includes("pickHeroLoadSequence") && hero.includes("ProductImage"),
    R2_orden_lg_flat_sm: read("lib/product-image.ts").includes("imagen_url_hero, urls.imagen_url_flat, urls.imagen_url_thumb"),
    R3_thumbs_sin_fade: !productImage.includes("transition-opacity duration-150") && productImage.includes('loaded ? "opacity-100"'),
    R4_hero_decoding_async: productImage.includes('decoding="async"') && !hero.includes('decoding="sync"'),
    R5_resolveCadenaBootState: boot.includes("resolveCadenaBootState") && vista.includes("applyBootPosition"),
    R6_useEffects_reducidos: (vista.match(/useEffect\(/g) ?? []).length <= 6,
    R7_hero_v14_frame: hero.includes('data-hero-frame="v14-fallback"'),
  };

  const passCount = Object.values(hallazgos).filter(Boolean).length;
  const total = Object.keys(hallazgos).length;

  const out = {
    fecha: new Date().toISOString(),
    etapa: 3,
    auditor: "Cursor",
    hallazgos,
    pass: `${passCount}/${total}`,
    veredicto: passCount === total ? "PASS_CODIGO" : "PARCIAL",
    qa_piso: {
      criterio: "50 swaps consecutivos sin flash blanco en hero ni thumbs",
      estado: "PENDIENTE_DIRECTOR",
      pasos: [
        "REINICIAR_DEV.bat",
        "Ingresar ACTVITTA → vista",
        "50× swipe L+R y cambio color/material",
        "Verificar hero mantiene imagen hasta nueva decodificada",
        "SKU 4215.1034: punta y tacón visibles",
      ],
    },
    nota: "PASS código ≠ cierre diseño. Director debe validar QA piso.",
  };

  const dir = join(ROOT, "docs", "evidencia");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "ETAPA_3_PRECISION_AUDIT_20260614.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  console.log(`\n-> ${path}`);
}

main();
