"use client";

import Link from "next/link";
import { TouchPad } from "@/components/cadena/TouchPad";

type Props = {
  marca: string;
  onSearch: () => void;
};

/** Cabecera vista producto — marca destacada + acciones. */
export function CadenaVistaHeader({ marca, onSearch }: Props) {
  return (
    <header className="z-30 shrink-0 shadow-md">
      <div className="bazzar-band grid grid-cols-[52px_1fr_52px] gap-1 px-1 py-1">
        <Link
          href="/cadena"
          className="flex min-h-[52px] min-w-[52px] items-center justify-center rounded-lg border border-white/20 text-lg text-white active:bg-white/10"
          aria-label="Volver a filtros"
        >
          ←
        </Link>
        <Link
          href="/cadena"
          className="flex min-h-[52px] flex-col items-center justify-center truncate rounded-lg px-2 active:bg-white/10"
          aria-label={`Marca ${marca}`}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-orange-100">Marca</span>
          <span className="truncate text-lg font-extrabold text-white">{marca}</span>
        </Link>
        <TouchPad
          onClick={onSearch}
          ariaLabel="Buscar código"
          className="flex min-h-[52px] min-w-[52px] items-center justify-center rounded-lg border border-white/20 text-lg text-white active:bg-white/10"
        >
          ⌕
        </TouchPad>
      </div>
    </header>
  );
}
