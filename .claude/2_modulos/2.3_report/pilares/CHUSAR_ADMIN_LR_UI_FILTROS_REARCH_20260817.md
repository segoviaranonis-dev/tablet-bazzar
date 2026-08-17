# CHUSAR — Admin LR · Re-arquitectura UI responsiva + filtros que mutan BD

**Código:** **2.3.5.11**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta + ejecuta (Director: UI locura · filtros ingeniería BD no sirven)  
**App:** Report `:3000/pilares/linea-referencia`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**Padres:** siameses **2.3.5.5.1** · estilo 638 **2.3.5.10**  
**🆕 MOISES · 2026-08-17**

---

## Auditoría (qué estaba roto)

| Síntoma | Causa |
|---------|--------|
| UI “locura” | Sidebar dual a pantalla completa · tabla ancha sin cards móvil · editor+SDRM siempre abiertos |
| Filtro **Compra previa (CP)** | **No existía** en `appendLrFilters` (solo PE) |
| Filtro **Tipo** (promo/liquidación…) | Cableado en líneas, **omitido** en L×R |
| **Material / Color** | UI decorativa: `selected=[]` · `onToggle` no-op · cascada siempre `[]` |
| PE en 638 | Match L×R con ref retail `K` ≠ LR → casi 0 hits |
| Editor masivo | Solo rango de códigos · **no** aplicaba el universo del filtro (ingeniería BD huérfana) |
| Scope PATCH | `buildLrScopeWhere` sin `tipoV2Id` → imagen/rama 638 mal |

---

## Ley UI (re-arquitectura)

1. **Desktop (≥lg):** filtros sticky izquierda · grilla derecha.  
2. **Móvil:** filtros apilados · filas en **cards** · tabla solo `md+`.  
3. SDRM + editor masivo dentro de `<details>` colapsado.  
4. **Filtro = universo de trabajo** · editor masivo modo **Aplicar a filtro** (default) o **Por rango**.

---

## Ley filtros → SQL / PATCH

| Filtro | Comportamiento |
|--------|----------------|
| CP | `EXISTS v_stock_rimec` (638 por `linea_id`; 654 también `referencia_id`) |
| PE / depósito | **SDRM venta hoy** · PE ∩ staging `stock` qty>0 · tipo/proveedor estrictos · 638 por línea (**2.3.5.12**) |
| Tipo grupos | COD.GRUPO en staging (dígitos 654/638) |
| Material / Color | familias desde staging · multi real |
| Editor scope | PATCH `scope:true` + mismos params que GET |

---

## Archivos

| Archivo | Rol |
|---------|-----|
| `queries.ts` | CP · Tipo · M/C · PE por línea 638 · cascada familias · scope+tipoV2 |
| `linea-referencia/route.ts` | `filterOpts` GET/POST completos |
| `PilaresLrFiltrosSidebar.tsx` | Material/Color reales · layout responsivo |
| `LineaReferenciaEditor.tsx` | Modo filtro + rango |
| `LineaReferenciaAdminClient.tsx` | Grid sticky · cards móvil |

Smoke: `npx tsx scripts/_smoke_lr_filtros_638.ts` → **PASS** (ej. todos 2902 · CP 117 · problemas 1108).

---

## Smoke Director

1. `:3000/pilares/linea-referencia?tipo_v2_id=2` → layout filtros|grilla.  
2. Chip **Compra previa** → total baja (≠ todos).  
3. Estilo multi + **Aplicar a filtro** en editor → muta solo el universo filtrado.  
4. Ancho móvil ~375 → cards, no tabla rota.

---

## Relacionados

**2.3.5.5.1** siameses · **2.3.5.10** estilo col J / thumb línea
