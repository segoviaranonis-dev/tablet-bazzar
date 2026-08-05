"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SelectorDepositos } from "@/components/cadena/SelectorDepositos";
import { EmpaqueControlLightbox } from "@/components/empaque/EmpaqueControlLightbox";
import { EmpaqueHubGrid, type EmpaqueHubCard } from "@/components/empaque/EmpaqueHubGrid";
import { resolverAccesoCatalogo } from "@/lib/acceso-catalogo";
import { DEPOSITOS } from "@/lib/depositos-config";
import { ordenarLineasEmpaque } from "@/lib/empaque-sort";
import type { TabletSessionUser } from "@/lib/nivel-dios";

const CAJA_IDS = new Set([2100, 2900, 2400, 2700, 3100, 3200]);

function validClienteId(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && CAJA_IDS.has(v);
}

type EmpaqueLinea = {
  codigo_oro: string;
  marca: string | null;
  linea_codigo: string | null;
  referencia_codigo: string | null;
  descp_material: string | null;
  descp_color: string | null;
  color_code: string | null;
  grada: string;
  imagen_url: string | null;
  controlado: boolean;
};

type EmpaqueFactura = {
  key: string;
  staging_id: number | null;
  numero_fi_fa: number | null;
  numero_factura_legal: string | null;
  marca: string | null;
  nombre_cliente: string;
  pares: number;
  controlados: number;
  created_at: string;
  lineas: EmpaqueLinea[];
};

function toggleControlLocal(facturas: EmpaqueFactura[], codigo: string): EmpaqueFactura[] {
  return facturas.map((f) => {
    const hit = f.lineas.find((l) => l.codigo_oro === codigo);
    if (!hit) return f;
    const nuevo = !hit.controlado;
    return {
      ...f,
      controlados: f.controlados + (nuevo ? 1 : -1),
      lineas: ordenarLineasEmpaque(
        f.lineas.map((l) => (l.codigo_oro === codigo ? { ...l, controlado: nuevo } : l)),
      ),
    };
  });
}

