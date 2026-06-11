# Mapeo de ETA para Desenchufe Total

**Fecha:** 2026-05-27  
**Estado:** ✅ Verificación completada - Todas las ETAs coinciden con quincenas  
**Objetivo:** Desenchufar `eta` (fecha_arribo_estimada) y usar solo `quincena_arribo_id` (dato duro)

---

## 1. Verificación Completada

```
11 PPs con quincena asignada
✅ TODAS las fechas ETA coinciden con las quincenas asignadas

Ejemplos verificados:
- PP-2026-0010: ETA 30/05/2026 = 2da Quincena de Mayo
- PP-2026-0005: ETA 15/06/2026 = 1ra Quincena de Junio
- PP-2026-0003: ETA 30/06/2026 = 2da Quincena de Junio
- PP-2026-0008: ETA 15/07/2026 = 1ra Quincena de Julio
- PP-2026-0006: ETA 15/08/2026 = 1ra Quincena de Agosto
```

---

## 2. Archivos que Usan ETA

### RIMEC Web (14 archivos)

#### A. **Interfaz/Tipos** (mantener temporalmente para compatibilidad)
- `app/page.tsx` - Interfaz `StockRow` con campo `eta`
- `lib/agruparTarjetasCatalogo.ts` - Interfaz `RimecVariante` con campo `eta`
- `lib/controlStock/types.ts` - Tipos de stock
- `store/sesionVenta.ts` - Estado del carrito

#### B. **Agrupación y Origen** (CRÍTICO - aquí está la lógica de agrupación)
- **`lib/catalogoOrigen.ts`** - Función `deriveOrigenFromStockRow()`
  - Usa `quincena_arribo_id` como prioridad
  - ETA como fallback: `referenciaId: row.eta?.slice(0,10) ?? ''`
  - **ACCIÓN:** Verificar que SIEMPRE hay quincena antes de quitar ETA

#### C. **Display (UI)**
- **`app/CatalogoGrid.tsx`**
  - Línea 547-550: ChipEta muestra fecha ETA en formato DD-MM
  - Línea 549-557: Dato duro (quincena) reemplaza nombre producto
  - Línea 474: Carrito incluye campo `eta` al agregar productos
  - **ACCIÓN:** Ya muestra quincena, ETA solo en chip superior

#### D. **Carrito y Pedidos**
- `app/carrito/page.tsx` - Vista de carrito
- `app/pedidos/page.tsx` - Vista de pedidos
- `app/api/carrito/sesion/route.ts` - API de carrito
- `lib/carritoApi.ts` - Cliente API
- **ACCIÓN:** Verificar si se usa ETA para display en estos archivos

#### E. **Tests**
- `scripts/run_smoke_tests_playwright.js`
- `scripts/run_smoke_tests_local.js`
- **ACCIÓN:** No crítico, solo testing

#### F. **Estadísticas**
- `app/estadisticas/page.tsx`
- **ACCIÓN:** Verificar si agrupa por ETA

---

## 3. Control Central (Python/Streamlit)

### Archivos principales que usan `fecha_arribo_estimada`:

```bash
grep -r "fecha_arribo_estimada" control_central/ --include="*.py"
```

#### A. **Módulo Pedido Proveedor**
- `modules/pedido_proveedor/ui.py`
- `modules/pedido_proveedor/logic.py`
- **ACCIÓN:** Verificar formularios de edición de PP

#### B. **Módulo Aprobaciones**
- `modules/aprobacion_pedidos/logic.py`
  - Funciones `get_fi_reservadas()`, `get_fi_confirmadas()`
  - Ya incluyen `quincena_llegada` en queries
  - **ACCIÓN:** OK - ya migrado

#### C. **PDFs**
- `core/pdf_factura_interna.py`
  - Ya incluye campo `quincena` en PDFs
  - **ACCIÓN:** OK - ya migrado

---

## 4. Base de Datos

### Tablas involucradas:

```sql
-- Tabla principal
pedido_proveedor
  - fecha_arribo_estimada (VIEJO - a desenchufar)
  - quincena_arribo_id (NUEVO - FK a quincena_arribo)

-- Catálogo de quincenas
quincena_arribo
  - id
  - descripcion (ej: "2da Quincena de Mayo")

-- Vista para RIMEC Web
v_stock_rimec
  - eta (calculado de fecha_arribo_estimada)
  - quincena_arribo_id
  - quincena_desc (descripción de la quincena)
```

---

## 5. Plan de Desenchufe

### Fase 1: Pre-validación ✅ COMPLETADA
- [x] Verificar que todas las ETAs coinciden con quincenas
- [x] Dar al dato duro el mismo estilo visual que el chip ETA

