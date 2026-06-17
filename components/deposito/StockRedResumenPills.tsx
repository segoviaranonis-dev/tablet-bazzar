"use client";

import type { StockUbicacionBloque } from "@/lib/stock-otros-locales";

function fmt(n: number) {
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
}

/** Pills totales por ubicación — paridad Retail ventaPorTienda (stock). */
export function StockRedResumenPills({ ubicaciones }: { ubicaciones: StockUbicacionBloque[] }) {
  const conStock = ubicaciones.filter((u) => u.stockTotal > 0);
  if (conStock.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {conStock.map((u) => (
        <span
          key={u.id}
          className={`rounded-md px-2 py-0.5 text-[10px] font-bold tabular-nums ${
            u.esActual
              ? "border-2 border-orange-500 bg-orange-50 text-orange-800"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          {u.label}: {fmt(u.stockTotal)}
        </span>
      ))}
    </div>
  );
}
