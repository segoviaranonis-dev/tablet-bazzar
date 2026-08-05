"use client";

import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";
import type { VidrieraCajaEstado } from "@/lib/depositos/vidriera-estrellas";
import { ProductImage } from "@/components/ProductImage";
import { formatPrecioGs } from "@/lib/precio-venta";
import { TablaGradaDeposito } from "./TablaGradaDeposito";

type Props = {
  card: ProductoCajaCard;
  tiendaLabel: string;
  vidriera: VidrieraCajaEstado;
  /** true = solo foto; false = gradas visibles en todas las tarjetas */
  colapsarTodo: boolean;
  compactGrid: boolean;
  onImageTap?: () => void;
};

function FilaCodigoPrecio({
  linea,
  referencia,
  precio,
}: {
  linea: string | number;
  referencia: string | number;
  precio: number | null | undefined;
}) {
  return (
    <div className="flex items-baseline justify-between gap-1 px-2 pb-2 pt-0.5">
      <p className="min-w-0 truncate font-mono text-[10px] text-slate-800 sm:text-[11px]">
        {linea}.{referencia}
      </p>
      {precio != null ? (
        <p className="shrink-0 whitespace-nowrap text-[10px] tabular-nums text-orange-600 sm:text-[11px]">
          {formatPrecioGs(precio)}
          <span className="text-[8px] font-normal text-slate-400"> / par</span>
        </p>
      ) : (
        <p className="shrink-0 text-[8px] text-slate-400">Sin LPN</p>
      )}
    </div>
  );
}

export function TarjetaCajaDeposito({
  card,
  tiendaLabel,
  vidriera,
  colapsarTodo,
  compactGrid,
  onImageTap,
}: Props) {
  const p = card.producto;
  const subtitulo =
    [p.descp_material, p.descp_color].filter(Boolean).join(" · ") ||
    `${p.material_code} / ${p.color_code}`;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border border-slate-300 bg-white transition-[width,max-width] ${
        compactGrid
          ? "w-[calc(33.333%-0.5rem)] max-w-[150px] sm:w-[calc(25%-0.5625rem)] sm:max-w-[160px]"
          : "w-[calc(50%-0.375rem)] max-w-[220px] sm:w-[180px] md:w-[200px]"
      }`}
    >
      <div className="flex items-center justify-between gap-1 px-2 pb-0.5 pt-1.5">
        <p className="min-w-0 flex-1 truncate text-[9px] font-normal uppercase tracking-wide text-rimec-azul sm:text-[10px]">
          {p.marca}
        </p>
        <span className="shrink-0 rounded-full bg-bazzar-naranja px-1.5 py-0.5 text-[9px] font-bold text-white sm:px-2 sm:text-[10px]">
          {Math.round(card.totalPares)} p
        </span>
      </div>

      {onImageTap ? (
        <button
          type="button"
          onClick={onImageTap}
          className="relative aspect-square w-full touch-manipulation bg-white px-1 active:opacity-90"
          aria-label={`Ver detalle ${p.linea_codigo_proveedor}.${p.referencia_codigo_proveedor}`}
        >
          <ProductImage
            src={p.imagen_url_thumb}
            fallbackSrc={p.imagen_url_flat}
            linea={p.linea_codigo_proveedor}
            ref={p.referencia_codigo_proveedor}
            material={p.material_code}
            color={p.color_code}
            imagenNombre={p.imagen_nombre}
            alt={`${p.linea_codigo_proveedor}-${p.referencia_codigo_proveedor}`}
          />
          {card.totalPares <= 0 ? (
            <span className="pointer-events-none absolute inset-x-2 bottom-2 rounded-lg bg-amber-400/95 py-0.5 text-center text-[10px] font-bold text-amber-950">
              ⭐⭐⭐ Caja cerrada
            </span>
          ) : null}
        </button>
      ) : (
        <div className="relative aspect-square bg-white px-1">
          <ProductImage
            src={p.imagen_url_thumb}
            fallbackSrc={p.imagen_url_flat}
            linea={p.linea_codigo_proveedor}
            ref={p.referencia_codigo_proveedor}
            material={p.material_code}
            color={p.color_code}
            imagenNombre={p.imagen_nombre}
            alt={`${p.linea_codigo_proveedor}-${p.referencia_codigo_proveedor}`}
          />
          {card.totalPares <= 0 ? (
            <span className="absolute inset-x-2 bottom-2 rounded-lg bg-amber-400/95 py-0.5 text-center text-[10px] font-bold text-amber-950">
              ⭐⭐⭐ Caja cerrada
            </span>
          ) : null}
        </div>
      )}

      <FilaCodigoPrecio
        linea={p.linea_codigo_proveedor}
        referencia={p.referencia_codigo_proveedor}
        precio={card.precioUnitario}
      />

      {!colapsarTodo ? (
        <div className="space-y-2 border-t border-slate-100 px-2.5 pb-2.5 pt-2">
          <p className="line-clamp-2 text-[11px] leading-snug text-slate-600">{subtitulo}</p>
          <TablaGradaDeposito
            tienda={tiendaLabel}
            estilo={card.estilo}
            tallas={card.tallas}
            stock={card.stock}
            vidrieraActiva={vidriera.vidrieraActiva}
          />
        </div>
      ) : null}
    </article>
  );
}
