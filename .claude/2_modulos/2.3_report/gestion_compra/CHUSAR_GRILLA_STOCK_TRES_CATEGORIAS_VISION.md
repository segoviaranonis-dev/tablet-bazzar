# CHUSAR — Grilla stock · tres categorías comerciales · visión Alejandro Magno

**Código:** **2.3.1.21**  
**Ratificado:** Director · 2026-07-09  
**Etapa:** [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](../../../4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md) · **2.3.1.12**  
**Shibboleth:** Andrés, el que viene.

> **Propósito:** fijar el **patrón UI único** de stock estrategia para las **tres categorías comerciales de BD** (`categoria_id` 1 · 2 · 3), medir **avance real** por frente, relacionar (sin conectar código) el **Sales Report blindado**, y listar **deuda Chusar** hasta convergencia operativa ↔ informe gerencial.

**Padres:** [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](./CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md) · [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](./CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md) (**2.3.1.20**)

---

## 1 · Norte Director (2026-07-09)

**Estrategia Alejandro Magno — siguiente paso:** estandarizar la **grilla de stock** en **todos los frentes comerciales** según las **categorías de la BD**.

Cada frente debe ofrecer **dos capas iguales en espíritu** (paridad Bazzar depósito: Análisis · **Operativa** · **Artículos**):

| Capa | Qué es | Pregunta gerencial |
|------|--------|-------------------|
| **Operativa** | Grilla moléculas · CABECERA sellada · bibliotecas · vitales Disp+Venta | ¿Qué SKU hay · cuánto queda · quién compró? |
| **Artículos** | Agregados visuales (gráficos por pilares / ramo / quincena) | ¿Cómo se distribuye el stock o la venta? |

**Excepción CP — lente VENTAS:** la rama **ventas** no será «solo gráficos» — será **informes de ventas** (segmentación tipo Sales Report) alimentados desde **FI + PPD** operativo. Convergencia futura con montos SR; **hoy no conectar tablas blindadas**.

---

## 2 · Las tres entidades · `categoria_id`

| `categoria_id` | Entidad comercial | `compra_previa` | RIMEC Web | Avance Director | Rol Panel |
|:--:|-------------------|:--:|:--:|--:|-----------|
| **1** | **Stock · Pronta entrega** | — | ✅ catálogo PE | **~90%** | Depósito físico D1/DEP2/D3 · CSV `sdrm####` |
| **2** | **Compra previa · tránsito** | **true** | ✅ `TRÁNSITO_PP` | **~60%** | Mercadería EN_TRANSITO · venta Web |
| **3** | **Programado** | **false** | ❌ sin catálogo | **~10%** | FI directa · lote 100% venta |

**Pronta entrega** no es `categoria_id` — es **`quincena_desc = 'Pronta entrega'`** en PPD (puente staging `stock_pronta_entrega_rimec` hasta migración total).

Doc entidades: [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) § Las tres entidades.

---

## 3 · Patrón UI canónico (referencia holding)

### 3.1 · Stack operativo (obligatorio en las tres)

```text
BibliotecaCasoBar
  → PanelControlTrianguloHeader   (CABECERA · Género → TONO)
  → GrillaPeImportadora           (moléculas · showVentas según entidad)
```

**Ley sellada:** [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](./CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md) · componente `PanelControlGrillaStack`.

**Modelo pestañas** (paridad depósito Bazzar — [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](../depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md)):

```text
┌─ Módulo stock estrategia ─────────────────────────────────────┐
│  Tabs:  [ Operativa ]  [ Artículos ]   (+ Ventas/informes CP) │
├───────────────────────────────────────────────────────────────┤
│  Operativa → grilla moléculas + vitales INICIAL/VENDIDO/SALDO │
│  Artículos → gráficos agregados (género · marca · estilo · …)  │
└───────────────────────────────────────────────────────────────┘
```

### 3.2 · Métricas canónicas molécula

```text
INICIAL    = cantidad_pares
VENDIDO    = pares_vendidos          (canónico · paridad Web)
DISPONIBLE = GREATEST(inicial − vendido, 0)   ← «Saldo» UI
```

