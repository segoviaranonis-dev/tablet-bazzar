# CHUSAR — Mapa Motor · Estrategias · Casos · Bibliotecas

**Código:** **2.3.1.7.0** · Puerta de lectura agente  
**Ratificado:** Director · 2026-07-07 · **Cardinalidad 1:N:** 2026-07-21  
**Cuándo leer:** Director cita motor de precios, biblioteca, caso comercial, estrategia de venta, listado, evento o paneles `/stock-*`  
**Shibboleth:** Andrés, el que viene.

> **Propósito:** un solo mapa que evita mezclar conceptos. La organización Moria separa **proceso Motor** (2.3.1.7.1) de **entidades comerciales** (2.3.1.11–12) pero comparten tablas y UI (`BibliotecaCasoBar`).

---

## 1 · Nomenclatura — no confundir

| Término | Qué es | Tabla / campo | Qué NO es |
|---------|--------|---------------|-----------|
| **Biblioteca** | Contenedor permanente de estrategias por proveedor | `biblioteca_precio` | Un listado concreto |
| **Caso comercial** | Estrategia LPN/LPC dentro de la biblioteca (descuentos, índice, líneas BCL) | `caso_precio_biblioteca` + `biblioteca_caso_linea` | Categoría IC (CP/PROGRAMADO) |
| **Evento / listado** | Instancia: biblioteca + Excel → SKUs calculados | `precio_evento` + `precio_lista` | Biblioteca sola |
| **Caso en evento** | Snapshot de parámetros comerciales copiados al listado | `precio_evento_caso` | Caso bib sin Excel |
| **Entidad comercial** | Discriminador del ciclo importador | `categoria_id` + `compra_previa` en IC/PP | Caso de biblioteca |
| **Estrategia de venta (panel)** | Vista Director en Report para analizar stock activo | `/stock-transito` · `/stock-programado` · `/stock-pronta-entrega` | Motor Paso 0–4 |

**Regla de oro:** el **caso** responde «¿con qué reglas de precio?»; la **entidad** responde «¿cómo llegó la mercadería y dónde se vende?».

---

## 2 · Dos corazones + tres entidades

```
CORAZÓN 1 (7.1)                    CORAZÓN 2 (7.2)
biblioteca + casos + BCL    +    Excel proveedor
              ↓                           ↓
              └──────── precio_evento ────┘
                              ↓
                        precio_lista (LPN/LPC)
                              ↓
              IC elige precio_evento_id (listado cerrado)
                              ↓
                    Digitación → PP (1 PP = 1 evento)
                              ↓
                         PPD + proforma/FI
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   STOCK (PE)           COMPRA PREVIA          PROGRAMADO
   cat. 1 / PE          cat. 2 · Web           cat. 3 · sin Web
   /stock-pronta-entrega  /stock-transito      /stock-programado
```

Ley: [motor_precios_dos_corazones.md](../../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md) · Cimiento: [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../../../1_fundamentos/PIEDRA_CIMIENTO_COSTO_ARTICULO.md)

---

## 3 · Tablas BD — roles correctos

| Tabla | Rol |
|-------|-----|
| `biblioteca_precio` | Contenedor biblioteca (proveedor, nombre, vigencia) |
| `caso_precio_biblioteca` | Caso comercial maestro (nombre, d1–d4, índice, dólar política) |
| `biblioteca_caso_linea` (BCL) | Líneas (`linea_id`) asignadas a cada caso — **solo pilar línea** |
| `precio_evento` | Listado / evento (nombre, estado, biblioteca origen, vigencia) |
| `precio_evento_caso` | Casos copiados al evento (Memoria 7.2.1) |
| `precio_evento_linea_excepcion` | Líneas huérfanas asignadas en Preview |
| `precio_lista` | SKU calculado: linea + referencia + material + LPN/LPC |
| `intencion_compra.precio_evento_id` | Listado cerrado elegido en IC |
| `intencion_compra.listado_precio_id` | Negociación / snapshot legacy — **opcional** si `precio_evento_id` está |
| `intencion_compra_pedido.precio_evento_id` | Puente IC↔PP — sync al vincular listado |
| `pedido_proveedor` + `pedido_proveedor_detalle` | Madre B · moléculas + venta |

### `precio_evento_id` vs `listado_precio_id`

