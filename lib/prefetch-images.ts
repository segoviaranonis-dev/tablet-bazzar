import type { DepositoFila } from "./cadena";
import { productImageCandidatesForRow } from "./product-image";

const prefetched = new Set<string>();

export function prefetchImageUrl(url: string): void {
  if (!url || prefetched.has(url)) return;
  prefetched.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

export function prefetchRowThumb(row: {
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
  material_code: string;
  color_code: string;
  imagen_nombre?: string | null;
}): void {
  const urls = productImageCandidatesForRow(
    row.linea_codigo_proveedor,
    row.referencia_codigo_proveedor,
    row.material_code,
    row.color_code,
    row.imagen_nombre,
    true,
  );
  for (const u of urls.slice(0, 2)) prefetchImageUrl(u);
}
