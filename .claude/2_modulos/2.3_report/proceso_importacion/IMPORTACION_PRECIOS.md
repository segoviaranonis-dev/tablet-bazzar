# 2.3.1.7.2 Importación de precios — inventario profundo (Report)

**Subproceso:** Corazón 2 · **Padre:** [2.3.1.7.1 Motor](../motor_precios/INDICE.md)  
**App:** `report/` · **Hub:** `/proceso-importacion/motor-precios/importacion-precios`  
**Estado:** ✅ **CERRADA** 2026-06-22 · [ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md](../../4_etapas/ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md)  
**CHUSAR:** [CHUSAR_IMPORTACION_PRECIOS.md](./CHUSAR_IMPORTACION_PRECIOS.md)  
**Doc app:** [report/docs/IMPORTACION_PRECIOS_REPORT.md](../../../report/docs/IMPORTACION_PRECIOS_REPORT.md)  
**Origen Streamlit:** `control_central/modules/rimec_engine/ui.py` → `_render_flujo()`

---

## Fórmula · dos corazones

```
Biblioteca (Corazón 1) + Excel proveedor = precio_evento + precio_lista (Corazón 2)
```

Ley: [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)

---

## Plan de cuentas UI (Report)

| Código | Paso | Slug ruta | Función |
|--------|------|-----------|---------|
| **2.3.1.7.2** | Hub | `importacion-precios` | Entrada · link historial |
| **2.3.1.7.2.0** | 0 Carga | `nuevo` | Upload Excel · ley género · `precio_evento` |
| **2.3.1.7.2.1** | 1 Memoria | `nuevo/memoria` | Biblioteca + auto-sincronizar casos |
| **2.3.1.7.2.1.1** | — | Memoria panel | Copiar casos bib→evento (opcional) |
| **2.3.1.7.2.2** | 2 Preview | `nuevo/preview` | Audit Excel × casos · SKUs huérfanos |
| **2.3.1.7.2.3** | 3 Conversión | `nuevo/validacion` | SQL `precio_lista` · estado `validado` |
| **2.3.1.7.2.4** | 4 Cierre | `nuevo/cierre` | `cerrado` · historial · vigencia |
| — | Historial | `historial` | Solo cerrados · 🔒 PP · 🗑️ eliminar |

Query param canónico: `?evento_id={id}` en todos los pasos >0.

Config pasos: `report/src/lib/motor-precios/importacion-pasos.ts`

---

## Flujo de estados (`precio_evento`)

```
borrador  ──(Paso 0 carga)──►  borrador + SKUs staging
         ──(Memoria bib)──►     borrador + casos evento
         ──(Conversión)──►      validado + precio_lista
         ──(Cierre)──────►      cerrado  → visible en historial
```

**CHECK BD:** solo `borrador | validado | cerrado`. No usar `calculado`.

---

## Paridad Streamlit vs Report

| Streamlit | Report | Notas |
|-----------|--------|-------|
| `_paso_0_carga` | Paso0CargaClient | Proveedor default **654** |
| `bib_select` + `_paso_1_memoria` | Paso1MemoriaClient | Auto-aplica casos al vincular |
| `_paso_2_casos` | *(omitido)* | Redirect `casos` → preview |
| `_paso_3_preview` | Paso3PreviewClient | API `preview-audit` |
| `_paso_4_validacion` | Paso4ValidacionClient | POST `calcular` |
| `_paso_5_cierre` | Paso5CierreClient | POST `cerrar` |
| Historial intentos | Historial solo `cerrado` | Política Report |

---

## Tablas BD (ámbito Corazón 2)

| Tabla | Rol |
|-------|-----|
| `precio_evento` | Cabecera listado · `estado` · `biblioteca_precio_id` |
| `precio_evento_sku_excel` | Staging filas Excel (MIG-120) |
| `precio_evento_caso` | Casos aplicados al evento |
| `precio_evento_linea_excepcion` | Líneas BCL por caso evento |
| `precio_lista` | SKUs calculados L+R+material |
| `precio_auditoria` | Trazas cierre (esquema Streamlit) |
| `intencion_compra` / `intencion_compra_pedido` | Uso PP/IC en historial |

**Blindado:** `registro_ventas_general_v2` (Sales Report) — sin JOIN.

---

## Backend (`report/src/lib/motor-precios/`)

