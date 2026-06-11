# Auditoría Cursor — Nexus (`control_central`) — OT-NOMENCLATURA Fase 0b

**Fecha:** 2026-05-19  
**Ejecutor:** Cursor  
**Alcance:** `control_central/modules/`, `control_central/migrations/` (muestra), scripts activos  
**Tipo:** inventario — **sin cambios de código** en esta pasada

---

## Resumen

| Severidad | Cantidad aprox. | Acción |
|-----------|-----------------|--------|
| **Alta** — alias cortos en lógica negocio | PP proforma `linea_cod`/`ref_cod`, Motor UI SQL alias | Fase 1–2 OT |
| **Media** — inglés `*_code` en Retail | `fk_resolve.py`, `balance_tiendas_retail` | Fase 4 |
| **Baja** — legacy SQL/vistas | `linea_codigo` text en migraciones / `precio_lista` | Fase 3 SQL |
| **OK** — FK correctos | `linea_id`, `referencia_id` en JOINs PP post-integridad | Mantener |

---

## Hallazgos prioritarios (cambiar)

### 1. `pedido_proveedor/logic.py` — proforma

| Actual | Propuesto | Ubicación |
|--------|-----------|-----------|
| `linea_cod`, `ref_cod` (variables) | `linea_codigo_proveedor`, `referencia_codigo_proveedor` | `parse_proforma`, dict filas ~1318 |
| keys `"linea_cod"`, `"ref_cod"` | mismos nombres canónicos en payload | import proforma |

Comentario docstring aún dice `linea_cod=2133` — actualizar al renombrar.

### 2. `rimec_engine/ui.py` — consulta pilares

| Actual | Propuesto |
|--------|-----------|
| SQL alias `AS linea_cod`, `AS ref_cod` | `AS linea_codigo_proveedor`, `AS referencia_codigo_proveedor` |
| DataFrame cols `linea_cod`, `ref_cod` | alinear + labels UI «Línea»/«Ref.» en display only |

### 3. `compra_legal/logic.py`

Parámetros `linea_cod: str`, `ref_cod: str` → `linea_codigo_proveedor`, `referencia_codigo_proveedor`.

### 4. `parse_proforma` / `hiedra`

Duplicado parser — unificar import `pillar_parse` (ya OT integridad + nomenclatura Fase 1).

### 5. `balance_tiendas_retail/fk_resolve.py`

| Actual | Propuesto |
|--------|-----------|
| `linea_code`, `referencia_code` (DataFrame Excel) | `linea_codigo_proveedor`, `referencia_codigo_proveedor` **o** documentar como «columnas Excel staging» con mapping explícito en `pilares-rules` style |

Mezcla inglés/español con Nexus — unificar en Fase 4.

### 6. `migrations/054_resolver_pilares_sql.sql`

Parámetros `p_linea_codes`, `codigo_linea` en UNNEST — renombrar en migración nueva (no editar 054 aplicada sin plan).

---

## Legacy — no tocar hasta Fase 3 (documentado)

- `precio_lista.linea_codigo`, `referencia_codigo` (TEXT) — backfill 055
- Vistas `v_stock_web`: alias `linea_codigo` desde `l.codigo_proveedor::text`
- `pedido_proveedor_detalle.linea` / `.referencia` (texto histórico PP)

---

## Módulos con conteo `linea_cod|ref_cod` (grep modules/)

| Módulo | Ocurrencias aprox. |
|--------|-------------------|
| `balance_tiendas_retail/logic.py` | 31 |
| `aprobacion_pedidos/logic.py` | 21 |
| `rimec_engine/logic.py` | 18 |
| `rimec_engine/ui.py` | 18 |
| `pedido_proveedor/logic.py` | 13 |
| `balance_tiendas_retail/fk_resolve.py` | 12 |
| Otros | &lt; 10 c/u |

---

## Próximo paso Cursor (Fase 1 — cuando Director diga)

1. `parse_proforma` → `pillar_parse` + renombre keys dict.
2. Motor `ui.py` aliases SQL.
3. Script `scripts/auditar_nomenclatura_pilares.py` (grep CI).

---

## Estado

`LISTO_PARA_AUDITORIA` (inventario Nexus) — esperando Claude (webs) y Gemini (report).
