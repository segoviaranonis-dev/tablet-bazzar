# CHUSAR — IC · Problema 2 · Política LP (`listado_precio_id`)

**Código:** **2.3.1.7.3.0.1** · **Etapa:** Alejandro Magno / maratón IC  
**Relacionado:** [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) (Problema 1 · Web)  
**Estado:** 🟢 **CÓDIGO LOCAL** — MIG-146 pendiente Supabase · 2026-07-07  
**Shibboleth:** Andrés, el que viene.

---

## Norte — Problema 1 vs 2

| # | Dónde | Síntoma | Regla |
|---|-------|---------|-------|
| **1** | **RIMEC Web** catálogo | Cliente LPC03 · artículo PROMOCIONAL sin precio | `LPC03 := LPN` solo caso PROMOCIONAL |
| **2** | **Intención de compra** (origen) | Política LP del cliente **no queda bien fijada** en IC → no fluye a FI / import programado | `intencion_compra.listado_precio_id` = tier canónico **1–4** |

**Problema 2** = **origen comercial**: la IC debe registrar **qué política LP** usa ese cliente (LPN · LPC02 · LPC03 · LPC04) además del **evento de precio** (`precio_evento_id`).

---

## Reglas operativas (Director · 2026-07-07)

| Estrategia | LP en IC |
|------------|----------|
| **PROGRAMADO** | **Obligatorio** — selector 4 tiers (LPN · LPC02 · LPC03 · LPC04) |
| **COMPRA PREVIA** | **No importa** — `listado_precio_id` NULL; precio se define en venta Web |

**Índice UI:** `2.3.1.7.3.1 · REGISTRO` — campo «Política de precio (LP)» bajo evento de precio.

---

## Campos IC — no confundir

| Campo | Tabla FK | Valores | Rol |
|-------|----------|---------|-----|
| `precio_evento_id` | `precio_evento.id` | id evento cerrado | **Listado motor** (biblioteca + Excel) · alimenta LPN/LPC en `precio_lista` |
| `listado_precio_id` | `listado_precio.id` | **1** LPN · **2** LPC02 · **3** LPC03 · **4** LPC04 | **Política cliente** · qué tier aplicar en FI / venta |

Catálogo canónico: migración **027** — IDs **1–4** fijos en `listado_precio`.

---

## Caso 8604 — importación programado · LPC04 impuesto

**Proforma 8604/2026** · **10.032 pares** · maratón Alejandro Magno.

| IC | Tier impuesto |
|----|---------------|
| IC-2026-0060 … IC-2026-0069 (10 SHOP) | **LPC04** (`listado_precio_id = 4`) |

**Migración:** `146_ic_programado_8604_lpc04.sql` (control_central + report) — backfill IC + FI `RESERVADA`/`CONFIRMADA` ligadas al PP 8604.

**Default UI nueva IC PROGRAMADO:** sugerencia **LPC04** (`LISTADO_IMPUETO_8604`) — operador puede cambiar tier antes de guardar.

---

## Implementación Report (local)

| Archivo | Rol |
|---------|-----|
| `listado-precio-tiers.ts` | Constantes tiers 1–4 · IC_NUMEROS_8604 · validación |
| `SelectorPoliticaLp.tsx` | Chips LPN/LPC02/LPC03/LPC04 · obligatorio PROGRAMADO |
| `IntencionCompraNuevaClient.tsx` | Selector LP · sin campo LP en COMPRA PREVIA · validación registro |
| `IcPendienteCard.tsx` | Edición LP bandeja · bloqueo autorización sin LP |
| `save-intencion.ts` | Rechaza PROGRAMADO sin tier 1–4 |
| `update-campo-ic.ts` | PATCH `listado_precio_id` |
| `catalogos-query.ts` · `getListadosParaCaso` | Paridad Streamlit (tiers 1/3/4 + PROMOCIONAL → LPC03 si LPN) |

**API negociación** (`GET …/negociacion`): sigue exponiendo listados por caso para validación futura; UI principal usa tiers fijos del catálogo.

---

## Excepción PROMOCIONAL (hereda Problema 1)

En `getListadosParaCaso`, si caso = **PROMOCIONAL** y hay filas `lpn > 0` pero no `lpc03`:

- Ofrecer **LPC03** aunque columna `lpc03` sea NULL → operador elige tier; venta aplica `LPC03 := LPN` (MIG-145).

---

## Rutas Report

| Pantalla | Ruta local |
|----------|------------|
| Hub IC | `:3000/proceso-importacion/intencion-compra` |
| Bandeja | `…/bandeja` |
| Nueva IC | `…/nueva` |
| API negociación | `GET …/intencion-compra/negociacion?evento_id=&caso=` |

---

## Smoke Problema 2

1. Nueva IC **PROGRAMADO** → no registra sin LP · default LPC04 visible.
2. Nueva IC **COMPRA PREVIA** → sin selector LP · guarda con `listado_precio_id` NULL.
3. Bandeja IC 8604 → **LPC04** tras MIG-146 · autorización bloqueada si LP vacía.
4. Guardar → `intencion_compra.listado_precio_id` ∈ {1,2,3,4} (no id de `precio_lista`).

---

## Bitácora

| Fecha | Hito |
|-------|------|
| 2026-07-07 | Problema 2 situado en IC · bug `getListadosParaCaso` documentado |
| 2026-07-07 | Selector LP obligatorio PROGRAMADO · CP exento · MIG-146 8604 · UI + validación backend |

---

## Índice

- [CHUSAR_INTENCION_COMPRA.md](./CHUSAR_INTENCION_COMPRA.md)
- [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md)
- [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md)
