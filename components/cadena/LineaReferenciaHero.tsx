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
  const refLabel = `${activa.linea_codigo_proveedor}.${activa.referencia_codigo_proveedor}`;
  const estilo = activa.estilo?.trim();
  const colorLabel = activa.descp_color?.trim() || activa.color_code;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-6 pt-3">
      <div className="pointer-events-auto flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {estilo ? (
            <TouchPad
              onClick={onToggleEstiloPanel}
              ariaLabel={estiloPanelOpen ? "Ocultar estilos" : "Mostrar estilos"}
              className={`block w-full rounded-sm text-left active:opacity-70 ${
                estiloPanelOpen ? "bg-[#e8e2d9]/80 px-1" : ""
              }`}
            >
              <span className="font-br text-2xl font-semibold leading-tight tracking-wide text-[#1a1a1a] md:text-3xl">
                {estilo}
              </span>
              {estilosActivos > 0 && (
                <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-[#1b2a41]">
                  {estilosActivos} filtro{estilosActivos > 1 ? "s" : ""}
                </span>
              )}
            </TouchPad>
          ) : (
            <TouchPad
              onClick={onToggleEstiloPanel}
              ariaLabel="Mostrar estilos"
              className="font-br text-sm text-[#6b6560] underline-offset-2 active:opacity-70"
            >
              Estilos
            </TouchPad>
          )}
          <TouchPad
            onClick={onToggleReferenciaPanel}
            ariaLabel={referenciaPanelOpen ? "Ocultar referencias" : "Mostrar referencias"}
            className={`mt-1 block w-full rounded-sm text-left active:opacity-70 ${
              referenciaPanelOpen ? "bg-[#e8e2d9]/80 px-1" : ""
            }`}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#6b6560]">
              {refLabel}
            </span>
            {referenciasActivas > 0 && (
              <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1b2a41]">
                {referenciasActivas} filtro{referenciasActivas > 1 ? "s" : ""}
              </span>
            )}
          </TouchPad>
        </div>
        <div className="shrink-0 border border-[#8a8278] bg-white/90 px-3 py-2">
          <span className="block max-w-[96px] truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a1a1a]">
            {colorLabel}
          </span>
          <span className="mt-0.5 block font-mono text-[9px] text-[#6b6560]">{activa.color_code}</span>
        </div>
      </div>
      <span className="pointer-events-none mt-2 block text-[10px] font-medium tabular-nums tracking-[0.18em] text-[#6b6560]">
        {parIndex + 1} / {total}
      </span>
    </div>
  );
}
