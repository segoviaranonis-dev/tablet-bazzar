# CHUSAR — Motor precio WEB · cascada siamese + CASO DPE NORMAL

**Código:** **2.5.1.21**  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · **despliega** (orden Director)  
**App:** Report `/bazzar-web/motor-precio`  
**Maestro filtros:** [CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md](../2.2_rimec_web/CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md) (**2.2.1.44**)  
**CASO DPE:** [CHUSAR_MOTOR_PRECIO_CASO_DPE_NORMAL_20260806.md](./CHUSAR_MOTOR_PRECIO_CASO_DPE_NORMAL_20260806.md) (**2.5.1.19**)  
**Imágenes:** [CHUSAR_MOTOR_PRECIO_IMAGENES_NIIF_20260801.md](./CHUSAR_MOTOR_PRECIO_IMAGENES_NIIF_20260801.md) (**2.5.1.5**) · Ley `2.01.04.021`  
**Shibboleth:** Andrés, el que viene.

---

## Hermano (mapa 2.2.1.44)

| Código | Superficie | Motor filtros |
|--------|------------|---------------|
| **MP** | Report Motor precio Guardián | `applyStockPeFilters` + `ReposicionFiltrosSidebar` variant `pe` |
| **DW** | Depósito Web | idem |
| **PE** | Stock Pronta Entrega | idem |
| **W / AM** | RIMEC Web / Alejandro Magno | canónicos Web/AM |

**MP** reutiliza el motor PE (no inventa facetas). Tipificación grupo uno = **DPE** (`COD.GRUPO`), no BCL.

---

## Sesión operativa 2026-08-06

| # | Hecho |
|---|--------|
| 1 | Import PE **`sdrm3901`** (replace) · `am_cod_grupo` 100% |
| 2 | CASO WEB ← DPE · etiqueta **NORMAL** (no REGULAR) · regla markup `NORMAL` +50% |
| 3 | Thumbs: PE `imagen_url` + stem 638/654 (Ley Universal) |
| 4 | Cascada Dimensiones→Molécula en Guardián catálogo |
| 5 | UI flotante (sin caja wrapper) · layout fluido max ~1600px · sidebar `w-auto` |

### Smoke filtros (ALM_WEB 165 SKUs)

| Chip Tipo | SKUs |
|-----------|------|
| LIQUIDACION | 50 |
| PROMOCIONAL | 35 |
| NORMAL | ~80 |
| DEFAULT residual | ≤1 |

---

## Archivos Report

```
report/src/lib/bazzar-web/motor-precio/lpn-caso-sql.ts
report/src/lib/bazzar-web/motor-precio/catalogo.ts
report/src/lib/bazzar-web/motor-precio/catalogo-filtro-siamese.ts
report/src/lib/bazzar-web/motor-precio/types.ts
report/src/app/bazzar-web/motor-precio/components/MotorPrecioClient.tsx
report/src/components/herramienta-reposicion/ReposicionFiltrosSidebar.tsx  # w-auto / bloques lg:w-64
report/src/lib/bazzar-web/compra-web/queries.ts  # caso_nombre prioriza DPE
```

---

## UI — leyes de layout (Director)

| Prohibido | Correcto |
|-----------|----------|
| Caja blanca envolviendo la cascada | Bloques Dimensiones / Molécula **flotantes** (como RIMEC Web) |
| `min-w` fijo 28rem con rails colapsados | `aside` / sidebar `w-auto` · tabla `flex-1 min-w-0` |
| Página que desborda horizontal | Scroll solo en grilla (`overflow-x-auto`) · `max-w-[1600px]` |

---

## Deploy

Orden Director **despliega** 2026-08-06 → Report prod (Vercel).  
**No** toca rimec-web sellado `f408fc2`.

---

## Relacionados

- **2.5.1.20** — Cascada DW↔BZ catálogo  
- **2.5.1.19** — CASO NORMAL  
- **2.3.1.10.1.2.1** — Ley DPE sin BCL  
- **2.2.1.42** — Cascada facetas (Web)
