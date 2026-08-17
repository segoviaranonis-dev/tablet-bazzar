# CHUSAR — FOCO Color tono · miniatura por código proveedor (654)

**Código:** `2.3.5.5.2`  
**Fecha:** 2026-08-13 · **Deploy:** 2026-08-14  
**Keyword:** **Documenta** · **despliega** · Protocolo Chusar Activado  
**Padre:** FOCO Admin Pilares **2.3.5.5** · pilar color **2.3.5.3**  
**Estado:** 🟢 **PROD** · Report `/pilares/color` · https://rimec-report.vercel.app/pilares/color  
**🆕 MOISES post-20260807 · 2026-08-14**

---

## Problema (Director)

En `/pilares/color` muchas filas quedan **— sin tono —**. El operador necesita **ver el producto** (foto) para elegir la etiqueta canónica correcta.

---

## Ley

`color.tono_canon` escrito en Admin Pilares = **única verdad** para filtros tono en **RIMEC Web** y **Tablet Bazzar** (leen `tono_canon` / etiqueta). No hay job de propagación aparte.

### Abstracción (Director · Documenta 2026-08-14)

**Pilar `color` = principio de todo el TONO.** Identidad estable (no se borra por Excel). Todo import que use color **busca FK + tono aquí**. Admin `/pilares/color` gobierna; el resto consume. 654≠638 (bolsas aisladas). Foto = ayuda para asignar, no fuente del tono.

Canónico extendido: [CHUSAR_PILAR_COLOR_TONO_CANON.md](./CHUSAR_PILAR_COLOR_TONO_CANON.md) § Ley de abstracción.

---

## Plan ejecutado

| Paso | Acción |
|------|--------|
| 1 | Proveedor **654** (tipo_v2=1) · match **exacto** `color.codigo_proveedor` |
| 2 | Retail `registro_st_vt_rc_reposicion` · `excel_color_code` **o** `color_id` → FK |
| 3 | Primera fila con `imagen_nombre` (prioridad) |
| 4 | Columna **Vista** · miniatura 80px · **clic** → overlay ampliado (`ImagenAmpliadaOverlay` · hero) |
| 5 | Orden trabajo: **1** sin tono/sin foto → **2** sin tono/con foto → **3** con tono/sin foto → **4** con tono/con foto |
| 6 | Ciegos: UI muestra stem L-R-M-C; al asignar tono completa `nombre` vacío (no inverso) |

**No es:** aliases de material · Sales Report · inventar nombre si ya hay texto proveedor.

**Aislamiento 638↔654:** bolsas separadas por `proveedor_id` + `tipo_v2`. Imagen: `tipo_v2` manda el protocolo (Kyly `L_C`/excel color · calzado `L-R-M-C`). Prohibido inferir 654 solo por guiones en el archivo si el Admin está en Confecciones.

---

## Performance (local → prod)

| Antes | Después |
|-------|---------|
| GET color 15–52 s (`OR EXISTS` retail) | Query por `color_id` + excel solo missing · ~0.2–0.5 s thumbs |
| PATCH ~5 s (`loadAndRecalc` masivo) | PATCH sin recalc · UI optimista |
| Recarga grilla tras cada tono | `thumbs=0` + `POST /api/pilares/color/thumbs` |

---

## Implementación

| Pieza | Ruta |
|-------|------|
| Query batch | `loadPrimeraImagenPorColorCode` · `report/src/lib/pilares/queries.ts` |
| Orden SQL | `loadColores` · CTE `img_codes` + `ORDER BY` grupos 1–4 |
| API lista | GET `/api/pilares/color` · `thumbs=0\|1` |
| API thumbs | POST `/api/pilares/color/thumbs` |
| UI | `ColorAdminClient` · Vista 80px · zoom clic · sort cliente |
| Catálogo liviano | `loadColoresEstandar` (sin INSERT/UPDATE masivo en cada GET/PATCH) |

---

## Nota datos

Retail a veces deja colores **ciegos** (`nombre` NULL) y `color_id` desalineado vs `excel_color_code` (histórico). Thumbs priorizan código Excel exacto. Deuda: remap FK retail (otro turno).

---

**Orden:** Director · Documenta · despliega · 2026-08-14
