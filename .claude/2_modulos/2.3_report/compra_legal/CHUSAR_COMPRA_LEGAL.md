# CHUSAR — Compra legal · Report (2.3.1.8)

**Subcuenta:** **2.3.1.8** · **Nivel:** hermano de 2.3.1.7 (como RRHH o Aprobaciones)  
**Estado CHUSAR:** 🟡 **TRÁNSITO ACTIVO** — mudanza Streamlit → Report  
**Etapa:** [ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md](../../4_etapas/ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md)  
**Streamlit:** `control_central/modules/compra_legal/` · `?modulo=compra_legal`  
**Report:** http://localhost:3000/compra-legal

---

## Qué es

**Consolidador de PPs** — estación 1 del ciclo abastecimiento post-PP.  
Card launcher: *«Consolidación de PPs. Generación de compras legales y traspasos.»*

Formato registro: **`CL-YYYY-XXXX`**

---

## Flujo operativo

```
PP (ENVIADO) → create_compra_legal / add_pp_to_compra
            → compra_legal PENDIENTE
            → finalizar_compra → traspasos BORRADOR + estado DISTRIBUIDA
            → Facturación envía traspasos
```

| Estado CL | Significado | Acción UI |
|-----------|-------------|-----------|
| `PENDIENTE` | Recibe PPs | Finalizar y distribuir |
| `DISTRIBUIDA` | Traspasos creados | Facturación toma el relevo |
| `ENVIADO` | Traspasos ENVIADO | Compra Web / Bazar |
| `CERRADA` | Stock confirmado web | fin |

---

## Router Streamlit

| Condición | Vista |
|-----------|-------|
| `cl_selected_id` | DETALLE compra |
| default | LISTA por mes |

---

## Vista LISTA

- `get_compras_legales()` — KPIs pares F9, traspasos, confirmados
- Agrupación mensual por `fecha_factura`
- Entrada desde PP: botón **Enviar a Compra**

---

## Vista DETALLE — bloques críticos

| Bloque | Funciones |
|--------|-----------|
| Header KPI | `get_compra_header` · `get_metricas_facturacion_compra` |
| PPs vinculados | `get_pps_de_compra` · `rechazar_pp_de_compra` |
| Finalizar | `finalizar_compra` → `_crear_traspasos_para_pp` |
| Hija Depósito | `get_compra_hija_deposito` (saldo F9 − vendido) |
| Hija Facturación | `get_facturas_internas_de_compra` · `render_fi_card` |

**Ley FI:** toda FAC-INT usa `render_fi_card` + `get_fi_detalles_canonico`.

---

## Creación / vínculo PP

| Función | Efecto |
|---------|--------|
| `create_compra_legal(id_pp, proforma)` | INSERT CL + puente + PP→ENVIADO |
| `add_pp_to_compra(cl_id, id_pp)` | Agrega PP a CL existente |
| `pp_ya_en_compra(id_pp)` | Guard anti-duplicado |

---

## Traspasos (espejo logístico)

| Función | Rol |
|---------|-----|
| `crear_traspaso_por_factura` | TRP por FAC-INT · `combinacion_id` |
| `_resolve_combinacion_id` | Puente PP → Bazar (5 pilares + talla) |
| `enviar_compra_a_web` | BORRADOR → ENVIADO masivo |

Almacenes: `ALM_TRANSITO_01` (3) origen · `ALM_WEB_01` (1) destino web · `ALM_DEPOSITO_RIMEC` (4) depósito físico.

---

## Estado Report — implementación (2026-06-19)

| Pieza | Estado | Ruta / archivo |
|-------|--------|----------------|
| Hub lista CL | ✅ | `/compra-legal` · `CompraLegalHubClient.tsx` |
| Detalle CL | ✅ | `/compra-legal/[id]` · tabs PPs · Depósito hija · Facturas FI |
| API lista | ✅ | `GET /api/compra-legal` |
| API detalle | ✅ | `GET /api/compra-legal/[id]` |
| Finalizar + traspasos BORRADOR | ✅ | `POST /api/compra-legal/[id]/finalizar` |
| Rechazar PP de CL | ✅ | `POST /api/compra-legal/[id]/rechazar-pp` |
| Ley FI en detalle | ✅ | `CompraWebFiPanel` · `get_fi_detalles_canonico` |
| Crear CL desde PP (UI) | ⏳ | Paridad botón «Enviar a Compra» en PP Report |
| `enviar_compra_a_web` masivo | ⏳ | Traspaso BORRADOR→ENVIADO desde CL |
| Auth | ✅ | `requireRimecAdmin()` en todas las APIs |

**Lib:** `report/src/lib/compra-legal/queries.ts` · `types.ts`  
**Constantes:** `report/src/lib/rimec-abastecimiento/constants.ts`

---

## Rutas Report

| Ruta | Paridad Streamlit |
|------|-------------------|
| `/compra-legal` | Vista LISTA |
| `/compra-legal/[id]` | Vista DETALLE + finalizar + hijas |

APIs: `/api/compra-legal/*`

---

Inventario completo: [INDICE.md](./INDICE.md)  
**Tablas BD (detalle columna a columna):** [TABLAS.md](./TABLAS.md) · [OPERACIONES.md](./OPERACIONES.md) · [FLUJOS.md](./FLUJOS.md)

---

**Shibboleth:** Chayanne el mejor
