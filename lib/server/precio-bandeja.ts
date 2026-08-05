import { normalizePrecioUnitario } from "@/lib/precio-venta";
import type { ConfirmarTicketsInput } from "@/lib/server/tickets-confirm";

type Molecula = {
  linea_id: number;
  referencia_id: number;
  material_id: number;
  color_id: number;
  grada: string;
};

/** Precio por par: carrito → snapshot → fila depósito. */
export async function resolvePrecioUnitarioPar(
  client: { query: (text: string, params?: unknown[]) => Promise<unknown> },
  tablaDeposito: string,
  item: Pick<ConfirmarTicketsInput["items"][number], "precio_unitario"> & Molecula,
): Promise<number | null> {
  const fromItem = normalizePrecioUnitario(item.precio_unitario);
  if (fromItem != null) return fromItem;

  const r = (await client.query(
    `
      SELECT NULLIF(precio_unitario, 0)::float8 AS p
      FROM public.${tablaDeposito}
      WHERE linea_id = $1 AND referencia_id = $2 AND material_id = $3 AND color_id = $4
        AND btrim(grada::text) = $5
      ORDER BY id
      LIMIT 1
    `,
    [item.linea_id, item.referencia_id, item.material_id, item.color_id, item.grada.trim()],
  )) as { rows: { p?: number | null }[] };
  return normalizePrecioUnitario(r.rows[0]?.p);
}
