"use client";

import { memo, useMemo, useState } from "react";
import type { DepositoFila, ParLineaRef } from "@/lib/cadena";
import { StockTiendaMiniPanel, panelesLateralesVentas } from "@/components/cadena/StockOtrosLocales";
import { filaToCartInput, gradasDesdeStock } from "@/lib/cart/pos-cart";
import { usePosCart } from "@/lib/cart/PosCartContext";
import { TouchPad } from "@/components/cadena/TouchPad";
import { formatGradaDisplay, type StockUbicacionBloque } from "@/lib/stock-otros-locales";

type Props = {
  activa: DepositoFila | null;
  par: ParLineaRef | null;
  clienteId: number;
  marca: string;
  ubicaciones: StockUbicacionBloque[];
  cantidadLocal: number | null;
  bootLoading?: boolean;
  stockError?: string | null;
  onStockRetry?: () => void;
};

function resolveFilaForGrada(
  par: ParLineaRef | null,
  grada: string,
  activa: DepositoFila | null,
): DepositoFila | null {
  const g = grada.trim();
  if (!g) return null;
  if (activa?.grada?.trim() === g) return activa;

  if (
    activa &&
    activa.linea_id != null &&
    activa.referencia_id != null &&
    activa.material_id != null &&
    activa.color_id != null
  ) {
    return { ...activa, grada: g };
  }

  if (!par) return null;

  for (const gm of par.gruposMaterial ?? []) {
    for (const c of gm.colores ?? []) {
      if (c.grada?.trim() === g && c.cantidad > 0) return c;
    }
    for (const f of gm.filas ?? []) {
      if (f.grada?.trim() === g && f.cantidad > 0) return f;
    }
  }
  for (const c of par.coloresLR ?? []) {
    if (c.grada?.trim() === g && c.cantidad > 0) return c;
  }

  if (activa) return { ...activa, grada: g };

  for (const gm of par.gruposMaterial ?? []) {
    for (const c of gm.colores ?? []) {
      if (c.grada?.trim() === g) return c;
    }
  }
  for (const c of par.coloresLR ?? []) {
    if (c.grada?.trim() === g) return c;
  }
  return null;
}

export const GradaVentaStrip = memo(function GradaVentaStrip({
  activa,
  par,
  clienteId,
  marca,
  ubicaciones,
  cantidadLocal,
  bootLoading,
  stockError,
  onStockRetry,
}: Props) {
  const { addPar, flashGrada } = usePosCart();
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const laterales = useMemo(() => panelesLateralesVentas(ubicaciones), [ubicaciones]);

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
    const fila = resolveFilaForGrada(par, grada, activa);
    if (!fila) return;

    const input = filaToCartInput(fila, { cliente_id: clienteId, marca, grada, stock });

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

  if (!activa && opciones.length === 0) return null;

  const totalPar = cantidadLocal ?? opciones.reduce((s, o) => s + o.stock, 0);

  return (
    <div className="relative border-t-2 border-orange-300/80 bg-gradient-to-b from-orange-50/40 to-[#f8fafc]">
      {flashGrada && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#002B4E]/88"
          aria-live="polite"
        >
          <span className="text-xl font-semibold tracking-wide text-[#f1f5f9]">
            +1 par · {formatGradaDisplay(flashGrada)}
          </span>
        </div>
      )}
      {errMsg && (
        <p className="bg-red-100 px-3 py-1.5 text-center text-xs font-semibold text-red-900">{errMsg}</p>
      )}
      {stockError ? (
        <div className="flex items-center justify-center gap-2 bg-red-50 px-2 py-0.5">
          <p className="text-[9px] font-medium text-red-800">{stockError}</p>
          {onStockRetry ? (
            <button type="button" onClick={onStockRetry} className="text-[9px] font-semibold text-red-700 underline">
              Reintentar
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="relative px-1 pb-2 pt-1.5">
        <div className="flex justify-center">
          <div className="inline-flex max-w-full items-end gap-[1cm]">
            <StockTiendaMiniPanel bloque={laterales.izquierda} loading={bootLoading} accent="blue" />

            <div className="flex shrink-0 flex-col items-center rounded-lg border-2 border-orange-500 bg-orange-50/50 px-1.5 py-1 shadow-sm">
              <div className="mb-0.5 flex flex-col items-center gap-0 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] leading-tight text-orange-950">
                  Tallas · {tiendaActual}
                  {totalPar > 0 ? (
                    <span className="ml-0.5 tabular-nums text-bazzar-naranja">· {totalPar} p</span>
                  ) : null}
                </p>
                <p className="text-[7px] font-medium text-orange-900/70">Tocá = +1 par</p>
              </div>

              {opciones.length === 0 ? (
                <p className="py-0.5 text-center text-[10px] font-medium text-[#64748b]">Sin stock</p>
              ) : (
                <div className="flex flex-wrap justify-center gap-[1cm]">
                  {opciones.map(({ grada, stock }) => {
                    const label = formatGradaDisplay(grada);
                    const esActiva = gradaActiva === grada;
                    return (
                      <TouchPad
                        key={grada}
                        onClick={() => onTapGrada(grada, stock)}
                        ariaLabel={`Agregar par talla ${label}`}
                        className={`flex min-h-[58px] min-w-[50px] shrink-0 flex-col items-center justify-center rounded-md border-2 px-0.5 shadow-sm active:scale-[0.97] ${
                          esActiva
                            ? "tile-selected border-orange-600 ring-2 ring-orange-400/80"
                            : "border-orange-200 bg-white text-slate-900 active:bg-orange-100"
                        }`}
                      >
                        <span className="text-lg font-bold leading-none tabular-nums">{label}</span>
                        <span className="tile-selected-sub mt-0.5 text-[10px] font-bold tabular-nums">{stock}</span>
                      </TouchPad>
                    );
                  })}
                </div>
              )}
            </div>

            <StockTiendaMiniPanel bloque={laterales.derecha} loading={bootLoading} accent="purple" />
          </div>
        </div>
      </div>
    </div>
  );
});
