import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";

export type TallaPares = {
  talla: string;
  pares: number;
};

export type TonoDrill = {
  tono: string;
  totalPares: number;
  tallas: TallaPares[];
};

export type EstiloDrill = {
  estilo: string;
  totalPares: number;
  tonos: TonoDrill[];
};

function tonoLabel(c: ProductoCajaCard): string {
  const t = c.producto.tono_etiqueta?.trim();
  if (t) return t;
  const d = c.producto.descp_color?.trim();
  if (d) return d;
  return "Sin tono";
}

function estiloLabel(c: ProductoCajaCard): string {
  return c.estilo?.trim() || c.producto.estilo?.trim() || "Sin estilo";
}

/** Estilo → tono → talla (pares) desde cajas filtradas. */
export function buildEstiloTonoDrill(cajas: ProductoCajaCard[]): EstiloDrill[] {
  type TonoMap = Map<string, Map<string, number>>;
  const estilos = new Map<string, { tonos: TonoMap; total: number }>();

  for (const c of cajas) {
    const est = estiloLabel(c);
    const ton = tonoLabel(c);
    let e = estilos.get(est);
    if (!e) {
      e = { tonos: new Map(), total: 0 };
      estilos.set(est, e);
    }
    e.total += c.totalPares;

    let tMap = e.tonos.get(ton);
    if (!tMap) {
      tMap = new Map();
      e.tonos.set(ton, tMap);
    }
    for (let i = 0; i < c.tallas.length; i++) {
      const talla = c.tallas[i]!;
      const p = c.stock[i] ?? 0;
      if (p <= 0) continue;
      tMap.set(talla, (tMap.get(talla) ?? 0) + p);
    }
  }

  const sortTallas = (a: TallaPares, b: TallaPares) => {
    const na = Number(a.talla);
    const nb = Number(b.talla);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
    return a.talla.localeCompare(b.talla, "es");
  };

  return [...estilos.entries()]
    .map(([estilo, data]) => {
      const tonos: TonoDrill[] = [...data.tonos.entries()]
        .map(([tono, tallaMap]) => {
          const tallas = [...tallaMap.entries()]
            .map(([talla, pares]) => ({ talla, pares }))
            .sort(sortTallas);
          const totalPares = tallas.reduce((s, t) => s + t.pares, 0);
          return { tono, totalPares, tallas };
        })
        .sort((a, b) => b.totalPares - a.totalPares);
      return { estilo, totalPares: data.total, tonos };
    })
    .sort((a, b) => b.totalPares - a.totalPares);
}
