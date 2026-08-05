# CHUSAR — Hub Depósitos · tres entes · import · vendido

**Subcuenta:** **2.3.2.1.1.4** · padre **2.3.2.1.1** Panel Depósito Hiedra  
**Etapa:** 🟢 [ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO.md](../../../4_etapas/ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO.md)  
**Ratificado:** Director · 2026-06-30  
**Estado:** ✅ **UI + API + MIG-131** · vendido sube cuando tablet resta `cantidad`

**Relacionado:** [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](./CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) · [INDICE.md](./INDICE.md) · [doc app](../../../../report/docs/HUB_DEPOSITOS_BAZZAR.md)

---

## Qué es

La pantalla **`/depositos-bazzar`** dejó el grid plano de 6 cards y pasó a un **hub por tres entes físicos** (Fernando · San Martín · Palma). Cada ente muestra sus tiendas operativas con stock por ramo (calzado / confecciones) y, desde Hiedra 2.3.2.1.1.4, **trazabilidad del último import** y **unidades vendidas** desde ese import.

| URL local | http://localhost:3001/depositos-bazzar |
| URL prod | https://rimec-report.vercel.app/depositos-bazzar |

---

## Layout UI

```
┌─ FERNANDO ─────────────┬─ SAN MARTIN ───────────┬─ PALMA ────────────────┐
│ Adultos 2100           │ Adultos 2400           │ Tienda única 3100      │
│ 📅 Import · lote       │ …                      │ calzado adultos/niños  │
│ 🛒 vendido · importadas│                        │ + confecciones         │
│ [Abrir] ramos calzado  │                        │                        │
│ Niños 2900 (+ conf.)   │ Niños 2700             │                        │
└────────────────────────┴────────────────────────┴────────────────────────┘
Toggle: TIENDA · GUARDADO · AVERIADO
Import: «Importar 3 CSV» (global) o «Importar CSV» (ente restringido)
```

| Control | Comportamiento |
|---------|----------------|
| Columnas 3 entes | `HUB_ENTES` en `depositos-config.ts` · Palma = tienda única 3100 |
| Toggle categoría | `?categoria=tienda\|guardado\|averiado` |
| Header | Total calzado · total uds · total vendido (si > 0) · «import CSV POS» |
| Tarjeta tienda | Cliente · uds calzado/conf. · **fecha import** · **lote** · **vendido** · chips ramo |
| Import CSV | `ImportCsvDepositoButton` · recarga hub al terminar |

**Código UI:** `report/src/app/depositos-bazzar/DepositosHubClient.tsx`  
**Página:** `report/src/app/depositos-bazzar/page.tsx`

---

## API hub

| Método | Ruta | Respuesta clave |
|--------|------|-----------------|
| GET | `/api/depositos/hub?categoria=` | `entes[]` → `tiendas[]` con stats por ramo + meta import |

Campos por tienda (`HubTiendaStats`):

| Campo | Significado |
|-------|-------------|
| `calzado.uds` / `confeccion.uds` | Saldo vivo (`cantidad > 0`) por `tipo_v2_id` |
| `pares_total` | Suma saldo todos los ramos |
| `registros` | Filas con stock > 0 |
| `fecha_importacion` | ISO8601 · `MAX(created_at)` del depósito |
| `batch_label` | Lote CSV (ej. `sdfm4708`) del último timestamp |
| `uds_importadas` | `SUM(COALESCE(cantidad_importada, cantidad))` |
| `uds_vendidas` | `SUM(GREATEST(cantidad_importada − cantidad, 0))` |

**Código API:** `report/src/app/api/depositos/hub/route.ts`

Acceso: sesión Report · entes visibles vía `hubEntesVisibles(acceso)` (`depositos-acceso.ts`).

---

## Columna `cantidad_importada` (MIG-131)

Trazabilidad **import vs venta POS** sin duplicar histórico en bóveda.

