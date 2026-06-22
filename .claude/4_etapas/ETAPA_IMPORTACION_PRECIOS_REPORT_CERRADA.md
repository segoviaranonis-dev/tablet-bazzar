# ETAPA CERRADA — Importación de precios · Corazón 2 (Report) · 2.3.1.7.2

**ID:** `ETAPA-IMPORT-PRECIO-REPORT-20260622`  
**Código plan:** **2.3.1.7.2** *(hijo 2.3.1.7.1 Motor de precios)*  
**Maratón:** [ETAPA_MUDANZA_REPORT.md](./ETAPA_MUDANZA_REPORT.md) · [ACTUAL.md](./ACTUAL.md)  
**Apertura Paso 0:** 2026-06-18 · **Cierre integral:** 2026-06-22  
**Director:** Chusar · «documenta a profundidad · cierra la etapa»  
**Estado:** ✅ **CERRADA** (dev local verificado · commit/deploy pendiente protocolo Git)  
**Ejecutor:** Cursor (Auto)  
**Shibboleth:** Chayanne el mejor

---

## Entregable operativo (piso)

Flujo **Streamlit Nuevo Evento → Report** completo en **5 pasos (0–4)**, sin paso Casos manual: biblioteca + casos se sincronizan en Memoria. **Historial** solo listados `estado = 'cerrado'`. Candado **PP** bloquea eliminar; **IC** informativo.

| Código | Pantalla | Ruta Report | Estado cierre |
|--------|----------|-------------|---------------|
| 2.3.1.7.2 | Hub importación | `/proceso-importacion/motor-precios/importacion-precios` | ✅ |
| 2.3.1.7.2.0 | Paso 0 · Carga | `…/importacion-precios/nuevo` | ✅ |
| 2.3.1.7.2.1 | Paso 1 · Memoria | `…/nuevo/memoria?evento_id=` | ✅ |
| 2.3.1.7.2.1.1 | Copiar casos bib→evento | Memoria · panel + API | ✅ |
| 2.3.1.7.2.2 | Paso 2 · Preview | `…/nuevo/preview` | ✅ |
| 2.3.1.7.2.3 | Paso 3 · Conversión | `…/nuevo/validacion` | ✅ |
| 2.3.1.7.2.4 | Paso 4 · Cierre | `…/nuevo/cierre` | ✅ |
| — | Historial listas | `…/importacion-precios/historial` | ✅ |

**Dev local:** http://localhost:3001 *(Tablet Bazzar ocupa :3000)*  
**Scripts:** `npm run dev:clean:3001` · `report/REINICIAR_DEV.bat`

---

## Política vs Streamlit (decisiones de cierre)

| Tema | Report | Streamlit legacy |
|------|--------|------------------|
| Pasos UI | 0–4 (sin Casos manual) | 0–5 + bib_select |
| Casos al evento | Auto al vincular biblioteca (Memoria) | Paso Casos separado |
| Historial | Solo `cerrado` · no borradores basura | Mezcla intentos |
| Estado post-conversión | `validado` (CHECK BD) | — |
| Auditoría cierre | `precio_auditoria` esquema canónico (tabla/campo/valores) | `logic.registrar_auditoria` |
| UX espera | `ProcesoImportacionWaitOverlay` pasos 0–4 | toast Streamlit |

---

## Backend Report (`report/src/lib/motor-precios/`)

| Módulo | Rol |
|--------|-----|
| `importacion-pasos.ts` | Barra 0–4 · paths con `evento_id` |
| `evento-carga.ts` | Paso 0 · INSERT `precio_evento` · ley género |
| `evento-sku-staging.ts` | Staging Excel · MIG-120 `precio_evento_sku_excel` |
| `evento-biblioteca.ts` | Vincular + aplicar casos (Memoria) |
| `evento-preview-audit.ts` | Preview Excel × casos |
| `evento-paso3.ts` | Conversión · `calcular_precio_lista_evento_sql` |
| `evento-validacion.ts` | Resumen pre-cierre |
| `evento-cierre.ts` | Cierre · vigencia `precio_lista` · auditoría |
| `evento-historial.ts` | Listado cerrados · uso PP/IC · eliminar |
| `evento-queries.ts` | Detalle evento · matriz |
| `fetch-json.ts` | Cliente API · detecta HTML dev corrupto |
| `ley-genero.ts` | Paridad `ley_genero.py` |
| `auth-api.ts` | Gate motor precios admin |

---

## APIs (`/api/motor-precios/`)