| Campo | Obligatorio operativo | Uso |
|-------|:---------------------:|-----|
| `precio_evento_id` | **Sí** para IC/PP importador | FK al listado cerrado · alimenta LPN en FI |
| `listado_precio_id` | No si evento está | Negociación avanzada / snapshot MIG-073 en PPD |

**IC programado 8604:** puede tener `precio_evento_id=31` y `listado_precio_id` NULL — válido si el evento cierra el precio. Revisar `comision_vendedor_id` aparte.

### 3.1 · Cardinalidad biblioteca ↔ listado (**1:N** · Documenta 2026-07-21)

**Ratificado Director.** Política canónica del motor:

| Regla | Enunciado |
|-------|-----------|
| **R1** | Todo **listado de precios operativo** (`precio_evento` usado en IC/PP o **cerrado**) debe tener **exactamente una** biblioteca origen: `precio_evento.biblioteca_precio_id` → `biblioteca_precio.id`. |
| **R2** | Una **biblioteca** (`biblioteca_precio`) puede alimentar **varios** listados (N eventos). **No** existe unicidad inversa en BD. |
| **R3** | Tras **Paso 0** (solo Excel), `biblioteca_precio_id` puede ser **NULL** hasta Paso 1 Memoria — estado **transitorio**, no válido para IC/PP. |

```
biblioteca_precio (1)  ──<  precio_evento (N)  ──<  precio_lista
       │                           │
  Corazón 1 · maestro         Corazón 2 · instancia
  casos + BCL                 biblioteca + Excel
```

| Pregunta | Respuesta |
|----------|-----------|
| ¿Todo listado tiene biblioteca? | **Sí** en operación (Memoria aplicada · cierre · IC/PP). **No** en borrador recién cargado. |
| ¿Una biblioteca, varios listados? | **Sí.** Ej. biblioteca **#8** → eventos **#31 · #37 · #45** (programado 2026-07). |
| ¿Un listado, varias bibliotecas? | **No.** FK única en cabecera evento. Re-aplicar otra bib **reemplaza** la trazabilidad origen (Memoria 7.2.1). |
| ¿Clonar biblioteca = clonar listado? | **No.** Ver [PIEDRA_CIMIENTO § P5](../../../1_fundamentos/PIEDRA_CIMIENTO_COSTO_ARTICULO.md). |

**Código:** `report/src/lib/motor-precios/evento-biblioteca.ts` (`vincular_biblioteca` · `aplicar_biblioteca_a_evento`) · UI Memoria **2.3.1.7.2.1** · doc [COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md](../proceso_importacion/COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md).

**Ley fundamento:** [motor_precios_dos_corazones.md](../../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md) § Relación 1:N.

---

## 4 · Matriz comercial — entidades

| Entidad | `categoria_id` | `compra_previa` | Origen PPD | RIMEC Web | Panel estrategia |
|---------|:--------------:|:---------------:|------------|:---------:|------------------|
| **STOCK · PE** | — (no IC) | — | CSV `quincena_desc='Pronta entrega'` | ✅ | `/stock-pronta-entrega` |
| **COMPRA PREVIA** | 2 | **true** | IC→PP→proforma | ✅ `TRÁNSITO_PP` | `/stock-transito` |
| **PROGRAMADO** | 3 | **false** | IC PROGRAMADO→PP | ❌ Ley 3 | `/stock-programado` |

