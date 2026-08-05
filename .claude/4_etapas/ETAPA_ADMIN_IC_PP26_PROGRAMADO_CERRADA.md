# ETAPA CERRADA — Administrador IC · PP-26 · Lote FI 100/100

**ID:** `ADMIN-IC-PP26-20260721`  
**Código:** **2.3.1.7.5.3.5.6** · Report · PROGRAMADO  
**Cierre:** 2026-07-21 · Director orden **Documenta** + **Cierra etapa**  
**Estado:** ✅ **CERRADA** — éxito total lote FI en **dos tandas**  
**Shibboleth:** Andrés, el que viene.

---

## Entregable operativo (PASS)

| Métrica | Esperado | Resultado |
|---------|----------|-----------|
| PP | PP-2026-0017 · id **26** | ✅ |
| Proforma | **5436/2026** | ✅ |
| Biblioteca cabecera | **#8** POLITICA JUNIO 2026 | ✅ |
| IC vinculadas | 100 | ✅ **100** |
| Pre-facturas (Chusa) | 100 | ✅ **100** |
| FI RESERVADA | 100 | ✅ **100** |
| Protocolo Chusa N1+N2 | IC=PF alineados | ✅ |
| Generación FI | 2 tandas (batches ×12) | ✅ Director confirma |

**Prod:** https://rimec-report.vercel.app/proceso-importacion/pedido-proveedor/26?tab=admin-ic  
**Local:** http://localhost:3000/proceso-importacion/pedido-proveedor/26?tab=admin-ic

---

## Hotfixes incluidos en el cierre

| Commit | Tema |
|--------|------|
| `124c15a` | Preview totales · import PPD solo · caso ≠ marca (CHINELO) |
| `979a51b` | PF marca real `_brand_excel` (MOLECA+CHINELO → BEIRA RIO) |
| `840ae0f` | maxDuration 300s generar-fi-lote |
| `55c6d05` | Lock FI huérfano + DESC vía `marcasCanonCoinciden` |
| `bd01e59` | Lote FI batches 12 · JSON vacío · DESC por fila |
| `9c80337` | Deadlock pool max=1 Vercel — una conexión por batch |
| `c1ef8eb` | Contrato marca PF completado |

---

## Errores resueltos en la jornada

| Error | Síntoma | Fix |
|-------|---------|-----|
| Lock advisory colgado | «Hay otro proceso FI…» | `releaseStalePpFiLock` + terminate backend |
| Timeout pool | `timeout exceeded when trying to connect` | Una sola conexión · `txClient` en generar FI |
| 504 body vacío | `Unexpected end of JSON input` | Lote por batches + parse texto en UI |
| DESC «—» en PF | IC no emparejaba marca real | `icParPrefactura` + fila alineada Chusa |

Doc detalle: [CHUSAR_ADMIN_IC_PP26_LOTE_FI_20260721.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_ADMIN_IC_PP26_LOTE_FI_20260721.md)

---

## Mañana — handoff

| # | Prueba sugerida | Notas |
|---|-----------------|-------|
| 1 | Tab **Facturas Internas** PP-26 · editar descuentos · PDF | Smoke prod post-lote |
| 2 | **Logística OK** · Fecha entrega real · Publicar | Ver error timeout si persiste en otro módulo |
| 3 | **Siguiente proforma** maratón programados (#4 en lote 6 PF) | Maratón `IMPORTACION-PROGRAMADOS-20260718` sigue abierta |

---

## Cierre Navegador (:3004)

| Check | Hecho |
|-------|:-----:|
| `ETAPA_*_CERRADA.md` | ✅ |
| `ACTUAL.md` | ✅ |
| `etapas.json` → `cerradasPorModulo.report` | ✅ |
| `ultimaCerradaPorModulo.report` bump | ✅ |

**Maratón programados:** sigue **EN CURSO** — PP-26 = fila #3 cerrada; faltan proformas del lote 6.
