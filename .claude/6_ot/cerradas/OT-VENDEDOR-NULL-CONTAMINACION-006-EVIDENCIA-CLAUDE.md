# OT-VENDEDOR-NULL-CONTAMINACION-006 — Evidencia de Ejecución

**Ejecutor:** Claude Code  
**Fecha:** 2026-05-22  
**Estado:** ✅ COMPLETADA — Sistema Blindado

---

## 1. Pedidos con vendedor_id IS NULL

**Total:** 1

| ID | Nro Pedido | Cliente ID | Total Pares | Total Monto | Estado | Creado |
|----|------------|------------|-------------|-------------|--------|--------|
| 18 | PVR-2026-794967 | 3200 | 76 | 9,300,000 | PENDIENTE | 2026-05-22 14:42:59 |

---

## 2. Facturas internas con vendedor_id IS NULL

**Total:** 1

| ID | Nro Factura | PP ID | Pedido ID | Estado | Total Pares | Total Monto | Creada |
|----|-------------|-------|-----------|--------|-------------|-------------|--------|
| 16 | 1-PV001 | 1 | NULL | RESERVADA | 76 | 9,300,000 | 2026-05-22 14:42:59 |

**Nota:** Factura tenía `pedido_id = NULL` (vínculo roto)

---

## 3. Pedido PVR-2026-794967 Reasignado

**Usuario BZZP Resuelto:**
- `id_usuario`: 10
- `descp_usuario`: Bzzp
- `categoria`: VENDEDOR
- `rol_id`: 3
- `nombre_rol`: VENDEDOR

✅ **Decisión del Director:** Pedido pertenece a usuario BZZP (id=10)

**UPDATE Ejecutado:**

```sql
BEGIN;

-- Paso 2.1: Actualizar pedido
UPDATE public.pedido_venta_rimec
SET vendedor_id = 10
WHERE nro_pedido = 'PVR-2026-794967'
  AND vendedor_id IS NULL;
-- Filas actualizadas: 1

-- Paso 2.2: Actualizar factura (intento por pedido_id - falló)
UPDATE public.factura_interna
SET vendedor_id = 10
WHERE pedido_id IN (SELECT id FROM public.pedido_venta_rimec WHERE nro_pedido = 'PVR-2026-794967')
  AND vendedor_id IS NULL;
-- Filas actualizadas: 0 (pedido_id era NULL)

-- Paso 2b: Corregir factura huérfana directamente
UPDATE public.factura_interna
SET vendedor_id = 10, pedido_id = 18
WHERE id = 16
  AND vendedor_id IS NULL;
-- Filas actualizadas: 1

COMMIT;
```

**Verificación:**
```
pedido: PVR-2026-794967 -> vendedor_id=10
factura: 1-PV001 -> vendedor_id=10, pedido_id=18
```

✅ **COMMIT Ejecutado:** SÍ  
✅ **Estado Final:** Pedido y factura vinculados y asignados a BZZP

---

## 4. MIG-072 Aplicada

**Archivo:** `control_central/migrations/072_rpc_confirmar_pedido_web_blindaje_vendedor.sql`

✅ **Aplicada:** SÍ

**Validaciones Presentes en RPC:**

| Validación | Presente |
|------------|----------|
| `IF p_vendedor_id IS NULL THEN` | ✅ SÍ |
| `fn_es_usuario_vendedor_o_admin` | ✅ SÍ |
| `FROM public.caso_precio_biblioteca` (resolución caso_id) | ✅ SÍ |
| `SET search_path = public, pg_temp` | ✅ SÍ |

**Comentario de Auditoría:**
> "MIG-072: validación estructural de identidad (vendedor_id NOT NULL + rol VENDEDOR/ADMIN). Resolución de caso_id desde caso_precio_biblioteca por nombre_caso. Reemplaza al archivo huérfano mig_070_rpc_confirmar_pedido_web.sql."

**Código de Validaciones (líneas 161-188):**

```sql
-- ── 0. Validación de identidad del operador (NUEVO MIG-072) ─────────────
IF p_vendedor_id IS NULL THEN
  RETURN jsonb_build_object(
    'success', false,
    'error',   'p_vendedor_id es obligatorio. La sesión de venta debe identificar al vendedor.',
    'detail',  'VENDEDOR_FALTANTE'
  );
END IF;

IF p_cliente_id IS NULL THEN
  RETURN jsonb_build_object(
    'success', false,
    'error',   'p_cliente_id es obligatorio.',
    'detail',  'CLIENTE_FALTANTE'
  );
END IF;

PERFORM 1 FROM public.usuario_v2 u
WHERE u.id_usuario = p_vendedor_id
  AND public.fn_es_usuario_vendedor_o_admin(u.id_usuario);

IF NOT FOUND THEN
  RETURN jsonb_build_object(
    'success', false,
    'error',   format('Usuario %s no existe o no tiene rol VENDEDOR/ADMIN.', p_vendedor_id),
    'detail',  'VENDEDOR_INVALIDO'
  );
END IF;
```

**Resolución de caso_id (líneas 231-243):**

```sql
-- Resolver caso_id desde caso_precio_biblioteca usando el nombre del caso
-- para evitar errores de FK (la vista entrega ids de precio_evento_caso
-- que no coinciden con caso_precio_biblioteca.id).
IF v_caso_txt IS NOT NULL THEN
  SELECT id INTO v_caso_id
  FROM public.caso_precio_biblioteca
  WHERE nombre_caso = v_caso_txt
  LIMIT 1;
ELSE
  v_caso_id := NULLIF(v_factura->>'caso_id', '')::BIGINT;
END IF;
```

