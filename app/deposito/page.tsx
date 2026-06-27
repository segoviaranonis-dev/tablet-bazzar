"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GrillaCajasDeposito } from "@/components/deposito/GrillaCajasDeposito";
import { TabAlertasDeposito } from "@/components/deposito/TabAlertasDeposito";
import type { DepositoProducto } from "@/app/api/deposito/[cliente_id]/route";
import { agruparProductosPorCaja } from "@/lib/depositos/agrupar-cajas";
import { listarAlertasVidriera } from "@/lib/depositos/vidriera-estrellas";

type DepositoEstado = {
  cliente_id: number;
  ente: string;
  tipo: string;
  codigo: string;
  registros: number;
  pares: number;
};

type ResumenMatriz = {
  tablas_total: number;
  tiendas: number;
  categorias: { categoria: string; label: string; tablet: boolean; tablas: number }[];
};

type TabDeposito = "stock" | "alertas";

const DEFAULT_CLIENTE_ID = 2100;

export default function DepositoPage() {
  const [depositos, setDepositos] = useState<DepositoEstado[]>([]);
  const [resumenMatriz, setResumenMatriz] = useState<ResumenMatriz | null>(null);
  const [clienteId, setClienteId] = useState(DEFAULT_CLIENTE_ID);
  const [productos, setProductos] = useState<DepositoProducto[]>([]);
  const [meta, setMeta] = useState<{ ente: string; tipo: string; codigo: string; total_pares: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [tab, setTab] = useState<TabDeposito>("stock");

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/deposito/status", { cache: "no-store" });
    const data = await res.json();
    if (!data.configured) throw new Error("Base de datos no configurada");
    setDepositos(data.depositos ?? []);
    setResumenMatriz(data.resumen ?? null);
    const conStock = (data.depositos as DepositoEstado[]).filter((d) => d.registros > 0);
    if (conStock.length === 1) setClienteId(conStock[0].cliente_id);
  }, []);

  const loadProductos = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/deposito/${id}?limit=all`, { cache: "no-store" });
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
    },
    [depositos],
  );

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

  const cajas = useMemo(() => agruparProductosPorCaja(filtrados), [filtrados]);

  const alertas = useMemo(
    () => listarAlertasVidriera(cajas, clienteId),
    [cajas, clienteId],
  );

  const alertasUrgentes = alertas.filter((a) => a.tipo === "VIDRIERA_CAMBIO").length;

  const depositoActivo = depositos.find((d) => d.cliente_id === clienteId);
  const tiendaLabel = meta?.ente?.toUpperCase() ?? "TIENDA";

  return (
    <div className="min-h-screen bg-app-bg text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-wide text-rimec-azul hover:text-rimec-azul-dark"
            >
              ← Panel de control
            </Link>
            <h1 className="text-xl font-bold text-rimec-azul">
              Depósito {meta ? `${meta.ente} ${meta.tipo}` : "…"}
            </h1>
            {meta && depositoActivo && (
              <p className="text-sm text-slate-600">
                {meta.codigo} · cliente {clienteId} ·{" "}
                <span className="font-semibold text-bazzar-naranja">
                  {Math.round(depositoActivo.pares).toLocaleString("es-PY")} pares
                </span>
                <span className="text-slate-500">
                  {" "}
                  · {depositoActivo.registros.toLocaleString("es-PY")} registros
                </span>
              </p>
            )}
          </div>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            className="min-h-[44px] rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold focus:border-rimec-azul focus:outline-none"
          >
            {depositos.map((d) => (
              <option key={d.cliente_id} value={d.cliente_id}>
                {d.codigo} {d.ente} {d.tipo} ({Math.round(d.pares).toLocaleString("es-PY")} p · {d.registros} reg.)
              </option>
            ))}
          </select>
        </div>

        <div className="mx-auto mt-3 flex max-w-7xl gap-2">
          <button
            type="button"
            onClick={() => setTab("stock")}
            className={`min-h-[44px] flex-1 rounded-xl border-2 px-4 text-sm font-bold transition-colors ${
              tab === "stock"
                ? "border-rimec-azul bg-rimec-azul text-white"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            Stock · cajas
          </button>
          <button
            type="button"
            onClick={() => setTab("alertas")}
            className={`relative min-h-[44px] flex-1 rounded-xl border-2 px-4 text-sm font-bold transition-colors ${
              tab === "alertas"
                ? "border-red-500 bg-red-600 text-white"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            Alertas · vidriera ⭐
            {alertasUrgentes > 0 && tab !== "alertas" && (
              <span className="absolute -right-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-bazzar-naranja px-1.5 text-xs font-bold text-white">
                {alertasUrgentes}
              </span>
            )}
          </button>
        </div>

        {tab === "stock" && (
          <div className="mx-auto mt-3 max-w-7xl">
            <input
              type="search"
              placeholder="Buscar marca, línea, ref, estilo…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border-2 border-slate-200 bg-white px-4 text-base focus:border-rimec-azul focus:outline-none focus:ring-2 focus:ring-rimec-azul/20"
            />
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl p-4">
        {error && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</div>
        )}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Cargando stock del depósito…</div>
        ) : tab === "stock" ? (
          <>
            <GrillaCajasDeposito
              productos={filtrados}
              tiendaLabel={tiendaLabel}
              codigoDeposito={meta?.codigo ?? ""}
              clienteId={clienteId}
            />
            {filtrados.length > 0 && (
              <p className="mt-6 text-center text-sm text-slate-500">
                ⭐ = grada en vidriera · una estrella por caja (L+R+material+color)
              </p>
            )}
          </>
        ) : (
          <TabAlertasDeposito alertas={alertas} />
        )}
      </main>
    </div>
  );
}
