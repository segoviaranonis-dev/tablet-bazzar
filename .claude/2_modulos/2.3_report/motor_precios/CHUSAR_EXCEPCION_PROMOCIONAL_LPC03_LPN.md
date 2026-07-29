# CHUSAR — Excepción PROMOCIONAL · LPN = LPC03 = LPC04

**Código:** **2.3.1.7.1.0.1** · **Ratificado:** Director · 2026-07-07 · **Ampliado Documenta:** 2026-07-15 (LPC04 = LPN)  
**Relacionado:** [CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md](./CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md) · Corte RIMEC Web [CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md](../../2.2_rimec_web/CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md) (**2.2.1.0.11**)  
**Shibboleth:** Andrés, el que viene.

---

## Norte

**Caso** = estrategia comercial (índice contribución). **LP** = política de venta del cliente.

| Tier | Nombre | Regla habitual |
|------|--------|----------------|
| 1 | **LPN** | Precio base (más habitual) |
| 2 | **LPC02** | Solo un caso específico *(pendiente doc aparte)* |
| 3 | **LPC03** | **Default** · LPN + 12% |
| 4 | **LPC04** | Casos especiales · LPN + 20% |

**PROMOCIONAL** = menor margen de contribución (`genera_lpc03_lpc04 = false`). Solo tiene **LPN** — no se generan LPC02/LPC03/LPC04 en motor.

**Cascada descuento (2026-07-29):** PROMOCIONAL **no** recibe Grado 1 LP03 (+10 %) aunque el cliente compre con lista LPC03 — [CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md](../deposito_rimec/CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md) (**2.3.1.10.1.4.4**).

---

## Problema 1 — caso referencia (RIMEC Web · julio 2026)

**Contexto:** Vendedor activa venta · cliente con política **LPC03** · quincena «1ra Quincena de Julio».

| Tarjeta | Marca | L+R | Caso | LPC03 en catálogo |
|---------|-------|-----|------|-------------------|
| ✅ OK | MODARE | **7378 · 223** | Caso con tiers | **Gs. 224.600** |
| ❌ Fallo | MODARE | **7401 · 102** | **PROMOCIONAL** | **Precio pendiente de vinculación** / sin LPC03 |

**Causa:** `getPrecioActivo(lista=3)` lee `lpc03` NULL · `lpn` existe pero no se usa para tier 3.

**Evidencia visual:** captura Director 2026-07-07 — tarjeta 7378 con precio vs 7401 con banner amarillo pendiente.

---

## Solución ratificada (Director)

**Excepción única — caso `PROMOCIONAL` (Director 2026-07-15):**

```
LPN = LPC03 = LPC04    (igualdad · NO aplicar +12% ni +20%)
```

**Redondeo:** cada tier pasa por **centena próxima** — ver [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](./CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (**2.3.1.7.1.0.2**). Ej.: LPN 128.300 → LPC03 promo **128.300** (no 143.700).

**Por qué:** el promocional **ya es** el piso de precio. Sumar 12%/20% contradice la estrategia. El cliente con política LPC03 o LPC04 debe **ver y comprar** a LPN.

*(Nota: bloque anterior decía «sin +12%» — se mantiene; centena aplica igual.)*

**RIMEC Web (local):** aritmética en `precioLista.ts` · redondeo **centena próxima** [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](./CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (**2.3.1.7.1.0.2**) · PPD `apply_ley_precios_rimec_web_ppd` · precio por lote bajo badge de pares.

**Prohibido:** aplicar la excepción a otros casos con `genera_lpc03_lpc04=false` salvo que el Director lo nombre — hoy solo **PROMOCIONAL**.

---

## Implementación

| Capa | Acción |
|------|--------|
| **Motor SQL** | `calcular_precio_lista_evento_sql` — rama PROMOCIONAL → `lpc03 = lpn` |
| **Motor Python** | `logic.py` · `calcular_precios_caso` — misma regla |
| **Backfill BD** | `precio_lista` + `pedido_proveedor_detalle.precio_lpc03` donde caso PROMOCIONAL |
| **RIMEC Web** | `getPrecioActivo` — fallback LPC03→LPN si `descp_caso = PROMOCIONAL` |
| **Migración** | `145_promocional_lpc03_igual_lpn.sql` |

Constante nombre caso: **`PROMOCIONAL`** (match `UPPER(TRIM(nombre_caso))`).

---

## RIMEC Web — badge PROMO (UI local)

Doc UI: [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](../../2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) (**2.2.1.0.1**)

- Pill **PROMO** verde esperanza junto a marca · solo si `descp_caso = PROMOCIONAL`.
- Preview dev: `http://localhost:3001/dev/promo-preview`
- **Sin deploy** Git/Vercel hasta cierre etapa local.

---

## Estado avance (2026-07-07)

| Ítem | Local | Supabase | Prod |
|------|-------|----------|------|
| `getPrecioActivo` + carrito | ✅ | — | ⛔ |
| Motor Python `logic.py` | ✅ | — | — |
| MIG-145 SQL | ✅ repo | ⏳ aplicar | — |
| Badge PROMO | ✅ | — | ⛔ |

**Bitácora:** actualizar esta tabla al cerrar cada micro-objetivo (Director · documentar siempre en local).

---

## Trazabilidad venta

La FI y el carrito siguen registrando **lista_precio_id = 3 (LPC03)** · precio numérico = LPN del promocional · **caso** = PROMOCIONAL en snapshot. Gerencia puede auditar: «vendió LPC03 pero precio promocional (= LPN)».

---

## Smoke

1. RIMEC Web · sesión LPC03 · tarjeta MODARE **7401·102** PROMOCIONAL → muestra precio Gs + badge **PROMO** (≠ pendiente).
2. Tarjeta **7378·223** no promocional → LPC03 = LPN×1.12 · sin badge (sin regresión).
3. Motor recalcular evento con líneas PROMOCIONAL → `precio_lista.lpc03 = lpn`.
4. Preview local `/dev/promo-preview` → comparativa visual PASS.

---

## Índice

- [CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md](./CHUSAR_CASOS_COMERCIALES_INDICE_CONTRIBUCION.md)
- [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](./CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md)
- [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](../../2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md)
- [INDICE.md](./INDICE.md)
