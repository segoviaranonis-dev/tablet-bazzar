"use client";

import { useState } from "react";
import { TouchPad } from "@/components/cadena/TouchPad";
import { useVendedorTienda } from "@/lib/vendedor/VendedorContext";

type Props = {
  clienteId: number;
};

export function VendedorPinButton({ clienteId }: Props) {
  const { vendedor, identificarPin, setVendedor } = useVendedorTienda(clienteId);
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    const r = await identificarPin(clienteId, pin);
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? "PIN incorrecto");
      return;
    }
    setPin("");
    setOpen(false);
  }

  if (vendedor && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="max-w-[140px] truncate rounded-lg border border-white/40 bg-white/15 px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-white active:bg-white/25"
        title={vendedor.nombre_display}
      >
        <span className="block text-[9px] text-orange-200">Vendedor</span>
        <span className="block truncate text-xs normal-case">{vendedor.nombre_display}</span>
      </button>
    );
  }

  return (
    <>
      {!open ? (
        <TouchPad
          onClick={() => setOpen(true)}
          ariaLabel="Identificar vendedor"
          className="min-h-[44px] rounded-lg border-2 border-amber-300 bg-amber-400/90 px-3 text-[10px] font-bold uppercase tracking-wide !text-[#002B4E] active:bg-amber-300"
        >
          PIN vendedor
        </TouchPad>
      ) : (
        <div className="flex min-w-[160px] flex-col gap-1 rounded-lg border border-white/30 bg-[#001a33]/95 p-2">
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") void submit();
            }}
            placeholder="PIN"
            className="w-full rounded border border-white/20 bg-white px-2 py-2 text-center text-lg font-bold tracking-widest text-[#002B4E]"
          />
          {error && <p className="text-[10px] text-red-300">{error}</p>}
          <div className="flex gap-1">
            <button
              type="button"
              disabled={busy || pin.length < 4}
              onClick={() => void submit()}
              className="flex-1 rounded bg-bazzar-naranja py-1.5 text-[10px] font-bold uppercase text-white disabled:opacity-40"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setPin("");
                setError(null);
              }}
              className="rounded border border-white/30 px-2 py-1.5 text-[10px] text-white"
            >
              ×
            </button>
            {vendedor && (
              <button
                type="button"
                onClick={() => {
                  setVendedor(null);
                  localStorage.removeItem(`tablet_vendedor_${clienteId}`);
                  setOpen(false);
                }}
                className="rounded border border-white/30 px-2 py-1.5 text-[10px] text-orange-200"
              >
                Salir
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
