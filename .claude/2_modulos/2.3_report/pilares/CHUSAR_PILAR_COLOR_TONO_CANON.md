# CHUSAR — Pilar Color · tono_canon (Report)

**Subcuenta:** **2.3.5.3**  
**Etapa:** ✅ [ETAPA_PILAR_COLOR_TONO_CANON_CERRADA.md](../../../4_etapas/ETAPA_PILAR_COLOR_TONO_CANON_CERRADA.md)  
**Estado:** ✅ **CHUSAR CERRADO** — admin Report + filtro TONO tablet cadena · 2026-06-28  
**Sub-etapa abierta:** **2.3.5.3.1** → [CHUSAR_EDITOR_TONO.md](./CHUSAR_EDITOR_TONO.md)  
**Búsqueda consumidores:** [CHUSAR_BUSQUEDA_COLOR_CANALES.md](./CHUSAR_BUSQUEDA_COLOR_CANALES.md)  
**Migraciones:** `125_color_tono_canon.sql` · `126_color_tono_estandar.sql`

---

## Qué es

Administrador del pilar **`color`** en Report. La verdad para filtros y buscadores vive **100% en PostgreSQL**:

| Campo / tabla | Rol |
|---------------|-----|
| `color.nombre` | Descripción proveedor — regla **no inversa** · puede venir ES / PT / EN |
| `color.tono_canon` | JSON operativo por fila: etiqueta filtro + hex o paleta |
| `color_tono_estandar` | Catálogo estándar por proveedor: hex, aliases, **orden**, **uso_count** |

**Sales Report** — blindado · no usa pilares.

---

## Política idioma (654 Beira Rio y resto)

| Capa | Idioma | Regla |
|------|--------|--------|
| `color.nombre` | Cualquiera (PT/EN/ES del proveedor) | **Sync tal cual** · nunca traducir ni pisar texto existente |
| `tono_canon.etiqueta` | **Español** (Negro, Marino, Beige…) | Operador o sugerencia automática (excepto **Otros**) |
| Import xlsx | Columnas `COLOR CODE` + `COLOR` | Panel en `/pilares/color` · API `POST /api/pilares/color/import` |

Constante código: `POLITICA_IDIOMA_COLOR` en `report/src/lib/pilares/import-color-xlsx.ts`.

---

## Catálogo estándar (BD)

Tabla **`color_tono_estandar`** — seed migración 126 · upsert hex/aliases desde `colores-estandar.ts` en cada GET.

| Tono | Hex | Aliases clave |
|------|-----|----------------|
| **Marino** | `#1e3a5f` | marino · **marina** · **marihq** · **mariho** · marinha · navy |
| **Otros** | preview `#64748b` | multicolor · **solo manual** (ver abajo) |
| Gris | `#9e9e9e` | plata · plateado · cinza… |
| Dorado | `#ffd54f` | oro · amarillo · mostaza… |
| … | … | 16 entradas en `COLORES_ESTANDAR_DEFAULT` |

**Orden dinámico:** cada GET `/api/pilares/color` recalcula repeticiones dominantes y persiste `orden` (más usado = posición 1 en paleta).

---

## Reglas de sugerencia automática

Funciones: `sugerirColorEstandarFromCatalog` · `isAutoSuggestable` · `colorPredominante` · aliases en BD.

| Regla | Comportamiento |
|-------|----------------|
| Predominante | Primer token antes de `/ , - \|` → sugerencia por alias |
| MARINA / MARIHQ / MARIHO | → **Marino** `#1e3a5f` |
| **Otros / multicolor** | **Prohibido auto-asignar** — operador elige en paleta |
| Bulk import / rango «sugerir nombre» | Omite filas sin match · nunca asigna Otros |
| Compuesto `NEGRO/BLANCO` | Sugiere **Negro** (1.er token) — **no** Otros automático |

```typescript
// isAutoSuggestable — Otros y multicolor = null en sugerencia
export function isAutoSuggestable(c: ColorEstandar | null): boolean
```

---

## Otros · multicolor (manual)

| Aspecto | Detalle |
|---------|---------|
| Etiqueta filtro | `Otros` |
| `tono_canon` | `{ "tipo": "paleta", "etiqueta": "Otros", "swatches": [...] }` |
| Paleta UI | Círculo arcoíris (conic-gradient) |
| Auto-sugerencia | **NO** — import masivo, grilla, editor rango |

---

## Sync por predominante (guardado automático)

Al cambiar etiqueta en **una** fila, se persisten **todas** las filas del mismo proveedor con el **mismo predominante** (1.er token de `nombre`).

| UI | Al elegir dropdown o paleta → PATCH inmediato · sin botón Guardar |
|----|---------------------------------------------------------------------|
| ✕ | Limpia `tono_canon` de todo el grupo predominante |
| Ejemplo | `JEANS` · `JEANS 1123` → predominante `JEANS` · un cambio actualiza ambos |

**API:**

```http
PATCH /api/pilares/color
{
  "tipo_v2_id": 1,
  "sync_predominante": true,
  "predominante": "JEANS",
  "tono_canon": { "tipo": "solido", "etiqueta": "Gris", "hex": "#9e9e9e" }
}
```

