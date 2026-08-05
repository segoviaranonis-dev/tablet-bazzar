# CHUSAR — Pendientes consolidados · handoff Cursor · 2026-07-14

**Código:** **2.2.1.0.7**  
**Estado:** 📋 Handoff activo · esperando **Nueva etapa** Director  
**Keyword:** **Documenta** (2026-07-14)  
**Workspace:** `C:\Users\hecto\Nexus_Core` · `:3001` · `:3000` · `:3004`  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Resumen ejecutivo

| Ámbito | Estado | Prioridad Director |
|--------|--------|-------------------|
| Catálogo latencia T1–T7 | Deploy prod OK · cierre formal pendiente | Media |
| Filtro 👕 Confecciones `:3001` | **Fix local PASS build** · **sin prod** | Alta (validar visual) |
| Imágenes PE 638 Kyly | **94,4%** protocolo 4 tiers · **147** sin JPG origen | Alta (lote Director) |
| **Listado PP MIG-150** (`:3000`) | BD + UI dos botones OK · **smoke Todos!!!** · **deploy Report ⏳** | Alta (ops precios) |
| **Botón DIOS Anular+reintegrar FI** | Spec **2.3.1.9.C** Documenta · **OT implementar** | Alta (nueva etapa) |
| **Herramienta reposición AM** | **2.3.1.22** Documenta · código v1 local · smoke visual + deploy ⏳ | Alta (AM) |
| Día operativo 13-07 | 3 tracks abiertos | Según nueva etapa |
| Protocolo Excel global | Pedido verbal · **sin diseño sellado** | Solo con Nueva etapa |
| Prod sellado | Deploy solo cierre u orden directa | Inviolable |

---

## 2 · RIMEC Web `:3001` — fix filtro Confecciones (local)

**Doc detalle:** [CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md](./CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md) (**2.2.1.0.6**)

### Hecho (código local · build OK 2026-07-14)

| Bug | Fix |
|-----|-----|
| Meta Todos mezclaba marcas CP calzado + PE | `catalogoMetaRpc.ts` — Confecciones = solo RPC PE |
| Memoria dejaba pasar CP en Confecciones | `catalogoFilters.ts` — excluye TRÁNSITO_PP |
| Paginación dual escaneaba CP innecesario | `catalogoPaginado.ts` — Confecciones = solo `v_stock_pe_rimec` |
| sessionStorage heredaba línea/marca calzado | `FiltrosCatalogo.tsx` — reset cascada al togglear categoría |

### Pendiente

- [ ] **Smoke visual Director:** `/?origen_tipo=TODOS&ramo_tipo=CONFECCIONES` → marcas **Kyly · Milon · RIMEC** · contador > 0.
- [ ] Hard refresh o borrar `sessionStorage` clave `rimec_catalog_shared_filters_v1` si persiste vacío.
- [ ] **Deploy prod** con cierre etapa u orden **Despliega** explícita (commit local aún no en Vercel post-fix).

### Scripts auditoría

```
rimec-web/scripts/audit_filtro_confecciones_3001.mjs
rimec-web/scripts/audit_pe_tipo2_protocolo_3001.mjs
```

---

## 3 · Imágenes dual 654/638 — PE confecciones (tipo_v2=2)

**Doc:** [CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md](../2.1_control_central/docs/CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md) (**2.01.04.022**)

### Auditoría `:3001` · 2026-07-14

| Métrica | Valor |
|---------|-------|
| Filas vendibles PE `tipo_v2_id=2` | 6.225 |
| Moléculas foto únicas `linea_color` | 2.646 |
| Naming 638 (underscore) | 100% |
| **Storage 4 tiers PASS** | **2.499 / 2.646 (94,4%)** |
| UI thumb sm/ HEAD 200 | 2.508 / 2.646 (94,8%) |
| **Gap sin origen** | **~147 stems** |

### Pendiente imágenes

- [ ] Director aporta **135–147 JPG** origen Kyly (lista canónica abajo).
- [ ] Subir con `control_central/tools/subir_carpeta_import_batch.py` o `retry_pe638_gaps.py`.
- [ ] Re-auditar hasta **100%** moléculas vendibles con 4 tiers.

**Lista sin origen:**

- `tablet-bazzar/docs/evidencia/PE638_SIN_ORIGEN_20260713_164055.md`
- `.csv` y `.json` mismo prefijo

**Evidencia inyección previa:**

- `PE638_LOOP_DONE_20260713_211150.json` — 2.511/2.646 PASS loop
- `PE638_RETRY_20260713_173840.json` — 276/276 retry OK

---

## 4 · Etapa catálogo latencia (`CATALOGO-LATENCIA-20260713`)