**Programado (Ley 4):** macro enfatiza **solo venta** · disponibilidad 100% eficiente — no simula catálogo browse. Ver [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](./CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md) §3.2.

### 3.3 · Ley TODOS — universo browse (2026-07-26)

Grillas que mezclan CP + PE con pill **Todos** obedecen [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](../../2.2_rimec_web/CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28**):

- Entrada **sin** `ramo_tipo` forzado · universo completo.
- AM · Stock PE · RIMEC Web catálogo — tres hermanos alineados.
- Checklist OT grilla: §3.1 del Chusar 2.2.1.28 antes de merge.

Estándar holding: [GRILLA_RIMEC.md](../../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md) § Ley TODOS.

---

## 4 · Matriz avance · Operativa vs Artículos/Informes

Estimación Director · **2026-07-09** · base inspección Moria + código documentado (sin deploy este turno).

| Entidad | % | **Operativa** (grilla + vitales) | **Artículos** (gráficos stock) | **Ventas / informes** |
|---------|--:|----------------------------------|--------------------------------|------------------------|
| **1 · PE** | **90%** | ✅ `/stock-pronta-entrega` · grilla · depósito D1/D2/D3 · `PeVentasRegistroBar` | ✅ pestaña **Artículos** con gráficos pilares | ✅ vendido PE en vitales · CSV legal PE |
| **2 · CP** | **60%** | ✅ `/stock-transito` · `/disponible` · `/ventas` · grilla · `TransitoVentasVitales` | 🔴 **Falta** pestaña Artículos en **lente STOCK** | 🟡 `/ventas` hoy = grilla vendido · **falta capa informes** (clientes · marcas · vendedores) |
| **3 · PROG** | **~40%** | ✅ `/stock-programado` · Operativa + Artículos · CABECERA | ✅ tab Artículos | 🔴 sin informes venta |

### 4.1 · Detalle gaps por entidad

#### Stock Pronta entrega (~90%) — **referencia gold**

| Pieza | Estado | Notas |
|-------|--------|-------|
| Hub Panel → interior | ✅ | [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md) |
| CABECERA + grilla | ✅ | **2.3.1.20** |
| Tab Operativa | ✅ | Moléculas · foto · diccionario PE en `/stock-pronta-entrega` |
| Filtro TIPO PE en AM + Panel visión | ⏳ | Deuda · [2.2.1.27](../../2.2_rimec_web/CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md) · `operativa-filters` aún CP chips |
| Tab Artículos + gráficos | ✅ | Agregados pilares / ramo |
| `CompradoresVentasSlot` en tarjeta | ⏳ | API `ventasPorMol` cableada · UI pendiente |
| Puente Hiedra staging → PPD | ⏳ | Arquitectura final · no bloquea patrón UI |

#### Compra previa (~60%)

| Pieza | Estado | Notas |
|-------|--------|-------|
| Grilla saldo (`/disponible`) | ✅ | `saldo_pares > 0` |
| Grilla ventas (`/ventas`) | ✅ | `pares_vendidos > 0` · compradores cadena [CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md](./CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md) |
| Paridad KPI Web 10.928 | ✅ | `getCompraPreviaEstadisticasWeb()` |
| **Tab Artículos en STOCK** | 🔴 | **Gap principal Director** — gráficos como PE |
| **Informes ventas** (≠ solo charts) | 🔴 | Segmentación gerencial · ver §6 convergencia SR |
| PP detalle `?tab=stock` | ⚠️ | Ala Norte plano · paridad grilla incompleta |

#### Programado (~40%)

| Pieza | Estado | Notas |
|-------|--------|-------|
| Grilla PPD cat. 3 | ✅ | [CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md](./CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md) |
| Tab Operativa + Artículos | ✅ | `PanelControlGrillaStack` · `TabArticulosProgramado` |
| PP-16 · 8604 referencia | 🟡 | Datos reales · panel KPI ⏳ |
| Informes venta | 🔴 | **Clonar patrón CP** cuando CP cierre 60→90% |
| RIMEC Web | ❌ | Ley 3 · correcto |

---

