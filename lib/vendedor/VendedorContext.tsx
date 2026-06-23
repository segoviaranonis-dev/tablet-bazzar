"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type VendedorActivo = {
  id_vendedor: number;
  nombre_display: string;
  cliente_id: number;
};

type VendedorContextValue = {
  vendedor: VendedorActivo | null;
  setVendedor: (v: VendedorActivo | null) => void;
  identificarPin: (clienteId: number, pin: string) => Promise<{ ok: boolean; error?: string }>;
  loadForTienda: (clienteId: number) => void;
  clienteId: number | null;
};

const VendedorContext = createContext<VendedorContextValue | null>(null);

function storageKey(clienteId: number) {
  return `tablet_vendedor_${clienteId}`;
}

export function VendedorProvider({ children }: { children: ReactNode }) {
  const [vendedor, setVendedorState] = useState<VendedorActivo | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);

  const setVendedor = useCallback((v: VendedorActivo | null) => {
    setVendedorState(v);
    if (v) {
      localStorage.setItem(storageKey(v.cliente_id), JSON.stringify(v));
      setClienteId(v.cliente_id);
    }
  }, []);

  const loadForTienda = useCallback((cid: number) => {
    setClienteId(cid);
    try {
      const raw = localStorage.getItem(storageKey(cid));
      if (!raw) {
        setVendedorState(null);
        return;
      }
      const parsed = JSON.parse(raw) as VendedorActivo;
      if (parsed.cliente_id === cid) setVendedorState(parsed);
      else setVendedorState(null);
    } catch {
      setVendedorState(null);
    }
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
        return { ok: false, error: data.error ?? "PIN incorrecto" };
      }
      const v: VendedorActivo = {
        id_vendedor: data.vendedor.id_vendedor,
        nombre_display: data.vendedor.nombre_display,
        cliente_id: cid,
      };
      setVendedor(v);
      return { ok: true };
    } catch {
      return { ok: false, error: "Error de red" };
    }
  }, [setVendedor]);

  const value = useMemo(
    () => ({ vendedor, setVendedor, identificarPin, loadForTienda, clienteId }),
    [vendedor, setVendedor, identificarPin, loadForTienda, clienteId],
  );

  return <VendedorContext.Provider value={value}>{children}</VendedorContext.Provider>;
}

export function useVendedor() {
  const ctx = useContext(VendedorContext);
  if (!ctx) throw new Error("useVendedor must be inside VendedorProvider");
  return ctx;
}

export function useVendedorTienda(clienteId: number) {
  const { vendedor, loadForTienda, identificarPin, setVendedor } = useVendedor();

  useEffect(() => {
    loadForTienda(clienteId);
  }, [clienteId, loadForTienda]);

  const activo = vendedor?.cliente_id === clienteId ? vendedor : null;

  return { vendedor: activo, identificarPin, setVendedor, clienteId };
}
