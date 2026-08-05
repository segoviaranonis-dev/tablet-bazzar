# CHUSAR — Intención de compra · Report (2.3.1.7.3)

**Subcuenta:** **2.3.1.7.3** · **Alias:** P.1.4  
**Estado CHUSAR:** 🟢 **ACTIVO** — maratón prueba final 2026-07-03 · hotfix marcas `/nueva`  
**Etapa maratón:** [ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md](../../4_etapas/ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md)  
**Streamlit:** `control_central/modules/intencion_compra/`  
**Report local:** http://localhost:3001/proceso-importacion/intencion-compra  
**Report prod:** https://rimec-report.vercel.app/proceso-importacion/intencion-compra · deploy **2026-07-05**

---

## Palabra reservada — FECHA DE EMBARQUE

Doc canónica: **[FECHA_DE_EMBARQUE.md](./FECHA_DE_EMBARQUE.md)**

- Tabla **1–24** → `quincena_arribo` · columna `intencion_compra.quincena_arribo_id`
- Slider **0 = sin definir** · **1–24 = quincena**
- Obligatoria para **AUTORIZAR** IC
- Streamlit la muestra como «Llegada»; Report usa el label **FECHA DE EMBARQUE**

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

Campos editables inline: `tipo_id`, `categoria_id`, `id_marca`, `quincena_arribo_id` (**FECHA DE EMBARQUE**), `cantidad_total_pares`, `precio_evento_id`, `nota_pedido`, `monto_neto`. Legacy: `fecha_llegada` (no usar en UI nueva).

---

## Tabla `intencion_compra` (FK)

`id_cliente`, `id_vendedor`, `id_marca`, `id_proveedor`, `tipo_id`, `categoria_id`, `cantidad_total_pares`, `monto_neto`, **`quincena_arribo_id` (FECHA DE EMBARQUE)**, `precio_evento_id`, `nota_pedido`, `estado`, `numero_registro` · legacy `fecha_llegada`

---

## Destino Report — implementado 2026-06-22

| Código | Ruta | Paridad Streamlit |
|--------|------|-------------------|
| 2.3.1.7.3 | hub | ✅ |
| 2.3.1.7.3.1 | `…/bandeja` | ✅ PENDIENTES · DEVUELTAS · HISTORIAL |
| 2.3.1.7.3.2 | `…/nueva` | ✅ paso A + form + REGISTRAR |

**Mapa bandeja:** [IC_BANDEJA.md](./IC_BANDEJA.md) · **App:** [INTENCION_COMPRA_REPORT.md](../../../../report/docs/INTENCION_COMPRA_REPORT.md)

**APIs:** `GET catalogos` · `GET pendientes|devueltas|historial` · `POST /` · `PATCH [id]/campo` · `POST autorizar|reautorizar|anular` · `DELETE [id]` · `GET cliente/[codigo]` · `GET negociacion`

**Pendiente fase 2:** tab **Preventa** (carrito PP → IC) — Streamlit `tab_prev`.

Inventario completo: [INTENCION_COMPRA.md](./INTENCION_COMPRA.md)  
**Problema 2 · LP en IC:** [CHUSAR_IC_PROBLEMA_2_LISTADO_LP.md](./CHUSAR_IC_PROBLEMA_2_LISTADO_LP.md) (**2.3.1.7.3.0.1**)  
**Inyección Excel IC (≥412):** [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md) (**2.3.1.7.3.3**) · etapa [ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md](../../4_etapas/ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.3

---

**Shibboleth:** Chayanne el mejor
