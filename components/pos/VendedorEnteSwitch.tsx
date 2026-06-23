"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVendedorTienda, type VendedorActivo } from "@/lib/vendedor/VendedorContext";

export function primerNombreVendedor(nombreDisplay: string): string {
  return nombreDisplay.trim().split(/\s+/)[0] ?? nombreDisplay;
}

type VendedorListaItem = {
  id_vendedor: number;
  nombre_display: string;
  codigo_pin: string;
  ente_codigo: number;
};

type Props = {
  clienteId: number;
  badgeClassName?: string;
  pickerClassName?: string;
};

const BADGE_DEFAULT =
  "rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wide !text-white active:bg-white/20";

export function VendedorEnteSwitch({
  clienteId,
  badgeClassName = BADGE_DEFAULT,
  pickerClassName = "absolute right-0 top-full z-[80] mt-1 min-w-[120px] rounded-lg border border-white/40 bg-[#001a33]/98 p-1 shadow-lg",
}: Props) {
  const { vendedor, setVendedor } = useVendedorTienda(clienteId);
  const [open, setOpen] = useState(false);
  const [lista, setLista] = useState<VendedorListaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const cargarLista = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/vendedor/lista?cliente_id=${clienteId}`, { cache: "no-store" });
      const data = await r.json();
      if (r.ok && data.ok && Array.isArray(data.vendedores)) {
        setLista(data.vendedores as VendedorListaItem[]);
      }
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (vendedor) void cargarLista();
  }, [vendedor, cargarLista]);

  useEffect(() => {
    if (!open) return;
    void cargarLista();
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, cargarLista]);

  function elegir(item: VendedorListaItem) {
    const v: VendedorActivo = {
      id_vendedor: item.id_vendedor,
      nombre_display: item.nombre_display,
      ente_codigo: item.ente_codigo,
    };
    setVendedor(v);
    setOpen(false);
  }

  if (!vendedor) return null;

  const puedeElegir = lista.length > 1;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={badgeClassName}
        title={puedeElegir ? "Cambiar vendedor" : vendedor.nombre_display}
        aria-label={`Vendedor ${primerNombreVendedor(vendedor.nombre_display)}`}
        aria-expanded={open}
      >
        {primerNombreVendedor(vendedor.nombre_display)}
        {puedeElegir && <span className="ml-1 opacity-70">▾</span>}
      </button>

      {open && (
        <div className={pickerClassName} role="listbox">
          <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-orange-200">
            Vendedor
          </p>
          {loading && (
            <p className="px-2 py-2 text-[10px] text-white/60">Cargando…</p>
          )}
          {!loading &&
            lista.map((item) => {
              const activo = item.id_vendedor === vendedor.id_vendedor;
              return (
                <button
                  key={item.id_vendedor}
                  type="button"
                  role="option"
                  aria-selected={activo}
                  onClick={() => elegir(item)}
                  className={`w-full rounded-md px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide ${
                    activo
                      ? "bg-bazzar-naranja !text-white"
                      : "!text-white active:bg-white/15"
                  }`}
                >
                  {primerNombreVendedor(item.nombre_display)}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
