# Protocolo — Bitácora · Usuarios · Reversiones · Bloqueo

**Nivel:** FUNDAMENTO operativo — obligatorio en mudanza Streamlit → Report  
**Relacionado:** [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../PIEDRA_CIMIENTO_COSTO_ARTICULO.md) · [sistema_permisos.md](../../2_modulos/2.3_report/sistema_permisos.md) · `control_central/core/auditoria.py`  
**Actualizado:** 2026-06-19 · **Shibboleth:** Chayanne el mejor

---

## I. Ley suprema — Cierre en COMPRA

Cuando el **ARTÍCULO** (molécula / PP / líneas de compra) **pasa a COMPRA**, el registro queda **cerrado para análisis posterior**.

| Momento exacto | Señal en BD | Efecto |
|----------------|-------------|--------|
| **Paso a Compra** | `pedido_proveedor.estado = 'ENVIADO'` + fila en `compra_legal_pedido` | **Cierre operativo** — nadie edita listado, proforma, FI, moléculas PP ni precios del ciclo |
| **Finalizar CL** | `compra_legal.estado = 'DISTRIBUIDA'` (+ traspasos) | **Cierre legal-logístico** — sin reversión salvo OT excepcional Director |
| **Post facturación / depósito** | FI confirmada · traspaso ENVIADO/CONFIRMADO | **Cierre contable** — solo append (movimientos compensatorios), nunca UPDATE destructivo |

### Regla inquebrantable

> **Ningún usuario — incluido Nivel Dios (`rol_id=1` + `categoria=DIOS`) — puede editar datos del ciclo ARTÍCULO ya en COMPRA desde la UI.**

- No hay botón «deshacer» para operadores.
- No hay excepción «soy admin» en pantalla.
- El dato cerrado es la **foto de verdad** para informes de **COSTO** y auditoría gerencial.

**Gap actual (conocido):** existe `rechazar_pp_de_compra` en Streamlit — debe quedar **solo holding vía OT**, no self-service. Report no debe exponer reversión a usuarios.

---

## II. Matriz — qué hace cada usuario

Fuente canónica de identidad: **`usuario_v2`** (`id_usuario`, `descp_usuario`, `rol_id`, `categoria`).

### Roles holding (Report + Nexus)

| rol_id | Nombre | Quién | Qué puede hacer | Qué NO puede |
|--------|--------|-------|-----------------|--------------|
| **1** | Admin / Desarrollo | Director, equipo dev | Todos los módulos Report · Motor · IC · PP · CL · Aprobaciones *(Aprobaciones solo si `categoria=DIOS`)* | **Editar post-COMPRA** · revertir sin OT |
| **2** | Operativo Bazzar | Admin/SU/Vendedor tienda | Según `categoria` — ver [sistema_permisos.md](../../2_modulos/2.3_report/sistema_permisos.md) | Ciclo importadora RIMEC · Motor · PP · CL |
| **3** | Ventas fotos | Consultores ventas | `/ventas-fotos` | Resto Report operativo |

### Categorías dentro de rol 1 (Nexus / Report)

| categoria | Módulos típicos | Acciones permitidas |
|-----------|-----------------|---------------------|
| **DIOS** | Aprobaciones FI · auditoría nivel dios | Aprobar/rechazar FI · consultar audit — **no** editar PP en COMPRA |
| **ADMIN / GERENTE** | Motor · IC · Digitación · PP · CL lectura | Operar ciclo **hasta** paso a Compra |
| **OPERARIO** | Depósito · logística | Movimientos · ingresos — sin tocar precios/casos |
| **VENDEDOR** | Ventas · FI preventa | Crear/reservar FI en PP abierto |

### Streamlit (Control Central) — módulos por sidebar

