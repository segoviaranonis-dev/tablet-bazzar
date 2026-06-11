import type { StockUbicacionBloque } from "@/lib/stock-otros-locales";

export function stockBloquesEqual(a: StockUbicacionBloque[], b: StockUbicacionBloque[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    if (x.stockTotal !== y.stockTotal || x.tallas.length !== y.tallas.length) return false;
    for (let j = 0; j < x.stock.length; j++) {
      if (x.stock[j] !== y.stock[j]) return false;
    }
  }
  return true;
}
