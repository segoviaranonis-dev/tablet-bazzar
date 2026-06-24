import { buildPosCartKey, type PosCartItem } from "@/lib/cart/pos-cart";

export type StagingLineaCart = {
  linea_id: number;
  referencia_id: number;
  material_id: number;
  color_id: number;
  grada: string;
  cantidad: number;
  activo: boolean;
  snapshot_json: Record<string, unknown> | null;
};

export function stagingLineasToCartItems(
  clienteId: number,
  marca: string,
  lineas: StagingLineaCart[],
): PosCartItem[] {
  const out: PosCartItem[] = [];

  for (const linea of lineas) {
    if (!linea.activo || linea.cantidad <= 0) continue;
    const snap = linea.snapshot_json ?? {};
    const input = {
      cliente_id: clienteId,
      marca,
      linea_id: linea.linea_id,
      referencia_id: linea.referencia_id,
      material_id: linea.material_id,
      color_id: linea.color_id,
      linea_codigo: typeof snap.linea_codigo === "string" ? snap.linea_codigo : "?",
      referencia_codigo: typeof snap.referencia_codigo === "string" ? snap.referencia_codigo : "?",
      material_code: typeof snap.material_code === "string" ? snap.material_code : "",
      color_code: typeof snap.color_code === "string" ? snap.color_code : "",
      descp_material: typeof snap.descp_material === "string" ? snap.descp_material : null,
      descp_color: typeof snap.descp_color === "string" ? snap.descp_color : null,
      estilo: typeof snap.estilo === "string" ? snap.estilo : "",
      marca_label: typeof snap.marca_label === "string" ? snap.marca_label : marca,
      grada: linea.grada,
      imagen_url: typeof snap.imagen_url === "string" ? snap.imagen_url : null,
      stock_disponible: Math.max(linea.cantidad, 99),
    };
    out.push({
      ...input,
      key: buildPosCartKey(input),
      cantidad: linea.cantidad,
    });
  }

  return out;
}
