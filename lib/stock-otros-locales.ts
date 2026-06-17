/** Stock por grada en una ubicación (Fernando / Palma / San Martín). */
export type StockUbicacionBloque = {
  id: string;
  label: string;
  esActual: boolean;
  tallas: string[];
  stock: number[];
  stockTotal: number;
};

export type StockOtrosLocalesResponse = {
  configured: boolean;
  ubicaciones: StockUbicacionBloque[];
  error?: string;
};

export type StockMoleculaQuery = {
  linea_id: number | null;
  referencia_id: number | null;
  material_id: number | null;
  color_id: number | null;
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
  material_code: string;
  color_code: string;
};

export function gradaSortKey(g: string): [number, number, string] {
  const s = g.trim();
  if (!s || s.toLowerCase() === "(sin grada)") return [9999, 9999, s];
  const m = /^(\d+)/.exec(s);
  if (m) return [0, Number(m[1]), s];
  return [1, 0, s];
}

/** Misma etiqueta en mini-tabla stock y botones venta (evita 25 vs 28). */
export function formatGradaDisplay(grada: string): string {
  const s = grada.trim();
  if (!s) return "—";
  const open = /^(\d{2,3})\b/.exec(s);
  if (open) return open[1];
  return s.length > 4 ? s.slice(0, 4) : s;
}

export function sortGradas(gradas: string[]): string[] {
  return [...gradas].sort((a, b) => {
    const ka = gradaSortKey(a);
    const kb = gradaSortKey(b);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1] - kb[1];
    return ka[2].localeCompare(kb[2], "es");
  });
}

const UBICACION_ORDER = ["fernando", "san_martin", "palma"] as const;
const UBICACION_LABELS: Record<(typeof UBICACION_ORDER)[number], string> = {
  fernando: "Fernando",
  san_martin: "San Martín",
  palma: "Palma",
};

export function buildStockBloques(
  gradasPorUbicacion: Map<string, Map<string, number>>,
  ubicacionActualId: string | null,
): StockUbicacionBloque[] {
  return UBICACION_ORDER.map((id) => {
    const gm = gradasPorUbicacion.get(id);
    const tallas = gm ? sortGradas([...gm.keys()]) : [];
    const stock = tallas.map((t) => gm!.get(t) ?? 0);
    return {
      id,
      label: UBICACION_LABELS[id],
      esActual: id === ubicacionActualId,
      tallas,
      stock,
      stockTotal: stock.reduce((s, n) => s + n, 0),
    };
  });
}

export function emptyUbicaciones(ubicacionActualId: string | null): StockUbicacionBloque[] {
  return buildStockBloques(new Map(), ubicacionActualId);
}

export function stockOtrosLocalesUrl(clienteId: number, fila: StockMoleculaQuery): string {
  const p = new URLSearchParams({
    cliente_id: String(clienteId),
    linea: fila.linea_codigo_proveedor,
    referencia: fila.referencia_codigo_proveedor,
    material: fila.material_code,
    color: fila.color_code,
  });
  if (fila.linea_id != null) p.set("linea_id", String(fila.linea_id));
  if (fila.referencia_id != null) p.set("referencia_id", String(fila.referencia_id));
  if (fila.material_id != null) p.set("material_id", String(fila.material_id));
  if (fila.color_id != null) p.set("color_id", String(fila.color_id));
  return `/api/deposito/stock-otros-locales?${p.toString()}`;
}

/** Poll en vivo — stock por par L+R en 3 ubicaciones (cuadra con INGRESAR «214 p»). */
export type ParStockLiveQuery = {
  linea_id: number | null;
  referencia_id: number | null;
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
};

export function totalStockRed(ubicaciones: StockUbicacionBloque[] | undefined): number {
  if (!ubicaciones?.length) return 0;
  return ubicaciones.reduce((s, u) => s + u.stockTotal, 0);
}

export function stockLiveUrl(clienteId: number, par: ParStockLiveQuery): string {
  const p = new URLSearchParams();
  p.set("linea", par.linea_codigo_proveedor.trim());
  p.set("referencia", par.referencia_codigo_proveedor.trim());
  if (par.linea_id != null) p.set("linea_id", String(par.linea_id));
  if (par.referencia_id != null) p.set("referencia_id", String(par.referencia_id));
  return `/api/deposito/${clienteId}/live?${p.toString()}`;
}

export type StockLiveResponse = {
  configured: boolean;
  cantidad_local: number;
  ubicaciones: StockUbicacionBloque[];
  server_time?: string;
  ms?: number;
  error?: string;
};
