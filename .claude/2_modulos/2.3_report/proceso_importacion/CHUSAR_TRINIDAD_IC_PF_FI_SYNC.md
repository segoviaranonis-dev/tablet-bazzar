# CHUSAR — Trinidad IC · Pre-factura · Factura interna (PROGRAMADO)

**Código:** **2.3.1.7.5.3.15**  
**App:** Report · PP PROGRAMADO (`categoria_id = 3`)  
**Detectado:** 2026-08-06 · queja usuario PP-2026-0033 · LPN→LPC03 no persiste  
**Hotfix:** 2026-08-06 · `trinidad-ic-pf-fi-sync.ts`  
**Keyword:** Documenta · bug urgente  
**Shibboleth:** Andrés, el que viene.

---

## Ley Director — Trinidad

| Ámbito | Rol | Editable |
|--------|-----|----------|
| **IC** | Intención de compra vinculada al PP | **Sí — completamente** |
| **PF** | Pre-factura (Admin IC · vista cliente×marca×caso) | Derivada de IC + PPD |
| **FI** | Factura interna operativa | **Rígida** — cambios vía recalc canónico |

**Regla:** IC ≡ PF ≡ FI en **LP · plazo · descuentos · evento motor**.  
Donde se edite (cabecera PP · tab FI · Admin IC), **al guardar** los tres ámbitos quedan alineados.

**Emparejamiento canónico:** `factura_interna.notas = intencion_compra.numero_registro`  
(ej. `93-PV001` ↔ `IC-2026-0892`). **Prohibido** sincronizar solo por `id_cliente` cuando hay varias IC del mismo cliente en un PP.

---

## Síntoma reportado (PP-2026-0033)

- Usuario cambia **LPN → LPC03** en IC o FI.
- Badge **«IC LPN ≠ FI LPC03»** en tab FI.
- Sensación: «no guarda» · IC / proforma / FI desconectados.

---

## Forense BD (evidencia)

**PP id=93** · **36 FI** · cliente **407** con **4 IC** (0878, 0879, 0881, 0892).

| FI | IC real (`fi.notas`) | IC LP | FI LP | Estado |
|----|----------------------|-------|-------|--------|
| 93-PV001 | IC-2026-0892 | LPN | LPN | OK |
| 93-PV002 | IC-2026-0881 | LPN | LPC03 | **DESALINEADO** |
| 93-PV003 | IC-2026-0879 | LPC03 | LPC03 | OK |

**51** desalineaciones cabecera LP en el PP (sync por `cliente_id` cruzaba hermanas).

**Causas raíz (código pre-fix):**

1. Sync IC↔FI por **`id_cliente`** — pisa IC/FI hermanas del mismo cliente.
2. Guardar LP en **cabecera IC** solo escribía `lista_precio_id` en FI **sin recalcular líneas**.
3. Badge UI usaba `LATERAL` por proximidad de pares — **IC equivocada** en pantalla.
4. PPD sin `precio_lpc03` → recalc LPC03 falla o deja líneas en LPN (requiere listado motor en Stock).

---

## Fix implementado

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/pedido-proveedor/trinidad-ic-pf-fi-sync.ts` | Motor trinidad · emparejar por `notas` |
| `cabecera-actions.ts` | Quitado UPDATE FI por `cliente_id` al guardar IC |
| `fi-pp-actions.ts` | FI→IC solo IC emparejada · bootstrap por `notas` |
| `detail-query.ts` | Badge `ic_listado_precio_id` por `fi.notas` |
| `ic/[icId]/route.ts` | Tras PATCH IC → `propagarTrinidadDesdeIc` (recalc FI) |

### Flujos post-fix

**Guardar IC (cabecera PP):**  
IC BD → `propagarTrinidadDesdeIc` → recalc plazo/desc/LP en FI(s) con mismo `notas` → PF se alinea al recargar Admin IC.

**Guardar LP / encabezado FI (tab FI):**  
`actualizarListaPrecioFi` / `actualizarEncabezadoFi` → `syncIcDesdeFiPatch` → **una sola IC** por `notas`.

**Listado motor FI:** evento motor → IC emparejada por `notas` (no todas las IC del cliente).

---

## PF (pre-factura)

No persiste tier aparte: `PreFacturaInterna.listado_tier` = `fiListaTier(ic.listado_precio_id)` en `administrador-ic-query.ts`.  
Al sincronizar IC, PF queda coherente en la **próxima lectura** del Admin IC.

---

## Residual / operación

| Caso | Acción |
|------|--------|
| PPD sin columna LPC03 | Vincular listado motor en tab Stock antes de forzar LPC03 |
| FI legacy sin `notas` | Regenerar FI programado o `backfillFiIcNotasProgramado` |
| PP-0033 PV002 desalineado | Re-guardar IC-0881 o LP en FI tab → trinidad corrige |

---

## Smoke Director

1. PP PROGRAMADO con IC+FI · cambiar LP en **cabecera IC** → guardar → FI recalculada · badge sin desalineación.
2. Cambiar LP en **tab FI** → IC emparejada (`notas`) actualizada · PF coherente en Admin IC.
3. Cliente con **2+ IC** en mismo PP: editar una **no** pisa la otra.

---

## Errores índice

Relacionado: `4.02.03.010` (Admin IC botón verde) · nuevo registro sugerido **4.02.03.024** trinidad LP cliente_id.

**Estado fix código:** ✅ **PROD 2026-08-06** · commit `fe89fca` · deploy `dpl_DfCJxGKC8f4pxEwEMftAuHXzvo35` · https://report-plum-one.vercel.app  
**Deploy doc:** [CHUSAR_DEPLOY_TRINIDAD_20260806.md](./CHUSAR_DEPLOY_TRINIDAD_20260806.md) (**2.3.1.7.5.3.15.1**)
