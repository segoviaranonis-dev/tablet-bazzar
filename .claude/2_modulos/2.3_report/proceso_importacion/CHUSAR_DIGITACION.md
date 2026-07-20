# CHUSAR — Digitación · Report (2.3.1.7.4)

**Subcuenta:** **2.3.1.7.4** · **Alias:** P.1.5  
**Estado CHUSAR:** 🟢 **ACTIVO**  
**Report:** http://localhost:3001/proceso-importacion/digitacion

---

## Qué es

Puente **IC AUTORIZADA → PP**. Card: *«Asigna nro. de fábrica a ICs autorizadas y las agrupa en Pedidos Proveedor.»*

---

## Vistas (`dg_vista`)

| Vista | Contenido |
|-------|-----------|
| `bandeja` | PENDIENTES + EN PROCESO · **ramo** `compra_previa` \| `programado` |
| `asignacion` | Form por IC seleccionada |

**Ramo Compra previa (`categoria_id=2`):** IC `AUTORIZADO` sin PP.  
**Ramo Programado (`categoria_id=3`):** IC sin PP en `PENDIENTE_OPERATIVO` (link bandeja) o `AUTORIZADO` (asignar nro. fábrica → PP programación).

API: `GET /api/proceso-importacion/digitacion/bandeja?ramo=programado`

Métrica roja/verde: contador **ICs pendientes de procesar** por ramo.

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
| `…/digitacion/asignar-lote` | Multi-asignar N IC → 1 PP (`2.3.1.7.4.3`) |

**API:** `/api/proceso-importacion/digitacion/*`

Inventario: [DIGITACION.md](./DIGITACION.md)  
**Mapa bandeja:** [MAPA_ACCESO_RAPIDO_DG_BANDEJA.md](./MAPA_ACCESO_RAPIDO_DG_BANDEJA.md) · **Asignar:** [DIGITACION_ASIGNAR.md](./DIGITACION_ASIGNAR.md)  
**Multi-asignar:** [CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md](./CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md)  
**Bandeja acordeón + filtros:** [CHUSAR_DIGITACION_BANDEJA_FILTROS_ACORDEON.md](./CHUSAR_DIGITACION_BANDEJA_FILTROS_ACORDEON.md) (`2.3.1.7.4.4`)  
**App:** [DIGITACION_REPORT.md](../../../../report/docs/DIGITACION_REPORT.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.4

---

**Shibboleth:** Andrés, el que viene.
