"use client";

import Link from "next/link";
import { TouchPad } from "@/components/cadena/TouchPad";

type Props = {
  marca: string;
  onSearch: () => void;
  /** Franco Tirador · carrito · toggles dock */
  toolbar?: React.ReactNode;
};

/** Cabecera vista producto — marca + acciones táctiles. */
export function CadenaVistaHeader({ marca, onSearch, toolbar }: Props) {
  return (
    <header className="z-30 shrink-0 shadow-md">
      <div className="bazzar-band flex items-center gap-1 px-1 py-1">
        <Link
          href="/cadena"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-lg text-white active:bg-white/10"
          aria-label="Volver a filtros"
        >
          ←
        </Link>
        <Link
          href="/cadena"
          className="flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center truncate rounded-lg px-2 active:bg-white/10"
          aria-label={`Marca ${marca}`}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-orange-100">Marca</span>
          <span className="truncate text-lg font-extrabold text-white">{marca}</span>
        </Link>
        {toolbar ? <div className="flex shrink-0 items-center gap-1.5">{toolbar}</div> : null}
        <TouchPad
          onClick={onSearch}
          ariaLabel="Buscar código"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-lg text-white active:bg-white/10"
        >
          ⌕
        </TouchPad>
      </div>
    </header>
  );
}
