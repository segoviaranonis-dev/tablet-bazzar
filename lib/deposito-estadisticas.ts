import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";
import { normalizePrecioUnitario } from "@/lib/precio-venta";

export type MetricMode = "pares" | "precio";

export type StatSlice = {
  label: string;
  value: number;
  pares: number;
  cajas: number;
  valor: number;
  pct: number;
};

function valorCaja(c: ProductoCajaCard): number {
  const p = normalizePrecioUnitario(c.precioUnitario);
  if (p == null) return 0;
  return p * c.totalPares;
}

export function metricValue(c: ProductoCajaCard, mode: MetricMode): number {
  return mode === "pares" ? c.totalPares : valorCaja(c);
}

export function agregarPorCampo(
  cajas: ProductoCajaCard[],
  mode: MetricMode,
  getLabel: (c: ProductoCajaCard) => string,
  top = 8,
): StatSlice[] {
  const map = new Map<string, { pares: number; cajas: number; valor: number }>();
  for (const c of cajas) {
    const label = getLabel(c) || "Sin dato";
    const prev = map.get(label) ?? { pares: 0, cajas: 0, valor: 0 };
    prev.pares += c.totalPares;
    prev.cajas += 1;
    prev.valor += valorCaja(c);
    map.set(label, prev);
  }

  const rows = [...map.entries()].map(([label, s]) => ({
    label,
    pares: s.pares,
    cajas: s.cajas,
    valor: s.valor,
    value: mode === "pares" ? s.pares : s.valor,
    pct: 0,
  }));

  rows.sort((a, b) => b.value - a.value);
  const topRows = rows.slice(0, top);
  const otros = rows.slice(top);
  if (otros.length > 0) {
    topRows.push({
      label: "Otros",
      pares: otros.reduce((s, r) => s + r.pares, 0),
      cajas: otros.reduce((s, r) => s + r.cajas, 0),
      valor: otros.reduce((s, r) => s + r.valor, 0),
      value: otros.reduce((s, r) => s + r.value, 0),
      pct: 0,
    });
  }

  const total = topRows.reduce((s, r) => s + r.value, 0);
  for (const r of topRows) {
    r.pct = total > 0 ? Math.round((r.value / total) * 1000) / 10 : 0;
  }
  return topRows;
}

export function totalesVista(cajas: ProductoCajaCard[]) {
  let pares = 0;
  let valor = 0;
  let cajasConPrecio = 0;
  let paresConPrecio = 0;

  for (const c of cajas) {
    pares += c.totalPares;
    const v = valorCaja(c);
    valor += v;
    if (normalizePrecioUnitario(c.precioUnitario) != null) {
      cajasConPrecio += 1;
      paresConPrecio += c.totalPares;
    }
  }

  return { pares, valor, cajasConPrecio, paresConPrecio, cajas: cajas.length };
}

/** Colores fijos para torta (marca / estilo). */
export const CHART_COLORS = [
  "#1e3a8a",
  "#ea580c",
  "#059669",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#ca8a04",
  "#64748b",
  "#94a3b8",
];

export function conicGradientFromSlices(slices: StatSlice[]): string {
  if (slices.length === 0) return "conic-gradient(#e2e8f0 0deg 360deg)";
  let acc = 0;
  const stops: string[] = [];
  for (let i = 0; i < slices.length; i++) {
    const deg = (slices[i].pct / 100) * 360;
    if (deg <= 0) continue;
    const c = CHART_COLORS[i % CHART_COLORS.length];
    stops.push(`${c} ${acc}deg ${acc + deg}deg`);
    acc += deg;
  }
  if (acc < 360) stops.push(`#e2e8f0 ${acc}deg 360deg`);
  return `conic-gradient(${stops.join(", ")})`;
}
