# CHUSAR — Bóveda POS · stress test · tablet sin precio

**Código:** **BOVEDA-STRESS-BZZ-2026** · **2.4.4.1** · **2.3.2.2.12**  
**Etapa:** [ETAPA_BOVEDA_STRESS_TEST_BAZZAR.md](../../../4_etapas/ETAPA_BOVEDA_STRESS_TEST_BAZZAR.md)  
**Estado:** ✅ **CERRADA 2026-07-03** · [ETAPA cerrada](../../4_etapas/ETAPA_BOVEDA_STRESS_TEST_BAZZAR_CERRADA.md)  
**Hermana stock:** [CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](./CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md)

---

## Norte

**Un solo mundo:** stock Bazzar · bandeja · bóveda · depósito — documentados juntos. Esta etapa **estresa la bóveda** (`bobeda_venta_pos`) con ventas reales y **borrado cíclico** autorizado en taller.

---

## Ley tablet — generador de ticket, no precio

| ✅ Tablet hace | ❌ Tablet no hace |
|---------------|------------------|
| Reservar par molecular en `ticket_bandeja_cajero` | Fijar precio comercial legal |
| Descontar `deposito_*` al agregar par | Facturar · cobrar |
| CERRAR → `PENDIENTE_CAJA` + `numero_fi_fa` | Escribir en `bobeda_venta_pos` directo |
| Identificar vendedor · cliente (cédula) | Import CSV stock masivo |

**Precio en UI:** puede mostrarse desde `deposito.precio_unitario` (LPN CSV) como **referencia visual** — **no es condición** para emitir ticket. CERRAR con `precio_unitario` null = válido en prueba bóveda.

Código display: `tablet-bazzar/lib/precio-venta.ts` · regla negocio en este CHUSAR.

---

## Tres capas (vocabulario único)

| Capa | Tabla | Vida | Borrable en prueba |
|------|-------|------|-------------------|
| Stock piso | `deposito_1_*_tienda` | Sesión sync/import | REPLACE import CSV · no por venta |
| Operativa | `ticket_bandeja_cajero` | Turno · lote | ✅ reset script |
| **Bóveda ORO** | `bobeda_venta_pos` | Histórico ventas | ✅ **solo taller** · reset script |

**Producción:** import stock **nunca** toca bóveda — [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](../2.3_report/depositos/CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md).

**Esta etapa:** bóveda se **borra a propósito** para medir eficiencia del ciclo completo.

---

## Ciclo estrés Fase 1 (2100)

### Paso 0 — Reset

```bash
cd report
node scripts/reset_pos_bazzar_ventas.mjs
```

Esperado: bandeja ∅ · bóveda ∅ · `pos_fi_fa_counter` reiniciado · stock restaurado desde bandeja previa.

### Paso 1 — Venta tablet (sin precio obligatorio)

1. `/cadena` → 1+ pares · **no exigir** precio en pantalla  
2. Cliente + vendedor · **CERRAR**  
3. Verificar `PENDIENTE_CAJA` · `numero_fi_fa = 1` (primer ciclo)

### Paso 2 — Caja Report

1. `:3001/tablet-bazzar/2100` · lote visible  
2. Descargar CSV → `CSV_DESCARGADO`  
3. **Enviar a Empaque** → handoff `bobeda_venta_pos`

### Paso 3 — Verificar bóveda

```sql
SELECT COUNT(*), MIN(numero_fi_fa), MAX(numero_fi_fa)
FROM bobeda_venta_pos WHERE cliente_id = 2100;
```

Filas = pares vendidos · `estado` inicial Empaque.

### Paso 4 — Repetir estrés

Repetir pasos 0→3 **≥ 3 veces** · anotar tiempos · buscar drift en contadores o FK rotas.

Checklist piso: [PRUEBA_BOVEDA_STRESS_FASE1.md](../../../tablet-bazzar/docs/PRUEBA_BOVEDA_STRESS_FASE1.md)

---

## Documentación base (mismo mundo)

| Tema | Doc |
|------|-----|
| POS bandeja única | [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md) |
| Capas sesión/ORO | [ARQUITECTURA_SESION_STOCK_ORO.md](../../../tablet-bazzar/docs/ARQUITECTURA_SESION_STOCK_ORO.md) |
| Molécula BD | [09_BASE_DATOS_MOLECULAR_TICKETS.md](../2.3_report/caja_bazzar/09_BASE_DATOS_MOLECULAR_TICKETS.md) |
| Handoff bóveda | `report/src/lib/caja-bazzar/handoff-bobeda.ts` |
| Empaque tablet | [CHUSAR_TABLET_EMPAQUE.md](./CHUSAR_TABLET_EMPAQUE.md) |
| Integridad stock | [CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](./CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md) |
| Reset script | `report/scripts/reset_pos_bazzar_ventas.mjs` |

---

## SQL invariantes (cada ciclo)

| # | Check | PASS |
|---|-------|------|
| S1 | Post-handoff: bandeja lote vacío para ese `staging_id` | DELETE OK |
| S2 | `bobeda` filas = pares CERRADOS | count match |
| S3 | Post-reset: `bobeda` count = 0 | wipe OK |
| S4 | Próximo ciclo: `numero_fi_fa` vuelve a 1 | contador OK |
| S5 | Ningún `cliente_id` cruzado en bandeja/bóveda | aislamiento |

Evidencia: `tablet-bazzar/docs/evidencia/BOVEDA_STRESS_2100_*.json`

---

## Roles

| Rol | Herramienta |
|-----|-------------|
| Vendedor | Tablet `/cadena` · CERRAR |
| Cajero | Report caja 2100 · CSV · Empaque |
| Director | Reset · evidencia · cierre etapa |
| Agente | SQL S1–S5 · JSON métricas |

---

**Documenta · Inicia etapa — Director 2026-06-28**
