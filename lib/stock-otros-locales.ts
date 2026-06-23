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

/** Poll en vivo — stock por par L+R o molécula (color activo) en 3 ubicaciones. */
export type ParStockLiveQuery = {
  linea_id: number | null;
  referencia_id: number | null;
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
};

export type StockLiveQuery = ParStockLiveQuery & Partial<StockMoleculaQuery>;

export function totalStockRed(ubicaciones: StockUbicacionBloque[] | undefined): number {
  if (!ubicaciones?.length) return 0;
  return ubicaciones.reduce((s, u) => s + u.stockTotal, 0);
}

export function stockLiveUrl(clienteId: number, q: StockLiveQuery): string {
  const p = new URLSearchParams();
  p.set("linea", q.linea_codigo_proveedor.trim());
  p.set("referencia", q.referencia_codigo_proveedor.trim());
  if (q.linea_id != null) p.set("linea_id", String(q.linea_id));
  if (q.referencia_id != null) p.set("referencia_id", String(q.referencia_id));
  if (q.material_id != null) p.set("material_id", String(q.material_id));
  if (q.color_id != null) p.set("color_id", String(q.color_id));
  if (q.material_code?.trim()) p.set("material", q.material_code.trim());
  if (q.color_code?.trim()) p.set("color", q.color_code.trim());
  return `/api/deposito/${clienteId}/live?${p.toString()}`;
}

/** Las 2 tiendas que no son la actual — siempre 2 paneles en dock. */
export function otrasUbicacionesDock(ubicaciones: StockUbicacionBloque[]): StockUbicacionBloque[] {
  const actualId = ubicaciones.find((b) => b.esActual)?.id ?? null;
  const otras = ubicaciones.filter((b) => !b.esActual);
  if (otras.length >= 2) return otras.slice(0, 2);

  const padded = [...otras];
  for (const id of UBICACION_ORDER) {
    if (id === actualId) continue;
    if (padded.some((b) => b.id === id)) continue;
    padded.push({
      id,
      label: UBICACION_LABELS[id],
      esActual: false,
      tallas: [],
      stock: [],
      stockTotal: 0,
    });
    if (padded.length >= 2) break;
  }
  return padded.slice(0, 2);
}

export type StockLiveResponse = {
  configured: boolean;
  cantidad_local: number;
  ubicaciones: StockUbicacionBloque[];
  scope?: "par_lr" | "molecule";
  server_time?: string;
  ms?: number;
  error?: string;
};
