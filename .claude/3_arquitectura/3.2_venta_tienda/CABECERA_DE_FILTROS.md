# CABECERA DE FILTROS — mapa · estándar · réplica holding

**Código plan:** `3.2.00.001`  
**Nombre canónico UI:** **CABECERA DE FILTROS** *(no «header filtros», no «barra chips»)*  
**Ratificado:** 2026-06-26 · orden Director **Documenta**  
**Marco pilares:** [TRIANGULO_HEADER_PILARES.md](./TRIANGULO_HEADER_PILARES.md)  
**Color / TONO:** [CHUSAR_BUSQUEDA_COLOR_CANALES.md](../../2_modulos/2.3_report/pilares/CHUSAR_BUSQUEDA_COLOR_CANALES.md) · [CHUSAR_EDITOR_TONO.md](../../2_modulos/2.3_report/pilares/CHUSAR_EDITOR_TONO.md)  
**Sales Report:** blindado · **no** usa CABECERA DE FILTROS ni pilares.

---

## Instrucción de uso — ESTÁNDAR (copiar lógica, no tablas)

> **Cuando el Director dice «CABECERA DE FILTROS», «aplicá la cabecera» o «réplica el estándar»**, se refiere a **este documento como plantilla de comportamiento** — **no** a pegar las mismas tablas SQL ni el mismo `FROM` de otro módulo.

> **Cuando el Director dice «Grilla Rimec»**, se refiere al stack completo documentado en [GRILLA_RIMEC.md](./GRILLA_RIMEC.md) (`3.2.00.002`): **CABECERA DE FILTROS** + grilla molécula + acordeón **dato duro** + toggle **Extender todos los datos**.

| ✅ Copiar (obligatorio) | ❌ No copiar (prohibido asumir) |
|-------------------------|----------------------------------|
| Orden de filas · etiquetas UI · reglas UX (Todos/Todas, cascada, limpiar) | Tabla fija `deposito_tienda_*` en todo proyecto |
| Lógica: vacío = todos · multi OR por fila · AND entre filas | Mismo `catalogo-sql.ts` sin adaptar al universo local |
| Vocabulario URL objetivo (`generos`, `marcas`, `tonos`, `q`…) | JOIN pilares idéntico si la pantalla **no** tiene esas FK |
| TONO vía `tono_canon` + catálogo estándar (cuando hay color) | Reutilizar `FiltrosCabecera.tsx` literal en Report retail sin mapper |
| Contrato `FilterHeaderState` · helpers URL ↔ estado | Forzar columnas que **no existen** en la tabla que alimenta **esa** pantalla |

### Regla de aplicación por proyecto

1. **Identificar la tabla o vista que imputa datos a esa pantalla** (la fuente de verdad **de ese módulo**).
2. **Mapear dimensiones** del estándar a columnas/FK **disponibles en esa fuente** — omitir filas que no aplican (ej. sin `tipo_v2` en RIMEC Web mayorista).
3. **Implementar la misma lógica de filtrado** sobre ese universo: cascada de chips, búsqueda ILIKE, TONO si hay pilar color, stock activo del canal.
4. **Nombrar el componente/doc CABECERA DE FILTROS** aunque el archivo sea `RetailFiltrosHeader.tsx`, `TrianguloHeaderDeposito.tsx`, etc.

**Ejemplos de fuentes distintas — misma lógica:**

| Pantalla | Tabla / vista que imputa | Mapeo estándar |
|----------|--------------------------|----------------|
| Tablet `/cadena` | `deposito_1_{cliente}_tienda` | Labels + JOIN pilares en SQL propio |
| Report operativa | Misma familia depósito | FK arrays · misma lógica · otro componente |
| Report artículos | `GET /api/depositos/[id]` | `deposito-filters.ts` · cliente-side |
| Report `/retail` | `registro_st_vt_rc_reposicion` (staging batch) | 6 pilares sobre FK materializadas |
| RIMEC Web catálogo | `v_stock_rimec` | Sin `tipo_v2` · resto igual |

Las rutas de código citadas más abajo son **referencia de implementación ya hecha**, no lista de dependencias obligatorias. El agente **adapta** la cabecera a la tabla que corresponda al proyecto en curso.

---

## Productos vs procesos (norte arquitectura)

| Capa | Nombre etapa / módulo | App | Función |
|------|----------------------|-----|---------|
| **Panel control** | **Depósito Bazzar** | Report `:3001` | Sync · KPIs · operativa · artículos · admin stock |
| **Ejecución** | Venta tienda / cadena | Tablet `:3000` | Filtros entrada → INGRESAR → hero → POS |

