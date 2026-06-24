"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { gradaLabelCorta } from "@/lib/cart/pos-cart";
import { dispatchPosCobrarOk } from "@/lib/pos-events";
import { usePosCart } from "@/lib/cart/PosCartContext";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { useVendedorTienda } from "@/lib/vendedor/VendedorContext";
import { formatFacturaInternaPos } from "@/lib/fi-fa-display";
import {
  clearReopenSession,
  getReopenStagingId,
  readReopenCliente,
  readReopenFiFa,
  readReopenVendedor,
} from "@/lib/pos-reopen";
import { TouchPad } from "@/components/cadena/TouchPad";
import { VendedorEnteSwitch } from "@/components/pos/VendedorEnteSwitch";

type TipoPersona = "fisica" | "juridica";

type ClienteForm = {
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  razon_social: string;
  ruc: string;
};

type ModoCliente = "idle" | "encontrado" | "registro";

type PantallaCliente = "buscar" | "registro";

function limpiarCliente(): ClienteForm {
  return { cedula: "", nombre: "", apellido: "", telefono: "", razon_social: "", ruc: "" };
}

function tituloDesdeCliente(c: ClienteForm): string {
  const parts = [c.nombre.trim(), c.apellido.trim()].filter(Boolean);
  return parts.join(" ") || c.razon_social.trim() || "Cliente";
}

