"use client";

import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";
import { ProductImage } from "@/components/ProductImage";

type Props = {
  variants: ProductoCajaCard[];
  activeKey: string;
  onSelect: (key: string) => void;
};

/** Área 1 — carrusel horizontal mat·col (mismo par L+R). */
export function DepositoCarruselColores({ variants, activeKey, onSelect }: Props) {
  if (variants.length <= 1) return null;

  return (
    <section className="mt-3 shrink-0 border-t border-slate-100 pt-2">
      <p className="mb-1.5 px-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
        Colores · {variants.length}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 touch-manipulation">
        {variants.map((v) => {
          const p = v.producto;
          const active = v.key === activeKey;
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => onSelect(v.key)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${
                active ? "border-rimec-azul ring-2 ring-rimec-azul/30" : "border-slate-200"
              }`}
              aria-label={`Color ${p.color_code}`}
              aria-pressed={active}
            >
              <ProductImage
                src={p.imagen_url_thumb}
                fallbackSrc={p.imagen_url_flat}
                linea={p.linea_codigo_proveedor}
                ref={p.referencia_codigo_proveedor}
                material={p.material_code}
                color={p.color_code}
                imagenNombre={p.imagen_nombre}
                alt=""
                className="h-full w-full"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