| Método | Ruta | Paso |
|--------|------|------|
| GET | `/proveedores` | 0 |
| POST | `/eventos/carga` | 0 |
| GET | `/eventos/[id]` | todos |
| POST | `/eventos/[id]/vincular-biblioteca` | 1 |
| POST | `/eventos/[id]/aplicar-biblioteca` | 1 · 2.3.1.7.2.1.1 |
| GET | `/eventos/[id]/preview-audit` | 2 |
| GET/POST | `/eventos/[id]/validacion` | 3 |
| POST | `/eventos/[id]/calcular` | 3 |
| POST | `/eventos/[id]/cerrar` | 4 |
| GET | `/eventos/historial` | historial |
| POST | `/eventos/[id]/eliminar` | historial 🗑️ |

---

## UI clientes

| Componente | Paso |
|------------|------|
| `Paso0CargaClient` | 0 |
| `Paso1MemoriaClient` · `AsignarBibliotecaPanel` | 1 |
| `Paso3PreviewClient` | 2 |
| `Paso4ValidacionClient` | 3 |
| `Paso5CierreClient` | 4 |
| `ListadoPreciosHistorialClient` | historial |
| `ImportacionPreciosStepNav` · `ImportacionPreciosProgressBar` | nav |
| `ProcesoImportacionWaitOverlay` | UX global |

Redirect: `nuevo/casos` → Preview (paso Casos obsoleto).

---

## BD · migraciones · hotfixes sesión

| Pieza | Detalle |
|-------|---------|
| MIG-120 | `precio_evento_sku_excel` · script `report/scripts/run_migration_120.mjs` |
| Estados `precio_evento` | `borrador` → `validado` → `cerrado` |
| Cierre | Sin columna `updated_at` en `precio_evento` |
| Auditoría | INSERT con `tabla_afectada`, `campo_modificado`, `valor_anterior`, `valor_nuevo`, `justificacion` |
| Purga basura | `report/scripts/purge_basura_precio_evento.mjs` (borradores 0 SKU) |

---

## Operación dev (obligatorio)

1. **No** correr `npm run build` con dev abierto (corrompe `.next` → overlay `[object Event]`).
2. Si falla API con HTML: `npm run dev:clean:3001` + **Ctrl+Shift+R**.
3. Puerto canónico Report en PC Director: **3001** si Tablet usa 3000.

---

## Documentación Moria (índice etapa)

| Doc | Rol |
|-----|-----|
| [IMPORTACION_PRECIOS.md](../2_modulos/2.3_report/proceso_importacion/IMPORTACION_PRECIOS.md) | Inventario profundo |
| [CHUSAR_IMPORTACION_PRECIOS.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_IMPORTACION_PRECIOS.md) | CHUSAR agente |
| [CHUSAR_UX_ESPERA…](../2_modulos/2.3_report/proceso_importacion/CHUSAR_UX_ESPERA_PROCESO_IMPORTACION_REPORT.md) | Overlay aguarde |
| [proceso_importacion/INDICE.md](../2_modulos/2.3_report/proceso_importacion/INDICE.md) | Plan 7.1–7.5 |
| [2.3_report/INDICE.md](../2_modulos/2.3_report/INDICE.md) | Índice módulo Report |
| [report/docs/IMPORTACION_PRECIOS_REPORT.md](../../report/docs/IMPORTACION_PRECIOS_REPORT.md) | Doc app repo |

**Etapa Paso 0 superseded:** [ETAPA_IMPORTACION_PRECIOS_PASO0_REPORT.md](./ETAPA_IMPORTACION_PRECIOS_PASO0_REPORT.md) → absorbida en este cierre.

---

## Criterios de aceptación (checklist cierre)

- [x] Pasos 0–4 navegables con `evento_id`
- [x] Carga Excel + ley género + staging MIG-120
- [x] Memoria: biblioteca + auto-casos
- [x] Preview audit SKUs sin caso
- [x] Conversión SQL → `precio_lista` · estado `validado`
- [x] Cierre → `cerrado` · historial · vigencia opcional
- [x] Historial UI paridad (stats · PP/IC · eliminar)
- [x] Overlay UX pasos largos
- [x] CHUSAR + índices Moria actualizados
- [ ] Git commit + push *(protocolo Director)*
- [ ] Vercel prod smoke *(post-push main)*

---

## Próxima etapa sugerida

**2.3.1.7.3** Intención de compra · o continuar **2.3.1.8–10** Abastecimiento según [ACTUAL.md](./ACTUAL.md).

---

**Shibboleth:** Chayanne el mejor
