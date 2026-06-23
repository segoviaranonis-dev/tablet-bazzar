"use client";

import { TouchPad } from "@/components/cadena/TouchPad";
import type { DepositoFila } from "@/lib/cadena";

type Props = {
  activa: DepositoFila;
  parIndex: number;
  total: number;
  estiloPanelOpen: boolean;
  referenciaPanelOpen: boolean;
  estilosActivos: number;
  referenciasActivas: number;
  onToggleEstiloPanel: () => void;
  onToggleReferenciaPanel: () => void;
};

export function LineaReferenciaHero({
  activa,
  parIndex,
  total,
  estiloPanelOpen,
  referenciaPanelOpen,
  estilosActivos,
  referenciasActivas,
  onToggleEstiloPanel,
  onToggleReferenciaPanel,
}: Props) {
  const estilo = activa.estilo?.trim();
  const colorLabel = activa.descp_color?.trim() || activa.color_code;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pb-2 pt-3">
      <div className="pointer-events-auto flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 [text-shadow:0_0_8px_rgba(255,255,255,0.95),0_1px_3px_rgba(255,255,255,0.9)]">
          {estilo ? (
            <TouchPad
              onClick={onToggleEstiloPanel}
              ariaLabel={estiloPanelOpen ? "Ocultar estilos" : "Mostrar estilos"}
              className={`block w-full rounded-lg text-left active:opacity-80 ${
                estiloPanelOpen ? "bg-orange-50 px-2 py-1" : ""
              }`}
            >
              <span className="block text-2xl font-extrabold leading-tight tracking-tight text-rimec-azul md:text-3xl">
                {estilo}
              </span>
              {estilosActivos > 0 && (
                <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-bazzar-naranja">
                  {estilosActivos} filtro{estilosActivos > 1 ? "s" : ""}
                </span>
              )}
            </TouchPad>
          ) : (
            <TouchPad
              onClick={onToggleEstiloPanel}
              ariaLabel="Mostrar estilos"
              className="text-sm font-semibold text-bazzar-naranja underline-offset-2 active:opacity-70"
            >
              Estilos
            </TouchPad>
          )}
          <TouchPad
            onClick={onToggleReferenciaPanel}
            ariaLabel={referenciaPanelOpen ? "Ocultar referencias" : "Mostrar referencias"}
            className={`mt-1 block w-full rounded-lg text-left active:opacity-80 ${
              referenciaPanelOpen ? "bg-orange-50 px-2 py-1" : ""
            }`}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              <span className="text-rimec-azul">{activa.linea_codigo_proveedor}</span>
              <span className="text-bazzar-naranja">.{activa.referencia_codigo_proveedor}</span>
            </span>
            {referenciasActivas > 0 && (
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-bazzar-naranja">
                {referenciasActivas} filtro{referenciasActivas > 1 ? "s" : ""}
              </span>
            )}
          </TouchPad>
        </div>
        <div className="shrink-0 rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white px-3 py-2 shadow-sm">
          <span className="block max-w-[96px] truncate text-[10px] font-bold uppercase tracking-[0.1em] text-rimec-azul">
            {colorLabel}
          </span>
          <span className="mt-0.5 block font-mono text-[9px] text-slate-500">{activa.color_code}</span>
        </div>
      </div>
      <span className="mt-2 block text-[10px] font-bold tabular-nums tracking-[0.18em] text-bazzar-naranja">
        {parIndex + 1} / {total}
      </span>
    </div>
  );
}
