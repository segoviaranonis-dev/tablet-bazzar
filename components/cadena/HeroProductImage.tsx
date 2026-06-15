"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DepositoFila } from "@/lib/cadena";
import { isImageDecoded, preloadImageDecoded } from "@/lib/image-decode-cache";
import { pickHeroLoadSequence } from "@/lib/product-image";

/** SKU fijo auditoría — 4215.1034 → 4215-1034-28458-98904.jpg */
export const HERO_CASO_4215_STEM = "4215-1034-28458-98904.jpg";

type Props = {
  fila: Pick<
    DepositoFila,
    | "imagen_url_thumb"
    | "imagen_url_hero"
    | "imagen_url_flat"
    | "linea_codigo_proveedor"
    | "referencia_codigo_proveedor"
  >;
  alt: string;
};

const HERO_BOX =
  "relative grid aspect-square shrink-0 place-items-center overflow-hidden bg-[#F8FAFC] w-[min(58vmin,calc(100dvh-13rem),100%)] max-h-full max-w-full";

export function HeroProductImage({ fila, alt }: Props) {
  const sequence = useMemo(
    () =>
      pickHeroLoadSequence({
        imagen_url_thumb: fila.imagen_url_thumb ?? null,
        imagen_url_hero: fila.imagen_url_hero ?? null,
        imagen_url_flat: fila.imagen_url_flat ?? null,
      }),
    [fila.imagen_url_thumb, fila.imagen_url_hero, fila.imagen_url_flat],
  );

  const src = sequence[0] ?? null;

  const [shown, setShown] = useState<string | null>(src);
  const shownRef = useRef<string | null>(src);

  useEffect(() => {
    if (!src) {
      shownRef.current = null;
      setShown(null);
      return;
    }
    if (src === shownRef.current) return;

    if (isImageDecoded(src)) {
      shownRef.current = src;
      setShown(src);
      return;
    }

    let cancelled = false;
    void (async () => {
      for (const url of sequence) {
        if (cancelled) return;
        if (await preloadImageDecoded(url)) {
          if (!cancelled) {
            shownRef.current = url;
            setShown(url);
          }
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src, sequence]);

  const isAuditSku =
    `${fila.linea_codigo_proveedor}.${fila.referencia_codigo_proveedor}` === "4215.1034";

  if (!shown) {
    return <div className={HERO_BOX} aria-hidden data-hero-frame="v9-empty" />;
  }

  return (
    <div
      className={HERO_BOX}
      data-hero-frame="v9-lg-first"
      data-hero-sku={isAuditSku ? "4215.1034" : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shown}
        alt={alt}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="block h-full w-full object-contain object-center"
      />
    </div>
  );
}
