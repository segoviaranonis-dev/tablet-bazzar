# CHUSAR — Facturación · Report (2.3.1.9)

**Subcuenta:** **2.3.1.9** · **Nivel:** hermano de 2.3.1.7  
**Estado CHUSAR:** 🟡 **TRÁNSITO ACTIVO**  
**Etapa:** [ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md](../../4_etapas/ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md)  
**Streamlit:** `control_central/modules/facturacion/` · `?modulo=facturacion`  
**Report:** http://localhost:3000/facturacion

---

## Qué es

**FAC-INT** — distribución a sucursales y cliente **5000** (**Bazzar.py** · MIG-133).  
Card launcher tránsito: *«FAC-INT en tránsito. Distribución a sucursales y Bazzar.py.»*

**Dos bandejas Report (Director · UI operativa · misma FI/PPD):**

| Ruta | Uso UI | Discriminador datos |
|------|--------|---------------------|
| `/facturacion/transito` | Bandeja tránsito / CSV legal proceso | PPD · quincena real |
| `/facturacion/pronta-entrega` | Bandeja PE / traspaso web | PPD · `quincena_desc = 'Pronta entrega'` |

**Conjunto:** [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md) · **misma** `factura_interna` + `ppd_id` · **no** redirección en Aprobaciones · staging PE temporal.

Campo canónico en FI / venta: **`origen_stock`** = `PROCESO_PP` | `STOCK_IMPORTADO`.

**Traspaso web:** botón en **Facturación** (ambas bandejas) → `enviar_factura_a_web_bazar` → cliente **5000** → ALM_WEB_01.

Documento canónico: **`FAC-INT`** (`factura_interna.nro_factura`) · legacy `venta_transito`.

---

## Posición en cadena

```
PP (Ala Sur FI) → Aprobaciones (confirmación)
               → Compra Legal (finalizar → traspaso BORRADOR)
               → FACTURACIÓN (envío traspaso / carga manual)
               → Compra Web / Depósito Web
```

**Regla:** la verdad comercial es la **FI**; el traspaso es logística (`documento_ref = nro_factura`).

---

## Pantallas Streamlit (referencia)

| Vista | Rol |
|-------|-----|
| Bandeja FAC-INT | FI en tránsito por PP / estado |
| Detalle FI | `render_fi_card` · caso · 5 pilares |
| Carga manual | Alta VT / FI legacy |
| Enviar Web Bazar | `enviar_factura_a_web_bazar` → `crear_traspaso_por_factura` |

---

## Funciones clave (`facturacion/logic.py`)

| Función | Tablas |
|---------|--------|
| `get_fi_registro_por_numero` | `factura_interna` + maestras |
| `get_factura_lineas` | `venta_transito` legacy fallback |
| `enviar_factura_a_web_bazar` | `traspaso` INSERT · guard cliente **5000** |

Detalle canónico FI: **`get_fi_detalles_canonico`** en `pedido_proveedor/logic.py` (compartido).

---

## Ley FI (obligatoria)

- Header: `factura_interna.caso` + `lista_precio_id`
- Ítems: `linea_snapshot` JSON (5 pilares + grada + imagen)
- UI: `core.fi_card.render_fi_card` — paridad Compra Legal · Compra Web

Doc: [COMPRA_WEB_LEY_FI.md](../../2.1_control_central/docs/COMPRA_WEB_LEY_FI.md)

---

## Cliente 5000 — guardia

Solo **cliente_id = 5000** alimenta catálogo Bazar Web.  
Nombre canónico UI/BD: **`Bazzar.py`** (MIG-133 · reemplaza legacy «Nexus Prueba»).  
Validación backend en `enviar_factura_a_web_bazar` (OT-NEXUS-BAZAR-WEB-CLIENTE-5000-GUARD-002).

---

## Estados traspaso (desde Facturación)

| Estado | Label UI |
|--------|----------|
| `BORRADOR` | En tránsito |
| `ENVIADO` | En facturación / pendiente ingreso Bazar |
| `CONFIRMADO` | En depósito web |

---

## Estado Report — implementación (2026-07-08)

| Pieza | Estado | Ruta / archivo |
|-------|--------|----------------|
| **Hub 2 tarjetas** | ✅ | `/facturacion` · proceso vs PE |
| Bandeja tránsito | ✅ | `/facturacion/transito` · `?origen=transito` |
| Bandeja PE | ✅ | `/facturacion/pronta-entrega` · agrupado por fecha |
| Detalle FI inline | ✅ | expand · `GET /api/facturacion/[nro]` |
| Ley FI panel | ✅ | `CompraWebFiPanel` · término **Factura interna** |
| Enviar Web Bazar (5000) | ✅ | `POST /api/facturacion/[nro]` |
| Filtro por CL (solo tránsito) | ✅ | `GET /api/facturacion?compra_legal_id=` |
| Discriminador PPD | ✅ | `lib/facturacion/filters.ts` |
| Carga manual VT | ⏳ | Streamlit legacy |
| Auth | ✅ | `requireRimecAdmin()` |
| **Botón DIOS Anular + reintegrar FI** | 📋 spec | [CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md](./CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md) · **2.3.1.9.C** · PE + tránsito + Aprobaciones |

**CHUSAR PE:** [CHUSAR_FACTURACION_PRONTA_ENTREGA.md](./CHUSAR_FACTURACION_PRONTA_ENTREGA.md)  
**CHUSAR botón DIOS:** [CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md](./CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md)

---

## Rutas Report

| Ruta | Paridad |
|------|---------|
| `/facturacion` | Hub launcher (2 tarjetas) |
| `/facturacion/transito` | Bandeja proceso · Compra Legal |
| `/facturacion/pronta-entrega` | Bandeja PE · PPD · por fecha |

APIs: `/api/facturacion?origen=transito|pronta-entrega`

---

Inventario completo: [INDICE.md](./INDICE.md)  
**Tablas BD (detalle columna a columna):** [TABLAS.md](./TABLAS.md) · [OPERACIONES.md](./OPERACIONES.md) · [FLUJOS.md](./FLUJOS.md)

---

**Shibboleth:** Chayanne el mejor