Doc entidades: [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · DOS MADRES: [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md)

---

## 5 · UI compartida — `BibliotecaCasoBar`

Componente Report que **consume** Corazón 1 sin recalcular precios:

| Módulo | API filtros | Match stock |
|--------|-------------|-------------|
| Depósito Bazzar | `/api/depositos/.../filtros-indice` | `linea_codigo_proveedor` ↔ BCL |
| Stock tránsito | `/api/stock-transito/filtros-indice` | PPD + evento CP |
| Stock programado | `/api/stock-programado/filtros-indice` | PPD cat. 3 |
| Stock PE | `/api/stock-pronta-entrega/filtros-indice` | staging PE |

Puente arquitectura: [PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md](../../3_arquitectura/3.3_integracion/PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md)

---

## 6 · Plan de cuentas Moria — dónde leer

| Tema | Código | Doc |
|------|--------|-----|
| Motor hub | 2.3.1.7.1 | [INDICE.md](./INDICE.md) · [CHUSAR_MOTOR_PRECIOS.md](./CHUSAR_MOTOR_PRECIOS.md) |
| **Casos · índice contribución** | 7.1.0 | [CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md](./CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md) |
| Biblioteca histórico | 7.1.1 | [HISTORIAL_BIBLIOTECAS.md](./HISTORIAL_BIBLIOTECAS.md) |
| Clon bib→bib | 7.1.1.1 | [COPIAR_CASOS_BIBLIOTECA_EDITOR.md](./COPIAR_CASOS_BIBLIOTECA_EDITOR.md) |
| Importación (Corazón 2) | 7.2 | [CHUSAR_IMPORTACION_PRECIOS.md](../proceso_importacion/CHUSAR_IMPORTACION_PRECIOS.md) |
| Copiar casos bib→evento | 7.2.1.1 | [COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md](../proceso_importacion/COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md) |
| Preview línea→caso | 7.2.2 | [CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md](./CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md) |
| IC + evento | 7.3 | [CHUSAR_INTENCION_COMPRA.md](../proceso_importacion/CHUSAR_INTENCION_COMPRA.md) |
| Vincular listado↔PP | 7.5.3.2 | [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](../proceso_importacion/CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) |
| Import proforma programado | 7.5.3.3 | [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](../proceso_importacion/PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) |
| Panel tránsito | 2.3.1.14 | [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](../gestion_compra/CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md) |
| Panel programado | 2.3.1.16 | [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](../gestion_compra/CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md) |
| Gestión compra hub | 2.3.1.11 | [gestion_compra/INDICE.md](../gestion_compra/INDICE.md) |

---

## 7 · Leyes transversales

1. **Sin caso → sin precio** · **Sin Excel → sin evento** · **Sin proforma → no catálogo web** (CP/PE).
2. **Matriz casos = solo línea** — prohibido match `L·R` concatenado.
3. **Caso comercial en evento** — no en `linea.caso_id` (legacy NULL).
4. **PROGRAMADO fuera de RIMEC Web** — venta directa FI.
5. **Sales Report blindado** — no cruzar pilares Retail.
6. **PP ENVIADO** — listado congelado (Compra legal).
7. **KPI CP canónico** = Estadísticas Web (`SUM cantidad_pares` EN_TRANSITO), no suma grilla filtrada.
8. **Biblioteca 1 → N listados** — todo listado operativo referencia **una** biblioteca; una biblioteca puede originar **muchos** eventos (§3.1).

---

## 8 · Trampas documentadas

| # | Trampa | Doc / error |
|---|--------|-------------|
| 1 | Confundir biblioteca con evento | Este mapa §1 |
| 2 | Copiar bib→bib cuando se necesita bib→evento | [COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md](../proceso_importacion/COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md) |
| 3 | Grilla programado desde `v_stock_rimec` | Solo CP tránsito · programado = PPD directo |
| 4 | Olvidar Memoria (7.2.1) al crear evento | `precio_evento_caso` vacío |
| 5 | `listado_precio_id` NULL = error automático | Ver §3 — validar `precio_evento_id` |
| 6 | Mezclar KPI panel con catálogo vendible | `4.02.03.003` |
| 7 | Asumir 1:1 biblioteca↔listado | §3.1 · una bib alimenta N eventos |
| 8 | Usar listado sin `biblioteca_precio_id` en IC/PP | Memoria 7.2.1 · error operativo grave |

---

## 9 · Código entry points

| Capa | Ruta |
|------|------|
| UI Motor | `report/src/app/proceso-importacion/motor-precios/` |
| Lib motor | `report/src/lib/motor-precios/` |
| APIs motor | `report/src/app/api/motor-precios/` |
| BibliotecaCasoBar | `report/src/app/depositos-bazzar/components/operativa/BibliotecaCasoBar.tsx` |
| Streamlit legacy | `control_central/modules/rimec_engine/` |

---

## 10 · Pendientes abiertos (doc + producto)

| Tema | Estado |
|------|--------|
| Editor BCL completo (7.1.1) | Parcial |
| Vincular evento PP paridad Streamlit (7.5) | ⏳ |
| Puente aplicar biblioteca Paso 0 Report | 📋 |
| Migrar PE staging → PPD | OT post-recursos |
| Cable Sales Report % rendimiento 3 entidades | Análisis |

---

**Índice padre:** [INDICE.md](./INDICE.md) · **Ciclo:** [proceso_importacion/INDICE.md](../proceso_importacion/INDICE.md)
