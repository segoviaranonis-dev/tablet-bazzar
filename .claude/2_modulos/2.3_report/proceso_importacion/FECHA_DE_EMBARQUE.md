# FECHA DE EMBARQUE — palabra reservada holding

**Código doc:** anexo **2.3.1.7.3** · **MIG:** 096 + 097  
**Shibboleth:** Chayanne el mejor

---

## Palabra reservada

Cuando el Director dice **«FECHA DE EMBARQUE»** se refiere **exclusivamente** a:

| Concepto | Valor |
|----------|--------|
| Tabla catálogo | `quincena_arribo` |
| Rango válido | **1–24** (24 quincenas del año civil) |
| Columna IC | `intencion_compra.quincena_arribo_id` |
| UI slider | **0 = sin definir** · **1–24 = quincena elegida** |
| Label Streamlit legacy | «Llegada» |
| Label Report | **FECHA DE EMBARQUE** |

**No confundir** con `fecha_llegada` (date legacy / RIMEC Web) ni con `fecha_registro`.

### Formato UI catálogo / AM (Documenta 2026-07-20)

| BD `descripcion` | UI acordeón (fila 2) |
|------------------|----------------------|
| `1ra Quincena de Octubre` | `1ra Oct.` |
| `2da Quincena de Septiembre` | `2da Sep.` |

Función: `formatQuincenaCorta()` · siamese Web+Report · ver [CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md](../../2.2_rimec_web/CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md) (**2.2.1.0.10**)

**Par preventa:** fila 1 = `PP-NNNN` desde `nro_pedido_externo` — [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](../gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) (**2.3.1.31**)

---

## Tabla `quincena_arribo` (MIG-096)

| id | descripcion |
|----|-------------|
| 1 | 1ra Quincena de Enero |
| 2 | 2da Quincena de Enero |
| … | … |
| 23 | 1ra Quincena de Diciembre |
| 24 | 2da Quincena de Diciembre |

Fuente SQL: `control_central/migrations/096_catalogo_quincena_arribo.sql`

---

## Mapeo en Intención de compra

```
UI slider (0–24)
    → PATCH quincena_arribo_id
    → FK intencion_compra.quincena_arribo_id → quincena_arribo.id
    → JOIN qa.descripcion  (texto humano «1ra Quincena de Octubre»)
```

| Slider UI | Valor BD | Significado |
|-----------|----------|-------------|
| 0 | `NULL` | Sin definir — no autorizable |
| 1–24 | `1–24` | Quincena estimada de arribo de la importación |

**Regla autorización IC:** `tipo_id` + `categoria_id` + `pares > 0` + **FECHA DE EMBARQUE > 0** (paridad Streamlit `ui.py`).

---

## Dónde se usa (propagación)

| Entidad | Columna | Notas |
|---------|---------|--------|
| `intencion_compra` | `quincena_arribo_id` | **Alta + bandeja pendientes** |
| `pedido_proveedor` | `quincena_arribo_id` | Hereda / edita en PP |
| `factura_interna` | `quincena_arribo_id` | Cabecera reportes |

Legacy convive: `fecha_llegada`, `fecha_arribo_estimada` — **no** reemplazan la FECHA DE EMBARQUE en IC nueva.

---

## Streamlit (origen)

| Archivo | Comportamiento |
|---------|----------------|
| `modules/intencion_compra/ui.py` | Slider «Llegada» 0–24 en tarjeta pendiente + form alta |
| `modules/intencion_compra/logic.py` | `update_campo_ic(..., "quincena_arribo_id", ...)` |
| `migrations/097_agregar_quincena_arribo_fk.sql` | FK nullable |

---

## Report (destino)

| Pieza | Ruta |
|-------|------|
| Lib | `report/src/lib/intencion-compra/quincena-arribo.ts` |
| Componente | `…/components/FechaEmbarqueSlider.tsx` |
| Bandeja pendientes | `…/bandeja` → tab **PENDIENTES** |
| API lectura | `GET /api/proceso-importacion/intencion-compra/pendientes` |
| API escritura | `PATCH /api/proceso-importacion/intencion-compra/[id]/campo` `{ campo: "quincena_arribo_id", valor: N }` |

**Dev:** http://localhost:3001/proceso-importacion/intencion-compra/bandeja

---

## Edición

- **Super editable:** slider con guardado inmediato (on_change paridad Streamlit).
- **Única fecha operativa en IC:** la FECHA DE EMBARQUE es el único control de “cuándo llegará” en bandeja pendientes; no hay date-picker paralelo en Report para IC.

---

**Par cabecera PP (dato duro identidad):** [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](../gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) — `nro_pedido_externo` · Nº preventa Carlos · misma propagación UI/PDF/grillas.

**Ver también:** [INTENCION_COMPRA.md](./INTENCION_COMPRA.md) · [CHUSAR_INTENCION_COMPRA.md](./CHUSAR_INTENCION_COMPRA.md)
