# CHUSAR — Editor TONO · palabra reservada · asignación por icono

**Subcuenta:** **2.3.5.3.1** *(sub-etapa Fase 3 · dentro de tono_canon)*  
**Padre:** [CHUSAR_PILAR_COLOR_TONO_CANON.md](./CHUSAR_PILAR_COLOR_TONO_CANON.md) · [CHUSAR_BUSQUEDA_COLOR_CANALES.md](./CHUSAR_BUSQUEDA_COLOR_CANALES.md)  
**Triángulo header:** [TRIANGULO_HEADER_PILARES.md](../../../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md)  
**CABECERA DE FILTROS:** [CABECERA_DE_FILTROS.md](../../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)  
**Estado:** 🟢 **CHUSAR ACTIVO** — etapa padre **2.3.5.3 cerrada** · esta sub-etapa ⏳  
**Padre cerrado:** [ETAPA_PILAR_COLOR_TONO_CANON_CERRADA.md](../../../4_etapas/ETAPA_PILAR_COLOR_TONO_CANON_CERRADA.md) · 2026-06-28  
**Documentado:** 2026-06-26 · orden Director

---

## Palabra reservada — **TONO**

Cuando el Director dice **«TONO»**, **«filtro de tono»**, **«editor de tono»** o **«asignación por icono»**, significa **siempre** esto:

| ✅ Es TONO | ❌ No es TONO |
|-----------|---------------|
| UI de círculos / paleta ligada a `color.tono_canon` | Dropdown de `color.nombre` crudo proveedor |
| Filtro por `tono_canon->>'etiqueta'` (Negro, Marino…) | Regex hex sobre descripción |
| Asignar / ver tono desde catálogo `color_tono_estandar` | Traducir o editar `color.nombre` |
| Comunicación con admin `/pilares/color` (misma verdad BD) | Lista checkbox DISTINCT nombre proveedor |

**Verdad única:** PostgreSQL `color.tono_canon` + catálogo `color_tono_estandar`.  
**Sales Report** — blindado · no entra.

---

## Qué es el Editor TONO

Componente reutilizable que:

1. **Muestra** el tono asignado (círculo sólido, paleta multicolor, etiqueta ES).
2. Si **no hay** `tono_canon` → icono vacío / punteado · **clic abre paleta**.
3. Al elegir icono → **PATCH inmediato** a BD (misma regla sync predominante que Report cuando aplica).
4. **No** pide botón Guardar en consumidor.

```
Report /pilares/color  ←── PATCH /api/pilares/color ──→  Editor TONO (Tablet · RIMEC Web)
         ↑                           ↑
   color_tono_estandar          color.tono_canon
```

---

## Dos modos del mismo componente

| Modo | Acción usuario | Efecto |
|------|----------------|--------|
| **Filtrar** | Clic círculo en header (Vía A) | Restringe catálogo/stock por etiqueta canónica |
| **Asignar** | Clic badge vacío en ficha / fila sin tono | Abre paleta · persiste `tono_canon` · refresca UI |

Mismo catálogo · mismo orden dominante · misma API.

---

## Superficies (mapa Director)

### 0 · Stock Pronta Entrega — filtro + edición (FOCO 2026-08-16)

**Código:** **2.3.5.3.2** · [CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md](./CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md)

| Pieza | Rol TONO |
|-------|----------|
| Cabecera PE | **Filtro** círculos + Sin asignar |
| Círculo junto a marca en tarjeta | **Editor** · PATCH `color.tono_canon` |
| Verdad | Misma que `/pilares/color` — una fuente |

---

### 1 · Tablet — ficha calzado (detalle cadena)

**Referencia captura:** badge superior derecho sobre foto (antes texto crudo `MARINA 115M / 208702`).

| Antes | Después (Editor TONO) |
|-------|------------------------|
| Texto nombre color proveedor | Círculo + etiqueta **Marino** si asignado |
| Sin tono en BD | Círculo punteado · clic → paleta |
| — | PATCH predominante o `color_id` según contexto fila |

**Ruta dev:** `tablet-bazzar` cadena / hero producto.  
**Código objetivo:** componente `EditorTono` + API tablet → Report pilares (proxy) o SQL directo con auth depósito.

---

### 2 · RIMEC Web — header catálogo (triángulo + fila COLOR)

**Referencia captura:** franja **COLOR** con rueda multicolor + círculos scroll (`FiltrosCatalogo.tsx`).