| Momento | `cantidad_importada` | `cantidad` |
|---------|---------------------|------------|
| Import CSV REPLACE | = unidades del CSV | = mismo valor |
| Venta tablet (decremento) | **no cambia** | resta |
| Nuevo import REPLACE | se resetea al nuevo CSV | = nuevo stock |

**Migración:** `report/migrations/131_deposito_cantidad_importada.sql`  
**Aplicar:** `node scripts/aplicar_migracion_131.mjs` (obligatorio en Supabase prod antes de deploy)

Writers:

| Flujo | Archivo |
|-------|---------|
| Import CSV bulk | `bazzar-csv-bulk-import.ts` |
| Sync Retail tienda | `api/depositos/sync/route.ts` |

**Histórico ventas fiscal:** sigue en `bobeda_venta_pos` — intocable. El hub muestra **delta operativo** desde último lote, no reemplaza bóveda.

---

## Reglas de lectura

1. **Vendido hub = 0** justo después de import REPLACE (snapshot = saldo).
2. **Vendido sube** cuando exista decremento de `cantidad` en filas con `cantidad_importada` fijada.
3. **Re-import REPLACE** reinicia el ciclo (nuevo `created_at` · nuevo lote · vendido vuelve a 0).
4. **Sync Retail** también fija `cantidad_importada = cantidad` — mismo modelo.
5. Si MIG-131 no está aplicada, API devuelve fecha/lote pero `uds_vendidas = 0` (fallback).

---

## Ratificación lote 4708 · evidencia hub (2026-06-28)

Import global **3 CSV** · categoría **TIENDA** · header hub: **40.966 uds calzado · 47.847 total · 6 vendido**.

| Ente | Tarjeta | `batch_label` | Saldo hub | Notas |
|------|---------|---------------|-----------|-------|
| Fernando | Adultos 2100 | `sdfm4708` | 9.185 calz · 6.359 filas | 9.188 import · **3 vendido** |
| Fernando | Niños 2900 | `sdfm4708` | 2.975 calz · 3.296 conf · 5.083 filas | 6.266 import |
| San Martín | Adultos 2400 | `sdsm4708` | 16.276 calz · 11.078 filas | 3 vendido |
| San Martín | Niños 2700 | `sdsm4708` | 3.122 calz · 2.685 conf | 5.807 uds |
| Palma | Tienda 3100 | `sdpl4708` | 6.066 calz adultos · 3.342 niños · 900 conf | 10.308 import |

**Relación CSV Fernando:** columna `S00_D1` → tarjeta Adultos · `S00_NINHOS` → tarjeta Niños · `S00_D2` → toggle **GUARDADO** (no visible en captura TIENDA). Mapa: [MAPA_CSV_SDFM_DEPOSITO_FERNANDO.md](../../../../report/docs/MAPA_CSV_SDFM_DEPOSITO_FERNANDO.md).

---

## Código — mapa rápido

| Pieza | Ruta |
|-------|------|
| Config hub entes | `report/src/lib/depositos/depositos-config.ts` |
| Hub client | `report/src/app/depositos-bazzar/DepositosHubClient.tsx` |
| Hub API | `report/src/app/api/depositos/hub/route.ts` |
| Import UI | `ImportCsvDepositoButton.tsx` |
| Acceso ente | `report/src/lib/depositos/depositos-acceso.ts` |

---

## Pendiente (no bloquea hub)

| Tema | Estado |
|------|--------|
| Preview CSV antes de import | 📋 fase 1.3d |
| Redirect adultos/niños por GRUPO | 📋 fase 1.3d |
| Análisis tab `vendido` desde tickets | 📋 · hoy placeholder 0 en `/analisis` |
| Decremento stock POS en tablet | ⏳ integración · hub listo para reflejarlo |

---

**Documentación Chusar — Hiedra Venenosa · hub métricas · 2026-06-30**

**Shibboleth:** Chayanne el mejor. CHUNA activo · Moria + ACTUAL acatados.
