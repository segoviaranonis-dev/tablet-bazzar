"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TouchPad } from "@/components/cadena/TouchPad";
import { gradaLabelCorta } from "@/lib/cart/pos-cart";
import { stagingLineasToCartItems, type StagingLineaCart } from "@/lib/cart/staging-to-cart";
import { usePosCart } from "@/lib/cart/PosCartContext";
import { dispatchPosCobrarOk } from "@/lib/pos-events";
import { setReopenSession } from "@/lib/pos-reopen";

type StagingLinea = StagingLineaCart & { id: number };

type StagingTicket = {
  id: number;
  codigo_staging: string;
  marca: string;
  vendedor_nombre: string;
  estado: string;
  total_pares: number;
  cedula_cliente: string | null;
  snapshot_cliente: Record<string, unknown> | null;
  lineas: StagingLinea[];
};

type CajaPendiente = {
  staging_id: number | null;
  display_id: string;
  vendedor_nombre: string | null;
  nombre_cliente: string | null;
  cedula_cliente: string | null;
  marca: string;
  pares: number;
  created_at: string;
};

type Props = {
  clienteId: number;
  open: boolean;
  onClose: () => void;
};

export function StagingTicketsPanel({ clienteId, open, onClose }: Props) {
  const router = useRouter();
  const { count, session, replaceCart } = usePosCart();
  const [tickets, setTickets] = useState<StagingTicket[]>([]);
  const [cajaPendientes, setCajaPendientes] = useState<CajaPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [stgR, cajaR] = await Promise.all([
        fetch(`/api/tickets/staging?cliente_id=${clienteId}&estado=ABIERTO,CERRADO`, {
          cache: "no-store",
        }),
        fetch(`/api/tickets/caja?cliente_id=${clienteId}`, { cache: "no-store" }),
      ]);
      const stgData = await stgR.json();
      const cajaData = await cajaR.json();
      setTickets(stgData.tickets ?? []);
      setCajaPendientes(cajaData.facturas ?? []);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function accion(id: number, accionName: string) {
    setMsg(null);
    setBusyKey(`stg:${id}`);
    const r = await fetch(`/api/tickets/staging/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente_id: clienteId, accion: accionName }),
    });
    const data = await r.json();
    setBusyKey(null);
    if (!r.ok || !data.ok) {
      setMsg(data.error ?? "Error");
      return;
    }
    if (
      accionName === "promover" ||
      accionName === "enviar_caja" ||
      accionName === "cancelar_pedido"
    ) {
      dispatchPosCobrarOk();
    }
    setMsg(
      accionName === "cancelar_pedido"
        ? "Pedido cancelado · stock restaurado"
        : accionName === "enviar_caja"
          ? "Enviado a caja Report"
          : `OK · ${accionName}`,
    );
    void load();
  }

  async function continuarEnCatalogo(stagingId: number) {
    setMsg(null);
    setBusyKey(`stg:${stagingId}`);
    const r = await fetch(`/api/tickets/staging/${stagingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente_id: clienteId, accion: "reabrir_completo" }),
    });
    const data = await r.json();
    setBusyKey(null);
    if (!r.ok || !data.ok) {
      setMsg(data.error ?? "No se pudo abrir el pedido");
      return;
    }

    const staging = data.staging as StagingTicket;
    const vendedor = data.vendedor as {
      id_vendedor: number;
      nombre_display: string;
      ente_codigo: number;
    } | null;

    if (!vendedor) {
      setMsg("Vendedor del pedido no disponible en esta tienda");
      return;
    }

    const cli = staging.snapshot_cliente ?? {};
    const cedula =
      staging.cedula_cliente ??
      (typeof cli.cedula === "string" ? cli.cedula : "");

    setReopenSession({
      stagingId: staging.id,
      cliente: cedula
        ? {
            cedula,
            nombre: typeof cli.nombre === "string" ? cli.nombre : "",
            apellido: typeof cli.apellido === "string" ? cli.apellido : "",
            telefono: typeof cli.telefono === "string" ? cli.telefono : "",
          }
        : null,
      vendedor,
    });

    const cartItems = stagingLineasToCartItems(clienteId, staging.marca, staging.lineas);
    replaceCart({ cliente_id: clienteId, marca: staging.marca }, cartItems);
    onClose();
    router.push(
      `/cadena/vista?marca=${encodeURIComponent(staging.marca)}&cliente_id=${clienteId}`,
    );
  }

  function imagenLinea(snap: Record<string, unknown>): string | null {
    const u = snap.imagen_url;
    return typeof u === "string" && u.trim() ? u : null;
  }

  function lineasReadOnly(t: StagingTicket) {
    const activas = t.lineas.filter((l) => l.activo && l.cantidad > 0);
    if (!activas.length) return null;
    return (
      <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2 text-sm">
        {activas.map((l) => {
          const snap = l.snapshot_json ?? {};
          const lc = typeof snap.linea_codigo === "string" ? snap.linea_codigo : "?";
          const rc = typeof snap.referencia_codigo === "string" ? snap.referencia_codigo : "?";
          const img = imagenLinea(snap);
          return (
            <li key={l.id} className="flex items-center gap-2">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded border border-slate-200 object-contain bg-white"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-100 text-[9px] text-slate-400">
                  sin foto
                </div>
              )}
              <span className="min-w-0 truncate">
                {lc}.{rc} G.{gradaLabelCorta(l.grada)} × {l.cantidad}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  if (!open) return null;

  const carritoActivo =
    session?.cliente_id === clienteId && count > 0
      ? { pares: count, marca: session.marca }
      : null;

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-[#002B4E]/50" onClick={onClose} aria-hidden />
      <div className="fixed inset-x-4 top-[8dvh] z-[90] mx-auto flex max-h-[84dvh] max-w-lg flex-col rounded-2xl border-2 border-[#002B4E] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="font-bold text-[#002B4E]">Facturas internas</h2>
            <p className="text-[10px] text-slate-500">
              Abrir en catálogo para editar · CERRAR reenvía a caja · Cancelar restaura stock
            </p>
          </div>
          <TouchPad onClick={onClose} ariaLabel="Cerrar" className="min-h-[40px] min-w-[40px] text-xl">
            ×
          </TouchPad>
        </div>
        {msg && <p className="bg-amber-50 px-4 py-2 text-sm text-amber-900">{msg}</p>}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-slate-500">Cargando…</p>
          ) : (
            <div className="space-y-4">
              {cajaPendientes.length > 0 && (
                <section>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-bazzar-naranja">
                    En caja Report · pendiente cajero
                  </p>
                  <ul className="space-y-2">
                    {cajaPendientes.map((f) => (
                      <li
                        key={f.display_id}
                        className="rounded-xl border border-orange-200 bg-orange-50/80 p-3 text-sm"
                      >
                        <p className="text-xs font-bold uppercase text-orange-800">PENDIENTE CAJA</p>
                        <p className="font-semibold text-slate-900">
                          {f.nombre_cliente ?? "Cliente"} · {f.display_id}
                        </p>
                        <p className="text-xs text-slate-600">
                          {f.pares} par{f.pares === 1 ? "" : "es"} · {f.marca} · {f.vendedor_nombre ?? "—"}
                        </p>
                        {f.staging_id != null ? (
                          <div className="mt-2 flex flex-col gap-1">
                            <button
                              type="button"
                              disabled={busyKey === `stg:${f.staging_id}`}
                              onClick={() => void continuarEnCatalogo(f.staging_id!)}
                              className="w-full rounded-lg bg-[#002B4E] py-2 text-[10px] font-bold uppercase text-white disabled:opacity-50"
                            >
                              Abrir en catálogo
                            </button>
                            <button
                              type="button"
                              disabled={busyKey === `stg:${f.staging_id}`}
                              onClick={() => void accion(f.staging_id!, "cancelar_pedido")}
                              className="w-full rounded-lg border-2 border-red-400 bg-white py-2 text-[10px] font-bold uppercase text-red-800 disabled:opacity-50"
                            >
                              Cancelar pedido
                            </button>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {tickets.length === 0 ? (
                <div className="space-y-3 text-sm text-slate-600">
                  {carritoActivo ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                      Venta en carrito: <strong>{carritoActivo.pares}</strong> par
                      {carritoActivo.pares === 1 ? "" : "es"} ({carritoActivo.marca}). COBRAR crea pedido nuevo.
                    </p>
                  ) : null}
                  {!carritoActivo && cajaPendientes.length === 0 ? (
                    <p>Sin pedidos pendientes en esta tienda.</p>
                  ) : null}
                </div>
              ) : (
                <section>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Staging sesión
                  </p>
                  <ul className="space-y-4">
                    {tickets.map((t) => (
                      <li key={t.id} className="rounded-xl border border-slate-200 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold uppercase text-slate-500">{t.estado}</p>
                            <p className="font-semibold text-slate-900">{t.vendedor_nombre}</p>
                            <p className="text-[10px] text-slate-400">{t.codigo_staging}</p>
                            <p className="text-sm">
                              {t.total_pares} par{t.total_pares === 1 ? "" : "es"}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              disabled={busyKey === `stg:${t.id}`}
                              onClick={() => void continuarEnCatalogo(t.id)}
                              className="rounded bg-[#002B4E] px-2 py-1 text-[10px] font-bold text-white disabled:opacity-50"
                            >
                              Abrir en catálogo
                            </button>
                            {(t.estado === "ABIERTO" || t.estado === "CERRADO") && (
                              <>
                                <button
                                  type="button"
                                  disabled={busyKey === `stg:${t.id}`}
                                  onClick={() => void accion(t.id, "enviar_caja")}
                                  className="rounded bg-bazzar-naranja px-2 py-1 text-[10px] font-bold text-white disabled:opacity-50"
                                >
                                  Listo → caja
                                </button>
                                <button
                                  type="button"
                                  disabled={busyKey === `stg:${t.id}`}
                                  onClick={() => void accion(t.id, "cancelar_pedido")}
                                  className="rounded border border-red-300 px-2 py-1 text-[10px] font-bold text-red-700 disabled:opacity-50"
                                >
                                  Cancelar pedido
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {lineasReadOnly(t)}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
        <div className="border-t border-slate-200 px-4 py-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 py-2 text-sm font-semibold text-[#002B4E] disabled:opacity-50"
          >
            {loading ? "…" : "Actualizar lista"}
          </button>
        </div>
      </div>
    </>
  );
}
