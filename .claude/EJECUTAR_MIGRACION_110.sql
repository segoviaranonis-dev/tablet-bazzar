-- ============================================================================
-- MIGRACIÓN 110: Agregar columna tipo_v2_id
-- ============================================================================
-- INSTRUCCIONES:
-- 1. Copiar todo este SQL
-- 2. Ir a Supabase Dashboard → SQL Editor
-- 3. Pegar y ejecutar
-- ============================================================================

-- Paso 1: Agregar columna tipo_v2_id
ALTER TABLE public.registro_st_vt_rc_reposicion
ADD COLUMN IF NOT EXISTS tipo_v2_id INT;

-- Paso 2: Actualizar TODOS los registros existentes a tipo_v2_id = 1 (CALZADO)
UPDATE public.registro_st_vt_rc_reposicion
SET tipo_v2_id = 1
WHERE tipo_v2_id IS NULL;

-- Paso 3: Verificar
SELECT
  COUNT(*) AS total_registros,
  COUNT(*) FILTER (WHERE tipo_v2_id = 1) AS con_tipo_calzado,
  COUNT(*) FILTER (WHERE tipo_v2_id IS NULL) AS con_tipo_null
FROM public.registro_st_vt_rc_reposicion;

-- ============================================================================
-- Resultado esperado:
-- - total_registros: (cantidad actual en tu DB)
-- - con_tipo_calzado: (misma cantidad - todos son calzados)
-- - con_tipo_null: 0
-- ============================================================================
