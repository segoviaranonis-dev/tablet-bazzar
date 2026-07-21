# CHUSAR — Reposición · Filtros duales · Tipo · Familias Material/Color

**Código:** `2.3.1.26`  
**Actualizado:** 2026-07-17 · **Documenta** + **despliega** (Director)  
**Etapa:** [ETAPA_REPOSICION_FILTRO_ADICIONAL_20260716.md](../../../4_etapas/ETAPA_REPOSICION_FILTRO_ADICIONAL_20260716.md)  
**App:** Report · `/herramienta-reposicion` · http://localhost:3000/herramienta-reposicion  
**Shibboleth:** Andrés, el que viene.  
**Sales Report:** blindado · no tocar.

---

## 1. Propósito

Cabecera de filtros de la **Herramienta de reposición (Alejandro Magno)** rediseñada para:

1. Multi-selección por **FK** (dimensiones comerciales).
2. Filtro canónico **Tipo** (casos biblioteca + liquidación SDRM).
3. Filtros **Material** y **Color** por **familia de texto** (no códigos sueltos).
4. Layout a **margen izquierdo** · catálogo a ancho completo · dos bloques **ocultables**.

---

## 2. Layout — arquitectura de espacio

```
┌──────────────┬──────────────┬─────────────────────────────┐
│ Dimensiones  │  Molécula    │  Grilla / catálogo (flex-1) │
│ (ocultable)  │ (ocultable)  │                             │
└──────────────┴──────────────┴─────────────────────────────┘
```

| Zona | Contenido |
|------|-----------|
| KPIs | Moléculas · A→Z · PE · CP · Vendido · Programado |
| Bajo KPIs | **Tono** = `FiltroTonoOperativa` (círculos · **prohibido** checklist numérico) |
| Bloque 1 | Dimensiones FK + buscar + stock + sin imagen |
| Bloque 2 | Material · Color (familias) |
| Derecha | Tarjetas AM · niveles N1/N2/N3 |

**Colapso:** cada bloque → rail ~36px (`▸` + badge de filtros activos).  
**Pantalla:** `main` sin `max-w-7xl` · filtros pegados al margen izquierdo.  
**Móvil:** un `<details>` envuelve ambos bloques.

**Preestablecido:** Calzado (`tipo_v2=1`) · orden A→Z `línea.referencia`.

---

## 3. Bloque Dimensiones — orden canónico

| # | UI | Estado filtro | Fuente dato |
|---|-----|---------------|-------------|
| 1 | **Categoría** | `tipoV2Ids[]` | `tipo_v2_id` |
| 2 | **AB - CR** | `tipo1Ids[]` | `tipo_1_id` (antes «Tipo 1») |
| 3 | **Marca** | `marcaIds[]` | `marca_id` |
| 4 | **Tipo** | `tipoGrupos[]` | casos + SDRM (ver §4) |
| 5 | Género | `generoIds[]` | `genero_id` |
| 6 | Estilo | `grupoEstiloIds[]` | `grupo_estilo_id` |
| 7 | Línea | `lineaIds[]` | `linea_id` |

También: buscar `q` · «Solo con stock» · chip sin imagen · Reset.

---

## 4. Filtro canónico «Tipo»

**Módulo:** `report/src/lib/filtros/filtro-tipo-canonico.ts`  
**Doc app:** `report/docs/FILTRO_TIPO_CANONICO.md`  
**Reutilizable** en otros productos (depósitos, PE, etc.).

Combina dos verdades ya documentadas:

| Fuente | Señal | Origen |
|--------|-------|--------|
| **Casos biblioteca** | `caso_precio` / `caso_id` (`biblioteca_id`) · BCL línea→caso | MIG-153/154 PE · CP/programado vistas |
| **SDRM Alejandro Magno** | `es_liquidacion` · `cadena_comercial=LIQUIDACION` | Import Excel PE |

### Opciones UI (multi-select · OR)

| Opción | Regla |
|--------|--------|
| *(vacío = Todos)* | Sin filtro Tipo |
| **Normal** | Caso `ACT-BRSPORT` · `BR-VZ-MD-MKA-O` · alias `BR-VZ-MD-ML-MKA-O` |
| **Carteras** | Caso `CARTERAS` |
| **Promo** | Caso `PROMOCIONAL` · **`es_promo`** · `cadena_comercial=PROMOCIONAL` (prioridad sobre caso Normal) |
| **Liquidación** | `es_liquidacion` o cadena `LIQUIDACION` |