| Archivo | Responsabilidad |
|---------|-----------------|
| `evento-carga.ts` | `crear_evento` · parse Excel · ley género |
| `evento-sku-staging.ts` | Persist staging MIG-120 |
| `evento-biblioteca.ts` | `vincular_biblioteca` · `aplicar_biblioteca_a_evento` |
| `evento-preview-audit.ts` | Matriz SKUs con/sin caso |
| `evento-paso3.ts` | Conversión · función SQL indexada |
| `evento-validacion.ts` | Resumen conversión |
| `evento-cierre.ts` | Transacción cierre + vigencia + auditoría |
| `evento-historial.ts` | Listado · uso PP/IC · eliminar seguro |
| `evento-queries.ts` | Detalle + contadores matriz |
| `evento-pilares.ts` | Enriquecimiento FK pilares en import |
| `ley-genero.ts` | Validación marcas hoja Excel |
| `fetch-json.ts` | Cliente fetch robusto (dev `.next` corrupto) |
| `auth-api.ts` | `requireMotorPreciosAdmin()` |

---

## APIs REST

Base: `/api/motor-precios/` · Auth: sesión Report admin motor.

| Método | Ruta | Body / query |
|--------|------|--------------|
| GET | `proveedores` | — |
| POST | `eventos/carga` | multipart Excel |
| GET | `eventos/[id]` | — |
| POST | `eventos/[id]/vincular-biblioteca` | `{ biblioteca_id }` |
| POST | `eventos/[id]/aplicar-biblioteca` | `{ biblioteca_id? }` |
| GET | `eventos/[id]/preview-audit` | — |
| GET/POST | `eventos/[id]/validacion` | — |
| POST | `eventos/[id]/calcular` | — |
| POST | `eventos/[id]/cerrar` | — |
| GET | `eventos/historial` | `?q=` búsqueda |
| POST | `eventos/[id]/eliminar` | `{ confirmacion: "ELIMINAR" }` |

---

## UI Report (`src/app/proceso-importacion/motor-precios/importacion-precios/`)

```
importacion-precios/
├── page.tsx                          Hub
├── historial/
│   └── ListadoPreciosHistorialClient.tsx
├── components/
│   ├── ImportacionPreciosStepNav.tsx
│   └── ImportacionPreciosProgressBar.tsx
└── nuevo/
    ├── page.tsx                      Paso 0
    ├── memoria/ · preview/ · validacion/ · cierre/
    └── components/                   Paso*Client · panels
```

**UX:** [CHUSAR_UX_ESPERA_PROCESO_IMPORTACION_REPORT.md](./CHUSAR_UX_ESPERA_PROCESO_IMPORTACION_REPORT.md)  
Componente: `report/src/components/report/ProcesoImportacionWaitOverlay.tsx`

---

## Historial listas (política integridad)

- **Fuente SQL:** `WHERE pe.estado = 'cerrado'` — borradores nunca en historial.
- **Stats:** Total · En uso · Cerrados · Borradores · Basura (0 SKU).
- **Columna PP / IC:** candado 🔒 solo bloquea eliminar si hay **PP** vinculado; IC desvincula al eliminar.
- **Eliminar:** confirmación texto `ELIMINAR` · borra `precio_lista` + casos · no toca pilares.

Lib: `evento-historial.ts` · UI: `ListadoPreciosHistorialClient.tsx`

---

## Dev · operación local

| Comando | Uso |
|---------|-----|
| `npm run dev:3001` | Dev Report (Tablet en 3000) |
| `npm run dev:clean:3001` | Borra `.next` + dev *(post error chunk)* |
| `report/REINICIAR_DEV.bat` | Kill puertos · clean · dev:3001 |

**Síntoma:** `Unexpected token '<'` o `[object Event]` → caché `.next` corrupta. **No** es bug de negocio.

---

## Migraciones · scripts

| Script | Rol |
|--------|-----|
| `report/scripts/run_migration_120.mjs` | Tabla `precio_evento_sku_excel` |
| `report/scripts/purge_basura_precio_evento.mjs` | Limpia borradores vacíos |

---

## Archivos Streamlit referencia

| Archivo | Rol |
|---------|-----|
| `modules/rimec_engine/ui.py` | Flujo Pasos 0–5 |
| `modules/rimec_engine/logic.py` | CRUD · auditoría |
| `modules/rimec_engine/biblioteca_maestro.py` | Aplicar biblioteca |
| `modules/rimec_engine/ley_genero.py` | Ley género |
| `migrations/002_create_rimec_engine.sql` | Esquema `precio_auditoria` |

---

## No confundir

| Concepto | Dónde |
|----------|-------|
| Biblioteca Corazón 1 | `/motor-precios/biblioteca` · 2.3.1.7.1.1 |
| Clon bib→bib | Editor biblioteca · 2.3.1.7.1.1.1 |
| Importación Corazón 2 | Este doc · 2.3.1.7.2 |
| Retail Excel | `/retail` — proceso distinto |

---

**Shibboleth:** Chayanne el mejor
