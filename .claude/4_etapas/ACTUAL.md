# ACTUAL — Etapa activa Nexus

**Actualizado:** 2026-07-20 · Digitación bandeja `2.3.1.7.4.4` documentada + deploy rimec-report · **PARÉNTESIS compras masivas 5000** + maratón PF + Logística OK en paralelo

---

## 🟢 En curso — PARÉNTESIS · Compras masivas cliente 5000 (foco hoy)

| Campo | Valor |
|-------|--------|
| **Etapa** | [ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md](./ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md) |
| **Code** | `COMPRAS-MASIVAS-5000-20260719` · **2.2.1.17** |
| **Foco** | Stress compra masiva · **solo cliente 5000** · **EOD purge** registros de hoy |
| **Guion** | [CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md](../2_modulos/2.2_rimec_web/CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md) |
| **Pre-flight** | ✅ 0 FI cliente 5000 (2026-07-19) |
| **App** | RIMEC Web `:3001` / https://www.rimec.com.py · Report `:3000` aprobaciones/FI |

### Pendiente inmediato

| # | Qué | Quién |
|---|-----|-------|
| 1 | Ejecutar checklist stress (carrito masivo → confirmar → FI) | Director + Cursor |
| 2 | Validar métricas AM solo 5000 | Director |
| 3 | **EOD:** purge 5000 fecha hoy + **Cierra etapa** | Cursor + Director |

---

## 🟢 En curso — Logística OK (diseño · paralelo)

| Campo | Valor |
|-------|--------|
| **Etapa** | [ETAPA_LOGISTICA_OK_20260719.md](./ETAPA_LOGISTICA_OK_20260719.md) |
| **Code** | `LOGISTICA-OK-20260719` · **2.3.1.28** |
| **Guion** | [CHUSAR_LOGISTICA_OK.md](../2_modulos/2.3_report/logistica_ok/CHUSAR_LOGISTICA_OK.md) |
| **App** | Report `:3000` · `/logistica-ok` |

---

## 🟢 En curso — maratón proformas (paralelo)

| Campo | Valor |
|-------|--------|
| **Etapa** | [ETAPA_IMPORTACION_PROGRAMADOS_20260718.md](./ETAPA_IMPORTACION_PROGRAMADOS_20260718.md) |
| **Code** | `IMPORTACION-PROGRAMADOS-20260718` · **2.3.1.27** |
| **Foco** | Maratón · PP-0024 + PP-0025 (0839) · digitación bandeja acordeón/filtros |
| **Guion** | [CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md) |
| **App** | Report `:3000` / prod · `/proceso-importacion/digitacion` · `/pedido-proveedor/38` |
| **Carry** | [CHUSAR_DIGITACION_BANDEJA_FILTROS_ACORDEON](../2_modulos/2.3_report/proceso_importacion/CHUSAR_DIGITACION_BANDEJA_FILTROS_ACORDEON.md) · multi-asignar `2.3.1.7.4.3` |

---

## ⏸️ Pausada (no cerrada)

| Etapa | Código | Nota |
|-------|--------|------|
| [Reposición filtro adicional](./ETAPA_REPOSICION_FILTRO_ADICIONAL_20260716.md) | `REPOSICION-FILTRO-ADICIONAL-20260716` · **2.3.1.26** | Pausada |

---

## ✅ Cierre documentado reciente

| Etapa | Código | Doc |
|-------|--------|-----|
| Hotfix catálogo precisión | deploy **2.2.1.16** | [CHUSAR_HOTFIX_CATALOGO_PRECISION_BANCARIA_20260719.md](../2_modulos/2.2_rimec_web/CHUSAR_HOTFIX_CATALOGO_PRECISION_BANCARIA_20260719.md) |
| Bazzar Web :3002 | `BAZZAR-WEB-CATALOGO-3002-20260716` · **2.5.1.1** | [CERRADA](./ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md) |

**Portal :3004:** `trabajoVivo` · `COMPRAS-MASIVAS-5000-20260719` (foco) + importación + logística OK

---

## Referencia local

| App | URL |
|-----|-----|
| Report | http://localhost:3000 · `/proceso-importacion` · `/aprobaciones` |
| RIMEC Web | http://localhost:3001 |
| Navegador | http://localhost:3004/etapas |

---

**Shibboleth:** Andrés, el que viene.
