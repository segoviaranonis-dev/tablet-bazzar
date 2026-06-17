"use client";



import Link from "next/link";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ProductLightbox } from "@/components/cadena/ProductLightbox";

import { StockRedGradaTables } from "@/components/deposito/StockRedGradaTables";

import { StockRedResumenPills } from "@/components/deposito/StockRedResumenPills";

import { ProductImage } from "@/components/ProductImage";

import type { StockUbicacionBloque } from "@/lib/stock-otros-locales";
import { moleculeKey, type MoleculeFk } from "@/lib/deposito-cohorte";



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

  genero: string;

  estilo: string;

  tipo_v2: string;

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



/** Depósito con fotos — 1 card = 1 molécula FK · stock red 3 tiendas por grada. */

export default function DepositoPage() {

  const [depositos, setDepositos] = useState<DepositoEstado[]>([]);

  const [clienteId, setClienteId] = useState(DEFAULT_CLIENTE_ID);

  const [productos, setProductos] = useState<Producto[]>([]);

  const [meta, setMeta] = useState<{ ente: string; tipo: string; codigo: string; total_pares: number } | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");

  const [marcaActiva, setMarcaActiva] = useState<string | null>(null);

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);



  function zoomSrc(p: Producto): string | null {

    return p.imagen_url_hero ?? p.imagen_url_flat ?? p.imagen_url_thumb ?? null;

  }



  const loadStatus = useCallback(async () => {

    const res = await fetch("/api/deposito/status", { cache: "no-store" });

    const data = await res.json();

    if (!data.configured) throw new Error("Base de datos no configurada");

    setDepositos(data.depositos ?? []);

    const conStock = (data.depositos as DepositoEstado[]).filter((d) => d.registros > 0);

    if (conStock.length === 1) setClienteId(conStock[0].cliente_id);

  }, []);



  const loadProductos = useCallback(async (id: number) => {

    setLoading(true);

    setError(null);

    try {

      const res = await fetch(`/api/deposito/${id}?limit=80&stock_red=1`, { cache: "no-store" });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setProductos(data.productos ?? []);

      const dep = depositos.find((d) => d.cliente_id === id);

      setMeta({

        ente: data.ente,

        tipo: data.tipo,

        codigo: data.codigo,

        total_pares: dep?.pares ?? data.total_pares_muestra ?? 0,

      });

    } catch (e) {

      setError(e instanceof Error ? e.message : "Error al cargar depósito");

      setProductos([]);

    } finally {

      setLoading(false);

    }

  }, [depositos]);



  useEffect(() => {

    loadStatus().catch((e) => setError(e instanceof Error ? e.message : "Error"));

  }, [loadStatus]);



  useEffect(() => {

    if (depositos.length === 0) return;

    loadProductos(clienteId);

    setMarcaActiva(null);

  }, [clienteId, depositos.length, loadProductos]);



  const marcas = useMemo(() => {

    const counts = new Map<string, number>();

    for (const p of productos) {

      const m = p.marca?.trim();

      if (!m) continue;

      counts.set(m, (counts.get(m) ?? 0) + 1);

    }

    return [...counts.entries()]

      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

      .map(([marca, count]) => ({ marca, count }));

  }, [productos]);



  const filtrados = useMemo(() => {

    let list = productos;

    if (marcaActiva) list = list.filter((p) => p.marca === marcaActiva);

    const q = busqueda.trim().toLowerCase();

    if (!q) return list;

    return list.filter((p) =>

      [p.marca, p.linea_codigo_proveedor, p.referencia_codigo_proveedor, p.estilo, p.descp_material, p.descp_color]

        .filter(Boolean)

        .some((v) => String(v).toLowerCase().includes(q)),

    );

  }, [productos, busqueda, marcaActiva]);



  const depositoActivo = depositos.find((d) => d.cliente_id === clienteId);



  return (

    <div className="min-h-screen bg-[#f1f5f9] text-slate-900">

      <header className="sticky top-0 z-10 border-b border-orange-200 bg-white px-4 py-3 shadow-sm">

        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">

          <div>

            <Link href="/" className="text-xs font-semibold uppercase tracking-wide text-orange-600 hover:text-orange-800">

              ← Panel de control

            </Link>

            <h1 className="text-xl font-bold text-orange-700">

              Depósito {meta ? `${meta.ente} ${meta.tipo}` : "…"}

            </h1>

            {meta && (

              <p className="text-sm text-slate-600">

                {meta.codigo} · cliente {clienteId} ·{" "}

                {depositoActivo ? `${depositoActivo.registros.toLocaleString()} SKUs · ${Math.round(depositoActivo.pares).toLocaleString()} pares` : ""}

              </p>

            )}

          </div>

          <select

            value={clienteId}

            onChange={(e) => setClienteId(Number(e.target.value))}

            className="min-h-[44px] rounded-xl border-2 border-orange-300 bg-white px-4 text-sm font-semibold"

          >

            {depositos.map((d) => (

              <option key={d.cliente_id} value={d.cliente_id}>

                {d.codigo} {d.ente} {d.tipo} ({d.registros} SKUs)

              </option>

            ))}

          </select>

        </div>

        <div className="mx-auto mt-3 max-w-7xl">

          <input

            type="search"

            placeholder="Buscar marca, línea, ref, estilo…"

            value={busqueda}

            onChange={(e) => setBusqueda(e.target.value)}

            className="w-full min-h-[48px] rounded-xl border-2 border-slate-200 bg-white px-4 text-base focus:border-orange-500 focus:outline-none"

          />

        </div>

        {marcas.length > 0 && (

          <div className="mx-auto mt-3 max-w-7xl overflow-x-auto pb-1">

            <div className="flex min-w-max gap-2">

              <button

                type="button"

                onClick={() => setMarcaActiva(null)}

                className={`min-h-[44px] shrink-0 rounded-full border-2 px-4 text-sm font-semibold transition-colors ${

                  marcaActiva === null

                    ? "border-orange-600 bg-orange-600 text-white"

                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-300"

                }`}

              >

                Todas ({productos.length})

              </button>

              {marcas.map(({ marca, count }) => (

                <button

                  key={marca}

                  type="button"

                  onClick={() => setMarcaActiva(marcaActiva === marca ? null : marca)}

                  className={`min-h-[44px] shrink-0 rounded-full border-2 px-4 text-sm font-semibold transition-colors ${

                    marcaActiva === marca

                      ? "border-orange-600 bg-orange-600 text-white"

                      : "border-slate-200 bg-white text-slate-700 hover:border-orange-300"

                  }`}

                >

                  {marca} ({count})

                </button>

              ))}

            </div>

          </div>

        )}

      </header>



      <main className="mx-auto max-w-7xl p-4">

        {error && (

          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</div>

        )}

        {loading ? (

          <div className="py-20 text-center text-slate-500">Cargando stock del depósito…</div>

        ) : filtrados.length === 0 ? (

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">

            <p className="text-lg text-slate-600">Sin productos en este depósito o sin coincidencias.</p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {filtrados.map((p) => {

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

                    {p.imagen_nombre ? (

                      <p className="truncate font-mono text-[10px] text-slate-500" title={p.imagen_nombre}>

                        {p.imagen_nombre}

                      </p>

                    ) : null}

                    {p.stock_red ? <StockRedResumenPills ubicaciones={p.stock_red} /> : null}

                    <p className="text-xs font-bold uppercase text-orange-700">{p.marca}</p>

                    <p className="font-mono text-sm font-semibold">

                      L{p.linea_codigo_proveedor} · R{p.referencia_codigo_proveedor}

                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2">

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

        {!loading && filtrados.length > 0 && (

          <p className="mt-6 text-center text-sm text-slate-500">

            TOP 80 moléculas/marca · 1 foto por L+R+mat+color · red 3 tiendas {meta?.tipo ?? ""}

          </p>

        )}

      </main>

      {lightbox ? (

        <ProductLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />

      ) : null}

    </div>

  );

}