**Tablet no es panel de control.** Reutiliza CABECERA DE FILTROS solo como **misma lógica UX**, no como «otro depósito Bazzar».

Doc dedicada: [DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md](../../2_modulos/2.3_report/depositos/DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md)

---

## Qué es

Bloque UI **reutilizable** arriba de catálogo, cadena, depósito o staging retail. Ordena el stock por **dimensiones de negocio** antes de la grilla.

| Regla | Detalle |
|-------|---------|
| Nombre | Siempre **CABECERA DE FILTROS** en doc, OT y comentarios de código |
| Verdad etiquetas | JOIN pilares (`genero`, `marca_v2`, `grupo_estilo_v2`, `tipo_1`, `tipo_v2`) |
| Verdad color | **TONO** (`color.tono_canon` + `color_tono_estandar`) — no `color.nombre` crudo en chips |
| Universo | Solo filas con stock activo del canal (`cantidad > 0` / `cajas_disponibles > 0`) |
| Vacío = todos | Array vacío o string `""` → sin restricción en esa fila |
| Multi-select | Toggle chip/pill · OR dentro de la misma fila · AND entre filas distintas |

---

## Dimensiones canónicas (orden de filas)

Orden **obligatorio** cuando la dimensión existe en el canal:

| # | Etiqueta UI | Dimensión | FK / campo | ¿Vértice triángulo? |
|---|-------------|-----------|------------|---------------------|
| 1 | **Género** | Género comercial | `genero_id` → `genero` | ✅ |
| 2 | **Marca** | Marca | `marca_id` → `marca_v2` | ✅ |
| 3 | **Estilo** | Grupo estilo | `grupo_estilo_id` → `grupo_estilo_v2` | ✅ |
| 4 | **Tipo 1** | Clasificación L×R | `tipo_1_id` → `tipo_1` | ✅ *(dropdown en catálogo mayorista)* |
| 5 | **Categoría** | Tipo negocio Bazzar | `tipo_v2_id` / texto `tipo_v2` | ❌ *(CALZADO / CONFECCIONES)* |
| 6 | **Línea** | Línea proveedor | `linea_id` | ❌ *(solo catálogo 6-pilares)* |
| 7 | **TONO** | Color canónico | `tono_canon->>'etiqueta'` | ❌ *(fila COLOR)* |
| 8 | **Buscar** | Texto libre | ILIKE multi-campo | ❌ |

**Labels prohibidos en UI estándar:**

| ❌ Evitar | ✅ Usar |
|----------|---------|
| Tipo *(solo)* para `tipo_v2` | **Categoría** |
| Tipo *(confunde con tipo_1)* | **Tipo 1** |
| Color *(dropdown nombres proveedor)* | **TONO** *(círculos)* o campo texto Vía B |

---

## Contrato URL canónico (objetivo holding)

Fuente tablet cadena más completa: `tablet-bazzar/lib/filtros-url.ts`.

| Dimensión | Query param | Formato | Ejemplo |
|-----------|-------------|---------|---------|
| Género | `generos` | `\|` join | `generos=Caballeros\|Damas` |
| Marca | `marcas` | `\|` join | `marcas=VIZZANO\|MODARE` |
| Estilo | `estilos` | `\|` join | `estilos=TENIS` |
| Categoría (`tipo_v2`) | `tipos` | `\|` join | `tipos=CALZADO` |
| Tipo 1 | `tipo1s` | `\|` join | `tipo1s=SANDALIA` |
| Referencia L×R | `refs` | `,` entre claves · `\|` dentro | `refs=1184\|1101,4313\|220` |
| TONO | `tonos` | `\|` join etiquetas | `tonos=Bronce\|Negro` |
| Sin tono | `sin_tono` | `1` | `sin_tono=1` |
| Buscar | `q` | string | `q=bronce` |
| Marca cadena | `marca` | string única | `marca=VIZZANO` |
| Multi-ref ingreso | `multi` | `1` | `multi=1` |

**Contrato FK (depósito / RIMEC Web / Report operativa):**

| Dimensión | Query param | Formato |
|-----------|-------------|---------|
| Género | `genero_id` | id único string |
| Marca | `marca_id` | id único string |
| Estilo | `grupo_estilo_id` | id único string |
| Tipo 1 | `tipo1_ids` | `,` ids |
| Línea | `linea_ids` | `,` ids |
| Color legacy | `color_ids` | `,` ids → **migrar a TONO** |
| Paleta hex legacy | `color_hex` | `#RRGGBB` → **migrar a TONO** |
| Buscar | `q` | string |

