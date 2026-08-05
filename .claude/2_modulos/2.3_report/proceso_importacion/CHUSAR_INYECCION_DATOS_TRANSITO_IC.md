# CHUSAR — Inyección de datos en tránsito · IC PROGRAMADO · Excel batch

**Código:** **2.3.1.7.3.3**  
**Ratificado:** Director · 2026-07-09  
**Estado:** ✅ **373 IC en bandeja** · script emergencia OK · **etapa cerrada 2026-07-09** · UI import-batch fase 2  
**Etapa:** [ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709_CERRADA.md](../../../4_etapas/ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709_CERRADA.md)  
**Estrategia:** [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · **2.3.1.12**

**Shibboleth:** Andrés, el que viene.

---

## 1 · Por qué existe esta excepción

| Hecho | Implicación |
|-------|-------------|
| **≥ 412 IC** pendientes de alta | Formulario UI `/intencion-compra/nueva` no escala |
| Ciclo importaciones **sin fin** | Stock de IC **solo crece** — nunca habrá menos carga que hoy |
| PP-16 validó **39 IC** + import proforma | Pipeline PROGRAMADO funciona — cuello de botella es **alta IC** |
| Director ratifica excepción | **Inyección Excel** documentada · reutilizable en otras tapas |

**Ley:** esta excepción **no** abre pilares Retail ni toca Sales Report. Solo cabecera `intencion_compra`.

---

## 2 · Definición — «Inyección de datos en tránsito»

```
Excel Director  →  Preview (validación FK)  →  INSERT lote  →  Bandeja IC PENDIENTE
                                                              →  Autorizar (manual o lote fase 2)
                                                              →  Digitación → PP → proforma
```

| Término | Significado |
|---------|-------------|
| **Datos en tránsito** | Comercial importadora en movimiento (IC/PP/FI) antes de stock nacionalizado |
| **Inyección** | Escritura masiva transaccional — bypass UI campo a campo |
| **Tránsito** | Alineado con [CHUSAR_MERCADERIA_EN_TRANSITO.md](../gestion_compra/CHUSAR_MERCADERIA_EN_TRANSITO.md) · universo Madre B |

**Patrón reutilizable:** mismo esqueleto (preview + commit + log fila) puede aplicarse a:
- Digitación batch (fase futura)
- Vinculación IC→PP masiva
- Otros módulos con volumen >50 filas — **siempre** con CHUSAR propio + orden Director

---

## 3 · Alcance v1 (PROGRAMADO únicamente)

| Incluye | Excluye |
|---------|---------|
| `categoria_id = 3` PROGRAMADO | CP (`categoria_id=2`) — etapa futura |
| INSERT `intencion_compra` | UPDATE masivo IC existentes (fase 2) |
| Estado inicial `PENDIENTE_OPERATIVO` | Autorización automática sin revisión (v1) |
| `listado_precio_id` obligatorio | SKUs · material · color · proforma |

---

## 4 · Matriz Excel → `intencion_compra`

Columnas **propuestas** para v1 — ajustar cuando Director entregue Excel real.

| # | Columna Excel (header sugerido) | Campo BD | Tipo | Obligatorio | Validación |
|---|--------------------------------|----------|------|:-----------:|------------|
| A | `codigo_cliente` / `SHOP` | `id_cliente` | FK `cliente_v2` | ✅ | Existe · activo |
| B | `codigo_vendedor` | `id_vendedor` | FK `usuario_v2` | ✅ | Rol VENDEDOR/ADMIN |
| C | `codigo_marca` | `id_marca` | FK `marca_v2` | ✅ | Catálogo |
| D | `codigo_proveedor` | `id_proveedor` | FK `proveedor_importacion` | ✅ | Activo |
| E | `tipo_codigo` | `tipo_id` | FK `tipo_v2` | ✅ | Catálogo |
| F | `categoria` | `categoria_id` | int | ✅ | **Fijo 3** o validar PROGRAMADO |
| G | `pares` / `cantidad_total_pares` | `cantidad_total_pares` | int | ✅ | > 0 |
| H | `monto_bruto` | `monto_bruto` | numeric | ✅ | ≥ 0 |
| I | `descuento_1` | `descuento_1` | int % | ⬜ | 0–100 |
| J | `descuento_2` | `descuento_2` | int % | ⬜ | 0–100 |
| K | `descuento_3` | `descuento_3` | int % | ⬜ | 0–100 |
| L | `descuento_4` | `descuento_4` | int % | ⬜ | 0–100 |
| M | `quincena_arribo` | `quincena_arribo_id` | int 0–24 | ✅ | 0=sin definir · 1–24 quincena · ver FECHA DE EMBARQUE |
| N | `evento_precio_id` | `precio_evento_id` | FK | ✅ | Evento **cerrado** |
| O | `politica_lp` | `listado_precio_id` | int 1–4 | ✅ **PROGRAMADO** | 1=LPN · 2=LPC02 · 3=LPC03 · 4=LPC04 |
| P | `plazo_codigo` | `id_plazo` | FK `plazo_v2` | ✅ | Catálogo |
| Q | `nota_pedido` | `nota_pedido` | text | ⬜ | |
| R | `observaciones` | `observaciones` | text | ⬜ | |
| S | `comision_id` | `comision_vendedor_id` | FK | ⬜ | Snap `comision_porcentaje_snap` |
| T | `fecha_registro` | `fecha_registro` | date | ⬜ | Default hoy |

### Campos auto (motor — no van en Excel)

| Campo | Regla |
|-------|-------|
| `numero_registro` | `IC-YYYY-XXXX` secuencial · paridad `save_intencion` |
| `estado` | `PENDIENTE_OPERATIVO` |
| `monto_neto` | `calcular_neto` motor — **no** confiar en Excel salvo columna explícita futura |
| `fecha_llegada` | **Legacy** — no usar |

### Lección PP-16 (columna crítica)

En proforma Beira Rio, **col. J = SHOP** = `id_cliente` IC. La inyección IC debe usar **el mismo código cliente** que luego empareja el import proforma.

---

## 5 · Flujo UI planificado (Report)

| Paso | Pantalla | Acción |
|------|----------|--------|
| 0 | `…/intencion-compra/import-batch` | Subir `.xlsx` / `.csv` |
| 1 | Preview | Tabla filas OK / ERROR · contadores |
| 2 | Commit | INSERT lote · overlay espera |
| 3 | Resultado | Link bandeja PENDIENTES · log descargable |

**APIs planificadas:**

| Método | Ruta | Rol |
|--------|------|-----|
| POST | `/api/proceso-importacion/intencion-compra/import-batch/preview` | Parse + validación |
| POST | `/api/proceso-importacion/intencion-compra/import-batch/commit` | INSERT transaccional |
| GET | `/api/proceso-importacion/intencion-compra/import-batch/plantilla` | Descarga Excel vacío con headers |

Auth: `requireMotorPreciosAdmin` (misma familia IC).

---

## 6 · Reglas de validación (preview)

| Regla | Error fila |
|-------|------------|
| FK inexistente | `CLIENTE_NO_ENCONTRADO` · etc. |
| `categoria_id ≠ 3` en v1 | `CATEGORIA_NO_PROGRAMADO` |
| `listado_precio_id` null o ∉ {1,2,3,4} | `LP_OBLIGATORIO_PROGRAMADO` |
| `precio_evento_id` no cerrado | `EVENTO_ABIERTO` |
| Duplicado mismo cliente+marca+pares+evento en lote | `DUPLICADO_LOTE` (warning) |
| Fila vacía | SKIP |

**Transacción commit:** un fallo crítico en fila marcada OK → **ROLLBACK** completo lote (v1 conservador).

---

## 7 · Volumen y performance

| Parámetro | Valor Director | Nota técnica |
|-----------|----------------|--------------|
| IC objetivo | **412+** | Primera carga |
| Crecimiento | Monótono | Diseñar idempotencia futura |
| Batch size | 412 filas v1 | Una transacción · <30 s objetivo |
| Post-carga | Autorizar manual / lote fase 2 | Fuera alcance v1 |

---

## 8 · Relación con cadena PROGRAMADO

```mermaid
flowchart LR
  INJ[Inyección Excel IC] --> BAN[Bandeja PENDIENTE]
  BAN --> AUT[Autorizar IC]
  AUT --> DIG[Digitación]
  DIG --> PP[Pedido Proveedor]
  PP --> PRO[Import proforma]
  PRO --> FI[39+ FI RESERVADA]
  FI --> CSV[CSV veneno Carlos]
```

Referencia éxito: [CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md)

---

## 9 · Anti-patrones (prohibido)

| ❌ | Por qué |
|----|---------|
| Inyectar SKUs en IC | IC = cabecera financiera · [CHUSAR_INTENCION_COMPRA.md](./CHUSAR_INTENCION_COMPRA.md) |
| Default cliente 276 STOCK | Solo CP · PROGRAMADO = SHOP real |
| Autorizar 412 sin preview | Director debe ver errores por fila |
| Mezclar CP y PROGRAMADO en mismo lote v1 | Simplificar validaciones |
| Calcular neto en Excel sin motor | Usar `calcular_neto` Python/TS |

---

## 10 · Checklist implementación (agente)

| # | Tarea | Estado |
|---|-------|--------|
| 1 | Plantilla Excel descargable | ⏳ |
| 2 | Parser XLSX (reuse motor precios paso 0) | ⏳ |
| 3 | Preview API + UI | ⏳ |
| 4 | Commit bulk INSERT | ⏳ |
| 5 | Log evidencia `INSERT` count | ⏳ |
| 6 | Smoke 10 filas → bandeja | ✅ |
| 7 | Carga 373 con Director | ✅ |
| 8 | Orden Excel invertido + deploy prod | ✅ |

---

## 11 · Índice Moria

| Código | Doc |
|--------|-----|
| 2.3.1.7.3 | IC general |
| 2.3.1.7.3.0.1 | Política LP |
| 2.3.1.7.3.3 | **Este doc** |
| 2.3.1.12 | Alejandro Magno |
| 2.3.1.16 | Mercadería en tránsito (concepto madre) |

---

**Shibboleth:** Andrés, el que viene.
