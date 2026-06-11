"use client";



import Link from "next/link";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FiltrosCabecera } from "@/components/cadena/FiltrosCabecera";

import { TouchPad } from "@/components/cadena/TouchPad";

import {

  FILTROS_ENTRADA_VACIOS,

  hayFiltrosEntradaActivos,

  type FiltrosEntrada,

  type OpcionChip,

  type ReferenciaEntrada,

} from "@/lib/cadena-entrada-filtros";

import { DEPOSITOS } from "@/lib/depositos-config";

import { filtrosToSearchParams } from "@/lib/filtros-url";



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

  const [clienteId, setClienteId] = useState(2100);

  const [filtros, setFiltros] = useState<FiltrosEntrada>(FILTROS_ENTRADA_VACIOS);

  const [api, setApi] = useState<FiltrosApi | null>(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [ingresando, setIngresando] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [ingresoError, setIngresoError] = useState<string | null>(null);



  const depositoActivo = DEPOSITOS.find((d) => d.cliente_id === clienteId);

  const hadApi = useRef(false);

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

    <div className="flex min-h-[100dvh] flex-col touch-manipulation bg-[#f4f1ec]">

      <header className="grid shrink-0 grid-cols-[52px_1fr] border-b border-[#c4bdb4] bg-[#f4f1ec]">

        <Link

          href="/"

          className="flex min-h-[52px] items-center justify-center border-r border-[#c4bdb4] text-lg text-[#1a1a1a] active:bg-[#e8e2d9]"

          aria-label="Panel"

        >

          ←

        </Link>

        <div className="flex min-h-[52px] flex-col items-center justify-center px-2 font-br tracking-wide text-[#1a1a1a]">

          <span className="text-lg">{depositoActivo ? `${depositoActivo.ente} · ${depositoActivo.tipo}` : "Cadena"}</span>

          {api?.resumen && (
            <span className="font-mono text-[9px] tabular-nums text-[#6b6560]">
              {api.resumen.skus.toLocaleString()} SKUs · {Math.round(api.resumen.pares).toLocaleString()} p
              {api.ms != null ? ` · ${api.ms}ms` : ""}
              {refreshing ? " · …" : ""}
            </span>
          )}

        </div>

      </header>



      <div className="flex gap-1.5 overflow-x-auto border-b border-[#c4bdb4] px-2 py-2 snap-x">

        {DEPOSITOS.map((d) => (

          <TouchPad

            key={d.cliente_id}

            onClick={() => setClienteId(d.cliente_id)}

            ariaLabel={`${d.ente} ${d.tipo}`}

            className={`min-h-[48px] shrink-0 snap-center border px-3 py-1.5 ${

              clienteId === d.cliente_id

                ? "border-[#ea580c] bg-[#ea580c] text-white font-semibold"

                : "border-[#8a8278] bg-white text-[#1a1a1a] active:bg-[#e8e2d9]"

            }`}

          >

            <span className="block font-br text-xs tracking-wide">{d.ente}</span>

            <span className="mt-0.5 block text-[9px] uppercase tracking-[0.16em] opacity-90">{d.tipo}</span>

          </TouchPad>

        ))}

      </div>



      <div className="shrink-0 border-b border-[#c4bdb4] p-2">

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

            className="mt-2 min-h-[44px] w-full border border-[#8a8278] text-sm text-[#6b6560] active:bg-[#e8e2d9]"

          >

            Limpiar filtros

          </TouchPad>

        )}

      </div>



      <main className="min-h-0 flex-1 overflow-y-auto p-2 pb-28">

        {bootLoading && !api && (
          <div className="flex items-center justify-center py-24">
            <span className="h-10 w-10 animate-pulse rounded-full bg-[#9a9288]/40" />
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

          <p className="py-12 text-center font-br text-lg text-[#6b6560]">Aplicá filtros o usa INGRESAR</p>

        )}



        {api && !error && refs.length > 0 && (

          <>

            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6560]">

              {refs.length} Referencias encontradas

            </p>

            <div className="space-y-1">

              {refs.slice(0, 120).map((r) => (

                <TouchPad

                  key={r.key}

                  onClick={() => ingresar(r.marca, r.key)}

                  ariaLabel={`${r.linea}.${r.referencia}`}

                  className="flex min-h-[52px] w-full items-center justify-between gap-2 border border-[#c4bdb4] bg-white px-3 py-2 text-left active:bg-[#fff7ed]"

                >

                  <div className="min-w-0">

                    <span className="font-mono text-sm font-semibold text-[#1a1a1a]">

                      {r.linea}.{r.referencia}

                    </span>

                    <span className="mt-0.5 block truncate font-br text-xs text-[#6b6560]">{r.estilo}</span>

                  </div>

                  <div className="shrink-0 text-right">

                    <span className="block text-[10px] uppercase tracking-wider text-[#9a9288]">{r.marca}</span>

                    <span className="font-mono text-xs tabular-nums text-[#ea580c]">{Math.round(r.pares)} p</span>

                  </div>

                </TouchPad>

              ))}

            </div>

          </>

        )}

      </main>



      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#c4bdb4] bg-[#f4f1ec]/95 p-3 backdrop-blur-sm">

        {ingresoError && (

          <p className="mb-2 text-center text-sm text-red-800">{ingresoError}</p>

        )}

        <TouchPad

          onClick={() => ingresar()}

          ariaLabel="Ingresar al catálogo"

          disabled={!puedeIngresar || ingresando}

          className={`min-h-[72px] w-full font-br text-2xl tracking-[0.12em] shadow-lg ${

            puedeIngresar && !ingresando

              ? "bg-[#ea580c] text-white active:bg-[#c2410c]"

              : "bg-[#9a9288] text-[#f4f1ec] opacity-60"

          }`}

        >

          {ingresando ? "Ingresando…" : "INGRESAR"}

        </TouchPad>

      </div>

    </div>

  );

}


