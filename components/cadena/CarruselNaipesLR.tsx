"use client";

import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/ProductImage";
import { TouchPad } from "@/components/cadena/TouchPad";
import { filaPreviewPar, buildCarouselWindow, type NaipeLRProps } from "@/lib/cadena-carousel";
import type { DepositoFila, ParLineaRef } from "@/lib/cadena";

function NaipesCard({
  par,
  index,
  active,
  offsetFromActive,
  orientation,
  onSelect,
  previewFila,
}: NaipeLRProps) {
  const preview =
    active && previewFila ? filaPreviewPar(par, previewFila) : filaPreviewPar(par);
  const isH = orientation === "horizontal";

  const shell = isH
    ? "h-[104px] w-[80px] min-h-[104px] min-w-[80px]"
    : "h-[84px] w-[96px] min-h-[84px] min-w-[96px]";

  const activeShell = active
    ? isH
      ? "tile-selected shadow-sm"
      : "tile-selected shadow-sm"
    : "border-[#c4bdb4] opacity-90";

  return (
    <TouchPad
      onClick={() => onSelect(index)}
      ariaLabel={`${par.linea}.${par.referencia}`}
      className={`shrink-0 snap-center p-0.5 ${isH ? "" : "w-[96px]"}`}
    >
      <div
        className={`relative overflow-hidden rounded-sm border bg-white shadow-sm transition-colors duration-150 ${shell} ${activeShell}`}
        aria-current={active ? "true" : undefined}
        data-active={active ? "true" : undefined}
      >
        {!isH && active ? (
          <span
            className="pointer-events-none absolute left-0 top-0 z-20 h-full w-1 bg-[#1b2a41]"
            aria-hidden
          />
        ) : null}
        <div
          className={`absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-white/95 to-transparent px-1 py-0.5 text-center font-mono text-[8px] leading-none ${
            active ? "font-bold text-[#1a1a1a]" : "text-[#6b6560]"
          }`}
        >
          {par.linea}.{par.referencia}
        </div>
        <div className="relative h-full w-full bg-white pt-3 pb-3 px-0.5">
          {preview ? (
            <ProductImage
              src={preview.imagen_url_thumb}
              fallbackSrc={preview.imagen_url_flat}
              linea={preview.linea_codigo_proveedor}
              ref={preview.referencia_codigo_proveedor}
              material={preview.material_code}
              color={preview.color_code}
              imagenNombre={preview.imagen_nombre}
              alt=""
              variant="thumb"
              priority={active}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xl opacity-30">—</div>
          )}
        </div>
      </div>
    </TouchPad>
  );
}

type CarruselProps = {
  pares: ParLineaRef[];
  parIndex: number;
  onSelect: (index: number) => void;
  orientation: "horizontal" | "vertical";
  before: number;
  after: number;
  className?: string;
  /** Color activo del par seleccionado — alinea miniatura sidebar con hero. */
  previewFila?: DepositoFila | null;
};

export function CarruselNaipesLR({
  pares,
  parIndex,
  onSelect,
  orientation,
  before,
  after,
  className = "",
  previewFila = null,
}: CarruselProps) {
  const activeRef = useRef<HTMLDivElement>(null);
  const isVertical = orientation === "vertical";

  const items = buildCarouselWindow(parIndex, pares.length, before, after);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: isVertical ? "center" : "nearest",
      inline: isVertical ? "nearest" : "center",
    });
  }, [parIndex, isVertical]);

  return (
    <div
      className={`flex ${isVertical ? "h-full flex-col" : "w-full flex-row items-stretch"} ${className}`}
    >
      <div
        className={`flex min-h-0 flex-1 gap-1.5 overflow-auto scroll-smooth ${
          isVertical
            ? "flex-col items-center py-1 snap-y snap-mandatory px-1"
            : "flex-row items-center justify-center px-1 snap-x snap-mandatory"
        }`}
      >
        {items.map(({ idx, offset }) => (
          <div
            key={`${orientation}-${idx}-d${offset}`}
            ref={idx === parIndex && offset === 0 ? activeRef : undefined}
          >
            <NaipesCard
              par={pares[idx]}
              index={idx}
              active={idx === parIndex}
              offsetFromActive={offset}
              orientation={orientation}
              onSelect={onSelect}
              previewFila={idx === parIndex ? previewFila : null}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
