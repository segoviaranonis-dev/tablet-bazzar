# CHUSAR — Casos comerciales · Índice de contribución

**Código:** **2.3.1.7.1.0** · Corazón 1 · Biblioteca  
**Ratificado:** Director · 2026-07-07  
**Shibboleth:** Andrés, el que viene.

> **No confundir:** **5 casos comerciales** (estrategia + índice) ≠ **5 pilares** (`linea`, `referencia`, `material`, `color`, `talla_grada`).

---

## Qué es un caso

Un **caso** (`caso_precio_biblioteca`) es una **estrategia comercial** dentro de la biblioteca:

| Pieza | Significado |
|-------|-------------|
| **Nombre** | Código estrategia · ej. `ACT-BRSPORT`, `BR-VZ-MD-ML-MKA-O` |
| **Líneas BCL** | Qué `linea.codigo_proveedor` pertenecen a esta estrategia |
| **Dólar política** | Cotización USD usada para formar precio (ej. 7200, 8000) |
| **Factor conversión** | Margen / multiplicador comercial en **%** (ej. 180, 170) |
| **Descuentos d1–d4** | Cascada opcional sobre LPN |
| **Índice Gs** | **Índice de contribución** — número único que resume la estrategia |

**Regla:** el **mismo SKU** (5 pilares) puede tener **precio distinto** según el **caso** asignado a su línea.

---

## Fórmula del índice — lenguaje Director

El Director expresa la estrategia como **factor × dólar**:

```
Índice Gs = trunc( dolar_politica × factor_conversion / 100 )
```

| Director dice | En BD | Índice Gs |
|---------------|-------|-----------|
| **180 × 7200** | `factor=180` · `dolar=7200` | **12.960** |
| **170 × 8000** | `factor=170` · `dolar=8000` | **13.600** |
| **180 × 8000** | `factor=180` · `dolar=8000` | **14.400** |
| **170 × 7500** | `factor=170` · `dolar=7500` | **12.750** |

**Defaults código** si faltan datos: dólar **8000** · factor **180** → índice **14.400**.

Implementación canónica Report:

```typescript
// report/src/lib/motor-precios/caso-utils.ts
calcIndiceGs(dolar, factor) => Math.trunc((dolar * factor) / 100)
```

Paridad Streamlit: `biblioteca_ui.py` — mismo cálculo en UI editor.

---

## Los 5 casos canónicos (biblioteca 1905 · proveedor 654)

Biblioteca de referencia: **1905** (`BIBLIOTECA_CANONICA_NOMBRE`).  
Nombres estables del holding — líneas y parámetros exactos viven en BD.

| # | Caso | Estrategia comercial (semántica) | Dólar × Factor típico | Índice Gs ref. | Escala líneas |
|---|------|----------------------------------|----------------------|----------------|---------------|
| **1** | **`BR-VZ-MD-ML-MKA-O`** | Brasil · Venta · Mayorista · Molekinha · Original — **núcleo calzado** | 7200 × 180 · o 8000 × 180 | 12.960 · 14.400 | ~1000+ |
| **2** | **`ACT-BRSPORT`** | Activo deportivo / sport | 8000 × 170 | 13.600 | ~125 |
| **3** | **`CARTERAS`** | Carteras y accesorios | 8000 × 170 | 13.600 | ~270 |
| **4** | **`CHINELO`** | Chinelo / sandalia | 8000 × 170 | 13.600 | pocas |
| **5** | **`PROMOCIONAL`** | Promoción / liquidación controlada | 7500 × 170 | 12.750 | ~24 |

**Nota:** el índice **identifica** la estrategia en UI (`BibliotecaCasoBar`, depósito, stock tránsito/programado). Si cambian dólar o factor en editor, el índice **cambia** — conviene congelar en evento cerrado (`precio_evento_caso` snapshot).

Fuente histórica verificada: `8_historico/CONTEXTO_PPT.md` § Corazón 2 · UI depósito `CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md`.

---

## Qué hace el índice en el ciclo

```
Caso (dólar + factor + descuentos + líneas BCL)
        +
Excel SKUs (FOB proveedor)
        =
precio_lista (LPN / LPC por molécula L+R+material)
        ↓
IC elige evento · PP hereda listado
        ↓
FI / catálogo web / panel estrategia muestran caso + precio
```

| Etapa | Campo caso / índice |
|-------|---------------------|
| Biblioteca | `caso_precio_biblioteca.dolar_politica`, `factor_conversion` |
| UI filtros | `indice_gs` calculado · etiqueta «índice 14.400 Gs» |
| Evento cerrado | `precio_evento_caso` copia parámetros |
| `precio_lista` | `nombre_caso_aplicado`, `dolar_aplicado`, `indice_aplicado` |
| Web markup | `diccionario_precio.md` — markup **por nombre caso** (+40% / +50%) |

**Índice ≠ precio final venta.** El índice parametriza el motor; LPN sale del Excel + reglas SQL; web puede sumar markup caso.

---

## Tablas BD

| Tabla | Campos clave |
|-------|--------------|
| `caso_precio_biblioteca` | `nombre_caso`, `dolar_politica`, `factor_conversion`, `descuento_1…4` |
| `biblioteca_caso_linea` | `caso_biblioteca_id`, `linea_id`, `biblioteca_id` |
| `precio_evento_caso` | Snapshot al copiar bib→evento (Memoria 7.2.1) |
| `precio_lista` | `nombre_caso_aplicado`, `indice_aplicado`, LPN/LPC |

---

## Dónde se consume (sin recalcular)

| Módulo | Uso |
|--------|-----|
| Motor biblioteca editor | CRUD casos · muestra índice |
| Depósito Bazzar · Filtros por índice | Acordeón por caso · filtra líneas BCL |
| `/stock-transito` · `/stock-programado` | `BibliotecaCasoBar` + `indice_gs` |
| RIMEC Web catálogo | Caso vía listado · markup `caso_precio_web_regla` |

Doc puente: [CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md](../depositos/CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md)  
Doc web: [diccionario_precio.md](../../3_arquitectura/3.3_integracion/diccionario_precio.md)

---

## Leyes

1. **Una línea → un caso** por biblioteca (exclusividad BCL).
2. **Caso = solo pilar línea** — referencia/material son del SKU Excel, no de la matriz caso.
3. **Sin caso asignado a la línea** → Preview debe asignar huérfana antes de cerrar evento.
4. **Comparar estrategias** = comparar índices y descuentos, no solo LPN final.

---

## Estado documentación *(2026-07-07)*

| Pieza | Estado |
|-------|--------|
| Fórmula índice | ✅ código + `CONTRATO_ARQUITECTURA.md` |
| 5 nombres caso | ✅ este doc + PPT histórico + filtros depósito |
| Semántica BR-VZ-… | ✅ comercial + `diccionario_precio.md` |
| Tabla dólar×factor por caso en Moria activa | ✅ **este CHUSAR** |
| Valores BD vivo biblioteca 1905 | ⏳ validar en editor / SQL si difieren |

---

## Referencias

- [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](./CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md)
- [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)
- [CHUSAR_MOTOR_PRECIOS.md](./CHUSAR_MOTOR_PRECIOS.md)
- [INDICE.md](./INDICE.md)
