"use client";

import { formatGradaDisplay, type StockUbicacionBloque } from "@/lib/stock-otros-locales";

function fmt(n: number) {
  if (n === 0) return "—";
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
}

function TablaUbicacion({ bloque }: { bloque: StockUbicacionBloque }) {
  const accent = bloque.esActual ? "#ea580c" : "#002B4E";
  const shellBorder = bloque.esActual ? "border-orange-300 ring-1 ring-orange-200" : "border-slate-200";

  if (bloque.stockTotal <= 0 && bloque.tallas.length === 0) {
    return (
      <div className={`overflow-hidden rounded-lg border bg-white/80 ${shellBorder}`}>
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-2 py-1">
          <span
            className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: accent }}
          >
            {bloque.label}
          </span>
          <span className="text-[9px] text-slate-400">Sin stock</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border bg-white/80 ${shellBorder}`}>
      <div
        className="flex items-center justify-between gap-2 border-b border-slate-200 px-2 py-1"
        style={bloque.esActual ? { backgroundColor: "rgba(255,237,213,0.5)" } : undefined}
      >
        <span
          className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: accent }}
        >
          {bloque.label}
          {bloque.esActual ? " · tú" : ""}
        </span>
        <span className="shrink-0 text-[9px] font-bold tabular-nums text-slate-500">
          {fmt(bloque.stockTotal)} st
        </span>
      </div>
      <table className="w-full border-collapse text-center text-[9px] text-slate-800">
        <thead>
          <tr className="bg-slate-50">
            <th className="border-b border-slate-200 px-0.5 py-0.5 font-medium text-slate-500" />
            {bloque.tallas.map((t) => (
              <th
                key={t}
                className="border-b border-slate-200 px-0.5 py-0.5 font-semibold tabular-nums text-slate-600"
              >
                {formatGradaDisplay(t)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="bg-slate-50 px-1 py-0.5 text-left text-[8px] font-semibold uppercase tracking-wide text-slate-500">
              Stock
            </td>
            {bloque.tallas.map((_, i) => (
              <td
                key={`s-${i}`}
                className="px-0.5 py-0.5 tabular-nums font-semibold"
                style={{ color: accent }}
              >
                {fmt(bloque.stock[i] ?? 0)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type Props = {
  ubicaciones: StockUbicacionBloque[];
};

/** Red Bazzar — 3 ubicaciones × grada (paridad Report Retail, solo stock depósito). */
export function StockRedGradaTables({ ubicaciones }: Props) {
  if (!ubicaciones.length) return null;
  const conStock = ubicaciones.some((u) => u.stockTotal > 0);
  if (!conStock) return null;

  return (
    <div className="mt-2 flex flex-col gap-1.5 border-t border-orange-100 pt-2">
      {ubicaciones.map((bloque) => (
        <TablaUbicacion key={bloque.id} bloque={bloque} />
      ))}
    </div>
  );
}
