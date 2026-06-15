"use client";

import { useState, useTransition } from "react";
import { gradaLabelCorta } from "@/lib/cart/pos-cart";
import { usePosCart } from "@/lib/cart/PosCartContext";
import { TouchPad } from "@/components/cadena/TouchPad";

export function PosCartSheet() {
  const { items, count, open, setOpen, removeItem, updateQty, clear, session } = usePosCart();
  const [cedula, setCedula] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) return null;

  function cerrar() {
    if (pending) return;
    setOpen(false);
    setError(null);
    setOkMsg(null);
  }

  function cobrar() {
    if (!session || count === 0) return;
    setError(null);
    setOkMsg(null);

    startTransition(async () => {
      try {
        const r = await fetch("/api/tickets/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: session.cliente_id,
            marca: session.marca,
            cedula: cedula.trim() || null,
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
        clear();
        setCedula("");
        const persistNote = data.persisted ? "" : " (pendiente migración BD)";
        setOkMsg(`${data.total_pares} ticket${data.total_pares === 1 ? "" : "s"} emitido${data.total_pares === 1 ? "" : "s"}${persistNote}`);
        window.setTimeout(() => {
          setOkMsg(null);
          setOpen(false);
        }, 1800);
      } catch {
        setError("Error de red — intentá de nuevo");
      }
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-[#1a1a1a]/50 backdrop-blur-[1px]"
        onClick={cerrar}
        aria-hidden
      />

      <div
        className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[min(88dvh,720px)] flex-col border-t-2 border-[#1a1a1a] bg-[#f4f1ec] shadow-[0_-12px_40px_rgba(26,26,26,0.25)]"
        role="dialog"
        aria-label="Venta en curso"
      >
        <div className="flex items-center justify-between border-b border-[#c4bdb4] bg-[#1a1a1a] px-4 py-3 text-[#f4f1ec]">
          <div>
            <h2 className="font-br text-xl tracking-wide">Venta</h2>
            <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">
              {count} par{count === 1 ? "" : "es"} · {session?.marca ?? "—"}
            </p>
          </div>
          <TouchPad
            onClick={cerrar}
            ariaLabel="Cerrar"
            className="min-h-[48px] min-w-[48px] border border-[#8a8278] px-3 text-2xl leading-none text-[#f4f1ec] active:bg-[#1b2a41]"
          >
            ×
          </TouchPad>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-br text-lg text-[#1a1a1a]">Vacío</p>
              <p className="mt-1 text-sm text-[#6b6560]">Tocá una grada abajo para agregar pares</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex gap-3 border border-[#c4bdb4] bg-white p-3"
                >
                  {item.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imagen_url}
                      alt=""
                      className="h-16 w-16 shrink-0 object-contain bg-[#f4f1ec]"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 bg-[#e8e2d9]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-br text-base leading-tight text-[#1a1a1a]">
                      {item.linea_codigo}
                      <span className="text-[#6b6560]"> · </span>
                      {item.referencia_codigo}
                    </p>
                    <p className="truncate text-xs text-[#6b6560]">
                      {item.descp_color ?? item.color_code} · G.{gradaLabelCorta(item.grada)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end justify-between">
                    <TouchPad
                      onClick={() => removeItem(item.key)}
                      ariaLabel="Quitar"
                      className="min-h-[36px] min-w-[36px] text-lg text-[#9a9288] active:text-red-800"
                    >
                      ×
                    </TouchPad>
                    <div className="flex items-center gap-1 border border-[#c4bdb4] bg-[#f4f1ec]">
                      <TouchPad
                        onClick={() => updateQty(item.key, -1)}
                        ariaLabel="Menos"
                        className="min-h-[44px] min-w-[44px] text-xl font-bold active:bg-[#e8e2d9]"
                      >
                        −
                      </TouchPad>
                      <span className="min-w-[28px] text-center font-bold tabular-nums">{item.cantidad}</span>
                      <TouchPad
                        onClick={() => updateQty(item.key, 1)}
                        ariaLabel="Más"
                        disabled={item.cantidad >= item.stock_disponible}
                        className="min-h-[44px] min-w-[44px] text-xl font-bold active:bg-[#e8e2d9] disabled:opacity-30"
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

        <div className="shrink-0 space-y-3 border-t border-[#c4bdb4] bg-white px-4 py-4">
          {okMsg && (
            <p className="rounded-sm bg-[#1b2a41] px-3 py-3 text-center text-sm font-semibold text-[#f4f1ec]">
              {okMsg}
            </p>
          )}
          {error && (
            <p className="rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-center text-sm text-red-900">
              {error}
            </p>
          )}

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b6560]">
              Cédula cliente (opcional)
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="Consumidor final si vacío"
              className="mt-1 w-full border border-[#8a8278] bg-[#f4f1ec] px-4 py-3 text-base text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
            />
          </label>

          <TouchPad
            onClick={cobrar}
            ariaLabel="Confirmar venta"
            disabled={count === 0 || pending}
            className="flex min-h-[60px] w-full items-center justify-center bg-[#1a1a1a] font-br text-xl tracking-wide text-[#f4f1ec] active:bg-[#1b2a41] disabled:opacity-40"
          >
            {pending ? "Confirmando…" : `COBRAR · ${count} par${count === 1 ? "" : "es"}`}
          </TouchPad>

          {items.length > 0 && (
            <TouchPad
              onClick={() => {
                if (pending) return;
                clear();
              }}
              ariaLabel="Vaciar venta"
              className="w-full py-2 text-center text-xs text-[#6b6560] active:text-red-800"
            >
              Vaciar todo
            </TouchPad>
          )}
        </div>
      </div>
    </>
  );
}
