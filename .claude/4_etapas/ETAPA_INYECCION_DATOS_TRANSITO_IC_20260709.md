# ETAPA ABIERTA — Inyección de datos en tránsito · IC PROGRAMADO

**ID:** `INYECCION-DATOS-TRANSITO-IC-20260709`  
**Código plan:** **2.3.1.7.3.3** · hijo **2.3.1.7.3** Intención de compra  
**Estrategia madre:** **Alejandro Magno** · **2.3.1.12** · Proceso de importación **2.3.1.7**  
**Apertura:** 2026-07-09 (noche) · Director orden **Inicia etapa** + **Documenta**  
**Estado:** ✅ **CERRADA** — ver [ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709_CERRADA.md](./ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709_CERRADA.md)  
**Portal :3004:** tarjeta `INYECCION-DATOS-TRANSITO-IC-20260709` · `hecho`  
**Shibboleth:** Andrés, el que viene.

---

## Norte Director (literal)

> Tenemos **412 intenciones de compra** que cargar. Es un proceso de un **ciclo de importaciones que no tiene fin**. **Nunca** tendremos una menor cantidad de IC que la que tenemos ahora.  
> Por la cantidad, hacemos una **excepción documentada**: mapear un **Excel** con los datos que requiere la IC e **importar intenciones de compra PROGRAMADO** en lote.  
> Nombre de la tapa: **Inyección de datos en tránsito** — patrón aplicable a otras partes del sistema.

---

## Qué es «Inyección de datos en tránsito»

| Concepto | Definición CHUSAR |
|----------|-------------------|
| **Tránsito** | Mercadería/comercial en ciclo importadora **antes** de nacionalización final — IC → Digitación → PP → proforma → FI |
| **Inyección** | Carga **masiva** vía Excel/CSV a tablas operativas — **excepción** al flujo UI formulario-a-formulario |
| **Alcance v1** | IC **`categoria_id = 3` PROGRAMADO** únicamente |
| **Reutilizable** | Mismo patrón puede extenderse a CP, digitación batch, etc. — **solo** con doc CHUSAR + orden Director |

**No confundir con:** import proforma PPD (7.5.3.3) · Retail staging · Motor precios Excel (7.2).

---

## Predecesora cerrada

| Etapa | Resultado |
|-------|-----------|
| [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](./ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md) | ✅ 722 PPD · 39 FI · 8.880 pares · instrumento venta AM validado |

La inyección IC desbloquea el **volumen** (412+) que el formulario `/intencion-compra/nueva` no escala.

---

## Objetivos etapa (orden)

| # | Objetivo | Estado |
|---|----------|--------|
| 1 | Doc CHUSAR mapeo columnas Excel ↔ `intencion_compra` | ✅ |
| 2 | Excel Director adaptado CHUSAR (412 · col F intacta) | ✅ |
| 3 | INSERT lote script emergencia → bandeja PENDIENTE | ✅ **412 IC** |
| 4 | Smoke visual bandeja + autorización Director | ⏳ **mañana** |
| 5 | API/ruta `POST …/intencion-compra/import-batch` | ⏳ |
| 6 | Cierre etapa + navegador | ⏳ post-UI PASS |

---

## Volumen de referencia

| Métrica | Valor Director |
|---------|----------------|
| IC pendientes de carga | **≥ 412** |
| Tendencia | **Monótona creciente** (ciclo sin fin) |
| Caso piloto completado | **39 IC** PP-16 (manual + existentes) |

---

## Rutas Report (plan)

| Código | Ruta | Rol |
|--------|------|-----|
| 2.3.1.7.3.3 | `…/intencion-compra/import-batch` | Hub inyección (nuevo) |
| 2.3.1.7.3.3.1 | Preview Excel | Validación fila a fila |
| 2.3.1.7.3.3.2 | Commit lote | INSERT transaccional |

**Doc canónica:** [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INYECCION_DATOS_TRANSITO_IC.md)

---

## Reglas inviolables

1. **PROGRAMADO** exige `listado_precio_id` ∈ {1,2,3,4} — ver [CHUSAR_IC_PROBLEMA_2_LISTADO_LP.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_IC_PROBLEMA_2_LISTADO_LP.md)  
2. IC = **cabecera financiera** — **prohibido** SKUs, material, color en la inyección  
3. `quincena_arribo_id` obligatorio antes de **AUTORIZAR** — [FECHA_DE_EMBARQUE.md](../2_modulos/2.3_report/proceso_importacion/FECHA_DE_EMBARQUE.md)  
4. SHOP = `id_cliente` (código cliente) — no default 276 «MERCADERIA PARA STOCK» en PROGRAMADO  
5. **Deploy prod** solo cierre etapa u orden directa Director  
6. Aritmética neto/descuentos = motor BD — UI solo captura

---

## Checklist agente (próximo turno)

| # | Paso |
|---|------|
| 1 | Recibir Excel muestra Director (412 filas o extracto) |
| 2 | Validar columnas vs matriz CHUSAR 7.3.3 |
| 3 | Implementar preview + reporte errores por fila |
| 4 | Bulk INSERT con `numero_registro` automático IC-YYYY-XXXX |
| 5 | Documentar evidencia PASS en este archivo |

---

## Docs vinculados

| Doc | Ruta |
|-----|------|
| CHUSAR inyección | [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INYECCION_DATOS_TRANSITO_IC.md) |
| IC general | [CHUSAR_INTENCION_COMPRA.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INTENCION_COMPRA.md) |
| Alejandro Magno | [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) |
| Doc ejecución | [CHUSAR_INYECCION_IC_EJECUCION_20260709.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INYECCION_IC_EJECUCION_20260709.md) |
| Handoff mañana | [CHUSAR_PENDIENTE_MANANA_20260710.md](./CHUSAR_PENDIENTE_MANANA_20260710.md) |
