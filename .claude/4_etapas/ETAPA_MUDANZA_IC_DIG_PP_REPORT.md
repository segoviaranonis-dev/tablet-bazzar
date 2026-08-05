# ETAPA ABIERTA — Mudanza IC · Digitación · Pedido PP (Report)

**ID:** `ETAPA-MUDANZA-IC-DIG-PP-20260618`  
**Códigos:** **2.3.1.7.3** · **2.3.1.7.4** · **2.3.1.7.5**  
**Ejecutor:** Cursor (Auto) · documentación CHUSAR + shells Report  
**Estado:** 🟡 **EN CURSO** · **FOCO MARATÓN** · portal unificado en **`2.3.1.7.3-5`**  
**Canónica maratón:** [ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md](./ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md)  
**Prerequisito:** Motor 7.1 + Importación 7.2 ✅ cerrados ([cierre importación](./ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md))
**Streamlit origen:** `control_central/modules/{intencion_compra,digitacion,pedido_proveedor}/`  
**Shibboleth:** Chayanne el mejor

---

## Objetivo

Clonar en Report los **tres módulos marcados** del launcher Streamlit (post-Motor):

| Card Streamlit | Código | Report |
|----------------|--------|--------|
| Intención de Compra | 2.3.1.7.3 | `/proceso-importacion/intencion-compra` |
| Digitación | 2.3.1.7.4 | `/proceso-importacion/digitacion` |
| Pedido Proveedor | 2.3.1.7.5 | `/proceso-importacion/pedido-proveedor` |

Estrategia dual: Streamlit operativo · Report destino NIIF.

---

## Orden de mudanza (cadena BD)

```
Motor (7.1/7.2) → IC (7.3) → Digitación (7.4) → PP (7.5) → Aprobaciones (fuera)
```

---

## Fases por subcuenta

| Fase | Código | Entregable doc | Entregable app |
|------|--------|----------------|----------------|
| 1 | 7.3 | [CHUSAR_INTENCION_COMPRA.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INTENCION_COMPRA.md) | Hub + bandeja + wizard |
| 2 | 7.4 | [CHUSAR_DIGITACION.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_DIGITACION.md) | Bandeja + asignación |
| 3 | 7.5 | [CHUSAR_PEDIDO_PROVEEDOR.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_PEDIDO_PROVEEDOR.md) | Lista + detalle · **Fase 1 Stock ✅** · Fase 2–4 ⏳ |

---

## Progreso app (2026-07-03)

| Subcuenta | UI Report | APIs | Doc |
|-----------|-----------|------|-----|
| 7.3 IC | ✅ bandeja + nueva | ✅ | 🟡 smoke maratón |
| 7.4 Digitación | ✅ asignar PP | ✅ | 🟡 |
| 7.5 PP lista | ✅ | ✅ | ✅ |
| 7.5 PP detalle cabecera | ✅ | ✅ PATCH | ✅ CHUSAR_PP_CABECERA |
| 7.5 PP tab ICs | ✅ editables | ✅ | ✅ |
| 7.5 PP tab Stock | ⚠️ Fase 1 | ✅ vincular-listado | ✅ CHUSAR_PP_TAB_STOCK |
| 7.5 PP tab FI | 🔴 básico | parcial | 🔴 |

Inventario: [MUDANZA_PP_DETALLE_INVENTARIO.md](../../report/docs/MUDANZA_PP_DETALLE_INVENTARIO.md)

---

## Rutas Report planificadas

| Ruta | Streamlit equivalente |
|------|----------------------|
| `…/intencion-compra` | Dashboard IC |
| `…/intencion-compra/bandeja` | Tabs PENDIENTES / HISTORIAL / DEVUELTAS |
| `…/intencion-compra/nueva` | Paso A + formulario |
| `…/digitacion` | Bandeja |
| `…/digitacion/asignar/[icId]` | Vista asignación |
| `…/pedido-proveedor` | Lista PP por quincena |
| `…/pedido-proveedor/nuevo` | Form nuevo PP |
| `…/pedido-proveedor/[id]` | Detalle PP (Ala N/S, listado, proforma) |

APIs: `/api/proceso-importacion/{intencion-compra|digitacion|pedido-proveedor}/*`

---

## Criterios cierre (por subcuenta)

- [ ] Paridad pantallas críticas Streamlit
- [ ] Pilares FK · sin parche cliente
- [ ] `celebrate_save` / toast en persistencias
- [ ] CHUSAR → 🟢 ACTIVO
- [ ] Smoke `npm run build`

---

## CHUSAR hijos

| Doc | Rol |
|-----|-----|
| [TABLAS_MUDANZA_IC_DIG_PP.md](../2_modulos/2.3_report/proceso_importacion/TABLAS_MUDANZA_IC_DIG_PP.md) | ER + columnas + R/W por módulo |
| [INTENCION_COMPRA.md](../2_modulos/2.3_report/proceso_importacion/INTENCION_COMPRA.md) | Inventario 7.3 |
| [DIGITACION.md](../2_modulos/2.3_report/proceso_importacion/DIGITACION.md) | Inventario 7.4 |
| [PEDIDO_PROVEEDOR.md](../2_modulos/2.3_report/proceso_importacion/PEDIDO_PROVEEDOR.md) | Inventario 7.5 |

---

**Apertura — 2026-06-18 — Cursor · Protocolo Chusar**
