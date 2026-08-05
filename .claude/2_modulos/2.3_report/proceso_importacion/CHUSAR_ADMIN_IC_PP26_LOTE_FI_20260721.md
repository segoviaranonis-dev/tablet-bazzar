# CHUSAR — PP-26 · Admin IC · Lote FI 100/100 · Éxito 2026-07-21

**Código:** **2.3.1.7.5.3.5.6**  
**Estado:** ✅ **CERRADO** 2026-07-21  
**Etapa:** [ETAPA_ADMIN_IC_PP26_PROGRAMADO_CERRADA.md](../../../4_etapas/ETAPA_ADMIN_IC_PP26_PROGRAMADO_CERRADA.md)  
**Caso:** PP-2026-0017 · `pedido_proveedor.id = 26` · proforma **5436/2026** · biblioteca **#8**  
**Padres:** [CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721](./CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721.md) · [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) · [CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO](./CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO.md)

**Shibboleth:** Andrés, el que viene.

---

## 1 · Resumen ejecutivo

Primera corrida **end-to-end Admin IC → 100 FI** en PP-26 tras cirugía Excel (100 IC) + import proforma + alineación Chusa.

| Métrica | Valor |
|---------|------:|
| IC | **100** |
| PF (grupos Chusa) | **100** |
| FI RESERVADA | **100** |
| Pares (orden magnitud) | ~9.068 (proforma) |
| Generación | **2 tandas** Director · batches API de **12** FI |

---

## 2 · Flujo operativo validado

1. **Cabecera PP** — biblioteca #8 (no listado suelto).  
2. **Import proforma** — PPD solo (`phase=ppd`) · preview totales SHOP.  
3. **Admin IC** — IC=PF=100 · canon cliente·marca·cantidad · DESC desde IC pareada.  
4. **Botón verde** — `generar-fi-lote` en loop UI hasta `done: true`.  
5. **Tab FI** — 100 facturas listas para revisión / Logística OK.

---

## 3 · Arquitectura lote FI (post-fix)

| Pieza | Ruta / regla |
|-------|----------------|
| API batch | `…/administrador-ic/generar-fi-lote/route.ts` · `offset` + `batch_size=12` |
| UI loop | `PpTabAdministradorIc.tsx` · `generarFiLote()` while !done |
| Pool Vercel | **1 conexión** por request · `txClient` en `generarFiDesdeAdministradorIc` |
| Lock FI | `tryLockPpFiOpsWithStaleRecovery` · unlock en `finally` |
| Chusa | `construirParejasLoteChusa` · `evalProtocoloChusa` N1+N2 |

**Prohibido regresión:** no volver a `pool.connect()` lock + `pool.query()` paralelo en la misma lambda.

---

## 4 · Errores de la jornada (índice)

| Código | Título | Estado |
|--------|--------|--------|
| — | Lock FI «otro proceso» | ✅ stale release |
| — | `timeout exceeded when trying to connect` | ✅ pool max=1 |
| — | JSON vacío / 504 | ✅ batches |
| `4.02.03.010` | Botón verde no recalcula FI | ✅ regenerar + lote |

---

## 5 · Mañana — checklist Director

- [ ] Smoke tab **FI** PP-26 prod · descuentos · montos vs proforma  
- [ ] **Logística OK** · publicar entrega (si aplica)  
- [ ] Decidir **siguiente PP** maratón 6 PF o repetición controlada PP-26  
- [ ] CSV veneno Carlos cuando FI confirmadas  

**Deploy sellado:** `report` main ≥ `9c80337` · https://rimec-report.vercel.app
