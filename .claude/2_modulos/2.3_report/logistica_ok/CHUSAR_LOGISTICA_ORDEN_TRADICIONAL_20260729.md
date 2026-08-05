# CHUSAR — Logística Rimec · Orden tradicional (PDF Graciela)

**Código:** `2.3.1.28.16`  
**Fecha:** 2026-07-29  
**Keyword:** Documenta · Director («documenta lo pendiente»)  
**App:** Report `/logistica-ok/rimec` · solo modo Rimec  
**Etapa:** `LOGISTICA-RIMEC-TXT-20260728`  
**Referencia gerencia:** `Z:\graciela\87227617.pdf` — LISTADO DE FACTURAS A ENTREGAR/ENTREGADO (Carlos)

---

## Objeción gerencia → ley UI

| Objeción | Ley |
|----------|-----|
| Observación siempre visible | Columna **Observación** en tabla (texto Excel/`logistica_rimec_pendiente.observacion`) · no solo icono ✉️ · line-clamp 3 + `title` |
| No dos agrupaciones confusas | Un toggle: **Orden tradicional** (default) \| **Ordenar por origen** |
| Parecerse al listado Carlos | Bloques `(COD) CLIENTE` · tabla densa mono · pie cajas/importe |

---

## Toggle

| Opción | Comportamiento |
|--------|----------------|
| **Orden tradicional** (inicio) | `groupLogisticaRimecPorCliente` · COD ASC |
| **Ordenar por origen** | `groupLogisticaRimecPorEntidad` · PE → PROGRAMADO → CP |

Persistencia: `sessionStorage` clave `logistica-rimec-orden`.

Pestañas: General · Confirmadas (cuando Rimec).

---

## Datos

- `LogisticaPendienteRow.observacion` + `codigo_cliente_carlos`
- Map: `rimecToPendienteRow` en `report/src/lib/logistica-rimec/queries.ts`
- Agrupador: `report/src/lib/logistica-rimec/group-entidad.ts`
- UI: `TablaTradicionalRimec` + `AcordeonClientesTradicional` en `LogisticaOkClient.tsx`

Arranque Rimec: pestaña **General** (no Entregas vacía). Sin sesión: mensaje «Iniciá sesión» (no «Sin filas»).

---

## Estado / pendientes

| Ítem | Estado |
|------|--------|
| Código local orden tradicional | ✅ |
| Smoke unit agrupación | ✅ PASS |
| Smoke UI toggle + HTTP 200 | ✅ |
| Smoke con sesión · 129 FI · obs visibles en bloques | ⏳ validar Director en browser logueado |
| Deploy prod Report (este UI post-`b64c3e1`) | ⏳ esperar **DESPLIGA** / cierre etapa |
| Prefijos artículos · saldo (PDF Carlos) | fuera de alcance salvo nueva orden |
| Empareje FI Nexus 1:1 | fase 2 etapa |

**Proceso** (`/logistica-ok/proceso`) no cambia.
