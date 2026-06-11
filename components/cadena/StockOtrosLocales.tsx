"use client";

import type { DepositoFila } from "@/lib/cadena";
import {
  stockLiveUrl,
  type StockLiveResponse,
  type StockUbicacionBloque,
} from "@/lib/stock-otros-locales";
import { useEffect, useState } from "react";

const LIVE_POLL_MS = 4000;

function fmt(n: number) {
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
}

function MiniTablaStock({ bloque }: { bloque: StockUbicacionBloque }) {
  const sinTallas = bloque.tallas.length === 0;

  return (
    <div
      className={`pointer-events-auto min-w-[108px] max-w-[140px] overflow-hidden border bg-white/92 shadow-sm backdrop-blur-sm ${
        bloque.esActual ? "border-[#1b2a41] ring-1 ring-[#1b2a41]/30" : "border-[#c4bdb4]"
      }`}
    >
      <div className="flex items-center justify-between gap-1 border-b border-[#c4bdb4] px-1.5 py-1">
        <span
          className={`rounded-sm px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] ${
            bloque.esActual ? "bg-[#1b2a41] text-[#f4f1ec]" : "bg-[#6b6560] text-white"
          }`}
        >
          {bloque.label}
        </span>
        <span className="text-[8px] font-semibold tabular-nums text-[#1a1a1a]">
          {fmt(bloque.stockTotal)}
        </span>
      </div>
      {sinTallas ? (
        <p className="px-2 py-2 text-center text-[9px] tabular-nums text-[#6b6560]">0</p>
      ) : (
        <table className="w-full border-collapse text-center text-[8px] text-[#1a1a1a]">
          <thead>
            <tr className="bg-[#f4f1ec]/80">
              {bloque.tallas.map((t) => (
                <th
                  key={t}
                  className="border-b border-[#e8e2d9] px-0.5 py-0.5 font-semibold tabular-nums"
                >
                  {t.length > 4 ? t.slice(0, 4) : t}
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
                    n > 0 ? "text-[#1b2a41]" : "text-[#9a9288]"
                  }`}
                >
                  {n}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

const SLOT: Record<string, string> = {
  fernando: "absolute right-2 top-[4.5rem] z-20",
  palma: "absolute bottom-3 left-2 z-20",
  san_martin: "absolute bottom-3 right-2 z-20",
};

type Props = {
  ubicaciones: StockUbicacionBloque[];
  loading?: boolean;
};

export function StockOtrosLocales({ ubicaciones, loading }: Props) {
  return (
    <>
      {ubicaciones.map((bloque) => (
        <div key={bloque.id} className={`pointer-events-none ${SLOT[bloque.id] ?? "absolute z-20"}`}>
          {loading ? (
            <div className="h-12 w-[108px] animate-pulse border border-[#c4bdb4] bg-white/80" />
          ) : (
            <MiniTablaStock bloque={bloque} />
          )}
        </div>
      ))}
    </>
  );
}

export function useStockOtrosLocales(clienteId: number, activa: DepositoFila | null) {
  const [ubicaciones, setUbicaciones] = useState<StockUbicacionBloque[]>([]);
  const [cantidadLocal, setCantidadLocal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activa?.linea_id || !activa.referencia_id || !activa.material_id || !activa.color_id) {
      setUbicaciones([]);
      setCantidadLocal(null);
      return;
    }

    const ac = new AbortController();
    let mounted = true;

    async function tick() {
      if (!activa) return;
      setLoading(true);
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
        setUbicaciones(data.ubicaciones ?? []);
        setCantidadLocal(data.cantidad_local ?? null);
      } catch {
        if (!mounted || ac.signal.aborted) return;
      } finally {
        if (mounted && !ac.signal.aborted) setLoading(false);
      }
    }

    tick();
    const iv = setInterval(tick, LIVE_POLL_MS);

    return () => {
      mounted = false;
      ac.abort();
      clearInterval(iv);
    };
  }, [
    clienteId,
    activa?.linea_id,
    activa?.referencia_id,
    activa?.material_id,
    activa?.color_id,
    activa?.grada,
  ]);

  return { ubicaciones, loading, cantidadLocal };
}
