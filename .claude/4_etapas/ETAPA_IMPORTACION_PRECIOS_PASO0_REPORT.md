# ETAPA ABIERTA — Importación de precios · Paso 0 (Report)

**ID:** `ETAPA-IMPORT-PRECIO-P0-20260618`  
**Código plan:** **2.3.1.7.2** *(hijo 2.3.1.7.1)* · **Subfase:** Paso 0 — Carga Excel  
**Maratón:** ver [ACTUAL.md](./ACTUAL.md)  
**Fecha apertura:** 2026-06-18  
**Director:** Portar «Nuevo Evento → Paso 0» Streamlit → Report  
**Estado:** ✅ **SUPERSEDED** — absorbida en [ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md](./ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md) (cierre integral 2.3.1.7.2 · 2026-06-22)  
**Ejecutor principal:** Cursor (Auto) · apoyo backend: Claude Code  
**Shibboleth:** Chayanne el mejor

---

## Objetivo

Reproducir en Report la pantalla marcada en Streamlit (**Motor de Precios → Nuevo Evento → Paso 0 — Carga del archivo**):

- Selector **proveedor**
- Upload **Excel** `.xls` / `.xlsx` (200 MB)
- **Nombre del evento**
- **Precios vigentes desde** (fecha)
- Validación **ley de género** antes de persistir
- Detección **Hiedra** (nombre archivo CP/PP) cuando aplique
- Crear fila **`precio_evento`** y pasar a selección de biblioteca

Paridad funcional con `control_central/modules/rimec_engine/ui.py` → `_paso_0_carga()`.

---

## Alcance de esta etapa (fase 1)

| Incluye | Excluye (fases siguientes) |
|---------|----------------------------|
| UI NIIF Paso 0 + barra progreso 0–5 | Pasos 1–5 (memoria, casos, preview, cierre) |
| API upload + parse Excel server-side | Cálculo masivo `precio_lista` (OT SQL) |
| `crear_evento` equivalente en TS/SQL | Vincular listado a PP |
| Ley de género (bloqueo si falla) | Reescribir biblioteca (ya en 2.3.1.7.1) |
| Redirect post-éxito → biblioteca evento | Historial eventos completo |

---

## Documentación de arranque (leer en orden)

| # | Documento |
|---|-----------|
| 1 | [CHUSAR_IMPORTACION_PRECIOS_PASO0.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_IMPORTACION_PRECIOS_PASO0.md) |
| 2 | [PASO0_CARGA_EXCEL.md](../2_modulos/2.3_report/proceso_importacion/PASO0_CARGA_EXCEL.md) |
| 3 | [IMPORTACION_PRECIOS.md](../2_modulos/2.3_report/proceso_importacion/IMPORTACION_PRECIOS.md) |
| 4 | [report/docs/IMPORTACION_PRECIOS_REPORT.md](../../report/docs/IMPORTACION_PRECIOS_REPORT.md) |
| 5 | Streamlit ref: `modules/rimec_engine/ui.py` · `ley_genero.py` · `logic.py` |

---

## Rutas Report (plan)

| Código | Ruta | Estado |
|--------|------|--------|
| 2.3.1.7.2 | `/proceso-importacion/motor-precios/importacion-precios` | Hub shell ✅ |
| 2.3.1.7.2.0 | `…/motor-precios/importacion-precios/nuevo` | Paso 0 UI 🟡 tránsito |
| — | `POST /api/motor-precios/eventos/carga` | 📋 pendiente |
| — | `…/importacion-precios/eventos/[id]` | 📋 post Paso 0 |

Constantes: `report/src/lib/report/routes.ts`

---

## Criterios de aceptación (cierre etapa Paso 0)

- [ ] Formulario NIIF: proveedor · Excel · nombre · fecha vigencia
- [ ] Expander ley de género (texto canónico)
- [ ] Upload valida extensión y tamaño; errores legibles
- [ ] Ley de género rechaza marcas no mapeadas (mismo resultado que Streamlit)
- [ ] Hiedra: banner informativo si nombre archivo reconocido
- [ ] `precio_evento` creado con `proveedor_id`, `nombre`, `archivo_origen`, `vigente_desde`
- [ ] Sesión/flujo redirige a paso biblioteca (2.3.1.7.1 aplicada al evento)
- [ ] CHUSAR actualizado · evidencia smoke local · `npm run build` OK
- [ ] No bucle Python por SKU en servidor Report (parse en lote / SQL)

---

## Bitácora

| Fecha | Autor | Nota |
|-------|-------|------|
| 2026-06-18 | Cursor | Apertura etapa · CHUSAR tránsito · spec Paso 0 · shell `/nuevo` |
| 2026-06-18 | Cursor | CHUSAR sesión · ACTUAL restaurado · maratón 5/5 confirmado |
| — | — | *En curso: API carga + port `leer_excel_proveedor`* |

---

## Orden agente (sesión)

> **Etapa 4 de Report** · **2.3.1.7.2 Paso 0** — implementar API + formulario funcional  
> Panel: http://localhost:3004/etapas/t/2.3.1.7.2

---

**Shibboleth:** Chayanne el mejor