**Hermanos siameses:** misma ley en RIMEC Web — [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](../../2.2_rimec_web/CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) · error `4.01.04.002`.

Estado: `OperativaFilterState.tipoGrupos: TipoGrupoId[]`.  
Pipeline: PE/CP/programado → merge → `caso_precio` / `cadena_comercial` / `es_liquidacion` en `ReposicionArticulo` → `DepositoRow` → `applyOperativaFilters`.

---

## 5. Bloque Molécula — Material y Color

**No** listar `material_id` / `color_id` como opciones.  
**Sí** filtrar por **familia de texto** derivada de la descripción del pilar.

### 5.1 Primera palabra

`report/src/lib/pilares/primera-palabra-pilar.ts` · paridad `colorPredominante`.

Corta en el **primer** separador: espacio · `/` · `-` · `–` · `|` · `,`.

| Entrada | Token |
|---------|--------|
| `NAPA TURIM` | NAPA |
| `NEGRO/BLANCO` | NEGRO |
| `SINT-ECO` | SINT |

### 5.2 Reglas de familia (`agrupar-etiqueta-pilar.ts`)

| Regla | Efecto |
|-------|--------|
| Solo **texto** en opciones | Nunca códigos `100003` como fila suelta |
| 1ª palabra **solo dígitos** | Cubo único **NN** |
| Prefijo / 3 letras / consonantes | `Gas·Gasp·Gaspea` · `Nap·Napa·Np` · `Cam·Camur·Camurca` |
| Sinónimos Director | `Nap·Np·Napa` → etiqueta **Napa** · `Vz·Verniz` → **Verniz** |
| Orden UI | **Mayor recurrencia** (más moléculas) arriba · empate A→Z |

Estado: `materialFamilias: string[]` · `colorFamilias: string[]` (claves canónicas, p.ej. `NAPA`, `VERNIZ`, `NN`).

### 5.3 Latencia

1. **Cliente:** `stampFamiliaPilares(rows)` una vez al armar `asRows` · filtro por `familia_material` / `familia_color` sellados (sin Union-Find en cada click).
2. **BD (opcional):** MIG-166 · `fn_familia_pilar_etiqueta` · vistas `v_pilar_material_familia` / `v_pilar_color_familia` — **no aplicada a prod** hasta cierre etapa u orden (clustering fino sigue en cliente).

---

## 6. Flujo de datos (resumen)

```
API getHerramientaReposicion
  → PE (caso + SDRM) + CP (caso_precio) + Programado (caso_precio)
  → mergeReposicionArticulos
Cliente
  → reposicionArticuloToDepositoRow
  → stampFamiliaPilares
  → buildOperativaOpciones / applyOperativaFilters
  → grilla filtrada
```

---

## 7. Código ancla

```
report/src/components/herramienta-reposicion/ReposicionFiltrosSidebar.tsx
report/src/components/herramienta-reposicion/HerramientaReposicionClient.tsx
report/src/lib/depositos/operativa-filters.ts
report/src/lib/filtros/filtro-tipo-canonico.ts
report/src/lib/pilares/agrupar-etiqueta-pilar.ts
report/src/lib/pilares/primera-palabra-pilar.ts
report/src/lib/pilares/color-canon.ts
report/src/lib/herramienta-reposicion/merge-reposicion.ts
report/src/lib/herramienta-reposicion/reposicion-a-deposito-row.ts
report/migrations/166_v_pilar_familia_material_color.sql
report/docs/FILTRO_TIPO_CANONICO.md
report/docs/FAMILIAS_MATERIAL_COLOR_FILTRO.md
report/docs/PRIMERA_PALABRA_PILAR_FILTRO.md
```

---

## 8. Extender sinónimos

En `TOKEN_A_CANON` + `CANON_LABEL` dentro de `agrupar-etiqueta-pilar.ts`:

```ts
// ej. VZ → VERNIZ · etiqueta «Verniz»
// ej. NAP|NP|NAPA → NAPA · etiqueta «Napa»
```

---

## 9. Criterio de aceptación (Director)

- [x] Orden Categoría → AB-CR → Marca → Tipo  
- [x] Tipo: Normal / Carteras / Promo / Liquidación  
- [x] Material/Color: texto + NN · sin códigos sueltos  
- [x] Napa / Verniz (Vz) canónicos  
- [x] Orden por recurrencia  
- [x] Dos bloques ocultables · layout margen izquierdo  
- [ ] Smoke visual Director en prod tras deploy  
- [ ] MIG-166 en BD (opcional · orden futura)

**Padre AM:** [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](./CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) **2.3.1.22**
