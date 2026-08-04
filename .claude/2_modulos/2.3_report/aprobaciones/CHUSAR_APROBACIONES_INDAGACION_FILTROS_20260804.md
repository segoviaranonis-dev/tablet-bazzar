# CHUSAR — Aprobaciones · indagación multi-filtro

**Código:** **2.3.1.3.3**  
**Fecha:** 2026-08-04  
**Keyword:** Documenta · protocolo Chusar  
**App:** Report `:3000/aprobaciones` · Nivel Dios  
**Shibboleth:** Andrés, el que viene.

**Padre:** [CHUSAR_TABS_PENDIENTE_APROBADO_ANULADO_20260729.md](./CHUSAR_TABS_PENDIENTE_APROBADO_ANULADO_20260729.md) · [APROBACIONES.md](../../../report/docs/APROBACIONES.md)

---

## Norte Director

Panel **Indagar pedidos** en las 3 tabs (Pendientes · Aprobados · Anulados) con multi-select y búsqueda para encontrar FIs/pedidos sin exportar CSV.

---

## Filtros implementados

| Filtro | Fuente BD / CSV |
|--------|-----------------|
| Código cliente | `fi.cliente_id` · CSV **C. cliente** |
| Nombre cliente | `cliente_v2.descp_cliente` |
| Marca | `fi.marca` · CSV **Marca** |
| Vendedor | PVR payload / `usuario_v2` · CSV **Vendedor** |
| C. Art. Prov | `ppd.linea || '.' || ppd.referencia` · CSV **C. Art. Prov** |
| Cód. interno DPE | `linea_referencia.grupo_estilo_id` · CSV **GRUPO2** |
| Línea (contiene) | `ppd.linea ILIKE` |
| Referencia (contiene) | `ppd.referencia ILIKE` |
| PV global | `fi.pv_global` |
| Nro. FI | `fi.nro_factura` |
| Fecha desde/hasta | `fecha_confirmacion` / `created_at` |

Artículo/línea/ref/DPE: subquery `EXISTS` sobre `factura_interna_detalle` + `pedido_proveedor_detalle`.

---

## API

| Ruta | Rol |
|------|-----|
| `GET /api/aprobaciones/filtros/opciones` | Distinct values multi-select |
| `GET /api/aprobaciones/lista?tab=…&…` | Lista filtrada (pendientes · aprobados · anulados) |

Query params: `cliente_ids`, `cliente_nombres`, `marcas`, `vendedores`, `codigos_articulo`, `codigos_grupo_dpe`, `linea`, `referencia`, `pv`, `nro_fi`, `fecha_desde`, `fecha_hasta`.

---

## UI

| Pieza | Ruta |
|-------|------|
| Panel indagación (abierto por defecto) | `components/AprobacionesFiltrosPanel.tsx` |
| Cliente | `AprobacionesClient.tsx` · botón **Aplicar filtros** |
| SQL builder | `lib/aprobaciones-filtros-query.ts` |
| Tipos | `lib/aprobaciones-filtros-types.ts` |

Límite lista: **200** FIs. Contador filtrado en subtítulo Aprobados/Anulados.

**Hotfix 2026-08-04 (2.3.1.3.4):** SSR sin batch FIs pendientes · API opciones `scope=basico|completo` · panel visible · dedupe keys React en listas nombre.

---

## Smoke

1. `:3000/aprobaciones` → **Indagar pedidos** → expandir.
2. Multi-select cliente **2048** → Aplicar → tab Aprobados reduce lista.
3. C. Art. Prov `2950.256` → encuentra FI con ese SKU.
4. Rango fecha confirmación → acota aprobados del día.
5. **Limpiar todo** → vuelve SSR inicial.

---

## Pendiente (no bloquea)

- Export CSV **con filtros activos** (hoy CSV general sin filtro).
- Persistir filtros en `sessionStorage`.
- Filtro **C. Prov** (654 fijo en CSV col 18) como dimensión aparte si Director pide.
