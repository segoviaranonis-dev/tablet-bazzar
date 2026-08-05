# ETAPA ABIERTA — RIMEC Web · Filtro precio slider + SQL

**ID:** `RIMEC-WEB-CABECERA-PRECIO-20260723`  
**Código:** **2.2.1.21** · RIMEC Web · catálogo  
**Estado:** 🟢 **EN CURSO**  
**Apertura:** 2026-07-23 · **Inicia etapa** · **Documenta** · corrección foco Director mismo día  
**App:** http://localhost:3001 · prod https://rimec-web.vercel.app  
**Doc:** [CHUSAR_CABECERA_HUECA_PRECIO_ESTADO_20260723.md](../2_modulos/2.2_rimec_web/CHUSAR_CABECERA_HUECA_PRECIO_ESTADO_20260723.md)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo (foco Director — inviolable)

1. **Filtro de precios = rango** (límite **inferior y superior**).
2. **Teclado ↔ slider = espejo** — misma consulta, dos representaciones; una responde a la otra.
3. **Consulta SQL** (`precio_min` / `precio_max` · columna LPN/LPC según lista).
4. Límites = **MIN/MAX reales** BD (`fetchPrecioMinMaxSql`).
5. **Aplicar** / **Enter** dispara SQL; tipiar mueve mangos sin consultar hasta commit.

### Diseño rechazado (no volver)

| Rechazado | Sustituto |
|-----------|-----------|
| `FiltroPrecioTopeSlider` — un solo tope | `FiltroPrecioRango` — doble mango + inputs + Aplicar |
| Enter con draft stale | `commitYAplicar` (parse + SQL atómico) |

El archivo `FiltroPrecioTopeSlider.tsx` **no** debe cablearse de nuevo en cabecera.

---

## Estado técnico (2026-07-23)

| Pieza | Archivo | Estado |
|-------|---------|--------|
| Núcleo espejo | `lib/filtroPrecioRangoSync.ts` | ✅ local |
| UI teclado↔slider | `FiltroPrecioRango.tsx` | ✅ local |
| Venta en cabecera | `HeaderSesionVenta.tsx` | ✅ local (pixel) |
| MIN/MAX SQL | `catalogoPrecioSql.ts` | ✅ local |
| WHERE min/max | `catalogoPrecioSqlCore` | ✅ en `catalogoPaginado` |
| Smoke espejo | `_smoke_precio_rango_sync.ts` | ✅ `PASS_PRECIO_RANGO_SYNC` |
| Smoke SQL | `_smoke_precio_sql_filtro.ts` | ✅ `PASS_PRECIO_SQL_FILTRO` |
| Deploy prod | — | ❌ cierre etapa u orden directa |

---

## Checklist

- [x] Auditoría: teclado ↔ slider ↔ mismos SQL params (53k–150k)
- [x] Enter / Aplicar sin stale setState
- [x] Mango inferior arrastrable
- [ ] Smoke visual Director en `:3001` (Ctrl+Shift+R)
- [ ] Confirmar lista activa cambia columna SQL
- [ ] Deploy solo al **cerrar etapa** u orden directa

---

## Relacionados

- Cabecera filtros: [CHUSAR_CATALOGO_CABECERA_FILTROS.md](../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_CABECERA_FILTROS.md) (**2.2.1.1**)
