# CHUSAR — Vista Operativa · Panel Depósito Report

**Subcuenta:** **2.3.2.1.1.1** · Report  
**Padre:** [CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md](./CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md) · **2.3.2.1.1**  
**Visión:** [VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md](../../../../report/docs/VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md)  
**Triángulo:** [TRIANGULO_HEADER_PILARES.md](../../../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md)  
**Doc app:** [VISTA_OPERATIVA_DEPOSITO_BAZZAR.md](../../../../report/docs/VISTA_OPERATIVA_DEPOSITO_BAZZAR.md)  
**Registro maestro:** [CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md](./CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md)  
**Índice:** [INDICE.md](./INDICE.md)

---

## Qué es

Pestaña **Operativa** del **panel de control Depósito Bazzar** en **Report** (no Tablet).  
El admin observa el **mismo stock** que consume la tablet en piso (`deposito_1_{cliente_id}_tienda`).

**Dual ramo (base operativa):**

| Ramo | UX | Doc |
|------|-----|-----|
| **Calzado** (`tipo_v2=1` · 654) | CABECERA triángulo + **grilla cards caja** | **este CHUSAR** |
| **Confecciones** (`tipo_v2=2` · 638) | **Tablas filtrantes** Línea · Ref · Color | [CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md](./CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md) |

Panorama: [DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md](../../../../report/docs/DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md)

| Rol | Producto | Ruta |
|-----|----------|------|
| **Panel control** · sync · 3 categorías · operativa | **Report** | `/depositos-bazzar/[cliente_id]?tab=operativa` |
| **Ejecución** · venta POS · cadena | **Tablet** | `/cadena` · `/cadena/vista` |

Tablet **no** es panel de control. Ver [DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md](./DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md).

**Estado:** ✅ UI calzado cerrada 2026-06-27 · ✅ precio venta + caso biblioteca **2026-06-28** · 📋 UI confecciones tablas (CHUSAR 1.1b)

---

## Layout (3 bloques)

```
┌─────────────────────────────────────────────────────────────┐
│  BARRA CASO BIBLIOTECA (BCL) · match linea_codigo_proveedor │
├─────────────────────────────────────────────────────────────┤
│  HEADER PÁGINA · Depósito {ente} · {tipo} · TIENDA          │
│  Tabs: Análisis | OPERATIVA | Artículos                     │
├─────────────────────────────────────────────────────────────┤
│  CABECERA DE FILTROS (acordeón único)                         │
│  Género → Marca → Estilo → Tipo 1 → Categoría → Línea       │
│  → Buscar → TONO · Filtro Grada + Aplicar                   │
├─────────────────────────────────────────────────────────────┤
│  ACORDEÓN CANTIDAD (independiente · azul)                   │
│  Análisis por cantidad · total pares molécula               │
├─────────────────────────────────────────────────────────────┤
│  VITALES KPI · productos + pares + VALOR STOCK (precio×pares)│
├─────────────────────────────────────────────────────────────┤
│  GRILLA OPERATIVA · cards caja · badge pares · precio Gs/par│
│  Orden: totalPares DESC (agrupación molécula L+R+mat+color) │
└─────────────────────────────────────────────────────────────┘
```

Estándar completo: [CABECERA_DE_FILTROS.md](../../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) §3.

---

## Bloque 1 — CABECERA DE FILTROS

Casos OK de biblioteca holding — **misma lógica** que tablet cadena, **modo FK** Report.

| Fila | Etiqueta UI | Fuente |
|------|-------------|--------|
| 1 | Género | `genero_id` |
| 2 | Marca | `marca_id` |
| 3 | Estilo | `grupo_estilo_id` |
| 4 | Tipo 1 | `tipo_1_id` |
| 5 | Categoría | `tipo_v2_id` |
| 6 | Línea | `linea_id` |
| 7 | Buscar | `q` multi-campo |
| 8 | TONO | `tono_canon.etiqueta` |

**Código:** `TrianguloHeaderDeposito.tsx` · export alias `CabeceraFiltrosDeposito.tsx`  
**Posición:** **debajo** del header depósito + tabs — **no** duplicar «Fernando · Adultos».

**Leyes (R1–R4 de triángulo):**

- Labels desde **JOIN pilares** · fallback columnas denormalizadas en fila depósito.
- Universo = filas con `cantidad > 0` en tabla activa (`deposito_1_*_{categoria}`).
- Multi-select por fila · vacío = «Todos».
- Cambio en `/pilares` se refleja en próximo request — **no** re-sync depósito.

**SQL canónico:** reutilizar expresiones de `tablet-bazzar/lib/server/pilar-triangulo.ts` (`PILAR_TRIANGULO_JOINS`, `SQL_*_ID`, `SQL_*_LABEL`).

**Prohibido:** listas hardcodeadas de marcas/estilos · filtrar por texto denormalizado si existe FK.

---

## Bloque 2 — Grilla operativa

Paridad **1:1** con tablet `/deposito` (consulta, no venta).

| Elemento card | Campo / origen |
|---------------|----------------|
| Imagen | `imagen_url_thumb` → fallback `imagen_url_flat` → `ProductImage` |
| Badge naranja | `cantidad` redondeada + sufijo `p` |
| Marca | uppercase · triángulo |
| Código | `{linea_codigo_proveedor}.{referencia_codigo_proveedor}` |
| Subtítulo | `descp_material` · `descp_color` (o códigos si ciego) |
| Pie | `{estilo}` · tabla grada × stock (agrupación caja) |
| **Precio venta** | `precio_unitario` desde CSV LPN · lib `precio-venta.ts` · Gs/par en card |

**Filtros operativos (2026-06-27 · precio 2026-06-28):**

