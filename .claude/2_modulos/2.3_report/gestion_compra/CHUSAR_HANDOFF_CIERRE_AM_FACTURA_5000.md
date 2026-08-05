# CHUSAR — Handoff cierre Alejandro Magno · dependencia factura cliente 5000

**Código:** **2.3.1.25**  
**Keyword:** **Documenta** · Director 2026-07-15  
**Estado:** ✅ **Desbloqueado 2026-07-16** · FI cliente 5000 = 0 · etapa pruebas cerrada · Report ya en prod `4baed85`  
**Etapa madre:** [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](../../../4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md) · `OPERATIVO-ALEJANDRO-MAGNO-2026`  
**Cliente pruebas:** [CHUSAR_CLIENTE_5000_PRUEBAS.md](../../2.2_rimec_web/CHUSAR_CLIENTE_5000_PRUEBAS.md) (**2.2.1.0.9**)  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Instrucción al otro agente (leer primero)

El Director espera **interacción ventas ↔ Alejandro Magno** vía factura interna del **cliente 5000** (prueba).  
Cuando cierres tu tramo, dejá un **reporte** con la sección §3 de este doc (copiar y completar).  
Cursor (AM) deja este archivo como contrato de handoff: **no push / no deploy Report** hasta que ese reporte exista y el Director diga **Cierra etapa** u **despliega**.

---

## 1 · Qué ya está listo en AM (Cursor · local)

| Ítem | Código / doc | Evidencia |
|------|----------------|-----------|
| Herramienta reposición | **2.3.1.22** | `/herramienta-reposicion` · 4 paneles |
| Niveles N1/N2/N3 | **2.3.1.23** | Filtros + chip categoría |
| Orden 4 KPIs + Σ bancaria | **2.3.1.24** | PE 198254 · CP 27868 · Vend 9632 · Prog 65752 |
| Overlay orden (portal) | **2.3.1.24** §2 | Imperativo · grilla memo |
| MIG SQL | 158 + **159** | `v_am_reposicion_orden_metricas` |
| Cache API | memoria Node TTL 5 min | `queries-cached.ts` |

**App Report:** http://localhost:3000/herramienta-reposicion  
**Hub:** `/rimec?mundo=panel-control` → Herramienta de reposición!!!

---

## 2 · Dependencia única para cierre AM

| Campo | Valor |
|-------|--------|
| Bloqueo | Agente factura interna · **cliente_id = 5000** |
| Objetivo | Ver que una venta/FI de prueba **mueve** métricas AM (Vendido CP / stock / etc.) sin romper CP real |
| Aislamiento | Solo 5000 · ver **2.2.1.0.9** · no tocar otros clientes ni SR blindado |
| Tras PASS | Director puede **Cierra etapa** AM + deploy Report (puertas CHUNA) |

---

## 3 · Plantilla de reporte (otro agente — completar)

```markdown
### Reporte handoff → cierre AM (cliente 5000)

**Fecha:** YYYY-MM-DD  
**Agente:** …  
**FI id(s):** …  
**Estado FI:** CONFIRMADA / ANULADA / …

| Chequeo | Resultado | Nota |
|---------|-----------|------|
| FI creada solo cliente 5000 | OK / FAIL | |
| Stock/PPD afectado esperado (PE o CP) | OK / FAIL | antes→después |
| KPI AM Vendido (CP) / PE / etc. refleja el movimiento | OK / FAIL | ruta `/herramienta-reposicion` |
| Otros clientes / CP real intactos | OK / FAIL | |
| Sales Report no tocado | OK / FAIL | |

**Pasos smoke (orden):**
1. …
2. …
3. …

**Bloqueantes residuales:** ninguno | …

**Listo para Cierra etapa AM + deploy Report:** SÍ / NO
```

Pegar el bloque completado en chat Director y/o anexar a este CHUSAR (con **Documenta**).

---

## 4 · Checklist Cursor (cuando Director cierre)

- [ ] Reporte §3 = **SÍ** listo para cierre  
- [ ] Director: **Cierra etapa** (o deploy explícito)  
- [ ] Doc `ETAPA_*_CERRADA` + `ACTUAL` + índices  
- [ ] `nexus-navegador-holding/config/etapas.json` → `hecho` + `cerradasPorModulo`  
- [ ] Aplicar MIG-158/159 en prod Supabase si aún no  
- [ ] Commit + push Report (scope AM) · Vercel  
- [ ] Smoke prod: KPIs + orden overlay + Σ = cabecera  

**Prohibido ahora:** commit/push/deploy solo por «inminente» — Director eligió **solo prep** 2026-07-15.

---

## 5 · Archivos código a incluir en el deploy Report (cuando toque)

```
report/src/lib/herramienta-reposicion/*
report/src/components/herramienta-reposicion/*
report/src/components/report/RimecOrdenandoOverlay.tsx
report/src/components/report/rimec-ordenando-imperativo.ts
report/src/hooks/useOrdenReposicionConAnimacion.ts
report/src/app/api/herramienta-reposicion/route.ts
report/src/lib/niif/navigation-latency.ts
report/migrations/158_v_am_reposicion_orden_metricas.sql
report/migrations/159_v_am_reposicion_orden_pe_cp_disp.sql
```

---

**Integrado:** Documenta · Cursor Auto · 2026-07-15 · prep cierre sin push
