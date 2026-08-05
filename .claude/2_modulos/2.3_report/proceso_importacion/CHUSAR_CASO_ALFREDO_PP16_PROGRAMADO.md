# CHUSAR — Caso Alfredo · PP-2026-0016 · Import PROGRAMADO

**Código:** 2.3.1.7.5.3.3.2 · **Estado:** ✅ **CERRADO** 2026-07-09  
**Etapa:** [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](../../4_etapas/ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md)  
**Detalle éxito:** [CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md)  
**Error índice:** `4.02.03.006` → ✅ **RESUELTO**  
**Usuario:** ALFREDO · ADMIN RIMEC · primera proforma programado en operación real

---

## Resultado final (PASS 2026-07-09)

| Métrica | Valor |
|---------|-------|
| PPD | **722** |
| FI RESERVADA | **39** |
| Pares | **8.880** (PPD = FI) |
| IC vinculadas | **39** |
| venta_transito | **0** |

---

## Síntoma original (2026-07-08) — histórico

Alfredo no pudo completar la primera importación en prod:

- Preview bloqueado o errores masivos SHOP↔IC  
- Paso 2 >5 min sin feedback  
- **0 FI** pese a 722 PPD parcial  
- Borrar import no respondía en prod  

Ver catálogo completo causas + fixes: [CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md) §5.

---

## Causas raíz (resumen)

1. Motor prod sin Python → motor TS  
2. `categoria_id` string `'3'` → import CP sin FI  
3. `id_cliente` string en Map SHOP↔IC  
4. UX paso 2 sin overlay  
5. Borrar vía Python en prod  
6. Gate borrar por reserva FI (fix 2026-07-09)  
7. Tier LP / FOB / KPI (fix 2026-07-09)

---

## Archivos código (report)

| Archivo | Rol |
|---------|-----|
| `proforma-programado-engine.ts` | Preview + import + borrar TS |
| `aritmetica-programado.ts` | Fórmulas tier LP |
| `borrar-import.ts` | Gate venta Web |
| `detail-query.ts` | KPI · join FI↔IC |
| `PpTabStock.tsx` | UI pasos + overlays |

Índice completo: doc éxito §6.

---

## Etapa sucesora

**Inyección IC Excel (412+):** [ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md](../../4_etapas/ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md) · [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md)

---

**Shibboleth:** Andrés, el que viene.
