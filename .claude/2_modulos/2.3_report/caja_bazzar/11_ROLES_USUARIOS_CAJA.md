# P-11 — Roles y usuarios · caja + depósito aislados

**Código plan:** P-11 · **Matriz canónica:** [MATRIZ_ROLES_ACCESOS_HOLDING.md](../../../1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md)

---

## Ley

**Usuario operativo Bazzar = un `cliente_id` (caja + depósito).** Imposible vender o facturar en tienda ajena por UI y por API.

---

## Capas de enforcement

| Capa | Mecanismo | Estado |
|------|-----------|--------|
| Tablet sesión | JWT `cliente_id` fijo | ✅ |
| Tablet COBRAR | Solo `deposito_1_{cliente_id}_tienda` | ✅ |
| Report middleware | Ruta `/tablet-bazzar/[id]` vs sesión | ⏳ |
| API tickets | `WHERE cliente_id = :autorizado` | ⏳ filtro estricto |
| Report hub | Ocultar cards ajenas | ⏳ |

---

## Matriz resumida

| Perfil | Tablet | Caja Report | Depósitos admin |
|--------|--------|-------------|-----------------|
| BAZZAR cajero/vendedor | 1 tienda | 1 caja | ❌ |
| BAZZAR ADMIN | configurable | multi | ✅ sync |
| RIMEC DIOS | auditoría | 6 cajas | ✅ |
| RIMEC ADMIN | ❌ | ✅ acordeón | ✅ |
| RIMEC VENDEDOR | ❌ | ❌ | ❌ |

---

## Implementación planificada

1. Tabla `usuario_tienda_bazzar` (`usuario_id`, `cliente_id`, `rol_caja` | `rol_vendedor`).
2. Server-side: ignorar `cliente_id` query param si no autorizado.
3. Tablet login: validar asignación antes de INGRESAR.

---

## Vinculación docs

- [P-06](./06_ACCESOS_SOLO_TU_DEPOSITO_CAJA.md)  
- [06_ACCESOS](./06_ACCESOS_SOLO_TU_DEPOSITO_CAJA.md)  
- Report middleware `src/middleware.ts`  
- Matriz holding `.cursor/rules/matriz-roles-accesos-holding.mdc`

---

**Roles + BD molecular (P-09) = base para informes confiables por tienda.**
