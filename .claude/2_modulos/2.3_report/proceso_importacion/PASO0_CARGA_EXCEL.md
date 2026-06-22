# Paso 0 — Carga Excel · especificación técnica

**Código:** 2.3.1.7.2.0 · **CHUSAR:** [CHUSAR_IMPORTACION_PRECIOS_PASO0.md](./CHUSAR_IMPORTACION_PRECIOS_PASO0.md)  
**Referencia Streamlit:** `control_central/modules/rimec_engine/ui.py` → `_paso_0_carga()`  
**Actualizado:** 2026-06-18

---

## 1. Pantalla (wireframe lógico)

```
┌─────────────────────────────────────────────────────────────┐
│ Report · Proceso importación · Importación precios · Paso 0 │
├─────────────────────────────────────────────────────────────┤
│ [0.Carga] [1.Memoria] [2.Casos] [3.Preview] [4.Val] [5.Cierre] │
├─────────────────────────────────────────────────────────────┤
│ ▶ Ley de género (obligatoria en cada importación)           │
├─────────────────────────────────────────────────────────────┤
│ Proveedor *        [ BEIRA RIO CALZADOS (FAB-BRA-001)  ▼ ]  │
│ Archivo proveedor* [ Drag & drop · XLS/XLSX · max 200MB ]   │
│ Nombre evento *    [ TEMPORADA_INVIERNO_2026            ]   │
│ Precios vigentes * [ 2026-06-18                         ]   │
│ [ Banner Hiedra si aplica ]                                 │
│                                    [ Iniciar carga → ]      │
└─────────────────────────────────────────────────────────────┘
```

Estilo: NIIF Report · header `NexusGlobalHeader active="proceso-importacion"` · footer RIMEC.

---

## 2. Campos del formulario

### 2.1 Proveedor

| Propiedad | Valor |
|-----------|-------|
| Fuente datos | `SELECT id, nombre, codigo FROM proveedor ORDER BY nombre` |
| UI | `<select>` con label `{nombre} ({codigo})` |
| Valor enviado | `proveedor_id: number` |
| Default sugerido | `654` si existe (paridad `MOTOR_PROVEEDOR_DEFAULT`) |
| Vacío | Error «No hay proveedores registrados» — bloquear formulario |

### 2.2 Archivo Excel

| Propiedad | Valor |
|-----------|-------|
| Accept | `.xls`, `.xlsx` |
| Tamaño máx | 200 MB (paridad Streamlit) |
| Storage temporal | memoria servidor / `/tmp` — no persistir archivo en disco prod salvo auditoría |
| On change | Pre-llenar nombre evento = basename sin extensión |
| Validación MIME | Rechazar si no es Excel |

### 2.3 Nombre del evento

| Propiedad | Valor |
|-----------|-------|
| Required | sí |
| Placeholder | `Ej: TEMPORADA_INVIERNO_2026` |
| Default | nombre archivo sin `.xls`/`.xlsx` |
| Reglas | trim · no vacío · max 120 chars (validar contra columna BD) |

### 2.4 Precios vigentes desde

| Propiedad | Valor |
|-----------|-------|
| Tipo | `date` |
| Default | hoy (timezone America/Asuncion) |
| Persistencia | `vigente_desde` DATE en `precio_evento` |

---

## 3. Ley de género (bloqueante)

**Módulo origen:** `modules/rimec_engine/ley_genero.py`

### 3.1 Reglas marca → género

| Patrón en marca/hoja | Género |
|----------------------|--------|
| MOLEKINHA | NIÑAS |
| MOLEKINHO | NIÑOS |
| ACTVITTA, VIZZANO, BEIRA RIO, MODARE, MOLECA | DAMAS |
| BR SPORT | CABALLEROS |

Orden: patrones largos antes (MOLEKINHA antes de MOLECA).

### 3.2 Algoritmo validación

```
INPUT: marcas[] extraídas del Excel (nombres de hoja)
FOR cada marca única:
  genero = genero_codigo_por_marca(marca)
  IF genero IS NULL → marcas_rechazadas[]
VERIFICAR códigos genero existen en public.genero
IF marcas_rechazadas OR generos_faltantes_bd → ABORT (no crear evento)
ELSE → asignaciones {marca: genero} para celebrate / log
```

### 3.3 UI errores

- Lista marcas rechazadas en rojo NIIF
- Si faltan filas en maestro `genero` → listar códigos faltantes
- Expander con `texto_ley_genero_resumen()` — mismo texto Streamlit

---

## 4. Hiedra (nombre archivo)

**Módulo:** `modules/rimec_engine/hiedra.py`

| Condición | Parser Excel |
|-----------|--------------|
| `parsear_nombre_hiedra(name).reconocido` | `leer_excel_hiedra(archivo, name)` |
| else | `leer_excel_proveedor(archivo, name)` |

Banner éxito (verde):

