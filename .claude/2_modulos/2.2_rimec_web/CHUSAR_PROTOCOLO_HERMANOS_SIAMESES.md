# CHUSAR — Protocolo unificado · Hermanos siameses

**Código:** **2.2.1.44** (maestro)  
**Fecha:** 2026-08-06  
**Keyword:** Documenta · palabra reservada Director  
**Estado:** 🟢 **VIGENTE** — puerta única al aplicar el protocolo en cualquier módulo  
**Shibboleth:** Andrés, el que viene.  
**Prod rimec-web:** sellado `f408fc2` — fixes locales **sin deploy** hasta cierre etapa u orden directa.

---

## 0 · Palabra reservada (inviolable)

| Campo | Valor |
|-------|--------|
| **Frases que activan este doc** | **aplica el protocolo hermanos siameses** · **hermanos siameses** · **protocolo hermanos siameses** |
| **Qué debe hacer el agente** | **Leer este archivo completo** + checklist §8 **antes** de tocar código en otro módulo |
| **Regla Cursor** | `.cursor/rules/hermanos-siameses-filtro-tipo.mdc` (apunta aquí) |

> **Por qué se unificó (Director 2026-08-06):** los docs parciales (solo Tipo, solo PE, solo TODOS) hacían que el agente “aplicara siameses” con **errores graves** en cascada, paginación y grupo uno. Este maestro concentra **todo** lo operativo.

**Hijos (siguen vigentes; no duplicar ley aquí sin actualizar maestro):**

| Código | Doc | Rol |
|--------|-----|-----|
| `2.2.1.18` | [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](./CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) | Filtro Tipo AM↔Web |
| `2.2.1.25` | [CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](./CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md) | Filtros PE 3 hermanos |
| `2.2.1.28` | [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) | Ley TODOS / mostrar todo |
| `2.2.1.42` | [CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md](./CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md) | Cascada facetas |
| `2.5.1.20` | [CHUSAR_FILTROS_SIAMESES_DEPOSITO_BAZZAR_CATALOGO_20260806.md](../2.5_bazzar_web/CHUSAR_FILTROS_SIAMESES_DEPOSITO_BAZZAR_CATALOGO_20260806.md) | Cascada DW↔Bazzar tienda |
| `2.2.1.50` | [CHUSAR_SESION_20260806_FILTROS_PRECIO_PARENTESIS.md](./CHUSAR_SESION_20260806_FILTROS_PRECIO_PARENTESIS.md) | Sesión día · mapa · cierre paréntesis bug |
| `2.2.1.49` | [CHUSAR_HOTFIX_LPN_LPC03_TACHADO_IGUAL_20260806.md](./CHUSAR_HOTFIX_LPN_LPC03_TACHADO_IGUAL_20260806.md) | Tachado LPN≠LPC03 · precio venta · `4.01.04.009` |
| `2.2.1.48` | [CHUSAR_AUDITORIA_FILTROS_GRILLA_META_20260806.md](./CHUSAR_AUDITORIA_FILTROS_GRILLA_META_20260806.md) | Auditoría grilla∥molécula · solo-PE AB-CR · acotar · live |
| `2.2.1.46` | [CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md](./CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md) | CP biblioteca ∥ PE diccionario · 4 cañerías · Promo/Normal/LIQ |
| `2.2.1.45` | [CHUSAR_ABCR_ESCOLAR_CHIP_20260806.md](./CHUSAR_ABCR_ESCOLAR_CHIP_20260806.md) | AB-CR ESCOLAR d45=`08` · id −8 · error `4.01.04.008` |
| `2.2.1.47` | [CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md](./CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md) | Checklist instalar filtros PE/AB-CR en otros módulos |
| `2.3.1.10.1.2` | [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) | Grupo uno · diccionario PE |
| `2.3.1.10.1.2.1` | [CHUSAR_LEY_DPE_SIN_BCL_20260727.md](../2.3_report/deposito_rimec/CHUSAR_LEY_DPE_SIN_BCL_20260727.md) | DPE sin BCL |

---

## 1 · Qué significa «hermanos siameses»

Dos o más **superficies de venta/consulta** del holding que muestran el **mismo universo comercial** deben compartir:

