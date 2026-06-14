"use client";

import { useMemo } from "react";
import { ProductImage } from "@/components/ProductImage";
import type { DepositoFila } from "@/lib/cadena";
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
    | "material_code"
    | "color_code"
    | "imagen_nombre"
  >;
  alt: string;
};

const HERO_BOX =
  "relative aspect-square shrink-0 overflow-hidden bg-[#F8FAFC] p-3 w-[min(62vmin,calc(100vh-12rem))] h-[min(62vmin,calc(100vh-12rem))]";

export function HeroProductImage({ fila, alt }: Props) {
  const loadSequence = useMemo(
    () =>
      pickHeroLoadSequence({
        imagen_url_thumb: fila.imagen_url_thumb ?? null,
        imagen_url_hero: fila.imagen_url_hero ?? null,
        imagen_url_flat: fila.imagen_url_flat ?? null,
      }),
    [fila.imagen_url_thumb, fila.imagen_url_hero, fila.imagen_url_flat],
  );

  const isAuditSku =
    `${fila.linea_codigo_proveedor}.${fila.referencia_codigo_proveedor}` === "4215.1034";

  if (loadSequence.length === 0) {
    return <div className={HERO_BOX} aria-hidden data-hero-frame="v14" />;
  }

  return (
    <div
      className={HERO_BOX}
      data-hero-frame="v14-fallback"
      data-hero-sku={isAuditSku ? "4215.1034" : undefined}
    >
      <ProductImage
        variant="hero"
        loadSequence={loadSequence}
        linea={fila.linea_codigo_proveedor}
        ref={fila.referencia_codigo_proveedor}
        material={fila.material_code}
        color={fila.color_code}
        imagenNombre={fila.imagen_nombre}
        alt={alt}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
