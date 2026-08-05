# CHUSAR — Bazzar · Operativo (Tablet) vs Administrativo (Report)

**Código:** **2.3.2 + 2.4** · **Puerta única agrupación**  
**Actualizado:** 2026-07-03  
**Deploy prod:** Tablet https://tablet-bazzar.vercel.app · Report https://rimec-report.vercel.app

---

## Regla de oro

| Capa | Producto | Quién | Qué hace |
|------|----------|-------|----------|
| **Operativo** | **Tablet Bazzar** `2.4` | Vendedor · cajero empaque · depósito piso | Venta POS · cadena · depósito fotos · empaque QC |
| **Administrativo** | **Report** `2.3.2` | Gerencia · admin Bazzar · sync | Sync 18 depósitos · caja 6 tiendas · KPIs · handoff bóveda |

**Sales Report RIMEC (`2.3.1.1`) está blindado** — no mezclar con Bazzar.

---

## Mapa ciclo cerrado (ORO)

```
Tablet /cadena/vista  →  COBRAR  →  staging bandeja
        ↓
Report /tablet-bazzar/{tienda}  →  Caja operativa (P-12)  →  CSV / Bobeda
        ↓
Report FacturaLegalBar (serial Activa)  →  Enviar a Empaque (handoff ORO)
        ↓
Tablet /empaque  →  QC P-13  →  ENTREGADO
        ↓
Report card B facturable  →  archivo FACTURADO
```

**Doc trazabilidad:** [MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md](./2.3_report/caja_bazzar/MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md) · **2.3.2.2.10**

---

## A · TABLET BAZZAR — Operativo (`tablet-bazzar/` · `2.4`)

**Repo:** `tablet-bazzar/` · **Puerto dev:** 3000 o 3002  
**Índice Moria:** [2.4_tablet_bazzar/INDICE.md](./2.4_tablet_bazzar/INDICE.md)

### A.1 Módulos por ruta app

| Código | Ruta prod | Módulo | CHUSAR |
|--------|-----------|--------|--------|
| **2.4.1** | `/` | Panel modos | [CONTEXT.md](./2.4_tablet_bazzar/CONTEXT.md) |
| **2.4.2** | `/cadena` | Ventas · cadena consecutiva | [cadena_consecutiva.md](./2.4_tablet_bazzar/cadena_consecutiva.md) |
| **2.4.2.5** | `/cadena/vista` | Filtro TONO | [CHUSAR_TABLET_CADENA_TONO.md](./2.4_tablet_bazzar/CHUSAR_TABLET_CADENA_TONO.md) |
| **2.4.2.6** | `/cadena` | GRADA + grilla entrada | [CHUSAR_TABLET_CADENA_GRADA_GRILLA.md](./2.4_tablet_bazzar/CHUSAR_TABLET_CADENA_GRADA_GRILLA.md) |
| **2.4.2.1** | `/cadena/vista` | Cliente cédula | [CHUSAR_POS_CLIENTE_CEDULA.md](./2.4_tablet_bazzar/CHUSAR_POS_CLIENTE_CEDULA.md) |
| **2.4.2.2** | `/cadena/vista` | Otras tiendas stock | [CHUSAR_OTRAS_TIENDAS_STOCK.md](./2.4_tablet_bazzar/CHUSAR_OTRAS_TIENDAS_STOCK.md) |
| **2.4.2.3** | `/cadena/vista` | Tickets POS · bandeja v2 | [MODULO_POS_BANDEJA_UNICA_V2.md](./2.4_tablet_bazzar/MODULO_POS_BANDEJA_UNICA_V2.md) |
| **2.4.2.3.1** | `/cadena/vista` | Vendedor · staging · CERRAR | [CHUSAR_TABLET_VENDEDOR_STAGING.md](./2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md) |
| **2.4.2.4** | `/empaque` | Empaque · P-13 | [CHUSAR_TABLET_EMPAQUE.md](./2.4_tablet_bazzar/CHUSAR_TABLET_EMPAQUE.md) |
| **2.4.4.1** | ciclo ORO | Bóveda stress | [CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md](./2.4_tablet_bazzar/CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md) |
| **2.4.3** | `/deposito` | Depósito fotos · grid | [CHUSAR_TABLET_DEPOSITO_FOTOS.md](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_FOTOS.md) |
| **2.4.3.4** | `/deposito` | Cajas L+R+mat+color | [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CAJAS.md) |
| **2.4.3.5** | `/deposito` | Vidriera ⭐ | [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](./2.4_tablet_bazzar/CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) |
| **2.4.3.6–8** | `/deposito` | CABECERA · toolbar · grada | [CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md) · [TOOLBAR_PISO](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) · [GRADA_INTEGRIDAD](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md) |
| **2.4.3.9** | tap foto | Fullscreen burbuja | [CHUSAR_TABLET_DEPOSITO_FULLSCREEN_BURBUJA.md](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_FULLSCREEN_BURBUJA.md) |

