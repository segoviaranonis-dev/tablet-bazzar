# Flujo OT y auditoría

## Ciclo estándar (sistema «Ejecuta la OT»)

```
1. Director → objetivo a Cursor (lenguaje negocio)
2. Cursor   → OT en ot/en_curso/ + actualizar ot/COLA.md + vaciar plantilla RESPUESTA
3. Director → a Claude o Antigravity: «Ejecuta la OT»  (una sola frase)
4. Ejecutor → ot/PROTOCOLO → lee COLA → ejecuta → llena ot/RESPUESTA_EJECUTOR.md
5. Cursor   → responde §5 RESPUESTA + auditoría P1–P8 → PASS/FAIL
6. Director → lee solo RESPUESTA §1 (resumen) y decide siguiente objetivo
```

**No** se envían rutas ni adjuntos al ejecutor: todo está en `ot/COLA.md`.

## Nomenclatura OT

`OT-<DOMINIO>-<TEMA>-<NNN>-<REV>.md`

Ejemplos: `OT-MOTOR-REING-519-001.md`, `OT-RESTABLECIMIENTO-NEXUS-CORE-001.md`

## Evidencia mínima (JSON)

```json
{
  "ot_id": "OT-...",
  "commit": "abc1234",
  "auditoria_auto": "PENDING_MANUAL | PASS | FAIL | CONDICIONAL",
  "checks": [{ "id": "C1", "pass": true, "expected": "...", "actual": "..." }]
}
```

Claude **no** pone `"auditoria_auto": "PASS"` sin revisión Cursor cuando el Director pidió integridad.

## Veredictos

| Veredicto | Significado |
|-----------|-------------|
| **PASS** | Cumple contrato + P1–P8; listo producción |
| **CONDICIONAL** | Código OK; falta prueba manual o deploy (SESSION_SECRET, etc.) |
| **FAIL** | Violación pilar, parche prohibido, o evidencia incompleta |

## Dónde viven los archivos

| Tipo | Ubicación preferida |
|------|---------------------|
| OT transversal holding | `Nexus_Core/OT-*.md` |
| OT producto Streamlit | `control_central/OT-*.md` |
| Registro estado | `control_central/docs/OT_REGISTRO_ESTADO.md` |
| Integridad P1–P8 | `control_central/docs/CONTROL_INTEGRIDAD_HOLDING.md` |

## Asignación por tipo de OT

| Tipo | Ejecuta | Audita | Diseña |
|------|---------|--------|--------|
| SQL / migración / índices | Claude | Cursor | — |
| Motor / Streamlit | Claude | Cursor | Antigravity (UX) |
| Next.js web | Claude | Cursor | Antigravity |
| Solo UI/mockup | Antigravity → Claude integra | Cursor | Antigravity |
