"use client";

import { useMemo, useState } from "react";
import type { DepositoFila } from "@/lib/cadena";
import { useHeroProgressiveSrc } from "@/lib/use-hero-progressive-src";
import { ProductLightbox } from "@/components/cadena/ProductLightbox";

export const HERO_CASO_4215_STEM = "4215-1034-28458-98904.jpg";

type Props = {
  fila: Pick<
    DepositoFila,
    | "imagen_url_thumb"
    | "imagen_url_hero"
    | "imagen_url_flat"
    | "linea_codigo_proveedor"
    | "referencia_codigo_proveedor"
    | "material_code"
    | "color_code"
  >;
  alt: string;
};

/** Marco = 100% del host medido (sin vmin ni aspect-square). */
const HERO_BOX = "cadena-hero-frame cursor-zoom-in";

function filaKey(fila: Props["fila"]): string {
  return [
    fila.linea_codigo_proveedor,
    fila.referencia_codigo_proveedor,
    fila.material_code,
    fila.color_code,
  ].join("|");
}

export function HeroProductImage({ fila, alt }: Props) {
  const skuKey = filaKey(fila);
  const [lightbox, setLightbox] = useState(false);

  const urls = useMemo(
    () => ({
      imagen_url_thumb: fila.imagen_url_thumb ?? null,
      imagen_url_hero: fila.imagen_url_hero ?? null,
      imagen_url_flat: fila.imagen_url_flat ?? null,
    }),
    [fila.imagen_url_thumb, fila.imagen_url_hero, fila.imagen_url_flat],
  );

  const { shown, zoomSrc, isHighQuality } = useHeroProgressiveSrc(urls, skuKey);

  const isAuditSku =
    `${fila.linea_codigo_proveedor}.${fila.referencia_codigo_proveedor}` === "4215.1034";

  if (!shown) {
    return <div className={HERO_BOX.replace("cursor-zoom-in", "")} aria-hidden data-hero-frame="v16-fill-host" />;
  }

  return (
    <>
      <button
        type="button"
        className={HERO_BOX}
        data-hero-frame="v16-fill-host"
        data-hero-quality={isHighQuality ? "lg" : "preview"}
        data-hero-sku={isAuditSku ? "4215.1034" : undefined}
        onClick={() => zoomSrc && setLightbox(true)}
        aria-label={`Ampliar ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={skuKey}
          src={shown}
          alt={alt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </button>
      {lightbox && zoomSrc ? (
        <ProductLightbox src={zoomSrc} alt={alt} onClose={() => setLightbox(false)} />
      ) : null}
    </>
  );
}