### A.2 Doc técnico app (`tablet-bazzar/docs/`)

| Doc | Contenido |
|-----|-----------|
| [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md) | **Canónico v2** bandeja única |
| [REGLAS_BANDEJA_UNICA_POS.md](../../../tablet-bazzar/docs/REGLAS_BANDEJA_UNICA_POS.md) | Leyes inviolables |
| [BACKEND_POS.md](../../../tablet-bazzar/docs/BACKEND_POS.md) | SQL titanio · live |
| [P-01_TRES_MODULOS_CICLO_CERRADO.md](./2.4_tablet_bazzar/P-01_TRES_MODULOS_CICLO_CERRADO.md) | Depósito · Venta · Empaque |

### A.3 Etapas abiertas (operativo)

| Código | Etapa | Estado |
|--------|-------|--------|
| **BOVEDA-STRESS-BZZ-2026** | Bóveda stress ORO | 🟢 FOCO |
| **PANEL-CONTROL-CABECERA-2026** | CABECERA tablet | 🟢 PASS piso pendiente |
| **PRUEBA-STOCK-BZZ-2026** | Integridad stock Fase 1 | 🟢 hermana bóveda |

---

## B · REPORT — Administrativo Bazzar (`report/` · `2.3.2`)

**Repo:** `report/` · **Puerto dev:** 3001  
**Índice Moria:** [2.3_report/INDICE.md](./2.3_report/INDICE.md)

### B.1 Depósitos admin (`2.3.2.1`)

**App:** `/depositos-bazzar` · **Prod:** https://rimec-report.vercel.app/depositos-bazzar

| Código | Módulo | CHUSAR |
|--------|--------|--------|
| **2.3.2.1** | Hub 18 depósitos · sync CSV | [depositos/INDICE.md](./2.3_report/depositos/INDICE.md) |
| **2.3.2.1.1** | Admin dinámico stock Hiedra | [CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md](./2.3_report/depositos/CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md) |
| **2.3.2.1.1.2** | Filtros por índice | [CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md](./2.3_report/depositos/CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) |
| **2.3.2.1.1.3** | Vista operativa calzado | [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](./2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) |
| **2.3.2.1.1.4** | Hub tres entes métricas | [CHUSAR_HUB_TRES_ENTES_METRICAS.md](./2.3_report/depositos/CHUSAR_HUB_TRES_ENTES_METRICAS.md) |
| **2.3.2.1.2** | Panel Control (fase 2) | [CHUSAR_PANEL_CONTROL_BAZZAR.md](./2.3_report/depositos/CHUSAR_PANEL_CONTROL_BAZZAR.md) |
| **2.3.2.1.1.5** | Confecciones operativa | [CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md](./2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md) |
| — | Import CSV Hiedra | [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](./2.3_report/depositos/CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) |
| — | Mensajería tablet | [CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md](./2.3_report/depositos/CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md) |

### B.2 Caja Bazzar · 6 tiendas (`2.3.2.2`)

**App:** `/tablet-bazzar` · **Prod:** https://rimec-report.vercel.app/tablet-bazzar

| Código | Módulo | CHUSAR / doc |
|--------|--------|--------------|
| **2.3.2.2.0** | Hub 6 cajas | [00_HUB_SEIS_CAJAS.md](./2.3_report/caja_bazzar/00_HUB_SEIS_CAJAS.md) |
| **2.3.2.2.1–6** | 2100…3200 · cards A/B/C | [caja_bazzar/INDICE.md](./2.3_report/caja_bazzar/INDICE.md) · CAJAS/ |
| **2.3.2.2.7** | P-12 protocolo cajero | [P-12_PROTOCOLO_CAJERO_BOBINA.md](./2.3_report/caja_bazzar/P-12_PROTOCOLO_CAJERO_BOBINA.md) |
| **2.3.2.2.8** | P-13 entregas Bobeda | [P-13_MODULO_ENTREGAS_BOBINA.md](./2.3_report/caja_bazzar/P-13_MODULO_ENTREGAS_BOBINA.md) |
| **2.3.2.2.9** | Flujo P-12/P-13 implementación | [FLUJO_P12_P13_CAJA_BAZZAR.md](../../../report/docs/FLUJO_P12_P13_CAJA_BAZZAR.md) |
| **2.3.2.2.10** | Memoria conexiones internas | [MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md](./2.3_report/caja_bazzar/MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md) |
| **2.3.2.2.12** | Handoff bóveda ORO | [CHUSAR_HANDOFF_BOVEDA_ORO.md](./2.3_report/caja_bazzar/CHUSAR_HANDOFF_BOVEDA_ORO.md) |
| **2.3.2.2.14** | Factura legal · serial turno | [CHUSAR_FACTURA_LEGAL_CAJA.md](./2.3_report/caja_bazzar/CHUSAR_FACTURA_LEGAL_CAJA.md) |
| — | CHUSAR madre caja | [CHUSAR_CAJA_BAZZAR_REPORT.md](./2.3_report/caja_bazzar/CHUSAR_CAJA_BAZZAR_REPORT.md) |

