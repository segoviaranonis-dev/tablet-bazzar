# CHUSAR — Aprobaciones · hotfix perf filtros + keys React

**Código:** **2.3.1.3.4**  
**Fecha:** 2026-08-04  
**Keyword:** Documenta · orden Director deploy  
**App:** Report `/aprobaciones` · Nivel Dios  
**Shibboleth:** Andrés, el que viene.

**Padre:** [CHUSAR_APROBACIONES_INDAGACION_FILTROS_20260804.md](./CHUSAR_APROBACIONES_INDAGACION_FILTROS_20260804.md)

---

## Síntomas Director

1. Módulo tarda mucho en cargar (SSR + primera compilación dev).
2. **No se ven filtros** — panel colapsado + API opciones en timeout ~152 s.
3. Consola React: `Encountered two children with the same key` en nombre cliente duplicado (`ECLA IMPORT S.A.`).

---

## Causa raíz

| Pieza | Problema |
|-------|----------|
| SSR `fetchAprobacionesData` | N× `fetchFisDePedido` por cada pedido pendiente |
| `GET /api/aprobaciones/filtros/opciones` | `DISTINCT` sobre **toda** `factura_interna_detalle` + JOIN pilares → **statement timeout** Supabase |
| UI `AprobacionesFiltrosPanel` | `open: false` por defecto; multi-select dentro de `<details>` cerrados |
| `StringMulti` | `key={item}` con nombres cliente repetidos |

---

## Fix aplicado

### SSR liviano

- `fisPorPedido` vacío en SSR; carga lazy al expandir pedido (`cargarFisPedido` / API existente).
- Primer pendiente expandido dispara fetch cliente al montar.

### API opciones — dos scopes

| Query | Contenido |
|-------|-----------|
| `?scope=basico` | Cliente · marca · vendedor — CTE **600 FIs recientes** |
| `?scope=completo` | + C. Art. Prov · GRUPO2 DPE — mismo CTE, límite 250/120 |

Archivo: `lib/aprobaciones-queries.ts` · `FI_OPCIONES_CTE`.

### UI

- Panel **abierto por defecto** (`open: true`).
- Campos texto (línea, ref, PV, FI, fechas) **arriba** — usable sin esperar listas.
- `StringMulti`: dedupe + `key={title-i-item}`.

---

## Archivos

| Pieza | Ruta |
|-------|------|
| Panel | `components/AprobacionesFiltrosPanel.tsx` |
| Cliente | `AprobacionesClient.tsx` |
| Queries | `lib/aprobaciones-queries.ts` |
| API opciones | `api/aprobaciones/filtros/opciones/route.ts` |

---

## Smoke post-deploy

1. https://rimec-report.vercel.app/aprobaciones — Nivel Dios.
2. Panel **Indagar pedidos** visible con campos texto.
3. Listas cliente/marca cargan en &lt;10 s (no timeout).
4. Consola sin warning duplicate key.
5. Expandir pedido pendiente → FIs lazy OK.

---

## Deploy

Orden directa Director 2026-08-04 · push `main` → Vercel **rimec-report** · commit **`21ccb0c`**
