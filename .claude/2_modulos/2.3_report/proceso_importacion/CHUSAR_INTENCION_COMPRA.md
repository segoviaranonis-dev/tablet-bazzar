# CHUSAR — Intención de compra · Report (2.3.1.7.3)

**Subcuenta:** **2.3.1.7.3** · **Alias:** P.1.4  
**Estado CHUSAR:** 🟡 **TRÁNSITO ACTIVO** — mudanza Streamlit → Report  
**Etapa:** [ETAPA_MUDANZA_IC_DIG_PP_REPORT.md](../../4_etapas/ETAPA_MUDANZA_IC_DIG_PP_REPORT.md)  
**Streamlit:** `control_central/modules/intencion_compra/`  
**Report:** http://localhost:3000/proceso-importacion/intencion-compra

---

## Qué es

**Cabecera financiera** de la importación. Card launcher: *«Cuotas por marca y límite de crédito.»*

**PROHIBIDO:** material, color, línea, referencia, proforma, SKUs.

---

## Router Streamlit (`ic_vista`)

| Vista | Key | Pantalla |
|-------|-----|----------|
| Dashboard | `dashboard` | Tabs PENDIENTES / HISTORIAL / DEVUELTAS |
| Paso A | `paso_a` | Tipo + categoría (`categoria_v2` ≠ STOCK) |
| Formulario | `form` | Alta/edición IC completa |

---

## Máquina de estados IC

| Estado | Bandeja | Acción siguiente |
|--------|---------|------------------|
| `PENDIENTE_OPERATIVO` | PENDIENTES · editable | `autorizar_ic` → |
| `AUTORIZADO` | Historial · Digitación la toma | asignación PP |
| `DIGITADO` | Historial | PP operativo |
| `DEVUELTO_ADMIN` | DEVUELTAS | `reutorizar_ic` |
| `ANULADO` | Historial | fin |

Formato registro: **`IC-YYYY-XXXX`**

---

## Catálogos (`logic.py`)

| Función | Tabla / regla |
|---------|---------------|
| `get_proveedores` | `proveedor_importacion` activo |
| `get_clientes` | `cliente_v2` |
| `get_vendedores` | `usuario_v2` + rol VENDEDOR/ADMIN |
| `get_marcas` | `marca_v2` |
| `get_plazos` | `plazo_v2` |
| `get_tipos` | `tipo_v2` |
| `get_categorias` | `categoria_v2` id **≠ 1** (STOCK excluido) |
| `get_eventos_precio_cerrados` | `precio_evento` cerrados |

Categorías IC: **2=COMPRA PREVIA**, **3=PROGRAMADO**.

---

## CRUD principal

| Función | Efecto |
|---------|--------|
| `save_intencion` | INSERT + número automático |
| `update_campo_ic` | PATCH inline bandeja (on_change) |
| `autorizar_ic` | → `AUTORIZADO` + handoff Digitación |
| `eliminar_ic` | borrado controlado |
| `anular_ic` | anulación |
| `reutorizar_ic` | reingreso desde DEVUELTAS |
| `calcular_neto` | descuentos 1–4 cabecera |

Campos editables inline: `tipo_id`, `categoria_id`, `id_marca`, `fecha_llegada`, `quincena_arribo_id`, `cantidad_total_pares`, `precio_evento_id`, `nota_pedido`, `monto_neto`.

---

## Tabla `intencion_compra` (FK)

`id_cliente`, `id_vendedor`, `id_marca`, `id_proveedor`, `tipo_id`, `categoria_id`, `cantidad_total_pares`, `monto_neto`, `fecha_llegada`, `quincena_arribo_id`, `precio_evento_id`, `nota_pedido`, `estado`, `numero_registro`

---

## Destino Report

| Código | Ruta | Streamlit |
|--------|------|-----------|
| 2.3.1.7.3 | `…/intencion-compra` | Hub |
| 2.3.1.7.3.1 | `…/bandeja` | Dashboard tabs |
| 2.3.1.7.3.2 | `…/nueva` | paso_a + form |

**API plan:** `GET/POST/PATCH /api/proceso-importacion/intencion-compra/*`

Inventario completo: [INTENCION_COMPRA.md](./INTENCION_COMPRA.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.3

---

**Shibboleth:** Chayanne el mejor
