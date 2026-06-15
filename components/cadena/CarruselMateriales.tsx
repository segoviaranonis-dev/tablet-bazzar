"use client";

import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/ProductImage";
import { TouchPad } from "@/components/cadena/TouchPad";
import { buildCarouselWindow } from "@/lib/cadena-carousel";
import type { GrupoPrincipal } from "@/lib/cadena";

type Props = {
  grupos: GrupoPrincipal[];
  grupoIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

function previewGrupo(g: GrupoPrincipal) {
  return g.colores[0] ?? null;
}

export function CarruselMateriales({
  grupos,
  grupoIndex,
  onSelect,
  className = "",
}: Props) {
  const activeRef = useRef<HTMLDivElement>(null);
  const before = 1;
  const after = 3;
  const items = buildCarouselWindow(grupoIndex, grupos.length, before, after);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [grupoIndex]);

  if (grupos.length === 0) return null;

  return (
    <div className={`flex w-full flex-row items-stretch ${className}`}>
      <div className="flex min-h-0 flex-1 flex-row items-center justify-center gap-1.5 overflow-auto scroll-smooth px-1 snap-x snap-mandatory">
        {items.map(({ idx, offset }) => {
          const g = grupos[idx];
          if (!g) return null;
          const preview = previewGrupo(g);
          const active = idx === grupoIndex;
          const rot = offset * 2;
          const scale = active ? 1.03 : 0.95 - Math.min(Math.abs(offset) * 0.02, 0.08);

          return (
            <div
              key={`mat-${g.key}-${offset}`}
              ref={active && offset === 0 ? activeRef : undefined}
                className={`shrink-0 snap-center${active ? "" : " [content-visibility:auto]"}`}
            >
              <TouchPad
                onClick={() => onSelect(idx)}
                ariaLabel={`Material ${g.material}`}
                className="p-0.5"
              >
                <div
                  className={`relative h-[104px] w-[80px] min-h-[104px] min-w-[80px] overflow-hidden rounded-sm border-2 bg-white shadow-sm transition-transform duration-150 ${
                    active ? "tile-selected" : "border-[#c4bdb4]"
                  }`}
                  style={{ transform: `rotate(${rot}deg) scale(${scale})` }}
                  aria-current={active ? "true" : undefined}
                >
                  <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-white/95 to-transparent px-1 py-0.5 text-center font-mono text-[8px] leading-none text-[#6b6560]">
                    {g.linea}.{g.referencia}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-white/95 to-transparent px-1 py-0.5 text-center font-mono text-[7px] text-[#1a1a1a]">
                    {g.material}
                  </div>
                  <div className="relative h-full w-full bg-white pt-3 pb-3">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
