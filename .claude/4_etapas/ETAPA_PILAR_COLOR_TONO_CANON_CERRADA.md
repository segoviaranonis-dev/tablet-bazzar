# ETAPA CERRADA — Report · Pilar Color · tono_canon

**ID:** `ETAPA-PILAR-COLOR-TONO-20260628`  
**Código:** **2.3.5.3**  
**Fecha cierre:** 2026-06-28  
**Director:** cierra etapa · documenta  
**Estado:** ✅ **CERRADA** · admin Report + filtro TONO tablet cadena publicados  
**Shibboleth:** 7 años

---

## Alcance cerrado

| Fase | Entregable | Estado |
|------|------------|--------|
| 0 | CHUSAR + etapa + índice navegador | ✅ |
| 1 | Migraciones `125` · `126` · grilla admin | ✅ |
| 1b | Admin `/pilares/color` · import 654 · sync predominante | ✅ |
| 2 | CHUSAR búsqueda color (2 vías · prohibiciones UI) | ✅ doc |
| 4 | Import sugerencia tono · sin Otros auto | ✅ |
| **3 parcial** | **Filtro TONO tablet `/cadena` → vista** | ✅ hotfix `9569eb2` |

**Fuera de este cierre** → sub-etapa **2.3.5.3.1** Editor TONO completo: [CHUSAR_EDITOR_TONO.md](../2_modulos/2.3_report/pilares/CHUSAR_EDITOR_TONO.md) (RIMEC Web · badge ficha · Franco · cola sin asignar).

---

## Entregables Report

| Ítem | Evidencia |
|------|-----------|
| Columna `color.tono_canon` + catálogo `color_tono_estandar` | Migraciones 125 · 126 |
| Admin grilla KPIs combinables | `/pilares/color?tipo_v2_id=1` |
| Import xlsx 654 · política idioma | `POST /api/pilares/color/import` |
| Sync predominante auto-save | `PATCH sync_predominante` |
| Marino marina/marihq/mariho · Otros manual | `colores-estandar.ts` |
| Deploy prod | commit `c6be01f` · https://rimec-report.vercel.app/pilares/color |

---

## Entregables Tablet (consumidor Fase 3 parcial)

| Ítem | Evidencia |
|------|-----------|
| Filtro TONO persiste en `/cadena/vista` | commit `9569eb2` |
| SQL + URL conservan `tonos` / `sin_tono` | `catalogo-sql.ts` · `filtros-url.ts` |
| Bug índice | [4.03.02.002](../5_errores/detalle/4.03.02.002_cadena-vista-tono-filtro-anulado.md) |
| CHUSAR consumidor | [CHUSAR_TABLET_CADENA_TONO.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_CADENA_TONO.md) |
| Deploy prod | https://tablet-bazzar.vercel.app/cadena |

---

## CHUSAR

| Doc | Tema |
|-----|------|
| [CHUSAR_PILAR_COLOR_TONO_CANON.md](../2_modulos/2.3_report/pilares/CHUSAR_PILAR_COLOR_TONO_CANON.md) | Admin · verdad BD |
| [CHUSAR_BUSQUEDA_COLOR_CANALES.md](../2_modulos/2.3_report/pilares/CHUSAR_BUSQUEDA_COLOR_CANALES.md) | Vía A iconos · Vía B texto |
| [CHUSAR_TABLET_CADENA_TONO.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_CADENA_TONO.md) | Filtro cadena tablet |
| [CHUSAR_EDITOR_TONO.md](../2_modulos/2.3_report/pilares/CHUSAR_EDITOR_TONO.md) | ⏳ **2.3.5.3.1** abierta |

---

## Smoke post-cierre

1. Report `:3001/pilares/color?tipo_v2_id=1` — KPI sin/con tono · sync JEANS · Otros manual  
2. Tablet `/cadena` — TONO Marrón → INGRESAR → sin colores VINO fuera de filtro  
3. Navegador `:3004/etapas` — tarjeta **2.3.5.3** fuera de «Trabajando ahora»

---

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `estado: "hecho"` | ✅ |
| `cerradasPorModulo.report` | ✅ |
| `ultimaCerradaPorModulo.report` | ✅ |
| `actualizado` bump | ✅ |
| Verificado `:3004/etapas` | ✅ |

---

**Cerrada por orden Director — 2026-06-28**
