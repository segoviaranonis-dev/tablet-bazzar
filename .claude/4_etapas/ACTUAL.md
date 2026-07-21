# ACTUAL — Etapa activa Nexus

**Actualizado:** 2026-07-20 · **Handoff documentado** · **⏸ Esperando Nueva etapa** (Director)
**Doc:** [PRE_NUEVA_ETAPA_20260720.md](./PRE_NUEVA_ETAPA_20260720.md) · [PENDIENTES_HANDOFF_20260720.md](../2_modulos/2.3_report/proceso_importacion/PENDIENTES_HANDOFF_20260720.md) · [RIMEC Web handoff](../2_modulos/2.2_rimec_web/CHUSAR_HANDOFF_PRE_NUEVA_ETAPA_20260720.md)

---

## ⏸ Pre-nueva etapa — sesión 2026-07-20 cerrada en código

| Entrega | Estado código | Smoke prod |
|---------|---------------|------------|
| PP FI encabezado (plazo + desc + vendedor) | ✅ deploy Report | ⏳ |
| Logística OK (`/logistica-ok` + bandera PP) | ✅ deploy `13df3ee`+ | ⏳ |
| CSV general sin duplicados (`4.02.03.015`) | ✅ `e333107` | ⏳ |
| Usuarios **ivan** (=ALFREDO) · **YRMA** (=ATI) | ✅ BD | ✅ |

**Siguiente paso Director:** **Nueva etapa** / **Inicia etapa** con nombre y foco.

---

## 🟡 Incidencias abiertas antes de la próxima etapa

| Incidencia | Estado |
|------------|--------|
| Bug urgente RIMEC Web · Tipo Normal + promo 1395 | ✅ **FIX + deploy** Web `7698eb8` · Report AM `af68346` · `4.01.04.002` · protocolo siamés CHUSAR activo |
| Report local `:3000` | `.next/server/pages/_document.js` terminó con `MODULE_NOT_FOUND`; producción no afectada |

---

## 🟢 En curso — PARÉNTESIS · Compras masivas cliente 5000

| Campo | Valor |
|-------|--------|
| **Etapa** | [ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md](./ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md) |
| **Code** | `COMPRAS-MASIVAS-5000-20260719` · **2.2.1.17** |
| **Pendiente** | Stress carrito → FI · EOD purge · **Cierra etapa** |

---

## 🟢 En curso — Logística OK (paralelo)

| Campo | Valor |
|-------|--------|
| **Etapa** | [ETAPA_LOGISTICA_OK_20260719.md](./ETAPA_LOGISTICA_OK_20260719.md) |
| **Code** | `LOGISTICA-OK-20260719` · **2.3.1.28** |
| **Deploy** | ✅ prod commits `13df3ee` · `46f43c9` |
| **Pendiente** | Smoke prod · MIG prod si falta · **Cierra etapa** |

---

## 🟢 En curso — maratón proformas (paralelo)

| Campo | Valor |
|-------|--------|
| **Etapa** | [ETAPA_IMPORTACION_PROGRAMADOS_20260718.md](./ETAPA_IMPORTACION_PROGRAMADOS_20260718.md) |
| **Code** | `IMPORTACION-PROGRAMADOS-20260718` · **2.3.1.27** |
| **Foco** | PP-0024 + PP-0025 · digitación bandeja |

---

## ⏸ Pausada (no cerrada)

| Etapa | Código |
|-------|--------|
| [Reposición filtro adicional](./ETAPA_REPOSICION_FILTRO_ADICIONAL_20260716.md) | `REPOSICION-FILTRO-ADICIONAL-20260716` |

---

## Referencia local

| App | URL |
|-----|-----|
| Report | http://localhost:3000 · `/aprobaciones` · `/logistica-ok` |
| RIMEC Web | http://localhost:3001 |
| Navegador | http://localhost:3004/etapas |

---

**Shibboleth:** Andrés, el que viene.
