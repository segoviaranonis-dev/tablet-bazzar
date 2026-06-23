"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  subtitulo?: string;
  registros?: number;
  pares?: number;
  ms?: number;
  refreshing?: boolean;
  extra?: ReactNode;
};

/** Cabecera catálogo entrada — banda Bazzar + stats (pares principal). */
export function CadenaEntradaHeader({ titulo, subtitulo, registros, pares, ms, refreshing, extra }: Props) {
  return (
    <header className="shrink-0 shadow-md">
      <div className="bazzar-band grid grid-cols-[52px_1fr_auto] items-center">
        <Link
          href="/"
          className="flex min-h-[56px] items-center justify-center border-r border-white/15 text-xl text-white active:bg-white/10"
          aria-label="Panel"
        >
          ←
        </Link>
        <div className="flex min-h-[56px] flex-col items-center justify-center px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-100">Catálogo · Ventas</p>
          <h1 className="text-lg font-extrabold tracking-tight text-white">{titulo}</h1>
          {subtitulo ? <p className="text-[10px] text-orange-100/90">{subtitulo}</p> : null}
        </div>
        {extra ? <div className="px-2">{extra}</div> : <div className="w-2" />}
      </div>
      {registros != null && pares != null && (
        <div className="bazzar-band-subtle flex flex-wrap items-center justify-center gap-3 px-3 py-2">
          <span className="rounded-full bg-bazzar-naranja px-4 py-1.5 text-sm font-bold text-white shadow-sm">
            {Math.round(pares).toLocaleString("es-PY")} pares
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {registros.toLocaleString("es-PY")} registros
          </span>
          {ms != null && (
            <span className="text-[10px] font-mono tabular-nums text-slate-400">
              {ms}ms{refreshing ? " · …" : ""}
            </span>
          )}
        </div>
      )}
    </header>
  );
}
