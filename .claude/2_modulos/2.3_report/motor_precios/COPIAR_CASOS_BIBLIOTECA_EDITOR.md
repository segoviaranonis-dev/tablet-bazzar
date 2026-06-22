# Copiar casos entre bibliotecas (clon bib→bib) — 2.3.1.7.1.1.1

**Subcuenta:** **2.3.1.7.1.1.1** · **Padre:** [2.3.1.7.1.1 Editor biblioteca](./HISTORIAL_BIBLIOTECAS.md) · **Corazón 1**  
**CHUSAR:** [CHUSAR_COPIAR_BIBLIOTECA_EDITOR.md](./CHUSAR_COPIAR_BIBLIOTECA_EDITOR.md)  
**Report UI:** `/proceso-importacion/motor-precios/biblioteca/[id]`  
**Streamlit ref.:** `duplicar_biblioteca` · `guardar_estado_biblioteca` (`biblioteca_maestro.py`)  
**Actualizado:** 2026-06-19

> **Filosofía / fundamentos:** [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../../1_fundamentos/PIEDRA_CIMIENTO_COSTO_ARTICULO.md) · Corazón 1 en [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md).

---

## Qué resuelve

Permite **clonar** la matriz comercial (casos + líneas BCL) de una biblioteca **origen** hacia otra biblioteca **destino** del mismo proveedor, **sin vaciar** el origen.

**Casos de uso:**

| Escenario | Ejemplo |
|---------|---------|
| Biblioteca de prueba / mudanza | Llenar «prueba» (#6) desde canónica **1905** (#5) |
| Plantilla operativa | Duplicar matriz cerrada antes de editar variantes |
| Recuperación | Repoblar una biblioteca vacía desde otra intacta |

**No es lo mismo que** [2.3.1.7.2.1.1](../proceso_importacion/COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md) (bib → **evento** en Memoria / Corazón 2).

---

## Dos copias en el holding (distinción obligatoria)

| Código | Ámbito | Origen | Destino | Origen después |
|--------|--------|--------|---------|----------------|
| **2.3.1.7.1.1.1** | Corazón 1 · maestro | `biblioteca_precio` A | `biblioteca_precio` B | **Intacto** (clon) |
| **2.3.1.7.2.1.1** | Corazón 2 · listado | `biblioteca_precio` | `precio_evento` | Biblioteca intacta |

---

## Flujo operativo Report

```
Histórico bibliotecas (2.3.1.7.1.1)
    → Abrir biblioteca destino (ej. #6 prueba)
        → Panel «Copiar casos de biblioteca anterior» (2.3.1.7.1.1.1)
            → GET /api/motor-precios/biblioteca?proveedor_id=654
            → Elegir origen (default: canónica 1905)
            → POST /api/motor-precios/biblioteca/[dest]/copiar-casos
                { origen_biblioteca_id, reemplazar? }
            → copiarCasosDesdeBiblioteca (modo clonar)
        → Casos visibles en destino; origen sin cambios
```

**Reglas UI:**

- Destino **vacía** → copia directa.
- Destino **con casos** → pide confirmación `reemplazar: true` (vacía destino y clona de nuevo).
- Selector origen: solo bibliotecas con `casos_count > 0`.

---

## Mapeo tablas BD

### Lectura (origen)

| Tabla | Rol |
|-------|-----|
| `biblioteca_precio` | Validar origen/destino · mismo `proveedor_id` |
| `caso_precio_biblioteca` | Parámetros comerciales por caso |
| `biblioteca_caso_linea` | Alcance por `linea_id` (exclusividad por biblioteca) |
| `linea` | Resolución `codigo_proveedor` → FK (fallback si BCL vacío) |

### Escritura (destino — clon)

| Paso | Tabla | Acción |
|------|-------|--------|
| 1 | `caso_precio_biblioteca` | **INSERT** fila nueva por caso (`biblioteca_id` = destino) |
| 2 | `biblioteca_caso_linea` | **INSERT** filas BCL apuntando a nuevos `caso_biblioteca_id` |
| — | Origen | **Sin UPDATE** en casos ni BCL del origen |

### Constraints relevantes

| Constraint | Efecto |
|------------|--------|
| `caso_precio_biblioteca_biblioteca_nombre_uq` **(MIG-118)** | Mismo `nombre_caso` permitido en bibliotecas distintas |
| `biblioteca_caso_linea_bib_linea_uq` | Una `linea_id` solo en un caso **por biblioteca** |
| `biblioteca_precio_proveedor_nombre_uq` | Nombre de biblioteca único por proveedor |

**Migración:** `control_central/migrations/118_caso_precio_biblioteca_unique_por_biblioteca.sql`  
**Script aplicación Report:** `report/scripts/run_migration_118.mjs`

---

## Implementación Report

| Pieza | Ruta |
|-------|------|
| Lógica clon | `report/src/lib/motor-precios/biblioteca-editor.ts` → `copiarCasosDesdeBiblioteca` |
| Reparación BCL huérfana al cargar | `repararBclDesincronizado` en `loadBibliotecaEditor` |
| API | `POST …/api/motor-precios/biblioteca/[id]/copiar-casos` |
| UI panel | `CopiarCasosDesdeBibliotecaEditor.tsx` |
| Editor padre | `BibliotecaEditorClient.tsx` |

**Paridad Python (upsert caso):** `biblioteca_maestro.py` → `_upsert_caso_biblioteca_en_conn` alineado a MIG-118 (`ON CONFLICT (biblioteca_id, nombre_caso)`).

---

## Respuesta API (éxito)

```json
{
  "ok": true,
  "n_casos": 5,
  "n_lineas": 1581,
  "modo": "clonar",
  "origen_biblioteca_id": 5,
  "dest_biblioteca_id": 6,
  "biblioteca": { … editor destino … }
}
```

---

## Errores frecuentes

| Síntoma | Causa | Acción |
|---------|-------|--------|
| Origen vacío tras copiar (pre-118) | Traslado con UNIQUE global | Aplicar MIG-118 + clonar de nuevo |
| `duplicate key … bib_linea_uq` | BCL huérfana desincronizada | Recargar editor (reparación automática) |
| Destino con casos sin confirmar | Falta `reemplazar: true` | Confirmar reemplazo en UI |
| Falta migración 118 | INSERT falla ON CONFLICT | Ejecutar `run_migration_118.mjs` |

---

## Estado

| Ítem | Estado |
|------|--------|
| MIG-118 BD | ✅ Aplicada |
| API + UI clon | ✅ |
| Documentación Moria | ✅ este archivo |
| Filosofía / políticas holding | 📋 Pendiente Director |

---

**Shibboleth:** Chayanne el mejor