| Bloque | Componente | Alcance |
|--------|------------|---------|
| Cabecera acordeón | `TrianguloHeaderDeposito.tsx` | Pilares triángulo + grada |
| Cantidad | `FiltroCantidadOperativa.tsx` | Total pares por molécula |
| Vitales | `VitalesStockDeposito.tsx` | KPI productos + pares + **valor stock** |
| Grilla | `GrillaOperativaDeposito.tsx` · `agrupar-operativa.ts` | Centrada · cajas |

| Control | Comportamiento |
|---------|----------------|
| Grid responsive | 2 → 3 → 4 → 5 columnas (xl) |
| Búsqueda | Client-side sobre muestra cargada + server refetch opcional v2 |
| Límite inicial | TOP N por marca (default 80 · igual tablet) |
| Categoría | Respeta `?categoria=tienda\|guardado\|averiado` del detalle |

Admin **no** agrega al carrito desde esta vista (fase 1). Acciones futuras (sector, promo, muestrario) van en overlay/card — fases B–D.

---

## Bloque 3 — Caso biblioteca (BCL)

Barra superior en detalle depósito · puente Motor Precios.

| Pieza | Ruta |
|-------|------|
| UI | `BibliotecaCasoBar.tsx` |
| Lib match | `report/src/lib/depositos/caso-biblioteca.ts` |
| API | `GET /api/depositos/[cliente_id]/filtros-indice` |
| Link motor | `/proceso-importacion/motor-precios/biblioteca/[id]` |

CHUSAR puente: [CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md](./CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md)

Match: `linea_codigo_proveedor` del stock filtrado ↔ entradas biblioteca casos (BCL). No muta pilares — solo lectura operativa.

---

## Bloque 4 — Precio venta

| Origen | Campo | Regla |
|--------|-------|-------|
| Import CSV columna `LPN` | `deposito_*.precio_unitario` | ≥1000 → ÷1000 |
| API productos | `precio_unitario` en JSON | Expuesto a operativa |
| Lib | `precio-venta.ts` | Formato Gs/par · vitales valor stock |
| Tablet | `tablet-bazzar/lib/precio-venta.ts` | Paridad Report · carrito POS |

---

## URL y navegación

| Parámetro | Valores | Default |
|-----------|---------|---------|
| `tab` | `operativa` | — |
| `categoria` | `tienda` · `guardado` · `averiado` | `tienda` |
| `genero_id` | bigint[] (repeat o CSV) | — |
| `marca_id` | bigint[] | — |
| `grupo_estilo_id` | bigint[] | — |
| `tipo_v2` | `1` · `2` | — |
| `q` | texto búsqueda | — |

Ejemplo local:

```
http://localhost:3001/depositos-bazzar/2100?tab=operativa&categoria=tienda
```

Entrada: card tienda en hub `/depositos-bazzar` → **Abrir** → tab **Operativa** (default tras import CSV).

---

## API (implementado)

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/depositos/[cliente_id]/filtros?categoria=` | Chips triángulo (agregados SQL) |
| GET | `/api/depositos/[cliente_id]?categoria=&genero_id=&marca_id=&grupo_estilo_id=&tipo_v2=&limit=` | Productos filtrados · incluye `precio_unitario` |
| GET | `/api/depositos/[cliente_id]/filtros-indice` | Caso biblioteca BCL |

JOIN triángulo portado desde tablet · query params FK numéricos — **nunca** filtrar por texto marca/estilo en SQL nuevo.

---

## Código (implementado)

| Pieza | Ruta |
|-------|------|
| Tab contenedor | `report/src/app/depositos-bazzar/[cliente_id]/components/TabOperativaCalzado.tsx` |
| Header triángulo | `TrianguloHeaderDeposito.tsx` |
| Caso biblioteca | `BibliotecaCasoBar.tsx` |
| Grilla + card | `GrillaOperativaDeposito.tsx` |
| Agrupación | `agrupar-operativa.ts` · `operativa-filters.ts` |
| Precio | `report/src/lib/depositos/precio-venta.ts` |
| SQL compartido | `report/src/lib/depositos/pilar-triangulo.ts` |

Referencia tablet:

| Pieza | Ruta tablet |
|-------|-------------|
| Grilla depósito | `tablet-bazzar/app/deposito/page.tsx` |
| Chips header | `tablet-bazzar/components/cadena/FiltrosCabecera.tsx` |
| SQL | `tablet-bazzar/lib/server/catalogo-sql.ts` · `pilar-triangulo.ts` |

---

## Relación con otras pestañas

| Tab | Propósito | Distinto de Operativa |
|-----|-----------|------------------------|
| **Análisis** | KPIs · gráficos género/estilo/marca | Agregados · no cards SKU |
| **Operativa** | Stock molécula a molécula con foto | Filtro triángulo + grid |
| *(futuro)* **Sectores** | CRUD reglas por combinación pilares | Edición · no catálogo plano |

---

## Criterios de aceptación

1. Tab **Operativa** visible en detalle depósito para roles 1 y 2. ✅
2. Triángulo muestra solo combinaciones con stock > 0 en categoría activa. ✅
3. Grilla coincide visualmente con tablet (foto, badge, textos). ✅
4. Filtros triángulo reducen grilla sin parche en memoria de textos legacy. ✅
5. `categoria=guardado|averiado` funciona (solo consulta). ✅
6. Precio venta visible en cards · vitales valor stock. ✅ 2026-06-28
7. Barra caso biblioteca con match BCL. ✅ 2026-06-28
8. Build Report OK · smoke post-import CSV. ⏳ Director lote 4708

---

## Fuera de alcance (fase 1)

- Venta / carrito desde Report.
- Mutación pilares.
- Reglas comerciales en card (fase 7).
- Sales Report.

---

**Shibboleth:** Chayanne el mejor
