"use client";

import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/ProductImage";
import { TouchPad } from "@/components/cadena/TouchPad";
import { type DepositoFila } from "@/lib/cadena";
import { sameColorFila } from "@/lib/codigo-busqueda";

type Props = {
  colores: DepositoFila[];
  activa: DepositoFila | null;
  onSelect: (fila: DepositoFila) => void;
  /** Si hay más de un material en el par, mostrar código material en la miniatura. */
  showMaterialBadge?: boolean;
  compact?: boolean;
  className?: string;
};

export function CarruselColores({
  colores,
  activa,
  onSelect,
  showMaterialBadge = false,
  compact = false,
  className = "",
}: Props) {
  const activeRef = useRef<HTMLDivElement>(null);
  const activeIndex = colores.findIndex((c) => sameColorFila(activa, c));

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  if (colores.length === 0) return null;

  return (
    <div className={`border-b border-[#e8e2d9] bg-[#faf8f5] ${className}`}>
      {!compact && (
        <p className="px-2 pb-0.5 pt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#6b6560]">
          Colores · {colores.length}
        </p>
      )}
      <div
        className={`flex gap-1.5 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] ${
          compact ? "px-2 py-1.5" : "px-2 pb-2 pt-0.5"
        }`}
      >
        {colores.map((c, idx) => {
          const selected = idx === activeIndex;
          return (
            <div
              key={`${c.material_code}-${c.color_code}-${c.grada}`}
              ref={selected ? activeRef : undefined}
              className="shrink-0 snap-center"
            >
              <TouchPad
                onClick={() => onSelect(c)}
                ariaLabel={`Color ${c.descp_color || c.color_code}`}
                className="p-0.5"
              >
                <div
                  className={`relative overflow-hidden rounded-md border-2 bg-white shadow-sm transition-transform duration-150 ${
                    compact ? "h-[72px] w-[60px] min-h-[72px] min-w-[60px]" : "h-[88px] w-[72px] min-h-[88px] min-w-[72px]"
                  } ${selected ? "tile-selected scale-[1.02]" : "border-[#c4bdb4]"}`}
                  aria-current={selected ? "true" : undefined}
                >
                  {showMaterialBadge && (
                    <span className="absolute inset-x-0 top-0 z-10 bg-white/90 px-0.5 py-px text-center font-mono text-[7px] leading-none text-[#6b6560]">
                      {c.material_code}
                    </span>
                  )}
                  <ProductImage
                    src={c.imagen_url_thumb}
                    fallbackSrc={c.imagen_url_flat}
                    linea={c.linea_codigo_proveedor}
                    ref={c.referencia_codigo_proveedor}
                    material={c.material_code}
                    color={c.color_code}
                    imagenNombre={c.imagen_nombre}
                    alt=""
                    variant="thumb"
                    priority={selected}
                  />
                  <span className="absolute inset-x-0 bottom-0 z-10 truncate bg-gradient-to-t from-white via-white/95 to-transparent px-0.5 pb-0.5 pt-2 text-center font-mono text-[8px] font-semibold text-[#1a1a1a]">
                    {c.descp_color?.trim() || c.color_code}
                  </span>
                </div>
              </TouchPad>
            </div>
          );
        })}
      </div>
    </div>
  );
}
