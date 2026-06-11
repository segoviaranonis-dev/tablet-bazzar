"use client";

import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/ProductImage";
import { TouchPad } from "@/components/cadena/TouchPad";
import { filaPreviewPar, buildCarouselWindow, type NaipeLRProps } from "@/lib/cadena-carousel";
import type { ParLineaRef } from "@/lib/cadena";

function NaipesCard({
  par,
  index,
  active,
  offsetFromActive,
  orientation,
  onSelect,
}: NaipeLRProps) {
  const preview = filaPreviewPar(par);
  const rot = orientation === "horizontal" ? offsetFromActive * 2 : 0;
  const scale = active ? 1.03 : 0.95 - Math.min(Math.abs(offsetFromActive) * 0.02, 0.08);

  const isH = orientation === "horizontal";
  const shell = isH
    ? "h-[104px] w-[80px] min-h-[104px] min-w-[80px]"
    : "h-[96px] w-full min-h-[96px] max-w-[112px]";

  return (
    <TouchPad
      onClick={() => onSelect(index)}
      ariaLabel={`${par.linea}.${par.referencia}`}
      className="shrink-0 snap-center p-0.5"
    >
      <div
        className={`relative overflow-hidden rounded-sm border bg-white shadow-sm transition-transform duration-150 ${shell} ${
          active ? "border-[#1a1a1a] ring-1 ring-[#1a1a1a]/20" : "border-[#c4bdb4]"
        }`}
        style={{ transform: `rotate(${rot}deg) scale(${scale})` }}
        aria-current={active ? "true" : undefined}
      >
        <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-white/95 to-transparent px-1 py-0.5 text-center font-mono text-[8px] leading-none text-[#6b6560]">
          {par.linea}.{par.referencia}
        </div>
        <div className="relative h-full w-full bg-white pt-3">
          {preview ? (
            <ProductImage
              linea={preview.linea_codigo_proveedor}
              ref={preview.referencia_codigo_proveedor}
              material={preview.material_code}
              color={preview.color_code}
              imagenNombre={preview.imagen_nombre}
              alt=""
              variant="thumb"
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
};

export function CarruselNaipesLR({
  pares,
  parIndex,
  onSelect,
  orientation,
  before,
  after,
  className = "",
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
            ? "flex-col items-center py-1 snap-y snap-mandatory"
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}
