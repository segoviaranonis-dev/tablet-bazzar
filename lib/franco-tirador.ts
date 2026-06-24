import type { ParLineaRef } from "@/lib/cadena";
import { formatGradaDisplay } from "@/lib/stock-otros-locales";

export type FrancoAplicarMeta = {
  grada?: string;
  total: number;
  totalPares: number;
};

export function gradaCoincideTalla(grada: string, talla: string): boolean {
  const t = talla.trim();
  if (!t) return true;
  const g = grada.trim();
  if (!g) return false;
  if (formatGradaDisplay(g) === t) return true;
  if (g === t) return true;
  return g.startsWith(t);
}

/** Primer par/grupo/color con stock en la talla pedida (Franco Tirador). */
export function pickNavFranco(
  pares: ParLineaRef[],
  talla?: string,
): {
  parKey: string;
  estilo: string;
  grupoIndex: number;
  colorG1: number;
  colorG2: number;
} {
  for (const par of pares) {
    for (let gi = 0; gi < par.gruposMaterial.length; gi++) {
      const g = par.gruposMaterial[gi];
      for (let ci = 0; ci < g.colores.length; ci++) {
        if (gradaCoincideTalla(g.colores[ci].grada, talla ?? "")) {
          return {
            parKey: par.key,
            estilo: (par.estilo ?? "").trim(),
            grupoIndex: gi,
            colorG1: ci,
            colorG2: 0,
          };
        }
      }
    }
    for (let ci = 0; ci < par.coloresLR.length; ci++) {
      if (gradaCoincideTalla(par.coloresLR[ci].grada, talla ?? "")) {
        return {
          parKey: par.key,
          estilo: (par.estilo ?? "").trim(),
          grupoIndex: 0,
          colorG1: 0,
          colorG2: ci,
        };
      }
    }
  }
  const p0 = pares[0];
  return {
    parKey: p0?.key ?? "",
    estilo: (p0?.estilo ?? "").trim(),
    grupoIndex: 0,
    colorG1: 0,
    colorG2: 0,
  };
}

/** Primer token de descripción color (NEGRO/BLANCO → NEGRO). Client-safe. */
export function primerTokenColor(desc: string | null | undefined): string {
  const raw = String(desc ?? "").trim();
  if (!raw) return "";
  const token = raw.split(/[/,\-–|]+/)[0]?.trim() ?? raw;
  return token.split(/\s+/)[0]?.trim() ?? token;
}
