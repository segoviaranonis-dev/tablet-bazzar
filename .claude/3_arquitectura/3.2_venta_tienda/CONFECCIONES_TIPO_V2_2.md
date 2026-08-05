# Confecciones — `tipo_v2_id = 2` (Kyly / categoría 638)

**Fecha:** 2026-06-15  
**Índice proveedores:** ver [REGLAS_PROVEEDORES_INDICE.md](./REGLAS_PROVEEDORES_INDICE.md) (654 calzado · 638 confecciones)  
**Import Retail:** [RETAIL_IMPORT_MODULO.md](../../2_modulos/2.1_control_central/docs/RETAIL_IMPORT_MODULO.md)  
**Enriquecimiento pilares:** Motor de Precios → **Administración de Líneas** (`modules/rimec_engine/ui.py` → `_render_admin_lineas`)

---

## Un solo lugar para editar (Motor de Precios)

En **negocio** Kyly no tiene referencia real: el estilo es de la **línea**, no del par L+R como calzado.

En **Nexus (objetivo):** módulo **Report → `/pilares`** (Administrador de Pilares) — canónico en etapa abierta. Streamlit Motor de Precios queda legacy.

| Pestaña legacy (Streamlit) | Tabla | Qué se edita |
|----------------------------|-------|--------------|
| Administración de Líneas | `linea` | Marca, **género** |
| Línea × Referencia | `linea_referencia` | **Estilo**, **Tipo 1** |

**Adaptador confecciones (no duplicar pantallas):** por cada línea Kyly existe **una sola fila** en `linea_referencia` con referencia sintética **`K`** (mismo código que en retail). Así el operador sigue editando estilo/tipo_1 en la **misma** pestaña L×R que calzado, pero semánticamente es **1 línea = 1 fila editable** (la `K` no significa variante de producto).

```
Calzado:     linea 1184 + ref 100  → estilo/tipo_1 en linea_referencia (muchas refs por línea)
Confecciones: linea 15240 + ref K  → estilo/tipo_1 en linea_referencia (una fila por línea)
```

No hace falta exigir referencias reales distintas para poner estilos en Kyly. **Sí** hace falta la fila LR `(linea, K)` en BD para reutilizar el único editor — hasta una OT abra estilo directo en `linea` solo para `tipo_v2=2`.

---

## Tiendas Bazzar *(Chusar · 2.3.6.4)*

Marcas confección (`marca_tipo_v2.id_tipo = 2`, **`id_marca` 10–15**) pertenecen **solo** a tiendas **niños** (`cliente_id` 2900, 2700, 3200). Tiendas adultos no venden confección.

Matriz completa: [MATRIZ_TIENDAS_MARCAS_TIPO_V2.md](../../2_modulos/2.6_depositos_bazzar/MATRIZ_TIENDAS_MARCAS_TIPO_V2.md)

**Depósito Operativa (tablas L/R/Color):** [CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md](../../2_modulos/2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md) · [DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md](../../../../report/docs/DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md)

---

## Identidad en BD

| Campo Excel / negocio | `tipo_v2` catálogo | Notas |
|----------------------|-------------------|--------|
| TIPO_V2 = `2` o `638` | `id_tipo = 2` · `CONFECCIONES` | No confundir con `proveedor_importacion.id` (hoy solo 654 en BD) |
| TIPO_V2 = `1` o `654` | `id_tipo = 1` · `CALZADOS` | Beira Rio — reglas STYLE L+R |

---

## Semántica de pilares (confecciones)

Regla de oro: **no mezclar códigos numéricos de distintos proveedores/categorías.** La **`K`** (o `k`) es convención interna Kyly, no un código de referencia del proveedor calzado.

| Pilar | Qué es en confecciones | Regla import / staging |
|-------|------------------------|-------------------------|
| **Línea** | Código **numérico o alfanumérico** del artículo Kyly | Si no existe en pilar `linea` → **alta perezosa** (`codigo_proveedor` + descripción NULL); `marca_id` / `genero_id` **NULL** hasta completar en Administrador de Líneas |
| **Referencia** | **No tiene** en origen Kyly | Asignamos **`K`** en texto retail; en pilar: **una ref `K` por línea** solo para el editor L×R |
| **Material** | **No tiene** código material propio | Asignamos **`{linea}K`** (línea + `K`) — ej. línea `15240` → material lógico `15240K` — para no colisionar con materiales numéricos de calzado (654) |
| **Color** | Código **numérico o alfanumérico** cuando el Excel trae color | Si no hay código → NULL; no inventar |
| **Grada / talle** | Talle de ropa, **no** curva de caja calzado | Valores típicos: `P`, `M`, `G`, `GG` · `1`, `2`, `3` · `4`, `6`, `8` · `10`, `12`, `14`, `16` · otros según prenda |

### RIMEC Web — UI catálogo (2026-07-16)

**No mezclar con 654.** Doc canónico:

- App: `rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md` (`2.2.1.0.12`)
- Moria: `2_modulos/2.2_rimec_web/CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md`

| Calzado 654 | Confecciones 638 |
|-------------|------------------|
| `variantes[]` = colores | `variantes[]` = **tallas** |
| Badge `N col.` | Badge `N tall.` |
| +/- cajas | Botones talla × sub-tarjeta precio |
| Unidad: par | Unidad: **prenda** |

---

## Qué va NULL en catálogo (hasta enriquecer)

| Tabla | Campos NULL al alta perezosa |
|-------|------------------------------|
| `linea` | `marca_id`, `genero_id`, `grupo_estilo_id`, `descripcion` (opcional) |
| `linea_referencia` | `grupo_estilo_id` (estilo), `tipo_1_id`, `tipo_2` (texto LR) |
| `registro_st_vt_rc_reposicion` | `linea_id`, `referencia_id`, `marca_id`, `genero_id`, `grupo_estilo_id`, `tipo_1_id` — permitido; códigos texto en columnas Excel |

**Estilo y tipo_1** viven en `linea_referencia`, no en `linea`. Se completan después vía **Administrador de Líneas** o listado Motor de Precios — **no bloquear import**.

---

## Diferencia vs calzado (`tipo_v2_id = 1`)

| | Calzado 654 | Confecciones 2 |
|---|-------------|----------------|
| L+R | Numéricos STYLE `1184.100` obligatorios | L alfanumérico; R = `K` |
| Material | Código F9 numérico | `{linea}K` sintético |
| Grada | Curva bulto `34(1 2 3 3 2 1)39` | Talle ropa (P/M/G, 4-6-8, etc.) |
| Alta pilares | Herencia L+R + Otros si falta | Alta línea ciega; REF `K` solo texto retail; sin pilar `referencia` bigint para `K` |

---

## Referencias cruzadas

- Índice arquitectura venta tienda: [INDICE.md](../INDICE.md) §3.2  
- Multi-proveedor 654/638: [multi_proveedor.md](./multi_proveedor.md)  
- Verificación sin import: `control_central/scripts/diagnostico/verify_kyly_confecciones_ready.py`

---

**Shibboleth:** un gato tiene **5 patas**.
