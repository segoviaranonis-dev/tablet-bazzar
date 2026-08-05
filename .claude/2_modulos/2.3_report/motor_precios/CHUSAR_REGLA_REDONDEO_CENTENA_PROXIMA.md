# CHUSAR — Regla redondeo centena próxima (LPN · LPC03 · LPC04)

**Código:** **2.3.1.7.1.0.2** · **Ratificado:** Director · 2026-07-20  
**Keyword:** Documenta  
**Relacionado:** [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](./CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) (**2.3.1.7.1.0.1**) · [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](../../2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) (**2.2.1.0.1**) · **Orden Excel LPC (un redondeo):** [CHUSAR_PRECIO_ENTERPRISE_ARQUITECTURA_BANCARIA.md](./CHUSAR_PRECIO_ENTERPRISE_ARQUITECTURA_BANCARIA.md) (**2.3.1.7.1.0.3** · MIG-179)

---

## Ley (inviolable)

**RIMEC redondea todo precio comercial a la centena de guaraníes más próxima** (múltiplo de 100 Gs.).

| Entrada | Salida |
|---------|--------|
| 230.048 | **230.000** |
| 230.051 | **230.100** |

**Fórmula canónica:**

```
precio_gs = ROUND(valor / 100) × 100
```

**SQL:** `ROUND(valor / 100) * 100`  
**TypeScript:** `Math.round(n / 100) * 100`  
**Python:** `int(round(x / 100) * 100)`

---

## Alcance

| Capa | Cuándo aplicar |
|------|----------------|
| **LPN** | Tras `fob_ajustado × índice` |
| **LPC03** | Tras `LPN × 1.12` (salvo PROMOCIONAL = LPN) |
| **LPC04** | Tras `LPN × 1.20` (salvo PROMOCIONAL = LPN) |
| **LPC02** | Valor persistido en `precio_lista` — re-redondear al mostrar/vender |
| **RIMEC Web UI** | Catálogo · acordeón · carrito · `formatPrecioGs` |
| **Report FI** | Lookup comercial desde listado (`sqlPrecioComercialDesdePl`) |

**Excepción PROMOCIONAL:** LPN = LPC03 = LPC04 (sin +12%/+20%) **pero sí centena** en cada tier.

---

## Aritmética completa (no promocional)

```
lpn_raw   = fob_ajustado × indice
lpn       = ROUND(lpn_raw / 100) × 100
lpc03     = ROUND((lpn × 1.12) / 100) × 100
lpc04     = ROUND((lpn × 1.20) / 100) × 100
```

**Ejemplo numérico:**

| Paso | Cálculo | Resultado |
|------|---------|-----------|
| LPN×1.12 | 205.400 × 1.12 = 230.048 | **230.000** |
| LPN×1.12 | 205.402 × 1.12 = 230.050,24 | **230.100** |

---

## Implementación (siamese)

| Repo | Archivo |
|------|---------|
| RIMEC Web | `rimec-web/lib/redondeoCentenaGs.ts` |
| RIMEC Web | `rimec-web/lib/precioLista.ts` — `lpcDesdeLpn` · `getPrecioActivo` |
| RIMEC Web | `rimec-web/lib/formatPrecioGs.ts` |
| Report | `report/src/lib/redondeoCentenaGs.ts` |
| Report FI | `report/src/app/aprobaciones/lib/fi-precio-evento-lookup.ts` |
| Motor Python | `control_central/modules/rimec_engine/logic.py` — `redondeo_centena_proxima` |
| Smoke | `rimec-web/scripts/smoke_ley_precios.ts` |

---

## Obsoleto (no usar en código nuevo)

| Antes | Ahora |
|-------|-------|
| `FLOOR(x/100)*100` (centena inferior) | **ROUND centena próxima** |
| `Math.round(lpn × factor)` sin centena | **`redondearCentenaGs(lpn × factor)`** |

Migraciones SQL históricas (055, 145) pueden seguir con FLOOR en backfill legacy; **nuevo cálculo runtime** = ROUND próxima (Director 2026-07-20).

---

## Smoke

```bash
cd rimec-web && npx tsx scripts/smoke_ley_precios.ts
```

Esperado: `230_048→230_000` · `230_051→230_100` · LPC03 promo = LPN.

---

## Índice

- [INDICE.md](./INDICE.md) — **2.3.1.7.1.0.2**
- [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](./CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md)
- [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](../../2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md)

**Última actualización:** 2026-07-20 · Documenta Director · ampliado centena + promo

---

## Tabla maestra aritmética (runtime 2026-07-20)

| Tier | Factor | Redondeo | PROMOCIONAL |
|------|--------|----------|-------------|
| LPN | 1× | centena próxima | = LPN |
| LPC02 | columna BD | centena al mostrar | sin cambio excepción |
| LPC03 | ×1.12 | centena próxima | **= LPN** (sin ×1.12) |
| LPC04 | ×1.20 | centena próxima | **= LPN** (sin ×1.20) |

Ver redondeo: [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](./CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (**2.3.1.7.1.0.2**)
