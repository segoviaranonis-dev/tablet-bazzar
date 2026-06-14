import type { ParLineaRef } from "@/lib/cadena";
import type { PosicionCadena } from "@/lib/server/cadena-server";

const SEED_KEY = "tablet-cadena-seed";
const TTL_MS = 30_000;

export type CadenaSeed = {
  cliente_id: number;
  marca: string;
  queryKey: string;
  paresAll: ParLineaRef[];
  posicion?: PosicionCadena;
  saved_at: number;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function cadenaQueryKey(queryString: string): string {
  const p = new URLSearchParams(queryString);
  for (const k of ["pi", "gi", "c1", "c2"]) p.delete(k);
  return p.toString();
}

export function saveCadenaSeed(seed: Omit<CadenaSeed, "saved_at">): void {
  if (!canUseStorage()) return;
  try {
    const payload: CadenaSeed = { ...seed, saved_at: Date.now() };
    sessionStorage.setItem(SEED_KEY, JSON.stringify(payload));
  } catch {
    /* quota / privado */
  }
}

export function loadCadenaSeed(
  cliente_id: number,
  marca: string,
  queryKey: string,
): CadenaSeed | null {
  if (!canUseStorage()) return null;
  try {
    const raw = sessionStorage.getItem(SEED_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CadenaSeed;
    if (Date.now() - data.saved_at > TTL_MS) {
      sessionStorage.removeItem(SEED_KEY);
      return null;
    }
    if (data.cliente_id !== cliente_id || data.marca !== marca || data.queryKey !== queryKey) {
      return null;
    }
    if (!Array.isArray(data.paresAll) || data.paresAll.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearCadenaSeed(): void {
  if (!canUseStorage()) return;
  try {
    sessionStorage.removeItem(SEED_KEY);
  } catch {
    /* ignore */
  }
}
