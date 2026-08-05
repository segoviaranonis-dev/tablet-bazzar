# CHUSAR — RIMEC Web go-live · Compra previa + Pronta entrega

**Código:** **2.2.1.2** · **Etapa:** `RIMEC-WEB-PE-LOCAL-20260706`  
**Ratificado:** 2026-07-12 · plan go-live Director + ejecución Cursor  
**App:** `rimec-web/` · local `:3001` · prod https://rimec-web.vercel.app  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Tres vías de rentabilidad (mapa)

| Vía | Canal de venta / operación | App | Vista / módulo |
|-----|----------------------------|-----|----------------|
| **Compra previa** | Catálogo vendedores | **RIMEC Web** | `v_stock_rimec` · `origen_tipo=TRÁNSITO_PP` |
| **Pronta entrega** | Catálogo vendedores (calzado + confecciones) | **RIMEC Web** | `v_stock_pe_rimec` · `origen_tipo=PRONTA_ENTREGA` |
| **Programado** | Admin IC · stock programado · Panel | **Report** (`:3000`) | **No** se vende en catálogo web |

Ambas ventas Web (CP + PE) desembocan en **Aprobaciones** Report (`/aprobaciones`) → FI / PVR.

Padre estratégico: [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](../2.3_report/gestion_compra/CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md) · Programado vivo: [ETAPA_ADMIN_IC_PP28_PROGRAMADO.md](../../4_etapas/ETAPA_ADMIN_IC_PP28_PROGRAMADO.md).

---

## 2 · Sellado prod (2026-07-12 · Cierra etapa + Despliega)

| Campo | Valor |
|-------|--------|
| Commits | `2cccc0e` (precio PE LPC03→LPN) · `c757dbf` (build tipos + CSS NIIF) |
| **Sello prod vigente** | **`c757dbf`** (reemplaza `f408fc2`) |
| URL | https://rimec-web.vercel.app |
| Flag | `CATALOGO_SOLO_COMPRA_PREVIA = true` — CP blindado; PE solo con pill explícita |
| Build | `npm run build` **PASS** 2026-07-12 |

**Pruebas:** usuario **Héctor Nivel Dios** — FI/PVR de prueba → [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md](./CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md) (revertir **solo** con orden explícita).

---

## 3 · Smoke local 2026-07-12 (PASS)

| Check | Resultado |
|-------|-----------|
| `:3001` / `:3000` arriba | PASS |
| **CP** default — 30 modelos · precios · `+` | PASS |
| **PE calzado** `origen_tipo=PRONTA_ENTREGA&ramo_tipo=CALZADO` — 0 «Precio pendiente PE» · 30 Gs · 30 `+` | PASS |
| **PE confecciones** `ramo_tipo=CONFECCIONES` — igual | PASS |
| `npm run build` | PASS (fix tipos `precioCatalogo` → `PrecioListaRow`) |

**No ejecutado en este smoke (manual Director):** carrito VALIDAR → CONFIRMAR → badge FI en Aprobaciones (flujo ya documentado en [CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](./CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md)).

---

## 4 · Deuda conocida (aceptar o diferir)

| Riesgo | Nota |
|--------|------|
| Latencia API PE | Escaneo `v_stock_pe_rimec` ~20–30 s primera carga |
| Imágenes faltantes | Parte SKU PE sin JPG / `imagen_url` |
| Heurística ramo | Calzado vs confecciones (Kyly 638 / ref K) hasta MIG tipología |
| Token one-shot RPC | Deuda anti-doble confirmar (doc carrito) |

---

## 5 · Archivos clave código

```
rimec-web/
  lib/precioLista.ts          # getPrecioActivoPe
  lib/catalogoFilters.ts      # vista PE vs CP
  lib/catalogoData.ts         # CATALOGO_SOLO_COMPRA_PREVIA
  lib/carritoValidarPe.ts
  app/CatalogoGrid.tsx        # precioCatalogo
  app/components/FiltrosCatalogo.tsx
```

---

## 6 · Criterio cierre etapa / sellado prod

- [x] Smoke catálogo CP + PE calzado + PE confecciones + build
- [ ] Smoke E2E carrito PE → Aprobaciones (Director · prueba Héctor DIOS)
- [x] **Cierra etapa** + `etapas.json` → `hecho`
- [x] Push `main` + smoke prod CP/PE (orden **Despliega**)
- [x] Nuevo commit sellado **`c757dbf`** (reemplaza `f408fc2`)

---

**Documenta:** 2026-07-12 · cierre etapa + despliega · pruebas Héctor DIOS con reversión explícita
