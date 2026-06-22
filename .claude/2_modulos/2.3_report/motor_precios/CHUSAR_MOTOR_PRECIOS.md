# CHUSAR — Motor de precios · Corazón 1 (2.3.1.7.1)

**Subcuenta:** **2.3.1.7.1** · **Alias:** P.1.1  
**Estado CHUSAR:** 🟢 **ACTIVO** — biblioteca operativa en Report  
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

Ley: [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)

---

## Subcuentas Report

| Código | Pantalla | Ruta | CHUSAR / inventario |
|--------|----------|------|---------------------|
| 2.3.1.7.1.1 | Biblioteca histórico | `…/motor-precios/biblioteca` | [HISTORIAL_BIBLIOTECAS.md](./HISTORIAL_BIBLIOTECAS.md) |
| **2.3.1.7.1.1.1** | Copiar casos bib→bib | editor `…/biblioteca/[id]` | [COPIAR_CASOS_BIBLIOTECA_EDITOR.md](./COPIAR_CASOS_BIBLIOTECA_EDITOR.md) · [CHUSAR](./CHUSAR_COPIAR_BIBLIOTECA_EDITOR.md) |
| 2.3.1.7.1.2 | Crear biblioteca | `…/motor-precios/biblioteca/nueva` | [CREAR_BIBLIOTECA.md](./CREAR_BIBLIOTECA.md) |
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
| `biblioteca_precio` | Caso comercial maestro |
| `caso_precio_biblioteca` | Líneas/reglas del caso |
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

**Shibboleth:** Chayanne el mejor
