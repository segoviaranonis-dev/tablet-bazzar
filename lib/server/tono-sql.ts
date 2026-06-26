import type { Pool } from "pg";
import { PROVEEDOR_CALZADO_ID } from "@/lib/tono/color-canon";
import {
  COLORES_ESTANDAR_DEFAULT,
  OTROS_MULTICOLOR_SWATCHES,
  type ColorEstandar,
} from "@/lib/tono/colores-estandar";

export async function loadTonoEstandar(pool: Pool, proveedorId = PROVEEDOR_CALZADO_ID): Promise<ColorEstandar[]> {
  try {
    await ensureTonoEstandarCatalog(pool, proveedorId);
    const { rows } = await pool.query<{
      etiqueta: string;
      hex: string;
      aliases: unknown;
      orden: number;
    }>(
      `
      SELECT etiqueta, hex, aliases, orden
      FROM public.color_tono_estandar
      WHERE proveedor_id = $1 AND activo = true
      ORDER BY orden ASC, etiqueta ASC
      `,
      [proveedorId],
    );
    if (rows.length === 0) return COLORES_ESTANDAR_DEFAULT;
    return rows.map((r) => ({
      etiqueta: r.etiqueta,
      hex: r.hex,
      aliases: Array.isArray(r.aliases) ? r.aliases.map(String) : [],
      orden: r.orden,
      multicolor: r.etiqueta === "Otros",
      swatches: r.etiqueta === "Otros" ? OTROS_MULTICOLOR_SWATCHES : undefined,
    }));
  } catch {
    return COLORES_ESTANDAR_DEFAULT;
  }
}

export async function patchTonoColor(
  pool: Pool,
  proveedorId: number,
  colorId: number,
  tonoCanon: Record<string, unknown> | null,
): Promise<boolean> {
  const res = await pool.query(
    `UPDATE color SET tono_canon = $3::jsonb WHERE id = $1 AND proveedor_id = $2`,
    [colorId, proveedorId, tonoCanon ? JSON.stringify(tonoCanon) : null],
  );
  return (res.rowCount ?? 0) > 0;
}

export async function patchTonoByPredominante(
  pool: Pool,
  proveedorId: number,
  predominante: string,
  tonoCanon: Record<string, unknown> | null,
): Promise<number> {
  const { colorPredominante } = await import("@/lib/tono/color-canon");
  const target = predominante.trim().toLowerCase();
  if (!target) return 0;

  const { rows } = await pool.query<{ id: number; nombre: string | null }>(
    `SELECT id, nombre FROM color WHERE proveedor_id = $1 AND activo = true`,
    [proveedorId],
  );

  const ids = rows
    .filter((r) => colorPredominante(r.nombre).trim().toLowerCase() === target)
    .map((r) => r.id);
  if (!ids.length) return 0;

  const res = await pool.query(
    `UPDATE color SET tono_canon = $1::jsonb WHERE proveedor_id = $2 AND id = ANY($3::int[])`,
    [tonoCanon ? JSON.stringify(tonoCanon) : null, proveedorId, ids],
  );
  return res.rowCount ?? 0;
}

/** Alta idempotente de tonos del catálogo canónico (ej. Fucsia nuevo). */
export async function ensureTonoEstandarCatalog(pool: Pool, proveedorId: number): Promise<void> {
  for (let i = 0; i < COLORES_ESTANDAR_DEFAULT.length; i++) {
    const c = COLORES_ESTANDAR_DEFAULT[i]!;
    await pool.query(
      `
      INSERT INTO public.color_tono_estandar (proveedor_id, etiqueta, hex, aliases, orden)
      VALUES ($1, $2, $3, $4::jsonb, $5)
      ON CONFLICT (proveedor_id, etiqueta) DO NOTHING
      `,
      [proveedorId, c.etiqueta, c.hex, JSON.stringify(c.aliases), (i + 1) * 10],
    );
  }
}
