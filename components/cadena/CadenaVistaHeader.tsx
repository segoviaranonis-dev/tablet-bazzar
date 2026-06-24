"use client";

import Link from "next/link";
import { TouchPad } from "@/components/cadena/TouchPad";

type Props = {
  marca: string;
  /** Ajustes vista cadena — lógica pendiente. */
  onSettings?: () => void;
  /** Franco Tirador · carrito · toggles dock */
  toolbar?: React.ReactNode;
};

function SettingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

/** Cabecera vista producto — marca + acciones táctiles. */
export function CadenaVistaHeader({ marca, onSettings, toolbar }: Props) {
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
        {onSettings ? (
          <TouchPad
            onClick={onSettings}
            ariaLabel="Ajustes — próximamente"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white active:bg-white/10"
          >
            <SettingsIcon className="h-5 w-5" />
          </TouchPad>
        ) : null}
      </div>
    </header>
  );
}
