# ETAPA — Motor de Precios → Report · **CERRADA**

> **Superseded by:** [ETAPA_MOTOR_PRECIOS_REPORT_CERRADA.md](./ETAPA_MOTOR_PRECIOS_REPORT_CERRADA.md)  
> **No usar este archivo como estado activo.** Conservado solo como historial de apertura.

**ID:** `ETAPA-MOTOR-PRECIOS-REPORT-20260617`  
**Código plan:** **2.3.1.7.1**  
**Fecha cierre:** 2026-06-22  
**Estado:** ✅ **CERRADA**

---

## Objetivo

Portar el **Motor de Precios** desde Control Central (Streamlit) a **Report** (Next.js NIIF), manteniendo los **dos corazones**:

1. **Biblioteca de casos** — cerebro comercial  
2. **Caso + Excel = Evento** — listado `precio_lista`

Confidencialidad: la operación deja el Streamlit compartido; Report con roles ADMIN/DIRECTOR.

---

## Alcance

| Incluye | Excluye |
|---------|---------|
| Biblioteca · eventos · import Excel | Sales Report `/rimec` (blindado) |
| Cálculo masivo SQL / `precio_lista` | Retail staging masivo (otra subcuenta) |
| UI NIIF en Report | Reescribir pilares desde cero |
| Vincular listado a PP (lectura primero) | `TRUNCATE` biblioteca |

---

## Documentación de arranque

| # | Leer |
|---|------|
| 1 | [motor_precios/INDICE.md](../2_modulos/2.3_report/motor_precios/INDICE.md) |
| 2 | [motor_precios_dos_corazones.md](../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md) |
| 3 | [flujo_fk_eventos.md](../3_arquitectura/3.3_integracion/flujo_fk_eventos.md) |
| 4 | [report/docs/MOTOR_PRECIOS_REPORT.md](../../report/docs/MOTOR_PRECIOS_REPORT.md) |
| 5 | Regla `.cursor/rules/rimec-listado-pp-fi.mdc` |

---

## Subcuentas 2.3.13

| Código | Nombre | Entrega |
|--------|--------|---------|
| 2.3.13.1 | Biblioteca de casos | CRUD / consulta casos |
| 2.3.13.2 | Eventos y listados | Alta evento · estado |
| 2.3.13.3 | Importador Excel | Staging → `precio_lista` SQL |

---

## Criterios de aceptación

- [ ] Ruta Report `/motor-precios` (shell NIIF + login)
- [ ] Listar casos desde `biblioteca_precio` / evento activo
- [ ] Import Excel reproduce flujo Streamlit sin bucle Python por SKU
- [ ] Índice triplete `precio_lista` verificado
- [ ] Doc app + índice Moria al día

---

## Orden agente

> **Ejecuta la OT** · Etapa Motor de Precios Report · código **2.3.13**

Panel: http://localhost:3004/etapas/t/2.3.13

---

**Shibboleth:** Chayanne el mejor
