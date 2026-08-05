# ETAPA ABIERTA — Importación compra previa · Confecciones (638 Kyly)

**ID:** `IMPORT-CP-CONFECCIONES-638-20260721`  
**Código:** **2.3.1.33** · Report · **COMPRA PREVIA** · proveedor **638** · `tipo_v2_id=2`  
**Estado:** 🟢 **EN CURSO**  
**Apertura:** 2026-07-21 · **Nueva etapa** · **Documenta** · **Documentación Chusar**  
**App:** http://localhost:3000/proceso-importacion · `/rimec?mundo=panel-control` · `/stock-transito` · RIMEC Web `:3001`  
**Doc canónico:** [CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

1. **Importar compra previa confecciones** (Excel `Stock primavera.xlsx` · Kyly **3131** + Milon **1857** prendas · proveedor **638**).
2. **Mismas reglas CP** que calzado (Alejandro Magno · `categoria_id=2` · tránsito Web).
3. **Preparar Panel AM:** sección **Confecciones** en pilar **COMPRA PREVIA** (hoy solo STOCK tiene split calzado/confecciones).
4. **Meta final:** **PROGRAMADO** también dividido calzado/confecciones — AM completo.
5. **Protocolo hermanos siameses** activo (Tipo + Nº preventa Carlos + llegada).

| Avance | Estado |
|--------|--------|
| Etapa + CHUSAR + Portal :3004 | ✅ 2026-07-21 |
| Excel mapeado (`Stock primavera.xlsx`) | ✅ |
| Fotos 638 Storage | ✅ **1323/1323** PASS |
| Import PP unificado preventa **4092** | ✅ PP-49 · 919 PPD · MIG-169/170 |
| Web CP confecciones · dato duro + col J/M | ✅ badge 4092 · `BLUSA · BRANCO` |
| **Pilares CP 638 · filtros Web** | ✅ 919/919 · [CHUSAR_CP638_PILARES_FILTROS_WEB.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_CP638_PILARES_FILTROS_WEB.md) · **2.3.1.33.1** |
| Registro IC (Director) | ✅ IC-0824/0825 |
| Panel CP · bloque Confecciones | ⏳ prep **2.3.1.11** |
| Smoke Web CP (precios · fotos · tallas) | ⏳ **CP-CONF-SMOKE** |
| 460 prendas sin Pedido Externo | ⏳ Director |
| Panel PROGRAMADO · split ramos | ⏳ fase 2 |
| **Cierra etapa** | ⏳ |

---

## Excel · datos clave

| Campo | Valor |
|-------|--------|
| Archivo | `C:\Users\hecto\Downloads\Stock primavera.xlsx` |
| Prendas | **4988** (KYLY **3131** · MILON **1857**) |
| Líneas | 117 · SKU 986 |
| Preventas | 7 + **460 prendas sin Pedido Externo** (bloquear) |

Ver mapa completo en CHUSAR §2.

---

## Alejandro Magno · estado pilares (prod 2026-07-21)

| Pilar | Split calzado/confecciones | Nota |
|-------|:--:|------|
| STOCK | ✅ | Referencia UI (`PeRamoBlock`) |
| COMPRA PREVIA | ❌ | **Caja objetivo** — confecciones Kyly entra aquí |
| PROGRAMADO | ❌ | Meta final etapa posterior |

**Header grilla:** Género → Marca → Estilo → TONO · admin **`/pilares`**.

---

## Sub-etapas

| Código | Foco |
|--------|------|
| `CP-CONF-ALCANCE` | Excel · 7 preventas · hueco 460 prendas |
| `CP-CONF-IC` | Registro IC CP · siameses |
| `CP-CONF-IMPORT-PP` | Proforma → PPD 638 |
| `CP-CONF-PANEL-RAMOS` | API/UI split CP calzado/confecciones |
| `CP-CONF-SMOKE` | Panel + Web + fotos |
| `CP-CONF-PROG-RAMOS` | Prep PROGRAMADO split (fase 2) |

---

## Contexto

| Doc | Rol |
|-----|-----|
| [CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md) | **Canónico etapa** |
| [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) | Tres entidades |
| [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](../2_modulos/2.2_rimec_web/CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) | Siameses |
| [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md) | Visión 3×2 ramos |
| [TRIANGULO_HEADER_PILARES.md](../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md) | Género · TONO |

---

## Criterio de cierre

1. CP confecciones importada · IC+PP+PPD PASS · smoke Director.  
2. Panel CP muestra ramos calzado/confecciones (mínimo KPI).  
3. **Cierra etapa** → `ETAPA_*_CERRADA.md` + `etapas.json` + :3004.

**PROGRAMADO split** puede cerrarse en etapa aparte si Director lo ordena.