| Pieza | Rol TONO |
|-------|----------|
| Triángulo | Género · Marca · Estilo · Tipo 1 (pilares `linea` / `linea_referencia`) |
| **Fila COLOR** | **Filtro TONO** Vía A — círculos desde `color_tono_estandar` ordenados |
| Rueda multicolor | Quitar filtro color (todos) |

**Estado código:** ⏳ migrar filtro de `descp_color` / hex regex → `tono_canon.etiqueta`.  
**Ruta:** `rimec-web/app/components/FiltrosCatalogo.tsx` · `CatalogoClient.tsx`.

---

### 3 · Tablet — inicio depósito / Franco Tirador (cola sin asignar)

**Referencia captura:** slot **TONO** junto a buscador «Línea, ref, marca…» en vista referencias.

| Flujo operador | Detalle |
|----------------|---------|
| 1 | Activa filtro **«sin TONO»** (solo ítems sin `tono_canon`) |
| 2 | Lista referencias con foto calzado visible |
| 3 | Clic fila → abre ficha o inline **Editor TONO** |
| 4 | Asigna por icono · desaparece de cola sin asignar |

**Objetivo:** velocidad de curación masiva en piso (ver calzado + asignar sin entrar a Report).

**Ruta dev:** `DepositoFiltrosHeader.tsx` · cadena ingresar · Franco Tirador.  
**Slot UI:** etiqueta **TONO** canónica (no «Color» genérico en este modo asignación).

---

## API compartida (consumidores)

Reutilizar contrato Report ya implementado:

```http
GET  /api/pilares/color?tipo_v2_id=1&limit=1
     → estandar[] (catálogo ordenado)

GET  /api/pilares/color?sin_tono=1&…
     → filas sin tono_canon (cola asignación)

PATCH /api/pilares/color
{
  "tipo_v2_id": 1,
  "sync_predominante": true,
  "predominante": "JEANS",
  "tono_canon": { "tipo": "solido", "etiqueta": "Gris", "hex": "#9e9e9e" }
}
```

**Otros (multicolor):** solo asignación **manual** en paleta — nunca auto-sugerencia (regla admin 2026-06-25).

**Auth consumidor:** definir en OT — mínimo rol depósito/tablet con permiso PATCH tono; Report admin sigue siendo `rol_id=1` pilares.

---

## Reglas UI (todas las superficies)

1. Círculos = `hex` de `color_tono_estandar` · orden = `orden` BD.
2. **Otros** = gradiente conic (tipo paleta) · etiqueta filtro `Otros`.
3. Sin tono = borde punteado · tooltip «Asignar TONO».
4. Clic asignación = PATCH + refresh · sin Guardar.
5. Prohibido checkbox lista nombres proveedor (Franco Tirador legacy).

---

## Fases implementación (2.3.5.3.1)

| # | Entregable | App | Estado |
|---|------------|-----|--------|
| 1 | Spec CHUSAR + palabra TONO | Moria | ✅ |
| 1b | Filtro TONO `/cadena` → vista (SQL + URL) | tablet-bazzar | ✅ `9569eb2` · [CHUSAR_TABLET_CADENA_TONO](../../2.4_tablet_bazzar/CHUSAR_TABLET_CADENA_TONO.md) |
| 2 | Componente `EditorTono` + paleta API | `report` (referencia) → tablet | ⏳ |
| 3 | Badge ficha calzado tablet | tablet-bazzar | ⏳ |
| 4 | Filtro TONO header RIMEC Web | rimec-web | ⏳ |
| 5 | Slot TONO inicio + cola sin asignar | tablet-bazzar | ⏳ |
| 7 | Slot TONO + edición en Stock Pronta Entrega | report `/stock-pronta-entrega` | 🟡 **2.3.5.3.2** etapa abierta |

---

## Índice rápido Director → agente

| Orden Director | Acción agente |
|----------------|---------------|
| «Agregá filtro **TONO** acá» | Vía A círculos · `tono_canon.etiqueta` · no nombre crudo |
| «Editor **TONO** en ficha» | Badge + paleta + PATCH |
| «Cola sin **TONO**» | `sin_tono=1` + lista + asignación por icono |
| «Paleta como Report» | `loadAndRecalcColoresEstandar` / `estandar[]` |

---

**Shibboleth:** Chayanne el mejor