| Módulo | Usuario típico | Mutaciones BD | Bitácora obligatoria |
|--------|----------------|---------------|----------------------|
| Motor de precios | Admin importación | evento · precio_lista · biblioteca | `precio_auditoria` |
| Intención de compra | Gerencia | IC estados | `flujo_auditoria` |
| Digitación | Operador fábrica | IC↔PP | `flujo_auditoria` |
| Pedido proveedor | Compras | PP · proforma · FI | `flujo_auditoria` + `pedido_proveedor_log` |
| Compra legal | Compras / Director | CL · traspaso | `flujo_auditoria` |
| Aprobaciones | DIOS | FI confirmación | `flujo_auditoria` |

### Tabla rápida — ciclo ARTÍCULO × permiso de edición

| Etapa | Código Moria | Editable operador | Cerrado en COMPRA |
|-------|--------------|-------------------|-------------------|
| Biblioteca / casos | 2.3.1.7.1 | Sí (maestro) | — |
| Listado / evento | 2.3.1.7.2 | Sí hasta cierre evento | — |
| IC | 2.3.1.7.3 | Sí hasta AUTORIZADO | — |
| Digitación | 2.3.1.7.4 | Sí hasta PP cerrado | — |
| PP | 2.3.1.7.5 | Sí si `ABIERTO`/`CERRADO` | **No** si `ENVIADO` |
| Compra legal | 2.3.1.8 | Solo agregar PP pendiente | **No** editar snapshot |
| Facturación / Depósito | 2.3.1.9–10 | Logística append-only | **No** |

---

## III. Bitácora del proyecto — dónde se registra todo

### Tablas forenses (append-only)

| Tabla | Ámbito | Contenido | Inmutable |
|-------|--------|-----------|-----------|
| **`flujo_auditoria`** | IC · Digitación · PP · CL · traspaso | `entidad`, `accion`, `estado_antes/despues`, `snap` JSONB, `usuario_id` | ✅ INSERT only |
| **`pedido_proveedor_log`** | PP | Cambios de `estado` PP + `compra_legal_id` | ✅ INSERT only |
| **`precio_auditoria`** | Motor | Cambios campo a campo en evento | ✅ INSERT only |

API Python: `control_central/core/auditoria.py` → `log_flujo()`, catálogo `A.*`.

### Consultas operativas (holding)

```sql
-- Historial de un PP
SELECT * FROM flujo_auditoria
WHERE entidad = 'PP' AND entidad_id = :pp_id
ORDER BY created_at;

-- Log de estados PP
SELECT * FROM pedido_proveedor_log
WHERE pp_id = :pp_id ORDER BY timestamp;

-- Feed reciente (últimas 50 acciones sistema)
SELECT entidad, nro_registro, accion, usuario_id, created_at
FROM flujo_auditoria ORDER BY created_at DESC LIMIT 50;
```

### Pendiente implementación (OT futura)

| Ítem | Objetivo | Estado |
|------|----------|--------|
| Cablear `log_flujo` en **todos** los módulos Streamlit + APIs Report | Cobertura 100 % transiciones | 🟡 Parcial (IC·DG·PP·CL·Aprob) |
| Vista Report `/holding/bitacora` | Director — feed + filtro por usuario | ✅ **Activo** |
| Columna `usuario_v2.bloqueado` + `bloqueado_motivo` | Bloqueo persistente BD | ✅ **MIG-119** |
| Tabla `holding_reversion_ot` | OT-id · script · evidencia · quien ejecutó | ⬜ Pendiente |

---

## IV. Protocolo de reversión — solo holding, nunca el usuario

Cuando un operador dice «me equivoqué», **no** revierte solo. Flujo obligatorio:

```
Usuario reporta → Director evalúa → OT-REVERSION-* → Cursor audita impacto
    → Claude ejecuta script TX → log_flujo(REVERSION_HOLDING) → evidencia OT → cierre
```

### Reglas

