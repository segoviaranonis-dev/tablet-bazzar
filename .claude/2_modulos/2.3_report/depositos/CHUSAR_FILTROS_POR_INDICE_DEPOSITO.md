# CHUSAR — Filtros por índice · Puente Motor Precios → Depósito Bazzar

**Subcuenta:** **2.3.2.1.1.2** · padre **2.3.2.1.1** Panel Depósito Hiedra  
**Puente arquitectura:** **PUENTE-MP-DEP-001** · [PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md](../../../3_arquitectura/3.3_integracion/PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md)  
**Origen datos:** Motor Precios Corazón 1 · **2.3.1.7.1** · [CHUSAR_MOTOR_PRECIOS](../motor_precios/CHUSAR_MOTOR_PRECIOS.md)  
**Etapa:** 🟢 [ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO.md](../../../4_etapas/ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO.md) · fase **1.2**  
**Estado CHUSAR:** 🟢 **IDEA RATIFICADA** · UI 📋 pendiente · 2026-06-27

---

## Qué es

**Puente interdisciplinario en Report:** reutiliza la **matriz comercial** del Motor de Precios RIMEC (biblioteca → casos → líneas BCL) **sin calcular precios**, para **filtrar el stock** del depósito Bazzar por caso comercial.

| Ámbito | Producto / proceso | Rol en el puente |
|--------|-------------------|------------------|
| **Origen** | Proceso · Motor Precios **2.3.1.7.1** | Lee casos + líneas ya definidos |
| **Destino** | Producto · Report Depósito Bazzar **2.3.2.1.1** | Filtra filas `deposito_1_*_tienda` |
| **Ejecución venta** | Tablet `/cadena` | **Fuera** — no consume este filtro |

**Sales Report** (`registro_ventas_general_v2`) — **blindado** · no interviene.

---

## Idea operativa (Director 2026-06-27)

1. En `/depositos-bazzar/[cliente_id]` se abre pestaña **«Filtros por índice»** (junto a Análisis · Operativa · Artículos).
2. Operador elige **biblioteca** (histórico motor · ej. #6 prueba · canónica #5 Biblioteca 1905 · proveedor **654**).
3. UI muestra **acordeones por caso** — paridad visual editor biblioteca (`ACT-BRSPORT`, `BR-VZ-MD-ML-MKA-O`, `CARTERAS`, …).
4. Cada caso muestra: **nombre · N líneas · índice Gs** (solo etiqueta; `dolar_politica × factor`).
5. Al activar un caso → grilla filtra artículos cuya **`linea_codigo_proveedor`** pertenece al set BCL del caso.
6. **No** se recalcula LPN/LPC · **no** se escribe en `precio_lista` · **solo lectura** de biblioteca.

---

## Match técnico (clave del puente)

```
biblioteca_caso_linea.linea_id  →  linea.codigo_proveedor
                                         ↕ match string normalizado
deposito_1_{cliente_id}_tienda.linea_codigo_proveedor
```

| Campo motor | Campo depósito | Regla |
|-------------|----------------|-------|
| `biblioteca_caso_linea` vía `linea.id` | `linea_codigo_proveedor` | Comparar código proveedor (entero como texto) |
| `caso_precio_biblioteca.nombre_caso` | — | Etiqueta UI acordeón |
| `dolar_politica × factor_conversion` | — | **Índice Gs** informativo en título caso |

Exclusividad BCL (una línea · un caso por biblioteca) — heredada del motor · coherente con filtro.

---

## UI objetivo

```
┌─ Depósito Fernando · Adultos · TIENDA ────────────────────────┐
├─ Tabs: Análisis | Operativa | Filtros por índice | Artículos   │
├─ Selector biblioteca (#6 prueba · canónica 1905 · …)          │
├─ ▾ Caso ACT-BRSPORT — 135 líneas · índice 13.600 Gs           │
├─ ▾ Caso BR-VZ-MD-ML-MKA-O — 1137 líneas · índice 14.400 Gs    │
├─ ▾ Caso CARTERAS — 280 líneas · índice 13.600 Gs              │
├─ Stats: X productos · Y pares (caso activo)                   │
└─ Grilla Operativa (misma `GrillaOperativaDeposito`)             │
```

**Distinto de tab Operativa (2.3.2.1.1.1):** allí filtro = **pilares** (género→marca→…→TONO). Aquí filtro = **caso comercial motor** por lista de líneas.

---

## APIs existentes (reutilizar)

| Método | Ruta | Uso puente |
|--------|------|------------|
| GET | `/api/motor-precios/biblioteca?proveedor_id=654` | Listar bibliotecas + canónica |
| GET | `/api/motor-precios/biblioteca/[id]` | Casos + `lineas[]` + `indice_gs` por caso |

**Pendiente implementación:**

| Método | Ruta propuesta | Rol |
|--------|----------------|-----|
| GET | `/api/depositos/[cliente_id]/filtros-indice?biblioteca_id=&caso_id=` | Puente lectura · opcional agregación stock por caso |

Auth: alinear con depósito Bazzar (RIMEC/Bazzar ADMIN) · no exigir solo rol motor-precios admin en consulta stock.

---

## Código previsto (Report)

| Pieza | Ruta |
|-------|------|
| Tab UI | `report/src/app/depositos-bazzar/[cliente_id]/components/TabFiltrosIndice.tsx` |
| Header casos | `.../CabeceraFiltrosIndice.tsx` (acordeón casos) |
| Filtro lib | `report/src/lib/depositos/filtros-indice.ts` |
| Page tabs | `report/.../depositos-bazzar/[cliente_id]/page.tsx` |
| Reutiliza | `GrillaOperativaDeposito.tsx` · `agrupar-operativa.ts` |

---

## Leyes

1. **Motor alimenta · depósito consume** — biblioteca solo lectura desde panel depósito.
2. **Sin precio** — índice Gs es etiqueta comercial; cero SQL a `precio_lista` / `fn_precio_*`.
3. **Proveedor default calzado:** `654` · canónica nombre contiene **1905** (`MOTOR_PROVEEDOR_DEFAULT`).
4. **Pilares intactos** — el puente no inserta en `linea` · usa FK ya resueltas en staging depósito.
5. **Tablet no replica** esta pestaña — ejecución POS sigue `/cadena` + CABECERA pilares.

---

## Enlaces cruzados

| Módulo | Código | Relación |
|--------|--------|----------|
| Motor biblioteca | **2.3.1.7.1** | Fuente casos + BCL |
| Tab Operativa pilares | **2.3.2.1.1.1** | Hermano UI · otro eje filtro |
| Panel control vs tablet | **2.3.6.01** | Report manda · tablet ejecuta |
| CABECERA DE FILTROS | **3.2** | Operativa usa pilares · **no** mezclar con índice |

---

**Shibboleth:** Chayanne el mejor