> Hiedra detectó — Categoría: COMPRA PREVIA | PROGRAMADO · Proforma fábrica: … · PP externo: …

Persistir meta Hiedra en session/API response para pasos downstream (no en Paso 0 BD salvo columnas evento existentes).

---

## 5. Lectura Excel (salida esperada)

Estructura retorno `leer_excel_proveedor` / `leer_excel_hiedra`:

```typescript
type ResultadoLecturaExcel = {
  error: string | null;
  skus: SkuStagingRow[];      // filas parseadas STYLE
  marcas: string[];           // hojas / marcas detectadas
};
```

**Errores comunes a surfacear:**

- Hoja vacía · columna STYLE ausente
- Filas sin parsear línea.referencia
- Archivo corrupto / password

No crear evento si `error` presente.

---

## 6. Persistencia — `crear_evento`

Equivalente Streamlit `crear_evento(nombre_evento, archivo.name, str(fecha_desde), proveedor_id)`.

| Campo BD | Origen |
|----------|--------|
| `nombre` | nombre evento UI |
| `archivo_origen` | nombre archivo original |
| `vigente_desde` | fecha UI |
| `proveedor_id` | selector |
| `estado` | borrador (legacy string exacto — leer de BD existente) |

**Retorno API:** `{ ok: true, evento_id: number, skus_count, marcas_count, asignaciones_genero }`

**Session / siguiente paso:**

- Guardar `evento_id`, `proveedor_id`, SKUs en memoria servidor (Redis/session) o re-hidratar desde staging table — **decisión implementación mañana**
- Redirect UI → `/proceso-importacion/importacion-precios/eventos/[id]/biblioteca` (ruta planificada)

Paridad Streamlit session keys post Paso 0:

```
re_evento_id, re_proveedor_id, re_skus, re_marcas,
re_archivo_nombre, re_nombre_evento, re_paso = "bib_select"
```

---

## 7. API propuesta

### `POST /api/motor-precios/eventos/carga`

**Auth:** `requireMotorPreciosAdmin()` (mismo patrón biblioteca)

**Content-Type:** `multipart/form-data`

| Part | Tipo | Requerido |
|------|------|-----------|
| `proveedor_id` | number | sí |
| `nombre_evento` | string | sí |
| `vigente_desde` | ISO date | sí |
| `archivo` | File | sí |

**Response 200:**

```json
{
  "ok": true,
  "evento_id": 123,
  "skus_count": 4521,
  "marcas_count": 8,
  "asignaciones_genero": { "BEIRA RIO": "DAMAS" },
  "hiedra": { "reconocido": false }
}
```

**Response 422 (ley género):**

```json
{
  "ok": false,
  "code": "LEY_GENERO",
  "marcas_rechazadas": ["MARCA_X"],
  "generos_faltantes_bd": []
}
```

---

## 8. Estrategia de port (Streamlit → Report)

| Opción | Pros | Contras | Recomendación |
|--------|------|---------|---------------|
| **A. Python microservice** | 100% paridad parsers | otro proceso | Solo si TS port falla |
| **B. Port TS + xlsx library** | nativo Next | riesgo drift parser | Fase 2 con tests golden |
| **C. SQL + staging table** | indexado | requiere INSERT staging | Post-parse inmediato |

**Orden mañana:**

1. Golden test: mismo Excel → mismos `skus.length` y `marcas` que Streamlit
2. Implementar ley género TS (reglas copiadas literal)
3. `crear_evento` SQL parametrizado
4. Wire form → API

---

## 9. Archivos Streamlit a portar (inventario)

| Archivo | Funciones clave |
|---------|-----------------|
| `ui.py` | `_paso_0_carga`, barra progreso |
| `logic.py` | `get_proveedores`, `leer_excel_proveedor`, `crear_evento` |
| `ley_genero.py` | `validar_ley_genero_importacion`, reglas |
| `hiedra.py` | `parsear_nombre_hiedra`, `leer_excel_hiedra` |
| `ui_proceso.py` | `proceso_largo` → equivalente loading NIIF |

---

## 10. Pruebas de aceptación (smoke)

| # | Caso | Resultado esperado |
|---|------|-------------------|
| T1 | Excel BEIRA RIO válido | evento_id + redirect biblioteca |
| T2 | Marca desconocida en hoja | 422 LEY_GENERO |
| T3 | Archivo .pdf | 400 tipo inválido |
| T4 | Sin proveedor en BD | 503 configuración |
| T5 | Nombre archivo Hiedra CP | banner + parser hiedra |

---

## 11. Bitácora implementación

| Fecha | Estado | Nota |
|-------|--------|------|
| 2026-06-18 | Spec + shell UI | Barra progreso · form placeholder |
| — | API | pendiente |
| — | Paridad Streamlit | pendiente |

---

**Shibboleth:** Chayanne el mejor