**Deuda conocida (normalizar):**

| Archivo | Problema | Fix objetivo |
|---------|----------|--------------|
| `cadena-entrada-filtros.ts` `parseFiltrosEntradaFromUrl` | Lee `genero`/`tipo` singular | Aceptar **ambos** · escribir siempre plural |
| `buildVistaQuery` | Emite `genero`/`tipo` singular | Emitir `generos`/`tipos` |
| Report operativa | Sin TONO | Añadir fila TONO + params `tonos`/`sin_tono` |
| RIMEC Web | Dropdown COLOR por `color_id` | Migrar a TONO Vía A |

---

## Tipo estándar objetivo — `FilterHeaderState`

Contrato único para nuevos módulos y refactors:

```typescript
/** CABECERA DE FILTROS — contrato holding (réplica) */
export type FilterHeaderState = {
  /** Modo labels (tablet cadena) */
  generos: string[];
  marcas: string[];
  estilos: string[];
  tipos: string[];      // tipo_v2 · UI «Categoría»
  tipo1s: string[];
  /** Modo FK (catálogo mayorista / depósito) — mutuamente usable vía mappers */
  generoId?: number | null;
  marcaId?: number | null;
  grupoEstiloId?: number | null;
  tipo1Ids?: number[];
  lineaIds?: number[];
  tipoV2Ids?: number[];
  /** Referencias */
  referenciaKeys: string[];  // formato linea|referencia
  /** TONO */
  tonos: string[];
  sinTono: boolean;
  /** Texto */
  buscar: string;
};
```

**Helpers obligatorios por app:**

| Función | Rol |
|---------|-----|
| `filtrosFromSearchParams` / `filtrosToSearchParams` | URL ↔ estado |
| `toggleChip` / `toggleOperativaId` | Multi-select |
| `hayFiltrosActivos` | Limpiar todo |
| `buildOpciones*` con `excluir` | Cascada · opciones por fila sin auto-filtrarse |

---

## Mapa por producto (implementación actual)

### 1 · Tablet Bazzar — `/cadena` *(ejecución venta · CABECERA entrada)*

| Pieza | Ruta |
|-------|------|
| UI | `components/cadena/FiltrosCabecera.tsx` |
| Rol | **Ejecución** POS — no panel Depósito Bazzar |
| Estado | `lib/cadena-entrada-filtros.ts` → `FiltrosEntrada` |
| URL | `lib/filtros-url.ts` → `FiltrosUrl` |
| SQL | `lib/server/catalogo-sql.ts` |
| TONO UI | `components/tono/EditorTono.tsx` → `FiltroTonoRow` |
| API TONO | `app/api/tono/route.ts` |

**Filas renderizadas (orden):** Género → Marca → Estilo → Tipo 1 → Categoría → Buscar → TONO.

**Modo valores:** labels texto denormalizados + SQL JOIN pilares en servidor. TONO en SQL vía `col.tono_canon->>'etiqueta'` y `SQL_COLOR_SIN_TONO`.

**Chip «Todos»:** Género/Marca/Estilo/Tipo1/Categoría · TONO incluye «Sin asignar».

---

### 2 · Tablet Bazzar — `/deposito`

| Pieza | Ruta |
|-------|------|
| UI | `components/deposito/DepositoFiltrosHeader.tsx` |
| Estado | `lib/deposito-filters.ts` → `DepositoFilterState` |
| SQL | `lib/server/deposito-filtros-sql.ts` |
| API | `GET /api/deposito/{id}/filtros-header` |

**Filas:** Género · Marca · Estilo · dropdowns Línea · Color · Tipo 1 · Buscar modelos · paleta hex.

**Gap vs estándar:** fila Color legacy (`colorIds`, `colorHex`) — **migrar a TONO** como cadena.

Doc: [CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md](../../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md)

---

### 3 · Report — Depósito Bazzar operativa *(panel control · caso OK completo)*

| Pieza | Ruta |
|-------|------|
| UI | `report/.../TrianguloHeaderDeposito.tsx` · `CabeceraFiltrosDeposito.tsx` |
| Estado | `lib/depositos/operativa-filters.ts` → `OperativaFilterState` |
| Filtro cliente | `applyOperativaFilters()` · orden grilla `agrupar-operativa.ts` |
| Ruta | `/depositos-bazzar/[cliente_id]?tab=operativa` · **Report :3001** |

