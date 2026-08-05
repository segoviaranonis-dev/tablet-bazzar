# CHUSAR — Traductor vendedor Carlos · PE + veneno CSV

**Código:** 2.3.1.9.F · **Estado:** 🟢 **IMPLEMENTADO 2026-07-27** · JSON canon + resolver Report  
**Shibboleth:** Andrés, el que viene.  
**Padre:** [CHUSAR_FACTURACION.md](./CHUSAR_FACTURACION.md) §6 · [CHUSAR_CSV_VENTAS_PE_CARLOS.md](./CHUSAR_CSV_VENTAS_PE_CARLOS.md) · [DEPOSITO](./CHUSAR_CSV_PE_DEPOSITO_CABECERA_20260804.md) **2.3.1.9.B.3**  
**Hermano traductor:** [CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](../deposito_rimec/CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md) **2.3.1.10.1.1** · [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) **2.3.1.10.1.2**

---

## Conjunto traductores Carlos (mismo nivel · veneno CSV)

Los exports hacia el sistema legal de Carlos aplican **traductores independientes** por columna. Cada uno tiene CHUSAR propio, fuente Excel y código Report.

| Traductor | Código Moria | Fuente Excel | Columna CSV | Estado |
|-----------|--------------|--------------|---------------|--------|
| **COD.GRUPO / Hiedra** | **2.3.1.10.1.1** | `sdrm0849` · biblioteca seed | `ABoCR` · filtros PE | 🟢 parcial · MIG-161 |
| **Grupo uno** | **2.3.1.10.1.2** | 3 Excel PE · NORMAL/PROMO/LIQ | visual PE · D1 | 🟢 diccionario · MIG-180 |
| **Plazo** | 2.3.1.9 · MIG-172 | `Condiciones Hector.xlsx` | `Cod Oper` | 🟢 |
| **Vendedor** | **2.3.1.9.F** (este doc) | `vendedor list.xlsx` · Hoja2 **CODxCASOS** | **`Vendedor`** / `vendedor` | 🟢 **2026-07-27** |

**Regla:** el CSV **no** debe llevar `vendedor_v2.id` Nexus crudo — debe llevar el **código numérico Carlos** según nombre vendedor + caso comercial de la fila.

**Veneno programado / CP:** [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](../proceso_importacion/CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) **2.3.1.7.5.3.4** · usa este traductor en col Vendedor.

---

## 1 · Problema resuelto

| Antes | Ahora |
|-------|-------|
| Col **Vendedor** = `vendedor_v2.id` Nexus (ej. 22) | Col **Vendedor** = código Carlos (ej. **44** para YRMA + CARTERAS) |
| Francis / id crudo en PP programado | `resolveVendedorCarlosParaCsv()` unificado |
| Sin matriz nombre+caso | JSON canon desde Excel Hoja2 |

Carlos rechaza o asigna mal si el vendedor no coincide con su catálogo interno por **caso** (CARTERAS, CALZADOS, etc.).

---

## 2 · Fuente canónica Excel

| Campo | Valor |
|-------|--------|
| **Archivo** | `vendedor list.xlsx` (Director · Downloads) |
| **Hoja** | **Hoja2** · nombre lógico **CODxCASOS** |
| **Clave traducción** | `nombre_vendedor` + `caso_carlos_key` → `codigo_carlos` |
| **Ejemplo** | `YRMA` + `CARTERAS` → **44** |
| **JSON generado** | `report/src/lib/carlos/vendedor-list-canon.json` |

### Alias Nexus → Excel (resolver)

| Nombre Nexus / FI | Canon Excel |
|-------------------|-------------|
| IRMA | YRMA |
| LUIS | LUISLV |
| EDUARDO | EDUARDO ARAUJO G. |

---

## 3 · Implementación Report (2026-07-27)

| Pieza | Ruta |
|-------|------|
| **Resolver** | `report/src/lib/carlos/vendedor-carlos-resolver.ts` |
| **Matriz JSON** | `report/src/lib/carlos/vendedor-list-canon.json` |
| **CSV PP ventas / veneno** | `report/src/lib/pedido-proveedor/csv-ventas-export.ts` |
| **CSV PE ventas** | `report/src/lib/facturacion/csv-pe-ventas-export.ts` |
| **CSV FI** | `report/src/lib/facturacion/csv-fi-export.ts` |
| **Legacy Francis** | `report/src/lib/pedido-proveedor/csv-vendedor-francis.ts` — **deprecated** · delega al resolver |
| **Smoke** | `report/scripts/smoke_vendedor_carlos.mts` — **7/7 PASS** |

### API resolver

```typescript
resolveVendedorCarlosParaCsv(nombreVendedor, casoCarlosKey) → codigo | throw
formatVendedorCarlosLabel(nombre, codigo) → "YRMA(44)"  // UI Logística / bandejas
```

### SQL export

Joins: `vendedor_v2` + `usuario_v2` · nombre desde `VENDEDOR_NOMBRE_SQL` · caso desde fila PPD / evento precio → resolver en build CSV.

---

## 4 · Vendedores pendientes Excel (Director · dejar para después)

Sin fila en Hoja2 → CSV **falla con error claro** al descargar:

