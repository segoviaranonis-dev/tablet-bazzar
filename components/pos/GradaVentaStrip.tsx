"use client";

import { memo, useMemo, useState } from "react";
import type { DepositoFila } from "@/lib/cadena";
import { filaToCartInput, gradasDesdeStock } from "@/lib/cart/pos-cart";
import { usePosCart } from "@/lib/cart/PosCartContext";
import { TouchPad } from "@/components/cadena/TouchPad";
import { formatGradaDisplay, type StockUbicacionBloque } from "@/lib/stock-otros-locales";

type Props = {
  activa: DepositoFila | null;
  clienteId: number;
  marca: string;
  ubicaciones: StockUbicacionBloque[];
  cantidadLocal: number | null;
};

export const GradaVentaStrip = memo(function GradaVentaStrip({
  activa,
  clienteId,
  marca,
  ubicaciones,
  cantidadLocal,
}: Props) {
  const { addPar, count, setOpen, flashGrada } = usePosCart();
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const opciones = useMemo(() => {
    const actual = ubicaciones.find((u) => u.esActual);
    const fromLive = actual ? gradasDesdeStock(actual.tallas, actual.stock) : [];

    if (fromLive.length > 0) return fromLive;

    if (activa?.grada?.trim() && (cantidadLocal ?? activa.cantidad) > 0) {
      return [
        {
          grada: activa.grada.trim(),
          stock: Math.floor(cantidadLocal ?? activa.cantidad),
        },
      ];
    }
    return [];
  }, [ubicaciones, activa, cantidadLocal]);

  const gradaActiva = activa?.grada?.trim() ?? "";
  const tiendaActual = ubicaciones.find((u) => u.esActual)?.label ?? "Tu tienda";

  function onTapGrada(grada: string, stock: number) {
    if (!activa) return;
    const input = filaToCartInput(activa, { cliente_id: clienteId, marca, grada, stock });
    if (!input) {
      setErrMsg("SKU incompleto — cambiá color/material");
      window.setTimeout(() => setErrMsg(null), 2000);
      return;
    }
    if (!addPar(input)) {
      setErrMsg("Sin stock disponible");
      window.setTimeout(() => setErrMsg(null), 1500);
      return;
    }
    setErrMsg(null);
  }

  if (!activa) return null;

  return (
    <div className="relative border-t border-[#c4bdb4] bg-[#faf8f5]">
      {flashGrada && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#1b2a41]/88"
          aria-live="polite"
        >
          <span className="font-br text-xl tracking-wide text-[#f4f1ec]">
            +1 par · {formatGradaDisplay(flashGrada)}
          </span>
        </div>
      )}
      {errMsg && (
        <p className="bg-red-100 px-3 py-1.5 text-center text-xs font-semibold text-red-900">{errMsg}</p>
      )}

      <div className="flex items-center justify-between gap-2 px-2 py-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6b6560]">
          Tallas · {tiendaActual}
        </p>
        <p className="text-[9px] text-[#6b6560]">Tocá talla = +1 par</p>
      </div>

      {opciones.length === 0 ? (
        <p className="px-3 pb-3 text-center text-sm font-medium text-[#6b6560]">Sin stock en esta tienda</p>
      ) : (
        <div className="flex items-stretch gap-2 px-2 pb-2">
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {opciones.map(({ grada, stock }) => {
              const label = formatGradaDisplay(grada);
              const esActiva = gradaActiva === grada;
              return (
                <TouchPad
                  key={grada}
                  onClick={() => onTapGrada(grada, stock)}
                  ariaLabel={`Agregar par talla ${label}`}
                  className={`flex min-h-[56px] min-w-[64px] shrink-0 flex-col items-center justify-center rounded-md border-2 px-2 active:scale-[0.98] ${
                    esActiva
                      ? "tile-selected"
                      : "border-[#c4bdb4] bg-white text-[#1a1a1a] active:bg-[#e8e2d9]"
                  }`}
                >
                  <span className="font-br text-lg font-semibold leading-none tabular-nums">{label}</span>
                  <span className="tile-selected-sub mt-0.5 text-[10px] font-bold tabular-nums">{stock}</span>
                </TouchPad>
              );
            })}
          </div>

          <TouchPad
            onClick={() => setOpen(true)}
            ariaLabel={`Ver carrito, ${count} pares`}
            className="relative flex min-h-[56px] min-w-[72px] shrink-0 flex-col items-center justify-center rounded-md border-2 border-[#1b2a41] bg-white px-2 active:bg-[#e8e2d9]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#1b2a41]">Carrito</span>
            <span className="font-br text-2xl font-semibold tabular-nums leading-none text-[#1a1a1a]">
              {count}
            </span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c45c26] px-1 text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </TouchPad>
        </div>
      )}
    </div>
  );
});
