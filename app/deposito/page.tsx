"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductLightbox } from "@/components/cadena/ProductLightbox";
import {
  DepositoFiltrosHeader,
  type DepositoFiltrosData,
} from "@/components/deposito/DepositoFiltrosHeader";
import { StockRedGradaTables } from "@/components/deposito/StockRedGradaTables";
import { StockRedResumenPills } from "@/components/deposito/StockRedResumenPills";
import { ProductImage } from "@/components/ProductImage";
import {
  EMPTY_DEPOSITO_FILTERS,
  depositoFiltersToSearchParams,
  type DepositoFilterState,
  type DepositoLimit,
} from "@/lib/deposito-filters";
import { moleculeKey } from "@/lib/deposito-cohorte";
import type { StockUbicacionBloque } from "@/lib/stock-otros-locales";

type DepositoEstado = {
  cliente_id: number;
  ente: string;
  tipo: string;
  codigo: string;
  registros: number;
  pares: number;
};

type Producto = {
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
  material_id: number | null;
  color_id: number | null;
  material_code: string;
  color_code: string;
  marca: string;
  estilo: string;
  descp_material: string | null;
  descp_color: string | null;
  cantidad_local: number;
  cantidad_red: number;
  imagen_nombre: string | null;
  imagen_url_thumb?: string | null;
  imagen_url_hero?: string | null;
  imagen_url_flat?: string | null;
  stock_red?: StockUbicacionBloque[];
};

const DEFAULT_CLIENTE_ID = 2100;

function moleculeCardKey(p: Producto): string {
  return moleculeKey({
    linea_id: null,
    referencia_id: null,
    material_id: p.material_id,
    color_id: p.color_id,
    linea_codigo_proveedor: p.linea_codigo_proveedor,
    referencia_codigo_proveedor: p.referencia_codigo_proveedor,
    material_code: p.material_code,
    color_code: p.color_code,
  });
}

function qs(f: DepositoFilterState, limit: DepositoLimit): string {
  const p = depositoFiltersToSearchParams(f, limit);
  p.set("stock_red", "1");
  return p.toString();
}

