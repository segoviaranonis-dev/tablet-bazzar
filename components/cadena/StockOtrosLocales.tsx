"use client";

import type { DepositoFila, ParLineaRef } from "@/lib/cadena";
import { stockBloquesEqual } from "@/lib/stock-snapshot-equal";
import {
  formatGradaDisplay,
  otrasUbicacionesDock,
  stockLiveUrl,
  type StockLiveQuery,
  type StockLiveResponse,
  type StockUbicacionBloque,
} from "@/lib/stock-otros-locales";
import { POS_COBRAR_OK_EVENT } from "@/lib/pos-events";
import { memo, useCallback, useEffect, useRef, useState } from "react";

const LIVE_POLL_MS = 20_000;

function fmt(n: number) {
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
}

type PanelAccent = "blue" | "purple";

const PANEL_ACCENT: Record<
  PanelAccent,
  { shell: string; header: string; label: string; divide: string; skeleton: string }
> = {
  blue: {
    shell: "border-2 border-blue-500 bg-blue-50/70",
    header: "border-blue-200 bg-blue-100/40",
    label: "text-blue-900",
    divide: "divide-blue-200",
    skeleton: "border-blue-300 bg-blue-50",
  },
  purple: {
    shell: "border-2 border-violet-500 bg-violet-50/70",
    header: "border-violet-200 bg-violet-100/40",
    label: "text-violet-900",
    divide: "divide-violet-200",
    skeleton: "border-violet-300 bg-violet-50",
  },
};

function bloqueDockSkeleton(label: string, accent: PanelAccent) {
  const a = PANEL_ACCENT[accent];
  return (
    <div className={`flex w-[140px] shrink-0 animate-pulse flex-col overflow-hidden rounded-lg ${a.skeleton}`}>
      <div className={`h-8 border-b ${a.header}`} />
      <div className="h-14 bg-white/50" />
    </div>
  );
}

