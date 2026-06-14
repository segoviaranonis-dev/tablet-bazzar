import type { DepositoFila, ParLineaRef } from "@/lib/cadena";

/** Ventana de índices para carrusel — sin duplicar cuando hay pocos ítems. */
export function buildCarouselWindow(
  current: number,
  total: number,
  before: number,
  after: number,
): { idx: number; offset: number }[] {
  if (total <= 0) return [];
  if (total === 1) return [{ idx: 0, offset: 0 }];

  const slots = before + after + 1;
  if (total <= slots) {
    return Array.from({ length: total }, (_, i) => ({ idx: i, offset: i - current }));
  }

  const items: { idx: number; offset: number }[] = [];
  for (let d = -before; d <= after; d++) {
    items.push({
      idx: ((current + d) % total + total) % total,
      offset: d,
    });
  }
  return items;
}

/** Primera fila representativa de un par L+R (thumbnail del naipe). Prefiere color con más stock. */
export function filaPreviewPar(par: ParLineaRef): DepositoFila | null {
  let best: DepositoFila | null = null;
  let bestQty = -1;
  for (const g of par.gruposMaterial) {
    for (const c of g.colores) {
      if (c.cantidad > bestQty) {
        bestQty = c.cantidad;
        best = c;
      }
    }
    if (best) continue;
    const f = g.colores[0];
    if (f && f.cantidad > bestQty) {
      bestQty = f.cantidad;
      best = f;
    }
  }
  if (best) return best;
  const g0 = par.gruposMaterial[0];
  return g0?.colores[0] ?? par.coloresLR[0] ?? null;
}

/** Índices para carrusel: anteriores + actual + siguientes (con wrap). */
export function windowIndices(
  current: number,
  total: number,
  before: number,
  after: number,
): number[] {
  if (total <= 0) return [];
  const out: number[] = [];
  for (let d = -before; d <= after; d++) {
    out.push(((current + d) % total + total) % total);
  }
  return out;
}

export type NaipeLRProps = {
  par: ParLineaRef;
  index: number;
  active: boolean;
  offsetFromActive: number;
  orientation: "horizontal" | "vertical";
  onSelect: (index: number) => void;
};
