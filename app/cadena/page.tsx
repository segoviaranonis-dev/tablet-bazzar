"use client";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FiltrosCabecera } from "@/components/cadena/FiltrosCabecera";
import { CadenaEntradaHeader } from "@/components/cadena/CadenaEntradaHeader";
import { StagingTicketsPanel } from "@/components/pos/StagingTicketsPanel";
import { SelectorDepositos } from "@/components/cadena/SelectorDepositos";
import { TouchPad } from "@/components/cadena/TouchPad";

import {

  FILTROS_ENTRADA_VACIOS,

  hayFiltrosEntradaActivos,

  type FiltrosEntrada,

  type OpcionChip,

  type ReferenciaEntrada,

} from "@/lib/cadena-entrada-filtros";

import { cadenaQueryKey, saveCadenaSeed } from "@/lib/cadena-seed";

import { DEPOSITOS } from "@/lib/depositos-config";

import { filtrosToSearchParams } from "@/lib/filtros-url";
import { POS_COBRAR_OK_EVENT } from "@/lib/pos-events";

const TIENDA_STORAGE_KEY = "tablet_tienda_cliente_id";

function tiendaInicial(): number {
  if (typeof window === "undefined") return 2900;
  try {
    const raw = localStorage.getItem(TIENDA_STORAGE_KEY);
    const n = Number(raw);
    if (Number.isFinite(n) && DEPOSITOS.some((d) => d.cliente_id === n)) return n;
  } catch {
    /* ignore */
  }
  return 2900;
}

type FiltrosApi = {

  generos: OpcionChip[];

  marcas: OpcionChip[];

  estilos: OpcionChip[];

  tipos: OpcionChip[];

  marcasEntrada: { marca: string; skus: number; pares: number }[];

  referencias: ReferenciaEntrada[];

  resumen: { skus: number; pares: number; ultima_carga: string | null };

  ms?: number;

};



function filtrosEntradaToSql(f: FiltrosEntrada) {

  return filtrosToSearchParams({

    generos: f.generos,

    marcas: f.marcas,

    estilos: f.estilos,

    tipos: f.tipos,

    referenciaKeys: f.referenciaKeys,

    buscar: f.buscar,

  });

}