/** Mini-tabla compacta — una tienda (San Martín / Palma / etc.). */
export const StockTiendaMiniPanel = memo(function StockTiendaMiniPanel({
  bloque,
  loading,
  accent = "blue",
}: {
  bloque: StockUbicacionBloque;
  loading?: boolean;
  accent?: PanelAccent;
}) {
  const a = PANEL_ACCENT[accent];

  if (loading && bloque.stockTotal === 0 && bloque.tallas.length === 0) {
    return bloqueDockSkeleton(bloque.label, accent);
  }

  return (
    <div className={`flex w-fit max-w-[220px] shrink-0 flex-col overflow-hidden rounded-lg ${a.shell}`}>
      <div className={`flex items-center justify-between gap-2 border-b px-2 py-1 ${a.header}`}>
        <p className={`truncate text-[10px] font-bold uppercase tracking-wide ${a.label}`}>{bloque.label}</p>
        <p className="shrink-0 text-xs font-bold tabular-nums text-slate-900">{fmt(bloque.stockTotal)} p</p>
      </div>
      {bloque.tallas.length > 0 ? (
        <div
          className={`flex divide-x bg-white/90 ${a.divide}`}
          role="table"
          aria-label={`Stock ${bloque.label}`}
        >
          {bloque.tallas.map((t, i) => {
            const n = bloque.stock[i] ?? 0;
            return (
              <div key={t} className="flex min-w-[36px] flex-col items-center justify-center px-1 py-1.5" role="cell">
                <span className="text-[11px] font-semibold leading-none tabular-nums text-slate-600">
                  {formatGradaDisplay(t)}
                </span>
                <span
                  className={`mt-1 text-sm font-bold leading-none tabular-nums ${
                    n > 0 ? "text-[#002B4E]" : "text-[#cbd5e1]"
                  }`}
                >
                  {n > 0 ? n : "—"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="px-2 py-2 text-center text-[10px] text-[#94a3b8]">Sin stock</span>
      )}
    </div>
  );
});

/** @deprecated Usar fila en GradaVentaStrip (SM izq · local centro · Palma der). */
export const StockOtrasTiendasDock = memo(function StockOtrasTiendasDock({
  ubicaciones,
  bootLoading,
  error,
  onRetry,
}: {
  ubicaciones: StockUbicacionBloque[];
  bootLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const otras = otrasUbicacionesDock(ubicaciones);
  const showSkeleton = bootLoading && otras.every((b) => b.stockTotal === 0 && b.tallas.length === 0);

  return (
    <div className="border-b border-[#f1f5f9] bg-white/80 px-2 py-1.5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#64748b]">Otras tiendas</p>
        {error ? (
          <button
            type="button"
            onClick={onRetry}
            className="text-[9px] font-semibold text-red-700 underline"
          >
            Reintentar
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="mb-1 text-center text-[10px] font-medium text-red-800">{error}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
        {showSkeleton
          ? otras.map((b) => bloqueDockSkeleton(b.label, b.id.includes("palma") ? "purple" : "blue"))
          : otras.map((bloque) => (
              <div
                key={bloque.id}
                className="flex w-fit max-w-full shrink-0 flex-col overflow-hidden rounded-md border border-[#e2e8f0] bg-[#f8fafc]"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] px-1.5 py-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#002B4E]">
                    {bloque.label}
                  </p>
                  <p className="text-[10px] font-bold tabular-nums text-slate-900">{fmt(bloque.stockTotal)} p</p>
                </div>
                {bloque.tallas.length > 0 ? (
                  <div
                    className="flex divide-x divide-[#e2e8f0] bg-white/90"
                    role="table"
                    aria-label={`Stock ${bloque.label}`}
                  >
                    {bloque.tallas.map((t, i) => {
                      const n = bloque.stock[i] ?? 0;
                      return (
                        <div
                          key={t}
                          className="flex min-w-[22px] flex-col items-center px-1 py-0.5"
                          role="cell"
                        >
                          <span className="text-[8px] font-semibold leading-none tabular-nums text-slate-600">
                            {formatGradaDisplay(t)}
                          </span>
                          <span
                            className={`mt-0.5 text-[9px] font-bold leading-none tabular-nums ${
                              n > 0 ? "text-[#002B4E]" : "text-[#cbd5e1]"
                            }`}
                          >
                            {n > 0 ? n : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="px-2 py-1.5 text-center text-[9px] text-[#94a3b8]">Sin stock</span>
                )}
              </div>
            ))}
      </div>
    </div>
  );
});

function liveQueryFromParAndActiva(
  par: ParLineaRef,
  activa: DepositoFila | null,
): StockLiveQuery {
  const sample =
    activa ??
    par.coloresLR[0] ??
    par.gruposMaterial[0]?.colores[0] ??
    par.gruposMaterial[0]?.filas[0] ??
    null;

  const base: StockLiveQuery = {
    linea_id: sample?.linea_id ?? null,
    referencia_id: sample?.referencia_id ?? null,
    linea_codigo_proveedor: par.linea,
    referencia_codigo_proveedor: par.referencia,
  };

  if (!activa) return base;

  return {
    ...base,
    material_id: activa.material_id,
    color_id: activa.color_id,
    material_code: activa.material_code,
    color_code: activa.color_code,
  };
}

export function useStockOtrosLocales(
  clienteId: number,
  par: ParLineaRef | null,
  activa: DepositoFila | null,
) {
  const [ubicaciones, setUbicaciones] = useState<StockUbicacionBloque[]>([]);
  const [cantidadLocal, setCantidadLocal] = useState<number | null>(null);
  const [bootLoading, setBootLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickNonce, setTickNonce] = useState(0);
  const cantidadRef = useRef<number | null>(null);

  const retry = useCallback(() => setTickNonce((n) => n + 1), []);

  useEffect(() => {
    if (!par?.linea?.trim() || !par.referencia?.trim()) {
      setUbicaciones([]);
      setCantidadLocal(null);
      cantidadRef.current = null;
      setBootLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();
    let mounted = true;
    let first = true;
    const liveQ = liveQueryFromParAndActiva(par, activa);

    async function tick() {
      if (first) setBootLoading(true);

      const url = stockLiveUrl(clienteId, liveQ);

      try {
        const r = await fetch(url, { cache: "no-store", signal: ac.signal });
        const data: StockLiveResponse = await r.json();
        if (!mounted || ac.signal.aborted) return;

        if (!r.ok || data.error) {
          setError(data.error ?? "No se pudo consultar stock");
          return;
        }

        setError(null);
        const nextUb = data.ubicaciones ?? [];
        setUbicaciones((prev) => (stockBloquesEqual(prev, nextUb) ? prev : nextUb));

        const nextCant = data.cantidad_local ?? null;
        if (cantidadRef.current !== nextCant) {
          cantidadRef.current = nextCant;
          setCantidadLocal(nextCant);
        }
      } catch (e) {
        if (ac.signal.aborted || !mounted) return;
        setError(e instanceof Error ? e.message : "Error de red");
      } finally {
        if (first && mounted && !ac.signal.aborted) {
          first = false;
          setBootLoading(false);
        }
      }
    }

    function onVis() {
      if (document.visibilityState === "visible") tick();
    }

    function onCobrarOk() {
      tick();
    }

    tick();
    const iv = setInterval(() => {
      if (document.visibilityState === "visible") tick();
    }, LIVE_POLL_MS);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener(POS_COBRAR_OK_EVENT, onCobrarOk);

    return () => {
      mounted = false;
      ac.abort();
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener(POS_COBRAR_OK_EVENT, onCobrarOk);
    };
  }, [
    clienteId,
    par?.linea,
    par?.referencia,
    par?.key,
    activa?.material_id,
    activa?.color_id,
    activa?.material_code,
    activa?.color_code,
    activa?.linea_id,
    activa?.referencia_id,
    tickNonce,
  ]);

  return { ubicaciones, bootLoading, cantidadLocal, error, retry };
}

/** Paneles laterales fijos: San Martín izq · Palma der (u otras si no aplica). */
export function panelesLateralesVentas(
  ubicaciones: StockUbicacionBloque[],
): { izquierda: StockUbicacionBloque; derecha: StockUbicacionBloque } {
  const byId = new Map(ubicaciones.map((u) => [u.id, u]));
  const empty = (id: string, label: string): StockUbicacionBloque => ({
    id,
    label,
    esActual: false,
    tallas: [],
    stock: [],
    stockTotal: 0,
  });

  const pick = (preferId: string, label: string, fallbackId: string, fallbackLabel: string) => {
    const prefer = byId.get(preferId);
    if (prefer && !prefer.esActual) return prefer;
    const fb = byId.get(fallbackId);
    if (fb && !fb.esActual) return fb;
    return empty(preferId, label);
  };

  return {
    izquierda: pick("san_martin", "San Martín", "fernando", "Fernando"),
    derecha: pick("palma", "Palma", "fernando", "Fernando"),
  };
}
