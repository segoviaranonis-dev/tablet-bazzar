"use client";

import { TouchPad } from "@/components/cadena/TouchPad";
import { DEPOSITOS } from "@/lib/depositos-config";

type Props = {
  clienteId: number;
  onSelect: (clienteId: number) => void;
  className?: string;
};

/** Selector táctil — 6 depósitos Bazzar (FER / SM / PAL × adultos / niños). */
export function SelectorDepositos({ clienteId, onSelect, className = "" }: Props) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto border-b border-orange-100 bg-white px-3 py-2.5 snap-x ${className}`}
    >
      {DEPOSITOS.map((d) => {
        const active = clienteId === d.cliente_id;
        return (
          <TouchPad
            key={d.cliente_id}
            onClick={() => onSelect(d.cliente_id)}
            ariaLabel={`${d.ente} ${d.tipo}`}
            className={`min-h-[50px] shrink-0 snap-center rounded-xl border px-3 py-1.5 transition-shadow ${
              active
                ? "border-bazzar-naranja bg-gradient-to-br from-bazzar-naranja-light to-bazzar-naranja font-semibold text-white shadow-lg shadow-orange-200"
                : "border-slate-200 bg-white text-slate-800 active:bg-orange-50"
            }`}
          >
            <span className="block text-xs font-bold tracking-wide">{d.ente}</span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[0.16em] opacity-90">{d.tipo}</span>
          </TouchPad>
        );
      })}
    </div>
  );
}
