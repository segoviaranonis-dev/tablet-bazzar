# CHUSAR — Facturación · Report (2.3.1.9)

**Subcuenta:** **2.3.1.9** · **Nivel:** hermano de 2.3.1.7  
**Estado CHUSAR:** 🟡 **TRÁNSITO ACTIVO**  
**Etapa:** [ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md](../../4_etapas/ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md)  
**Streamlit:** `control_central/modules/facturacion/` · `?modulo=facturacion`  
**Report:** http://localhost:3000/facturacion

---

## Qué es

**FAC-INT en tránsito** — distribución a sucursales y cliente **5000** (Bazar Web).  
Card launcher: *«FAC-INT en tránsito. Distribución a sucursales y cliente 5000.»*

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
Validación backend en `enviar_factura_a_web_bazar` (OT-NEXUS-BAZAR-WEB-CLIENTE-5000-GUARD-002).

---

## Estados traspaso (desde Facturación)

| Estado | Label UI |
|--------|----------|
| `BORRADOR` | En tránsito |
| `ENVIADO` | En facturación / pendiente ingreso Bazar |
| `CONFIRMADO` | En depósito web |

---

## Estado Report — implementación (2026-06-19)

| Pieza | Estado | Ruta / archivo |
|-------|--------|----------------|
| Hub bandeja FAC-INT | ✅ | `/facturacion` · KPIs + lista |
| Detalle FI inline | ✅ | expand · `GET /api/facturacion/[nro]` |
| Ley FI panel | ✅ | `CompraWebFiPanel` · detalle canónico |
| Enviar Web Bazar (5000) | ✅ | `POST /api/facturacion/[nro]` |
| Filtro por CL | ✅ | `GET /api/facturacion?compra_legal_id=` |
| Carga manual VT | ⏳ | Streamlit legacy |
| Página detalle dedicada `/facturacion/[nro]` | ⏳ | Hoy expand en hub |
| Auth | ✅ | `requireRimecAdmin()` |

**Lib:** `report/src/lib/facturacion/queries.ts` · gemelo FI en `lib/bazzar-web/compra-web/`

---

## Rutas Report

| Ruta | Paridad Streamlit |
|------|-------------------|
| `/facturacion` | Bandeja + detalle expand + enviar web |
| `/facturacion/[nro]` | ⏳ detalle dedicado (futuro) |

APIs: `/api/facturacion/*`

---

Inventario completo: [INDICE.md](./INDICE.md)  
**Tablas BD (detalle columna a columna):** [TABLAS.md](./TABLAS.md) · [OPERACIONES.md](./OPERACIONES.md) · [FLUJOS.md](./FLUJOS.md)

---

**Shibboleth:** Chayanne el mejor
