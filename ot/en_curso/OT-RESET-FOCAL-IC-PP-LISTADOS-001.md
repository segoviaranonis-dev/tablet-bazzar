# OT-RESET-FOCAL-IC-PP-LISTADOS-001 — Reseteo focal

**Prioridad:** ALTA  
**Director:** Héctor Segovia  
**Ejecutor:** Claude Code  
**Estado:** PENDIENTE EJECUCIÓN  
**Repo:** `C:\Users\hecto\Nexus_Core\control_central`

---

## Regla

**Borra (operativa):**

| Área | Tablas |
|------|--------|
| Intención de compra | `intencion_compra`, `intencion_compra_pedido` |
| Pedido proveedor | `pedido_proveedor`, `pedido_proveedor_detalle`, `snapshot_costos` |
| Digitación | `intencion_compra_pedido` (puente IC↔PP, ya incluido arriba) |
| Listados de precios | `precio_evento`, `precio_evento_caso`, `precio_evento_linea_excepcion`, `precio_lista`, `precio_auditoria` |

**Conserva (intacto):**

| Capa | Tablas |
|------|--------|
| **Pilares** | `linea`, `referencia`, `linea_referencia`, `material`, `color`, `talla` |
| **Biblioteca** | `caso_precio_biblioteca`, `biblioteca_precio`, `biblioteca_caso_linea` |
| Diccionario web | `caso_precio_web_regla` |
| Sales Report | `registro_ventas_general_v2` |
| Retail | `registro_st_vt_rc_reposicion` |
| Maestras | `marca_v2`, `genero`, `cliente_v2`, `vendedor_v2`, … |

**NO toca downstream:** `factura_interna*`, `compra_legal*`, `traspaso*`, `movimiento*`, `pedido_web*`.

---

## Pre-requisito (auto-validado)

`factura_interna`, `compra_legal`, `traspaso`, `movimiento`, `pedido_web` deben estar en **0**.  
Si tienen filas → el script aborta con mensaje y se debe usar **OT-RESET-TRANSACCIONAL-511-001** (reset completo).

---

## Ejecución

```powershell
cd C:\Users\hecto\Nexus_Core\control_central

# 1) Dry run obligatorio
python scripts\reset_focal_ic_pp_listados.py --dry-run

# 2) Ejecutar (solo si dry run muestra downstream=0 y pilares/biblioteca con datos)
python scripts\reset_focal_ic_pp_listados.py --execute --confirm RESET-FOCAL-CONFIRMADO
```

Migración SQL equivalente (Supabase SQL Editor si hace falta):
`control_central/migrations/062_reset_focal_ic_pp_listados.sql`

---

## Checks de cierre

| ID | Esperado |
|----|----------|
| C1 | `intencion_compra` = 0 |
| C2 | `pedido_proveedor` = 0 (y `pedido_proveedor_detalle` = 0) |
| C3 | `precio_evento` = 0 (y `precio_lista` = 0) |
| C4 | `linea` COUNT pre = post |
| C5 | `caso_precio_biblioteca` COUNT pre = post |
| C6 | `registro_ventas_general_v2` sin cambio |
| C7 | `registro_st_vt_rc_reposicion` sin cambio |

Evidencia automática: `ot/RESET-FOCAL-IC-PP-LISTADOS-001-EVIDENCIA.json` (lo escribe el script).  
Plantilla manual: `ot/RESET-FOCAL-IC-PP-LISTADOS-001-EVIDENCIA.md`.

---

## Copiar a Claude Code

```
PRIORIDAD ALTA — OT-RESET-FOCAL-IC-PP-LISTADOS-001

cd C:\Users\hecto\Nexus_Core\control_central
python scripts\reset_focal_ic_pp_listados.py --dry-run
# revisar: downstream en 0, pilares y biblioteca con filas
python scripts\reset_focal_ic_pp_listados.py --execute --confirm RESET-FOCAL-CONFIRMADO

NO tocar pilares, biblioteca, Sales Report ni Retail.
Si dry-run detecta FI/CL/traspaso/movimiento/pedido_web con filas → abortar y avisar al Director (usar OT-511).
```