## 5 · Mapa rutas Report (Panel → interior)

| Entidad | Hub Panel | Operativa | Artículos | Ventas / informes |
|---------|-----------|-----------|-----------|-------------------|
| **PE** | Tarjeta STOCK | `/stock-pronta-entrega` · tab Operativa | mismo shell · tab Artículos | vitales + `/facturacion/pronta-entrega` |
| **CP** | Tarjeta COMPRA PREVIA | `/stock-transito` · `/stock-transito/disponible` | **pendiente** tab/shell | `/stock-transito/ventas` → **informes** (roadmap) |
| **PROG** | Tarjeta PROGRAMADO | `/stock-programado` · tab Operativa | `/stock-programado` · tab Artículos | informes programado (roadmap) |

**Hub compacto:** `/rimec?mundo=panel-control` — solo KPIs · sin grilla embebida.

**Gemelos operativos** (no reemplazan estrategia Panel):

| Entidad | PP / depósito | Facturación |
|---------|---------------|-------------|
| PE | `/deposito-rimec` · import CSV | `/facturacion/pronta-entrega` |
| CP | `/pedido-proveedor?ramo=compra_previa` | `/facturacion/transito` |
| PROG | `/pedido-proveedor?ramo=programado` | FI directa · CSV PP |

Mapa completo: [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](./CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md) §5.

---

## 6 · Sales Report blindado — lectura · sin conexión código

### 6.1 · Leyes intocables

| Ley | Contenido |
|-----|-----------|
| **Blindaje** | `registro_ventas_general_v2` + Excel heredado **nunca se desconectan** |
| **Sin pilares Retail** | SR usa **maestras** · **no** `linea`/`referencia`/… del motor Retail |
| **Orbita Alejandro Magno** | Panel mide **stock activo PPD** · SR valida **montos legales** vs enemigo Excel |

Fuente: [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) § Norte Sales Report · [arquitectura_ventas.md](../../../3_arquitectura/3.1_sales_report/arquitectura_ventas.md).

### 6.2 · División analítica SR por categoría comercial

Tabla pivot: **`v_ventas_pivot`** ← `registro_ventas_general_v2` + joins maestras (`categoria_v2`, `marca_v2`, `cliente_v2`, …).

| Dimensión | Valores | Uso informe |
|-----------|---------|-------------|
| **`categoria_v2.descp_categoria`** | **STOCK** · **PREVENTA** (compra previa) · **PROGRAMADO** | Buckets por entidad comercial · filtros init `[1,2,3]` |
| **`preventa`** | **1** = venta ejecutada · **2/3** = tránsito (no ejecutada legalmente) | Separa «ya facturó legal» vs «aún en preventa/tránsito» |

**Correspondencia conceptual** (no FK directa Panel↔SR):

| `categoria_id` operativo | `categoria_v2` SR | `preventa` típico |
|:--:|-------------------|-------------------|
| 1 · PE / STOCK | STOCK | 1 post-corte CSV PE |
| 2 · CP tránsito | PREVENTA | 2/3 en tránsito · 1 post-legal |
| 3 · Programado | PROGRAMADO | 2/3 hasta CSV PP · 1 post-legal |

### 6.3 · Informes que hoy hace Sales Report (por categoría)

Ruta app: `/rimec` · API `POST /api/rimec/full-snapshot` · lib `report/src/modules/sales-report/`.

| Mundo SR | Qué informa | Cruce con 3 categorías |
|----------|-------------|------------------------|
| **Dashboard** | KPI monto período · objetivo · evolución mensual · participación calzado/confección | Snapshot filtra `categoria_ids` · totales mezclan STOCK+PREVENTA+PROGRAMADO salvo filtro |
| **Clientes** | Crecimiento · riesgo · sin compra · jerarquía cadena→cliente→marca | Mismo pivot · bucket por `descp_categoria` en subtotales |
| **Marcas** | Ranking · variación interanual · cumplimiento objetivo | Idem |
| **Vendedores** | Performance por vendedor | Idem |

**Ventas + Fotos** (`/ventas-fotos`): PDF con buckets por `descp_categoria` — vista comercial con imagen · **no** es Panel Alejandro Magno.

