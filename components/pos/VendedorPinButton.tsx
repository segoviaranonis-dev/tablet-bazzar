"use client";

import { useState } from "react";
import { TouchPad } from "@/components/cadena/TouchPad";
import { VendedorEnteSwitch } from "@/components/pos/VendedorEnteSwitch";
import { useVendedorTienda } from "@/lib/vendedor/VendedorContext";

type Props = {
  clienteId: number;
};

export function VendedorPinButton({ clienteId }: Props) {
  const { vendedor, identificarPin, setVendedor, clearVendedor } = useVendedorTienda(clienteId);
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
      setError(r.error ?? "Código incorrecto");
      return;
    }
    setPin("");
    setOpen(false);
  }

  if (vendedor && !open) {
    return (
      <div className="flex items-center gap-1">
        <VendedorEnteSwitch
          clienteId={clienteId}
          badgeClassName="max-w-[100px] truncate rounded-lg border border-white/40 bg-white/15 px-3 py-2 text-[10px] font-bold uppercase tracking-wide !text-white active:bg-white/25"
          pickerClassName="absolute right-0 top-full z-[80] mt-1 min-w-[120px] rounded-lg border border-white/30 bg-[#001a33]/98 p-1 shadow-lg"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-white/20 px-2 py-2 text-[9px] font-bold uppercase tracking-wide text-orange-200 active:bg-white/10"
          title="Ingresar otro código"
        >
          #
        </button>
      </div>
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
          Código vendedor
        </TouchPad>
      ) : (
        <div className="flex min-w-[160px] flex-col gap-1 rounded-lg border border-white/30 bg-[#001a33]/95 p-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") void submit();
            }}
            placeholder="Código"
            className="w-full rounded border border-white/20 bg-white px-2 py-2 text-center text-lg font-bold tracking-widest text-[#002B4E]"
          />
          {error && <p className="text-[10px] text-red-300">{error}</p>}
          <div className="flex gap-1">
            <button
              type="button"
              disabled={busy || pin.length < 2}
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
                  clearVendedor();
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
