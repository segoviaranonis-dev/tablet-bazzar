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
      className={`flex gap-1.5 overflow-x-auto border-b border-[#c4bdb4] px-2 py-2 snap-x ${className}`}
    >
      {DEPOSITOS.map((d) => (
        <TouchPad
          key={d.cliente_id}
          onClick={() => onSelect(d.cliente_id)}
          ariaLabel={`${d.ente} ${d.tipo}`}
          className={`min-h-[48px] shrink-0 snap-center border px-3 py-1.5 ${
            clienteId === d.cliente_id
              ? "border-[#ea580c] bg-[#ea580c] font-semibold text-white"
              : "border-[#8a8278] bg-white text-[#1a1a1a] active:bg-[#e8e2d9]"
          }`}
        >
          <span className="block font-br text-xs tracking-wide">{d.ente}</span>
          <span className="mt-0.5 block text-[9px] uppercase tracking-[0.16em] opacity-90">{d.tipo}</span>
        </TouchPad>
      ))}
    </div>
  );
}
