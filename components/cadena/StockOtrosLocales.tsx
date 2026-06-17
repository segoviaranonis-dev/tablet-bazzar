"use client";

import type { DepositoFila, ParLineaRef } from "@/lib/cadena";
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
            className="flex min-w-0 flex-1 basis-[160px] flex-col overflow-hidden rounded-md border border-[#c4bdb4] bg-[#faf8f5]"
          >
            <div className="flex items-center justify-between gap-1 border-b border-[#c4bdb4] px-2 py-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#1b2a41]">{bloque.label}</p>
              <p className="text-xs font-bold tabular-nums text-[#1a1a1a]">{fmt(bloque.stockTotal)} p</p>
            </div>
            {bloque.tallas.length > 0 ? (
              <table className="w-full border-collapse text-center text-[9px] text-[#1a1a1a]">
                <thead>
                  <tr className="bg-white/90">
                    {bloque.tallas.map((t) => (
                      <th key={t} className="border-b border-[#e8e2d9] px-0.5 py-0.5 font-semibold tabular-nums">
                        {formatGradaDisplay(t)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {bloque.stock.map((n, i) => (
                      <td
                        key={`${bloque.tallas[i]}-${i}`}
                        className={`px-0.5 py-1 tabular-nums font-semibold ${
                          n > 0 ? "text-[#1b2a41]" : "text-[#c4bdb4]"
                        }`}
                      >
                        {n > 0 ? n : "—"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            ) : (
              <span className="px-2 py-2 text-center text-[10px] text-[#9a9288]">Sin stock</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

function parLiveQuery(par: ParLineaRef): {
  linea_id: number | null;
  referencia_id: number | null;
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
} {
  const sample =
    par.coloresLR[0] ??
    par.gruposMaterial[0]?.colores[0] ??
    par.gruposMaterial[0]?.filas[0] ??
    null;
  return {
    linea_id: sample?.linea_id ?? null,
    referencia_id: sample?.referencia_id ?? null,
    linea_codigo_proveedor: par.linea,
    referencia_codigo_proveedor: par.referencia,
  };
}

export function useStockOtrosLocales(clienteId: number, par: ParLineaRef | null) {
  const [ubicaciones, setUbicaciones] = useState<StockUbicacionBloque[]>([]);
  const [cantidadLocal, setCantidadLocal] = useState<number | null>(null);
  const [bootLoading, setBootLoading] = useState(false);
  const cantidadRef = useRef<number | null>(null);

  useEffect(() => {
    if (!par?.linea?.trim() || !par.referencia?.trim()) {
      setUbicaciones([]);
      setCantidadLocal(null);
      cantidadRef.current = null;
      setBootLoading(false);
      return;
    }

    const ac = new AbortController();
    let mounted = true;
    let first = true;
    const livePar = parLiveQuery(par);

    async function tick() {
      if (first) setBootLoading(true);

      const url = stockLiveUrl(clienteId, livePar);

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
  }, [clienteId, par?.linea, par?.referencia, par?.key]);

  return { ubicaciones, bootLoading, cantidadLocal };
}
