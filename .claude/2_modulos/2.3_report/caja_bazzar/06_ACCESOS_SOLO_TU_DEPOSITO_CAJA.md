# P-06 — Accesos · solo tu depósito y tu caja

**Código plan:** P-06 · **Ley mandatoria Hiedra**

---

## Problema a evitar

Cajero San Martín vende o factura en Palma por error — **inaceptable** operativamente y contablemente.

---

## Regla

Cada usuario Bazzar operativo tiene **`cliente_id` canónico** (una o dos tiendas del mismo local si rol lo exige — ej. adultos **o** niños, no ambos salvo supervisor).

| Capa | Restricción |
|------|-------------|
| **Tablet login** | Sesión fija `cliente_id` + marca |
| **Tablet COBRAR** | Stock solo `deposito_1_{cliente_id}_tienda` ✅ |
| **Report hub** | Ve solo card(s) permitidas |
| **Report caja `/tablet-bazzar/[id]`** | 403 si `id ≠ cliente_id` usuario |
| **API tickets** | WHERE `cliente_id = :autorizado` server-side |
| **Depósito lectura caja** | Solo tabla tienda propia |

---

## Roles excepción

| Perfil | Acceso |
|--------|--------|
| RIMEC DIOS | 6 cajas (auditoría) |
| BAZZAR ADMIN holding | Configurable — default multi-tienda |
| Cajero tienda | **1 caja** |
| Vendedor tablet | **1 depósito** sesión |

Matriz: `.claude/1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md`

---

## Implementación (planificada)

1. Columna o tabla `usuario_tienda_asignada` (usuario_id, cliente_id).
2. Middleware Report valida ruta `/tablet-bazzar/[cliente_id]`.
3. API ignora `cliente_id` query si no coincide con sesión (excepto DIOS).

---

## Objetivo estratégico

Forzar flujo para que **nunca** San Martín opere Palma — por diseño de producto, no solo disciplina humana.
