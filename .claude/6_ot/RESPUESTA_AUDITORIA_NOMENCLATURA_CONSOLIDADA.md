# Auditoría Cursor — OT-NOMENCLATURA-PILARES-001 (consolidada)

**Fecha:** 2026-05-19  
**Veredicto global:** **IMPLEMENTADO EN DISCO** (2026-05-19) — pendiente Supabase 056 + PP reimport Director

---

## Matriz por ejecutor

| Vía | Ejecutor | Alcance | Veredicto Cursor | Evidencia |
|-----|----------|---------|------------------|-----------|
| Webs | Claude | `rimec-web/`, `bazzar-web/` | **PASS** | Grep independiente (abajo) |
| Nexus | Cursor | `control_central/` | **PASS inventario** · cambios Fase 1–2 pendientes | `RESPUESTA_AUDITORIA_NOMENCLATURA_NEXUS.md` |
| Report | Gemini | `report/src/` | **PENDIENTE** | `RESPUESTA_ANTIGRAVITY.md` sin completar en disco |

---

## Verificación webs (Cursor — reproduce Claude)

### Patrones prohibidos

```text
codigo_linea | codi_linea | id_linea | lineaCode
```

| Proyecto | Ocurrencias |
|----------|-------------|
| rimec-web | **0** |
| bazzar-web | **0** |

### Nomenclatura permitida / legacy

| Patrón | rimec-web | bazzar-web | Notas |
|--------|-----------|------------|-------|
| `linea_codigo` / `referencia_codigo` | 11 archivos TS/TSX | 10 archivos | Legacy UI desde `v_stock_web` — **OK** hasta Fase 3 SQL |
| `linea_id` / `codigo_proveedor` | Sí (ej. `fetchControl.ts`, `atributosLinea.ts`) | Parcial vía Supabase select | JOINs por FK/código — **OK** |
| `l.id::text = linea_codigo` | **0** | **0** | Sin anti-patrón JOIN |

**Conclusión webs:** conformes con ley P0. No hay sinónimos prohibidos ni JOINs rotos. `linea_codigo` (text) es deuda documentada — migración vista, no urgencia en TS.

**Nota:** `ot/RESPUESTA_EJECUTOR.md` en disco **no** tenía tablas §2–§3 al auditar; el mensaje del Director/Claude se validó por grep. Claude puede volcar el detalle al archivo si hace falta archivo.

---

## Decisión Fase 3 SQL (vistas) — recomendación Director

| Opción | Cuándo | Riesgo |
|--------|--------|--------|
| **A — No avanzar ahora** | Webs estables; prioridad PP reimport + 055 backfill | Bajo |
| **B — Fase 3 acotada** | Nueva migración: `v_stock_web` expone `linea_codigo_proveedor` **como alias** de `l.codigo_proveedor::text` y mantiene `linea_codigo` 6–12 meses | Medio |
| **C — Fase 3 + TS** | Alias SQL + renombrar tipos en rimec-web/bazzar-web en un solo release | Alto (coordinar deploy) |

**Recomendación Cursor:** **Opción A** hasta cerrar integridad pilares en PP (055 + reimport). **Opción B** cuando Director quiera deuda técnica SQL sin tocar front.

---

## Próximos pasos (orden sugerido)

1. **Director:** PP — borrar/reimportar + Paso 1 migración 055 si aplica.
2. **Gemini:** completar auditoría `report/` → `RESPUESTA_ANTIGRAVITY.md`.
3. **Claude / Cursor:** Fase 1 Nexus (`linea_cod` → canónico en PP/Motor) — código, no SQL vista.
4. **Director decide:** Fase 3 SQL (`v_stock_web`) — opción A o B arriba.

---

## Cierre OT (parcial)

| Fase OT | Estado |
|---------|--------|
| 0 Contrato | CERRADA |
| 0b Auditoría webs | **PASS** |
| 0b Nexus inventario | PASS |
| 0b Report | Abierta |
| 1–2 Código Nexus | Pendiente Director |
| 3 SQL vistas | Pendiente decisión Director |

---

*Auditoría Cursor — 2026-05-19*
