"use client";

import { TouchPad } from "@/components/cadena/TouchPad";
import { DEPOSITOS } from "@/lib/depositos-config";

type Props = {
  clienteId: number;
  onSelect: (clienteId: number) => void;
  className?: string;
  /** Tienda acotada a un solo depósito — no permite cambiar sede. */
  locked?: boolean;
};

/** Selector táctil — 6 depósitos Bazzar (FER / SM / PAL × adultos / niños). */
export function SelectorDepositos({ clienteId, onSelect, className = "", locked = false }: Props) {
  const items = locked ? DEPOSITOS.filter((d) => d.cliente_id === clienteId) : DEPOSITOS;

  if (locked && items.length === 1) {
    const d = items[0];
    return (
      <div
        className={`border-b border-orange-100 bg-white px-3 py-2.5 ${className}`}
      >
        <div className="mx-auto flex max-w-md justify-center">
          <div className="min-h-[50px] rounded-xl border border-bazzar-naranja bg-gradient-to-br from-bazzar-naranja-light to-bazzar-naranja px-6 py-2 text-center font-semibold text-white shadow-lg shadow-orange-200">
            <span className="block text-xs font-bold tracking-wide">{d.ente}</span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[0.16em] opacity-90">{d.tipo}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-2 overflow-x-auto border-b border-orange-100 bg-white px-3 py-2.5 snap-x ${className}`}
    >
      {items.map((d) => {
        const active = clienteId === d.cliente_id;
        return (
          <TouchPad
            key={d.cliente_id}
            onClick={() => !locked && onSelect(d.cliente_id)}
            ariaLabel={`${d.ente} ${d.tipo}`}
            disabled={locked}
            className={`min-h-[50px] shrink-0 snap-center rounded-xl border px-3 py-1.5 transition-shadow ${
              active
                ? "border-bazzar-naranja bg-gradient-to-br from-bazzar-naranja-light to-bazzar-naranja font-semibold text-white shadow-lg shadow-orange-200"
                : "border-slate-200 bg-white text-slate-800 active:bg-orange-50"
            } ${locked ? "pointer-events-none opacity-90" : ""}`}
          >
            <span className="block text-xs font-bold tracking-wide">{d.ente}</span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[0.16em] opacity-90">{d.tipo}</span>
          </TouchPad>
        );
      })}
    </div>
  );
}
