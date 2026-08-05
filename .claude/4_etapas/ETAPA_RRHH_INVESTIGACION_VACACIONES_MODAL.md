# ETAPA CERRADA — RRHH · Modal vacaciones (3b)

**Fecha inicio:** 2026-06-14  
**Fecha cierre:** 2026-06-16  
**Estado:** ✅ CERRADA  
**Módulo:** Report `/rrhh/vacaciones`  
**Frente:** report

---

## Problema (resuelto)

Al registrar horas (ej. 30 min):
- ✅ API persistía en PostgreSQL
- ✅ Alert mostraba total horas del response
- ❌ Modal mostraba "0 Tomados"

---

## Diagnóstico

### Causa 1 — UI mostraba días, no horas

El tile **Tomados** renderizaba `funcionarioLocal.dias_tomados`.  
30 min → `dias_equiv = floor(0.5/8) = 0` → `dias_tomados` sigue en 0 **correctamente en BD**.  
El estado `horas_tomadas` sí se actualizaba pero **no se mostraba**.

### Causa 2 — Race: useEffect pisaba el estado fresco

`useEffect` con dependencia `[funcionario]` resincronizaba desde prop stale tras `router.refresh()`, sobrescribiendo el estado actualizado por el API.

---

## Solución aplicada

1. Sincronizar solo al **abrir** otro funcionario (`id_funcionario + anio`), no en cada cambio de referencia del padre.
2. `setFuncionarioLocal` con **updater funcional** en `handleSuccess`.
3. Propagar al padre con `onFuncionarioUpdated` (sin `router.refresh` en el hot path).
4. Mostrar **horas tomadas** en el resumen del modal.

---

## Archivos tocados

- `report/src/app/rrhh/vacaciones/components/FuncionarioModalOptimizado.tsx`
- `report/src/app/rrhh/vacaciones/VacacionesClient.tsx`
- `HourPicker.tsx` — sin cambio lógico

---

## Evidencia funcional

Caso Alejandro (CI 5659702) — gerente, consume horas:

| Campo | Tras fix |
|-------|----------|
| `dias_tomados` | 0 (correcto si < 8h) |
| `horas_tomadas` | visible en UI (ej. 3h) |

---

## Documentación canónica post-cierre

[FUNCIONAMIENTO_ACTUAL.md](../2_modulos/2.3_report/rrhh/FUNCIONAMIENTO_ACTUAL.md) · [ETAPA_RRHH_CERRADA.md](./ETAPA_RRHH_CERRADA.md)

**Shibboleth:** 7 años