| Nombre | Nota |
|--------|------|
| ~~DARIO~~ | ✅ **2026-08-03** · código Carlos **111** (EXTRA Logística) en JSON canon |
| ~~PATRICIA~~ | ✅ **2026-08-03** · código Carlos **101** · **primera venta PE proveedor 638** (KYLY/MILON · Boutique Carmen) |
| RUBEN | Pendiente carga Excel |
| PEDRO | Pendiente carga Excel |

### Primera venta PE **638** (confecciones) — no confundir con **654**

| Hecho | Detalle |
|-------|---------|
| Pedido | **245** · FI **PE-245-001** KYLY · **PE-245-002** MILON · 57 arts |
| Cliente | BOUTIQUE CARMEN (3021) |
| Proveedor | **638** confecciones · **≠ 654** calzado |
| Error UI | `Código de vendedor real no resuelto · vendedor=PATRICIA · caso=BR-VZ-MD-ML-MKA-O` |
| Causa | PATRICIA no estaba en `vendedor-list-canon.json` (CHUSAR §4 pendiente) · caso UI `PE · sdrm2745` cae al **slot Excel default** `BR-VZ-MD-ML-MKA-O` (columna de código, **no** significa mercadería 654) |
| Fix | Alta PATRICIA→**101** · DARIO→**111** · FI PE mantiene `vendedor_id` = **usuario** 41 (PATRICIA) |
| Smoke | `smoke_vendedor_carlos.mts` · PATRICIA + `PE · sdrm2745` → 101 |

### Colisión id 19 (bug Guido · 2026-08-03) — error `4.02.04.004`

| Tabla | id **19** |
|-------|-----------|
| `usuario_v2` | **Guido** (DIOS) |
| `vendedor_v2` | **PATRICIA** |

PE Web guarda en `fi.vendedor_id` el **`id_usuario`** (41 = PATRICIA).  
**Prohibido** pisar con `vendedor_v2.id` (19) — la UI que JOIN solo a `usuario_v2` muestra Guido.

**Ley display (todas las bandejas de facturación + Aprobaciones FI + CSV/PDF):**  
`COALESCE(payload.vendedor_nombre, usuario_v2, vendedor_v2)` — helper `vendedor-fi-display.ts`.

**Superficies alineadas 2026-08-03:** PE · tránsito · bóveda · Aprobaciones · CSV PE · CSV general · CSV/PDF PP · Logística OK (rama FI) · sellado `payload.vendedor_*` en `/api/carrito/confirmar`.

Detalle: `.claude/5_errores/detalle/4.02.04.004_fi-vendedor-id-colision-usuario-vendedor-v2.md`

**Ley Carlos:** en CSV, el slot `BR-VZ-MD-ML-MKA-O` es la columna default del Excel Hoja2 cuando el caso PE no trae PROMO/CARTERAS/etc. **No** reclasifica el pedido como calzado 654. KYLY/MILON = **638**.

---

## 5 · Catálogo Nexus `vendedor_v2` (referencia)

22 filas activas: ADMINISTRACION, ATI, CARINA, … **YRMA (id 22)**. IRMA en operación = alias YRMA.

---

## 6 · Criterios PASS

- [x] JSON canon desde Hoja2 CODxCASOS
- [x] Resolver unificado PE + PP + FI
- [x] Col Vendedor CSV = código Carlos · no id Nexus
- [x] Smoke script 7/7 → ampliado PATRICIA/DARIO PE 638 (2026-08-03)
- [ ] 1 descarga veneno real PP smoke mensual en Carlos
- [x] Completar Excel DARIO / PATRICIA (códigos EXTRA 111/101) · pendiente RUBEN / PEDRO
- [x] Primera venta PE **638** Boutique Carmen — traductor OK · frontera ≠ 654 documentada

---

## 7 · Cruces Moria

| Doc | Uso |
|-----|-----|
| [CHUSAR_CSV_VENTAS_PE_CARLOS.md](./CHUSAR_CSV_VENTAS_PE_CARLOS.md) | PE import · col Vendedor |
| [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](../proceso_importacion/CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) | PP programado · dual CSV |
| [CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](../deposito_rimec/CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md) | Hermano COD.GRUPO · **654 vs 638** |
| [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](../deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md) | Veneno Carlos |

---

**Orden Director:** Documenta · traductor vendedor Carlos · mismo nivel traductor grupos · 2026-07-27.  
**Actualización:** Documenta · primera PE **638** · PATRICIA 101 · 2026-08-03.  
**Actualización:** Documenta · error **`4.02.04.004`** · display unificado bandejas facturación · 2026-08-03.

**CHUSAR — integrado**

- **2.3.1.9.F** · `CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md`
- Error **`4.02.04.004`** · `5_errores/detalle/4.02.04.004_fi-vendedor-id-colision-usuario-vendedor-v2.md`
- Conjunto traductores al nivel **2.3.1.10.1.1** (grupos) · **2.3.1.10.1.2** (grupo uno)
- Índice Facturación §6f · Proceso importación §2.3.1.7.5.3.4 · Depósito RIMEC §1d hermanos
- Frontera **638 ≠ 654** en primera venta PE tipo_v2 (KYLY/MILON)