**Cards por tienda (misma estructura):**

| Card | Query | Rol |
|------|-------|-----|
| **A · operativa** | `?mod=operativa` | Bandeja · CSV · Bobeda · handoff |
| **B · facturable** | `?mod=facturable` | Archivo FACTURADO |
| **C · métricas** | `?mod=metricas` | KPIs turno |

### B.3 Matriz tiendas

| cliente_id | Tienda | Depósito venta |
|------------|--------|----------------|
| 2100 | Fernando Adultos | `deposito_1_2100_tienda` |
| 2900 | Fernando Niños | `deposito_1_2900_tienda` |
| 2400 | San Martín Adultos | `deposito_1_2400_tienda` |
| 2700 | San Martín Niños | `deposito_1_2700_tienda` |
| 3100 | Palma Adultos | `deposito_1_3100_tienda` |
| 3200 | Palma Niños | `deposito_1_3200_tienda` |

---

## C · Cruzado obligatorio (agente)

| Tema | Operativo | Administrativo |
|------|-----------|----------------|
| POS bandeja v2 | 2.4.2.3 | 2.3.2.2 · P-12 |
| Empaque P-13 | 2.4.2.4 | 2.3.2.2.8 |
| Bóveda ORO | 2.4.4.1 stress | 2.3.2.2.12 handoff |
| Factura legal | serial en empaque | 2.3.2.2.14 barra caja |
| Depósito stock | 2.4.3 tablet piso | 2.3.2.1 sync Report |
| Imágenes producto | [MODULO_IMAGENES_PRODUCTO.md](./2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md) | — (Control Central tiers) |
| Accesos BZZ | login tablet | [ACCESOS_BZZ_RIMEC_WEB.md](../../../report/docs/ACCESOS_BZZ_RIMEC_WEB.md) |

**Ley visual tablet:** [ESTILO_VISUAL_NIIF_VS_VENTAS.md](./2.4_tablet_bazzar/ESTILO_VISUAL_NIIF_VS_VENTAS.md) — NIIF resto · salón solo Ventas.

---

## D · Deploy producción (2026-07-03)

| Producto | Proyecto Vercel | URL | Comando canónico |
|----------|-----------------|-----|------------------|
| **Tablet** | `tablet-bazzar` | https://tablet-bazzar.vercel.app | `cd tablet-bazzar && npx vercel --prod --yes --project tablet-bazzar` |
| **Report** | **`rimec-report`** ⚠️ | https://rimec-report.vercel.app | `cd report && npx vercel --prod --yes --project rimec-report` |

**⚠️ Report:** proyecto `report` (`report-plum-one.vercel.app`) ≠ funcionarios. Siempre `--project rimec-report`. Ver error [4.02.02.003](../5_errores/detalle/4.02.02.003_vercel-rimec-report-git-no-deploy.md).

---

## E · Navegador holding

| Recurso | Ruta |
|---------|------|
| Árbol módulos | http://localhost:3004/modulos |
| Bazzar Report | http://localhost:3004/modulos/report → grupo **2.3.2** |
| Tablet | http://localhost:3004/modulos/tablet-bazzar |
| Etapas vivas | http://localhost:3004/etapas |

Config: `nexus-navegador-holding/config/arbol-modulos.json` · nodo **2.3.2.0** hub agrupación.

---

*Índice: CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN · Tablet [2.4 INDICE](./2.4_tablet_bazzar/INDICE.md) · Report caja [2.3.2.2 INDICE](./2.3_report/caja_bazzar/INDICE.md) · Depósitos [2.3.2.1 INDICE](./2.3_report/depositos/INDICE.md)*