1. **Prohibido** botón «Revertir» visible para operadores en post-COMPRA.
2. Toda reversión exige **OT** en `ot/en_curso/` + evidencia `OT-*-EVIDENCIA`.
3. Ejecutor: **Claude Code** (o script firmado holding) — no el usuario que cometió el error.
4. Antes de TX: **snapshot** (`snap` JSONB) del estado actual en `flujo_auditoria`.
5. Después de TX: segundo registro `accion=REVERSION_HOLDING` con `estado_antes/despues` y referencia OT.

### Matriz de reversión permitida (holding)

| Situación | Reversible | Función / camino | Condición |
|-----------|------------|------------------|-----------|
| IC mal autorizada | Sí | `devolver_ic` / `IC_DEVUELTA_ADMIN` | Pre-PP o PP sin COMPRA |
| PP enviado a CL por error | **Excepcional** | `rechazar_pp_de_compra` | CL **PENDIENTE**, traspasos solo `BORRADOR`, sin `finalizar_compra` |
| CL finalizada DISTRIBUIDA | **No** rutinario | — | Solo OT Director + análisis contable |
| FI aprobada por error | Excepcional | Script holding + bitácora | OT + DIOS autoriza por escrito |
| Listado / caso biblioteca | Sí (pre-evento cerrado) | Motor | No tocar eventos ya usados en PP ENVIADO |

### Plantilla OT reversión (título)

`OT-REVERSION-[ENTIDAD]-[NRO]-001.md` — incluir: quién pidió, qué rompió, SQL plan, rollback plan, `auditoria_auto: PASS/FAIL`.

---

## V. Bloqueo inmediato de usuario

Comportamiento inapropiado, intentos de fraude o bypass de COMPRA → **bloqueo inmediato**.

### Niveles de bloqueo

| Nivel | Alcance | Cómo |
|-------|---------|------|
| **1 — Sesión** | Streamlit browser | Rate-limit ya activo: 5 intentos → 15 min (`core/auth.py`) |
| **2 — App Report** | Todas las sesiones JWT | Subir `REPORT_SESSION_VERSION` + invalidar cookie |
| **3 — BD (objetivo)** | Login imposible | `usuario_v2.bloqueado = true` *(columna pendiente MIG)* |

### Procedimiento holding (ahora)

1. Director ordena bloqueo → Cursor redacta OT-SEGURIDAD-USUARIO-*.
2. **Report:** incrementar `REPORT_SESSION_VERSION` en middleware + session.
3. **Streamlit:** comunicar al operador; opcional deshabilitar fila en `usuario_v2` vía script Claude.
4. Registrar en `flujo_auditoria`: `accion=USUARIO_BLOQUEADO`, `snap={motivo, modulo, evidencia}`.
5. Revisar `flujo_auditoria` + `pedido_proveedor_log` del usuario **antes** de desbloquear.

### Desbloqueo

Solo Director. Requiere OT + revisión bitácora del incidente. Nunca automático.

---

## VI. Enlace con COSTO e informes

Los informes de **COSTO** (Sales Report histórico + proyecciones operativas) **confían** en que post-COMPRA nadie mutó el rastro. Si holding revierte, la bitácora debe mostrar **dos fotos**: estado cerrado original + reversión — para que gerencia no mezcle estrategias.

Ver [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../PIEDRA_CIMIENTO_COSTO_ARTICULO.md) § V (análisis de estrategias).

---

## VII. Checklist agente (Cursor / Claude)

Antes de merge en módulos IC · PP · CL · Aprobaciones:

- [ ] ¿La UI impide editar si `PP.estado = ENVIADO` o CL ≥ DISTRIBUIDA?
- [ ] ¿Cada transición llama `log_flujo` o equivalente?
- [ ] ¿No hay botón revertir visible al operador post-COMPRA?
- [ ] ¿Middleware Report respeta rol + categoría?
- [ ] ¿Reversión documentada solo vía OT?

---

**Estado:** 🟢 ACTIVO — **IMPLEMENTADO** 2026-06-19 (MIG-119 · Report `/holding/bitacora` · cierre COMPRA en código)  
**Validación Director:** pendiente firma formal
