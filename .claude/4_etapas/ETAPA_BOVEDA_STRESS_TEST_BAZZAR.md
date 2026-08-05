# ETAPA — Bóveda POS · stress test · tablet generador de tickets

**Código:** **BOVEDA-STRESS-BZZ-2026** · **2.4.4.1** · **2.3.2.2.12**  
**Estado:** ✅ **CERRADA 2026-07-03** · ver [ETAPA_BOVEDA_STRESS_TEST_BAZZAR_CERRADA.md](./ETAPA_BOVEDA_STRESS_TEST_BAZZAR_CERRADA.md)  
**Fecha apertura:** 2026-06-28  
**CHUSAR:** [CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md)  
**Hermana:** [ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](./ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md) · stock físico/referencial  
**Shibboleth:** 7 años

---

## Objetivo

Validar que el **circuito ORO** (tablet → bandeja → caja → **bóveda** `bobeda_venta_pos`) aguanta **ciclos repetidos de venta + borrado** sin corrupción de contadores, FK ni aislamiento por tienda.

**Método:** guardar tickets en bóveda · **reset/borrar constantemente** · medir eficiencia y robustez.

---

## Ley Director — un solo mundo

| Producto | Rol | Precio |
|----------|-----|--------|
| **Tablet Bazzar** | **Generador de ticket molecular** (L+R+mat+color+grada · vendedor · cliente) | **No es sistema de precio** · opcional display LPN · **no bloquea** emisión ticket |
| **Report Caja** | Bandeja · CSV · handoff bóveda | Precio legal = **legacy facturador** · fuera de Nexus |
| **Bóveda** `bobeda_venta_pos` | **ORO** · informes futuros · Empaque | Snapshot · no recalcular desde depósito |
| **Depósito** `deposito_*` | Stock vendible sesión | `precio_unitario` CSV ≠ verdad comercial tablet |

**Prohibido mezclar:** import CSV stock **no** borra bóveda en **producción**. En **esta etapa de prueba** sí se autoriza wipe bóveda vía `reset_pos_bazzar_ventas.mjs` para estrés.

Doc unificado: [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md) · [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](../2_modulos/2.3_report/depositos/CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md).

---

## Flujo canónico bóveda (Fase 1)

```
Tablet /cadena → carrito ABIERTO (stock −1 · sin precio obligatorio)
     │ CERRAR
PENDIENTE_CAJA (numero_fi_fa · staging_id)
     │ Report caja: CSV → CSV_DESCARGADO
     │ Enviar a Empaque
bobeda_venta_pos (+N filas · estado PENDIENTE_ENTREGA)
     │ reset_pos_bazzar_ventas.mjs  ← ciclo estrés
∅ bandeja · ∅ bóveda · contadores 1 · stock restaurado
```

---

## Fases

| Fase | Nombre | Estado |
|------|--------|--------|
| **1** | Una tienda **2100** · N ciclos bóveda + reset | 🟢 **ahora** |
| **2** | Métricas tiempo · lotes/seg · SQL invariantes bajo carga | 📋 tras PASS Fase 1 |
| **3** | Multi-tienda + bóveda acumulada sin wipe | 📋 post integridad stock |

---

## Fase 1 — entregables

- [ ] Reset inicial · contadores en 1  
- [ ] **Ciclo completo** tablet → caja → bóveda (≥ 3 repeticiones)  
- [ ] Tras cada ciclo: `COUNT bobeda_venta_pos` coherente con pares vendidos  
- [ ] Reset script · bóveda vacía · `staging_id` / `numero_fi_fa` reinician  
- [ ] Stock depósito coherente post-reset (restauración bandeja)  
- [ ] Evidencia `BOVEDA_STRESS_2100_YYYYMMDD.json`  
- [ ] Tablet **sin depender de precio** para CERRAR ticket  

**Tienda:** 2100 FER-A · checklist piso: [PRUEBA_BOVEDA_STRESS_FASE1.md](../../../tablet-bazzar/docs/PRUEBA_BOVEDA_STRESS_FASE1.md)

---

## Métricas estrés (Fase 2)

| Métrica | Cómo |
|---------|------|
| Tiempo handoff bóveda | `Enviar a Empaque` → ms en log Report |
| Filas bóveda / ciclo | `INSERT` count vs pares tablet |
| Reset total | Duración script · filas restauradas stock |
| Integridad secuencia | `staging_id` monótono · FI_FA por `cliente_id` |

---

## Fuera de alcance

- Sales Report histórico (`registro_ventas_general_v2`) — blindado  
- Precio Motor RIMEC / listados importadora  
- Sync 6 tiendas (etapa integridad stock Fase 2)

---

## Cierre etapa

Director **Cierra etapa** con evidencia JSON · PASS ciclos Fase 1 · build tablet + report OK · `etapas.json` `hecho`.

---

**Inicia etapa — orden Director — 2026-06-28**
