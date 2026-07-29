# Triángulo del header — Pilares → UI de catálogo

**Ratificado:** 2026-06-16  
**Editor canónico:** Report `/pilares` (Administrador de Pilares)  
**Consumidores:** RIMEC Web (mayorista), Tablet Bazzar (cadena POS)  
**Índice:** `3_manual_funciones/INDICE.md` §3.3.1 · `2.4_tablet_bazzar/CONTEXT.md`  
**CABECERA DE FILTROS:** [CABECERA_DE_FILTROS.md](./CABECERA_DE_FILTROS.md) — mapa completo · URL · paridad por producto

---

## Qué es el triángulo

Herramienta **compactada de navegación y filtros** cuyo contenido se **ordena y alimenta desde pilares**, no desde listas hardcodeadas.

```
                    GÉNERO
                   /      \
              MARCA ────── ESTILO
                 \        /
                  TIPO 1 *
```

| Vértice | Tabla pilar | Campos | Editado en `/pilares` |
|---------|-------------|--------|------------------------|
| **Género** | `linea` | `genero_id` → `genero` | Pestaña **Líneas** |
| **Marca** | `linea` | `marca_id` → `marca_v2` | Pestaña **Líneas** |
| **Estilo** | `linea_referencia` | `grupo_estilo_id` → `grupo_estilo_v2` | Pestaña **L×R** |
| **Tipo 1** | `linea_referencia` | `tipo_1_id` → `tipo_1` | Pestaña **L×R** |

\* **Tablet Bazzar — chip «Tipo»:** muestra `tipo_v2` (CALZADO / CONFECCIONES) del depósito, no `tipo_1`. El triángulo pilares para clasificación comercial en tablet es **género → marca → estilo**; `tipo_v2` es dimensión de negocio del staging.

### Fila **TONO** (color canónico)

Debajo o junto al triángulo, la franja **COLOR / TONO** no es vértice del triángulo pero **forma parte del header compacto** en RIMEC Web y tablet inicio.

| Regla | Detalle |
|-------|---------|
| Palabra reservada | **TONO** — ver [CHUSAR_EDITOR_TONO.md](../../2_modulos/2.3_report/pilares/CHUSAR_EDITOR_TONO.md) |
| Fuente | `color_tono_estandar` + filtro `tono_canon.etiqueta` |
| Modos | Filtrar (círculos) · Asignar (badge vacío → paleta) |

---

## Reglas de comportamiento (marco emulado)

### R1 — Verdad en pilares

Toda etiqueta de género, marca, estilo y tipo 1 visible en header/filtros debe resolverse **en lectura** desde:

1. `linea` + JOIN `marca_v2` / `genero`
2. `linea_referencia` + JOIN `grupo_estilo_v2` / `tipo_1`

Los FK copiados en staging (`registro_st_vt_rc_reposicion`, `deposito_tienda_*`, columnas denormalizadas de `v_stock_rimec`) son **fallback**, no verdad.

### R2 — Propagación inmediata

Tras `UPDATE` en `/pilares` (PATCH → `linea` / `linea_referencia`):

| Canal | Mecanismo | Latencia |
|-------|-----------|----------|
| **Report `/pilares`** | Misma query | Inmediato |
| **RIMEC Web** | `atributosLinea.ts` en cada `getFiltros()` / página catálogo | Próximo request (~30s revalidate página) |
| **Tablet Bazzar** | JOIN pilares en `catalogo-sql.ts` | Próximo request API |

**No requiere** re-sync depósito ni re-import retail para marca/género/estilo.

### R3 — Universo de filas (stock) vs facetas Estilo/Género (pilares)

**Filas / chips de stock** (marca, línea, color…): solo combinaciones con stock activo del canal.

| Canal | Universo filas |
|-------|----------------|
| RIMEC Web | `v_stock_rimec` / PE · `cajas_disponibles > 0` |
| Tablet | `deposito_tienda_*` · `cantidad > 0` |

**Faceta Estilo + Género (enmienda Director 2026-07-29 · siamese):** la **lista seleccionable** sale del **Administrador de Pilares** (`grupo_estilo_v2` acotado por `ESTILOS_POR_TIPO_V2` · tabla `genero`), **no** del DISTINCT de stock. Así TENIS aparece en Calzado y nunca se mezclan estilos 638↔654.

| Superficie | API / módulo |
|------------|----------------|
| Report AM · DPE | `/api/pilares/maestras-filtro` → `buildOperativaOpciones` |
| RIMEC Web | `loadMaestrasTrianguloCatalogo` en meta catálogo |

