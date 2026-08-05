/**
 * Precio de venta Bazzar tienda — única verdad: LPN CSV → deposito.precio_unitario.
 * Paridad con report/src/lib/depositos/precio-venta.ts
 */

export function parseLpnPrecioVenta(raw: string | number | null | undefined): number | null {
  if (raw == null || raw === "") return null;
  if (typeof raw === "number") {
    if (!Number.isFinite(raw) || raw <= 0) return null;
    return raw >= 1000 ? raw / 1000 : raw;
  }
  const n = Number(String(raw).replace(/\D/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n >= 1000 ? n / 1000 : n;
}

export function normalizePrecioUnitario(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function resolvePrecioGrupoLRM(
  filas: ReadonlyArray<{ precio_unitario?: number | null }>,
): number | null {
  for (const f of filas) {
    const p = normalizePrecioUnitario(f.precio_unitario);
    if (p != null) return p;
  }
  return null;
}

export function formatPrecioGs(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function calcSubtotalCarrito(
  items: ReadonlyArray<{ cantidad: number; precio_unitario?: number | null }>,
): number {
  return items.reduce((s, i) => {
    const p = normalizePrecioUnitario(i.precio_unitario);
    if (p == null) return s;
    return s + p * i.cantidad;
  }, 0);
}