**Filas:** Género · Marca · Estilo · Tipo 1 · Categoría · Línea · Buscar · TONO.

**Modo valores:** FK numéricos + cascada cliente · `tono_canon.etiqueta`.

Doc: [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](../../2_modulos/2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md)

---

### 3b · Report — Panel de Control Alejandro Magno · grilla moléculas *(sellado 2026-07-09)*

| Pieza | Ruta |
|-------|------|
| Stack UI | `PanelControlGrillaStack.tsx` |
| Wrapper | `PanelControlTrianguloHeader.tsx` → `TrianguloHeaderDeposito` |
| Config | `lib/panel-control/panel-control-grilla-header.ts` |
| Rutas | `/stock-pronta-entrega` · `/stock-transito` (+ `/disponible` · `/ventas`) · `/stock-programado` |
| Hub | `/rimec?mundo=panel-control` — **sin** grilla embebida |

**Filas:** Género · Marca · Estilo · Tipo 1 · Línea · Buscar · TONO · Grada importadora. Calzado/Confecciones en barra colapsada.

Doc: [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md) · **2.3.1.20**

---

### 4 · Report — retail staging `/retail`

| Pieza | Ruta *(repo report)* |
|-------|----------------------|
| UI | `RetailFiltrosHeader.tsx` |
| Estado | `retail-filters.ts` |
| SQL opciones | `query-filtros.ts` |

**6 pilares patrón RIMEC:** Género · Marca · Estilo · Línea · Color · Tipo 1.

**Gap vs estándar:** Color por nombre/`descp_color` — **FK + TONO**. Género faltaba (OT-005 cerrada).

Doc: [OT-REPORT-RETAIL-FILTROS-6-PILARES-005.md](../../6_ot/en_curso/OT-REPORT-RETAIL-FILTROS-6-PILARES-005.md)

---

### 5 · RIMEC Web — catálogo mayorista

| Pieza | Ruta *(repo rimec-web)* |
|-------|-------------------------|
| UI | `app/components/FiltrosCatalogo.tsx` + `Header.tsx` |
| TONO | `components/catalog/FiltroTonoCabecera.tsx` |
| Estado / filtros | `lib/catalogoFilters.ts` · `CatalogoClient.tsx` |
| Enriquecimiento | `lib/catalogoEnrich.ts` · `lib/atributosLinea.ts` |
| Doc | [CHUSAR_CATALOGO_CABECERA_FILTROS.md](../../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_CABECERA_FILTROS.md) · **2.2.1.1** |

**Filas:** Origen · Género · Marca · Estilo · Tipo 1 · Línea · Buscar · **TONO** · Llegada (CP).

**Universo:** `v_stock_rimec` / `v_stock_pe_rimec` · `cajas_disponibles > 0`.

**TONO:** enrich `color.tono_canon` vía `color_code` → `color.codigo_proveedor` — **no** columna en vista (2026-07-08).

**Estado vs estándar:** ✅ TONO Vía A · ✅ pills scroll · ❌ `tipo_v2` *(canal importadora)*.

---

### 6 · Report — admin pilares color

| Pieza | Ruta |
|-------|------|
| UI | `/pilares/color` |
| Filtros KPI | tono asignado / sin asignar / por etiqueta |

No es CABECERA DE FILTROS de catálogo — es **admin mutación**. Comparte catálogo `color_tono_estandar` y PATCH.

---

### 7 · Bazzar Web

Sin CABECERA DE FILTROS de pilares en Moria activa. Checkout usa cédula — ver [CHUSAR_CHECKOUT_CLIENTE_CEDULA.md](../../2_modulos/2.5_bazzar_web/CHUSAR_CHECKOUT_CLIENTE_CEDULA.md).

---

## Tabla resumen — paridad

| Dim | Tablet cadena | Tablet depósito | Report operativa | Report retail | RIMEC Web |
|-----|:-------------:|:---------------:|:----------------:|:-------------:|:---------:|
| Género | ✅ labels | ✅ FK | ✅ FK | ✅ FK | ✅ |
| Marca | ✅ | ✅ | ✅ | ✅ | ✅ |
| Estilo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tipo 1 | ✅ | ✅ dropdown | ✅ | ✅ dropdown | ✅ pills |
| Categoría tipo_v2 | ✅ | ❌ | ✅ | ❌ | ❌ |
| Línea | ❌ | ✅ dropdown | ✅ | ✅ dropdown | ✅ pills |
| TONO | ✅ | ⚠️ hex legacy | ✅ | ⚠️ nombre | ✅ |
| Buscar | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modo URL plural | ✅ | FK params | FK arrays | FK | mixto |

