# ETAPA ABIERTA — Compras masivas · stress test cliente 5000

**ID:** `COMPRAS-MASIVAS-5000-20260719`  
**Código:** **2.2.1.17** · RIMEC Web + Report FI · cliente prueba  
**Estado:** 🟢 **EN CURSO** · **PARÉNTESIS** del día 2026-07-19  
**Apertura:** 2026-07-19 · orden Director · estresar compra masiva  
**App:** http://localhost:3001 · http://www.rimec.com.py  
**Cliente:** `cliente_v2.id_cliente = 5000` · **Bazzar.py**  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

| Meta | Detalle |
|------|---------|
| **Stress** | Compras masivas CP + PE · carrito grande · confirmar · FI · métricas AM |
| **Aislamiento** | **Solo cliente 5000** · no tocar otros clientes · **Sales Report blindado** |
| **PARÉNTESIS** | Prueba de un día · **al cierre EOD** borrar todo lo generado hoy con 5000 |
| **No bloquea** | Maratón importación programados · Logística OK siguen en paralelo |

---

## Pre-flight (✅ 2026-07-19)

| Check | Resultado |
|-------|-----------|
| FI cliente 5000 | **0** (`diag_cliente_facturas.mjs 5000`) |
| Purge previo | 2026-07-16 · [CHUSAR_CLIENTE_5000_PRUEBAS.md](../2_modulos/2.2_rimec_web/CHUSAR_CLIENTE_5000_PRUEBAS.md) |
| Catálogo prod | Hotfix **2.2.1.16** · www.rimec.com.py |

---

## Guion operativo

Ver [CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md](../2_modulos/2.2_rimec_web/CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md) (**2.2.1.17**).

---

## Cierre EOD (obligatorio hoy)

1. Auditoría FI/PVR **fecha = 2026-07-19** · `cliente_id = 5000`.  
2. `node report/scripts/purge_cliente_5000_pruebas.mjs --dry-run` → luego sin `--dry-run`.  
3. Re-diagnóstico → **0 FI** · carrito localStorage limpio.  
4. Director dice **Cierra etapa** → protocolo completo + `etapas.json`.

---

## Contexto paralelo (no pausado)

| Etapa | Code | Nota |
|-------|------|------|
| Importación programados | `IMPORTACION-PROGRAMADOS-20260718` · **2.3.1.27** | 🟢 maratón PF |
| Logística OK | `LOGISTICA-OK-20260719` · **2.3.1.28** | 🟢 diseño |

---

## Docs

| Doc | Rol |
|-----|-----|
| [CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md](../2_modulos/2.2_rimec_web/CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md) | Checklist stress + EOD |
| [CHUSAR_CLIENTE_5000_PRUEBAS.md](../2_modulos/2.2_rimec_web/CHUSAR_CLIENTE_5000_PRUEBAS.md) | Reglas aislamiento **2.2.1.0.9** |
| [CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md](../2_modulos/2.2_rimec_web/CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md) | Reversión puntual PVR |
| [CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md) | Cruce Alejandro Magno |

---

## Criterio de cierre

1. Stress ejecutado (Director valida en navegador).  
2. **EOD purge** → 0 registros 5000 del día.  
3. `etapas.json` → `hecho` + Moria CERRADA.
