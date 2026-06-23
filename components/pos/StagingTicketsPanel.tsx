"use client";

import { useCallback, useEffect, useState } from "react";
import { TouchPad } from "@/components/cadena/TouchPad";
import { gradaLabelCorta } from "@/lib/cart/pos-cart";
import { usePosCart } from "@/lib/cart/PosCartContext";
import { dispatchPosCobrarOk } from "@/lib/pos-events";

type StagingLinea = {
  id: number;
  grada: string;
  cantidad: number;
  activo: boolean;
  snapshot_json: Record<string, unknown> | null;
};

type StagingTicket = {
  id: number;
  codigo_staging: string;
  vendedor_nombre: string;
  estado: string;
  total_pares: number;
  lineas: StagingLinea[];
};

type Props = {
  clienteId: number;
  open: boolean;
  onClose: () => void;
};

export function StagingTicketsPanel({ clienteId, open, onClose }: Props) {
  const { items, count, session } = usePosCart();
  const [tickets, setTickets] = useState<StagingTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/tickets/staging?cliente_id=${clienteId}&estado=ABIERTO,CERRADO`, {
        cache: "no-store",
      });
      const data = await r.json();
      setTickets(data.tickets ?? []);
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
    if (accionName === "promover") dispatchPosCobrarOk();
    setMsg(`OK · ${accionName}`);
    void load();
  }

  async function patchLinea(stagingId: number, lineaId: number, delta: number, linea: StagingLinea) {
    const next = Math.max(0, linea.cantidad + delta);
    setBusyKey(`linea:${lineaId}`);
    const r = await fetch(`/api/tickets/staging/${stagingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: clienteId,
        lineas: [{ id: lineaId, cantidad: next, activo: next > 0 }],
      }),
    });
    const data = await r.json();
    setBusyKey(null);
    if (!r.ok || !data.ok) {
      setMsg(data.error ?? "Error al editar");
      return;
    }
    if (delta < 0) dispatchPosCobrarOk();
    void load();
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
            <h2 className="font-bold text-[#002B4E]">Tickets · staging sesión</h2>
            <p className="text-[10px] text-slate-500">
              Editar ítem a ítem solo acá (ABIERTO) · Bobeda/ORO no se toca
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
          ) : tickets.length === 0 ? (
            <div className="space-y-3 text-sm text-slate-600">
              {carritoActivo ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                  Venta F1 en carrito: <strong>{carritoActivo.pares}</strong> par
                  {carritoActivo.pares === 1 ? "" : "es"} ({carritoActivo.marca}). Todavía no es staging — entrá al
                  catálogo, abrí el carrito y tocá <strong>CERRAR</strong> para crear ticket ABIERTO acá.
                </p>
              ) : null}
              <p>
                Sin staging ABIERTO/CERRADO en base. Flujo: CERRAR venta → staging editable →{" "}
                <strong>→ caja</strong> (Bobeda) → ahí nace empaque (pendiente módulo).
              </p>
            </div>
          ) : (
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
                    <div className="flex flex-wrap gap-1">
                      {t.estado === "ABIERTO" && (
                        <>
                          <button
                            type="button"
                            disabled={busyKey === `stg:${t.id}`}
                            onClick={() => void accion(t.id, "cerrar")}
                            className="rounded bg-[#002B4E] px-2 py-1 text-[10px] font-bold text-white disabled:opacity-50"
                          >
                            Cerrar
                          </button>
                          <button
                            type="button"
                            disabled={busyKey === `stg:${t.id}`}
                            onClick={() => void accion(t.id, "cancelar")}
                            className="rounded border border-red-300 px-2 py-1 text-[10px] text-red-700"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {t.estado === "CERRADO" && (
                        <>
                          <button
                            type="button"
                            disabled={busyKey === `stg:${t.id}`}
                            onClick={() => void accion(t.id, "reabrir")}
                            className="rounded border border-slate-300 px-2 py-1 text-[10px]"
                          >
                            Reabrir
                          </button>
                          <button
                            type="button"
                            disabled={busyKey === `stg:${t.id}`}
                            onClick={() => void accion(t.id, "promover")}
                            className="rounded bg-bazzar-naranja px-2 py-1 text-[10px] font-bold text-white disabled:opacity-50"
                          >
                            → caja
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {t.estado === "ABIERTO" && (
                    <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2 text-sm">
                      {t.lineas
                        .filter((l) => l.activo && l.cantidad > 0)
                        .map((l) => {
                          const snap = l.snapshot_json ?? {};
                          const lc = typeof snap.linea_codigo === "string" ? snap.linea_codigo : "?";
                          const rc = typeof snap.referencia_codigo === "string" ? snap.referencia_codigo : "?";
                          return (
                            <li key={l.id} className="flex items-center justify-between gap-2">
                              <span>
                                {lc}.{rc} G.{gradaLabelCorta(l.grada)}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={busyKey === `linea:${l.id}`}
                                  onClick={() => void patchLinea(t.id, l.id, -1, l)}
                                  className="min-w-[28px] rounded border px-1 disabled:opacity-40"
                                >
                                  −
                                </button>
                                <span className="min-w-[20px] text-center font-bold">{l.cantidad}</span>
                                <button
                                  type="button"
                                  disabled={busyKey === `linea:${l.id}`}
                                  onClick={() => void patchLinea(t.id, l.id, 1, l)}
                                  className="min-w-[28px] rounded border px-1 disabled:opacity-40"
                                >
                                  +
                                </button>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
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
