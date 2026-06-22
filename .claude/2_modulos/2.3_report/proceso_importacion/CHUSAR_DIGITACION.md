# CHUSAR — Digitación · Report (2.3.1.7.4)

**Subcuenta:** **2.3.1.7.4** · **Alias:** P.1.5  
**Estado CHUSAR:** 🟡 **TRÁNSITO ACTIVO**  
**Etapa:** [ETAPA_MUDANZA_IC_DIG_PP_REPORT.md](../../4_etapas/ETAPA_MUDANZA_IC_DIG_PP_REPORT.md)  
**Streamlit:** `control_central/modules/digitacion/`  
**Report:** http://localhost:3000/proceso-importacion/digitacion

---

## Qué es

Puente **IC AUTORIZADA → PP**. Card: *«Asigna nro. de fábrica a ICs autorizadas y las agrupa en Pedidos Proveedor.»*

---

## Vistas (`dg_vista`)

| Vista | Contenido |
|-------|-----------|
| `bandeja` | PENDIENTES + EN PROCESO |
| `asignacion` | Form por IC seleccionada |

Métrica roja/verde: contador **ICs pendientes de procesar**.

---

## Bandeja PENDIENTES

**Query:** `get_ics_pendientes()` — `estado='AUTORIZADO'` AND sin fila en `intencion_compra_pedido`.

Por fila: nro IC · marca · categoría · quincena/ETA · pares · evento precio.  
Acciones: **Asignar →** · **← Devolver** (motivo obligatorio → `devolver_ic`).

---

## Bandeja EN PROCESO

**Query:** `get_pps_abiertos()` — PP `estado IN ('ABIERTO','CERRADO')`, `!= ENVIADO`.

Expander por PP: ICs (`get_ics_de_pp`), **Cerrar PP** con nro. factura importación (`cerrar_pp`).

---

## Asignación (`asignar_ic`)

| Campo | Regla |
|-------|-------|
| Evento precio | `get_eventos_cerrados()` |
| Nro. pedido fábrica | Obligatorio (Beira Rio) |
| Destino PP | Existente o `crear_pp_digitacion()` |

**Persistencia:** INSERT `intencion_compra_pedido` · IC → `DIGITADO` · hereda pares/proveedor/categoría al PP.

Auditoría: `log_flujo` · `A.DIG_IC_ASIGNADA`, `A.DIG_PP_CREADO`, `A.DIG_PP_CERRADO`.

---

## Destino Report

| Ruta | Fase |
|------|------|
| `…/digitacion` | Bandeja |
| `…/digitacion/asignar/[icId]` | Form asignación |

**API:** `/api/proceso-importacion/digitacion/*`

Inventario: [DIGITACION.md](./DIGITACION.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.4

---

**Shibboleth:** Chayanne el mejor
