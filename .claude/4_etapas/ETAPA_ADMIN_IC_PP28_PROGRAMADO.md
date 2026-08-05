# ETAPA ABIERTA — Administrador IC · PP-28 · 8051/2026

**ID:** `ADMIN-IC-PP28-20260711`  
**Código:** **2.3.1.7.5.3.5** · **2.3.1.7.5.3.7**  
**Estado:** 🟢 **ABIERTA** — lote Chusa PP-28 ✅ local · réplica resto PP mañana · cierre pendiente smoke Director
**Ejecutor:** Cursor · **Director valida resultado**  
**Portal :3004:** http://localhost:3004/etapas  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Cerrar cadena **IC ↔ proforma ↔ FI** en PP-28 usando **Administrador de IC** con `_shop` canónico del Excel — sin motor 1 IC = 1 FI.

---

## Caso de prueba

| Campo | Valor |
|-------|--------|
| PP BD id | **28** |
| Número | **PP-2026-0019** |
| Proforma | **8051/2026** |
| Excel | `importar web_8051_2026.xlsx` |
| ICs | **115** |
| PPD | **912 SKUs** · **9.400 pares** |
| Pre-FI / FI | **115** · ~13 líneas sin LPN (ámbar) |
| URL local | `http://localhost:3000/proceso-importacion/pedido-proveedor/28?tab=admin-ic` |

---

## Hecho al abrir etapa (2026-07-11)

| # | Entrega | PASS |
|---|---------|------|
| 1 | Diagnóstico shop 286: Excel 1 marca vs UI 5 marcas | ✅ |
| 2 | Motor preview SHOP×BRAND + `_shop` Excel canónico | ✅ local |
| 3 | Reimport PP-28 fase PPD | ✅ |
| 4 | Admin IC layout columnas + shop 286 limpio | ✅ local |
| 5 | API generar FI + montos sin descuento | ✅ código |
| 6 | Lote Chusa un clic · 115 FI | ✅ local 2026-07-11 |
| 7 | Excepción sin LPN · borde ámbar | ✅ local 2026-07-11 |
| 8 | Doc errores/soluciones pormenorizado | ✅ [DOC maestro](../2_modulos/2.3_report/proceso_importacion/DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) |

---

## Checklist etapa (pendiente Director)

| # | Paso | PASS |
|---|------|------|
| 1 | `npm run dev:clean:3000` · tab admin-ic PP-28 | ⏳ mañana |
| 2 | Verificar IC=PF=FI=115 · saldo KPI=0 | ⏳ mañana |
| 3 | Tab FI · líneas ámbar sin LPN documentadas | ⏳ mañana |
| 4 | CSV Carlos 8051-26 | ⏳ mañana |
| 5 | Réplica checklist §7 → PP-17 u otro programado | ⬜ mañana |
| 6 | Deploy prod | ⛔ solo orden Director |

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Avisos pares ≠ IC en preview | Cuadrar en Admin IC · LP editable |
| Reimport borró FI previas | Esperado · regenerar vía parejas |
| Prod desactualizado | Local hasta deploy Claude Code |

---

## Documentación

| Tipo | Ruta |
|------|------|
| CHUSAR reconstrucción | [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) |
| Norte Admin IC | [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) |
| Protocolo Chusa | [PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md](../2_modulos/2.3_report/proceso_importacion/PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) |
| **DOC errores/soluciones · réplica** | [DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28](../2_modulos/2.3_report/proceso_importacion/DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) |
| Protocolo import | [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](../2_modulos/2.3_report/proceso_importacion/PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) |

---

**Abierta — Documentación Chusar 2026-07-11 · Director ordena cierre con «Cierra etapa».**
