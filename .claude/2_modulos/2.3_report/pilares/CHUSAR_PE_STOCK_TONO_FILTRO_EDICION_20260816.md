# CHUSAR — Cable TONO ↔ Stock Pronta Entrega · filtro + edición · una verdad

**Código:** **2.3.5.3.2**  
**Fecha:** 2026-08-16  
**Keyword:** **Documenta** · **abre esta etapa**  
**Padre:** **2.3.5.3** [CHUSAR_PILAR_COLOR_TONO_CANON.md](./CHUSAR_PILAR_COLOR_TONO_CANON.md) · hermano **2.3.5.3.1** [CHUSAR_EDITOR_TONO.md](./CHUSAR_EDITOR_TONO.md)  
**Etapa:** [ETAPA_PE_STOCK_TONO_EDICION_20260816.md](../../../4_etapas/ETAPA_PE_STOCK_TONO_EDICION_20260816.md)  
**App:** Report `:3000/stock-pronta-entrega` · tab **Operativa**  
**Estado:** 🟡 **ETAPA ABIERTA** · UI ✅ · cable Admin↔PE CONFIRMADO · **PROD Report** `528dbb6` · https://rimec-report.vercel.app · falta smoke cruzado / **Cierra etapa**  
**Deploy:** 2026-08-16 · `dpl_C6gwXVbpeyJE1UNzXtUgSuQHiJe1` · orden Director Documenta+despliega  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## 0b · Confirmación Director — comunicación directa (Documenta 2026-08-16)

**Sí:** hay cable **directo** entre Administrador de tono y Stock Pronta Entrega.  
**Sí:** todo lo que entra en `/pilares/color` **permanece** como información del tono del pilar `color` — PE **no** guarda tono propio.

| Dirección | Mecanismo |
|-----------|-----------|
| Admin → PE | Admin PATCH `color.tono_canon` → grilla PE lee `col.tono_canon->>'etiqueta'` AS `tono_etiqueta` (`queries-productos-grilla.ts` JOIN `color`) |
| PE → Admin / todas las apps | Círculo tarjeta `PeEditorTonoCircle` → **mismo** `PATCH /api/pilares/color` (`tono_canon` / `clear_tono`) |
| Filtro cabecera PE | `FiltroTonoOperativa` sobre etiqueta canónica (misma verdad) |

**Prohibido / no existe:** tono en staging SDRM, PPD, Excel o estado UI paralelo. Una fila `color` = una verdad de tono para Admin · PE · Web · Tablet.

---

## 0 · Orden Director (capturas)

1. **Cable** TONO ↔ Stock Pronta Entrega.  
2. En la tarjeta PE, **donde está el círculo vacío** (junto a marca) → mostrar el **tono** del Administrador de tono y **poder cambiarlo**.  
3. En la **cabecera** PE → agregar **filtro TONO** (misma fila de círculos que RIMEC Web / Tablet).  
4. **Una sola fuente de verdad** — no inventar tono en PE.  
5. Jerarquía: TONO ≈ pilar · es el **instrumento del pilar `color`**.

---

## 1 · Ley — una verdad (inviolable)

| Capa | Rol |
|------|-----|
| **Pilar** | `color` (identidad estable · FK imports) |
| **Instrumento / verdad operativa** | `color.tono_canon` + catálogo `color_tono_estandar` |
| **Admin canónico** | Report `/pilares/color` |
| **Escritura permitida** | Solo PATCH a `color.tono_canon` (mismo contrato API pilares) |
| **Lectura** | Todas las herramientas consumen `tono_canon.etiqueta` / hex |

**Prohibido:**

- Guardar tono en staging SDRM, PPD snapshot, Excel Carlos o UI local-only.  
- Filtrar PE por `color.nombre` / `descp_color` crudo.  
- Segunda tabla “tono_pe”.  
- Sales Report — blindado · no entra.

```
/pilares/color  ←── PATCH /api/pilares/color ──→  EditorTono en tarjeta PE
       ↑                                                    │
 color_tono_estandar                              color.tono_canon
       ↑                                                    │
       └──── Filtro cabecera PE · Web · Tablet · AM ────────┘
```

---

## 2 · Objetivo UI — Stock Pronta Entrega

### 2.1 · Cabecera — filtro TONO

| Pieza | Spec |
|-------|------|
| Ubicación | Cabecera operativa PE (hermano visual de RIMEC Web fila TONO) |
| Controles | Rueda / «todos» · **Sin asignar** · círculos `color_tono_estandar` |
| Filtro SQL/memoria | `tono_canon->>'etiqueta'` · `sin_tono` |
| Reutilizar | `FiltroTonoOperativa` / `FiltroTonoRow` · catálogo ya cargado en `StockPeContext.tonoCatalog` |

### 2.2 · Tarjeta — círculo = Editor TONO

