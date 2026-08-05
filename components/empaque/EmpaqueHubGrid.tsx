"use client";

import Link from "next/link";

export type EmpaqueHubCard = {
  cliente_id: number;
  ente: string;
  tipo: string;
  codigo: string;
  label: string;
  pares_pendientes: number;
  facturas_pendientes: number;
};

type Props = {
  cards: EmpaqueHubCard[];
  loading?: boolean;
  onRefresh?: () => void;
};

/** Hub táctil — 6 tiendas Bazzar (mismo patrón que Caja Report). */
export function EmpaqueHubGrid({ cards, loading = false, onRefresh }: Props) {
  if (loading) {
    return <p className="py-12 text-center text-slate-500">Consultando Bobeda…</p>;
  }

  if (cards.length === 0) {
    return (
      <p className="py-12 text-center text-slate-500">
        Sin tiendas visibles para tu usuario.
        {onRefresh ? (
          <>
            {" "}
            <button type="button" onClick={onRefresh} className="font-bold text-orange-600 underline">
              Reintentar
            </button>
          </>
        ) : null}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.cliente_id}
          href={`/empaque?cliente_id=${c.cliente_id}`}
          className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-orange-500 hover:shadow-lg active:scale-[0.99]"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600">{c.ente}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 group-hover:text-orange-700">{c.tipo}</h2>
          <p className="text-xs text-slate-500">
            {c.codigo} · ID {c.cliente_id}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white">
              {c.pares_pendientes} par{c.pares_pendientes === 1 ? "" : "es"} pendientes
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              {c.facturas_pendientes} factura{c.facturas_pendientes === 1 ? "" : "s"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
