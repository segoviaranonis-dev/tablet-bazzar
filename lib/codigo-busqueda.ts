import type { DepositoFila, ParLineaRef } from "./cadena";

export type CodigoBusqueda = {
  linea: string;
  referencia: string;
  material?: string;
  color?: string;
};

/**
 * Parsea códigos que conocen los vendedores:
 * - 1122.828
 * - 1122.828-100
 * - 1122.828-100-5
 * - 1122-828-100-5
 */
export function parseCodigoVendedor(raw: string): CodigoBusqueda | null {
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return null;

  const dot = /^(\d+)\.(\d+)(?:[-.](\d+))?(?:[-.](\d+))?$/;
  const m1 = s.match(dot);
  if (m1) {
    return {
      linea: m1[1],
      referencia: m1[2],
      material: m1[3],
      color: m1[4],
    };
  }

  const dash = s.split("-").filter(Boolean);
  if (dash.length >= 2 && dash.every((p) => /^\d+$/.test(p))) {
    return {
      linea: dash[0],
      referencia: dash[1],
      material: dash[2],
      color: dash[3],
    };
  }

  return null;
}

export type CadenaIndex = {
  parIndex: number;
  grupoIndex: number;
  colorGrupo1Index: number;
  colorGrupo2Index: number;
};

export function resolveCodigoEnCadena(
  pares: ParLineaRef[],
  codigo: CodigoBusqueda,
): CadenaIndex | null {
  const parIndex = pares.findIndex(
    (p) => p.linea === codigo.linea && p.referencia === codigo.referencia,
  );
  if (parIndex < 0) return null;

  const par = pares[parIndex];
  let grupoIndex = 0;
  if (codigo.material) {
    const gi = par.gruposMaterial.findIndex((g) => g.material === codigo.material);
    if (gi >= 0) grupoIndex = gi;
  }

  const grupo = par.gruposMaterial[grupoIndex] ?? par.gruposMaterial[0];
  let colorGrupo1Index = 0;
  if (codigo.color && grupo) {
    const ci = grupo.colores.findIndex((c) => c.color_code === codigo.color);
    if (ci >= 0) colorGrupo1Index = ci;
  }

  let colorGrupo2Index = 0;
  if (codigo.color) {
    const c2 = par.coloresLR.findIndex((c) => c.color_code === codigo.color);
    if (c2 >= 0) colorGrupo2Index = c2;
  }

  return { parIndex, grupoIndex, colorGrupo1Index, colorGrupo2Index };
}

export function filaActiva(
  par: ParLineaRef,
  grupoIndex: number,
  colorGrupo1Index: number,
): DepositoFila | null {
  const grupo = par.gruposMaterial[grupoIndex] ?? par.gruposMaterial[0];
  if (!grupo) return null;
  return grupo.colores[colorGrupo1Index] ?? grupo.colores[0] ?? null;
}

/** Índices grupo/color al elegir una fila del par L+R. */
export function resolveIndicesForFila(
  par: ParLineaRef,
  fila: DepositoFila,
): { grupoIndex: number; colorG1: number } | null {
  for (let gi = 0; gi < par.gruposMaterial.length; gi++) {
    const g = par.gruposMaterial[gi];
    const ci = g.colores.findIndex(
      (c) =>
        String(c.color_code).trim() === String(fila.color_code).trim() &&
        String(c.material_code).trim() === String(fila.material_code).trim(),
    );
    if (ci >= 0) return { grupoIndex: gi, colorG1: ci };
  }
  return null;
}

export function sameColorFila(a: DepositoFila | null, b: DepositoFila): boolean {
  if (!a) return false;
  return (
    String(a.color_code).trim() === String(b.color_code).trim() &&
    String(a.material_code).trim() === String(b.material_code).trim()
  );
}
