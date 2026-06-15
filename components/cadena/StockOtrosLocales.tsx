"use client";

import type { DepositoFila } from "@/lib/cadena";
import { stockBloquesEqual } from "@/lib/stock-snapshot-equal";
import {
  formatGradaDisplay,
  stockLiveUrl,
  type StockLiveResponse,
  type StockUbicacionBloque,
} from "@/lib/stock-otros-locales";
import { memo, useEffect, useRef, useState } from "react";

const LIVE_POLL_MS = 20_000;

function fmt(n: number) {
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
}

/** Stock Palma / San Martín — fila compacta en dock inferior. */
export const StockOtrasTiendasDock = memo(function StockOtrasTiendasDock({
  ubicaciones,
}: {
  ubicaciones: StockUbicacionBloque[];
}) {
  const otras = ubicaciones.filter((b) => !b.esActual);
  if (otras.length === 0) return null;

  return (
    <div className="border-b border-[#e8e2d9] bg-white/80 px-2 py-1.5">
      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#6b6560]">
        Otras tiendas
      </p>
      <div className="flex flex-wrap gap-2">
        {otras.map((bloque) => (
          <div
            key={bloque.id}
            className="flex min-w-0 flex-1 basis-[140px] items-center gap-2 rounded-md border border-[#c4bdb4] bg-[#faf8f5] px-2 py-1.5"
          >
            <div className="shrink-0 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2a41]">
                {bloque.label}
              </p>
              <p className="text-xs font-bold tabular-nums text-[#1a1a1a]">{fmt(bloque.stockTotal)}</p>
            </div>
            {bloque.tallas.length > 0 ? (
              <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                {bloque.tallas.map((t, i) => {
                  const n = bloque.stock[i] ?? 0;
                  return (
                    <span
                      key={`${t}-${i}`}
                      className={`rounded px-1 py-0.5 font-mono text-[9px] tabular-nums ${
                        n > 0 ? "bg-white font-semibold text-[#1b2a41]" : "text-[#c4bdb4]"
                      }`}
                    >
                      {formatGradaDisplay(t)}:{n}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-[10px] text-[#9a9288]">Sin stock</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export function useStockOtrosLocales(clienteId: number, activa: DepositoFila | null) {
  const [ubicaciones, setUbicaciones] = useState<StockUbicacionBloque[]>([]);
  const [cantidadLocal, setCantidadLocal] = useState<number | null>(null);
  const [bootLoading, setBootLoading] = useState(false);
  const cantidadRef = useRef<number | null>(null);

  useEffect(() => {
    if (!activa?.linea_id || !activa.referencia_id || !activa.material_id || !activa.color_id) {
      setUbicaciones([]);
      setCantidadLocal(null);
      cantidadRef.current = null;
      setBootLoading(false);
      return;
    }

    const ac = new AbortController();
    let mounted = true;
    let first = true;

    async function tick() {
      if (!activa) return;
      if (first) setBootLoading(true);

      const url = stockLiveUrl(
        clienteId,
        {
          linea_id: activa.linea_id!,
          referencia_id: activa.referencia_id!,
          material_id: activa.material_id!,
          color_id: activa.color_id!,
        },
        activa.grada,
      );

      try {
        const r = await fetch(url, { cache: "no-store", signal: ac.signal });
        const data: StockLiveResponse = await r.json();
        if (!mounted || ac.signal.aborted) return;

        const nextUb = data.ubicaciones ?? [];
        setUbicaciones((prev) => (stockBloquesEqual(prev, nextUb) ? prev : nextUb));

        const nextCant = data.cantidad_local ?? null;
        if (cantidadRef.current !== nextCant) {
          cantidadRef.current = nextCant;
          setCantidadLocal(nextCant);
        }
      } catch {
        /* silencioso */
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

    tick();
    const iv = setInterval(() => {
      if (document.visibilityState === "visible") tick();
    }, LIVE_POLL_MS);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mounted = false;
      ac.abort();
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [
    clienteId,
    activa?.linea_id,
    activa?.referencia_id,
    activa?.material_id,
    activa?.color_id,
    activa?.grada,
  ]);

  return { ubicaciones, bootLoading, cantidadLocal };
}
