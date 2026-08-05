import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";

export type EstiloEnMarca = {
  estilo: string;
  totalPares: number;
};

export type MarcaDrill = {
  marca: string;
  totalPares: number;
  estilos: EstiloEnMarca[];
};

function estiloLabel(c: ProductoCajaCard): string {
  return c.estilo?.trim() || c.producto.estilo?.trim() || "Sin estilo";
}

function tonoLabel(c: ProductoCajaCard): string {
  const t = c.producto.tono_etiqueta?.trim();
  if (t) return t;
  const d = c.producto.descp_color?.trim();
  if (d) return d;
  return "Sin tono";
}

export { tonoLabel as tonoLabelCaja };

/** Marca → estilo (pares) desde cajas filtradas. */
export function buildMarcaEstiloDrill(cajas: ProductoCajaCard[]): MarcaDrill[] {
  const marcas = new Map<string, Map<string, number>>();

  for (const c of cajas) {
    const marca = c.producto.marca?.trim() || "Sin marca";
    const est = estiloLabel(c);
    let estMap = marcas.get(marca);
    if (!estMap) {
      estMap = new Map();
      marcas.set(marca, estMap);
    }
    estMap.set(est, (estMap.get(est) ?? 0) + c.totalPares);
  }

  return [...marcas.entries()]
    .map(([marca, estMap]) => {
      const estilos = [...estMap.entries()]
        .map(([estilo, totalPares]) => ({ estilo, totalPares }))
        .sort((a, b) => b.totalPares - a.totalPares);
      const totalPares = estilos.reduce((s, e) => s + e.totalPares, 0);
      return { marca, totalPares, estilos };
    })
    .sort((a, b) => b.totalPares - a.totalPares);
}
