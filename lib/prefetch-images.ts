import type { DepositoFila } from "./cadena";

import { pickHeroLoadSequence, type ImagenUrls } from "./product-image";



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

  const img = new Image();

  img.decoding = "async";

  img.onload = () => {

    void img.decode?.().catch(() => undefined);

  };

  img.src = url;

}



export function prefetchRowThumb(row: Pick<DepositoFila, "imagen_url_thumb">): void {

  if (row.imagen_url_thumb) {

    prefetchImageUrl(row.imagen_url_thumb);

  }

}



export function prefetchRowHero(

  row: Pick<DepositoFila, "imagen_url_thumb" | "imagen_url_hero" | "imagen_url_flat">,

): void {

  const urls: ImagenUrls = {

    imagen_url_thumb: row.imagen_url_thumb ?? null,

    imagen_url_hero: row.imagen_url_hero ?? null,

    imagen_url_flat: row.imagen_url_flat ?? null,

  };

  for (const url of pickHeroLoadSequence(urls)) {

    prefetchImageUrl(url);

  }

}

