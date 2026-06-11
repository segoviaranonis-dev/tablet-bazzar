"use client";

import { ProductImage } from "@/components/ProductImage";
import { TouchPad } from "@/components/cadena/TouchPad";
import type { GrupoPrincipal } from "@/lib/cadena";

type Props = {
  grupos: GrupoPrincipal[];
  grupoIndex: number;
  colorIndex: number;
  onStepColor: (delta: number) => void;
};

export function MazoMaterialNaipes({
  grupos,
  grupoIndex,
  colorIndex,
  onStepColor,
}: Props) {
  const grupo = grupos[grupoIndex] ?? grupos[0];
  if (!grupo) return null;

  const extraColores = Math.max(0, grupo.colores.length - 1);
  const peekColores = grupo.colores.slice(1, 4);

  return (
    <div className="flex w-full flex-col items-stretch gap-1 px-1 pb-1">
      <TouchPad
        onClick={() => onStepColor(1)}
        ariaLabel="Rotar colores"
        className="relative mx-auto min-h-[108px] min-w-[88px] p-1"
      >
        {peekColores.map((c, i) => (
          <div
            key={`peek-${c.color_code}-${i}`}
            className="pointer-events-none absolute inset-1 overflow-hidden rounded-sm border border-br-stone/30 bg-white shadow-sm"
            style={{
              transform: `translate(${(i + 1) * 5}px, ${-(i + 1) * 4}px) rotate(${(i + 1) * 3}deg)`,
              zIndex: i,
              opacity: 0.78 - i * 0.1,
            }}
          >
            <ProductImage
              linea={c.linea_codigo_proveedor}
              ref={c.referencia_codigo_proveedor}
              material={c.material_code}
              color={c.color_code}
              imagenNombre={c.imagen_nombre}
              alt=""
              variant="thumb"
            />
          </div>
        ))}
        <div className="relative z-10 h-[100px] w-[80px] overflow-hidden rounded-sm border border-br-charcoal/80 bg-white shadow-md">
          {grupo.colores[colorIndex] ? (
            <ProductImage
              linea={grupo.colores[colorIndex].linea_codigo_proveedor}
              ref={grupo.colores[colorIndex].referencia_codigo_proveedor}
              material={grupo.colores[colorIndex].material_code}
              color={grupo.colores[colorIndex].color_code}
              imagenNombre={grupo.colores[colorIndex].imagen_nombre}
              alt=""
              variant="thumb"
            />
          ) : null}
        </div>
        {extraColores > 0 && (
          <span className="pointer-events-none absolute -right-1 -top-1 z-20 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-br-navy px-1 text-[10px] font-medium text-br-cream">
            +{extraColores}
          </span>
        )}
      </TouchPad>
    </div>
  );
}