| Pieza | Spec |
|-------|------|
| Slot | Círculo junto a **marca** (hoy vacío / placeholder) en `PeCardMiniatura` |
| Con tono | Círculo relleno `tonoCircleStyle(tono_canon)` · tooltip etiqueta ES |
| Sin tono | Borde punteado · tooltip «Asignar TONO» |
| Clic | Abre paleta estándar · **PATCH inmediato** `color_id` de la molécula · sin Guardar |
| Sync | Misma regla `sync_predominante` / API pilares que Admin Color |

**Auth:** rol con permiso pilares color (o depósito DIOS/ADMIN Report) — definir en implementación; no abrir PATCH anónimo.

---

## 3 · Mapa — todas las herramientas que usan TONO

Todas **leen** `color.tono_canon`. Solo las marcadas **escriben**.

| # | Herramienta | App / ruta | Lee | Escribe | Estado |
|---|-------------|------------|-----|---------|--------|
| 1 | **Administrador Color** | Report `/pilares/color` | ✅ | ✅ **fuente** | 🟢 PROD |
| 2 | **Miniatura + orden tono** | Report `/pilares/color` | ✅ | ✅ | 🟢 **2.3.5.5.2** |
| 3 | **Catálogo vendedores — filtro TONO** | RIMEC Web `:3001` cabecera | ✅ | ❌ | 🟡 / parcial **2.2.1.1** |
| 4 | **Tarjeta catálogo — fila tonos** | RIMEC Web `CatalogTonosFila` | ✅ | ❌ | 🟢 |
| 5 | **Tablet depósito — FiltroTono** | Tablet / `FiltroTonoOperativa` | ✅ | ❌ | 🟢 cadena |
| 6 | **Tablet — Editor TONO ficha** | tablet-bazzar | ✅ | ⏳ **2.3.5.3.1** | ⏳ |
| 7 | **Franco Tirador / cola sin tono** | tablet-bazzar | ✅ | ⏳ | ⏳ |
| 8 | **Stock Pronta Entrega — filtro cabecera** | Report `/stock-pronta-entrega` | ✅ | ❌ (solo filtra) | 🟢 local · deploy Report orden 2026-08-16 |
| 9 | **Stock PE — círculo tarjeta** | `PeCardMiniatura` / `PeEditorTonoCircle` | ✅ | ✅ **mismo PATCH Admin** | 🟢 local · deploy Report orden 2026-08-16 |
| 10 | **Tab Artículos PE · torta tono** | Report PE Artículos | ✅ | ❌ | 🟢 lee |
| 11 | **Alejandro Magno / operativa depósito** | Report depósito | ✅ | ❌ | según superficie |
| 12 | **Vistas stock** | `v_stock_pe_rimec.color_tono_canon` | ✅ | ❌ | enrich pilar |

**Regla:** si una herramienta nueva necesita TONO → **consume** esta verdad; si necesita asignar → **EditorTONO** + PATCH pilares · nunca otra fuente.

---

## 4 · Jerarquía (pilares)

```
Pilares Retail
├── linea · referencia · material · color · talla_grada
└── color
      └── TONO (tono_canon)  ← herramienta / dimensión de filtro
            catálogo: color_tono_estandar
            admin: /pilares/color
            edición remota: EditorTono (PE · Tablet · futuro Web ficha)
```

TONO **no** es un sexto pilar de tabla aparte: es la **capa canónica del pilar color** (misma altura operativa que estilo/género en filtros).

---

## 5 · Checklist implementación (etapa)

| # | Entregable | PASS |
|---|------------|------|
| 1 | Filtro TONO cabecera PE (círculos + Sin asignar) | ✅ |
| 2 | Círculo en tarjeta = tono actual | ✅ |
| 3 | Clic → paleta → PATCH `/api/pilares/color` | ✅ |
| 4 | RIMEC Web / Tablet ven el cambio sin redeploy datos | misma fila `color` · smoke cruzado ⏳ |
| 5 | Smoke: mol sin tono → asignar Negro → filtro Negro lista la mol | ⏳ |
| 6 | Documenta cierre + `etapas.json` hecho | al **Cierra etapa** |

**Deploy Report:** autorizado por **orden directa Director** («documenta y despliega» 2026-08-16) — no requiere cierre etapa.

---

## 6 · Relacionados

| Código | Doc |
|--------|-----|
| 2.3.5.3 | Pilar color tono canon |
| 2.3.5.3.1 | Editor TONO (palabra reservada) |
| 2.3.5.5.2 | Miniatura tono Admin |
| 2.2.1.1 | Cabecera filtros Web |
| 2.4 | Tablet cadena TONO |
| 2.3.1.10.1 | Stock pronta entrega |

---

**Shibboleth:** Andrés, el que viene. Protocolo Chusar · Moria + ACTUAL acatados.
