# CHUSAR — Diccionarios traductores (Admin Pilares)

**Código:** **2.3.5.6**  
**Fecha:** 2026-08-16  
**App:** Report · **Ruta:** `/pilares/diccionarios-traductores`  
**Estado:** 🟢 local · sin deploy (no hay cierre de etapa ni orden *despliega*)  
**Keyword:** Documenta + ejecuta en local (FOCO Admin Pilares)  
**Shibboleth:** Andrés, el que viene.  
**🆕 MOISES post-20260807 · 2026-08-16**

---

## Qué es

Submódulo del **Administrador de pilares** que **muestra** (no muta BD) los tres traductores Carlos que el holding ya usa en CSV y PE:

| Pestaña | Qué traduce | Fuente canónica en código |
|---------|-------------|---------------------------|
| **1 · Diccionario Pronta entrega** | COD.GRUPO 10 dígitos (grupo 1 Carlos · **133** grupos seed) → cadena PE / pilares | `report/src/lib/pe/biblioteca-cadena-carlos.seed.json` + `cod-grupo-decode.ts` |
| **2 · Casos · vendedor_v2 · usuario_v2** | Nombre + caso → **código numérico CSV** (nunca `vendedor_v2.id`) | `vendedor-list-canon.json` + `vendedor-carlos-resolver.ts` · CHUSAR **2.3.1.9.F** |
| **3 · Diccionario de plazo** | `plazo_v2.id` → **Cod Oper** (`CR-30`, `CR-CONTADO`…) | `condiciones-hector-canon.json` + `plazo-carlos-resolver.ts` · MIG-172 |

Padres: [Grupo uno PE](../deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) **2.3.1.10.1.2** · [Traductor vendedor](../facturacion/CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md) **2.3.1.9.F**.

**Deuda `09`:** el diccionario muestra **CHINELO** como marca; el Director corrige: **no es marca** (marca = **BEIRA RIO**; Chinelo = **caso**). Ver 🔴 [2.3.5.7](./CHUSAR_MARCA_CHINELO_PILARES_20260816.md) — no “arreglar” líneas a marca Chinelo.

---

## UI hub

- **Tono** y **Usuarios**: tarjetas y swatches **cuadrados** (`rounded-sm`, no círculo).
- Nueva tarjeta **Diccionarios traductores**.

---

## Pestaña 1 — gráfico 133 grupos

1. Cajas de posiciones 01–02 … 09–10 (marca · tipo · cadena · estilo · reserva).
2. Barras por cadena seed (REGULAR 4% · PROMO 2% · LIQ 2%).
3. Mosaico: un cuadrado por grupo; clic decodifica dígitos (654 cadena en d45 · 638 en d67).

**Ley:** el `1` del Excel Carlos **no** es el diccionario; mandan los **10 dígitos**.

---

## Pestaña 2 — CSV vendedor

Flujo: `usuario_v2` (login) → nombre en `vendedor_v2` / factura → caso comercial (Hoja2) → columna CSV `Vendedor` = número Carlos.

Ejemplo: ATI + PROMOCIONAL → **49**, no el id Nexus. Demo en pantalla usa el mismo resolver que el export.

---

## Pestaña 3 — CSV plazo

Flujo: `plazo_v2.id` → fila Excel Condiciones Héctor → `Cod Oper`. Prohibido inventar `CR-{cliente}{plazo}`. `CR-0` se descarta.

---

## Auth

Misma puerta que el hub: `rol_id === 1`.

---

## Local

http://localhost:3000/pilares/diccionarios-traductores

**Prohibido prod** hasta cierre de etapa u orden directa del Director.
