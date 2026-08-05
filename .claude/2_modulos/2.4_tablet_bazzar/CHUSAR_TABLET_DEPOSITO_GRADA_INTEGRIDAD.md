# CHUSAR — Tablet · Depósito · Integridad grada (TOP/marca + UI scroll)

**Subcuenta:** **2.4.3.8**  
**Padre:** [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md) · **2.4.3.4**  
**Toolbar:** [CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) · **2.4.3.7**  
**Estado:** ✅ **PASS piso 2026-07-03** · verificado FER-N 2900 · [Manual](./CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md)

---

## Síntoma (bug dual)

En FER-N (`cliente_id` **2900**), moléculas con muchas gradas mostraban **menos pares** en tablet que en BD.

**Ejemplo canónico:** `2831.244` · MOLEKINHO · NAPA VERMONT NEO NEGRO 01  
- BD: **10 gradas** · **51 pares**  
- UI antes del fix: **6 columnas visibles** · conteo aparente truncado

---

## Causa 1 — SQL · LIMIT sobre filas sueltas (crítico)

`sqlDepositoFilasGrada` aplicaba `ROW_NUMBER() … rank_por_marca <= limit` sobre **filas SKU con grada**, no sobre **cajas molécula**.

Con `limit=80` (TOP 80/marca):

- Una caja con 10 gradas consumía **10 ranks** del cupo.
- Resultado FER-N: **72 de 1597 moléculas truncadas** — gradas enteras desaparecían de la API.

### Fix SQL (canónico)

1. CTE `molecule_totals` — agrupa por `(linea, ref, material, color)` → `total_pares`.
2. CTE `ranked_molecules` — `ROW_NUMBER() OVER (PARTITION BY marca_id ORDER BY total_pares DESC)`.
3. CTE `selected_molecules` — filtra `rank_por_marca <= limit` (**una fila por caja**).
4. JOIN final `sku_rows` ↔ `selected_molecules` → **todas las gradas** de las cajas seleccionadas.

**Archivo:** `tablet-bazzar/lib/server/deposito-filtros-sql.ts` → función `sqlDepositoFilasGrada`.

```sql
-- Ley: LIMIT = top N CAJAS por marca, no top N filas grada
ranked_molecules AS (
  SELECT …,
    ROW_NUMBER() OVER (PARTITION BY marca_id ORDER BY total_pares DESC) AS rank_por_marca
  FROM molecule_totals
),
selected_molecules AS (
  SELECT … FROM ranked_molecules WHERE rank_por_marca <= :limit
)
```

**Report operativa** usa `limit=all` en vista operativa — **no** tenía este bug en producción Report. Tablet default `limit=80` sí lo exponía.

---

## Causa 2 — UI · overflow oculto en card

Tarjeta ~220px + `overflow-hidden` en tabla grada cortaba columnas aunque la API trajera todas.

### Fix UI

| Cambio | Archivo |
|--------|---------|
| `overflow-x-auto` contenedor grada | `TablaGradaDeposito.tsx` |
| Badge header `51 st · 10 t` | Misma · total pares + count tallas |
| Scroll horizontal táctil | Usuario desliza para ver gradas 27–36 |

Paridad aplicada en Report: `TablaGradaOperativa.tsx` (scroll preventivo).

---

## Verificación

**Script:** `tablet-bazzar/scripts/diag-grada-truncada-2900.mjs`

```powershell
cd tablet-bazzar
node scripts/diag-grada-truncada-2900.mjs
```

| Check | Esperado |
|-------|----------|
| `2831.244 gradas API` | 10 gradas · 51 pares |
| Moléculas truncadas vs full scan | **0** |

---

## Regla holding (anti-regresión)

> **TOP N/marca** en depósito tablet = **N cajas (moléculas)**, nunca N filas `grada`.

Cualquier query nueva que limite stock depósito debe:

1. Rankear a nivel **molécula** (`linea + referencia + material + color`).
2. Expandir gradas **después** del corte.
3. Documentar en este CHUSAR si cambia el contrato.

---

## Impacto negocio

- Jefa de salón veía stock **falso bajo** en vidriera y conteos piso.
- Alertas ⭐ podían calcularse sobre gradas **ausentes** en UI.
- Tras fix: badge tarjeta, tabla grada y suma API **coinciden con BD**.

---

**Shibboleth:** Chayanne el mejor · Una caja = todas sus gradas · TOP limita cajas no tallas
