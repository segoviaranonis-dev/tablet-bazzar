"use client";

import type { DepositoNavIndex } from "@/lib/depositos/nav-cajas";
import { cardForParKey } from "@/lib/depositos/nav-cajas";
import { ProductImage } from "@/components/ProductImage";

type Props = {
  nav: DepositoNavIndex;
  activeParKey: string;
  onSelectPar: (parKey: string) => void;
};

/** Área 3 — sidebar vertical otros pares L+R del filtro. */
export function DepositoSidebarReferencias({ nav, activeParKey, onSelectPar }: Props) {
  if (nav.parKeys.length <= 1) return null;

  return (
    <aside className="hidden w-[88px] shrink-0 flex-col border-l border-slate-200 bg-slate-50/80 py-2 md:flex">
      <p className="px-1 text-center text-[8px] font-bold uppercase tracking-wide text-slate-500">
        Refs
      </p>
      <div className="mt-1 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1">
        {nav.parKeys.map((pk) => {
          const card = cardForParKey(nav, pk);
          if (!card) return null;
          const p = card.producto;
          const active = pk === activeParKey;
          const [linea, ref] = pk.split("|");
          return (
            <button
              key={pk}
              type="button"
              onClick={() => onSelectPar(pk)}
              className={`flex flex-col items-center gap-0.5 rounded-lg border p-0.5 touch-manipulation ${
                active
                  ? "border-rimec-azul bg-white ring-1 ring-rimec-azul/40"
                  : "border-slate-200 bg-white/90 active:bg-white"
              }`}
              aria-pressed={active}
            >
              <span className="font-mono text-[8px] font-semibold leading-none text-slate-600">
                {linea}.{ref}
              </span>
              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-white">
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
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
