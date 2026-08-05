# PENDIENTES — Inicio día 2026-07-22

**Código:** **4.4.P1** · **Orden:** **Documenta** (Director)  
**Shibboleth:** Andrés, el que viene.  
**Portal:** http://localhost:3004/etapas · **5 tarjetas** en `trabajoVivo` (4 en curso + 1 pausada)

---

## Foco sesión activa — **2.3.1.33** Import CP confecciones 638

**Etapa:** `IMPORT-CP-CONFECCIONES-638-20260721` · **CHUSAR:** [2.3.1.33](../2_modulos/2.3_report/gestion_compra/CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md)

| Hecho ayer | Detalle |
|------------|---------|
| Import unificado | PP **49** · `nro_pedido_externo = 4092` · 919 PPD · 4528 saldo |
| Vista SQL | MIG-**169** grada+LPN · MIG-**170** `numero_preventa` |
| Web `:3001` | Badge **4092 · 2da Sep.** · subtítulo **col J + col M** (`BLUSA · BRANCO`) |
| Scripts | `import_cp4092_primavera_638.mts` · `repair_cp638_descp_material_col_j.mjs` |

| Pendiente | Dueño | Código |
|-----------|-------|--------|
| Smoke catálogo CP confecciones (precios LPC03, fotos, grilla tallas) | Director + Cursor | **2.3.1.33** · `CP-CONF-SMOKE` |
| Panel AM · bloque **COMPRA PREVIA → Confecciones** | Cursor | **2.3.1.11** · `CP-CONF-PANEL-RAMOS` |
| **460 prendas** sin Pedido Externo (101 filas Excel) | Director decide | **2.3.1.33** · `CP-CONF-ALCANCE` |
| PROGRAMADO split calzado/confecciones | fase 2 / etapa aparte | **2.3.1.33** · `CP-CONF-PROG-RAMOS` |
| **Cierra etapa** CP 638 | Director | `protocolo_etapas` + `:3004` |

---

## Paralelo — **2.3.1.7.5.3** Maratón programados

**Etapa:** `IMPORTACION-PROGRAMADOS-20260718` · avance **#3/6** · PP-26 **cerrada** ayer.

| Pendiente | Dónde |
|-----------|--------|
| Smoke tab **FI** PP-26 · descuentos · PDF | `:3000` `/pedido-proveedor/26?tab=fi` |
| **Logística OK** · Publicar PP-26 | cabecera PP-26 · **2.3.1.28** |
| Proforma maratón **#4 de 6** | **2.3.1.7** hub importación |

---

## Paralelo — **2.3.1.28** Logística OK

| Pendiente |
|-----------|
| MIG-167/168 prod si falta |
| Smoke `/logistica-ok` prod |
| **Cierra etapa** cuando PASS |

---

## Paralelo — **2.2** Compras masivas cliente 5000

**Etapa:** `COMPRAS-MASIVAS-5000-20260719` · **PARÉNTESIS EOD** · sin foco hasta orden Director.

---

## Pausada — **2.3.1.26** Reposición filtro adicional

**Etapa:** `REPOSICION-FILTRO-ADICIONAL-20260716` · estado `pausada` en `:3004`.

---

## Referencia rápida BD CP 638

| Campo | Valor |
|-------|--------|
| PP | id **49** · `PP-2026-0029` · preventa **4092** |
| IC | IC-0824 KYLY · IC-0825 MILON |
| Catálogo | 919 filas · `tipo_v2_id=2` |
| Excel | `Stock primavera.xlsx` Hoja3 · col **J** Descripción · col **M** color texto |
