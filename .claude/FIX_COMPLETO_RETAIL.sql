-- ============================================================================
-- FIX COMPLETO: tipo_v2_id + Backfill linea_id/referencia_id
-- ============================================================================
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ============================================================================

-- ============================================================================
-- PARTE 1: Agregar columna tipo_v2_id y llenar con 1 (CALZADO)
-- ============================================================================

ALTER TABLE public.registro_st_vt_rc_reposicion
ADD COLUMN IF NOT EXISTS tipo_v2_id INT;

UPDATE public.registro_st_vt_rc_reposicion
SET tipo_v2_id = 1
WHERE tipo_v2_id IS NULL;

-- ============================================================================
-- PARTE 2: Backfill linea_id y referencia_id (de migración 063)
-- ============================================================================

-- Backfill linea_id desde tabla linea
UPDATE public.registro_st_vt_rc_reposicion r
SET linea_id = l.id
FROM public.linea l
WHERE r.linea_id IS NULL
  AND trim(both from r.linea_codigo_proveedor) ~ '^[0-9]+$'
  AND l.codigo_proveedor::text = trim(r.linea_codigo_proveedor);

-- Backfill referencia_id desde tabla referencia
UPDATE public.registro_st_vt_rc_reposicion r
SET referencia_id = ref.id
FROM public.referencia ref
WHERE r.referencia_id IS NULL
  AND r.linea_id IS NOT NULL
  AND trim(both from r.referencia_codigo_proveedor) ~ '^[0-9]+$'
  AND ref.linea_id = r.linea_id
  AND ref.codigo_proveedor::text = trim(r.referencia_codigo_proveedor);

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

SELECT
  'VERIFICACIÓN COMPLETA:' AS paso,
  COUNT(*) AS total_registros,

  -- tipo_v2_id
  COUNT(*) FILTER (WHERE tipo_v2_id = 1) AS con_tipo_calzado,
  COUNT(*) FILTER (WHERE tipo_v2_id IS NULL) AS tipo_null,

  -- linea_id
  COUNT(*) FILTER (WHERE linea_id IS NOT NULL) AS con_linea_id,
  ROUND(100.0 * COUNT(*) FILTER (WHERE linea_id IS NOT NULL) / COUNT(*), 1) AS pct_linea,

  -- referencia_id
  COUNT(*) FILTER (WHERE referencia_id IS NOT NULL) AS con_referencia_id,
  ROUND(100.0 * COUNT(*) FILTER (WHERE referencia_id IS NOT NULL) / COUNT(*), 1) AS pct_referencia

FROM public.registro_st_vt_rc_reposicion;

-- ============================================================================
-- Resultado esperado:
-- - con_tipo_calzado: igual a total_registros
-- - tipo_null: 0
-- - pct_linea: cerca del 100%
-- - pct_referencia: cerca del 100%
-- ============================================================================
