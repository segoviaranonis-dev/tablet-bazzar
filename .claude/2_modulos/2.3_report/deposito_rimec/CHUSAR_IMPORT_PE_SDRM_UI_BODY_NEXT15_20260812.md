# CHUSAR — Import PE sdrm UI · body Next 15.5 (usuario sin agente)

**Código:** **2.3.1.10.1.7**  
**Fecha:** 2026-08-12  
**Keyword:** **Documenta** · orden **despliega** (Report)  
**App:** Report `/stock-pronta-entrega` · botón **Importar CSV sdrm**  
**Padre:** **2.3.1.10** · plan import **CHUSAR_PLAN_IMPORT_PE_SDRM0849…** · pipeline Node `pe-sdrm-pipeline`  
**Estado:** ✅ local verificado · deploy Report este turno  
**🆕 MOISES post-20260807 · 2026-08-12**  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible

---

## 0 · Qué ordenó el Director

1. Paréntesis: verificar import `Z:\hector\sdrm0218.csv` en `:3000`.  
2. No aceptar que “solo el agente” pueda importar: **el usuario debe poder cuando quiera**, misma velocidad.  
3. **Documenta** + **despliega**.

---

## 1 · Problema (creer ≠ saber)

| Camino | Resultado |
|--------|-----------|
| Pipeline Node directo (`runPeSdrmPipeline`) | ✅ ~13 s · `sdrm0218` · fk_miss=0 |
| Botón UI `POST /api/stock-pronta-entrega/import-csv` | ❌ / colgado / incompleto |

**Causa raíz:** Next.js **15.5.x** (`15.5.18`) — proxy interno con límite de body ~**1 MB**. CSV `sdrm0218.csv` ≈ **1,24 MB** → body truncado al subir por FormData. El script no pasa por ese proxy.

**No era** falta de motor Node ni auth (rol_id=1).

---

## 2 · Fix (prod Report)

| Archivo | Cambio |
|---------|--------|
| `next.config.ts` | `experimental.proxyClientMaxBodySize` + `middlewareClientMaxBodySize` = **32mb** · `serverActions.bodySizeLimit` = **32mb** |
| `PeImportSdrmButton.tsx` | Cronómetro · timeout 280 s · errores HTTP claros · resumen OK en modal |
| `StockProntaEntregaClient.tsx` | Tras OK: `location.assign` (no `router.refresh` pesado que parece colgado) |

API sin cambio de contrato: `mode=replace` · pipeline Node.

---

## 3 · Evidencia local

- Dry-run + replace `sdrm0218`: 11.567 filas · staging/PPD/AM OK · batch **sdrm0218**.  
- Página `:3000/stock-pronta-entrega` batch label **sdrm0218** tras import.

---

## 4 · Qué hace Héctor / Andrés / no tocar

**Héctor:** Importar desde UI en prod o local · Ctrl+F5 tras deploy · CSV `sdrm####.csv`.  
**Andrés (lote):** leer este CHUSAR · subir límites body si su Next ≥15.5.  
**No tocar:** Sales Report · rimec-web sellada · pilares Retail ajenos a PE.

---

## 5 · Shibboleth

Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.
