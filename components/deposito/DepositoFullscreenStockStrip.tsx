"use client";

import {
  panelesLateralesVentas,
  StockTiendaMiniPanel,
} from "@/components/cadena/StockOtrosLocales";
import { formatPrecioGs } from "@/lib/precio-venta";
import type { StockUbicacionBloque } from "@/lib/stock-otros-locales";
import { TablaGradaDeposito } from "./TablaGradaDeposito";

function fmt(n: number) {
  if (n === 0) return "—";
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
}

function CentroTiendaPanel({
  bloque,
  tiendaLabel,
  estilo,
  precioUnitario,
  vidrieraActiva,
  loading,
}: {
  bloque: StockUbicacionBloque;
  tiendaLabel: string;
  estilo: string;
  precioUnitario: number | null;
  vidrieraActiva?: string | null;
  loading?: boolean;
}) {
  if (loading && bloque.tallas.length === 0) {
    return (
      <div className="min-w-0 flex-1 animate-pulse rounded-xl border-2 border-orange-300 bg-orange-50/50 p-3">
        <div className="h-6 w-32 rounded bg-orange-200" />
        <div className="mt-3 h-16 rounded bg-white/80" />
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1 rounded-xl border-2 border-orange-400 bg-orange-50/40 p-2">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-orange-900">
          Tallas · {bloque.label}
          <span className="ml-1 tabular-nums text-slate-700">
            {fmt(bloque.stockTotal)} p
          </span>
          {precioUnitario != null ? (
            <span className="ml-2 text-orange-700">{formatPrecioGs(precioUnitario)}</span>
          ) : null}
        </p>
      </div>
      <TablaGradaDeposito
        tienda={tiendaLabel || bloque.label}
        estilo={estilo}
        tallas={bloque.tallas}
        stock={bloque.stock}
        vidrieraActiva={vidrieraActiva}
      />
    </div>
  );
}

type Props = {
  ubicaciones: StockUbicacionBloque[];
  tiendaLabel: string;
  estilo: string;
  precioUnitario: number | null;
  vidrieraActiva?: string | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

/** Área 2 — red 3 tiendas: izq otra · centro local · der otra (paridad Ventas). */
export function DepositoFullscreenStockStrip({
  ubicaciones,
  tiendaLabel,
  estilo,
  precioUnitario,
  vidrieraActiva,
  loading,
  error,
  onRetry,
}: Props) {
  const { izquierda, derecha } = panelesLateralesVentas(ubicaciones);
  const centro = ubicaciones.find((u) => u.esActual) ?? {
    id: "local",
    label: tiendaLabel,
    esActual: true,
    tallas: [],
    stock: [],
    stockTotal: 0,
  };

  return (
    <section className="mt-3 border-t border-slate-200 pt-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Stock · cohorte 3 tiendas
        </p>
        {error ? (
          <button
            type="button"
            onClick={onRetry}
            className="text-[10px] font-semibold text-red-700 underline"
          >
            Reintentar
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="mb-2 text-center text-xs font-medium text-red-800">{error}</p>
      ) : null}
      <div className="flex flex-wrap items-start justify-center gap-2 lg:flex-nowrap">
        <StockTiendaMiniPanel bloque={izquierda} loading={loading} accent="blue" />
        <CentroTiendaPanel
          bloque={centro}
          tiendaLabel={tiendaLabel}
          estilo={estilo}
          precioUnitario={precioUnitario}
          vidrieraActiva={vidrieraActiva}
          loading={loading}
        />
        <StockTiendaMiniPanel bloque={derecha} loading={loading} accent="purple" />
      </div>
    </section>
  );
}
