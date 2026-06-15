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
import {
  buildPosCartKey,
  type PosCartItem,
  type PosCartItemInput,
} from "@/lib/cart/pos-cart";

type PosSession = { cliente_id: number; marca: string };

type PosCartContextValue = {
  items: PosCartItem[];
  count: number;
  open: boolean;
  flashGrada: string | null;
  session: PosSession | null;
  setSession: (s: PosSession) => void;
  setOpen: (v: boolean) => void;
  addPar: (input: PosCartItemInput) => boolean;
  removeItem: (key: string) => void;
  updateQty: (key: string, delta: number) => void;
  clear: () => void;
};

const PosCartContext = createContext<PosCartContextValue | null>(null);
const STORAGE_KEY = "tablet_pos_cart_v1";

function loadStored(): PosCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PosCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function PosCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PosCartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [flashGrada, setFlashGrada] = useState<string | null>(null);
  const [session, setSessionState] = useState<PosSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const setSession = useCallback((s: PosSession) => {
    setSessionState(s);
    setItems((prev) => {
      const filtered = prev.filter((i) => i.cliente_id === s.cliente_id && i.marca === s.marca);
      return filtered.length === prev.length ? prev : filtered;
    });
  }, []);

  const addPar = useCallback((input: PosCartItemInput): boolean => {
    const key = buildPosCartKey(input);
    let added = false;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        if (existing.cantidad >= existing.stock_disponible) return prev;
        added = true;
        return prev.map((i) =>
          i.key === key ? { ...i, cantidad: i.cantidad + 1, stock_disponible: input.stock_disponible } : i,
        );
      }
      if (input.stock_disponible <= 0) return prev;
      added = true;
      return [...prev, { ...input, key, cantidad: 1 }];
    });

    if (added) {
      setFlashGrada(input.grada);
      window.setTimeout(() => setFlashGrada(null), 700);
    }
    return added;
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.key !== key) return i;
          const next = i.cantidad + delta;
          if (next > i.stock_disponible) return i;
          return { ...i, cantidad: next };
        })
        .filter((i) => i.cantidad > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.cantidad, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      open,
      flashGrada,
      session,
      setSession,
      setOpen,
      addPar,
      removeItem,
      updateQty,
      clear,
    }),
    [items, count, open, flashGrada, session, addPar, removeItem, updateQty, clear],
  );

  return <PosCartContext.Provider value={value}>{children}</PosCartContext.Provider>;
}

export function usePosCart() {
  const ctx = useContext(PosCartContext);
  if (!ctx) throw new Error("usePosCart must be inside PosCartProvider");
  return ctx;
}