export default function CadenaMarcaPage() {

  const router = useRouter();

  const [clienteId, setClienteId] = useState(tiendaInicial);

  const [filtros, setFiltros] = useState<FiltrosEntrada>(FILTROS_ENTRADA_VACIOS);

  const [api, setApi] = useState<FiltrosApi | null>(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [ingresando, setIngresando] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [ingresoError, setIngresoError] = useState<string | null>(null);
  const [stagingOpen, setStagingOpen] = useState(false);



  const depositoActivo = DEPOSITOS.find((d) => d.cliente_id === clienteId);

  const hadApi = useRef(false);

  useEffect(() => {
    localStorage.setItem(TIENDA_STORAGE_KEY, String(clienteId));
  }, [clienteId]);

  useEffect(() => {
    hadApi.current = false;
    setApi(null);
    setBootLoading(true);
  }, [clienteId]);

  const filtrosKey = useMemo(
    () => filtrosEntradaToSql(filtros).toString(),
    [filtros],
  );

  const cargarFiltros = useCallback(async (cid: number, qs: string, firstBoot: boolean) => {
    if (firstBoot) setBootLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const r = await fetch(`/api/deposito/${cid}/filtros?${qs}`, { cache: "no-store" });
      const ct = r.headers.get("content-type") ?? "";
      if (!ct.includes("application/json")) {
        if (r.status === 401 || r.status === 307 || r.redirected) {
          throw new Error("Sesión expirada — abrí http://localhost:3002/api/auth/auto-login");
        }
        throw new Error(`API filtros respondió HTML (${r.status}) — ejecutá REINICIAR_DEV.bat`);
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

  useEffect(() => {
    function onCobrarOk() {
      void cargarFiltros(clienteId, filtrosKey, false);
    }
    window.addEventListener(POS_COBRAR_OK_EVENT, onCobrarOk);
    return () => window.removeEventListener(POS_COBRAR_OK_EVENT, onCobrarOk);
  }, [clienteId, filtrosKey, cargarFiltros]);



  async function ingresar(marcaOverride?: string, refKey?: string) {

    setIngresando(true);

    setIngresoError(null);

    try {

      const body: Record<string, unknown> = {

        generos: filtros.generos,

        marcas: filtros.marcas,

        estilos: filtros.estilos,

        tipos: filtros.tipos,

        referenciaKeys: refKey ? [refKey] : filtros.referenciaKeys,

        buscar: filtros.buscar,

      };

      if (marcaOverride) body.marca = marcaOverride;



      const r = await fetch(`/api/deposito/${clienteId}/ingresar`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(body),

        cache: "no-store",

      });

      const data = await r.json();

      if (!data.ok) throw new Error(data.error ?? "No se pudo ingresar");

      if (data.paresAll?.length) {
        const uSeed = new URL(data.vistaUrl as string, window.location.origin);
        saveCadenaSeed({
          cliente_id: clienteId,
          marca: data.marca as string,
          queryKey: cadenaQueryKey(uSeed.searchParams.toString()),
          paresAll: data.paresAll,
          posicion: data.posicion,
        });
      }

      let url = data.vistaUrl as string;

      const pos = data.posicion;

      if (pos) {

        const u = new URL(url, window.location.origin);

        u.searchParams.set("pi", String(pos.parIndex));

        u.searchParams.set("gi", String(pos.grupoIndex));

        u.searchParams.set("c1", String(pos.colorG1));

        u.searchParams.set("c2", String(pos.colorG2));

        url = u.pathname + u.search;

      }

      router.push(url);

    } catch (e) {

      setIngresoError(e instanceof Error ? e.message : "Error al ingresar");

    } finally {

      setIngresando(false);

    }

  }



  const marcas = api?.marcasEntrada ?? [];

  const refs = api?.referencias ?? [];

  // Permitir INGRESAR siempre - sin filtros = ver TODO

  const puedeIngresar = !bootLoading && !error;



  return (
    <div className="flex min-h-[100dvh] flex-col touch-manipulation bg-app-bg">
      <CadenaEntradaHeader
        titulo={depositoActivo ? `${depositoActivo.ente} · ${depositoActivo.tipo}` : "Ventas"}
        registros={api?.resumen?.skus}
        pares={api?.resumen?.pares}
        ms={api?.ms}
        refreshing={refreshing}
        extra={
          <button
            type="button"
            onClick={() => setStagingOpen(true)}
            className="rounded border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase text-white"
          >
            Tickets
          </button>
        }
      />
      <StagingTicketsPanel clienteId={clienteId} open={stagingOpen} onClose={() => setStagingOpen(false)} />

      <SelectorDepositos clienteId={clienteId} onSelect={setClienteId} />

      <div className="shrink-0 border-b border-orange-100 bg-gradient-to-b from-white to-orange-50/40 p-2">

        {api && (
          <FiltrosCabecera

            filtros={filtros}

            generos={api.generos}

            marcas={api.marcas}

            estilos={api.estilos}

            tipos={api.tipos}

            referencias={refs.map((r) => ({

              key: r.key,

              linea: r.linea,

              referencia: r.referencia,

              count: Math.round(r.pares),

            }))}

            onChange={setFiltros}

            onEnter={() => ingresar()}

          />

        )}

        {hayFiltrosEntradaActivos(filtros) && (

          <TouchPad

            onClick={() => setFiltros(FILTROS_ENTRADA_VACIOS)}

            ariaLabel="Limpiar filtros"

            className="mt-2 min-h-[44px] w-full rounded-xl border border-orange-200 bg-white text-sm font-semibold text-bazzar-naranja active:bg-orange-50"

          >

            Limpiar filtros

          </TouchPad>

        )}

      </div>



      <main className="min-h-0 flex-1 overflow-y-auto p-3 pb-32">
        {bootLoading && !api && (
          <div className="flex items-center justify-center py-24">
            <span className="h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-orange-200 to-orange-400" />
          </div>
        )}

        {error && (

          <TouchPad

            onClick={() => cargarFiltros(clienteId, filtrosKey, false)}

            ariaLabel="Reintentar"

            className="m-2 min-h-[52px] border border-red-300 bg-red-50 px-4 py-3 text-red-900"

          >

            Reintentar · {error}

          </TouchPad>

        )}



        {!bootLoading && !error && refs.length === 0 && api && (

          <p className="py-12 text-center text-lg font-semibold text-slate-500">
            Aplicá filtros o tocá <span className="text-bazzar-naranja">INGRESAR</span>
          </p>

        )}



        {api && !error && refs.length > 0 && (

          <>

            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rimec-azul">
                Referencias
              </p>
              <span className="bazzar-badge">{refs.length} encontradas</span>
            </div>

            <div className="space-y-2">
              {refs.slice(0, 120).map((r) => (
                <TouchPad
                  key={r.key}
                  onClick={() => ingresar(r.marca, r.key)}
                  ariaLabel={`${r.linea}.${r.referencia}`}
                  className="bazzar-ref-row"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-sm font-extrabold text-rimec-azul">
                      {r.linea}
                      <span className="text-bazzar-naranja">.{r.referencia}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{r.estilo}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {r.marca}
                    </span>
                    <span className="mt-0.5 inline-flex rounded-full bg-orange-100 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-bazzar-naranja">
                      {Math.round(r.pares)} p
                    </span>
                  </div>
                </TouchPad>
              ))}
            </div>

          </>

        )}

      </main>



      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-200 bg-white/95 p-3 shadow-[0_-8px_32px_rgba(234,88,12,0.12)] backdrop-blur-sm">
        {ingresoError && (
          <p className="mb-2 text-center text-sm font-semibold text-red-700">{ingresoError}</p>
        )}
        <TouchPad
          onClick={() => ingresar()}
          ariaLabel="Ingresar al catálogo"
          disabled={!puedeIngresar || ingresando}
          className="bazzar-btn-primary"
        >
          {ingresando ? "Ingresando…" : "INGRESAR"}
        </TouchPad>
      </div>

    </div>

  );

}