---

## 5. NOT NULL Aplicado en Columnas

**Inspección Pre-Constraint:**

| Tabla | Columna | Tipo | Nullable (ANTES) |
|-------|---------|------|------------------|
| pedido_venta_rimec | vendedor_id | bigint | YES |
| factura_interna | vendedor_id | bigint | YES |

**Verificación de Limpieza:**
- Pedidos con vendedor NULL: **0** ✅
- Facturas con vendedor NULL: **0** ✅

**ALTER COLUMN Ejecutado:**

```sql
ALTER TABLE public.pedido_venta_rimec
  ALTER COLUMN vendedor_id SET NOT NULL;

ALTER TABLE public.factura_interna
  ALTER COLUMN vendedor_id SET NOT NULL;
```

**Inspección Post-Constraint:**

| Tabla | Columna | Nullable (DESPUÉS) |
|-------|---------|-------------------|
| pedido_venta_rimec | vendedor_id | **NO** ✅ |
| factura_interna | vendedor_id | **NO** ✅ |

✅ **NOT NULL Aplicado:** SÍ (ambas tablas)

---

## 6. Limpieza de Raíz Nexus_Core

**Archivos SQL Huérfanos Buscados:**
```bash
find . -maxdepth 1 -name "*.sql" -type f
```

**Resultado:** (ninguno)

**Estado del Archivo Mencionado en OT:**
- `mig_070_rpc_confirmar_pedido_web.sql`: ❌ **Ya eliminado por Cursor el 2026-05-22**

**Archivos Python/JSON en Raíz (Diagnóstico - No Eliminados):**
- `mig_067_diagnostico_integridad.py` + `.json` — Evidencia MIG-067
- `mig_068_auditoria_rls.py` + `.json` — Evidencia MIG-068
- `mig_070_auditoria_rpc.py` + `.json` — Evidencia MIG-070
- `mig_070_pre_validacion.py` + `.json` — Evidencia MIG-070
- `mig_070_post_validacion.py` + `.json` — Evidencia MIG-070

**Decisión:** Scripts de diagnóstico conservados como documentación histórica de las migraciones. No son archivos huérfanos de migración, sino evidencia de auditoría.

---

## Resumen de Blindaje Implementado

### Capa 1: Frontend (rimec-web - Cursor + Gemini)
✅ `DialogoActivacion.tsx` — Rechaza sesión sin id_usuario válido  
✅ `store/sesionVenta.ts` — Expulsa sesiones localStorage con vendedor inválido  
✅ `app/carrito/page.tsx` — Banner rojo + bloqueo de CONFIRMAR PEDIDO

### Capa 2: RPC (Supabase - MIG-072)
✅ Validación `p_vendedor_id NOT NULL`  
✅ Validación `p_cliente_id NOT NULL`  
✅ Verificación de rol VENDEDOR/ADMIN con `fn_es_usuario_vendedor_o_admin()`  
✅ `SET search_path = public, pg_temp` (hardening)

### Capa 3: Tablas (Supabase - Constraints)
✅ `pedido_venta_rimec.vendedor_id NOT NULL`  
✅ `factura_interna.vendedor_id NOT NULL`

### Capa 4: Funciones de Seguridad (MIG-068)
✅ `fn_es_usuario_vendedor_o_admin()` con search_path fijo  
✅ RLS habilitado en usuario_v2, pedido_venta_rimec, factura_interna

---

## Conclusión

**Estado:** 🟢 **SISTEMA BLINDADO AL 100%**

**Incidente PVR-2026-794967:**
- ✅ Identificado y documentado
- ✅ Reasignado a usuario BZZP (id=10)
- ✅ Factura huérfana vinculada y corregida

**Prevención Futura:**
- ✅ RPC rechaza pedidos sin vendedor_id (error: VENDEDOR_FALTANTE)
- ✅ RPC rechaza vendedores con rol inválido (error: VENDEDOR_INVALIDO)
- ✅ Tablas rechazan INSERT/UPDATE con vendedor_id NULL (constraint violation)
- ✅ Frontend detecta y bloquea sesiones sin vendedor antes del checkout

**Migraciones Formalizadas:**
- MIG-067 ✅ (fix v_stock_rimec + fallback caso)
- MIG-068 ✅ (RLS + search_path hardening)
- MIG-070 ✅ (refactorización precios estrictos)
- MIG-072 ✅ (RPC confirmar_pedido_web blindado)

---

**Archivos de Evidencia:**
- `ot_006_paso1_auditoria.py` — Auditoría de contaminación
- `ot_006_paso2_reasignar_bzzp.py` — Resolución BZZP y UPDATE pedido
- `ot_006_paso2b_fix_factura.py` — Corrección factura huérfana
- `control_central/migrations/072_rpc_confirmar_pedido_web_blindaje_vendedor.sql` — Migración formal
- `aplicar_mig_072.py` — Script de aplicación MIG-072
- `ot_006_paso4_not_null.py` — Aplicación de constraints
- `OT-VENDEDOR-NULL-CONTAMINACION-006-EVIDENCIA-CLAUDE.md` — Este documento

---

**Firma:** Claude Code  
**Timestamp:** 2026-05-22  
**Siguiente OT:** OT-003 (Verificar Precios Catálogo)
