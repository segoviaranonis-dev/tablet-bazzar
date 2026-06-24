"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CarruselColores } from "@/components/cadena/CarruselColores";
import { CarruselNaipesLR } from "@/components/cadena/CarruselNaipesLR";
import { LineaReferenciaHero } from "@/components/cadena/LineaReferenciaHero";
import { MultiSelectFlotante } from "@/components/cadena/MultiSelectFlotante";
import { useStockOtrosLocales } from "@/components/cadena/StockOtrosLocales";
import { TouchPad } from "@/components/cadena/TouchPad";
import { HeroProductImage } from "@/components/cadena/HeroProductImage";
import { CadenaVistaHeader } from "@/components/cadena/CadenaVistaHeader";
import { CadenaDockToggles } from "@/components/cadena/CadenaDockToggles";
import { FrancoTiradorButton, type FrancoTiradorScope } from "@/components/cadena/FrancoTiradorButton";
import type { DepositoFila, ParLineaRef } from "@/lib/cadena";
import { buildCadenaFromFilas, resolverNavCohorte } from "@/lib/cadena";
import { pickNavFranco, type FrancoAplicarMeta } from "@/lib/franco-tirador";
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
import { PosCartIconButton } from "@/components/pos/PosCartIconButton";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { usePosCart } from "@/lib/cart/PosCartContext";
import { consumeOpenCartFlag } from "@/lib/pos-reopen";

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
      className={`shrink-0 overflow-hidden border-[#e2e8f0] bg-[#f1f5f9] transition-[width,opacity] duration-200 ease-out ${
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
  const { setSession, setOpen } = usePosCart();
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
  /** Agrupaciones secundarias — ocultas por defecto (vista 100% producto). */
  const [sidebarParOpen, setSidebarParOpen] = useState(false);
  const [coloresDockOpen, setColoresDockOpen] = useState(false);

  const [cohorteEstilo, setCohorteEstilo] = useState("");
  const [parKeyActivo, setParKeyActivo] = useState<string | null>(null);
  /** Franco Tirador reemplazó paresAll — sidebar muestra todos los hits, sin cohorte por estilo. */
  const [francoNav, setFrancoNav] = useState(false);

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
  const paresBase = useMemo(() => (pares.length > 0 ? pares : paresAll), [pares, paresAll]);

  const {
    paresNav,
    parIndex,
  } = useMemo(() => {
    if (francoNav) {
      const idx = parKeyActivo ? paresBase.findIndex((p) => p.key === parKeyActivo) : 0;
      return {
        paresNav: paresBase,
        parIndex: idx >= 0 ? idx : 0,
        estiloCohorte: cohorteEstilo,
      };
    }
    return resolverNavCohorte(paresBase, cohorteEstilo, parKeyActivo);
  }, [francoNav, paresBase, cohorteEstilo, parKeyActivo]);

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
  const par: ParLineaRef | null =
    parNav && pares.some((p) => p.key === parNav.key) ? parNav : parNav;
  const activaBase = par
    ? filaActiva(par, grupoIndex, colorG1) ?? par.coloresLR[colorG2] ?? null
    : null;

  const { ubicaciones: stockUbicaciones, cantidadLocal, bootLoading: stockBootLoading, error: stockError, retry: stockRetry } =
    useStockOtrosLocales(clienteId, par, activaBase);

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
      if (paresBase.length === 0) return;
      const nav = resolveCadenaBootState({
        paresNav: paresBase,
        posUrl,
        serverPosicion: serverPos ?? serverPosicionRef.current,
        qBuscar,
        filtros,
      });
      const bootPar = paresBase[nav.parIndex] ?? paresBase[0];
      if (bootPar) {
        setCohorteEstilo((bootPar.estilo ?? "").trim());
        setParKeyActivo(bootPar.key);
      }
      setGrupoIndex(nav.grupoIndex);
      setColorG1(nav.colorG1);
      setColorG2(nav.colorG2);
      setPosApplied(true);
      bootFiltrosKeyRef.current = filtrosKey;
    },
    [paresBase, posUrl, qBuscar, filtros, filtrosKey],
  );

  useEffect(() => {
    if (marca && Number.isFinite(clienteId)) {
      setSession({ cliente_id: clienteId, marca });
    }
  }, [marca, clienteId, setSession]);

  useEffect(() => {
    if (consumeOpenCartFlag()) {
      setOpen(true);
    }
  }, [setOpen]);

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
      setFrancoNav(false);
      setCohorteEstilo("");
      setParKeyActivo(null);
      setLoading(false);
      setError(null);
      setPosApplied(false);
      return;
    }

    setLoading(true);
    setPosApplied(false);
    setFrancoNav(false);
    setCohorteEstilo("");
    setParKeyActivo(null);
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
    if (posApplied || paresBase.length === 0 || loading) return;
    applyBootPosition(serverPosicionRef.current);
  }, [posApplied, paresBase.length, loading, applyBootPosition]);

  useEffect(() => {
    if (!posApplied || bootFiltrosKeyRef.current === filtrosKey) return;
    setDetalleOpen(false);
    if (
      francoNav &&
      (filtros.estilos.length > 0 || filtros.referenciaKeys.length > 0 || filtros.colorCode)
    ) {
      setFrancoNav(false);
    }
    const next = resolveFiltrosChangeState(paresBase, filtros, posUrl.pi);
    if (next) {
      const bootPar = paresBase[next.parIndex] ?? paresBase[0];
      if (bootPar) {
        setCohorteEstilo((bootPar.estilo ?? "").trim());
        setParKeyActivo(bootPar.key);
      }
      setGrupoIndex(next.grupoIndex);
      setColorG1(next.colorG1);
      setColorG2(next.colorG2);
    }
    bootFiltrosKeyRef.current = filtrosKey;
  }, [filtrosKey, paresBase, posApplied, filtros, posUrl.pi, francoNav]);

  useEffect(() => {
    if (!posApplied || !parNav || !filtros.colorCode) return;
    const next = resolveColorFilterState(parNav, filtros.colorCode);
    if (next) {
      setGrupoIndex(next.grupoIndex);
      setColorG1(next.colorG1);
    }
  }, [parNav, filtros.colorCode, posApplied]);

  useEffect(() => {
    if (paresNav.length === 0) return;
    prefetchCadenaNeighborhood(parNav, parIndex, paresNav, grupoIndex, colorG1, activa);
  }, [parIndex, paresNav, parNav, grupoIndex, colorG1, activa]);

  const irPar = useCallback(
    (next: number) => {
      if (paresNav.length === 0) return;
      const i = ((next % paresNav.length) + paresNav.length) % paresNav.length;
      const p = paresNav[i];
      if (p) {
        setParKeyActivo(p.key);
        const e = (p.estilo ?? "").trim();
        if (e && e !== cohorteEstilo) setCohorteEstilo(e);
      }
      if (!filtros.colorCode) {
        setGrupoIndex(0);
        setColorG1(0);
        setColorG2(0);
      }
      setDetalleOpen(false);
    },
    [paresNav, filtros.colorCode, cohorteEstilo],
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
    setCohorteEstilo((target?.estilo ?? "").trim());
    setParKeyActivo(target?.key ?? null);
    setGrupoIndex(idx.grupoIndex);
    setColorG1(idx.colorGrupo1Index);
    setColorG2(idx.colorGrupo2Index);
    setSearchOpen(false);
    setSearchInput("");
  }

  const depConfig = getDepositoByClienteId(clienteId);
  const francoScope: FrancoTiradorScope | null =
    activa?.tipo_v2 && activa.tipo_v2 !== "(sin tipo)"
      ? {
          tipo: activa.tipo_v2,
          marcaIdDefault: activa.marca_id ?? null,
          marcaLabelDefault: (activa.marca ?? "").trim(),
          estiloDefault: (activa.estilo ?? parNav?.estilo ?? "").trim(),
          colorDefault: String(activa.descp_color ?? "").trim(),
          depositoLabel: depConfig ? `${depConfig.ente} · ${depConfig.tipo}` : `Tienda ${clienteId}`,
        }
      : null;

  const onFrancoAplicar = useCallback((hits: DepositoFila[], meta: FrancoAplicarMeta) => {
    const pares = buildCadenaFromFilas(hits);
    if (pares.length === 0) return;
    setFiltros(FILTROS_VACIOS);
    setEstiloPanelOpen(false);
    setReferenciaPanelOpen(false);
    setSidebarParOpen(false);
    setColoresDockOpen(false);
    setParesAll(pares);
    setFrancoNav(true);
    const nav = pickNavFranco(pares, meta.grada);
    setCohorteEstilo(nav.estilo);
    setParKeyActivo(nav.parKey);
    setGrupoIndex(nav.grupoIndex);
    setColorG1(nav.colorG1);
    setColorG2(nav.colorG2);
    setPosApplied(true);
    bootFiltrosKeyRef.current = "||";
  }, []);

  const headerToolbar = (
    <>
      <CadenaDockToggles
        sidebarParOpen={sidebarParOpen}
        coloresDockOpen={coloresDockOpen}
        showSidebar={!!parNav && paresNav.length > 1}
        showColores={!!parNav && parNav.coloresLR.length > 0}
        onToggleSidebar={() => setSidebarParOpen((v) => !v)}
        onToggleColores={() => setColoresDockOpen((v) => !v)}
      />
      <FrancoTiradorButton
        clienteId={clienteId}
        scope={francoScope}
        disabled={!activa}
        onAplicar={onFrancoAplicar}
      />
      <PosCartIconButton />
    </>
  );

  const header = (
    <CadenaVistaHeader marca={marca} onSearch={() => setSearchOpen(true)} toolbar={headerToolbar} />
  );

  const asideFotos = parNav && paresNav.length > 1 ? (
    <PanelColapsable open={sidebarParOpen} widthClass="w-[100px]">
      <aside className="flex h-full w-[100px] flex-col border-l border-[#e2e8f0] bg-[#f1f5f9]/80">
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
      </aside>
    </PanelColapsable>
  ) : null;

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#f1f5f9]">
        <span className="inline-block h-10 w-10 animate-pulse rounded-full bg-[#94a3b8]/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#f1f5f9] p-6">
        <TouchPad
          onClick={() => router.push("/cadena")}
          ariaLabel="Volver a Ventas"
          className="border border-[#002B4E] bg-[#002B4E] px-8 py-4 font-semibold text-lg tracking-wide text-[#f1f5f9]"
        >
          ← Ventas
        </TouchPad>
      </div>
    );
  }

  if (paresAll.length === 0) {
    return (
      <div className="flex h-[100dvh] flex-col bg-[#f1f5f9]">
        {header}
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="font-semibold text-lg text-[#64748b]">Sin stock en esta marca</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden touch-manipulation" style={bgStyle}>
      {header}

      <div className="flex min-h-0 flex-1">
        <PanelColapsable open={estiloPanelOpen} widthClass="w-[108px]">
          <div className="h-full border-r border-[#e2e8f0]">
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

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden" {...heroTouch}>
            <div className="relative h-full w-full">
              {sinResultados ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 border border-[#e2e8f0] bg-white/90 p-6">
                  <div className="flex gap-2">
                    <TouchPad
                      onClick={() => setEstiloPanelOpen((v) => !v)}
                      ariaLabel="Estilos"
                      className={`min-h-[52px] border px-4 font-semibold active:bg-[#f1f5f9] ${
                        estiloPanelOpen ? "tile-selected" : "border-[#cbd5e1]"
                      }`}
                    >
                      Estilos
                    </TouchPad>
                    <TouchPad
                      onClick={() => setReferenciaPanelOpen((v) => !v)}
                      ariaLabel="Referencias"
                      className={`min-h-[52px] border px-4 font-semibold active:bg-[#f1f5f9] ${
                        referenciaPanelOpen ? "tile-selected" : "border-[#cbd5e1]"
                      }`}
                    >
                      Referencias
                    </TouchPad>
                  </div>
                  <TouchPad
                    onClick={() => setFiltros(FILTROS_VACIOS)}
                    ariaLabel="Limpiar filtros"
                    className="border border-[#002B4E] px-6 py-3 font-semibold text-lg text-slate-900 active:bg-[#f1f5f9]"
                  >
                    Sin coincidencias · limpiar
                  </TouchPad>
                </div>
              ) : (
                <div className="bazzar-card relative h-full min-h-0 w-full overflow-hidden shadow-lg ring-1 ring-[#e2e8f0]/60">
                  {activa && par && (
                    <>
                      <div className="cadena-hero-host absolute inset-0 z-0">
                        <HeroProductImage
                          fila={activa}
                          alt={`${activa.linea_codigo_proveedor}.${activa.referencia_codigo_proveedor}`}
                        />
                      </div>
                      <LineaReferenciaHero
                        activa={activa}
                        parIndex={parIndex}
                        total={paresNav.length}
                        estiloPanelOpen={estiloPanelOpen}
                        referenciaPanelOpen={referenciaPanelOpen}
                        estilosActivos={filtros.estilos.length}
                        referenciasActivas={filtros.referenciaKeys.length}
                        onToggleEstiloPanel={() => setEstiloPanelOpen((v) => !v)}
                        onToggleReferenciaPanel={() => setReferenciaPanelOpen((v) => !v)}
                      />
                      {detalleOpen && (
                        <div className="absolute inset-x-0 bottom-0 max-h-[42%] overflow-y-auto border-t border-[#e2e8f0] bg-[#f1f5f9] px-4 py-4">
                          <p className="font-semibold text-lg text-slate-900">{activa.estilo || "—"}</p>
                          <p className="mt-1 font-mono text-xs tracking-wider text-[#64748b]">
                            {activa.linea_codigo_proveedor}.{activa.referencia_codigo_proveedor}
                          </p>
                          <p className="mt-2 text-sm text-slate-900">
                            {activa.material_code}
                            {activa.descp_material ? ` · ${activa.descp_material}` : ""}
                          </p>
                          <p className="text-sm text-slate-900">
                            {activa.color_code}
                            {activa.descp_color ? ` · ${activa.descp_color}` : ""}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#64748b]">
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
          <div className="h-full border-l border-[#e2e8f0]">
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
        <footer className="shrink-0 border-t-2 border-orange-200 bg-gradient-to-b from-white to-orange-50/50 shadow-[0_-8px_24px_rgba(234,88,12,0.08)]">
          {coloresDockOpen && parNav.coloresLR.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-2 px-2 pt-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#64748b]">
                  Colores · {parNav.coloresLR.length}
                </p>
                <button
                  type="button"
                  onClick={() => setColoresDockOpen(false)}
                  className="min-h-[32px] px-2 text-[10px] font-bold text-slate-400"
                >
                  Ocultar
                </button>
              </div>
              <CarruselColores
                colores={parNav.coloresLR}
                activa={activa}
                onSelect={selectColorFila}
                showMaterialBadge={parNav.gruposMaterial.length > 1}
                compact
              />
            </>
          ) : null}
          <GradaVentaStrip
            activa={activa}
            par={par}
            clienteId={clienteId}
            marca={marca}
            ubicaciones={stockUbicaciones}
            cantidadLocal={cantidadLocal}
            bootLoading={stockBootLoading}
            stockError={stockError}
            onStockRetry={stockRetry}
          />
        </footer>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-rimec-azul/40 p-2 pb-6 backdrop-blur-sm">
          <div className="bazzar-card bazzar-card-accent w-full max-w-lg p-4 shadow-2xl">
            <input
              type="text"
              inputMode="decimal"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="1122.828"
              className="bazzar-input font-mono text-xl"
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
                className="min-h-[52px] border border-[#cbd5e1] text-lg"
              >
                ✕
              </TouchPad>
              <TouchPad
                onClick={runSearch}
                ariaLabel="Ir"
                className="min-h-[52px] rounded-xl bg-bazzar-naranja text-lg text-white active:bg-bazzar-naranja-dark"
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
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#f1f5f9]">
          <span className="h-10 w-10 animate-pulse rounded-full bg-[#94a3b8]/40" />
        </div>
      }
    >
      <CadenaVistaInner />
    </Suspense>
  );
}