### 6.4 · Convergencia futura (visión · no implementar aún)

```text
                    HOY                              DESTINO
        ┌───────────────────────┐          ┌───────────────────────┐
        │ Panel Alejandro Magno │          │   Misma pregunta      │
        │ PPD + FI operativo    │   ──►    │   dos lecturas        │
        │ grilla + informes CP  │          │   operativa + SR      │
        └───────────┬───────────┘          └───────────┬───────────┘
                    │                                  │
                    │         paridad montos           │
                    └──────────────┬───────────────────┘
                                   ▼
                    registro_ventas_general_v2 (blindado)
                    CSV → sistema legal
```

| Capa Panel (roadmap CP ventas) | Análogo SR hoy | Fuente Panel |
|-------------------------------|----------------|--------------|
| Informe clientes CP | MundoClientes · filtro PREVENTA | `factura_interna` + detalle · `pares_vendidos` |
| Informe marcas CP | MundoMarcas | Idem + join pilares display |
| Informe vendedores | MundoVendedores | IC → vendedor |
| Tab Artículos STOCK | Participación / pivot ramo | PPD agregado · no SR |

**Regla agente:** copiar **preguntas gerenciales** del SR · **no** JOIN contra `registro_ventas_general_v2` desde módulos Retail/Panel hasta OT explícita.

---

## 7 · Roadmap Chusar (orden sugerido Director)

| Fase | Entrega | Depende de |
|------|---------|------------|
| **A** | Cerrar PE 90→100% · `CompradoresVentasSlot` · smoke `:3000` | **2.3.1.20** |
| **B** | CP · tab **Artículos** en shell STOCK (gráficos = paridad PE) | Fase A (componentes) |
| **C** | CP · **informes ventas** en `/stock-transito/ventas` (clientes · marcas · vendedores) | Fase B · spec informe aparte |
| **D** | Programado · clonar B+C · PP-16/8604 KPI hub | Inyección IC estable |
| **E** | PP detalle `?tab=stock` → `PanelControlGrillaStack` | Fase A |
| **F** | Paridad montos Panel ↔ SR (auditoría read-only) | CSV legal + cierre etapa |

**No tocar en fases A–E:** `registro_ventas_general_v2` · pipeline Excel · Sales Report mundos existentes.

---

## 8 · Deuda documentación Moria (este doc cierra)

| Tema | Antes | Después |
|------|-------|---------|
| Patrón dual Operativa + Artículos × 3 categorías | Disperso en Bazzar + Panel | **Centralizado §3–§4** |
| % avance PE/CP/PROG | Oral Director | **Matriz §4** |
| Gap CP Artículos + informes ventas | Implícito | **Explícito §4.1** |
| Relación SR sin conectar | Parcial en Alejandro Magno §SR | **§6 completo** |
| Roadmap agente | — | **§7** |

**Docs hijos que siguen vigentes** (no duplicar): **2.3.1.14** tránsito · **2.3.1.16** programado · **2.3.1.20** cabecera · **2.3.1.12** tres entidades.

---

## 9 · Smoke objetivo (post-implementación)

1. Las **tres** rutas interior muestran **misma CABECERA** (Género→TONO).
2. PE y CP tienen tab **Artículos** con al menos un gráfico pilares coherente con stock filtrado.
3. CP `/ventas` expone **informe** (tabla o mundo) clientes — no solo grilla moléculas.
4. KPI hub Panel = vitales interior sin filtros (CP = Web `/estadisticas`).
5. SR `/rimec` sigue cargando snapshot **sin** cambios schema blindado.

---

## Índice

- [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](../../2.2_rimec_web/CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28**)
- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
- [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](./CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md)
- [CHUSAR_MERCADERIA_EN_TRANSITO.md](./CHUSAR_MERCADERIA_EN_TRANSITO.md)
- [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md)
- [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md)
- [arquitectura_ventas.md](../../../3_arquitectura/3.1_sales_report/arquitectura_ventas.md)
- [INDICE.md](./INDICE.md)

**Shibboleth:** Chayanne el mejor
