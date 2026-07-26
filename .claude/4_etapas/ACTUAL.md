# ACTUAL — Etapa activa Nexus

**Actualizado:** 2026-07-26 · **Asignación de descuentos PE** (foco)  
**Shibboleth:** Andrés, el que viene.

---

## 🟣 Sesión activa (foco maratón)

| Campo | Valor |
|-------|--------|
| **Code** | `ASIGNACION-DESCUENTOS-PE-20260726` |
| **Módulo índice** | **2.3.1.10.1.4** · Asignación descuentos Stock PE · dictador |
| **Par Web** | **2.2.1.26** · incrustar % · Aprobaciones blanco/sombra · división FI ⏳ |
| **Etapa** | [ETAPA_ASIGNACION_DESCUENTOS_20260726.md](./ETAPA_ASIGNACION_DESCUENTOS_20260726.md) |
| **Chusar** | [CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md) |
| **UI** | `:3000/stock-pronta-entrega` · botón en FILTRO CATÁLOGO RIMEC WEB |
| **Meta** | Pruebas mañana · UI + persistencia + Web |
| **Ley FI** | ✅ PE: N/P/LIQ/COMUN nunca juntas · CP: por caso · ambos: 1 marca · LP03 = +10 % grado 1 |

---

## Ley viva (resumen)

- % entero o decimal (ej. 7.5) · todas las moléculas filtradas  
- Vendedor puede alterar · Aprobaciones pinta si editó  
- **Split PE:** NORMAL · PROMO · LIQ · COMUN → facturas distintas  
- **Split CP:** por caso biblioteca  
- **Marca:** nunca dos marcas en una FI  
- **LP03:** grado 1 = **+10 %**, aparte del % dictado  


---

## 🟢 Checkpoint — Filtros PE · 2/3 hermanos siameses (2026-07-25)

| Campo | Valor |
|-------|--------|
| **Doc** | [CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](../2_modulos/2.2_rimec_web/CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md) (**2.2.1.25**) |
| **Hermano 1** | Report PE **99/99** audit |
| **Hermano 2** | Paridad lógica **5/5 módulos · 6/6 vectores · 100%** |
| **Hermano 3** | Web `:3001` runtime 🟡 ~85% · badges OK · smoke MEDIAS abierto |
| **Siguiente** | [2.2.1.27](../2.2_rimec_web/CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md) · AM diccionario PE + visión general |

---

## Trabajo vivo (`etapas.json`)

| Estado | Code | Índice |
|--------|------|--------|
| **en_curso (foco)** | `ASIGNACION-DESCUENTOS-PE-20260726` | **2.3.1.10.1.4** |
| en_curso | `PE-FINAL-CIERRE-MODULO-20260723` | **2.3.1.9.B.FINAL** |
| en_curso | `RIMEC-WEB-CABECERA-PRECIO-20260723` | **2.2.1.21** |
| en_curso | `IMPORT-CP-CONFECCIONES-638-20260721` | **2.3.1.33** |
| en_curso | `IMPORTACION-PROGRAMADOS-20260718` | **2.3.1.27** |
| en_curso | `LOGISTICA-OK-20260719` | **2.3.1.28** |
| en_curso | `COMPRAS-MASIVAS-5000-20260719` | **2.2.1.0.9** |

---

## 🟢 Deploy Report · 2026-07-26 (`2a18c90`)

| Etapa cerrada | URL prod |
|---------------|----------|
| Listado motor FI | `/proceso-importacion/pedido-proveedor/38?tab=fi` |
| Logística OK | `/logistica-ok` |
| Hiedra PE Report | `/stock-pronta-entrega` |
| PP cierre Carlos | PP-38 |

Doc: [DEPLOY_REPORT_20260726.md](../2_modulos/2.3_report/DEPLOY_REPORT_20260726.md)

**Foco vivo:** `ASIGNACION-DESCUENTOS-PE-20260726` (Web + Aprobaciones pendiente)

---

## Local

| App | URL |
|-----|-----|
| Report | http://localhost:3000/stock-pronta-entrega |
| RIMEC Web | http://localhost:3001 |
| Navegador | http://localhost:3004/etapas |
