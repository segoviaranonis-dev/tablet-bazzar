"use client";

import { useMemo, useState } from "react";
import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";
import {
  CHART_COLORS,
  agregarPorCampo,
  conicGradientFromSlices,
  totalesVista,
  type MetricMode,
  type StatSlice,
} from "@/lib/deposito-estadisticas";
import { buildEstiloTonoDrill } from "@/lib/deposito-estadisticas-drill";
import { buildMarcaEstiloDrill, tonoLabelCaja } from "@/lib/deposito-estadisticas-marca-drill";
import { EstiloTonoDrillSection } from "@/components/deposito/EstiloTonoDrillSection";
import { MarcaEstiloDrillSection } from "@/components/deposito/MarcaEstiloDrillSection";
import { formatPrecioGs } from "@/lib/precio-venta";

type Props = {
  depositoNombre: string;
  depositoCodigo: string;
  paresDeposito: number;
  cajas: ProductoCajaCard[];
  totalFiltradoPares: number;
  totalFiltradoCajas: number;
  limit: number;
};

export function DepositoEstadisticasPanel({
  depositoNombre,
  depositoCodigo,
  paresDeposito,
  cajas,
  totalFiltradoPares,
  totalFiltradoCajas,
  limit,
}: Props) {
  const [mode, setMode] = useState<MetricMode>("pares");

  const totales = useMemo(() => totalesVista(cajas), [cajas]);
  const porMarca = useMemo(
    () => agregarPorCampo(cajas, mode, (c) => c.producto.marca || "Sin marca"),
    [cajas, mode],
  );
  const porEstilo = useMemo(
    () => agregarPorCampo(cajas, mode, (c) => c.estilo || c.producto.estilo || "Sin estilo"),
    [cajas, mode],
  );
  const porTono = useMemo(
    () => agregarPorCampo(cajas, mode, tonoLabelCaja),
    [cajas, mode],
  );
  const drillEstiloTono = useMemo(() => buildEstiloTonoDrill(cajas), [cajas]);
  const drillMarcaEstilo = useMemo(() => buildMarcaEstiloDrill(cajas), [cajas]);

  const pctVista =
    paresDeposito > 0 ? Math.round((totalFiltradoPares / paresDeposito) * 100) : 0;

  const totalMetric = mode === "pares" ? totales.pares : totales.valor;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">
          Vista filtrada · TOP {limit} · {totalFiltradoCajas} cajas · {pctVista}% del depósito
        </p>
        <div className="flex rounded-xl border-2 border-slate-200 bg-white p-1">
          <MetricToggle active={mode === "pares"} onClick={() => setMode("pares")}>
            Pares
          </MetricToggle>
          <MetricToggle active={mode === "precio"} onClick={() => setMode("precio")}>
            Precio Gs
          </MetricToggle>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Depósito" value={depositoCodigo} sub={depositoNombre} />
        <StatCard
          label={mode === "pares" ? "Pares vista" : "Valor vista"}
          value={
            mode === "pares"
              ? totales.pares.toLocaleString("es-PY")
              : formatPrecioGs(totales.valor)
          }
          sub={
            mode === "pares"
              ? `${totales.cajas} cajas`
              : `${totales.cajasConPrecio} cj con LPN · ${totales.paresConPrecio.toLocaleString("es-PY")} p`
          }
        />
        <StatCard
          label="Depósito total"
          value={paresDeposito.toLocaleString("es-PY") + " p"}
          sub="inventario completo"
        />
        <StatCard
          label="Sin precio LPN"
          value={String(totales.cajas - totales.cajasConPrecio)}
          sub="cajas en vista · import CSV"
        />
      </div>

      {cajas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Sin datos con los filtros actuales.
        </p>
      ) : (
        <>
          <ChartSection
            title={`${depositoNombre} · Marcas`}
            slices={porMarca}
            mode={mode}
            total={totalMetric}
          />
          <MarcaEstiloDrillSection drill={drillMarcaEstilo} />
          <ChartSection title="Por estilo" slices={porEstilo} mode={mode} total={totalMetric} />
          <ChartSection
            title={`${depositoNombre} · Tonos`}
            slices={porTono}
            mode={mode}
            total={totalMetric}
          />
          <EstiloTonoDrillSection drill={drillEstiloTono} />
        </>
      )}
    </div>
  );
}

function MetricToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] rounded-lg px-4 text-sm font-bold transition touch-manipulation ${
        active ? "bg-rimec-azul text-white" : "text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

function ChartSection({
  title,
  slices,
  mode,
  total,
  compact = false,
}: {
  title: string;
  slices: StatSlice[];
  mode: MetricMode;
  total: number;
  compact?: boolean;
}) {
  const gradient = conicGradientFromSlices(slices);
  const maxBar = Math.max(...slices.map((s) => s.value), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-rimec-azul">{title}</h2>
      <div className={`grid gap-4 ${compact ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative h-44 w-44 rounded-full shadow-inner"
            style={{ background: gradient }}
            role="img"
            aria-label={`Torta ${title}`}
          >
            <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-500">Total</span>
              <span className="text-sm font-black tabular-nums text-rimec-azul">
                {mode === "pares" ? total.toLocaleString("es-PY") + " p" : formatPrecioGs(total)}
              </span>
            </div>
          </div>
          <ul className="w-full space-y-1.5">
            {slices.map((s, i) => (
              <li key={s.label} className="flex items-center gap-2 text-xs">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-800">{s.label}</span>
                <span className="shrink-0 tabular-nums font-bold text-orange-600">{s.pct}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Barras</p>
          {slices.map((s, i) => (
            <div key={s.label} className="space-y-0.5">
              <div className="flex justify-between gap-2 text-xs">
                <span className="truncate font-medium text-slate-700">{s.label}</span>
                <span className="shrink-0 tabular-nums text-slate-600">
                  {mode === "pares"
                    ? `${s.pares.toLocaleString("es-PY")} p · ${s.cajas} cj`
                    : `${formatPrecioGs(s.valor)} · ${s.pct}%`}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(4, (s.value / maxBar) * 100)}%`,
                    background: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black tabular-nums text-rimec-azul sm:text-xl">{value}</p>
      {sub ? <p className="mt-0.5 truncate text-[11px] text-slate-500">{sub}</p> : null}
    </div>
  );
}
