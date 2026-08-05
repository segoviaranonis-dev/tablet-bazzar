# ETAPA — Prueba integridad stock Bazzar

**Código:** **PRUEBA-STOCK-BZZ-2026**  
**Estado:** ✅ **CERRADA 2026-07-03** · ver [ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR_CERRADA.md](./ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR_CERRADA.md)  
**CHUSAR:** [CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md)  
**Checklist piso:** [PRUEBA_INTEGRIDAD_STOCK_FASE1.md](../../../tablet-bazzar/docs/PRUEBA_INTEGRIDAD_STOCK_FASE1.md)

---

## Objetivo

1. **Mañana:** resetear **todos los contadores** POS · validar circuito **una tienda** (2100) · stock **físico + referencial** fiable.  
2. **Después:** segunda etapa — **sync simultáneo 6 tiendas** (solo tras PASS Fase 1).

---

## Fases

| Fase | Nombre | Pruebas | Estado |
|------|--------|---------|--------|
| **1** | Una tienda · circuito cerrado | **A** integridad física · **B** integridad referencial | 🟢 mañana |
| **2** | Sync simultáneo 6 tiendas | **C** física multi · **D** referencial sync | 📋 diseño |

---

## Fase 1 — entregables mañana

- [ ] `reset_pos_bazzar_ventas.mjs` ejecutado · contadores en 1  
- [ ] Sync depósito **2100** alineado Retail  
- [ ] Venta E2E cadena → caja → (empaque)  
- [ ] Depósito vidriera ⭐ coherente con venta  
- [ ] Evidencia `INTEGRIDAD_FASE1_2100_*.json`  
- [ ] SQL B1–B7 PASS  

**Tienda:** 2100 FER-A Fernando Adultos.

---

## Fase 2 — no mañana

Sync **TODOS** en paralelo · guards 409 · totales 6 cards — ver CHUSAR § Fase 2.

---

## Docs que no se reemplazan

Cierre salón 2026-06-27 · LOGICA_OPERATIVA · LOGICA_STOCK_SYNC · vidriera estrellas — esta etapa **añade** prueba de integridad encima.

---

## URLs dev

| App | Ruta |
|-----|------|
| Tablet cadena | http://localhost:3000/cadena?cliente_id=2100 |
| Tablet depósito | http://localhost:3000/deposito |
| Report caja | http://localhost:3001/tablet-bazzar/2100 |
| Report sync | http://localhost:3001/depositos-bazzar |

---

**Abierta — Director — 2026-06-27**
