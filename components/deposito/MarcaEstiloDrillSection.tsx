"use client";

import { useMemo, useState } from "react";
import type { MarcaDrill } from "@/lib/deposito-estadisticas-marca-drill";
import { CHART_COLORS, conicGradientFromSlices, type StatSlice } from "@/lib/deposito-estadisticas";

type Props = {
  drill: MarcaDrill[];
};

function estilosToSlices(estilos: MarcaDrill["estilos"]): StatSlice[] {
  const total = estilos.reduce((s, e) => s + e.totalPares, 0);
  return estilos.map((e) => ({
    label: e.estilo,
    pares: e.totalPares,
    cajas: 0,
    valor: 0,
    value: e.totalPares,
    pct: total > 0 ? Math.round((e.totalPares / total) * 1000) / 10 : 0,
  }));
}

export function MarcaEstiloDrillSection({ drill }: Props) {
  const [openMarca, setOpenMarca] = useState<string | null>(drill[0]?.marca ?? null);

  if (drill.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-wide text-rimec-azul">Marca · estilos</h2>
      <p className="text-xs text-slate-500">Cada marca desglosa sus estilos en la vista filtrada.</p>
      {drill.map((m) => (
        <MarcaBlock
          key={m.marca}
          marca={m}
          open={openMarca === m.marca}
          onToggle={() => setOpenMarca((prev) => (prev === m.marca ? null : m.marca))}
        />
      ))}
    </section>
  );
}

function MarcaBlock({
  marca,
  open,
  onToggle,
}: {
  marca: MarcaDrill;
  open: boolean;
  onToggle: () => void;
}) {
  const slices = useMemo(() => estilosToSlices(marca.estilos), [marca.estilos]);
  const gradient = conicGradientFromSlices(slices);
  const maxEst = Math.max(...marca.estilos.map((e) => e.totalPares), 1);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left touch-manipulation"
      >
        <div>
          <p className="text-sm font-black uppercase text-rimec-azul">{marca.marca}</p>
          <p className="text-xs text-slate-500">
            {marca.estilos.length} estilo{marca.estilos.length === 1 ? "" : "s"} ·{" "}
            <span className="font-bold tabular-nums text-orange-600">
              {marca.totalPares.toLocaleString("es-PY")} p
            </span>
          </p>
        </div>
        <span className="text-lg text-slate-400">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center gap-2">
              <div
                className="relative h-32 w-32 rounded-full shadow-inner"
                style={{ background: gradient }}
                role="img"
                aria-label={`Estilos ${marca.marca}`}
              >
                <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                  <span className="text-xs font-black tabular-nums text-rimec-azul">
                    {marca.totalPares.toLocaleString("es-PY")} p
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {marca.estilos.map((e, i) => (
                <div key={e.estilo} className="space-y-0.5">
                  <div className="flex justify-between gap-2 text-[11px]">
                    <span className="truncate font-medium text-slate-700">{e.estilo}</span>
                    <span className="shrink-0 tabular-nums text-slate-600">
                      {e.totalPares.toLocaleString("es-PY")} p
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(4, (e.totalPares / maxEst) * 100)}%`,
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
