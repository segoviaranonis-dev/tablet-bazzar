# MAPA — Bandeja Intención de compra (Streamlit → Report)

**Origen:** `control_central/modules/intencion_compra/ui.py` · vista `dashboard`  
**Report:** `/proceso-importacion/intencion-compra/bandeja` · `IntencionCompraBandejaClient`  
**CHUSAR:** [CHUSAR_INTENCION_COMPRA.md](./CHUSAR_INTENCION_COMPRA.md)  
**App doc:** [INTENCION_COMPRA_REPORT.md](../../../../report/docs/INTENCION_COMPRA_REPORT.md)

---

## Tabs bandeja

| Tab | Streamlit key | Query / regla | Report API |
|-----|---------------|---------------|------------|
| **PENDIENTES** | tab 0 | `estado = PENDIENTE_OPERATIVO` · **orden `numero_registro ASC`** (lote Excel invertido) | GET `/pendientes` |
| **DEVUELTAS** | tab devueltas | `estado = DEVUELTO_ADMIN` | GET `/devueltas` |
| **HISTORIAL** | tab historial | todos los estados | GET `/bandeja` |

---

## Columnas fila IC (PENDIENTES / HISTORIAL)

| Columna UI | Campo BD | Editable inline |
|------------|----------|-----------------|
| Nro. IC | `numero_registro` | No |
| Marca | `marca_id` → `marca_v2` | Sí (select) |
| Categoría | `categoria_id` | Sí |
| **FECHA DE EMBARQUE** | `quincena_arribo_id` | Sí (1–24) |
| Pares | `pares_comprometidos` | Sí |
| Evento precio | `precio_evento_id` | Sí (cerrados) |
| Estado | `estado` | No (badges) |

PATCH: `POST /api/.../intencion-compra/[id]/campo`

---

## Acciones por fila

| Botón | Estado requerido | API | Efecto |
|-------|------------------|-----|--------|
| **Autorizar** | `PENDIENTE_OPERATIVO` + quincena ≥1 | POST `…/autorizar` | → `AUTORIZADO` |
| **Anular** | no DIGITADO | POST `…/anular` | → `ANULADO` |
| **Reautorizar** | DEVUELTAS | POST `…/reautorizar` | → `AUTORIZADO` |

Validación autorizar: `quincena_arribo_id` obligatorio ([FECHA_DE_EMBARQUE.md](./FECHA_DE_EMBARQUE.md)).

**Orden PENDIENTES (2026-07-09):** `ORDER BY numero_registro ASC` — import batch invierte filas Excel vía numeración IC; **no** ordenar por quincena primero (bug `4.02.03.007` ✅).

---

## Handoff Digitación

IC `AUTORIZADO` sin fila en `intencion_compra_pedido` → tab **PENDIENTES** Digitación.

---

## Nueva IC (fuera bandeja)

Ruta: `…/intencion-compra/nueva`  
Flujo: Paso A (tipo+categoría) → formulario completo → POST `/api/.../intencion-compra`

---

**Shibboleth:** Chayanne el mejor
