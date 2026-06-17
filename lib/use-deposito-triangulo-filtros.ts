"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FILTROS_ENTRADA_VACIOS,
  type FiltrosEntrada,
  type OpcionChip,
  type ReferenciaEntrada,
} from "@/lib/cadena-entrada-filtros";
import { filtrosToSearchParams } from "@/lib/filtros-url";

export type FiltrosTrianguloApi = {
  generos: OpcionChip[];
  marcas: OpcionChip[];
  estilos: OpcionChip[];
  tipos: OpcionChip[];
  marcasEntrada: { marca: string; skus: number; pares: number }[];
  referencias: ReferenciaEntrada[];
  resumen: { skus: number; pares: number; ultima_carga: string | null };
  ms?: number;
};

function filtrosEntradaToSql(f: FiltrosEntrada): URLSearchParams {
  return filtrosToSearchParams({
    generos: f.generos,
    marcas: f.marcas,
    estilos: f.estilos,
    tipos: f.tipos,
    referenciaKeys: f.referenciaKeys,
    buscar: f.buscar,
  });
}

/** Triángulo header — chips género/marca/estilo/tipo vía `/api/deposito/{id}/filtros`. */
export function useDepositoTrianguloFiltros(clienteId: number) {
  const [filtros, setFiltros] = useState<FiltrosEntrada>(FILTROS_ENTRADA_VACIOS);
  const [api, setApi] = useState<FiltrosTrianguloApi | null>(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hadApi = useRef(false);

  useEffect(() => {
    hadApi.current = false;
    setApi(null);
    setBootLoading(true);
  }, [clienteId]);

  const filtrosKey = useMemo(() => filtrosEntradaToSql(filtros).toString(), [filtros]);

  const cargarFiltros = useCallback(async (cid: number, qs: string, firstBoot: boolean) => {
    if (firstBoot) setBootLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const r = await fetch(`/api/deposito/${cid}/filtros?${qs}`, { cache: "no-store" });
      const ct = r.headers.get("content-type") ?? "";
      if (!ct.includes("application/json")) {
        if (r.status === 401 || r.status === 307 || r.redirected) {
          throw new Error("Sesión expirada — abrí /api/auth/auto-login");
        }
        throw new Error(`API filtros respondió HTML (${r.status})`);
      }
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setApi({
        generos: data.generos ?? [],
        marcas: data.marcas ?? [],
        estilos: data.estilos ?? [],
        tipos: data.tipos ?? [],
        marcasEntrada: data.marcasEntrada ?? [],
        referencias: data.referencias ?? [],
        resumen: data.resumen ?? { skus: 0, pares: 0, ultima_carga: null },
        ms: data.ms,
      });
      hadApi.current = true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      if (!hadApi.current) setApi(null);
    } finally {
      setBootLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const delay = filtros.buscar.trim() ? 650 : 350;
    const t = setTimeout(
      () => cargarFiltros(clienteId, filtrosKey, !hadApi.current),
      delay,
    );
    return () => clearTimeout(t);
  }, [clienteId, filtrosKey, filtros.buscar, cargarFiltros]);

  const reload = useCallback(() => {
    void cargarFiltros(clienteId, filtrosKey, false);
  }, [cargarFiltros, clienteId, filtrosKey]);

  return {
    filtros,
    setFiltros,
    api,
    bootLoading,
    refreshing,
    error,
    filtrosKey,
    filtrosQueryString: filtrosKey,
    reload,
  };
}
