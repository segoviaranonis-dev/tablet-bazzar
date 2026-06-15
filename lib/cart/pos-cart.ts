import type { DepositoFila } from "@/lib/cadena";
import { pickHeroDisplaySrc } from "@/lib/product-image";
import { formatGradaDisplay, gradaSortKey } from "@/lib/stock-otros-locales";

/** 1 línea carrito = 1 molécula + grada (1 par por unidad de cantidad). */
export type PosCartItem = {
  key: string;
  cliente_id: number;
  marca: string;
  linea_id: number;
  referencia_id: number;
  material_id: number;
  color_id: number;
  linea_codigo: string;
  referencia_codigo: string;
  material_code: string;
  color_code: string;
  descp_material: string | null;
  descp_color: string | null;
  estilo: string;
  marca_label: string;
  grada: string;
  imagen_url: string | null;
  stock_disponible: number;
  cantidad: number;
};

export type PosCartItemInput = Omit<PosCartItem, "key" | "cantidad">;

export function buildPosCartKey(
  fk: Pick<
    PosCartItem,
    "cliente_id" | "linea_id" | "referencia_id" | "material_id" | "color_id" | "grada"
  >,
): string {
  return `${fk.cliente_id}-${fk.linea_id}-${fk.referencia_id}-${fk.material_id}-${fk.color_id}-${fk.grada.trim()}`;
}

export function gradaLabelCorta(g: string): string {
  return formatGradaDisplay(g);
}

export function filaToCartInput(
  fila: DepositoFila,
  ctx: { cliente_id: number; marca: string; grada: string; stock: number },
): PosCartItemInput | null {
  if (
    fila.linea_id == null ||
    fila.referencia_id == null ||
    fila.material_id == null ||
    fila.color_id == null
  ) {
    return null;
  }
  const grada = ctx.grada.trim();
  if (!grada || ctx.stock <= 0) return null;

  return {
    cliente_id: ctx.cliente_id,
    marca: ctx.marca,
    linea_id: fila.linea_id,
    referencia_id: fila.referencia_id,
    material_id: fila.material_id,
    color_id: fila.color_id,
    linea_codigo: String(fila.linea_codigo_proveedor).trim(),
    referencia_codigo: String(fila.referencia_codigo_proveedor).trim(),
    material_code: String(fila.material_code).trim(),
    color_code: String(fila.color_code).trim(),
    descp_material: fila.descp_material,
    descp_color: fila.descp_color,
    estilo: fila.estilo ?? "",
    marca_label: fila.marca,
    grada,
    imagen_url: pickHeroDisplaySrc({
      imagen_url_thumb: fila.imagen_url_thumb ?? null,
      imagen_url_flat: fila.imagen_url_flat ?? null,
      imagen_url_hero: fila.imagen_url_hero ?? null,
    }),
    stock_disponible: ctx.stock,
  };
}

export function gradasDesdeStock(
  tallas: string[],
  stock: number[],
): { grada: string; stock: number }[] {
  const out: { grada: string; stock: number }[] = [];
  for (let i = 0; i < tallas.length; i++) {
    const g = tallas[i]?.trim();
    const n = stock[i] ?? 0;
    if (g && n > 0) out.push({ grada: g, stock: n });
  }
  return out.sort((a, b) => {
    const ka = gradaSortKey(a.grada);
    const kb = gradaSortKey(b.grada);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1] - kb[1];
    return ka[2].localeCompare(kb[2], "es");
  });
}