**Doc etapa:** [ETAPA_CATALOGO_LATENCIA_20260713.md](../../4_etapas/ETAPA_CATALOGO_LATENCIA_20260713.md)  
**CHUSAR deploy:** [CHUSAR_CATALOGO_LATENCIA_T2T7_DEPLOY_20260714.md](./CHUSAR_CATALOGO_LATENCIA_T2T7_DEPLOY_20260714.md)

### Pendiente cierre

- [ ] Smoke **prod** visual post-deploy (pills · PE grada · Todos fusión · carrito PE).
- [ ] Keyword **Cierra etapa** → `ETAPA_*_CERRADA.md` + `ACTUAL.md` + **`nexus-navegador-holding/config/etapas.json`** (`hecho`).
- [ ] Integrar fix Confecciones (**§2**) en commit de cierre si Director valida local.

### Deuda técnica documentada (no bloqueante)

| Código | Tema | Estado |
|--------|------|--------|
| CAT-LAT-T4 | Vista unificada Todos · RPC paginada por tarjeta | Parcial · OT futura |
| CAT-LAT-T6 | Header unificado · ramo SQL CP | Parcial |

---

## 5 · Día operativo 13-07 (`DIA-OPERATIVO-20260713`) — pausada

**Doc:** [ETAPA_DIA_OPERATIVO_20260713.md](../../4_etapas/ETAPA_DIA_OPERATIVO_20260713.md)

| Track | Pendiente |
|-------|-----------|
| **1** Sync Excel ↔ stock PE real | Import batch · verificar D1/DEP2/D3 |
| **2** IC ↔ PP · CSV | Retomar PP PROGRAMADO · descarga CSV |
| **3** E2E cliente 5000 | Compra PE → web → Bazzar → **reversión** |

Cierre: tres tracks PASS + reversión 5000 verificada.

---

## 5b · Report `:3000` — vincular listado MIG-150 (hotfix precios)

**Docs:** [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](../2.3_report/proceso_importacion/CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) · [PENDIENTES_HANDOFF_20260714.md](../2.3_report/proceso_importacion/PENDIENTES_HANDOFF_20260714.md)

### Hecho

- MIG-150 en BD (`p_incluir_vendidos`) · Python + API + `PpTabStock` dos botones.
- **Solo tránsito** · **Actualizar precios de venta Todos!!!** (PPD 100% vendidas).

### Pendiente

- [ ] Smoke Vincular → **Todos!!!** en PP **ABIERTO** real.
- [ ] **Deploy Report** — cierre etapa u orden **despliega**.
- [ ] Streamlit paridad / UI Recalcular FI dos modos — opcional.
- [ ] Protocolo global «Activar importación Excel» — **no inventar** hasta etapa.

### Hotfixes rimec-web ya en prod (no reabrir)

| Tema | Commit |
|------|--------|
| Carrito precio 0 | `b6159e8` |
| Catálogo doble resta saldo | `0893156` |

---

## 5c · Botón DIOS · Anular FI + reintegrar stock (**2.3.1.9.C**)

**Doc:** [CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md](../2.3_report/facturacion/CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md)

- Facturación PE + tránsito + Aprobaciones (RESERVADA).
- FI **entera** · anula → **Anulaciones** · reintegra stock sin mirar Excel.
- Solo Nivel Dios · **OT implementación pendiente**.

---

## 6 · Reglas operativas (agente entrante)

1. **Memoria sagrada** — solo lectura salvo keyword exacta Director.
2. **Deploy prod** — solo cierre etapa canónico u orden directa Héctor.
3. **Sales Report** blindado — no pilares.
4. **Shibboleth** — primera línea: **Andrés, el que viene.** CHUNA activo · Moria + ACTUAL acatados.
5. **Cierre turno** — `Listo para tu orden.` + **💰 COSTO** + `Terminal:` honesto.

**Puerta única:** [PROTOCOLO_INGRESO_AGENTE_CHUNA.md](../../1_fundamentos/1.1_protocolos/PROTOCOLO_INGRESO_AGENTE_CHUNA.md)

---

## 7 · Mapa apps locales

| Puerto | App | Foco actual |
|--------|-----|-------------|
| **3001** | RIMEC Web | Catálogo CP+PE · fix Confecciones local |
| **3000** | Report | IC · PP · stock PE · motor precios |
| **3004** | Navegador holding | Etapas · NEW badges · cierre JSON |

---

## 8 · Próximo paso esperado

Director abrirá **Nueva etapa** en el próximo turno. Agente debe:

1. Leer este handoff + `ACTUAL.md` tras keyword etapa.
2. Confirmar shibboleth + alcance en una línea.
3. Ejecutar sin pedir permiso por cada archivo rutinario (`director-autonomia-cursor.mdc`).

---

**Integrado:** 2026-07-14 · Cursor Auto · handoff pre-nueva-etapa