1. **Misma ley de tipificación** (quién es LIQ / PROMO / NORMAL).  
2. **Misma cascada de filtros** (dimensión acota molécula).  
3. **Misma completitud de grilla** (ley «mostrar todo» — no cortar resultados).  
4. **Mismo semáforo visual** cuando aplica (badge = filtro).  

**Fix en un hermano ⇒ mismo turno alinear los demás** (o deuda documentada + orden Director).  
**Prohibido** “arreglar Web y dejar AM / Stock PE divergente”.

---

## 2 · Mapa de hermanos (quién con quién)

### 2.1 Catálogo / stock calzado-PE (núcleo venta)

| # | Hermano | App · ruta | Código canónico (copiar reglas, no reinventar) |
|---|---------|------------|-----------------------------------------------|
| **W** | Catálogo vendedores | RIMEC Web `:3001` `/` | `rimec-web/lib/filtros/*` · `catalogoPaginado.ts` · `catalogoMetaRpc.ts` · `CatalogoClient.tsx` |
| **AM** | Alejandro Magno | Report `:3000` `/herramienta-reposicion` | `report/src/lib/filtros/filtro-tipo-canonico.ts` · filtros AM |
| **PE** | Stock Pronta Entrega | Report `:3000` `/stock-pronta-entrega` | `report/src/lib/stock-pronta-entrega/*` · `cadena-dpe-triunvirato.ts` |
| **DW** | Depósito Web | Report `:3000` `/bazzar-web/deposito-web` | mismos filtros PE · `DepositoWebClient` |
| **MP** | Motor precio Guardián | Report `:3000` `/bazzar-web/motor-precio` | puente `catalogo-filtro-siamese.ts` · CASO **NORMAL** · **2.5.1.21** |

### 2.2 Extensiones siameses (otros módulos)

| Tema | Hermanos | Doc |
|------|----------|-----|
| Cabecera preventa + quincena | Web · AM · PDF FI · vistas `v_stock_*` | `2.3.1.31` |
| Grada Bazzar | Estadísticas · Catálogo tienda · Depósito Web | `2.5.1.10` |
| Filtro Tipo (prioridad) | AM ↔ Web | `2.2.1.18` · error `4.01.04.002` |
| Cascada Motor precio | MP ↔ PE ↔ DW | **2.5.1.21** · **2.5.1.19** |
| Cascada dimensión→molécula ALM | **Depósito Web** ↔ **Bazzar tienda** | `2.5.1.20` |

Al **aplicar este protocolo en un módulo nuevo**, declarar en el CHUSAR del módulo: *«Hermano de: W / AM / PE / …»* y listar archivos espejo.

---

## 3 · Grupo uno · Diccionario Pronta Entrega (palabra reservada)

**Keyword exacta:** **grupo uno** (no es `COD.GRUPO = "1"`).

| Concepto | Definición |
|----------|------------|
| **Grupo uno** | Primer paquete de **cadena comercial + D1** del diccionario PE Nexus |
| **Cadenas UI** | **NORMAL** (= BD `REGULAR`) · **PROMOCIONAL** · **LIQUIDACION** (+ COMUN si aplica) |
| **Fuente** | **Triunvirato Excel** — BCL **prohibido** para segregación PE |

### 3.1 Triunvirato (única puerta DPE)

| # | Archivo | Rol |
|---|---------|-----|
| 1 | `csv's/stock's/sdrm####.csv` | Stock · `COD.GRUPO` por artículo |
| 2 | `sdrm0849.xlsx` | Traductor Carlos → `sdrm_cod_grupo_dim` |
| 3 | Stock valorizado | Control etiquetas · **gana dígito** si conflicto |

### 3.2 Decoder `COD.GRUPO` (10 dígitos · calzado 654)

| Posición | Dígitos | Mapa |
|----------|---------|------|
| 1–2 | marca Carlos | ej. `03`=MODARE · `08`=BR SPORT |
| 3–4 (d23) | AB-CR / forma | `01` ABIERTO · `02` **CERRADO** · `03` CARTERAS · `04` MEDIAS |
| 5–6 (d45) | **cadena grupo uno** | `01` NORMAL · `02` PROMO · `04` **LIQUIDACION** · `06` COMUN |
| 7–8 | estilo estructural | BOTAS / OTROS… |

Confecciones 638: cadena en d67 (`03` promo · `04` liq).  
Código: `rimec-web/lib/pilares/codGrupoCadena.ts` · `report/src/lib/pilares/cod-grupo-decode.ts` · `cadena-dpe-triunvirato.ts`.

