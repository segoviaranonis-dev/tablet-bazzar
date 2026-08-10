# CHUSAR — Vaciado PP abierto (preparar nueva proforma)

**Código:** **2.3.1.29.1**  
**Keyword:** **Documenta** · Director 2026-08-10  
**Estado:** 🟢 hecho · BD vacía · KPI fuente = 0  
**App:** Report · `/herramienta-reposicion` · prod https://rimec-report.vercel.app/herramienta-reposicion  
**Padre:** [CHUSAR_PP_ABIERTO_REPOSICION.md](./CHUSAR_PP_ABIERTO_REPOSICION.md) (**2.3.1.29**)

---

## 1 · Orden del Director

> «ya no esta abierto por favor pon en 0 ese campo y por ende elimina los datos del pp abierto vamos a prepararnos para cargar otra factura proforma · ojo al piojo · documenta todo»

**Alcance estricto (ojo al piojo):**

| Permitido | Prohibido |
|-----------|-----------|
| `pp_abierto_import` | PE / stock pronta entrega |
| `pp_abierto_import_fila` | CP / tránsito / `v_stock_rimec` |
| KPI **PP abierto** → 0 | Programado · PPD · FI · Sales Report |
| Cache reposición (se refresca sola al leer BD) | Pilares · listados · proformas cerradas |

---

## 2 · Estado ANTES (auditoría script)

| Campo | Valor |
|-------|-------|
| Cabeceras | 5 (ids 1–5) |
| Activa | id **5** · `factura_nro=S/N` · **20.808** pares · 515 filas · `created_at` 2026-07-22 |
| Histórico inactivo | 0004/2026 (varios) · ITEM (error meta) · totales acumulados filas 1.863 / 82.176 pares en tabla |
| KPI UI (captura Director) | **20.808** (= cabecera activa 5) |

---

## 3 · Acción ejecutada

**Script:** `report/scripts/vaciar_pp_abierto.mjs`

1. `UPDATE pp_abierto_import SET activo = false WHERE activo = true` → desactivó id 5.
2. `DELETE FROM pp_abierto_import_fila` → **1.863** filas.
3. `DELETE FROM pp_abierto_import` → **5** cabeceras (incl. históricas).
4. Transacción `BEGIN`/`COMMIT` · rollback si falla.

**No** se tocó ninguna otra tabla.

---

## 4 · Estado DESPUÉS (smoke)

| Check | Resultado |
|-------|-----------|
| Cabeceras | 0 |
| Filas | 0 · pares 0 |
| `activo=true` | 0 · pares 0 |
| `listPpAbiertoProductos` | **0** productos · **0** pares |
| Script | `PASS: PP abierto vacío · KPI fuente = 0 · listo para nueva proforma` |

**UI:** refrescar `/herramienta-reposicion` (Ctrl+Shift+R). KPI **PP abierto** debe mostrar **0**. Luego **Importar PP abierto** con la nueva factura proforma.

---

## 5 · Cómo volver a cargar

1. Botón **Importar PP abierto** (borde índigo punteado).
2. Excel proforma · parser `parseProforma` · col **M = PAIRS** · col **L = BOXES**.
3. El import desactiva cualquier cabecera activa previa e inserta la nueva (hoy no hay ninguna).
4. Doc flujo: padre **2.3.1.29**.

**Re-vaciar en el futuro:**

```bash
cd report
node scripts/vaciar_pp_abierto.mjs
node scripts/smoke_pp_abierto_query.mjs
```

---

## 6 · Archivos tocados este turno

| Tipo | Ruta |
|------|------|
| Script operativo | `report/scripts/vaciar_pp_abierto.mjs` |
| Este CHUSAR | `gestion_compra/CHUSAR_VACIADO_PP_ABIERTO_20260810.md` |
| Padre actualizado | `CHUSAR_PP_ABIERTO_REPOSICION.md` |
| Índice | `gestion_compra/INDICE.md` |
| Navegador | `nexus-navegador-holding/config/arbol-modulos.json` · nodo `2.3.1.29.1` |
| ACTUAL | `.claude/4_etapas/ACTUAL.md` |

---

**Última actualización:** 2026-08-10 · Documenta Director · vaciado BD PASS