Doc: [CHUSAR_SIAMESE_ESTILO_GENERO_PILARES_20260729.md](../../2_modulos/2.2_rimec_web/CHUSAR_SIAMESE_ESTILO_GENERO_PILARES_20260729.md)

### Anti-patrón (capital)

- Armar lista Estilo/Género solo con `DISTINCT` de vistas stock (mezcla 638/654 · oculta TENIS).
- `mergeFacet` que acumula estilos al cambiar ramo.

### R4 — Par L×R para estilo

Estilo y tipo 1 se leen del par **`(linea_id, referencia_id)`** en `linea_referencia`. Confecciones: ref sintética **`K`** — misma regla que Streamlit.

### R5 — Sales Report blindado

`registro_ventas_general_v2` **no** consume triángulo ni pilares.

---

## Implementación por producto

### RIMEC Web (`rimec-web/`)

| Pieza | Archivo | Rol |
|-------|---------|-----|
| Enriquecimiento pilares | `lib/atributosLinea.ts` | `cargarAtributosDesdePilar`, `cargarMetaLineasDesdePilar`, `enriquecerMetaConPilar/Linea` |
| Header mega + chips | `lib/filtros.ts` + `app/components/Header.tsx` + `FiltrosCatalogo.tsx` | Secciones DAMAS/NIÑAS/NIÑOS/CABALLEROS · marcas · estilos |
| Stock | `lib/catalogoData.ts` → `v_stock_rimec` | Universo |
| Reglas Cursor | `.cursor/rules/rimec-web-catalogo.mdc` | Checklist agente |

Flujo:

```
v_stock_rimec → atributosLinea (LR) → meta linea (marca/género) → getFiltros() → Header + Catálogo
```

### Tablet Bazzar (`tablet-bazzar/`)

| Pieza | Archivo | Rol |
|-------|---------|-----|
| SQL triángulo | `lib/server/catalogo-sql.ts` | JOIN `linea` + `linea_referencia` en `fromClause` |
| Reglas compartidas | `lib/server/pilar-triangulo.ts` | Constantes + comentario marco |
| Cabecera cadena | `components/cadena/FiltrosCabecera.tsx` | Chips género · marca · estilo · tipo_v2 |
| API chips | `app/api/deposito/[id]/filtros/route.ts` | Agregados SQL |
| Doc operativa | `docs/TRIANGULO_HEADER_PILARES.md` | Resumen tablet |

Flujo:

```
deposito_tienda_* → catalogo-sql (JOIN pilares) → /filtros · /ingresar · /catalogo → FiltrosCabecera
```

### Report — Administrador de Pilares

| Ruta | Mutación |
|------|----------|
| `/pilares/lineas` | `UPDATE linea` (marca_id, genero_id) |
| `/pilares/linea-referencia` | `UPDATE linea_referencia` (grupo_estilo_id, tipo_1_id) |

Doc: `report/docs/ADMINISTRADOR_PILARES.md`

---

## Matriz de paridad header

| Elemento UI | RIMEC Web | Tablet cadena | Fuente pilar |
|-------------|-----------|---------------|--------------|
| Nav género (Damas/Niñas/…) | Header top | Fila chips género | `linea.genero_id` |
| Marca | Chips + mega | Fila chips marca | `linea.marca_id` |
| Estilo | Chips | Fila chips estilo | `linea_referencia.grupo_estilo_id` |
| Tipo 1 | Dropdown | — (usa tipo_v2) | `linea_referencia.tipo_1_id` |
| Línea | Dropdown | Búsqueda / refs | código en stock |
| Color | Paleta círculos + texto Enter | Franja / Franco | `tono_canon` + `color_tono_estandar` · [CHUSAR búsqueda](../../2_modulos/2.3_report/pilares/CHUSAR_BUSQUEDA_COLOR_CANALES.md) |

---

## Anti-patrones (prohibido)

- Hardcodear listas de marcas/estilos en UI sin pasar por pilares + stock.
- Editar marca/género solo en staging sin `UPDATE linea`.
- Asumir que sync depósito actualiza pilares (es al revés: pilares → lectura en tablet).
- Mezclar `tipo_v2` con `tipo_1` en documentación sin aclarar canal.
- Mostrar lista seleccionable de nombres color proveedor en buscador (solo Enter → resultados).

---

## Referencias

- `CONFECCIONES_TIPO_V2_2.md` — ref K, alta perezosa
- `arquitectura_molecular.md` (RIMEC Web) — catálogo vs estadísticas
- `ETAPA_ADMINISTRADOR_PILARES_REPORT.md`
- `pilares_cinco.md` — `linea_referencia` atributos L+R

**Shibboleth:** 7 años
