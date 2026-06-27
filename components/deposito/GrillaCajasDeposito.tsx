"use client";

import { useMemo } from "react";
import type { DepositoProducto } from "@/app/api/deposito/[cliente_id]/route";
import { ProductImage } from "@/components/ProductImage";
import { agruparProductosPorCaja } from "@/lib/depositos/agrupar-cajas";
import { analizarVidrieraCaja } from "@/lib/depositos/vidriera-estrellas";
import { TablaGradaDeposito } from "./TablaGradaDeposito";

type Props = {
  productos: DepositoProducto[];
  tiendaLabel: string;
  codigoDeposito: string;
  clienteId: number;
};

export function GrillaCajasDeposito({ productos, tiendaLabel, codigoDeposito, clienteId }: Props) {
  const cards = useMemo(() => agruparProductosPorCaja(productos), [productos]);

  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-lg text-slate-600">Sin cajas en este depósito o sin coincidencias.</p>
      </div>
    );
  }

  const totalPares = cards.reduce((s, c) => s + c.totalPares, 0);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-slate-600">
        <span className="rounded-full bg-rimec-azul/10 px-3 py-1 font-bold text-rimec-azul">
          {cards.length.toLocaleString("es-PY")} cajas
        </span>
        <span className="rounded-full bg-bazzar-naranja/15 px-3 py-1 font-bold text-bazzar-naranja-dark">
          {Math.round(totalPares).toLocaleString("es-PY")} pares
        </span>
        <span className="text-xs text-slate-500">
          {codigoDeposito} · agrupación L+R+material+color
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {cards.map((card) => {
          const p = card.producto;
          const vidriera = analizarVidrieraCaja({
            moleculeKey: card.key,
            clienteId,
            tallas: card.tallas,
            stock: card.stock,
          });
          return (
            <article
              key={card.key}
              className="flex w-[calc(50%-0.375rem)] max-w-[220px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-[180px] md:w-[200px]"
            >
              <div className="relative aspect-square bg-slate-100">
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
                <span className="absolute right-2 top-2 rounded-full bg-bazzar-naranja px-2 py-1 text-xs font-bold text-white">
                  {Math.round(card.totalPares)} p
                </span>
                {card.totalPares <= 0 && (
                  <span className="absolute inset-x-2 bottom-2 rounded-lg bg-amber-400/95 py-1 text-center text-xs font-bold text-amber-950">
                    ⭐⭐⭐ Caja cerrada
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="text-xs font-bold uppercase text-rimec-azul">{p.marca}</p>
                <p className="font-mono text-sm font-semibold text-slate-900">
                  {p.linea_codigo_proveedor}.{p.referencia_codigo_proveedor}
                </p>
                <p className="line-clamp-2 text-xs text-slate-600">
                  {[p.descp_material, p.descp_color].filter(Boolean).join(" · ") ||
                    `${p.material_code} / ${p.color_code}`}
                </p>
                <div className="mt-auto">
                  <TablaGradaDeposito
                    tienda={tiendaLabel}
                    estilo={card.estilo}
                    tallas={card.tallas}
                    stock={card.stock}
                    vidrieraActiva={vidriera.vidrieraActiva}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
