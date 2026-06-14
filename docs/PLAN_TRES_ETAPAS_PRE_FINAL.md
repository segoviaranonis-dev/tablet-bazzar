# Plan tres etapas — Pre-etapa final Tablet Bazzar

**Fecha:** 2026-06-14  
**Origen:** `AUDITORIA_PRE_ETAPA_FINAL.md`  
**Objetivo:** Desbloquear etapa final (tickets ORO · deploy 60 tablets) en 3 fases secuenciales  
**Regla:** No saltar etapa. Cada una cierra con evidencia PASS antes de la siguiente.

---

## Mapa general

```
ETAPA 1 — OPS + Storage (fundación imágenes)     ← COMENZAMOS AQUÍ
    ↓ PASS: ≥95% sm/ HEAD 200 + márgenes contain por marca
ETAPA 2 — Velocidad F1 (código tablet cadena)
    ↓ PASS: TTFB/payload medidos · hero first paint
ETAPA 3 — Precisión + cierre diseño (UX piso)
    ↓ PASS: 50 swaps · Director aprueba
ETAPA FINAL — Tickets ORO · carrito · deploy
```

| # | Nombre | Foco | Ejecutor principal | Doc |
|---|--------|------|-------------------|-----|
| **1** | OPS + Storage | Imágenes contain en Supabase | Claude Code (ops) + Cursor (auditoría) | [ETAPA_1_OPS_STORAGE.md](./ETAPA_1_OPS_STORAGE.md) |
| **2** | Velocidad F1 | API cadena · red · parse · poll | Cursor (código) | `ETAPA_2_VELOCIDAD_F1.md` (al abrir) |
| **3** | Precisión + cierre | Hero fallback · parpadeo · QA piso | Cursor + Director | `ETAPA_3_PRECISION_CIERRE.md` (al abrir) |

---

## Dependencias entre etapas

| Etapa | Depende de | Por qué |
|-------|------------|---------|
| 2 | Etapa 1 PASS | Sin tiers correctos, optimizar red no arregla recorte ni doble HTTP |
| 3 | Etapa 2 PASS | Sin payload liviano, 50 swaps miden ruido de parse, no UX real |
| Final | Etapa 3 PASS | Gate `ACTUAL.md` — diseño aprobado |

---

## Estado actual

**Auditoría cierre Cursor 2026-06-14:** `evidencia/AUDITORIA_CIERRE_PRE_FINAL_20260614.json` → **FAIL global · cierre NO autorizado**

| Etapa | Estado |
|-------|--------|
| 1 OPS + Storage | **FAIL** — ACTVITTA 100% · VIZZANO 43.8% (sin evidencia cierre) |
| 2 Velocidad F1 | **PARCIAL** — V1/V2/V4/V7/V8 · pendiente V3/V5/V6 |
| 3 Precisión + cierre | **PASS código 7/7** · QA piso Director pendiente |

---

## Referencias

- Auditoría completa: `AUDITORIA_PRE_ETAPA_FINAL.md`
- Punto crítico: `.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md`
- Etapa madre: `.claude/4_etapas/ETAPA_TABLET_BAZZAR.md`
