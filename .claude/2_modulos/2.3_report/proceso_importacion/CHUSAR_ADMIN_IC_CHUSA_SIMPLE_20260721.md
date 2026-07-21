# CHUSAR — Admin IC Chusa simple · contadores independientes

**Código:** **2.3.1.7.5.3.5.4**  
**Decisión Director:** 2026-07-21  
**Estado:** 🟢 **CANÓNICO v4** — reemplaza empareje automático modo biblioteca en grilla  
**Ruta:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=admin-ic`  
**Shibboleth:** Andrés, el que viene.

**Padre:** [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) (**2.3.1.7.5.3.5.1**) · [CHUSAR_PP_CABECERA_BIBLIOTECA](./CHUSAR_PP_CABECERA_BIBLIOTECA.md) (**2.3.1.7.5.3.13**)

---

## Ley Director — simplicidad operativa

| Antes (v3) | Ahora (v4) |
|------------|------------|
| Modo biblioteca expandía IC virtuales 1:1 con PF por caso | **Todas las IC cabecera** visibles siempre |
| Contador IC = solo filas emparejables (~40) | **Contador IC = total cabeceras** del PP |
| Banner «62 IC sin proforma» · huérfanas automáticas | **Sin** empareje automático ni banner huérfanas |
| Orden con desempates monto / caso / nro IC | **Orden fijo:** código cliente → cod. marca → cantidad (asc) |
| Lote FI usaba `expandIcFilasChusaBiblioteca` | Lote FI: **fila i ↔ fila i** tras mismo orden simple |

El **usuario** alinea manualmente (editar IC · división PF ÷ · ICs Asignadas). El sistema solo ordena, cuenta y valida canon renglón a renglón.

---

## Contadores independientes

| Panel | Cuenta |
|-------|--------|
| **IC** (badge rojo cabecera) | `COUNT(intencion_compra vinculadas al PP)` — filtro cliente opcional |
| **PF** (badge derecha) | `COUNT(prefacturas internas)` — mismo filtro |

**Nivel 1 Chusa:** `contador_IC === contador_PF` — si difieren, aviso ámbar · botón lote deshabilitado.

Ejemplo PP-2026-0017 post-cirugía: **IC 98 · PF 78** → N1 bloqueado hasta que el operador cuadre (÷ PF o ajuste IC).

---

## Orden grilla — `cmpAdminFilasGrilla`

```text
cliente (id_cliente ASC) → cod.marca (id_marca ASC) → cantidad (pares ASC)
```

Aplica **igual** a panel IC y panel PF · lote FI usa el mismo criterio (`ordenarUniversoLoteChusa`).

---

## Código Report v4

| Pieza | Ruta |
|-------|------|
| Orden + lote simple | `report/src/lib/pedido-proveedor/administrador-ic-monto.ts` · `cmpAdminFilasGrilla` |
| UI grilla + contadores | `PpTabAdministradorIc.tsx` |
| POST lote FI | `…/administrador-ic/generar-fi-lote/route.ts` |

**Obsoleto en UI (conservado en lib por scripts legacy):** `expandIcFilasChusaBiblioteca` · `filasIcGrillaChusaBiblioteca` · flag `chusa_modo_biblioteca` en grilla.

**Biblioteca cabecera** sigue activa para **caso en PF** (BCL) — solo se quitó el empareje automático IC↔PF en Admin IC.

---

## Cirugía IC PP-17 · Excel 5436 (BD operativa)

**Script:** `report/scripts/cirugia_ic5436_pp26.mjs`  
**PP:** `PP-2026-0017` · `pedido_proveedor.id = 26`  
**Excel:** `IC-5436.xlsx` (98 filas · 9068 pares)

| Acción | Detalle |
|--------|---------|
| UPDATE | 3 IC pares/montos (0388 · 0440 · 0441) |
| DELETE puente + IC | 0494 · 0495 (sobrantes vs Excel) |
| INSERT + puente DIGITADO | IC-2026-0418 |
| UPDATE puente | 85× `nro_pedido_fabrica` desde Excel |
| Estado | `DIGITADO` · `precio_evento_id=45` · sin bandeja |

**No sincronizado:** `COD.VEND` Excel ≠ `id_vendedor` BD (constraint `chk_vendedor_rol`).

**Verificación post-commit:** `scripts/_compare_ic5436_excel_vs_pp26.mjs` → **98/98 match · 0 diffs**.

Uso:

```bash
node scripts/cirugia_ic5436_pp26.mjs --dry-run
node scripts/cirugia_ic5436_pp26.mjs --apply
```

---

## Deploy

| Campo | Valor |
|-------|--------|
| Repo | `segoviaranonis-dev/report` |
| Rama | `main` |
| Commit | `c74df5e` |
| Prod | `https://rimec-report.vercel.app` |

---

**Documenta 2026-07-21 — Admin IC Chusa simple v4 + cirugía IC PP-17 · Director.**
