# 2.3.1.7.1 Motor de Precios — Report

**Padre:** [proceso_importacion/INDICE.md](../proceso_importacion/INDICE.md) · **Código:** **2.3.1.7.1** (alias P.1.1)  
**CHUSAR:** [CHUSAR_MOTOR_PRECIOS.md](./CHUSAR_MOTOR_PRECIOS.md) · **Mapa agente:** [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](./CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md) · [CHUSAR ciclo](../proceso_importacion/CHUSAR_CICLO_IMPORTACION_REPORT.md)  
**Origen:** Control Central Streamlit · **Destino:** `report/` · **Ruta:** `/proceso-importacion/motor-precios`

---

## Norte

Abandonar UI confidencial del Motor en Streamlit; **paridad funcional** en Report (NIIF) para:

1. **Biblioteca de casos** (Corazón 1)
2. **Eventos / listados** — Caso + Excel = evento (Corazón 2)
3. **Importador** → `precio_lista` indexado en Postgres
4. **Vinculación PP** — `precio_evento_id` en pedido proveedor

Sales Report histórico **no usa pilares** — esta subcuenta **sí** (proceso Retail/Motor).

---

## Leyes · dos corazones

Doc canónico: [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)

```
Biblioteca de Casos (estrategia comercial)
        +
Excel proveedor (SKUs + márgenes)
        =
EVENTO → precio_lista → PP → FI → catálogo
```

---

## Tablas BD (verdad)

| Tabla | Rol |
|-------|-----|
| `biblioteca_precio` | Contenedor biblioteca (Corazón 1) |
| `caso_precio_biblioteca` | Caso comercial maestro (estrategia LPN/LPC) |
| `biblioteca_caso_linea` (BCL) | Líneas por caso — **solo** `linea_id` |
| `precio_evento` | Evento / listado (Corazón 2) |
| `precio_evento_caso` | Casos copiados al evento (Memoria 7.2.1) |
| `precio_lista` | SKUs calculados (L+R+material) |
| `intencion_compra.precio_evento_id` | Listado cerrado en IC |
| `intencion_compra_pedido` | Puente IC↔PP · sync evento |

**Cardinalidad:** `biblioteca_precio` **(1) → (N)** `precio_evento` — ver [CHUSAR_MAPA §3.1](./CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md) (**2.3.1.7.0.3**).

Política FK: [flujo_fk_eventos.md](../../3_arquitectura/3.3_integracion/flujo_fk_eventos.md) · [diccionario_precio.md](../../3_arquitectura/3.3_integracion/diccionario_precio.md)

---

## Origen Streamlit (referencia)

| Pieza | Ubicación holding |
|-------|-------------------|
| Motor UI | `control_central/` · módulo Motor de Precios |
| Reglas listado↔PP↔FI | `.cursor/rules/rimec-listado-pp-fi.mdc` |
| OT SQL masivo | [OT-MOTOR-SQL-520-001.md](../../6_ot/en_curso/OT-MOTOR-SQL-520-001.md) |
| Nomenclatura pilares | [nomenclatura_pilares.md](../../1_fundamentos/1.2_leyes/nomenclatura_pilares.md) |

---

## Destino Report (objetivo etapa)

| Entregable | Ruta |
|------------|------|
| Doc app | [report/docs/MOTOR_PRECIOS_REPORT.md](../../../report/docs/MOTOR_PRECIOS_REPORT.md) |
| Ruta UI | `/proceso-importacion/motor-precios` |
| Subcuentas | 2.3.1.7.1.1 Biblioteca · **2.3.1.7.1.1.1 Clon bib→bib** · 2.3.1.7.1.2 Crear · **2.3.1.7.2 Importación** (hijo) |

---

## Subcuentas · plan de cuentas

