/** Pilar color — Franco Tirador · paridad Report color-canon / color_tono_estandar */

/** proveedor_importacion.id calzado Beira Rio (tipo_v2_id=1). */
export const PROVEEDOR_COLOR_CALZADO = 654;

/** Primer token de col.nombre antes de / - , | (SQL). */
export const SQL_COLOR_PREDOMINANTE = `
  btrim(
    split_part(
      btrim(regexp_replace(COALESCE(col.nombre::text, ''), '[/,\\\-|–]+', ' ', 'g')),
      ' ',
      1
    )
  )
`;

export type TonoEstandarRow = {
  etiqueta: string;
  hex: string;
  orden: number;
  uso_count: number;
};

/** Fallback offline si `color_tono_estandar` no responde. */
export const TONOS_ESTANDAR_FALLBACK: TonoEstandarRow[] = [
  { etiqueta: "Negro", hex: "#1a1a1a", orden: 10, uso_count: 0 },
  { etiqueta: "Blanco", hex: "#f5f5f0", orden: 20, uso_count: 0 },
  { etiqueta: "Gris", hex: "#9e9e9e", orden: 30, uso_count: 0 },
  { etiqueta: "Dorado", hex: "#ffd54f", orden: 40, uso_count: 0 },
  { etiqueta: "Beige", hex: "#e8d5b0", orden: 50, uso_count: 0 },
  { etiqueta: "Marrón", hex: "#6d4c41", orden: 60, uso_count: 0 },
  { etiqueta: "Rojo", hex: "#c62828", orden: 70, uso_count: 0 },
  { etiqueta: "Vino", hex: "#880e4f", orden: 80, uso_count: 0 },
  { etiqueta: "Naranja", hex: "#c2410c", orden: 90, uso_count: 0 },
  { etiqueta: "Verde", hex: "#2e7d32", orden: 100, uso_count: 0 },
  { etiqueta: "Celeste", hex: "#4fc3f7", orden: 110, uso_count: 0 },
  { etiqueta: "Azul", hex: "#1565c0", orden: 120, uso_count: 0 },
  { etiqueta: "Marino", hex: "#1e3a5f", orden: 130, uso_count: 0 },
  { etiqueta: "Rosado", hex: "#f48fb1", orden: 140, uso_count: 0 },
  { etiqueta: "Bronce", hex: "#b87333", orden: 150, uso_count: 0 },
];

/** Vía A — etiqueta canónica (`tono_canon` o inferencia por catálogo). */
export function sqlColorMatchTonoEstandar(tonoParam: number, provParam: number): string {
  const pred = SQL_COLOR_PREDOMINANTE;
  return `(
    lower(btrim(col.tono_canon->>'etiqueta')) = lower(btrim($${tonoParam}::text))
    OR (
      (col.tono_canon IS NULL OR btrim(col.tono_canon->>'etiqueta') = '')
      AND EXISTS (
        SELECT 1
        FROM public.color_tono_estandar t
        WHERE t.proveedor_id = $${provParam}::bigint
          AND t.activo = true
          AND lower(btrim(t.etiqueta)) = lower(btrim($${tonoParam}::text))
          AND (
            lower(${pred}) = lower(t.etiqueta)
            OR EXISTS (
              SELECT 1 FROM LATERAL jsonb_array_elements_text(t.aliases) AS alias(val)
              WHERE lower(${pred}) = lower(alias.val)
                 OR lower(split_part(lower(${pred}), ' ', 1)) = lower(alias.val)
            )
            OR lower(COALESCE(col.nombre::text, '')) LIKE '%' || lower(t.etiqueta) || '%'
            OR EXISTS (
              SELECT 1 FROM LATERAL jsonb_array_elements_text(t.aliases) AS alias(val)
              WHERE lower(COALESCE(col.nombre::text, '')) LIKE '%' || lower(alias.val) || '%'
            )
          )
      )
    )
  )`;
}

/** Vía B — texto Enter (predominante + canónico + aliases). */
export function sqlColorMatchTexto(qParam: number, provParam: number): string {
  const pred = SQL_COLOR_PREDOMINANTE;
  const q = `lower(btrim($${qParam}::text))`;
  return `(
    lower(${pred}) LIKE ${q} || '%'
    OR lower(split_part(lower(${pred}), ' ', 1)) LIKE ${q} || '%'
    OR lower(btrim(col.tono_canon->>'etiqueta')) LIKE ${q} || '%'
    OR lower(COALESCE(col.nombre::text, '')) LIKE '%' || ${q} || '%'
    OR EXISTS (
      SELECT 1
      FROM public.color_tono_estandar t,
           LATERAL jsonb_array_elements_text(t.aliases) AS alias(val)
      WHERE t.proveedor_id = $${provParam}::bigint
        AND t.activo = true
        AND (
          lower(t.etiqueta) LIKE ${q} || '%'
          OR lower(alias.val) LIKE ${q} || '%'
        )
        AND (
          lower(btrim(col.tono_canon->>'etiqueta')) = lower(t.etiqueta)
          OR lower(${pred}) = lower(t.etiqueta)
          OR lower(alias.val) = lower(${pred})
          OR lower(COALESCE(col.nombre::text, '')) LIKE '%' || lower(alias.val) || '%'
          OR lower(COALESCE(col.nombre::text, '')) LIKE '%' || lower(t.etiqueta) || '%'
        )
    )
  )`;
}

export function sqlLoadTonosEstandar(): { text: string; params: unknown[] } {
  return {
    text: `
      SELECT etiqueta, hex, orden, uso_count
      FROM public.color_tono_estandar
      WHERE proveedor_id = $1::bigint AND activo = true
      ORDER BY orden, etiqueta
    `,
    params: [PROVEEDOR_COLOR_CALZADO],
  };
}
