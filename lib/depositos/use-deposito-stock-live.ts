"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";
import { stockBloquesEqual } from "@/lib/stock-snapshot-equal";
import {
  stockLiveUrl,
  type StockLiveResponse,
  type StockUbicacionBloque,
} from "@/lib/stock-otros-locales";

const LIVE_POLL_MS = 4_000;

/** Poll `/live` por molécula activa — misma fuente que Ventas (integridad cohorte). */
export function useDepositoStockLive(clienteId: number, card: ProductoCajaCard | null) {
  const [ubicaciones, setUbicaciones] = useState<StockUbicacionBloque[]>([]);
  const [cantidadLocal, setCantidadLocal] = useState<number | null>(null);
  const [bootLoading, setBootLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickNonce, setTickNonce] = useState(0);
  const cantidadRef = useRef<number | null>(null);

  const retry = useCallback(() => setTickNonce((n) => n + 1), []);

  useEffect(() => {
    if (!card) {
      setUbicaciones([]);
      setCantidadLocal(null);
      cantidadRef.current = null;
      setBootLoading(false);
      setError(null);
      return;
    }

    const p = card.producto;
    const ac = new AbortController();
    let mounted = true;
    let first = true;

    async function tick() {
      if (first) setBootLoading(true);

      const url = stockLiveUrl(clienteId, {
        linea_id: null,
        referencia_id: null,
        linea_codigo_proveedor: p.linea_codigo_proveedor,
        referencia_codigo_proveedor: p.referencia_codigo_proveedor,
        material_id: null,
        color_id: null,
        material_code: p.material_code,
        color_code: p.color_code,
      });

      try {
        const r = await fetch(url, { cache: "no-store", signal: ac.signal });
        const data: StockLiveResponse = await r.json();
        if (!mounted || ac.signal.aborted) return;

        if (!r.ok || data.error) {
          setError(data.error ?? "No se pudo consultar stock en vivo");
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
    card?.key,
    card?.producto.linea_codigo_proveedor,
    card?.producto.referencia_codigo_proveedor,
    card?.producto.material_code,
    card?.producto.color_code,
    tickNonce,
  ]);

  return { ubicaciones, cantidadLocal, bootLoading, error, retry };
}
