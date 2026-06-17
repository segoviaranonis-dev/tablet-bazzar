/**
 * Marco Triángulo Header — pilares en lectura (ver TRIANGULO_HEADER_PILARES.md en Nexus_Core/.claude).
 *
 * Prioridad en SQL:
 *   marca/género  ← linea (Administrador /pilares · Líneas)
 *   estilo        ← linea_referencia (Administrador /pilares · L×R)
 *   fallback      ← FK denormalizadas en deposito_tienda_* (sync retail)
 */

/** Fragmento JOIN reutilizable — usar dentro de FROM deposito_tienda_* s */
export const PILAR_TRIANGULO_JOINS = `
    LEFT JOIN public.linea l
      ON l.id = s.linea_id AND COALESCE(l.activo, true) = true
    LEFT JOIN public.referencia ref
      ON ref.id = s.referencia_id
    LEFT JOIN public.linea_referencia lr
      ON lr.linea_id = s.linea_id
      AND lr.referencia_id = s.referencia_id
`;

/** Expresiones COALESCE pilar → staging para SELECT / WHERE de chips */
export const SQL_MARCA_ID = "COALESCE(l.marca_id, s.marca_id)";
export const SQL_GENERO_ID = "COALESCE(l.genero_id, s.genero_id)";
export const SQL_GRUPO_ESTILO_ID = "COALESCE(lr.grupo_estilo_id, s.grupo_estilo_id)";

export const SQL_MARCA_LABEL = `
  COALESCE(
    NULLIF(btrim(mv.descp_marca::text), ''),
    '(sin marca)'
  )`;

export const SQL_GENERO_LABEL = `
  COALESCE(
    NULLIF(btrim(g.descripcion::text), ''),
    '(sin género)'
  )`;

export const SQL_ESTILO_LABEL = `
  COALESCE(
    NULLIF(btrim(ge.descp_grupo_estilo::text), ''),
    '(sin estilo)'
  )`;
