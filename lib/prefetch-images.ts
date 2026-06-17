import type { DepositoFila, ParLineaRef } from "./cadena";
import { filaPreviewPar } from "./cadena-carousel";
import { preloadImageDecoded } from "./image-decode-cache";

const PREFETCH_CAP = 200;
const prefetched = new Set<string>();
const prefetchOrder: string[] = [];

function trackPrefetch(url: string): void {
  if (prefetched.has(url)) return;
  prefetched.add(url);
  prefetchOrder.push(url);
  while (prefetchOrder.length > PREFETCH_CAP) {
    const old = prefetchOrder.shift();
    if (old) prefetched.delete(old);
  }
}

export function prefetchImageUrl(url: string): void {
  if (!url || prefetched.has(url)) return;
  trackPrefetch(url);
  void preloadImageDecoded(url);
}

export function prefetchRowThumb(row: Pick<DepositoFila, "imagen_url_thumb">): void {
  if (row.imagen_url_thumb) prefetchImageUrl(row.imagen_url_thumb);
}

export function prefetchRowHero(
  row: Pick<DepositoFila, "imagen_url_thumb" | "imagen_url_hero" | "imagen_url_flat">,
): void {
  if (row.imagen_url_hero) prefetchImageUrl(row.imagen_url_hero);
  if (row.imagen_url_thumb && row.imagen_url_thumb !== row.imagen_url_hero) {
    prefetchImageUrl(row.imagen_url_thumb);
  }
  if (row.imagen_url_flat) prefetchImageUrl(row.imagen_url_flat);
}

/** Precarga colores del grupo activo + vecinos L+R y swipe color/material. */
export function prefetchCadenaNeighborhood(
  par: ParLineaRef | null,
  parIndex: number,
  paresNav: ParLineaRef[],
  grupoIndex: number,
  colorG1: number,
  activa: DepositoFila | null,
): void {
  if (activa) {
    prefetchRowThumb(activa);
    prefetchRowHero(activa);
  }

  const lrBefore = 2;
  const lrAfter = 2;
  for (let d = -lrBefore; d <= lrAfter; d++) {
    const idx = ((parIndex + d) % paresNav.length + paresNav.length) % paresNav.length;
    const preview = filaPreviewPar(paresNav[idx]);
    if (preview) prefetchRowThumb(preview);
  }

  if (!par) return;

  const grupo = par.gruposMaterial[grupoIndex] ?? par.gruposMaterial[0];
  if (grupo) {
    for (const c of grupo.colores) {
      prefetchRowThumb(c);
      prefetchRowHero(c);
    }
    const n = grupo.colores.length;
    if (n > 1) {
      prefetchRowHero(grupo.colores[(colorG1 + 1) % n]);
      prefetchRowHero(grupo.colores[(colorG1 - 1 + n) % n]);
    }
  }

  const nGr = par.gruposMaterial.length;
  if (nGr > 1) {
    for (const gi of [(grupoIndex + 1) % nGr, (grupoIndex - 1 + nGr) % nGr]) {
      const adj = par.gruposMaterial[gi]?.colores[0];
      if (adj) {
        prefetchRowThumb(adj);
        prefetchRowHero(adj);
      }
    }
  }
}
