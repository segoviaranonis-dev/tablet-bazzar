# CHUSAR — PP Programado · import proforma · preview totales · caso≠marca

**Código:** **2.3.1.7.5.3.3.7** · **App:** Report · **Ramo:** `categoria_id = 3`  
**Orden Director:** Documenta + despliega · 2026-07-21  
**Caso referencia:** PP-26 (`PP-2026-0017`) · proforma `5436/2026` · biblioteca #8 · CHINELO  
**Relacionado:** [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) · [CHUSAR_PP_TAB_STOCK](./CHUSAR_PP_TAB_STOCK.md) · [CHUSAR_PP_CABECERA_BIBLIOTECA](./CHUSAR_PP_CABECERA_BIBLIOTECA.md) · [CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721](./CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721.md)

---

## Norte (2026-07-21)

El **funcionario** alinea IC↔PF en **Administrador de IC**. El sistema **no** agrupa ICs ni empareja SHOP×marca en preview ni genera FI al importar.

| Fase | Qué hace el sistema | Qué hace el funcionario |
|------|---------------------|------------------------|
| **Preview** | Suma pares IC vs pares proforma · lista grupos SHOP×marca Excel | Verifica totales iguales |
| **Import** | `populatePpFromProforma` — PPD línea por línea + pilares | — |
| **Admin IC** | PF por BCL (cliente×marca real×caso) · Chusa simple v4 | Alineación manual IC↔PF · FI por lote |

---

## Ley R-MARCA-PF-1 (import proforma)

**Caso comercial ≠ marca** en columna Excel **BRAND**.

| Excel BRAND | Acción import |
|-------------|---------------|
| Nombre de **caso** (ej. `CHINELO`, en `precio_evento_caso` / biblioteca) | **No** usar como `id_marca` · tomar `linea.marca_id` (BEIRA RIO, VIZZANO…) |
| Marca real | `marcaLookup` + fallback línea |

**Persistencia PPD:**

- `id_marca` = marca real de línea (post-backfill fuerza `linea.marca_id`)
- `grades_json._brand` = marca real para UI
- `grades_json._brand_excel` = valor original Excel (trazabilidad)

**Código:**

- `resolveMarcaProformaImport` · `resolve-caso-comercial.ts`
- `populatePpFromProforma` · `proforma-programado-engine.ts`
- `provisionPilaresFromProforma` — no pisa `linea.marca_id` si BRAND es caso
- `buildPrefacturaMap` — si PPD trae caso como marca, usa marca de línea (Admin IC)

---

## Preview programado (simplificado)

**Antes (⛔ obsoleto 2026-07-21):** agrupaba ICs por `id_cliente×marca` · mostraba `IC-0411, IC-0410` en una fila · bloqueaba si faltaba match.

**Ahora:**

1. Tabla = solo **grupos SHOP×marca Excel** (SHOP · Marca Excel · Cliente · Pares).
2. **Única puerta paso 2:** `SUM(pares IC vinculadas) === SUM(pares proforma)`.
3. Δ por SHOP / IC agrupadas = **prohibido** — avisos SHOP↔IC eliminados del gate.
4. Pilares×precio_lista = aviso informativo (no bloquea).

**API:** `POST …/pedido-proveedor/[ppId]/proforma/preview`  
**UI:** `PpTabStock.tsx` · botón «1 · Preview totales IC ↔ proforma»

**Respuesta JSON clave:** `totales_ok` · `total_pares_ic` · `n_ic` · `total_pares`

---

## Import confirmado (programado)

**Antes:** fase `ppd` + loop FI automático (`runProgramadoFiLoop`).

**Ahora (2026-07-21):**

```
POST …/proforma  phase=ppd  borrar_previo=1
→ populatePpFromProforma (TS)
→ FIN (sin FI)
→ mensaje: «Alineá IC↔PF en tab Administrador IC»
```

**FI:** solo vía **Administrador de IC** · [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md)

---

## Flujo operativo PP programado (resumen)

```
Digitación IC (98) + biblioteca cabecera (#8)
    ↓
Tab Stock · Excel proforma
    ↓
Preview totales (IC pares = proforma pares)
    ↓
Confirmar import → PPD
    ↓
Tab Administrador IC · alinear IC↔PF · generar FI lote
    ↓
Tab FI · CSV Carlos · aprobaciones
```

**Cirugía IC Excel==BD (opcional, sin digitación):** [CHUSAR_CIRUGIA_IC_EXCEL_PEDIDO_PROVEEDOR](./CHUSAR_CIRUGIA_IC_EXCEL_PEDIDO_PROVEEDOR.md)

---

## Archivos código (deploy)

| Archivo | Cambio |
|---------|--------|
| `proforma-programado-engine.ts` | Preview totales · import marca/caso |
| `resolve-caso-comercial.ts` | `resolveMarcaProformaImport` · `brandEsCasoComercial` |
| `proforma-pilares-provision.ts` | Skip marca desde BRAND si es caso |
| `administrador-ic-query.ts` | PF: marca línea si PPD trajo caso |
| `PpTabStock.tsx` | UI preview + import solo PPD |

**Scripts diagnóstico (local, no prod):** `scripts/_monitor_pp26_proforma_chinelo.mjs`

---

## Deploy

| Campo | Valor |
|-------|--------|
| **App** | rimec-report |
| **Prod** | https://rimec-report.vercel.app |
| **Orden** | Director 2026-07-21 · despliega |
| **Smoke post-deploy** | PP programado · tab Stock preview totales · import PPD · Admin IC PF CHINELO por caso |

---

## Errores evitados

| Síntoma | Causa | Fix |
|---------|-------|-----|
| PF CHINELO una sola partida | `id_marca=CHINELO` desde Excel | R-MARCA-PF-1 import |
| Preview dos IC en una fila | `indexIcsPorClienteMarca` agregaba | Preview solo proforma |
| Import bloqueado por Δ SHOP | Gate `ic_id=0` por marca | Gate solo totales |
| FI mal generadas al import | Loop FI post-PPD | Import solo `phase=ppd` |
| `timeout exceeded when trying to connect` | Pool max=1 + 2ª query durante TX | [CHUSAR_HOTFIX_PP_POOL_DEADLOCK_20260722](./CHUSAR_HOTFIX_PP_POOL_DEADLOCK_20260722.md) · `674b99c` · error `4.02.03.017` |
| `504 FUNCTION_INVOCATION_TIMEOUT` | Re-preview + pilares en TX larga | [CHUSAR_SOLUCION_INTEGRAL](./CHUSAR_SOLUCION_INTEGRAL_PP_PROGRAMADO_IMPORT_20260723.md) · `4.02.03.018` |
| 504 **persiste con lotes 300** | Pilares **todo Excel** en lote 0 | Cola 120 SKUs · slice pilares · `4.02.03.019` · ley **2.3.1.7.5.3.3.10** |

**Matriz completa errores:** [CHUSAR_SOLUCION_INTEGRAL_PP_PROGRAMADO_IMPORT_20260723](./CHUSAR_SOLUCION_INTEGRAL_PP_PROGRAMADO_IMPORT_20260723.md) (**2.3.1.7.5.3.3.9**) · [LEY_IMPORTACION_EXTENSA_COLA_VERCEL](./LEY_IMPORTACION_EXTENSA_COLA_VERCEL.md) (**2.3.1.7.5.3.3.10**)
