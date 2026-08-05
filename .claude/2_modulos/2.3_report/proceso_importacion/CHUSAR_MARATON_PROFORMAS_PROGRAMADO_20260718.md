# CHUSAR — Maratón importación proformas PROGRAMADO

**Subcuenta:** **2.3.1.27.1** (hijo etapa importación programados)  
**Etapa:** [ETAPA_IMPORTACION_PROGRAMADOS_20260718.md](../../../4_etapas/ETAPA_IMPORTACION_PROGRAMADOS_20260718.md) · `IMPORTACION-PROGRAMADOS-20260718`  
**Apertura maratón:** 2026-07-18 · Director **Documenta**  
**Estado:** 🟢 **EN CURSO** — Cursor + Director operan en lote  
**Shibboleth:** Andrés, el que viene.

---

## Qué es

Maratón de **severidad bancaria** (~**USD 500.000** estimados): importar **6 facturas proforma PROGRAMADO**, cada una con su **propósito de compra** (IC), **una por una**.

Flujo por cada proforma:

```
1) Alta / inyección IC (como en etapas previas)
2) Matching proforma ↔ IC  (SHOP × BRAND · Admin IC)
3) Import PPD (categoria_id=3) · preview sin error fatal
4) Cuadratura montos · aritmética BD (centavos / Gs.)
5) Smoke · registrar fila en tabla lote
```

**No es** Compra previa ni Pronta entrega. **Prohibido** 1 IC = 1 FI automático.

---

## Ley de precisión (Director · 2026-07-18)

| Regla | Detalle |
|-------|---------|
| **Una por una** | No lote ciego de 6 · cerrar PASS/FAIL de la N antes de abrir N+1 |
| **Matching PF ↔ IC** | Preview SHOP×BRAND · Admin IC vínculo por **monto** |
| **Aritmética** | Totales IC / PPD / FI deben cuadrar · sin redondeos “de pantalla” |
| **Severidad** | Volumen ~USD 500k · cualquier Δ material → STOP + reportar Director |

---

## Apps / rutas (local primero)

| Paso | URL Report `:3000` |
|------|---------------------|
| Hub | `/proceso-importacion` |
| PP detalle · tab Stock | `/proceso-importacion/pedido-proveedor/[ppId]?tab=stock` |
| Admin IC programado | `/proceso-importacion/pedido-proveedor/[ppId]?tab=admin-ic` |
| Panel programado | `/stock-programado` |
| Digitación programado | `/proceso-importacion/digitacion?ramo=programado` |

**APIs:** `POST …/proforma/preview` · `POST …/proforma` · `POST …/proforma/borrar`  
**CLI:** `control_central/scripts/report_import_proforma_pp.py` (`--preview`, `--borrar-import`)

---

## Checklist por proforma (una vuelta — ×6)

| # | Acción | Validación PASS |
|---|--------|-----------------|
| A | **Importar IC** (propósito de compra) — patrón inyección previa | IC en bandeja · `categoria_id=3` · listado/evento OK |
| 0 | PP abierto · ICs vinculadas · listado RIMEC (`precio_evento_id`) | Mismo evento en todas las ICs del PP |
| 1 | Subir `.xls/.xlsx` tab **Stock** | Parser Beira Rio OK |
| 2 | **Preview matching** SHOP × BRAND | Cruce `shop` → `id_cliente` · `brand` → marca IC |
| 3 | Revisar avisos Δ pares / Δ monto | Aviso ≠ bloqueo PPD; cuadrar en Admin IC |
| 4 | **Confirmar import** | PPD `categoria_id=3` · pilares FK · `grades_json._shop` |
| 5 | **Administrador de IC** | FI como CP (cliente × marca × caso) · vínculo manual **monto** |
| 6 | Smoke panel | `/stock-programado` + reposición acordeón PROGRAMADO |
| 7 | Registrar en tabla lote (abajo) | PP · proforma · pares · ICs · montos · PASS/FAIL |

**Prohibido:** `--fi-completa` una sola FI · motor **1 IC = 1 FI** · ignorar columna SHOP · saltar a la siguiente proforma con FAIL abierto.

---

## Protocolo canónico (leer antes de cada lote)