async function postToggleControl(
  clienteId: number,
  codigo: string,
): Promise<{ ok: boolean; controlado?: boolean; error?: string }> {
  try {
    const res = await fetch("/api/empaque/controlar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente_id: clienteId, codigo_oro: codigo }),
    });
    const data = (await res.json()) as { ok?: boolean; controlado?: boolean; error?: string };
    if (!res.ok || !data.ok) return { ok: false, error: String(data.error ?? "No se pudo cambiar el estado") };
    return { ok: true, controlado: Boolean(data.controlado) };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

export default function EmpaquePageInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const urlClienteRaw = sp.get("cliente_id");
  const urlClienteId = urlClienteRaw ? Number(urlClienteRaw) : null;

  const [sessionUser, setSessionUser] = useState<TabletSessionUser | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [multiTienda, setMultiTienda] = useState(false);
  const [hubCards, setHubCards] = useState<EmpaqueHubCard[]>([]);
  const [hubLoading, setHubLoading] = useState(true);

  const [clienteId, setClienteId] = useState<number | null>(
    validClienteId(urlClienteId) ? urlClienteId : null,
  );
  const [facturas, setFacturas] = useState<EmpaqueFactura[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sellarKey, setSellarKey] = useState<string | null>(null);
  const [nombreSellar, setNombreSellar] = useState("");
  const [facturaAbiertaKey, setFacturaAbiertaKey] = useState<string | null>(null);
  const [lightboxCtx, setLightboxCtx] = useState<{ facturaKey: string; codigoOro: string } | null>(null);

  const lightboxFactura = lightboxCtx ? facturas.find((f) => f.key === lightboxCtx.facturaKey) : null;
  const lightboxLinea =
    lightboxCtx && lightboxFactura
      ? lightboxFactura.lineas.find((l) => l.codigo_oro === lightboxCtx.codigoOro)
      : null;

  const acceso = sessionUser ? resolverAccesoCatalogo(sessionUser) : null;
  const showHub = acceso?.ok === true && multiTienda && !validClienteId(clienteId);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setSessionUser(data?.user ?? null))
      .catch(() => setSessionUser(null))
      .finally(() => setSessionChecked(true));
  }, []);

  const loadHub = useCallback(async () => {
    setHubLoading(true);
    try {
      const res = await fetch("/api/empaque/hub", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Error al cargar hub");
      setMultiTienda(Boolean(data.multi_tienda));
      setHubCards(data.tiendas ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error hub Empaque");
      setHubCards([]);
    } finally {
      setHubLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionChecked) return;
    void loadHub();
  }, [sessionChecked, loadHub]);

  useEffect(() => {
    if (validClienteId(urlClienteId)) {
      setClienteId(urlClienteId);
      return;
    }
    if (acceso?.ok && acceso.scope === "tienda") {
      setClienteId(acceso.clienteId);
    } else if (multiTienda) {
      setClienteId(null);
    }
  }, [urlClienteId, acceso, multiTienda]);

  const loadBandeja = useCallback(async (opts?: { silent?: boolean }) => {
    if (!validClienteId(clienteId)) return;
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/empaque/tickets?cliente_id=${clienteId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Error al cargar Bobeda");
      setFacturas(data.facturas ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      if (!silent) setFacturas([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    setFacturaAbiertaKey(null);
  }, [clienteId]);

  useEffect(() => {
    if (showHub || !validClienteId(clienteId)) return;
    void loadBandeja();
  }, [showHub, clienteId, loadBandeja]);

  function irTienda(id: number) {
    router.push(`/empaque?cliente_id=${id}`);
  }

  async function toggleControl(codigo: string, facturaKey?: string): Promise<EmpaqueFactura[] | null> {
    if (!validClienteId(clienteId)) return null;
    if (facturaKey) setFacturaAbiertaKey(facturaKey);
    setBusy(codigo);
    setMsg(null);
    setError(null);
    const snapshot = toggleControlLocal(facturas, codigo);
    setFacturas(snapshot);
    try {
      const r = await postToggleControl(clienteId, codigo);
      if (!r.ok) {
        setFacturas((prev) => toggleControlLocal(prev, codigo));
        setError(r.error ?? "No se pudo cambiar el estado");
        return null;
      }
      return snapshot;
    } catch {
      setFacturas((prev) => toggleControlLocal(prev, codigo));
      setError("Error de red");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function toggleDesdeLightbox() {
    if (!lightboxCtx || !lightboxLinea) return;
    const { facturaKey, codigoOro } = lightboxCtx;
    setFacturaAbiertaKey(facturaKey);
    const eraPendiente = !lightboxLinea.controlado;
    const snapshot = await toggleControl(codigoOro, facturaKey);
    if (!snapshot || !eraPendiente) return;

    const f = snapshot.find((x) => x.key === facturaKey);
    const next = f?.lineas.find((l) => !l.controlado);
    if (next) {
      setLightboxCtx({ facturaKey, codigoOro: next.codigo_oro });
    } else {
      setLightboxCtx(null);
    }
  }

  function abrirLightbox(facturaKey: string, codigoOro: string) {
    setFacturaAbiertaKey(facturaKey);
    setLightboxCtx({ facturaKey, codigoOro });
  }

  async function sellar(f: EmpaqueFactura) {
    if (!validClienteId(clienteId)) return;
    setBusy(f.key);
    setMsg(null);
    try {
      const res = await fetch("/api/empaque/sellar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: clienteId,
          staging_id: f.staging_id,
          nombre_confirmado: nombreSellar.trim() || f.nombre_cliente,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "No se pudo sellar");
        return;
      }
      setMsg(`Entrega confirmada · ${data.updated} par(es) → Bóveda de oro`);
      setSellarKey(null);
      setNombreSellar("");
      await loadBandeja();
      void loadHub();
    } catch {
      setMsg("Error de red");
    } finally {
      setBusy(null);
    }
  }

  const depositoActivo = DEPOSITOS.find((d) => d.cliente_id === clienteId);

  if (!sessionChecked || (hubLoading && hubCards.length === 0 && !error)) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4">
        <p className="py-16 text-center text-slate-500">Cargando Empaque…</p>
      </main>
    );
  }

  if (acceso && !acceso.ok) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl p-4">
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{acceso.reason}</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-orange-600 underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  if (showHub) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4 pb-24">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Empaque · P-13</p>
            <h1 className="text-2xl font-bold text-slate-900">Control de entrega</h1>
            <p className="text-sm text-slate-500">Elegí tienda · Bobeda PENDIENTE_ENTREGA</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadHub()}
              disabled={hubLoading}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {hubLoading ? "…" : "Actualizar"}
            </button>
            <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">
              Inicio
            </Link>
          </div>
        </header>

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
        )}

        <EmpaqueHubGrid cards={hubCards} loading={hubLoading} onRefresh={() => void loadHub()} />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-4 pb-24">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Empaque · P-13</p>
          <h1 className="text-2xl font-bold text-slate-900">Control de entrega</h1>
          {validClienteId(clienteId) && depositoActivo && (
            <p className="text-sm text-slate-500">
              Tienda {clienteId} · {depositoActivo.ente} {depositoActivo.tipo} · Bobeda PENDIENTE_ENTREGA
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadBandeja({ silent: facturas.length > 0 })}
            disabled={loading}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? "…" : "Actualizar"}
          </button>
          {multiTienda ? (
            <Link href="/empaque" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">
              Todas
            </Link>
          ) : null}
          <Link href="/" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">
            Inicio
          </Link>
        </div>
      </header>

      {validClienteId(clienteId) && (
        <SelectorDepositos
          clienteId={clienteId}
          onSelect={irTienda}
          locked={!multiTienda}
          className="mb-4 rounded-xl border border-orange-100"
        />
      )}

      {msg && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{msg}</p>}
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <p>{error}</p>
        </div>
      )}

      {loading && facturas.length === 0 ? (
        <p className="text-slate-500">Cargando Bobeda…</p>
      ) : facturas.length === 0 && !error ? (
        <p className="text-slate-500">Sin pares PENDIENTE_ENTREGA en esta tienda.</p>
      ) : (
        <ul className="space-y-3">
          {facturas.map((f) => {
            const listo = f.controlados >= f.pares && f.pares > 0;
            const sellando = sellarKey === f.key;
            const abierta = facturaAbiertaKey === f.key || sellando;
            return (
              <li key={f.key} className="overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm">
                <details
                  className="group"
                  open={abierta}
                  onToggle={(e) => {
                    if (sellando) return;
                    setFacturaAbiertaKey(e.currentTarget.open ? f.key : null);
                  }}
                >
                  <summary className="cursor-pointer list-none px-4 py-5 [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-3xl font-bold leading-tight text-slate-900">{f.nombre_cliente}</p>
                        {f.marca && (
                          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-orange-600">{f.marca}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">
                          <span className={listo ? "font-bold text-emerald-700" : "font-bold text-orange-700"}>
                            {f.controlados}/{f.pares} controlados
                          </span>
                          {f.numero_fi_fa != null ? ` · FI_FA ${f.numero_fi_fa}` : ""}
                        </p>
                        {!listo && (
                          <p className="mt-1 text-[10px] font-semibold text-orange-700">
                            Todos los artículos deben estar en verde para dar entrega
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2 text-right">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Factura legal</p>
                          <p className="font-mono text-lg font-black tabular-nums text-slate-900">
                            {f.numero_factura_legal?.trim() || "— pendiente —"}
                          </p>
                        </div>
                        {!sellando ? (
                          <button
                            type="button"
                            disabled={!listo || busy === f.key}
                            onClick={(e) => {
                              e.preventDefault();
                              setFacturaAbiertaKey(f.key);
                              setSellarKey(f.key);
                              setNombreSellar(f.nombre_cliente);
                            }}
                            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow disabled:opacity-40"
                          >
                            Dar entrega
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </summary>

                  <div className="border-t border-slate-100 bg-slate-50/80 p-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {f.lineas.map((linea, idx) => (
                        <EmpaqueItemCard
                          key={linea.codigo_oro}
                          linea={linea}
                          marca={linea.marca ?? f.marca}
                          esSiguiente={!linea.controlado && f.lineas.findIndex((l) => !l.controlado) === idx}
                          busy={busy === linea.codigo_oro}
                          onToggle={() => void toggleControl(linea.codigo_oro, f.key)}
                          onAmpliar={() => abrirLightbox(f.key, linea.codigo_oro)}
                        />
                      ))}
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                      {sellando ? (
                        <div className="flex flex-wrap items-end gap-2">
                          <label className="block min-w-[200px] flex-1">
                            <span className="text-[10px] font-bold uppercase text-slate-500">
                              Nombre en copia factura
                            </span>
                            <input
                              type="text"
                              value={nombreSellar}
                              onChange={(e) => setNombreSellar(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                            />
                          </label>
                          <button
                            type="button"
                            disabled={!listo || busy === f.key}
                            onClick={() => void sellar(f)}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                          >
                            Confirmar entrega
                          </button>
                          <button
                            type="button"
                            onClick={() => setSellarKey(null)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          Usá <strong className="text-emerald-700">Dar entrega</strong> arriba cuando todos los pares
                          estén en verde.
                        </p>
                      )}
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}

      {lightboxCtx && lightboxLinea && lightboxFactura && (
        <EmpaqueControlLightbox
          src={lightboxLinea.imagen_url}
          alt={`L${lightboxLinea.linea_codigo ?? "?"} R${lightboxLinea.referencia_codigo ?? "?"}`}
          grada={lightboxLinea.grada}
          molécula={`L${lightboxLinea.linea_codigo ?? "?"} · R${lightboxLinea.referencia_codigo ?? "?"}`}
          busy={busy === lightboxLinea.codigo_oro}
          controlado={lightboxLinea.controlado}
          progreso={`${lightboxFactura.controlados}/${lightboxFactura.pares} controlados`}
          onClose={() => setLightboxCtx(null)}
          onToggle={() => void toggleDesdeLightbox()}
        />
      )}
    </main>
  );
}

function EmpaqueItemCard({
  linea,
  marca,
  esSiguiente,
  busy,
  onToggle,
  onAmpliar,
}: {
  linea: EmpaqueLinea;
  marca: string | null;
  esSiguiente: boolean;
  busy: boolean;
  onToggle: () => void;
  onAmpliar: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-xl border-2 bg-white transition-all ${
        linea.controlado
          ? "border-emerald-400"
          : esSiguiente
            ? "border-orange-500 ring-2 ring-orange-200"
            : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={onAmpliar}
        className="relative aspect-square w-full cursor-zoom-in bg-neutral-50"
        aria-label={linea.controlado ? "Ampliar par controlado" : "Ampliar par pendiente"}
      >
        {linea.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={linea.imagen_url} alt="" className="h-full w-full object-contain p-2" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            {linea.linea_codigo}.{linea.referencia_codigo}
          </div>
        )}
        {esSiguiente && !linea.controlado && (
          <span className="absolute left-2 top-2 rounded-full bg-orange-600 px-2 py-0.5 text-[9px] font-bold text-white">
            SIGUIENTE
          </span>
        )}
        {linea.controlado && (
          <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
            OK
          </span>
        )}
      </button>
      <div className="space-y-1.5 p-2">
        {marca && (
          <p className="text-[9px] font-bold uppercase tracking-widest text-orange-600">{marca}</p>
        )}
        <p className="text-xs font-bold text-slate-800">
          L{linea.linea_codigo ?? "?"} R{linea.referencia_codigo ?? "?"}
        </p>
        <p className="text-[10px] leading-snug text-slate-600">
          {linea.descp_color || linea.color_code || "—"}
          {linea.descp_material ? ` · ${linea.descp_material}` : ""}
        </p>
        <div
          className={`rounded-lg border-2 px-2 py-1.5 text-center ${
            linea.controlado
              ? "border-emerald-400 bg-gradient-to-b from-emerald-50 to-white"
              : "border-orange-500 bg-gradient-to-b from-orange-50 to-white"
          }`}
        >
          <p
            className={`text-[9px] font-bold uppercase tracking-[0.15em] ${
              linea.controlado ? "text-emerald-800" : "text-orange-800"
            }`}
          >
            Nº
          </p>
          <p
            className={`font-mono text-2xl font-black leading-none tabular-nums ${
              linea.controlado ? "text-emerald-700" : "text-orange-700"
            }`}
          >
            {linea.grada}
          </p>
        </div>
        {linea.controlado ? (
          <button
            type="button"
            disabled={busy}
            onClick={onToggle}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-[10px] font-bold uppercase text-white disabled:opacity-50"
          >
            {busy ? "…" : "✓ Controlado"}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={onToggle}
            className="w-full rounded-lg border-2 border-orange-500 bg-orange-50 py-2.5 text-[10px] font-bold uppercase text-orange-700 disabled:opacity-50"
          >
            {busy ? "…" : "Pendiente"}
          </button>
        )}
      </div>
    </article>
  );
}
