# Prueba integridad stock — Fase 1 · una tienda (2100)

**Mañana:** 2026-06-28  
**CHUSAR Moria:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md`  
**Etapa:** `.claude/4_etapas/ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md`

---

## Antes de empezar

1. `cd report && node scripts/reset_pos_bazzar_ventas.mjs`
2. Report → `/depositos-bazzar` → card **2100** → **Sincronizar**
3. Tablet + Report dev levantados (`:3000` · `:3001`)

---

## A · Integridad física (☐ = PASS)

| ☐ | Paso |
|---|------|
| ☐ | A1 Depósito 2100 · anotar molécula + grada ⭐ |
| ☐ | A2 Vender 1 par misma grada en `/cadena` |
| ☐ | A3 Depósito: pares −1 · Alertas coherentes |
| ☐ | A4 CERRAR · FI_FA = 1 en Report caja |
| ☐ | A5 Cancelar o completar flujo · stock cuadra |

---

## B · Integridad referencial (☐ = PASS)

| ☐ | Check |
|---|--------|
| ☐ | B1 Bandeja ABIERTO = UI |
| ☐ | B2 FI_FA counter = MAX en BD |
| ☐ | B3 staging_id / lote homogéneo |
| ☐ | B4 depósito + bandeja = sync − ventas |
| ☐ | B5 solo cliente_id 2100 |
| ☐ | B6 molécula códigos alineados |
| ☐ | B7 primera venta id=1 fi_fa=1 |

---

## Evidencia

Guardar: `docs/evidencia/INTEGRIDAD_FASE1_2100_20260628.json`

---

## Fase 2

Sync 6 tiendas simultáneo — **no mañana**. Ver CHUSAR § Fase 2.
