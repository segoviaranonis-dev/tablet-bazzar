"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";

export type VendedorActivo = {
  id_vendedor: number;
  nombre_display: string;
  /** Ente holding: 2=Fernando, 3=San Martín, 4=Palma */
  ente_codigo: number;
};

type VendedorContextValue = {
  vendedor: VendedorActivo | null;
  setVendedor: (v: VendedorActivo | null) => void;
  clearVendedor: () => void;
  identificarPin: (clienteId: number, pin: string) => Promise<{ ok: boolean; error?: string }>;
  clienteId: number | null;
};

const VendedorContext = createContext<VendedorContextValue | null>(null);

export function VendedorProvider({ children }: { children: ReactNode }) {
  const [vendedor, setVendedorState] = useState<VendedorActivo | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);

  const setVendedor = useCallback((v: VendedorActivo | null) => {
    setVendedorState(v);
  }, []);

  const clearVendedor = useCallback(() => {
    setVendedorState(null);
  }, []);

  const identificarPin = useCallback(async (cid: number, pin: string) => {
    try {
      const r = await fetch("/api/vendedor/identificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: cid, pin }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        return { ok: false, error: data.error ?? "Código incorrecto" };
      }
      const v: VendedorActivo = {
        id_vendedor: data.vendedor.id_vendedor,
        nombre_display: data.vendedor.nombre_display,
        ente_codigo: Number(data.vendedor.ente_codigo),
      };
      setVendedor(v);
      setClienteId(cid);
      return { ok: true };
    } catch {
      return { ok: false, error: "Error de red" };
    }
  }, [setVendedor]);

  const value = useMemo(
    () => ({ vendedor, setVendedor, clearVendedor, identificarPin, clienteId }),
    [vendedor, setVendedor, clearVendedor, identificarPin, clienteId],
  );

  return <VendedorContext.Provider value={value}>{children}</VendedorContext.Provider>;
}

export function useVendedor() {
  const ctx = useContext(VendedorContext);
  if (!ctx) throw new Error("useVendedor must be inside VendedorProvider");
  return ctx;
}

export function useVendedorTienda(clienteId: number) {
  const { vendedor, identificarPin, setVendedor, clearVendedor } = useVendedor();
  const origen = origenDesdeTiendaClienteId(clienteId);

  const activo =
    vendedor && origen && vendedor.ente_codigo === origen.ente_codigo ? vendedor : null;

  return { vendedor: activo, identificarPin, setVendedor, clearVendedor, clienteId };
}
