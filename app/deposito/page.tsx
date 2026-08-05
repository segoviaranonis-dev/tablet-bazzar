"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DepositoFiltrosHeader,
  type DepositoFiltrosData,
} from "@/components/deposito/DepositoFiltrosHeader";
import { DepositoEstadisticasPanel } from "@/components/deposito/DepositoEstadisticasPanel";
import { DepositoCajaFullscreen } from "@/components/deposito/DepositoCajaFullscreen";
import { DepositoToolbar, type TabDeposito } from "@/components/deposito/DepositoToolbar";
import { GrillaCajasDeposito } from "@/components/deposito/GrillaCajasDeposito";
import { TabAlertasDeposito } from "@/components/deposito/TabAlertasDeposito";
import type { DepositoProducto } from "@/app/api/deposito/[cliente_id]/route";
import { agruparProductosPorCaja } from "@/lib/depositos/agrupar-cajas";
import { listarAlertasVidriera } from "@/lib/depositos/vidriera-estrellas";
import {
  EMPTY_DEPOSITO_FILTERS,
  depositoFiltersToSearchParams,
  type DepositoFilterState,
  type DepositoLimit,
} from "@/lib/deposito-filters";
import type { ColorEstandar } from "@/lib/tono/colores-estandar";
import { COLORES_ESTANDAR_DEFAULT } from "@/lib/tono/colores-estandar";

type DepositoEstado = {
  cliente_id: number;
  ente: string;
  tipo: string;
  codigo: string;
  registros: number;
  pares: number;
};

const DEFAULT_CLIENTE_ID = 2100;