Código: `patchColorByPredominante` · `report/src/lib/pilares/queries.ts`.

---

## Formato `tono_canon`

```json
{ "tipo": "solido", "etiqueta": "Marino", "hex": "#1e3a5f" }
```

```json
{ "tipo": "paleta", "etiqueta": "Otros", "swatches": ["#c62828", "#1565c0", "..."] }
```

Filtros públicos: **`tono_canon->>'etiqueta'`** — nunca `nombre` crudo.

**Sin tono (SQL):** `tono_canon IS NULL OR btrim(tono_canon->>'etiqueta') = ''` — constantes `SQL_COLOR_SIN_TONO` / `SQL_COLOR_CON_TONO`.

---

## UI Report `/pilares/color`

| Pieza | Función |
|-------|---------|
| KPIs clicables | Filtros combinables: sin/con descripción · sin/con tono · multiselect etiquetas canónicas |
| Grilla | cod · nombre · predominante · etiqueta · tono · ✕ grupo |
| Import xlsx | Accordion Beira Rio 654 · opción sugerir tono tras import |
| Editor rango | Códigos inicial–final · sugerir estándar (sin Otros auto) |
| Paleta | Círculos BD · dominante primero · Otros multicolor visible |
| Sin match | `-- sin tono --` · operador elige · predominante muestra hint |

Ruta: http://localhost:3001/pilares/color?tipo_v2_id=1

---

## API

```
GET   /api/pilares/color?tipo_v2_id=1&limit=500
      &sin_nombre=1&con_nombre=1&sin_tono=1&con_tono=1&etiquetas=Marino,Gris
      → rows + total + resumen + estandar[]

POST  /api/pilares/color/import
      FormData: tipo_v2_id · file (.xlsx) · suggest_tono=1

PATCH /api/pilares/color
      → fila (id) | rango | clear_tono | sync_predominante
```

Respuestas no-JSON (500 dev): cliente usa `readJsonResponse` — mensaje legible, no parse error.

---

## Dos vías de búsqueda (consumidores)

Documentación completa: **[CHUSAR_BUSQUEDA_COLOR_CANALES.md](./CHUSAR_BUSQUEDA_COLOR_CANALES.md)**

| Vía | Resumen |
|-----|---------|
| **A · Iconos** | Clic círculo → filtra por etiqueta canónica |
| **B · Texto** | Enter → predominante + canónico · **sin checkboxes** |

**Consumidor tablet cadena (Fase 3 parcial):** ✅ [CHUSAR_TABLET_CADENA_TONO.md](../../2.4_tablet_bazzar/CHUSAR_TABLET_CADENA_TONO.md) · hotfix `9569eb2`.  
**Pendiente 2.3.5.3.1:** Franco Tirador · RIMEC Web · badge Editor TONO ficha.

**Prohibido en todos los canales:** lista multi-select de `col.nombre` proveedor bajo el input color.

---

## Dev local Report

| Problema | Acción |
|----------|--------|
| `ChunkLoadError` / 500 / `routes-manifest.json` | `report\REINICIAR_DEV.bat` — borra `.next` |
| Regla | **No** `npm run build` con `next dev` abierto |
| Recarga | Ctrl+Shift+R tras reinicio dev |

---

## Código

| Pieza | Ruta |
|-------|------|
| Migraciones | `control_central/migrations/125_*.sql` · `126_*.sql` |
| Queries | `report/src/lib/pilares/queries.ts` |
| Catálogo + sugerencia | `report/src/lib/pilares/colores-estandar.ts` |
| Canon JSON | `report/src/lib/pilares/color-canon.ts` |
| Import xlsx | `report/src/lib/pilares/import-color-xlsx.ts` |
| Admin UI | `report/src/app/pilares/components/ColorAdminClient.tsx` |
| Import panel | `ColorImportPanel.tsx` |
| API | `report/src/app/api/pilares/color/route.ts` · `…/import/route.ts` |
| Fetch seguro | `report/src/lib/fetch-json.ts` |
| Script sync 654 | `report/scripts/run-color-sync-654.ts` |

**Navegador Moria:** http://localhost:3004/modulos/report/pilares-color

---

## Checklist cierre (Director 2026-06-28)

- [x] Import descripciones 654 xlsx + política multilingüe documentada
- [x] KPI filtros combinables + grilla coherente con SQL sin/con tono
- [x] Marino marina/marihq/mariho
- [x] Otros multicolor paleta · sin auto-asignación
- [x] Sync predominante + guardado automático BD
- [x] Deploy Report admin · commit `c6be01f`
- [x] Filtro TONO tablet cadena · commit `9569eb2`
- [x] Etapa cerrada · `etapas.json` · [CIERRE doc](../../../4_etapas/ETAPA_PILAR_COLOR_TONO_CANON_CERRADA.md)

---

**Documentado por orden del Director — 2026-06-28 · etapa 2.3.5.3 cerrada**

**Shibboleth:** Chayanne el mejor