export default function DepositoPage() {
  const [depositos, setDepositos] = useState<DepositoEstado[]>([]);
  const [clienteId, setClienteId] = useState(DEFAULT_CLIENTE_ID);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtrosData, setFiltrosData] = useState<DepositoFiltrosData | null>(null);
  const [filtros, setFiltros] = useState<DepositoFilterState>(EMPTY_DEPOSITO_FILTERS);
  const [limit, setLimit] = useState<DepositoLimit>(80);
  const [meta, setMeta] = useState<{ ente: string; tipo: string; codigo: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [filtrosExpanded, setFiltrosExpanded] = useState(true);

  const zoomSrc = (p: Producto) => p.imagen_url_hero ?? p.imagen_url_flat ?? p.imagen_url_thumb ?? null;

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/deposito/status", { cache: "no-store" });
    const data = await res.json();
    if (!data.configured) throw new Error("Base de datos no configurada");
    setDepositos(data.depositos ?? []);
    const conStock = (data.depositos as DepositoEstado[]).filter((d) => d.registros > 0);
    if (conStock.length === 1) setClienteId(conStock[0].cliente_id);
  }, []);

  const loadAll = useCallback(
    async (id: number, f: DepositoFilterState, lim: DepositoLimit) => {
      setLoading(true);
      setError(null);
      const query = qs(f, lim);
      try {
        const [resProd, resFil] = await Promise.all([
          fetch(`/api/deposito/${id}?${query}`, { cache: "no-store" }),
          fetch(`/api/deposito/${id}/filtros-header?${depositoFiltersToSearchParams(f).toString()}`, {
            cache: "no-store",
          }),
        ]);
        const dataProd = await resProd.json();
        const dataFil = await resFil.json();
        if (dataProd.error) throw new Error(dataProd.error);
        if (dataFil.error) throw new Error(dataFil.error);
        setProductos(dataProd.productos ?? []);
        setFiltrosData({
          generos: dataFil.generos ?? [],
          marcas: dataFil.marcas ?? [],
          estilos: dataFil.estilos ?? [],
          tipo1: dataFil.tipo1 ?? [],
          lineas: dataFil.lineas ?? [],
          colores: dataFil.colores ?? [],
          hexPalette: dataFil.hexPalette ?? [],
          resumen: dataFil.resumen,
        });
        setMeta({ ente: dataProd.ente, tipo: dataProd.tipo, codigo: dataProd.codigo });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar depósito");
        setProductos([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadStatus().catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [loadStatus]);

  useEffect(() => {
    if (depositos.length === 0) return;
    const t = setTimeout(() => {
      void loadAll(clienteId, filtros, limit);
    }, filtros.q ? 350 : 0);
    return () => clearTimeout(t);
  }, [clienteId, depositos.length, filtros, limit, loadAll]);

  useEffect(() => {
    setFiltros(EMPTY_DEPOSITO_FILTERS);
    setLimit(80);
  }, [clienteId]);

  const depositoActivo = useMemo(
    () => depositos.find((d) => d.cliente_id === clienteId),
    [depositos, clienteId],
  );

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#f1f5f9] text-slate-900">
      <header className="z-20 shrink-0 border-b border-orange-200 bg-white shadow-sm">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 ${
            filtrosExpanded ? "flex-wrap py-3" : "py-2"
          }`}
        >
          <div className="min-w-0">
            <Link
              href="/"
              className="text-[10px] font-semibold uppercase tracking-wide text-orange-600 hover:text-orange-800"
            >
              ← Panel
            </Link>
            <h1 className={`font-bold text-orange-700 ${filtrosExpanded ? "text-xl" : "truncate text-base"}`}>
              Depósito {meta ? `${meta.ente} ${meta.tipo}` : "…"}
            </h1>
            {filtrosExpanded && meta && depositoActivo ? (
              <p className="text-sm text-slate-600">
                {meta.codigo} · {depositoActivo.registros.toLocaleString()} SKUs ·{" "}
                {Math.round(depositoActivo.pares).toLocaleString()} pares
              </p>
            ) : null}
          </div>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            className={`shrink-0 rounded-xl border-2 border-orange-300 bg-white px-3 text-sm font-semibold ${
              filtrosExpanded ? "min-h-[44px]" : "min-h-[40px] max-w-[11rem] truncate text-xs"
            }`}
          >
            {depositos.map((d) => (
              <option key={d.cliente_id} value={d.cliente_id}>
                {d.codigo} {d.ente} {d.tipo}
              </option>
            ))}
          </select>
        </div>

        <DepositoFiltrosHeader
          filtros={filtros}
          onChange={setFiltros}
          data={filtrosData}
          limit={limit}
          onLimitChange={setLimit}
          totalMostrados={productos.length}
          expanded={filtrosExpanded}
          onToggleExpanded={() => setFiltrosExpanded((v) => !v)}
        />
      </header>

      <main className="mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-y-auto p-3 sm:p-4">
        {error ? (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</div>
        ) : null}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Cargando stock del depósito…</div>
        ) : productos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-lg text-slate-600">Sin productos en este depósito o sin coincidencias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {productos.map((p) => {
              const alt = `${p.linea_codigo_proveedor}-${p.referencia_codigo_proveedor}`;
              const lg = zoomSrc(p);
              const badgeTotal = p.cantidad_red > 0 ? p.cantidad_red : p.cantidad_local;
              return (
                <article
                  key={moleculeCardKey(p)}
                  className="flex flex-col overflow-hidden rounded-2xl border-2 border-orange-100 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    className="relative aspect-square w-full cursor-zoom-in bg-slate-100"
                    disabled={!lg}
                    onClick={() => lg && setLightbox({ src: lg, alt })}
                    aria-label={lg ? `Ampliar ${alt}` : alt}
                  >
                    <ProductImage
                      src={p.imagen_url_thumb}
                      fallbackSrc={p.imagen_url_flat}
                      linea={p.linea_codigo_proveedor}
                      ref={p.referencia_codigo_proveedor}
                      material={p.material_code}
                      color={p.color_code}
                      imagenNombre={p.imagen_nombre}
                      alt={alt}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-white/95 px-2.5 py-1 text-sm font-extrabold tabular-nums text-orange-700 shadow-md">
                      {Math.round(badgeTotal)} pares
                    </span>
                  </button>
                  <div className="flex flex-1 flex-col gap-1.5 p-3">
                    {p.stock_red ? <StockRedResumenPills ubicaciones={p.stock_red} /> : null}
                    <p className="text-xs font-bold uppercase text-orange-700">{p.marca}</p>
                    <p className="font-mono text-sm font-semibold">
                      L{p.linea_codigo_proveedor} · R{p.referencia_codigo_proveedor}
                    </p>
                    <p className="line-clamp-2 text-xs text-slate-600">
                      {[p.descp_material, p.descp_color].filter(Boolean).join(" · ") ||
                        `${p.material_code} / ${p.color_code}`}
                    </p>
                    <p className="text-xs text-slate-500">{p.estilo}</p>
                    {p.stock_red ? <StockRedGradaTables ubicaciones={p.stock_red} /> : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {!loading && productos.length > 0 && filtrosExpanded ? (
          <p className="mt-4 text-center text-sm text-slate-500">
            TOP {limit}/marca · 1 molécula por card · red 3 tiendas {meta?.tipo ?? ""}
          </p>
        ) : null}
      </main>

      {lightbox ? (
        <ProductLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      ) : null}
    </div>
  );
}
