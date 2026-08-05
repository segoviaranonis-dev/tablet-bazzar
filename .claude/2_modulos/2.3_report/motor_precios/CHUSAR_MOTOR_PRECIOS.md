# CHUSAR — Motor de precios · Corazón 1 (2.3.1.7.1)

**Subcuenta:** **2.3.1.7.1** · **Alias:** P.1.1  
**Estado CHUSAR:** 🟢 **ACTIVO** — biblioteca operativa en Report  
**Mapa agente:** [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](./CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md) — leer primero si Director cita motor + estrategias + casos  
**CHUSAR padre:** [CHUSAR_CICLO_IMPORTACION_REPORT.md](../proceso_importacion/CHUSAR_CICLO_IMPORTACION_REPORT.md) · **Mudanza:** [CHUSAR_MUDANZA_REPORT.md](../CHUSAR_MUDANZA_REPORT.md)  
**Streamlit:** `control_central/modules/rimec_engine/` · card launcher **Motor de Precios**  
**Report:** http://localhost:3000/proceso-importacion/motor-precios

---

## Qué es

**Corazón 1** del motor: **biblioteca de casos comerciales** permanentes (`biblioteca_precio`). Estrategia LPN/LPC que luego se aplica a cada listado concreto (Corazón 2 · 2.3.1.7.2).

Card Streamlit: *«Importar FOB del proveedor, configurar casos y generar listas LPN / LPC03 / LPC04.»*

---

## Fórmula dos corazones

```
Biblioteca (casos)  +  Excel proveedor  =  precio_evento  →  precio_lista
     2.3.1.7.1              2.3.1.7.2
```

**Cardinalidad:** una `biblioteca_precio` → **N** `precio_evento`; todo listado operativo → **1** biblioteca origen (`biblioteca_precio_id`). Doc **2.3.1.7.0.3** · [CHUSAR_MAPA §3.1](./CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md).

Ley: [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)

---

## Subcuentas Report

| Código | Pantalla | Ruta | CHUSAR / inventario |
|--------|----------|------|---------------------|
| 2.3.1.7.1.1 | Biblioteca histórico | `…/motor-precios/biblioteca` | [HISTORIAL_BIBLIOTECAS.md](./HISTORIAL_BIBLIOTECAS.md) |
| **2.3.1.7.1.1.1** | Copiar casos bib→bib | editor `…/biblioteca/[id]` | [COPIAR_CASOS_BIBLIOTECA_EDITOR.md](./COPIAR_CASOS_BIBLIOTECA_EDITOR.md) · [CHUSAR](./CHUSAR_COPIAR_BIBLIOTECA_EDITOR.md) |
| 2.3.1.7.1.2 | Crear biblioteca | `…/motor-precios/biblioteca/nueva` | [CREAR_BIBLIOTECA.md](./CREAR_BIBLIOTECA.md) |
| **2.3.1.7.1.0.1** | **Excepción PROMOCIONAL LPC03=LPN** | motor + Web local | [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](./CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) · [UI Web](../2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) |
| 2.3.1.7.2 | Importación precios *(Corazón 2)* | `…/motor-precios/importacion-precios` | [CHUSAR_IMPORTACION_PRECIOS.md](../proceso_importacion/CHUSAR_IMPORTACION_PRECIOS.md) |
| 2.3.1.7.2.h | Historial listas 🔒/🗑️ | `…/importacion-precios/historial` | CHUSAR 7.2 |
| 2.3.1.7.2.0 | Paso 0 carga Excel | `…/importacion-precios/nuevo` | [PASO0](../proceso_importacion/PASO0_CARGA_EXCEL.md) |

---

## Paridad Streamlit

| Pieza Streamlit | Rol | Report |
|-----------------|-----|--------|
| `biblioteca_ui.py` | CRUD casos · contenedor líneas BCL | Biblioteca + editor |
| `biblioteca_maestro.py` | `aplicar_biblioteca_a_evento` | Reutilizar post Paso 0 (7.2) |
| `ui.py` → Nuevo Evento | Pasos 0–5 (Corazón 2) | **7.2** importación precios |
| `logic.py` | Eventos · `precio_lista` | API motor-precios |

**Proveedor default calzado:** `654` (BEIRA RIO).

---

## Tablas BD

| Tabla | Rol |
|-------|-----|
| `biblioteca_precio` | Contenedor biblioteca (proveedor) |
| `caso_precio_biblioteca` | Caso comercial maestro (estrategia) |
| `biblioteca_caso_linea` (BCL) | Líneas del caso — solo pilar `linea` |
| `precio_evento` | Listado (Corazón 2) |
| `precio_evento_caso` | Casos aplicados al evento |
| `precio_lista` | SKUs calculados L+R+material |

---

## APIs Report (biblioteca)

| Método | Ruta | Estado |
|--------|------|--------|
| GET | `/api/motor-precios/biblioteca` | ✅ |
| POST | `/api/motor-precios/biblioteca` | ✅ crear |
| GET/PATCH | `/api/motor-precios/biblioteca/[id]` | ✅ |
| POST | `/api/motor-precios/biblioteca/[id]/copiar-casos` | ✅ clon 7.1.1.1 |
| GET | `/api/motor-precios/eventos/[id]/preview-audit` | ✅ Preview 7.2 |
| POST | `/api/motor-precios/eventos/[id]/asignar-lineas-preview` | ✅ asignar línea→caso desde Preview |

---

## Ley matriz — solo pilar línea (2026-07-05)

Los **casos** de biblioteca y evento se indexan **únicamente** por `linea.codigo_proveedor` (BCL → `linea_id`). Referencia y material son dimensiones del SKU Excel (`precio_lista`), no de la matriz comercial.

- Doc operativo Preview: [CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md](./CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md)
- Ley: [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md) § Matriz línea

**Prohibido:** UI o matching de casos por `L·R` concatenado.

---

## Destino pendiente (motor)

| Fase | Tema | Estado |
|------|------|--------|
| Biblioteca CRUD | 7.1.1–2 | ✅ |
| Editor caso BCL completo | 7.1.1 | parcial |
| Aplicar biblioteca desde Report Paso 0 | puente 7.2 | 📋 |

---

## Archivos clave

| Repo | Archivo |
|------|---------|
| Report | `report/src/app/proceso-importacion/motor-precios/` |
| Report | `report/docs/MOTOR_PRECIOS_REPORT.md` |
| Streamlit | `modules/rimec_engine/biblioteca_ui.py` |
| Streamlit | `modules/rimec_engine/biblioteca_maestro.py` |
| Índice | [INDICE.md](./INDICE.md) |

---

## No confundir

- **7.1** = estrategia permanente (biblioteca)
- **7.2** = un listado concreto por Excel
- **Retail** = otro proceso — no mezclar

---

## Puente consumidor — Depósito Bazzar

La biblioteca **2.3.1.7.1** también alimenta (solo lectura) el panel depósito Report:

| Código | Uso | Doc |
|--------|-----|-----|
| **PUENTE-MP-DEP-001** | Tab **Filtros por índice** · filtra stock por líneas BCL | [PUENTE](../../3_arquitectura/3.3_integracion/PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md) · [CHUSAR depósito](../depositos/CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) |

Sin recalcular `precio_lista` · match `linea.codigo_proveedor` ↔ `deposito.linea_codigo_proveedor`.

---

**Shibboleth:** Andrés, el que viene.