### 3.3 Prohibido (error grave)

- Tipificar LIQ/PROMO PE con **BCL** / `descp_caso` / motor de precios.  
- Interpretar «grupo 1» como literal `COD.GRUPO=1`.  
- Mostrar chip **NORMAL** filas con badge **PROMO**/**LIQ**.

---

## 4 · Cascada de filtros (dimensión → molécula)

**Ley:** AND entre dimensiones · OR dentro de multi-select · **facetas del sidebar = stock vivo filtrado**, no universo.

Orden canónico:

1. Stock (`origen_tipo`)  
2. Depósito  
3. Categoría (`ramo_tipo`)  
4. AB-CR (`tipo_ids`)  
5. Marca (`marca_ids`)  
6. Tipo comercial / grupo uno (`tipo_grupos`)  
7. Género (`genero_codigos`)  
8. Molécula: Estilo → Línea → Material → Color  

### 4.1 Implementación Web (obligatoria al clonar)

| Pieza | Regla |
|-------|--------|
| `hasSidebarFilters` | Debe ver **todas** las dims (incl. `genero_codigos`, `tipo_grupos`, `marca_ids`) |
| `needRowsScan` | **Cualquier** dim activa → scan filas + `acotarMetaRpcDesdeFilas` |
| Cliente meta | Con cascada: **replace** facetas (no `mergeFacet` universo) |
| RPC multi-marca | Legacy MIG-181 = 1 marca → **1 RPC por id + merge** (o MIG-199) |
| Meta PE scan | Select debe incluir `es_liquidacion`, `es_promo`, `cadena_comercial`, `cod_grupo` |

**Error lección:** Marca seleccionada + LÍNEA · 841 → `4.01.04.007` §A · doc `2.2.1.42`.

---

## 5 · Ley «mostrar todo» · paginación TODOS (CP∥PE)

**Texto Director:** con filtros activos, la grilla debe devolver **el 100 %** de tarjetas que cumplan el filtro. Cortar a 10 y `hasMore=false` = **falla de herramienta de venta**.

### 5.1 Reglas de cursor (Web `catalogoPaginado.ts`)

| # | Regla | Detalle |
|---|--------|---------|
| 1 | Mismo offset CP y PE | `rowFrom..rowTo` **igual** en ambas vistas (no half-split) |
| 2 | Avance | `rowFrom += batchSize` (span), **nunca** `+= batch.length` del merge |
| 3 | Corte a mitad de lote | Si se llena `limit` a mitad del batch → **no avanzar** cursor; siguiente página **re-procesa el mismo lote** con `exclude` (`2.2.1.28` §1.1) |
| 4 | Chip único LIQ/PROMO | SQL PE denso: `es_liquidacion` / `es_promo` **o** `cadena_comercial` |
| 5 | Marca/Tipo live | No diferir `marca_ids` / `tipo_grupos` solo en `useDeferredValue` para la grilla |

### 5.2 Tarjeta ≠ artículo Excel

| Nivel | Qué cuenta |
|-------|------------|
| Fila Excel / `det_id` | Artículo · color · depósito |
| **Tarjeta catálogo** | SKU **Línea + Referencia + Material** (`buildSkuId`) |
| Variante | **Color** dentro de la tarjeta |

Ejemplo auditado 2026-08-06: MODARE × LIQ × CERRADO = **5** arts CSV → **3** tarjetas (2 colores en `7370`, 2 arts mismo color en `7320`).

Smoke: comparar **`cardKey`**, no conteo de filas Excel.

---

## 6 · Filtro Tipo · prioridad (AM ↔ Web)

1. **Liquidación**  
2. **Promo** (`es_promo` / cadena / dígito)  
3. **Carteras / Normal**  

Badge UI = filtro. Error: `4.01.04.002`.

Calzado por defecto excluye carteras salvo chip AB-CR / Carteras (`4.01.04.003`).

---

## 7 · Errores de sesión 2026-08-06 (herramienta de venta)

| ID | Síntoma | Causa raíz | Fix |
|----|---------|------------|-----|
| **4.01.04.007-A** | LÍNEA · 841 con Marca+LIQ | RPC multi-marca null + scan/acotar no efectivo | Multi-RPC marca · `needRowsScan` · replace meta |
| **4.01.04.007-B** | Grilla 10 tarjetas · `hasMore=false` · faltaba MODARE LIQ | Half-split CP/PE + avance `batch.length` + corte lote sin exclude | Cursores §5.1 |
| **4.01.04.007-C** | Agente niega «grupo 1» literal | Malentendió **grupo uno** | §3 este maestro |
| — | Confusión 14 arts ≠ 14 tarjetas | Color = variante | §5.2 |

Detalle: [4.01.04.007_rimec-web-paginacion-cascada-grupo-uno.md](../../5_errores/detalle/4.01.04.007_rimec-web-paginacion-cascada-grupo-uno.md)

### 7.1 Evidencia PASS (local · service role)

| Combo | cardKeys API = verdad |
|-------|------------------------|
| MODARE × LIQUIDACION | 12 = 12 |
| MODARE × LIQ × CERRADO (`tipo_ids=2`) | 3 = 3 |
| BR+CHINELO+MODARE × LIQ | 31 = 31 (19+12; CHINELO 0 LIQ cajas) |
| Faceta LÍNEA acotada | 23 |

Script: `rimec-web/scripts/_audit_venta_100.ts`

---

## 8 · Checklist — «aplica el protocolo hermanos siameses»

**Antes de código**

- [ ] Leí este maestro §0–§7  
- [ ] Identifiqué hermanos (§2) del módulo tocado  
- [ ] ¿Toca PE/cadena? → §3 grupo uno · DPE sin BCL  
- [ ] ¿Toca filtros/facetas? → §4 cascada  
- [ ] ¿Toca grilla TODOS/CP+PE? → §5 paginación + cardKey  

**Durante**

- [ ] Misma función/ley en **todos** los hermanos del mapa (mismo turno)  
- [ ] `hasSidebarFilters` / dims alineadas al UI real (`_ids` plural)  
- [ ] Meta: replace con cascada; no merge universo  
- [ ] Paginación: cursores §5.1  
- [ ] Tipo: prioridad LIQ > Promo > Normal en AM y Web  

**Smoke mínimo (PASS/FAIL)**

```bash
cd rimec-web
npx tsx scripts/_audit_venta_100.ts
# Esperado: PASS 100% cardKey en A/B/C
```

- [ ] Combo Marca + LIQ: LÍNEA acotada (≠ universo ~841)  
- [ ] Combo LIQ: `hasMore` hasta agotar cardKeys  
- [ ] MODARE CERRADO LIQ: 3 tarjetas si stock = CSV sdrm vigente  
- [ ] Badge PROMO/LIQ no pasa chip NORMAL  

**Cierre**

- [ ] CHUSAR del módulo cita **2.2.1.44** + hermanos tocados  
- [ ] Si divergencia temporal → deuda explícita + orden Director  
- [ ] **No deploy prod** rimec-web sin cierre etapa / orden directa  

---

## 9 · Archivos ancla (no inventar rutas)

```
rimec-web/lib/filtros/filtro-tipo-canonico.ts
rimec-web/lib/filtros/cadena-dpe-triunvirato.ts
rimec-web/lib/pilares/codGrupoCadena.ts
rimec-web/lib/catalogoPaginado.ts          # cursores TODOS
rimec-web/lib/catalogoMetaRpc.ts           # multi-marca + acotar
rimec-web/lib/catalogoData.ts              # select meta PE con flags
rimec-web/lib/catalogoFiltrosEntrada.ts    # hasSidebarFilters
rimec-web/app/api/catalogo/filtros/route.ts
rimec-web/app/CatalogoClient.tsx
report/src/lib/filtros/filtro-tipo-canonico.ts
report/src/lib/stock-pronta-entrega/cadena-dpe-triunvirato.ts
report/src/lib/pilares/cod-grupo-decode.ts
```

---

## 10 · Referencias

- [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md)  
- [CHUSAR_LEY_DPE_SIN_BCL_20260727.md](../2.3_report/deposito_rimec/CHUSAR_LEY_DPE_SIN_BCL_20260727.md)  
- [CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](../2.3_report/facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md)  
- [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md)  
- [CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md](./CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md)  
- [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](./CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md)  

**Orden Director:** Documenta · unificar protocolo hermanos siameses · 2026-08-06.
