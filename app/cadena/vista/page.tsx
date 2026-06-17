"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CarruselColores } from "@/components/cadena/CarruselColores";
import { CarruselNaipesLR } from "@/components/cadena/CarruselNaipesLR";
import { LineaReferenciaHero } from "@/components/cadena/LineaReferenciaHero";
import { MultiSelectFlotante } from "@/components/cadena/MultiSelectFlotante";
import { StockOtrasTiendasDock, useStockOtrosLocales } from "@/components/cadena/StockOtrosLocales";
import { TouchPad } from "@/components/cadena/TouchPad";
import { HeroProductImage } from "@/components/cadena/HeroProductImage";
import { TrianguloResumenStrip } from "@/components/cadena/TrianguloResumenStrip";
import type { DepositoFila, ParLineaRef } from "@/lib/cadena";
import {
  FILTROS_VACIOS,
  filtrarPares,
  toggleEstilo,
  toggleReferencia,
  type FiltrosCadena,
} from "@/lib/cadena-filtros";
import { cadenaBackgroundStyle } from "@/lib/product-image";
import { prefetchCadenaNeighborhood } from "@/lib/prefetch-images";
import { useTouchNav } from "@/lib/use-touch-nav";
import { useCadenaKeyboard } from "@/lib/use-cadena-keyboard";
import { cadenaQueryKey, loadCadenaSeed } from "@/lib/cadena-seed";
import {
  resolveCadenaBootState,
  resolveColorFilterState,
  resolveFiltrosChangeState,
} from "@/lib/cadena-boot";
import { parseFiltrosCadenaFromUrl } from "@/lib/cadena-entrada-filtros";
import {
  filaActiva,
  parseCodigoVendedor,
  resolveCodigoEnCadena,
  resolveIndicesForFila,
} from "@/lib/codigo-busqueda";
import { GradaVentaStrip } from "@/components/pos/GradaVentaStrip";
import { PosCartSheet } from "@/components/pos/PosCartSheet";
import { usePosCart } from "@/lib/cart/PosCartContext";

const DEFAULT_CLIENTE = 2100;

function PanelColapsable({
  open,
  children,
  widthClass = "w-[108px]",
}: {
  open: boolean;
  children: React.ReactNode;
  widthClass?: string;
}) {
  return (
    <div
      className={`shrink-0 overflow-hidden border-[#c4bdb4] bg-[#f4f1ec] transition-[width,opacity] duration-200 ease-out ${
        open ? `${widthClass} opacity-100` : "w-0 opacity-0"
      }`}
    >
      <div className={`h-full ${widthClass}`}>{children}</div>
    </div>
  );
}

function CadenaVistaInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { setSession } = usePosCart();
  const marca = sp.get("marca") ?? "";
  const clienteId = Number(sp.get("cliente_id") ?? DEFAULT_CLIENTE);
  const qBuscar = sp.get("q") ?? "";
  const posUrl = {
    pi: Number(sp.get("pi") ?? NaN),
    gi: Number(sp.get("gi") ?? NaN),
    c1: Number(sp.get("c1") ?? NaN),
    c2: Number(sp.get("c2") ?? NaN),
  };

  const [paresAll, setParesAll] = useState<ParLineaRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posApplied, setPosApplied] = useState(false);
  const bootFiltrosKeyRef = useRef<string | null>(null);
  const serverPosicionRef = useRef<{
    parIndex: number;
    grupoIndex: number;
    colorG1: number;
    colorG2: number;
  } | null>(null);

  const [filtros, setFiltros] = useState<FiltrosCadena>(FILTROS_VACIOS);
  const [estiloPanelOpen, setEstiloPanelOpen] = useState(false);
  const [referenciaPanelOpen, setReferenciaPanelOpen] = useState(false);

  const [parIndex, setParIndex] = useState(0);
  const [grupoIndex, setGrupoIndex] = useState(0);
  const [colorG1, setColorG1] = useState(0);
  const [colorG2, setColorG2] = useState(0);
  const [detalleOpen, setDetalleOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  const opciones = useMemo(() => {
    const estMap = new Map<string, number>();
    const refMap = new Map<string, { key: string; linea: string; referencia: string; estilo: string; count: number }>();
    for (const p of paresAll) {
      if (p.estilo) estMap.set(p.estilo, (estMap.get(p.estilo) ?? 0) + 1);
      const prev = refMap.get(p.key);
      if (prev) prev.count += 1;
      else refMap.set(p.key, { key: p.key, linea: p.linea, referencia: p.referencia, estilo: p.estilo, count: 1 });
    }
    let refs = [...refMap.values()];
    if (filtros.estilos.length > 0) {
      refs = refs.filter((r) => filtros.estilos.includes(r.estilo));
    }
    let estilos = [...estMap.entries()].map(([value, count]) => ({ value, count }));
    if (filtros.referenciaKeys.length > 0) {
      const estSet = new Set(
        paresAll.filter((p) => filtros.referenciaKeys.includes(p.key)).map((p) => p.estilo),
      );
      estilos = estilos.filter((e) => estSet.has(e.value));
    }
    return { estilos, referencias: refs, colores: [] as { code: string; label: string; count: number }[] };
  }, [paresAll, filtros.estilos, filtros.referenciaKeys]);

  const pares = useMemo(() => filtrarPares(paresAll, filtros), [paresAll, filtros]);
  const paresNav = pares.length > 0 ? pares : paresAll;

  const estiloItems = useMemo(
    () => opciones.estilos.map((e) => ({ id: e.value, label: e.value, sub: `${e.count}` })),
    [opciones.estilos],
  );
  const refItems = useMemo(
    () =>
      opciones.referencias.map((r) => ({
        id: r.key,
        label: `${r.linea}.${r.referencia}`,
        sub: r.estilo || `${r.count}`,
      })),
    [opciones.referencias],
  );

  const parNav: ParLineaRef | null = paresNav[parIndex] ?? null;
  const par: ParLineaRef | null = pares[parIndex] ?? parNav;
  const activaBase = par
    ? filaActiva(par, grupoIndex, colorG1) ?? par.coloresLR[colorG2] ?? null
    : null;

  const { ubicaciones: stockUbicaciones, cantidadLocal } =
    useStockOtrosLocales(clienteId, parNav);

  const activa = activaBase;
  const cantidadMostrada =
    cantidadLocal != null ? cantidadLocal : activaBase?.cantidad ?? 0;

  const bgStyle = useMemo(
    () => (parNav ? cadenaBackgroundStyle(parNav.linea, parNav.referencia) : undefined),
    [parNav],
  );

  const filtrosKey = `${filtros.estilos.join(",")}|${filtros.referenciaKeys.join(",")}|${filtros.colorCode ?? ""}`;
  const sinResultados = pares.length === 0 && paresAll.length > 0;

  useEffect(() => {
    setFiltros(parseFiltrosCadenaFromUrl(sp));
  }, [sp]);

  const cadenaQueryString = useMemo(() => {
    const p = new URLSearchParams(sp.toString());
    for (const k of ["pi", "gi", "c1", "c2"]) p.delete(k);
    return p.toString();
  }, [sp]);

  const applyBootPosition = useCallback(
    (serverPos?: { parIndex: number; grupoIndex: number; colorG1: number; colorG2: number } | null) => {
      if (paresNav.length === 0) return;
      const nav = resolveCadenaBootState({
        paresNav,
        posUrl,
        serverPosicion: serverPos ?? serverPosicionRef.current,
        qBuscar,
        filtros,
      });
      setParIndex(nav.parIndex);
      setGrupoIndex(nav.grupoIndex);
      setColorG1(nav.colorG1);
      setColorG2(nav.colorG2);
      setPosApplied(true);
      bootFiltrosKeyRef.current = filtrosKey;
    },
    [paresNav, posUrl, qBuscar, filtros, filtrosKey],
  );

  useEffect(() => {
    if (marca && Number.isFinite(clienteId)) {
      setSession({ cliente_id: clienteId, marca });
    }
  }, [marca, clienteId, setSession]);

  useEffect(() => {
    if (!marca) {
      router.replace("/cadena");
      return;
    }

    const qKey = cadenaQueryKey(cadenaQueryString);
    const seed = loadCadenaSeed(clienteId, marca, qKey);
    if (seed) {
      serverPosicionRef.current = seed.posicion ?? null;
      setParesAll(seed.paresAll);
      setLoading(false);
      setError(null);
      setPosApplied(false);
      return;
    }

    setLoading(true);
    setPosApplied(false);
    serverPosicionRef.current = null;
    fetch(`/api/deposito/${clienteId}/cadena?${cadenaQueryString}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const all = data.paresAll ?? data.pares ?? [];
        serverPosicionRef.current = data.posicion ?? null;
        setParesAll(all);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [marca, clienteId, router, cadenaQueryString]);

  useEffect(() => {
    if (posApplied || paresNav.length === 0 || loading) return;
    applyBootPosition(serverPosicionRef.current);
  }, [posApplied, paresNav.length, loading, applyBootPosition]);

  useEffect(() => {
    if (!posApplied || bootFiltrosKeyRef.current === filtrosKey) return;
    setDetalleOpen(false);
    const next = resolveFiltrosChangeState(paresNav, filtros, posUrl.pi);
    if (next) {
      setParIndex(next.parIndex);
      setGrupoIndex(next.grupoIndex);
      setColorG1(next.colorG1);
      setColorG2(next.colorG2);
    }
    bootFiltrosKeyRef.current = filtrosKey;
  }, [filtrosKey, paresNav, posApplied, filtros, posUrl.pi]);

  useEffect(() => {
    if (parIndex >= paresNav.length && paresNav.length > 0) setParIndex(0);
    if (!posApplied || !par || !filtros.colorCode) return;
    const next = resolveColorFilterState(par, filtros.colorCode);
    if (next) {
      setGrupoIndex(next.grupoIndex);
      setColorG1(next.colorG1);
    }
  }, [parIndex, paresNav.length, par, filtros.colorCode, posApplied]);

  useEffect(() => {
    if (paresNav.length === 0) return;
    prefetchCadenaNeighborhood(parNav, parIndex, paresNav, grupoIndex, colorG1, activa);
  }, [parIndex, paresNav, parNav, grupoIndex, colorG1, activa]);

  const irPar = useCallback(
    (next: number) => {
      if (paresNav.length === 0) return;
      const i = ((next % paresNav.length) + paresNav.length) % paresNav.length;
      setParIndex(i);
      if (!filtros.colorCode) {
        setGrupoIndex(0);
        setColorG1(0);
        setColorG2(0);
      }
      setDetalleOpen(false);
    },
    [paresNav.length, filtros.colorCode],
  );

  const stepPar = useCallback((delta: number) => irPar(parIndex + delta), [irPar, parIndex]);

  const selectColorFila = useCallback(
    (fila: DepositoFila) => {
      if (!parNav) return;
      const idx = resolveIndicesForFila(parNav, fila);
      if (idx) {
        setGrupoIndex(idx.grupoIndex);
        setColorG1(idx.colorG1);
      }
    },
    [parNav],
  );

  const stepColorEnPar = useCallback(
    (delta: number) => {
      if (!parNav || parNav.coloresLR.length === 0) return;
      const cur = activa ?? parNav.coloresLR[0];
      if (!cur) return;
      const i = parNav.coloresLR.findIndex(
        (c) =>
          String(c.color_code).trim() === String(cur.color_code).trim() &&
          String(c.material_code).trim() === String(cur.material_code).trim(),
      );
      const next = parNav.coloresLR[(i + delta + parNav.coloresLR.length) % parNav.coloresLR.length];
      if (next) selectColorFila(next);
    },
    [parNav, activa, selectColorFila],
  );

  /** Vertical: par L+R (sidebar). Horizontal: color en par. */
  const stepVertical = useCallback(
    (delta: number) => {
      if (paresNav.length > 1) stepPar(delta);
      else stepColorEnPar(delta);
    },
    [paresNav.length, stepPar, stepColorEnPar],
  );

  const stepHorizontalNav = useCallback(
    (delta: number) => {
      stepColorEnPar(delta);
    },
    [stepColorEnPar],
  );

  useCadenaKeyboard({
    enabled: !loading && !searchOpen && paresAll.length > 0 && !sinResultados,
    onLeft: () => stepHorizontalNav(-1),
    onRight: () => stepHorizontalNav(1),
    onUp: () => stepVertical(-1),
    onDown: () => stepVertical(1),
  });

  const heroTouch = useTouchNav({
    threshold: 22,
    onLeft: () => stepHorizontalNav(1),
    onRight: () => stepHorizontalNav(-1),
    onUp: () => stepVertical(-1),
    onDown: () => stepVertical(1),
    onTap: () => setDetalleOpen((v) => !v),
  });

  const parCarouselTouch = useTouchNav({
    threshold: 20,
    onUp: () => stepVertical(-1),
    onDown: () => stepVertical(1),
  });

  function runSearch() {
    setSearchError(null);
    const parsed = parseCodigoVendedor(searchInput);
    if (!parsed) {
      setSearchError("Formato inválido");
      return;
    }
    const idx = resolveCodigoEnCadena(paresAll, parsed);
    if (!idx) {
      setSearchError("No encontrado");
      return;
    }
    setFiltros(FILTROS_VACIOS);
    setEstiloPanelOpen(false);
    setReferenciaPanelOpen(false);
    const target = paresAll[idx.parIndex];
    const filtered = filtrarPares(paresAll, FILTROS_VACIOS);
    const parIdx = filtered.findIndex((p) => p.key === target?.key);
    setParIndex(parIdx >= 0 ? parIdx : 0);
    setGrupoIndex(idx.grupoIndex);
    setColorG1(idx.colorGrupo1Index);
    setColorG2(idx.colorGrupo2Index);
    setSearchOpen(false);
    setSearchInput("");
  }

  const header = (
    <header className="z-30 grid shrink-0 grid-cols-[52px_1fr_52px] gap-1 border-b border-[#c4bdb4] bg-[#f4f1ec] px-1 py-1">
      <Link
        href="/cadena"
        className="flex min-h-[52px] min-w-[52px] items-center justify-center border border-[#8a8278] text-lg text-[#1a1a1a] active:bg-[#e8e2d9]"
        aria-label="Ventas — filtros"
      >
        ←
      </Link>
      <Link
        href="/cadena"
        className="flex min-h-[52px] items-center justify-center truncate px-2 font-br text-lg tracking-wide text-[#1a1a1a] active:bg-[#e8e2d9]"
        aria-label={`Marca ${marca}`}
      >
        {marca}
      </Link>
      <TouchPad
        onClick={() => setSearchOpen(true)}
        ariaLabel="Buscar"
        className="flex min-h-[52px] min-w-[52px] items-center justify-center border border-[#8a8278] text-lg text-[#1a1a1a] active:bg-[#e8e2d9]"
      >
        ⌕
      </TouchPad>
    </header>
  );

  const asideFotos = parNav ? (
    <aside className="flex w-[100px] shrink-0 flex-col border-l border-[#c4bdb4] bg-[#f4f1ec]/80">
      {paresNav.length > 1 ? (
        <div className="min-h-0 flex-1" {...parCarouselTouch}>
          <CarruselNaipesLR
            pares={paresNav}
            parIndex={parIndex}
            onSelect={irPar}
            orientation="vertical"
            before={2}
            after={4}
            className="h-full"
            previewFila={activa}
          />
        </div>
      ) : null}
    </aside>
  ) : null;

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#f4f1ec]">
        <span className="inline-block h-10 w-10 animate-pulse rounded-full bg-[#9a9288]/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#f4f1ec] p-6">
        <TouchPad
          onClick={() => router.push("/cadena")}
          ariaLabel="Volver a Ventas"
          className="border border-[#1a1a1a] bg-[#1a1a1a] px-8 py-4 font-br text-lg tracking-wide text-[#f4f1ec]"
        >
          ← Ventas
        </TouchPad>
      </div>
    );
  }

  if (paresAll.length === 0) {
    return (
      <div className="flex h-[100dvh] flex-col bg-[#f4f1ec]">
        {header}
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="font-br text-lg text-[#6b6560]">Sin stock en esta marca</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden touch-manipulation" style={bgStyle}>
      {header}
      <TrianguloResumenStrip searchParams={sp} clienteId={clienteId} marca={marca} />

      <div className="flex min-h-0 flex-1">
        <PanelColapsable open={estiloPanelOpen} widthClass="w-[108px]">
          <div className="h-full border-r border-[#c4bdb4]">
            <MultiSelectFlotante
              titulo="Estilo"
              items={estiloItems}
              selected={filtros.estilos}
              onToggle={(id) => setFiltros((f) => toggleEstilo(f, id))}
              onClear={() => setFiltros((f) => ({ ...f, estilos: [] }))}
              variant="estilo"
            />
          </div>
        </PanelColapsable>

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            className="relative flex min-h-0 flex-1 items-stretch justify-center p-1"
            {...heroTouch}
          >
            <div className="relative h-full w-full">
              {sinResultados ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 border border-[#c4bdb4] bg-white/90 p-6">
                  <div className="flex gap-2">
                    <TouchPad
                      onClick={() => setEstiloPanelOpen((v) => !v)}
                      ariaLabel="Estilos"
                      className={`min-h-[52px] border px-4 font-br active:bg-[#e8e2d9] ${
                        estiloPanelOpen ? "tile-selected" : "border-[#8a8278]"
                      }`}
                    >
                      Estilos
                    </TouchPad>
                    <TouchPad
                      onClick={() => setReferenciaPanelOpen((v) => !v)}
                      ariaLabel="Referencias"
                      className={`min-h-[52px] border px-4 font-br active:bg-[#e8e2d9] ${
                        referenciaPanelOpen ? "tile-selected" : "border-[#8a8278]"
                      }`}
                    >
                      Referencias
                    </TouchPad>
                  </div>
                  <TouchPad
                    onClick={() => setFiltros(FILTROS_VACIOS)}
                    ariaLabel="Limpiar filtros"
                    className="border border-[#1a1a1a] px-6 py-3 font-br text-lg text-[#1a1a1a] active:bg-[#e8e2d9]"
                  >
                    Sin coincidencias · limpiar
                  </TouchPad>
                </div>
              ) : (
                <div className="relative flex h-full min-h-[280px] w-full flex-col overflow-visible border border-[#c4bdb4] bg-white shadow-sm">
                  {activa && par && (
                    <>
                      <div className="absolute inset-0 z-0 flex min-h-0 items-center justify-center overflow-visible bg-white px-1 pt-[3.25rem] pb-2">
                        <HeroProductImage
                          fila={activa}
                          alt={`${activa.linea_codigo_proveedor}.${activa.referencia_codigo_proveedor}`}
                        />
                      </div>
                      <LineaReferenciaHero
                        activa={activa}
                        parIndex={parIndex}
                        total={pares.length}
                        estiloPanelOpen={estiloPanelOpen}
                        referenciaPanelOpen={referenciaPanelOpen}
                        estilosActivos={filtros.estilos.length}
                        referenciasActivas={filtros.referenciaKeys.length}
                        onToggleEstiloPanel={() => setEstiloPanelOpen((v) => !v)}
                        onToggleReferenciaPanel={() => setReferenciaPanelOpen((v) => !v)}
                      />
                      {detalleOpen && (
                        <div className="absolute inset-x-0 bottom-0 max-h-[42%] overflow-y-auto border-t border-[#c4bdb4] bg-[#f4f1ec] px-4 py-4">
                          <p className="font-br text-lg text-[#1a1a1a]">{activa.estilo || "—"}</p>
                          <p className="mt-1 font-mono text-xs tracking-wider text-[#6b6560]">
                            {activa.linea_codigo_proveedor}.{activa.referencia_codigo_proveedor}
                          </p>
                          <p className="mt-2 text-sm text-[#1a1a1a]">
                            {activa.material_code}
                            {activa.descp_material ? ` · ${activa.descp_material}` : ""}
                          </p>
                          <p className="text-sm text-[#1a1a1a]">
                            {activa.color_code}
                            {activa.descp_color ? ` · ${activa.descp_color}` : ""}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#6b6560]">
                            {activa.grada} · {Math.round(cantidadMostrada)} pares
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {!sinResultados && (
                <>
                  <TouchPad
                    stopBubble
                    onClick={() => stepHorizontalNav(1)}
                    ariaLabel="Siguiente"
                    className="absolute left-0 top-0 z-10 h-full w-[12%] max-w-[72px] opacity-0"
                  />
                  <TouchPad
                    stopBubble
                    onClick={() => stepHorizontalNav(-1)}
                    ariaLabel="Anterior"
                    className="absolute right-0 top-0 z-10 h-full w-[12%] max-w-[72px] opacity-0"
                  />
                </>
              )}
            </div>
          </div>
        </main>

        <PanelColapsable open={referenciaPanelOpen} widthClass="w-[116px]">
          <div className="h-full border-l border-[#c4bdb4]">
            <MultiSelectFlotante
              titulo="Referencia"
              items={refItems}
              selected={filtros.referenciaKeys}
              onToggle={(id) => setFiltros((f) => toggleReferencia(f, id))}
              onClear={() => setFiltros((f) => ({ ...f, referenciaKeys: [] }))}
              variant="referencia"
            />
          </div>
        </PanelColapsable>

        {asideFotos}
      </div>

      {!sinResultados && activa && parNav && (
        <footer className="shrink-0 border-t-2 border-[#c4bdb4] bg-[#f4f1ec] shadow-[0_-2px_12px_rgba(26,26,26,0.06)]">
          <StockOtrasTiendasDock ubicaciones={stockUbicaciones} />
          {parNav.coloresLR.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-2 px-2 pt-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6b6560]">
                  Colores · {parNav.coloresLR.length}
                </p>
              </div>
              <CarruselColores
                colores={parNav.coloresLR}
                activa={activa}
                onSelect={selectColorFila}
                showMaterialBadge={parNav.gruposMaterial.length > 1}
                compact
              />
            </>
          ) : paresNav.length > 1 ? (
            <CarruselNaipesLR
              pares={paresNav}
              parIndex={parIndex}
              onSelect={irPar}
              orientation="horizontal"
              before={1}
              after={3}
              className="min-h-[100px]"
            />
          ) : null}
          <GradaVentaStrip
            activa={activa}
            par={parNav}
            clienteId={clienteId}
            marca={marca}
            ubicaciones={stockUbicaciones}
            cantidadLocal={cantidadLocal}
          />
        </footer>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1a1a1a]/40 p-2 pb-6">
          <div className="w-full max-w-lg border border-[#c4bdb4] bg-[#f4f1ec] p-4 shadow-2xl">
            <input
              type="text"
              inputMode="decimal"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="1122.828"
              className="w-full border border-[#8a8278] bg-white px-4 py-4 font-mono text-xl text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
              autoFocus
            />
            {searchError && (
              <p className="mt-2 text-center text-sm text-red-800">{searchError}</p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <TouchPad
                onClick={() => {
                  setSearchOpen(false);
                  setSearchError(null);
                }}
                ariaLabel="Cerrar"
                className="min-h-[52px] border border-[#8a8278] text-lg"
              >
                ✕
              </TouchPad>
              <TouchPad
                onClick={runSearch}
                ariaLabel="Ir"
                className="min-h-[52px] bg-[#1a1a1a] text-lg text-[#f4f1ec] active:bg-[#1b2a41]"
              >
                →
              </TouchPad>
            </div>
          </div>
        </div>
      )}

      <PosCartSheet />
    </div>
  );
}

export default function CadenaVistaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#f4f1ec]">
          <span className="h-10 w-10 animate-pulse rounded-full bg-[#9a9288]/40" />
        </div>
      }
    >
      <CadenaVistaInner />
    </Suspense>
  );
}
