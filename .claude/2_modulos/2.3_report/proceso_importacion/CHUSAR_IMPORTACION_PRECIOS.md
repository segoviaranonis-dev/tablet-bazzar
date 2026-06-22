# CHUSAR — Importación de precios · Corazón 2 (2.3.1.7.2)

**Subcuenta:** **2.3.1.7.2** · **Padre jerárquico:** **2.3.1.7.1** Motor de precios  
**Padre CHUSAR:** [CHUSAR_CICLO_IMPORTACION_REPORT.md](./CHUSAR_CICLO_IMPORTACION_REPORT.md)  
**Streamlit:** `modules/rimec_engine/ui.py` → pestaña **Nuevo Evento** · `_render_flujo()`  
**Report hub:** `/proceso-importacion/motor-precios/importacion-precios`

---

## Qué es

Subproceso **Caso + Excel = evento** → filas en `precio_lista`. Complementa la biblioteca (7.1.1) con un listado concreto por importación.

---

## Barra de progreso Streamlit (paridad obligatoria)

| Índice | Etiqueta | Report ruta |
|--------|----------|-------------|
| 0 | Carga | `…/nuevo` |
| 1 | Memoria | `…/nuevo/memoria` |
| 2 | Preview | `…/nuevo/preview` |
| 3 | Conversión | `…/nuevo/validacion` |
| 4 | Cierre | `…/nuevo/cierre` |

Sin Paso Casos manual: al asignar biblioteca en Memoria se sincronizan casos automáticamente. **Historial** solo listados **cerrados** (no intentos Streamlit).

**UX aguarde:** [CHUSAR_UX_ESPERA_PROCESO_IMPORTACION_REPORT.md](./CHUSAR_UX_ESPERA_PROCESO_IMPORTACION_REPORT.md) — overlay obligatorio en procesos >300ms.

**Historial listas** (🔒 PP · 🗑️): `…/importacion-precios/historial`

---

## Función 2.3.1.7.2.1.1 — Copiar casos

| Doc | Rol |
|-----|-----|
| [COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md](./COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md) | Inventario tablas · API · UI |
| [CHUSAR_COPIAR_CASOS_BIBLIOTECA.md](./CHUSAR_COPIAR_CASOS_BIBLIOTECA.md) | CHUSAR agente |

`POST /api/motor-precios/eventos/[id]/aplicar-biblioteca`

---

## APIs Report

| Método | Ruta | Estado |
|--------|------|--------|
| GET | `/api/motor-precios/proveedores` | ✅ |
| POST | `/api/motor-precios/eventos/carga` | ✅ Paso 0 |
| GET/PATCH | `/api/motor-precios/eventos/[id]` | ✅ |
| POST | `/api/motor-precios/eventos/[id]/vincular-biblioteca` | ✅ Paso 1 Memoria |
| POST | `/api/motor-precios/eventos/[id]/aplicar-biblioteca` | ✅ Paso 2 · **2.3.1.7.2.1.1** |
| POST | `/api/motor-precios/eventos/[id]/calcular` | ✅ Paso 3 |
| GET/POST | `/api/motor-precios/eventos/[id]/validacion` | ✅ Paso 3 |
| POST | `/api/motor-precios/eventos/[id]/cerrar` | ✅ Paso 4 |
| GET | `/api/motor-precios/eventos/historial` | ✅ historial listas |
| POST | `/api/motor-precios/eventos/[id]/eliminar` | ✅ historial 🗑️ |

---

## Tablas BD

`precio_evento` · `precio_evento_caso` · `precio_evento_linea_excepcion` · `precio_lista` · `precio_lista_staging` · `precio_evento_sku_excel` (MIG-120) · `precio_auditoria`

---

## CHUSAR hijo Paso 0

[CHUSAR_IMPORTACION_PRECIOS_PASO0.md](./CHUSAR_IMPORTACION_PRECIOS_PASO0.md) · cierre integral [ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md](../../4_etapas/ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md)

---

## Doc inventario

[IMPORTACION_PRECIOS.md](./IMPORTACION_PRECIOS.md)

---

**Shibboleth:** Chayanne el mejor