### Intención de compra (alta IC — como antes)

| Doc | Código | Rol |
|------|--------|-----|
| [CHUSAR_INTENCION_COMPRA.md](./CHUSAR_INTENCION_COMPRA.md) | **2.3.1.7.3** | Módulo IC |
| [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md) | **2.3.1.7.3.3** | Inyección Excel batch IC PROGRAMADO |
| [CHUSAR_INYECCION_IC_EJECUCION_20260709.md](./CHUSAR_INYECCION_IC_EJECUCION_20260709.md) | **2.3.1.7.3.3.1** | Ejecución 373 IC (referencia) |
| [INTENCION_COMPRA.md](./INTENCION_COMPRA.md) | — | Inventario funcional |

### Matching proforma ↔ IC · import PROGRAMADO

| Doc | Código | Rol |
|------|--------|-----|
| [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) | **2.3.1.7.5.3.3** | Preview SHOP×BRAND · import PPD |
| [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) | **2.3.1.7.5.3.5** | Matching visual · vínculo por monto |
| [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) | **2.3.1.7.5.3.7** | `_shop` canónico |
| [CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md](./CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md) | **2.3.1.7.5.3.3.3** | Reintento |
| [CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md](./CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md) | **2.3.1.7.5.3.4** | Aritmética 100% BD |
| [DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711](./DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711.md) | **2.3.1.7.5.3.9** | Errores PP-16/17/28 |
| [DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) | **2.3.1.7.5.3.5.3** | Lote Admin IC |

**Pilares:** enriquecimiento no inverso · `politicas-importacion-pilares.mdc`. **Sales Report:** blindado.

---

## Tabla lote maratón — 6 proformas (Director completa)

| # | PP | Proforma Excel | Propósito (IC) | Pares | Monto (USD/Gs) | Preview | Import | Match Admin IC | Smoke | Notas |
|---|----|----------------|----------------|-------|----------------|---------|--------|----------------|-------|-------|
| 1 | **PP-2026-0024** (`id=37`) | 0839 (Beira · pendiente Excel stock) | **79 IC** `0502–0580` · factura `0839/26` | **7932** | Gs. bruto **1.536.720.520** · neto **1.110.557.986** | ⏳ | ⏳ | ⏳ | ⏳ | IC✅ DIGITADO · [CHUSAR_IC_LOTE_0839](./CHUSAR_IC_LOTE_0839_PP24_20260718.md) |
| 2 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | |
| 3 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | |
| 4 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | |
| 5 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | |
| 6 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | |

**Techo estimado maratón:** ~USD **500.000** (orden Director).

---

## Rol Cursor en la maratón

1. **Preview + import** vía UI local o script cuando el Director pase archivo + `ppId`.  
2. **Ante FAIL:** leer `protocolo_errores.md` · no tocar Sales Report blindado.  
3. **Borrar import** solo con protocolo borrar + sin FI CONFIRMADA en venta.  
4. **No deploy prod** salvo cierre etapa u orden directa Director.  
5. **Documenta** solo cuando el Director lo pida — registrar fila en tabla lote arriba.

---

## Pendiente global (fuera maratón · no bloquea import)

| Ítem | App | Estado | Acción |
|------|-----|--------|--------|
| Hotfix catálogo paginación 30 | RIMEC Web `:3001` / prod | 🟡 local OK · prod sin deploy | Orden **despliega** Director |
| Filtros AM latencia | Report + Web | 🟢 optimizado local | Verificar en maratón si no molesta |
| Header marca+estilo URL fantasma | RIMEC Web | ⏳ UX | Limpiar sessionStorage al cambiar mega menú |
| Reposición filtro adicional | Report **2.3.1.26** | ⏸️ pausada | Retomar post maratón |
| Carrito Enrique loop | RIMEC Web | ✅ hotfix `de00d69` + MIG-166 | — |

---

## Cierre maratón (etapa)

Cuando el Director diga **Cierra etapa:** `ETAPA_*_CERRADA.md` + `ACTUAL.md` + `etapas.json` `hecho` + :3004.

---

**Documentación:** 2026-07-18 · Cursor · «documenta lo pendiente … maratón proformas»
