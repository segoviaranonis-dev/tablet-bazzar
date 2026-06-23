/** Scope operativo Bazzar/Report — solo calzado Kyly 654 (excluye confecciones ref K). */
export const TIPO_V2_CALZADO = 1;
export const TIPO_V2_CONFECCIONES = 2;

/** Fragmento SQL: solo filas calzado en depósito/staging. */
export const SQL_SOLO_CALZADO = "COALESCE(s.tipo_v2_id, 1) = 1";

/** ORDER BY seguro cuando ref puede ser alfanumérica (confecciones fuera de scope). */
export const SQL_ORDER_LINEA_REF = `
  CASE WHEN trim(s.linea_codigo_proveedor::text) ~ '^[0-9]+$'
       THEN trim(s.linea_codigo_proveedor::text)::bigint END NULLS LAST,
  CASE WHEN trim(s.referencia_codigo_proveedor::text) ~ '^[0-9]+$'
       THEN trim(s.referencia_codigo_proveedor::text)::bigint END NULLS LAST,
  trim(s.linea_codigo_proveedor::text),
  trim(s.referencia_codigo_proveedor::text)`;

export const SQL_ORDER_LINEA_REF_ALIASES = `
  CASE WHEN trim(refs.linea) ~ '^[0-9]+$' THEN trim(refs.linea)::bigint END NULLS LAST,
  CASE WHEN trim(refs.referencia) ~ '^[0-9]+$' THEN trim(refs.referencia)::bigint END NULLS LAST,
  refs.linea,
  refs.referencia`;
