# CHUSAR — Hotfix pool deadlock · Confirmar import PP · Logística OK

**Código:** **2.3.1.7.5.3.3.8**  
**App:** Report · **Ramo:** programados (`categoria_id = 3`)  
**Orden Director:** Bug urgente!! · resuelto · **Documenta** 2026-07-22  
**Error:** `4.02.03.017`  
**Relacionado:** [CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721](./CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721.md) · [EMAXCONN pool](../../../report/docs/EMAXCONN_SOLUCION_INTEGRAL.md) · [CHUSAR_ADMIN_IC_PP26](./CHUSAR_ADMIN_IC_PP26_LOTE_FI_20260721.md) § pool max=1

**Shibboleth:** Andrés, el que viene.

---

## Resumen

Hotfix **crítico** en prod: el botón «Confirmar import programado» y la bandera Logística OK colgaban con `timeout exceeded when trying to connect`. Causa: **deadlock del pool Postgres max=1** en Vercel al pedir una 2ª conexión mientras la transacción tenía la única conexión ocupada.

---

## Cadena de commits

| Commit | Alcance |
|--------|---------|
| `1ec8536` | Cabecera PP en FormData antes import · errores HTTP legibles · invalidación caché UI |
| `2af40a7` | Reintentos pool + retry UI Logística *(insuficiente)* |
| **`674b99c`** | **Causa raíz:** secuencializar prefetch y post-audit fuera de TX |

**Deploy prod:** manual Vercel ● Ready · alias `https://rimec-report.vercel.app` · `dpl_GLtGvT144orLfuJRQgqPoL9XX9Rz`

---

## Ley pool Vercel (no regresión)

```
Vercel + max=1:
  ✅ prefetch con pool.query() SIN client.connect() previo
  ✅ TX: connect → BEGIN → queries en client → COMMIT → release
  ✅ post-work: pool.query() DESPUÉS de release
  ⛔ NUNCA pool.query() paralelo mientras client.connect() abierto
```

Aplica igual que Admin IC lote FI (`9c80337`) y hotfix 504 (`4.02.03.018`).

**Matriz integral:** [CHUSAR_SOLUCION_INTEGRAL_PP_PROGRAMADO_IMPORT_20260723](./CHUSAR_SOLUCION_INTEGRAL_PP_PROGRAMADO_IMPORT_20260723.md)

---

## Archivos tocados

| Archivo | Rol |
|---------|-----|
| `src/lib/pedido-proveedor/proforma-programado-engine.ts` | Import PPD programado |
| `src/lib/logistica-ok/sync-pp.ts` | Publicar Logística OK |
| `src/app/.../PpTabStock.tsx` | UI import + overlay |
| `src/lib/pedido-proveedor/pp-detalle-ui-cache.ts` | `clearPpDetalleCache()` |

---

## Smoke local (repetible)

```bash
cd report
npx tsx scripts/_smoke_pool_deadlock_pp.mjs 32
```

Esperado: `patron_viejo` deadlock=true · resto PASS sin timeout.

---

## Flujo operativo post-fix

```
Tab Stock · preview totales
    ↓
Confirmar import (phase=ppd) — esperar overlay
    ↓
Tab Administrador IC · alinear · generar FI
    ↓
Tab FI · CSV / aprobaciones
    ↓
Logística OK · Publicar (solo con FI)
```

---

*Índice módulo: **2.3.1.7.5.3.3.8** · [INDICE](./INDICE.md)*