**Leyenda:** ✅ alineado · ⚠️ legacy · ❌ falta · ⏳ pendiente Fase 3

---

## Reglas UX (réplica mínima)

### Fila chips

```
[Label 80px] [Todos|Todas] [chip] [chip] …  ← scroll horizontal snap-x
```

| Label fila | Chip vacío |
|------------|------------|
| Género | **Todos** |
| Marca | **Todas** |
| Estilo / Tipo 1 / Categoría | **Todos** |
| TONO | **Todos** + círculos + **Sin asignar** |

### Cascada de opciones

Al construir chips de la fila **X**, filtrar dataset **excluyendo** el filtro activo de **X** (`excluir: "marcas"`). Así un chip de Marca no desaparece por haberse seleccionado otra marca en la misma fila.

Implementación referencia: `filasEntradaFiltradas(..., excluir)` en `cadena-entrada-filtros.ts`.

### Buscar

| Campo | Alcance mínimo |
|-------|----------------|
| `q` | línea · ref · marca · estilo · material · color · tipo_v2 · género |
| Enter | Ejecuta ingreso cadena si `onEnter` definido |
| Placeholder | `Línea, ref, marca, material, color…` |

### Limpiar

Botón **Limpiar filtros** visible solo si `hayFiltrosActivos` → reset a estado vacío canónico.

---

## Capa SQL compartida

| Módulo | Archivo | Uso |
|--------|---------|-----|
| Tablet cadena/ingresar | `lib/server/catalogo-sql.ts` | JOIN pilares + appendTono + appendBuscar |
| Constantes triángulo | `lib/server/pilar-triangulo.ts` | `PILAR_TRIANGULO_JOINS`, `SQL_*_ID` |
| Tablet depósito | `lib/server/deposito-filtros-sql.ts` | Cascada FK |
| TONO sin asignar | `lib/tono/color-canon.ts` | `SQL_COLOR_SIN_TONO` |
| Report operativa | API `/api/depositos/[id]/filtros` | DISTINCT FK con counts |

**Prohibido:** listas hardcodeadas de marcas/estilos · filtrar solo texto denormalizado si existe FK.

---

## Checklist réplica (nuevo módulo)

0. **Leer §Instrucción de uso** — estándar = lógica sobre **tu** tabla imputora, no clonar SQL de tablet.
1. Nombrar componente/doc **CABECERA DE FILTROS**.
2. Declarar en una línea qué **tabla/vista/API** alimenta la pantalla y qué FK/columnas mapean cada fila del estándar.
3. Copiar orden de filas §Dimensiones canónicas — omitir solo dimensiones inexistentes en **esa** fuente.
4. Implementar `FilterHeaderState` (o mapper) + helpers URL ↔ estado con vocabulario canónico.
5. Opciones: cascada `excluir` · universo stock activo del canal.
6. TONO: si hay `color_id` / pilar color → círculos `color_tono_estandar` · filtro `tono_canon.etiqueta`.
7. Buscar: ILIKE multi-campo · no autocomplete multi-select de nombres crudos.
8. Smoke: toggle chip · limpiar · URL round-trip · cambio `/pilares` en próximo request.

---

## Referencias cruzadas

| Doc | Tema |
|-----|------|
| [TRIANGULO_HEADER_PILARES.md](./TRIANGULO_HEADER_PILARES.md) | Vértices · propagación |
| [CHUSAR_BUSQUEDA_COLOR_CANALES.md](../../2_modulos/2.3_report/pilares/CHUSAR_BUSQUEDA_COLOR_CANALES.md) | Vía A/B color |
| [CHUSAR_EDITOR_TONO.md](../../2_modulos/2.3_report/pilares/CHUSAR_EDITOR_TONO.md) | Editor + filtro TONO |
| [CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md](../../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md) | Depósito tablet |
| [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](../../2_modulos/2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) | Report operativa |
| [DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md](../../2_modulos/2.3_report/depositos/DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md) | Panel control vs ejecución |
| [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md) | Panel CP · stack grilla · **2.3.1.20** |
| `tablet-bazzar/lib/filtros-url.ts` | URL canónica |
| `tablet-bazzar/components/cadena/FiltrosCabecera.tsx` | UI referencia tablet |
| [CHUSAR_CATALOGO_CABECERA_FILTROS.md](../../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_CABECERA_FILTROS.md) | RIMEC Web catálogo |

---

**Shibboleth:** 7 años · CABECERA DE FILTROS = nombre único holding.
