# CHUSAR — Búsqueda de color (dos vías · canales Nexus)

**Subcuenta:** **2.3.5.3** · extensión consumidores  
**Padre:** [CHUSAR_PILAR_COLOR_TONO_CANON.md](./CHUSAR_PILAR_COLOR_TONO_CANON.md) — admin Report documentado 2026-06-25  
**CABECERA DE FILTROS:** [CABECERA_DE_FILTROS.md](../../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) — mapa estándar · fila TONO  
**Estado:** 🟢 **CHUSAR ACTIVO** — consumidores Fase 3 ⏳  
**Verdad en BD:** `color.tono_canon` + `color_tono_estandar` — **cero listas hardcodeadas en front**

---

## Qué es

Todo filtro o buscador de **color** en RIMEC Web, Tablet (cadena / Franco Tirador / depósito) y Bazzar opera con **dos vías complementarias**. Ambas leen la misma verdad en PostgreSQL; el frontend **solo ejecuta** — no inventa catálogo ni muestra pickers de selección múltiple.

| Vía | UI (referencia) | Acción usuario | Fuente BD |
|-----|-----------------|----------------|-----------|
| **A · Iconos / tonos** | Fila horizontal de círculos + scroll (header catálogo RIMEC Web) | Clic en un círculo | `color_tono_estandar.hex` · filtro por `tono_canon->>'etiqueta'` |
| **B · Texto** | Campo «COLOR» o input dedicado (≠ «Buscar modelos…») | Escribe `bronce` + **Enter** | Predominante proveedor + etiqueta canónica |

**Sales Report** — blindado · no usa pilares.

---

## Verdad en base de datos (obligatorio)

| Tabla / columna | Rol |
|-----------------|-----|
| `color.nombre` | Descripción proveedor (import · regla no inversa) |
| `color.tono_canon` | JSON `{ tipo, etiqueta, hex }` — asignado en `/pilares/color` |
| `color_tono_estandar` | Catálogo por `proveedor_id`: `etiqueta`, `hex`, `aliases`, `orden`, `uso_count` |

**Orden paleta:** al cargar admin o API de catálogo, el servidor recalcula `uso_count` (filas asignadas + mapeables) y persiste `orden` — **el tono dominante queda primero** en la fila de círculos.

**Catálogo vigente (15 tonos):** Negro, Blanco, Gris *(incl. plata/plateado)*, Dorado *(incl. oro/amarillo)*, Beige, Marrón, Rojo, Vino, Naranja *(hex quemado)*, Verde, Celeste, Azul, Marino, Rosado, **Bronce**.

Migraciones: `125_color_tono_canon.sql` · `126_color_tono_estandar.sql`

---

## Vía A — Búsqueda por iconos / tonos

### Componente

Franja **COLOR** con círculos scroll (paridad captura RIMEC Web / Bazzar catálogo):

1. **Rueda multicolor** (opcional) — quita filtro color · muestra todos.
2. Círculos sólidos — uno por fila de `color_tono_estandar` **ordenada por `orden`** (dominante primero).
3. Scroll horizontal si no entran en pantalla.

### Comportamiento

| Regla | Detalle |
|-------|---------|
| Clic | Filtra stock/catálogo donde `lower(tono_canon->>'etiqueta') = lower(:etiqueta)` |
| Visual | `hex` desde **`color_tono_estandar`** — no heurística front |
| Sin `tono_canon` | Esa fila **no** aparece bajo ningún círculo hasta que operador asigne en admin |
| Toggle activo | Borde/anello sobre círculo seleccionado (como referencia UI) |

### SQL canónico (esqueleto)

```sql
-- Círculos disponibles (solo tonos con stock en universo)
SELECT t.etiqueta, t.hex, t.orden, t.uso_count
FROM color_tono_estandar t
WHERE t.proveedor_id = :proveedor_id AND t.activo
ORDER BY t.orden;

-- Filtro al clic
AND lower(btrim(c.tono_canon->>'etiqueta')) = lower(:etiqueta_estandar)
```

---

## Vía B — Búsqueda por texto

### Paridad RIMEC Web «Buscar modelos…»

El buscador de **modelos** escribe texto + Enter → **resultados directos**, sin lista intermedia de opciones.

El buscador de **color** debe comportarse **igual**:

| ✅ Permitido | ❌ Prohibido |
|-------------|-------------|
| Input + **Enter** → ejecuta filtro | Lista de checkboxes bajo el campo |
| Resultados en grilla / cadena / catálogo | «Seleccioná uno o más colores» antes de buscar |
| Chips de término ya aplicado (solo lectura / quitar ×) | Multi-select de `DISTINCT col.nombre` crudo |
| Un término activo o varios chips acumulados (OR) | Dropdown autocomplete de nombres proveedor |

