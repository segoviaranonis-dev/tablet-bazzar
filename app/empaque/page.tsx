"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type BobedaRow = {
  codigo_oro: string;
  display_id: string;
  nombre_cliente: string | null;
  cedula_cliente: string | null;
  vendedor_nombre: string | null;
  marca: string;
  linea_codigo: string | null;
  referencia_codigo: string | null;
  grada: string;
  created_at: string;
};

const DEFAULT_CLIENTE_ID = 2100;

export default function EmpaquePage() {
  const [clienteId, setClienteId] = useState(DEFAULT_CLIENTE_ID);
  const [rows, setRows] = useState<BobedaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/empaque/tickets?cliente_id=${clienteId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Error al cargar Bobeda");
      setRows(data.tickets ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function entregar(codigo: string) {
    setBusy(codigo);
    setMsg(null);
    try {
      const res = await fetch("/api/empaque/entregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: clienteId, codigos: [codigo] }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "No se pudo marcar ENTREGADO");
        return;
      }
      setMsg(`${codigo} → ENTREGADO`);
      await load();
    } catch {
      setMsg("Error de red");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-4 pb-24">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Empaque · P-13</p>
          <h1 className="text-2xl font-bold text-slate-900">Bobeda pendiente de entrega</h1>
        </div>
        <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">
          Inicio
        </Link>
      </header>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="text-xs font-bold uppercase text-slate-500">cliente_id</span>
          <input
            type="number"
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value) || DEFAULT_CLIENTE_ID)}
            className="mt-1 w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? "…" : "Actualizar"}
        </button>
      </div>

      {msg && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{msg}</p>}
      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Cargando Bobeda…</p>
      ) : rows.length === 0 ? (
        <p className="text-slate-500">Sin pares PENDIENTE_ENTREGA en esta tienda.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.codigo_oro} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-slate-500">{r.codigo_oro}</p>
                  <p className="text-lg font-bold text-slate-900">{r.nombre_cliente ?? "Cliente sin nombre"}</p>
                  {r.cedula_cliente && <p className="text-sm text-slate-600">CI {r.cedula_cliente}</p>}
                  <p className="mt-1 text-sm text-slate-700">
                    {r.linea_codigo ?? "?"}.{r.referencia_codigo ?? "?"} · G.{r.grada} · {r.marca}
                  </p>
                  <p className="text-xs text-slate-500">Vendedor: {r.vendedor_nombre ?? "—"}</p>
                </div>
                <button
                  type="button"
                  disabled={busy === r.codigo_oro}
                  onClick={() => void entregar(r.codigo_oro)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  ENTREGADO
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
