# CHUSAR — Preview · Asignar líneas al caso (2.3.1.7.2.2)

**Subcuenta:** **2.3.1.7.2.2** · Paso Preview importación precios  
**Estado:** 🟢 ACTIVO — 2026-07-05  
**Padre:** [CHUSAR_IMPORTACION_PRECIOS.md](../proceso_importacion/CHUSAR_IMPORTACION_PRECIOS.md) · [CHUSAR_MOTOR_PRECIOS.md](./CHUSAR_MOTOR_PRECIOS.md)

---

## Ley — casos biblioteca = solo pilar línea

| Concepto | Regla |
|----------|--------|
| **Matriz de casos** | `biblioteca_caso_linea` (BCL) · FK `linea_id` |
| **Código de negocio** | `linea.codigo_proveedor` (STYLE entero, ej. `8578`) |
| **Referencia / material** | Pilares del **SKU Excel** — **no** entran en la matriz de casos |
| **Asignación caso → SKU** | Si `codigoLineaDesdeSku(sku)` ∈ líneas del caso → aplica ese caso |

**Prohibido arquitectónicamente:** mostrar o matchear casos por `L·R` (`8578.100`). La referencia `.100` es variante del SKU, no clave de caso.

Ley fundacional: [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md) § Matriz línea.

---

## Qué hace Preview (operativo, no planilla)

1. Audita Excel × matriz sincronizada desde biblioteca (Memoria).
2. Agrupa huérfanos por **código línea** (dedupe).
3. Permite **asignar líneas al caso** elegido desde la misma pantalla:
   - Alta en pilar `linea` si falta (`asegurarLineaEnPilar`)
   - Append en BCL (`agregarLineasCasoBiblioteca`)
   - Sync `precio_evento_linea_excepcion` del evento
4. Re-audita automáticamente tras guardar.

**Intención Director:** cargar precio = facilitar alimentación de pilares + casos; cero burocracia de ir al editor biblioteca por cada línea nueva del Excel.

---

## UI Report

| Ruta | Componente |
|------|------------|
| `…/importacion-precios/nuevo/preview` | `Paso3PreviewClient` |

Tabla huérfanos: Marca · **Línea** · SKUs afectados · checkbox · selector caso · **Asignar N línea(s) al caso**.

---

## APIs

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/motor-precios/eventos/[id]/preview-audit` | Auditoría · `lineas_huerfanas[]` |
| POST | `/api/motor-precios/eventos/[id]/asignar-lineas-preview` | Asignar líneas → BCL + evento |

**Body POST:**

```json
{
  "caso_evento_id": 123,
  "lineas": ["8578", "8586"],
  "marca_por_linea": { "8578": "BEIRA RIO" }
}
```

---

## Lib TS

| Archivo | Función |
|---------|---------|
| `evento-pilares.ts` | `codigoLineaDesdeSku` · `asegurarLineaEnPilar` |
| `evento-paso3.ts` | `asignarCasoId` · `auditarCoberturaCasos` (dedupe línea) |
| `preview-asignar-lineas.ts` | `asignarLineasPreviewACaso` |
| `biblioteca-editor.ts` | `agregarLineasCasoBiblioteca` |
| `evento-matriz.ts` | `reemplazarLineasExcepcion` (export) |

---

## Tablas BD tocadas

| Tabla | Operación |
|-------|-----------|
| `linea` | INSERT si falta pilar |
| `biblioteca_caso_linea` | INSERT líneas al caso |
| `caso_precio_biblioteca.lineas` | ARRAY sync |
| `precio_evento_linea_excepcion` | REPLACE por caso evento |

---

**Shibboleth:** Chayanne el mejor