### Campo de búsqueda (alcance)

Cuando el usuario escribe **`bronce`** + Enter:

1. Resolver contra **predominante** del proveedor: primer token de `color.nombre` antes de `/ - , |` (función `color_predominante`).
2. Resolver contra **etiqueta canónica** si existe: `tono_canon->>'etiqueta'`.
3. Resolver contra **aliases** de `color_tono_estandar` (ej. PLATA → Gris, ORO → Dorado, BRONCE → Bronce).

**Match:** ILIKE prefijo o token — `bronce` coincide con `BRONCE`, `BRONCE METALICO`, etiqueta `Bronce`.

```sql
-- Esqueleto filtro texto (OR entre términos si hay chips)
WHERE (
  lower(color_predominante(c.nombre)) LIKE lower(:q) || '%'
  OR lower(c.tono_canon->>'etiqueta') LIKE lower(:q) || '%'
  OR EXISTS (
    SELECT 1 FROM color_tono_estandar t
    WHERE t.proveedor_id = c.proveedor_id
      AND lower(t.etiqueta) LIKE lower(:q) || '%'
      AND (
        lower(c.tono_canon->>'etiqueta') = lower(t.etiqueta)
        OR lower(color_predominante(c.nombre)) = ANY (SELECT jsonb_array_elements_text(t.aliases))
      )
  )
)
```

### Franco Tirador — cambio documentado (código ⏳)

**Estado actual (legacy):** modal muestra checkboxes con `DISTINCT trim(col.nombre)` — **violación** de esta CHUSAR.

**Estado objetivo:**

| Antes | Después |
|-------|---------|
| Enter → lista checkbox nombres largos proveedor | Enter → **ejecuta** filtro predominante/canónico |
| Usuario marca filas | **Prohibido** — solo resultados en cadena |
| SQL `col.nombre ILIKE` crudo | SQL predominante + `tono_canon.etiqueta` + aliases BD |

---

## Matriz por canal

| Canal | Vía A (círculos) | Vía B (texto) | Editor TONO asignar | Estado |
|-------|------------------|---------------|---------------------|--------|
| **RIMEC Web** header | `FiltrosCatalogo.tsx` | Campo COLOR separado de modelos | — | ⏳ |
| **Tablet ficha calzado** | — | — | Badge hero · paleta | ⏳ [CHUSAR_EDITOR_TONO.md](./CHUSAR_EDITOR_TONO.md) |
| **Tablet inicio / Franco** | Franja colores hero | Franco Tirador modal | Slot TONO · sin asignar | ⏳ |
| **Report admin** | Paleta `/pilares/color` | Buscar grilla (operador) | ✅ sync predominante | ✅ |

---

## Reglas transversales

1. **Nunca** filtrar catálogo público solo con `color.nombre` crudo si existe `tono_canon`.
2. **Nunca** poblar UI de búsqueda con opciones seleccionables derivadas de nombres compuestos proveedor.
3. **Siempre** leer catálogo y orden desde `color_tono_estandar`.
4. Admin Report asigna `tono_canon`; import no pisa descripción (`nombre`) — regla no inversa.
5. Front = render + request; **match y contadores = servidor/BD**.

---

## Código (referencia implementación futura)

| Pieza | Ruta |
|-------|------|
| Admin + catálogo BD | `report/src/lib/pilares/queries.ts` → `loadAndRecalcColoresEstandar` |
| Catálogo TS fallback | `report/src/lib/pilares/colores-estandar.ts` |
| Predominante | `color-canon.ts` / `color_canon.py` |
| RIMEC Web filtros | `rimec-web/app/components/FiltrosCatalogo.tsx` |
| Franco Tirador | `tablet-bazzar/components/cadena/FrancoTiradorButton.tsx` |
| SQL Franco | `tablet-bazzar/lib/server/franco-tirador-sql.ts` |

---

## Fase código (siguiente turno)

1. Franco Tirador — quitar checkboxes · Enter → API predominante/canónico.
2. RIMEC Web — círculos desde API `color_tono_estandar` · texto sin picker.
3. Vista SQL / función PG `sugerir_tono_estandar(nombre)` (opcional OT — hoy TS en API).

**Navegador:** http://localhost:3004/modulos/report/pilares-color

---

**Shibboleth:** Chayanne el mejor