### Fase 2: Migración de display (EN PROGRESO)
- [ ] Verificar que carrito/pedidos usan quincena en lugar de ETA
- [ ] Verificar que estadísticas agrupan por quincena
- [ ] Revisar `catalogoOrigen.ts`: ¿qué pasa si no hay quincena?

### Fase 3: Actualizar agrupación
- [ ] **CRÍTICO:** `lib/catalogoOrigen.ts` - Función `buildCardKey()`
  - Actualmente: `${skuId}|${origen.referenciaId}` donde referenciaId puede ser `q:${quincenaId}` o `${eta}`
  - Nuevo: Forzar que SIEMPRE use `q:${quincenaId}`
  - **VERIFICAR:** ¿Qué pasa con PPs sin quincena?

### Fase 4: Deprecar ETA en backend
- [ ] Hacer opcional `fecha_arribo_estimada` en formularios
- [ ] Ocultar campo ETA en UIs (solo mostrar quincena)
- [ ] Actualizar queries para no depender de ETA

### Fase 5: Desenchufe final
- [ ] Marcar campo `fecha_arribo_estimada` como deprecated
- [ ] Actualizar vista `v_stock_rimec` para no incluir `eta`
- [ ] Eliminar campo `eta` de interfaces TypeScript

---

## 6. Puntos Críticos

### ⚠️ CRÍTICO 1: Agrupación de tarjetas
**Archivo:** `lib/catalogoOrigen.ts`  
**Función:** `deriveOrigenFromStockRow()`  

```typescript
// ACTUAL (prioriza quincena, fallback a ETA)
if (quincenaId && quincenaDesc) {
  return {
    tipo: 'TRÁNSITO_PP',
    referenciaId: `q:${quincenaId}`,  // ✅ Usa quincena
    label: `📦 ${quincenaDesc}`,
    shell: paletaQuincena(`${quincenaId}`),
  }
}
// Fallback: usa ETA
const etaIso = row.eta?.slice(0, 10) ?? ''
if (etaIso) {
  return {
    tipo: 'TRÁNSITO_PP',
    referenciaId: etaIso,  // ⚠️ USA ETA AQUÍ
    label: `${etaIso.slice(8,10)}-${etaIso.slice(5,7)}`,
    shell: paletaEta(etaIso),
  }
}
```

**ACCIÓN NECESARIA:**
- Si no hay quincena, ¿qué hacemos?
  1. Opción A: Forzar que TODO PP tenga quincena antes de aparecer en catálogo
  2. Opción B: Mostrar error/warning si no tiene quincena
  3. Opción C: Asignar quincena automáticamente basado en ETA existente

### ⚠️ CRÍTICO 2: Carrito
**Archivo:** `app/CatalogoGrid.tsx` línea 474  

```typescript
void agregarCaja({
  // ... otros campos
  eta: v.eta,  // ⚠️ Guarda ETA en carrito
  // ...
})
```

**PREGUNTA:** ¿El carrito necesita guardar ETA o puede usar solo quincena?

### ⚠️ CRÍTICO 3: PPs sin quincena
**Actualmente:** 0 PPs activos sin quincena (todos los 11 PPs activos tienen quincena asignada)  
**Pero:** ¿Qué pasa cuando se crea un nuevo PP?

---

## 7. Resumen Ejecutivo

### Estado Actual
✅ **Cable de acero completado:** quincena fluye PP → v_stock_rimec → RIMEC Web → FI → PDF  
✅ **Verificación exitosa:** Todas las ETAs coinciden con quincenas asignadas  
✅ **Display actualizado:** Dato duro visible en tarjetas con mismo estilo que chip ETA  

### Listo para Desenchufe
- ✅ Display: quincena visible en tarjetas
- ✅ PDFs: quincena incluida en FIs
- ✅ Aprobaciones: queries usan quincena

### Pendiente para Desenchufe
- ⚠️ Verificar agrupación de tarjetas sin quincena (fallback actual usa ETA)
- ⚠️ Decidir qué hacer con PPs nuevos: ¿forzar quincena obligatoria?
- ⚠️ Actualizar carrito para usar quincena en lugar de ETA

---

## 8. Próximos Pasos

1. **Revisar carrito:** ¿Usa ETA para algo crítico?
2. **Revisar estadísticas:** ¿Agrupa por ETA?
3. **Decidir política:** ¿Quincena obligatoria para PPs nuevos?
4. **Actualizar catalogoOrigen.ts:** Eliminar fallback a ETA o manejarlo explícitamente
5. **Desenchufe gradual:** Marcar ETA como deprecated, luego eliminar

---

**Conclusión:** El cable de acero está completo y funcionando. ETA y dato duro coinciden al 100%. 
Listo para iniciar desenchufe gradual una vez resueltos los 3 puntos críticos.