export default function DepositoPage() {
  const [depositos, setDepositos] = useState<DepositoEstado[]>([]);
  const [clienteId, setClienteId] = useState(DEFAULT_CLIENTE_ID);
  const [productos, setProductos] = useState<DepositoProducto[]>([]);
  const [filtrosData, setFiltrosData] = useState<DepositoFiltrosData | null>(null);
  const [filtros, setFiltros] = useState<DepositoFilterState>(EMPTY_DEPOSITO_FILTERS);
  const [limit, setLimit] = useState<DepositoLimit>(80);
  const [meta, setMeta] = useState<{ ente: string; tipo: string; codigo: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabDeposito>("stock");
  const [filtrosExpanded, setFiltrosExpanded] = useState(false);
  const [colapsarTodo, setColapsarTodo] = useState(true);
  const [fullscreenKey, setFullscreenKey] = useState<string | null>(null);
  const [tonoCatalog, setTonoCatalog] = useState<ColorEstandar[]>(COLORES_ESTANDAR_DEFAULT);

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
      const qsProd = depositoFiltersToSearchParams(f, lim).toString();
      const qsFil = depositoFiltersToSearchParams(f).toString();
      try {
        const [resProd, resFil] = await Promise.all([
          fetch(`/api/deposito/${id}?${qsProd}`, { cache: "no-store" }),
          fetch(`/api/deposito/${id}/filtros-header?${qsFil}`, { cache: "no-store" }),
        ]);
        const dataProd = await resProd.json();
        const dataFil = await resFil.json();
        if (dataProd.error) throw new Error(dataProd.error);
        setProductos(dataProd.productos ?? []);
        setMeta({
          ente: dataProd.ente,
          tipo: dataProd.tipo,
          codigo: dataProd.codigo,
        });
        if (dataFil.error) {
          setFiltrosData(null);
          setError(`Cabecera filtros: ${dataFil.error}`);
        } else {
          setFiltrosData({
            generos: dataFil.generos ?? [],
            marcas: dataFil.marcas ?? [],
            estilos: dataFil.estilos ?? [],
            tipo1: dataFil.tipo1 ?? [],
            lineas: dataFil.lineas ?? [],
            gradas: dataFil.gradas ?? [],
            resumen: dataFil.resumen ?? { skus: 0, pares: 0 },
          });
        }
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
    fetch("/api/tono", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.estandar?.length) setTonoCatalog(d.estandar);
      })
      .catch(() => {});
  }, [loadStatus]);

  useEffect(() => {
    if (depositos.length === 0) return;
    const t = setTimeout(() => loadAll(clienteId, filtros, limit), filtros.q.trim() ? 650 : 200);
    return () => clearTimeout(t);
  }, [clienteId, depositos.length, filtros, limit, loadAll]);

  const cajas = useMemo(() => agruparProductosPorCaja(productos), [productos]);
  const alertas = useMemo(() => listarAlertasVidriera(cajas, clienteId), [cajas, clienteId]);
  const alertasUrgentes = alertas.filter((a) => a.tipo === "VIDRIERA_CAMBIO").length;
  const totalFiltradoPares = useMemo(
    () => cajas.reduce((s, c) => s + c.totalPares, 0),
    [cajas],
  );

  useEffect(() => {
    setFullscreenKey(null);
  }, [clienteId, filtros, limit, tab]);

  useEffect(() => {
    if (fullscreenKey && !cajas.some((c) => c.key === fullscreenKey)) {
      setFullscreenKey(null);
    }
  }, [cajas, fullscreenKey]);

  const depositoActivo = depositos.find((d) => d.cliente_id === clienteId);
  const tiendaLabel = meta?.ente?.toUpperCase() ?? "TIENDA";

  const depositosToolbar = depositos.map((d) => ({
    cliente_id: d.cliente_id,
    codigo: d.codigo,
    nombre: `${d.ente} ${d.tipo}`,
    pares: Math.round(d.pares),
  }));

  const depositoActivoToolbar = depositoActivo
    ? {
        cliente_id: depositoActivo.cliente_id,
        codigo: depositoActivo.codigo,
        nombre: meta ? `${meta.ente} ${meta.tipo}` : `${depositoActivo.ente} ${depositoActivo.tipo}`,
        pares: Math.round(depositoActivo.pares),
      }
    : null;

  return (
    <div className="min-h-screen bg-app-bg text-slate-900">
      <header className="sticky top-0 z-10">
        <DepositoToolbar
          tab={tab}
          onTabChange={setTab}
          depositoActivo={depositoActivoToolbar}
          depositos={depositosToolbar}
          onDepositoChange={setClienteId}
          filtrosExpanded={filtrosExpanded}
          onToggleFiltros={() => setFiltrosExpanded((v) => !v)}
          filtros={filtros}
          filtrosData={filtrosData}
          totalMostrados={productos.length}
          limit={limit}
          alertasCount={alertasUrgentes}
          colapsarTodo={colapsarTodo}
          onToggleColapsarTodo={() => setColapsarTodo((v) => !v)}
        />

        {(tab === "stock" || tab === "estadisticas") && filtrosExpanded && (
          <DepositoFiltrosHeader
            filtros={filtros}
            onChange={setFiltros}
            data={filtrosData}
            limit={limit}
            onLimitChange={setLimit}
            totalMostrados={productos.length}
            expanded={filtrosExpanded}
            onToggleExpanded={() => setFiltrosExpanded((v) => !v)}
            tonoCatalog={tonoCatalog}
            hideCollapsedBar
          />
        )}
      </header>

      <main className="mx-auto max-w-7xl p-3 sm:p-4">
        {error && (
          <div className="mb-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {loading ? (
          <div className="py-16 text-center text-slate-500">Cargando stock del depósito…</div>
        ) : tab === "stock" ? (
          <GrillaCajasDeposito
            productos={productos}
            tiendaLabel={tiendaLabel}
            codigoDeposito={meta?.codigo ?? ""}
            clienteId={clienteId}
            compactStats
            colapsarTodo={colapsarTodo}
            onCardSelect={(card) => setFullscreenKey(card.key)}
          />
        ) : tab === "alertas" ? (
          <TabAlertasDeposito alertas={alertas} />
        ) : (
          <DepositoEstadisticasPanel
            depositoNombre={
              meta ? `${meta.ente} ${meta.tipo}` : (depositoActivo?.ente ?? "Depósito")
            }
            depositoCodigo={meta?.codigo ?? depositoActivo?.codigo ?? ""}
            paresDeposito={depositoActivo?.pares ?? 0}
            cajas={cajas}
            totalFiltradoPares={totalFiltradoPares}
            totalFiltradoCajas={cajas.length}
            limit={limit}
          />
        )}
      </main>

      {fullscreenKey && tab === "stock" ? (
        <DepositoCajaFullscreen
          cards={cajas}
          activeKey={fullscreenKey}
          tiendaLabel={tiendaLabel}
          clienteId={clienteId}
          onActiveKeyChange={setFullscreenKey}
          onClose={() => setFullscreenKey(null)}
        />
      ) : null}
    </div>
  );
}
