# CHUSAR — RIMEC Web · Cascada filtros catálogo (dimensión + molécula)

**Código:** **2.2.1.42**  
**Fecha:** 2026-08-05 · hotfix **2026-08-06**  
**Keyword:** Documenta · **bug urgente**  
**App:** RIMEC Web `:3001` · catálogo vendedores (MAYORISTA)  
**Prod sellado:** commit `f408fc2` — **sin deploy** hasta cierre etapa u orden directa Director  
**Shibboleth:** Andrés, el que viene.

**Padre:** [CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md](./CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md) (**2.2.1.44**) · [CHUSAR_CATALOGO_CABECERA_FILTROS.md](./CHUSAR_CATALOGO_CABECERA_FILTROS.md) · [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) · [CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](./CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md)

---

## Norte Director

**Todos** los filtros de protocolo CHUSAR en cabecera + sidebar deben tener **dependencia en cascada**: AND entre filas · OR dentro de fila · dimensión acota molécula (Estilo → Línea → Material → Color).

**Síntoma 2026-08-06 (bug urgente):** Marca **ACTVITTA** seleccionada → sidebar **LÍNEA · MULTI · 841** (universo completo). Ausencia total de cascada dimensión → molécula.

---

## Mapa — desconexión (2026-08-06)

| Capa | Pieza | Fallo |
|------|--------|--------|
| 1 | `GET /api/catalogo/filtros` `needRowsScan` | Solo Estilo/Línea/`tipo_grupos` → **Marca / AB-CR / Género / Depósito** no disparaban scan ni `acotarMetaRpcDesdeFilas` |
| 2 | RPC `rimec_catalogo_meta` | Si MIG-199 no acota multi-marca, meta quedaba ancha y nadie la recortaba por filas |
| 3 | `hasSidebarFilters` | Miraba `genero_codigo` singular; sidebar escribe **`genero_codigos`** → `cascadaActiva=false` → `mergeFacet` **acumulaba** universo |
| 4 | UI `cascadaDimensiones` | Sí limpiaba **selecciones** Estilo→Color; **no** achicaba **opciones** (vienen de meta) |

**Flujo roto:** toggle Marca → limpia molécula seleccionada → API meta ancha → sidebar pinta 841 líneas.

**Flujo PASS:** toggle Marca → API scan filas con `marca_ids` → `acotarMetaRpcDesdeFilas` → `todasLineas` solo stock de esa marca → cliente replace (no merge).

---

## Orden canónico filtros (elementos Director)

1. Stock (`origen_tipo`)  
2. Depósito (`deposito_codigo`)  
3. Categoría (`ramo_tipo`)  
4. AB-CR (`tipo_ids`)  
5. Marca (`marca_ids`)  
6. Tipo comercial (`tipo_grupos`)  
7. Género (`genero_codigos`)  
8. Molécula: Estilo → Línea → Material → Color  

---

## Causa raíz previa (2026-08-05)

| # | Pieza | Fallo |
|---|--------|--------|
| 1 | `catalogoMetaRpc.ts` | Dual fetch universo+cascada dejaba facetas completas cuando solo molécula activa |
| 2 | `applyMaestrasTrianguloPilares` | Reemplazaba estilos/géneros desde pilares admin ignorando stock |
| 3 | `rpcParams` MIG-181 | Solo 1 FK — multi-select no acotaba RPC |
| 4 | UI Marca/Género/tipo_grupos | No llamaban `cascadaDimensiones` |
| 5 | API RPC path | `materialFamilias` / `colorFamilias` vacíos · `tipo_grupos` no en SQL RPC |

---

## Fix local

### 2026-08-06 (bug urgente cascada total)

| Archivo | Cambio |
|---------|--------|
| `app/api/catalogo/filtros/route.ts` | `needRowsScan` incluye marca / tipo_ids / género / depósito / tonos / buscar; **siempre** `acotarMetaRpcDesdeFilas` tras scan |
| `lib/catalogoFiltrosEntrada.ts` | `hasSidebarFilters` + `genero_codigos` |
| `app/CatalogoClient.tsx` | Con cascada: replace Estilo/Género (no merge universo) |

### 2026-08-05 (previo)

- Meta RPC una sola llamada acotada · `rpcParamsV199` · intersección maestras ∩ stock · `cascadaDimensiones` en cabecera/sidebar.

### BD — MIG-199

| Archivo | Estado |
|---------|--------|
| `report/migrations/199_rimec_catalogo_meta_multi_cascada.sql` | ✅ **Aplicada** Supabase 2026-08-06 · script `control_central/scripts/aplicar_mig_199_catalogo_meta_multi.py` |
| Evidencia | Firma solo arrays · ACTVITTA **6** líneas vs universo **196** · `PASS_MIG199` · `SMOKE CASCADA OK` |

---

## Smoke

| Script | Resultado |
|--------|-----------|
| `rimec-web/scripts/smoke_cascada_filtros_catalogo.mjs` | ✅ **2026-08-06 post-MIG-199:** SMOKE CASCADA OK |
| Manual `:3001` | ⏳ Marca ACTVITTA → Línea multi N << 841 (validar UI Director) |

---

## Pendiente (cola rimec — no FOCO)

FOCO holding = **Final Bazzar Web**. Cascada rimec queda en cola:

1. ☐ Smoke **browser** cabecera + sidebar (CP · PE · TODOS+Calzado) en `:3001` / prod.  
2. ☐ Confirmar en UI ACTVITTA líneas acotadas (RPC ya OK).  
3. ☐ Si hace falta más código cascada en rimec → OT / orden Director (prod ya tiene lote `bcc476c` + MIG-199).

---

## Archivos tocados

```
rimec-web/app/api/catalogo/filtros/route.ts
rimec-web/lib/catalogoFiltrosEntrada.ts
rimec-web/app/CatalogoClient.tsx
rimec-web/lib/catalogoMetaRpc.ts
rimec-web/lib/catalogoCascadaMolecula.ts
rimec-web/app/components/FiltrosCatalogo.tsx
rimec-web/app/components/CatalogoFiltrosSidebar.tsx
rimec-web/scripts/smoke_cascada_filtros_catalogo.mjs
report/migrations/199_rimec_catalogo_meta_multi_cascada.sql
```

---

## Dev local

| Puerto | App |
|--------|-----|
| `:3001` | RIMEC Web · `npm run dev -- -p 3001` |
