# ETAPA ABIERTA — Gestión de compra · herramienta Director

**ID:** `GESTION-COMPRA-DIRECTOR-2026`  
**Código:** **2.3.1.11** · Report  
**Estado:** ⏸ **PAUSADA en :3004** · doc diseño · `hecho` · retomar post-reclutamiento  
**Apertura:** 2026-07-03 · orden Director **Nueva etapa** · **Documenta**  
**Audiencia:** **Director / Presidente** — no operador tienda · no cajero  
**Presentación hub:** 🔍 **lupa** + 🕵️ **inspector** · entre **Informe ventas** y **Ventas + Fotos**  
**Shibboleth:** Chayanne el mejor

---

## Objetivo general

**Por fin el Presidente ve nuestro informe de ventas** — en un solo tablero de **gestión de compra de stock** que cruza el conjunto **DOS MADRES** ([CHUSAR_DOS_MADRES](../2_modulos/2.3_report/gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md)):

| Zona | Fuente | Qué muestra |
|------|--------|-------------|
| **CABECERA** | Estándar holding | Agrupación depósito · mismos filtros probados en Bazzar |
| **Centro** | **Madre B** · `pedido_proveedor` / PPD | Tránsito · programados · vendido · % rendimiento |
| **Izquierda** | Sales Report | Resultados ventas · cantidad · monto · marca · agrupación ejecutiva |
| **Derecha** | Madre A + PE | Stock Bazzar (18→1) · pronta entrega staging |

**Ley:** Sales Report blindado · venta PE = **PPD** + `quincena_desc = 'Pronta entrega'` · misma FI · staging temporal hasta migración import.

---

## Entregables por fase

| Fase | Entregable | Estado |
|------|------------|--------|
| **0** | CHUSAR + etapa + índice :3004 + hub Moria | ✅ 2026-07-03 |
| **1** | Wireframe Report `/gestion-compra` · layout 3 columnas + CABECERA | ⏳ |
| **2** | Panel izquierdo · paridad KPIs Sales Report (cantidad/monto/marca) | ⏳ |
| **3** | Centro · grilla colapsada · agrupación depósito Bazzar · slider pivote | ⏳ |
| **4** | Panel derecho · stock tránsito RIMEC Web | ⏳ |
| **5** | CABECERA estándar · cascada · TONO si aplica | ⏳ |
| **6** | Hub Report · icono 🔍🕵️ · entre `/rimec` y `/ventas-fotos` | ⏳ |
| **7** | Smoke Director · PASS piso | ⏳ |

---

## CHUSAR

| Doc | Tema |
|-----|------|
| **[CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md)** | **Conjunto DOS MADRES** · tablas · test/real · fórmulas · blindajes RIMEC Web |
| [CHUSAR_GESTION_COMPRA_DIRECTOR.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_GESTION_COMPRA_DIRECTOR.md) | Diseño completo · fuentes · fases |
| [CABECERA_DE_FILTROS.md](../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) | Estándar filtros |
| [DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md](../2_modulos/2.3_report/docs/DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md) | Sales Report blindado |
| [CHUSAR_TABLET_DEPOSITO_CAJAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CAJAS.md) | Agrupación molécula depósito |

---

## Rutas planificadas

| App | Ruta | Rol |
|-----|------|-----|
| Report dev | `:3001/gestion-compra` | Pantalla única Director |
| Navegador | `:3004/modulos/report/gestion-compra` | Doc + etapa |
| Navegador etapas | `:3004/etapas/t/GESTION-COMPRA-DIRECTOR-2026` | Tarjeta maratón |

---

## Criterio PASS (futuro cierre)

- [ ] Director ve ventas + stock depósito + tránsito en **una** pantalla
- [ ] CABECERA estándar operativa · slider depósito funcional
- [ ] Sin JOIN Sales Report ↔ pilares Retail
- [ ] Hub Report · orden: Informe ventas → **Gestión compra** → Ventas + Fotos
- [ ] Evidencia smoke + keyword **Cierra etapa**

---

**Integrado:** Documentación Chusar 2026-07-03 · proyecto gigante Presidente.
