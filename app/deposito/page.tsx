"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductImage } from "@/components/ProductImage";

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
  material_code: string;
  color_code: string;
  marca: string;
  genero: string;
  estilo: string;
  tipo_v2: string;
  descp_material: string | null;
  descp_color: string | null;
  grada: string;
  cantidad: number;
  imagen_nombre: string | null;
};

const DEFAULT_CLIENTE_ID = 2100;

export default function DepositoPage() {
  const [depositos, setDepositos] = useState<DepositoEstado[]>([]);
  const [clienteId, setClienteId] = useState(DEFAULT_CLIENTE_ID);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [meta, setMeta] = useState<{ ente: string; tipo: string; codigo: string; total_pares: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

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
      const res = await fetch(`/api/deposito/${id}?limit=80`, { cache: "no-store" });
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
  }, [clienteId, depositos.length, loadProductos]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) =>
      [p.marca, p.linea_codigo_proveedor, p.referencia_codigo_proveedor, p.estilo, p.descp_material, p.descp_color]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [productos, busqueda]);

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
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtrados.map((p, i) => (
                <article
                  key={`${p.linea_codigo_proveedor}-${p.referencia_codigo_proveedor}-${p.material_code}-${p.color_code}-${i}`}
                  className="flex flex-col overflow-hidden rounded-2xl border-2 border-orange-100 bg-white shadow-sm"
                >
                  <div className="relative aspect-square bg-slate-100">
                    <ProductImage
                      linea={p.linea_codigo_proveedor}
                      ref={p.referencia_codigo_proveedor}
                      material={p.material_code}
                      color={p.color_code}
                      imagenNombre={p.imagen_nombre}
                      alt={`${p.linea_codigo_proveedor}-${p.referencia_codigo_proveedor}`}
                    />
                    <span className="absolute right-2 top-2 rounded-full bg-orange-600 px-2 py-1 text-xs font-bold text-white">
                      {Math.round(p.cantidad)} p
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <p className="text-xs font-bold uppercase text-orange-700">{p.marca}</p>
                    <p className="font-mono text-sm font-semibold">
                      {p.linea_codigo_proveedor}.{p.referencia_codigo_proveedor}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {[p.descp_material, p.descp_color].filter(Boolean).join(" · ") || `${p.material_code} / ${p.color_code}`}
                    </p>
                    <p className="mt-auto text-xs text-slate-500">
                      {p.estilo} · Grada {p.grada}
                    </p>
                  </div>
                </article>
            ))}
          </div>
        )}
        {!loading && filtrados.length > 0 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            TOP 80 por marca · sync de depósito se administra desde Report → Depósitos Bazzar
          </p>
        )}
      </main>
    </div>
  );
}