| Código | Pantalla | Ruta | Doc |
|--------|----------|------|-----|
| **2.3.1.7.1.0** | **Casos · índice contribución** | doc | [CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md](./CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md) |
| **2.3.1.7.1.0.1** | **Excepción PROMOCIONAL · LPN = LPC03 = LPC04** | doc + Web local | [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](./CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) · corte [2.2.1.0.11](../../2.2_rimec_web/CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md) |
| **2.3.1.7.1.0.2** | **Redondeo centena próxima · LPN/LPC** | doc + Web/Report/motor | [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](./CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) · [CHUSAR_SESION_DURO…](../gestion_compra/CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md) |
| **2.3.1.7.1.0.3** | **Arquitectura enterprise · snapshot único · cert 8 gates** | doc + MIG-179/180 prod · código local | [CHUSAR_PRECIO_ENTERPRISE_ARQUITECTURA_BANCARIA.md](./CHUSAR_PRECIO_ENTERPRISE_ARQUITECTURA_BANCARIA.md) · Excel 110/110 + promo 32/32 |
| **2.3.1.7.0.3** | **Biblioteca ↔ listado · cardinalidad 1:N** | doc | [CHUSAR_MAPA §3.1](./CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md) · ley [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md) |
| 2.3.1.7.1.1 | Histórico bibliotecas | `…/motor-precios/biblioteca` | [HISTORIAL_BIBLIOTECAS.md](./HISTORIAL_BIBLIOTECAS.md) |
| **2.3.1.7.1.1.1** | **Clon casos bib→bib** | `…/biblioteca/[id]` · panel copiar | [COPIAR_CASOS_BIBLIOTECA_EDITOR.md](./COPIAR_CASOS_BIBLIOTECA_EDITOR.md) · [CHUSAR](./CHUSAR_COPIAR_BIBLIOTECA_EDITOR.md) |
| 2.3.1.7.1.2 | Crear biblioteca | `…/biblioteca/nueva` | [CREAR_BIBLIOTECA.md](./CREAR_BIBLIOTECA.md) |
| 2.3.1.7.2 | Importación precios | `…/importacion-precios` | [proceso_importacion/](../proceso_importacion/INDICE.md) |
| **2.3.1.7.2.2** | Preview · asignar línea→caso | `…/importacion-precios/nuevo/preview` | [CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md](./CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md) |

### Funcionamiento 2.3.1.7.1.1.1 (clon)

1. Operador abre biblioteca **destino** (ej. «prueba»).
2. Elige biblioteca **origen** con casos (default: **1905** canónica).
3. **POST** clona: INSERT casos nuevos en destino + copia BCL; origen **no se modifica**.
4. Requiere **MIG-118** (`UNIQUE biblioteca_id + nombre_caso`).

Flujo completo · tablas · API · errores → [COPIAR_CASOS_BIBLIOTECA_EDITOR.md](./COPIAR_CASOS_BIBLIOTECA_EDITOR.md).

**Distinto de 2.3.1.7.2.1.1:** copiar bib → **evento** (Memoria / Corazón 2).

## Fases etapa *(orden)*

| # | Fase | Estado |
|---|------|--------|
| 1 | Inventario Streamlit vs tablas | ⏳ |
| 2 | Biblioteca casos · lectura/edición Report | ✅ |
| 2b | **Clon casos bib→bib (7.1.1.1)** | ✅ MIG-118 + API |
| 3 | Crear evento + import Excel (**2.3.1.7.2**) | ✅ [cierre](../../4_etapas/ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md) |
| 3b | Preview pilares FK (Alejandro Magno) | ✅ **4.02.01.003** · `evento-pilares.ts` |
| 4 | Cálculo SQL indexado (`precio_lista`) | ✅ |
| 5 | Vincular evento a PP (paridad `vincular_listado_precio_a_pp`) | ⏳ 2.3.1.7.5 |

### Puente interdisciplinario (consumidor Report)

| Código | Destino | Doc |
|--------|---------|-----|
| **PUENTE-MP-DEP-001** | Depósito Bazzar · tab **Filtros por índice** **2.3.2.1.1.2** | [PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md](../../3_arquitectura/3.3_integracion/PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md) · [CHUSAR depósito](../depositos/CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) |

Reutiliza BCL + casos **sin** calcular precios · solo filtra stock por `linea_codigo_proveedor`.

### Consumidores estrategia (gestión compra)

| Código | Ruta | Doc |
|--------|------|-----|
| 2.3.1.14 | `/stock-transito` | [CHUSAR_STOCK_TRANSITO](../gestion_compra/CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md) |
| **2.3.1.16** | `/stock-programado` | [CHUSAR_STOCK_PROGRAMADO](../gestion_compra/CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md) |
| — | `/stock-pronta-entrega` | [CHUSAR_PANEL_IMPORTADO_PE](../deposito_rimec/CHUSAR_PANEL_IMPORTADO_PE.md) |

---

**Shibboleth:** Andrés, el que viene.
