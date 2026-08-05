# CHUSAR — Ordenamiento por KPIs · Herramienta de reposición AM

**Código:** **2.3.1.24**  
**Keyword:** **Documenta** · Director 2026-07-15 (ampliado mismo día: PE/CP + overlay)  
**Estado:** 🟢 local listo · ⛔ prod hasta **Cierra etapa** u orden directa  
**App:** Report · http://localhost:3000/herramienta-reposicion  
**Padre:** [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](./CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) (**2.3.1.22**) · niveles [CHUSAR_REPOSICION_NIVELES_AM.md](./CHUSAR_REPOSICION_NIVELES_AM.md) (**2.3.1.23**)  
**Handoff cierre:** [CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md](./CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md) (**2.3.1.25**)  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Qué es

Cuatro modos de orden (KPI clickeable · chip `#1…#n` · Σ enteros = KPI, tol. 0):

| KPI | Modo | Σ holding auditada (MIG-159) |
|-----|------|------------------------------|
| **En stock (PE)** | `peDisponible` | **198.254** |
| **En tránsito (CP disp.)** | `cpDisponible` | **27.868** |
| **Vendido (CP)** | `cpVendido` (default) | **9.632** |
| **Programado** | `programado` | **65.752** |

- **Inicio:** tarjetas **desplegadas** · botón Compactar.  
- **Chip:** solo ranking `#n` en modo métrica (categoría N1/N2/N3 en filtros).  
- **Aritmética:** `enteroPares` / `Math.trunc` · transferencia bancaria.

---

## 2 · Overlay «Ordenando» (feedback al click)

| Problema | Causa | Fix |
|----------|-------|-----|
| Overlay tardaba ~9s | `setState` reconciliaba ~9.7k tarjetas antes del paint | Portal **imperativo** fuera del árbol de grilla |
| Meta Director | Entrada visible &lt; 0,5s (aceptable ~4s en máquina pesada tras fix) | `flushSync` + 2×`rAF` + 16ms **antes** de `setOrdenModo` |

| Pieza | Path |
|-------|------|
| Overlay UI | `report/src/components/report/RimecOrdenandoOverlay.tsx` |
| Portal imperativo | `report/src/components/report/rimec-ordenando-imperativo.ts` |
| Hook | `report/src/hooks/useOrdenReposicionConAnimacion.ts` |
| Grilla memo | `report/src/components/herramienta-reposicion/ReposicionGrilla.tsx` |

NIIF: `NIIF_ORDEN_ENTRADA_MAX_MS` en `navigation-latency.ts` · navegación sigue usando delay 500ms; **orden KPI = delay 0** (portal).

---

## 3 · Latencia datos (cuenta arrancada)

| Capa | Mecánica |
|------|----------|
| Servidor | Cache memoria proceso TTL 5 min · **no** `unstable_cache` (payload ~7–8 MB &gt; 2 MB Next) · `?fresh=1` |
| Cliente | `sessionStorage` si cuota · reorder KPI sin re-fetch |
| BD | MIG-158 + **MIG-159** · `v_am_reposicion_orden_metricas` |

```sql
SELECT SUM(pe_disponible), SUM(cp_disponible), SUM(cp_vendido), SUM(programado), COUNT(*)
FROM v_am_reposicion_orden_metricas;
-- Esperado holding: 198254 · 27868 · 9632 · 65752 · ~9751
```

---

## 4 · Código Report (índice)

| Pieza | Path |
|-------|------|
| Orden / ranks | `orden-compra-previa.ts` |
| Totales enteros | `totales-reposicion.ts` · `enteroPares` |
| Merge buckets | `merge-reposicion.ts` |
| Client | `HerramientaReposicionClient.tsx` |
| SQL | `report/migrations/158_*.sql` · `159_v_am_reposicion_orden_pe_cp_disp.sql` |

---

## 5 · Ratificación Director

1. Cuatro KPIs ordenan con la misma lógica.  
2. Σ consecutivas = KPI (enteros).  
3. Overlay prioritario al click (proceso puede tardar detrás).  
4. Listo local · deploy solo en cierre etapa / orden directa.  
5. Documentado (**2.3.1.24** · Documenta 2026-07-15).

**Integrado:** Documenta · Cursor Auto · 2026-07-15
