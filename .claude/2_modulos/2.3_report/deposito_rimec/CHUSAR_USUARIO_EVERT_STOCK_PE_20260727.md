# CHUSAR — Usuario EVERT · Stock PE sin asignar descuentos

**Código:** **2.3.1.10.1.4.2** · Padre **2.3.1.10.1.4** (asignación descuentos)  
**Ratificado:** 2026-07-27 · orden Director **Documenta**  
**App:** Report `/stock-pronta-entrega`  
**Shibboleth:** Andrés, el que viene.

---

## Usuario

| Campo | Valor |
|-------|-------|
| `descp_usuario` | **EVERT** |
| Password | `2207` |
| `id_usuario` | **42** |
| `rol_id` | **1** (RIMEC) |
| `categoria` | **ADMIN** |
| `ente_id` | **1** (RIMEC) |
| Script | `report/scripts/ensure_evert_admin_pe.mjs` |

---

## Permisos (ley Director)

| Capacidad | EVERT (ADMIN) | DIOS |
|-----------|---------------|------|
| Entrar Report · Stock pronta entrega | ✅ | ✅ |
| Ver grilla / filtros / % ya dictados (GET) | ✅ | ✅ |
| **Asignar descuentos** (botón + POST) | ❌ | ✅ solo |

**Frase:** *Stock PE sí · dictar descuento no — eso es Nivel Dios.*

---

## Gate técnico (mismo turno)

| Capa | Cambio |
|------|--------|
| API POST | `/api/stock-pronta-entrega/asignacion-descuento` → `requireMotorPreciosNivelDios()` |
| API GET | Sigue `requireMotorPreciosAdmin()` (rol_id=1) — lectura % |
| UI | Botón «Asignar descuento» solo si sesión DIOS (`StockProntaEntregaClient`) |

---

## Relacionados

- [CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](./CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md) · **2.3.1.10.1.4**  
- [MATRIZ_ROLES_ACCESOS_HOLDING.md](../../../1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md)
