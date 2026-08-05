"use client";

import { useMemo, useState } from "react";
import type { EstiloDrill } from "@/lib/deposito-estadisticas-drill";
import { CHART_COLORS, conicGradientFromSlices, type StatSlice } from "@/lib/deposito-estadisticas";

type Props = {
  drill: EstiloDrill[];
};

function tonosToSlices(tonos: EstiloDrill["tonos"]): StatSlice[] {
  const total = tonos.reduce((s, t) => s + t.totalPares, 0);
  return tonos.map((t) => ({
    label: t.tono,
    pares: t.totalPares,
    cajas: 0,
    valor: 0,
    value: t.totalPares,
    pct: total > 0 ? Math.round((t.totalPares / total) * 1000) / 10 : 0,
  }));
}

export function EstiloTonoDrillSection({ drill }: Props) {
  const [openEstilo, setOpenEstilo] = useState<string | null>(drill[0]?.estilo ?? null);

  if (drill.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        Sin datos estilo / tono en la vista actual.
      </p>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-wide text-rimec-azul">
        Por estilo · tono · número
      </h2>
      <p className="text-xs text-slate-500">
        Abrí un estilo para ver tonos; tocá un tono para ver pares por N°.
      </p>
      {drill.map((est) => (
        <EstiloBlock
          key={est.estilo}
          est={est}
          open={openEstilo === est.estilo}
          onToggle={() => setOpenEstilo((prev) => (prev === est.estilo ? null : est.estilo))}
        />
      ))}
    </section>
  );
}

function EstiloBlock({
  est,
  open,
  onToggle,
}: {
  est: EstiloDrill;
  open: boolean;
  onToggle: () => void;
}) {
  const [openTono, setOpenTono] = useState<string | null>(null);
  const slices = useMemo(() => tonosToSlices(est.tonos), [est.tonos]);
  const gradient = conicGradientFromSlices(slices);
  const maxTono = Math.max(...est.tonos.map((t) => t.totalPares), 1);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left touch-manipulation"
      >
        <div>
          <p className="text-sm font-black uppercase text-rimec-azul">{est.estilo}</p>
          <p className="text-xs text-slate-500">
            {est.tonos.length} tono{est.tonos.length === 1 ? "" : "s"} ·{" "}
            <span className="font-bold tabular-nums text-orange-600">
              {est.totalPares.toLocaleString("es-PY")} p total
            </span>
          </p>
        </div>
        <span className="text-lg text-slate-400">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Tonos en {est.estilo}
              </p>
              <div
                className="relative h-36 w-36 rounded-full shadow-inner"
                style={{ background: gradient }}
                role="img"
                aria-label={`Tonos ${est.estilo}`}
              >
                <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                  <span className="text-[9px] font-bold uppercase text-slate-500">Total</span>
                  <span className="text-xs font-black tabular-nums text-rimec-azul">
                    {est.totalPares.toLocaleString("es-PY")} p
                  </span>
                </div>
              </div>
              <ul className="w-full space-y-1">
                {slices.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-2 text-[11px]">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="min-w-0 flex-1 truncate">{s.label}</span>
                    <span className="shrink-0 tabular-nums font-bold text-orange-600">
                      {s.pares.toLocaleString("es-PY")} p
                    </span>
                    <span className="shrink-0 tabular-nums text-slate-400">{s.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Barras por tono · tocá para N°
              </p>
              {est.tonos.map((t, i) => {
                const active = openTono === t.tono;
                return (
                  <button
                    key={t.tono}
                    type="button"
                    onClick={() => setOpenTono((prev) => (prev === t.tono ? null : t.tono))}
                    className={`w-full rounded-lg px-1 py-1 text-left touch-manipulation transition ${
                      active ? "bg-orange-50 ring-1 ring-orange-300/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between gap-2 text-[11px]">
                      <span className="truncate font-medium text-slate-700">{t.tono}</span>
                      <span className="shrink-0 tabular-nums text-slate-600">
                        {t.totalPares.toLocaleString("es-PY")} p
                      </span>
                    </div>
                    <div className="mt-0.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(4, (t.totalPares / maxTono) * 100)}%`,
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {openTono ? (() => {
            const tono = est.tonos.find((t) => t.tono === openTono);
            return tono ? <TonoTallaBlock estilo={est.estilo} tono={tono} /> : null;
          })() : null}
        </div>
      )}
    </article>
  );
}

function TonoTallaBlock({
  estilo,
  tono,
}: {
  estilo: string;
  tono: EstiloDrill["tonos"][number];
}) {
  if (!tono) return null;
  const max = Math.max(...tono.tallas.map((t) => t.pares), 1);

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-bold text-slate-800">
          {estilo} · <span className="text-orange-600">{tono.tono}</span>
        </p>
        <p className="text-xs font-black tabular-nums text-rimec-azul">
          {tono.totalPares.toLocaleString("es-PY")} p
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tono.tallas.map((t) => (
          <div key={t.talla} className="rounded-lg bg-white px-2 py-1.5 shadow-sm">
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-700">N° {t.talla}</span>
              <span className="tabular-nums font-semibold text-slate-700">
                {t.pares.toLocaleString("es-PY")} p
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.max(6, (t.pares / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