export function PosCartSheet() {
  const { items, count, open, setOpen, removeItem, updateQty, clear, session } = usePosCart();
  const tiendaId = session?.cliente_id ?? null;
  const tiendaActiva = tiendaId ? getDepositoByClienteId(tiendaId) : null;
  const { vendedor, identificarPin, clearVendedor, setVendedor } = useVendedorTienda(tiendaId ?? 2100);
  const [cliente, setCliente] = useState<ClienteForm>(limpiarCliente);
  const [modo, setModo] = useState<ModoCliente>("idle");
  const [pantallaCliente, setPantallaCliente] = useState<PantallaCliente>("buscar");
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>("fisica");
  const [cedulaBuscando, setCedulaBuscando] = useState(false);
  const [codigoVendedorOpen, setCodigoVendedorOpen] = useState(false);
  const [codigoVendedor, setCodigoVendedor] = useState("");
  const [codigoVendedorBusy, setCodigoVendedorBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [numeroFiFa, setNumeroFiFa] = useState<number | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setNumeroFiFa(readReopenFiFa());
    const reopenCliente = readReopenCliente();
    const reopenVendedor = readReopenVendedor();
    if (reopenCliente) {
      setCliente({
        cedula: reopenCliente.cedula,
        nombre: reopenCliente.nombre,
        apellido: reopenCliente.apellido,
        telefono: reopenCliente.telefono,
        razon_social: "",
        ruc: "",
      });
      setModo("encontrado");
      setPantallaCliente("buscar");
    }
    if (reopenVendedor) {
      setVendedor(reopenVendedor);
    }
  }, [open, setVendedor]);

  const buildSyncPayload = useCallback(() => {
    if (!session || !vendedor) return null;
    const cedula = cliente.cedula.trim() || null;
    const payloadCliente =
      cedula && modo === "encontrado"
        ? {
            nombre: cliente.nombre.trim() || null,
            apellido: cliente.apellido.trim() || null,
            telefono: cliente.telefono.trim() || null,
          }
        : null;
    return {
      cliente_id: session.cliente_id,
      marca: session.marca,
      vendedor_bazzar_id: vendedor.id_vendedor,
      cedula,
      cliente: payloadCliente,
      items: items.map((i) => ({
        linea_id: i.linea_id,
        referencia_id: i.referencia_id,
        material_id: i.material_id,
        color_id: i.color_id,
        linea_codigo: i.linea_codigo,
        referencia_codigo: i.referencia_codigo,
        material_code: i.material_code,
        color_code: i.color_code,
        descp_material: i.descp_material,
        descp_color: i.descp_color,
        estilo: i.estilo,
        marca_label: i.marca_label,
        grada: i.grada,
        imagen_url: i.imagen_url,
        cantidad: i.cantidad,
      })),
    };
  }, [session, vendedor, cliente, modo, items]);

  const persistReopenCart = useCallback(async (): Promise<boolean> => {
    const stagingId = getReopenStagingId();
    const payload = buildSyncPayload();
    if (!stagingId || !payload) return true;

    try {
      const r = await fetch(`/api/tickets/staging/${stagingId}/sync-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        setError(data.error ?? "No se pudo guardar cambios en el pedido");
        return false;
      }
      if (data.cancelled) {
        clearReopenSession();
        clear();
        resetClienteUi();
        clearVendedor();
        setNumeroFiFa(null);
        dispatchPosCobrarOk();
        setOpen(false);
        return false;
      }
      if (data.staging?.numero_fi_fa != null) {
        setNumeroFiFa(Number(data.staging.numero_fi_fa));
      }
      return true;
    } catch {
      setError("Error de red — intentá de nuevo");
      return false;
    }
  }, [buildSyncPayload, clear, clearVendedor, setOpen]);

  const schedulePersistCart = useCallback(() => {
    if (!getReopenStagingId()) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      void persistReopenCart();
    }, 450);
  }, [persistReopenCart]);

  function handleRemoveItem(key: string) {
    removeItem(key);
    schedulePersistCart();
  }

  function handleUpdateQty(key: string, delta: number) {
    updateQty(key, delta);
    schedulePersistCart();
  }

  if (!open) return null;

  const inputClass =
    "mt-1 w-full border border-[#cbd5e1] bg-white px-4 py-3 text-base text-slate-900 focus:border-[#002B4E] focus:outline-none";

  const btnBuscarClass =
    "mb-0.5 min-h-[52px] shrink-0 rounded-lg border-2 border-[#002B4E] bg-[#002B4E] px-5 text-sm font-bold uppercase tracking-wide !text-white active:bg-[#001a33] disabled:opacity-40";

  function resetClienteUi() {
    setCliente(limpiarCliente());
    setModo("idle");
    setPantallaCliente("buscar");
    setTipoPersona("fisica");
    setCedulaBuscando(false);
  }

  function vaciarCarrito() {
    if (pending) return;
    const stagingId = getReopenStagingId();
    if (stagingId && session) {
      startTransition(async () => {
        try {
          const r = await fetch(`/api/tickets/staging/${stagingId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cliente_id: session.cliente_id, accion: "cancelar_pedido" }),
          });
          const data = await r.json();
          if (!r.ok || !data.ok) {
            setError(data.error ?? "No se pudo cancelar el pedido");
            return;
          }
          clearReopenSession();
          clear();
          resetClienteUi();
          clearVendedor();
          setCodigoVendedorOpen(false);
          setCodigoVendedor("");
          setError(null);
          dispatchPosCobrarOk();
          setOpen(false);
        } catch {
          setError("Error de red — intentá de nuevo");
        }
      });
      return;
    }
    clear();
    resetClienteUi();
    clearVendedor();
    setCodigoVendedorOpen(false);
    setCodigoVendedor("");
    setError(null);
  }

  function cerrar() {
    if (pending) return;
    const stagingId = getReopenStagingId();
    if (stagingId && session && vendedor && clienteIdentificado) {
      startTransition(async () => {
        if (syncTimerRef.current) {
          clearTimeout(syncTimerRef.current);
          syncTimerRef.current = null;
        }
        const ok = await persistReopenCart();
        if (!ok && getReopenStagingId()) return;
        setOpen(false);
        setError(null);
        setOkMsg(null);
        resetClienteUi();
      });
      return;
    }
    setOpen(false);
    setError(null);
    setOkMsg(null);
    resetClienteUi();
  }

  function volverABuscar() {
    setError(null);
    setPantallaCliente("buscar");
    setModo("idle");
    setTipoPersona("fisica");
    setCliente((prev) => ({
      ...limpiarCliente(),
      cedula: prev.cedula,
    }));
  }

  function cambiarTipoPersona(tipo: TipoPersona) {
    setTipoPersona(tipo);
    setError(null);
    if (tipo === "juridica") {
      setCliente((prev) => ({ ...prev, nombre: "", apellido: "" }));
    } else {
      setCliente((prev) => ({ ...prev, razon_social: "" }));
    }
  }

  async function buscarCedula() {
    const digits = cliente.cedula.replace(/\D/g, "");
    if (digits.length < 5) {
      setError("Ingresá una cédula válida (mín. 5 dígitos)");
      return;
    }

    setError(null);
    setCedulaBuscando(true);

    try {
      const r = await fetch(`/api/clients-bazaar/buscar?cedula=${encodeURIComponent(digits)}`);
      const data = await r.json();

      if (!r.ok || !data.ok) {
        setError(data.error ?? "No se pudo buscar");
        return;
      }

      if (data.cliente) {
        setCliente({
          cedula: data.cliente.cedula ?? digits,
          nombre: data.cliente.nombre ?? "",
          apellido: data.cliente.apellido ?? "",
          telefono: data.cliente.telefono ?? "",
          razon_social: data.cliente.razon_social ?? "",
          ruc: "",
        });
        setModo("encontrado");
        setPantallaCliente("buscar");
        return;
      }

      setCliente({ ...limpiarCliente(), cedula: digits });
      setModo("registro");
      setTipoPersona("fisica");
      setPantallaCliente("registro");
    } catch {
      setError("Error de red — intentá de nuevo");
    } finally {
      setCedulaBuscando(false);
    }
  }

  function validarRegistro(): string | null {
    if (tipoPersona === "juridica") {
      if (!cliente.razon_social.trim()) return "Completá razón social";
      if (!cliente.ruc.replace(/\D/g, "").trim()) return "Completá RUC";
    } else {
      if (!cliente.nombre.trim()) return "Completá nombre";
    }
    if (!cliente.telefono.trim()) return "Completá celular";
    return null;
  }

  function payloadRegistro() {
    if (tipoPersona === "juridica") {
      return {
        nombre: cliente.razon_social.trim() || null,
        apellido: null,
        telefono: cliente.telefono.trim() || null,
        razon_social: cliente.razon_social.trim() || null,
        ruc: cliente.ruc.replace(/\D/g, "").trim() || null,
      };
    }
    return {
      nombre: cliente.nombre.trim() || null,
      apellido: cliente.apellido.trim() || null,
      telefono: cliente.telefono.trim() || null,
      razon_social: null,
      ruc: cliente.ruc.replace(/\D/g, "").trim() || null,
    };
  }

  function registrar() {
    if (!session) return;
    setError(null);

    const err = validarRegistro();
    if (err) {
      setError(err);
      return;
    }

    startTransition(async () => {
      try {
        const r = await fetch("/api/clients-bazaar/registrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: session.cliente_id,
            cedula: cliente.cedula,
            ...payloadRegistro(),
          }),
        });

        const data = await r.json();
        if (!r.ok || !data.ok) {
          setError(data.error ?? "No se pudo registrar");
          return;
        }

        const c = data.cliente;
        setCliente({
          cedula: c?.cedula ?? cliente.cedula,
          nombre: c?.nombre ?? cliente.nombre,
          apellido: c?.apellido ?? cliente.apellido,
          telefono: c?.telefono ?? cliente.telefono,
          razon_social: c?.razon_social ?? cliente.razon_social,
          ruc: "",
        });
        setModo("encontrado");
        setPantallaCliente("buscar");
        setTipoPersona("fisica");
      } catch {
        setError("Error de red — intentá de nuevo");
      }
    });
  }

  function cobrar() {
    if (!session) return;
    const reopenStagingId = getReopenStagingId();
    if (count === 0 && !reopenStagingId) return;
    if (!clienteIdentificado) {
      setError("Identificá al cliente (cédula + Buscar) antes de cerrar");
      return;
    }
    if (!vendedor) {
      setError(null);
      setCodigoVendedorOpen(true);
      return;
    }
    setError(null);
    setOkMsg(null);

    const cedula = cliente.cedula.trim() || null;

    startTransition(async () => {
      try {
        const payloadCliente =
          cedula && modo === "encontrado"
            ? {
                nombre: cliente.nombre.trim() || null,
                apellido: cliente.apellido.trim() || null,
                telefono: cliente.telefono.trim() || null,
              }
            : null;

        const reopenStagingId = getReopenStagingId();

        const r = await fetch("/api/tickets/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: session.cliente_id,
            marca: session.marca,
            vendedor_bazzar_id: vendedor.id_vendedor,
            staging_id: reopenStagingId,
            cedula,
            cliente: payloadCliente,
            items: items.map((i) => ({
              linea_id: i.linea_id,
              referencia_id: i.referencia_id,
              material_id: i.material_id,
              color_id: i.color_id,
              linea_codigo: i.linea_codigo,
              referencia_codigo: i.referencia_codigo,
              material_code: i.material_code,
              color_code: i.color_code,
              descp_material: i.descp_material,
              descp_color: i.descp_color,
              estilo: i.estilo,
              marca_label: i.marca_label,
              grada: i.grada,
              imagen_url: i.imagen_url,
              cantidad: i.cantidad,
            })),
          }),
        });

        const data = await r.json();
        if (!r.ok || !data.ok) {
          setError(data.error ?? "No se pudo confirmar la venta");
          return;
        }

        if (data.cancelled) {
          clearReopenSession();
          clear();
          resetClienteUi();
          clearVendedor();
          setCodigoVendedorOpen(false);
          setNumeroFiFa(null);
          dispatchPosCobrarOk();
          setOkMsg(data.mensaje ?? "Pedido cancelado · stock restaurado");
          window.setTimeout(() => {
            setOkMsg(null);
            setOpen(false);
          }, 1800);
          return;
        }

        clearReopenSession();
        clear();
        resetClienteUi();
        clearVendedor();
        setCodigoVendedorOpen(false);
        dispatchPosCobrarOk();
        setOkMsg(
          data.mensaje ??
            `Enviado a caja · ${data.total_pares} par${data.total_pares === 1 ? "" : "es"} · ${data.codigo_staging ?? ""}`,
        );
        window.setTimeout(() => {
          setOkMsg(null);
          setOpen(false);
        }, 1800);
      } catch {
        setError("Error de red — intentá de nuevo");
      }
    });
  }

  async function confirmarCodigoVendedor(codigo?: string) {
    const digits = (codigo ?? codigoVendedor).replace(/\D/g, "");
    if (!tiendaId || digits.length < 2) {
      setError("Ingresá el código de vendedor (mín. 2 dígitos)");
      return;
    }
    if (codigoVendedorBusy) return;
    setError(null);
    setCodigoVendedorBusy(true);
    const r = await identificarPin(tiendaId, digits);
    setCodigoVendedorBusy(false);
    if (!r.ok) {
      setError(r.error ?? "Código no reconocido en esta tienda");
      return;
    }
    setCodigoVendedor("");
    setCodigoVendedorOpen(false);
  }

  const tituloCliente = tituloDesdeCliente(cliente);
  const enRegistro = pantallaCliente === "registro";
  const clienteIdentificado = !enRegistro && modo === "encontrado" && Boolean(cliente.cedula);
  const reopenActivo = Boolean(getReopenStagingId());
  const puedeCerrar =
    Boolean(vendedor && clienteIdentificado && (count > 0 || reopenActivo) && !pending);
  const etiquetaFacturaInterna =
    numeroFiFa != null
      ? formatFacturaInternaPos({
          nombre_cliente: tituloCliente,
          cedula_cliente: cliente.cedula,
          numero_fi_fa: numeroFiFa,
        })
      : null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-[#002B4E]/50 backdrop-blur-[1px]"
        onClick={cerrar}
        aria-hidden
      />

      <div
        className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[min(88dvh,720px)] flex-col border-t-2 border-[#002B4E] bg-[#f1f5f9] shadow-[0_-12px_40px_rgba(26,26,26,0.25)]"
        role="dialog"
        aria-label={enRegistro ? "Registro de cliente" : "Venta en curso"}
      >
        <div className="flex items-center justify-between gap-3 border-b border-orange-200 bazzar-band px-4 py-3 text-white">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {enRegistro && (
              <TouchPad
                onClick={volverABuscar}
                ariaLabel="Volver a buscar"
                className="min-h-[44px] min-w-[44px] shrink-0 rounded-lg border border-white/30 px-2 text-xl !text-white active:bg-white/10"
              >
                ←
              </TouchPad>
            )}
            <div className="min-w-0 flex-1">
              {clienteIdentificado ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200">
                        Cliente
                      </p>
                      <h2 className="truncate text-2xl font-bold leading-tight tracking-wide text-white drop-shadow-sm">
                        {tituloCliente}
                      </h2>
                    </div>
                    {numeroFiFa != null ? (
                      <div className="shrink-0 rounded-lg border-2 border-yellow-300/90 bg-yellow-400/25 px-3 py-1.5 text-right shadow-sm">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-yellow-100">
                          Factura interna
                        </p>
                        <p className="text-xl font-black tabular-nums leading-none text-yellow-50">
                          FI_FA: {numeroFiFa}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  {etiquetaFacturaInterna ? (
                    <p className="mt-1 truncate text-xs font-semibold tracking-wide text-yellow-100/95">
                      {etiquetaFacturaInterna}
                    </p>
                  ) : null}
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/75">
                    CI {cliente.cedula} · {count} par{count === 1 ? "" : "es"} · {session?.marca ?? "—"}
                    {tiendaActiva ? ` · ${tiendaActiva.codigo}` : ""}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-xl font-semibold tracking-wide">
                      {enRegistro ? "Registro cliente" : "Venta"}
                    </h2>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">
                    {enRegistro
                      ? `CI ${cliente.cedula} · ${count} par${count === 1 ? "" : "es"}`
                      : `${count} par${count === 1 ? "" : "es"} · ${session?.marca ?? "—"}`}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {vendedor && tiendaId ? (
              <VendedorEnteSwitch clienteId={tiendaId} />
            ) : null}
            {clienteIdentificado && (
              <button
                type="button"
                onClick={resetClienteUi}
                className="rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wide !text-white active:bg-white/20"
              >
                Cambiar
              </button>
            )}
            <TouchPad
              onClick={cerrar}
              ariaLabel="Cerrar"
              className="min-h-[48px] min-w-[48px] border border-[#cbd5e1] px-3 text-2xl leading-none !text-white active:bg-[#002B4E]"
            >
              ×
            </TouchPad>
          </div>
        </div>

        {enRegistro ? (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {error && (
              <p className="mb-3 rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-center text-sm text-red-900">
                {error}
              </p>
            )}

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-900">
              Cliente nuevo · CI {cliente.cedula}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => cambiarTipoPersona("fisica")}
                className={`min-h-[48px] flex-1 rounded-lg border-2 px-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                  tipoPersona === "fisica"
                    ? "border-[#002B4E] bg-[#002B4E] !text-white"
                    : "border-[#cbd5e1] bg-white text-[#002B4E]"
                }`}
              >
                Persona física
              </button>
              <button
                type="button"
                onClick={() => cambiarTipoPersona("juridica")}
                className={`min-h-[48px] flex-1 rounded-lg border-2 px-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                  tipoPersona === "juridica"
                    ? "border-[#002B4E] bg-[#002B4E] !text-white"
                    : "border-[#cbd5e1] bg-white text-[#002B4E]"
                }`}
              >
                Persona jurídica
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {tipoPersona === "juridica" ? (
                <>
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                      Razón social
                    </span>
                    <input
                      type="text"
                      value={cliente.razon_social}
                      onChange={(e) => setCliente((prev) => ({ ...prev, razon_social: e.target.value }))}
                      placeholder="Nombre de la empresa"
                      className={inputClass}
                      autoFocus
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                      RUC · Registro único del contribuyente
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cliente.ruc}
                      onChange={(e) =>
                        setCliente((prev) => ({ ...prev, ruc: e.target.value.replace(/[^\d-]/g, "") }))
                      }
                      placeholder="RUC"
                      className={inputClass}
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                        Nombre
                      </span>
                      <input
                        type="text"
                        value={cliente.nombre}
                        onChange={(e) => setCliente((prev) => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Nombre"
                        className={inputClass}
                        autoFocus
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                        Apellido
                      </span>
                      <input
                        type="text"
                        value={cliente.apellido}
                        onChange={(e) => setCliente((prev) => ({ ...prev, apellido: e.target.value }))}
                        placeholder="Apellido"
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                      RUC (opcional)
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cliente.ruc}
                      onChange={(e) =>
                        setCliente((prev) => ({ ...prev, ruc: e.target.value.replace(/[^\d-]/g, "") }))
                      }
                      placeholder="Solo si tiene"
                      className={inputClass}
                    />
                  </label>
                </>
              )}

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                  Celular
                </span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={cliente.telefono}
                  onChange={(e) => setCliente((prev) => ({ ...prev, telefono: e.target.value }))}
                  placeholder="09xx xxx xxx"
                  className={inputClass}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-semibold text-slate-900">Vacío</p>
                <p className="mt-1 text-sm text-[#64748b]">Tocá una grada abajo para agregar pares</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3 border border-[#e2e8f0] bg-white p-3">
                    {item.imagen_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imagen_url}
                        alt=""
                        className="h-16 w-16 shrink-0 bg-[#f1f5f9] object-contain"
                      />
                    ) : (
                      <div className="h-16 w-16 shrink-0 bg-[#f1f5f9]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold leading-tight text-slate-900">
                        {item.linea_codigo}
                        <span className="text-[#64748b]"> · </span>
                        {item.referencia_codigo}
                      </p>
                      <p className="truncate text-xs text-[#64748b]">
                        {item.descp_color ?? item.color_code} · G.{gradaLabelCorta(item.grada)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-between">
                      <TouchPad
                        onClick={() => handleRemoveItem(item.key)}
                        ariaLabel="Quitar"
                        className="min-h-[36px] min-w-[36px] text-lg text-[#94a3b8] active:text-red-800"
                      >
                        ×
                      </TouchPad>
                      <div className="flex items-center gap-1 border border-[#e2e8f0] bg-[#f1f5f9]">
                        <TouchPad
                          onClick={() => handleUpdateQty(item.key, -1)}
                          ariaLabel="Menos"
                          className="min-h-[44px] min-w-[44px] text-xl font-bold active:bg-[#f1f5f9]"
                        >
                          −
                        </TouchPad>
                        <span className="min-w-[28px] text-center font-bold tabular-nums">{item.cantidad}</span>
                        <TouchPad
                          onClick={() => handleUpdateQty(item.key, 1)}
                          ariaLabel="Más"
                          disabled={item.cantidad >= item.stock_disponible}
                          className="min-h-[44px] min-w-[44px] text-xl font-bold active:bg-[#f1f5f9] disabled:opacity-30"
                        >
                          +
                        </TouchPad>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="shrink-0 space-y-3 border-t border-[#e2e8f0] bg-white px-4 py-4">
          {okMsg && (
            <p className="rounded-sm bg-[#002B4E] px-3 py-3 text-center text-sm font-semibold !text-[#f1f5f9]">
              {okMsg}
            </p>
          )}
          {error && !enRegistro && (
            <p className="rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-center text-sm text-red-900">
              {error}
            </p>
          )}

          {!enRegistro && !clienteIdentificado && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-2">
                <label className="block min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                    Cédula cliente
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cliente.cedula}
                    onChange={(e) => {
                      setModo("idle");
                      setCliente((prev) => ({
                        ...prev,
                        cedula: e.target.value.replace(/[^\d]/g, ""),
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void buscarCedula();
                    }}
                    placeholder="Número de cédula"
                    className={inputClass}
                  />
                </label>
                <TouchPad
                  onClick={() => void buscarCedula()}
                  ariaLabel="Buscar cédula"
                  disabled={cedulaBuscando || cliente.cedula.replace(/\D/g, "").length < 5}
                  className={btnBuscarClass}
                >
                  {cedulaBuscando ? "…" : "Buscar"}
                </TouchPad>
              </div>

              {modo === "idle" && (
                <p className="text-xs text-[#64748b]">
                  Ingresá cédula y tocá <strong>Buscar</strong> — obligatorio para cerrar la venta.
                </p>
              )}
            </div>
          )}

          {enRegistro ? (
            <TouchPad
              onClick={registrar}
              ariaLabel="Registrar cliente"
              disabled={pending}
              className="flex min-h-[60px] w-full items-center justify-center rounded-xl border-2 border-[#002B4E] bg-[#002B4E] text-xl font-semibold tracking-wide !text-white active:bg-[#001a33] disabled:opacity-40"
            >
              {pending ? "Registrando…" : "REGISTRAR"}
            </TouchPad>
          ) : codigoVendedorOpen && !vendedor ? (
            <div className="space-y-2">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                  Código de vendedor
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  maxLength={6}
                  value={codigoVendedor}
                  onChange={(e) => setCodigoVendedor(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void confirmarCodigoVendedor();
                  }}
                  placeholder="Ej. 36"
                  className={inputClass}
                />
              </label>
              <div className="flex gap-2">
                <TouchPad
                  onClick={() => void confirmarCodigoVendedor()}
                  ariaLabel="Confirmar código de vendedor"
                  disabled={codigoVendedorBusy || codigoVendedor.replace(/\D/g, "").length < 2}
                  className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-bazzar-naranja text-lg font-semibold tracking-wide !text-white active:bg-bazzar-naranja-dark disabled:opacity-40"
                >
                  {codigoVendedorBusy ? "…" : "Confirmar"}
                </TouchPad>
                <TouchPad
                  onClick={() => {
                    setCodigoVendedorOpen(false);
                    setCodigoVendedor("");
                    setError(null);
                  }}
                  ariaLabel="Cancelar código de vendedor"
                  className="min-h-[52px] rounded-xl border border-[#cbd5e1] px-4 text-sm font-semibold text-[#64748b]"
                >
                  ×
                </TouchPad>
              </div>
            </div>
          ) : (
            <TouchPad
              onClick={cobrar}
              ariaLabel={
                puedeCerrar
                  ? "Cerrar venta"
                  : !vendedor
                    ? "Ingresar código de vendedor"
                    : "Identificar cliente"
              }
              disabled={
                count === 0 || pending || (Boolean(vendedor) && !clienteIdentificado)
              }
              className="flex min-h-[60px] w-full items-center justify-center rounded-xl bg-bazzar-naranja text-xl font-semibold tracking-wide !text-white active:bg-bazzar-naranja-dark disabled:opacity-40"
            >
              {pending
                ? "Confirmando…"
                : puedeCerrar
                  ? "CERRAR"
                  : !vendedor
                    ? "Código vendedor requerido"
                    : "Cliente requerido"}
            </TouchPad>
          )}

          {items.length > 0 && !enRegistro && (
            <TouchPad
              onClick={vaciarCarrito}
              ariaLabel="Vaciar venta"
              className="w-full py-2 text-center text-xs text-[#64748b] active:text-red-800"
            >
              Vaciar todo
            </TouchPad>
          )}
        </div>
      </div>
    </>
  );
}
