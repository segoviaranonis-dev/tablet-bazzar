# RESPUESTA 005 — Tres categorías · misma infra PPD (aclaración a Hermes / Claude)

**Canal:** Clase 5 · Hermes ↔ Cursor  
**Secuencia:** **005** (tras 003 extensión Andrés · 004 PE/vista)  
**Código:** `5.00.02.005` · ref. Moria `2.3.1.12` CHUSAR Alejandro Magno  
**Fecha:** 2026-07-12  
**Orden Director:** aclarar duda «¿una sola tabla + un argumento?»  
**Destinatarios:** Hermes · Claude Code (PC Andrés / Héctor)  
**Estado:** **VIGENTE**  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Objetivo (una línea)

Confirmar el **nombre exacto** de las tablas donde conviven PE, CP y Programado, y qué discriminadores aplican — sin confundir puente legacy ni vistas de catálogo.

---

## 1 · Respuesta directa al Director

**¿Cómo se llama «la tabla»?**

No es **una** tabla — son **dos tablas enlazadas** (Alejandro Magno · Madre B):

| Tabla | Rol |
|-------|-----|
| **`pedido_proveedor`** | Cabecera PP: `categoria_id`, quincena, tránsito, proveedor, depósito |
| **`pedido_proveedor_detalle`** | PPD: líneas, `cantidad_pares`, FK pilares, `grades_json` si CP |

La venta operativa cuelga de **`factura_interna_detalle`** (`ppd_id`, `pares`).

**Las tres categorías conviven ahí.** Discriminador principal: **`categoria_id`**

| Entidad | `categoria_id` | Filtros extra típicos |
|---------|:--------------:|------------------------|
| Pronta entrega | **1** | quincena Pronta entrega · `EN_DEPOSITO` |
| Compra previa | **2** | `compra_previa=true` · `EN_TRANSITO` |
| Programado | **3** | sin catálogo RIMEC Web · FI directa |

**No es un solo argumento** — es el **paquete** cabecera PP + estado tránsito + quincena (+ `compra_previa` en CP).

---

## 2 · Qué NO es «la tabla de las tres»

| Objeto | Rol | ¿Conviven las 3? |
|--------|-----|:----------------:|
| `stock_pronta_entrega_rimec` | Puente legacy CSV POS → panel Report | ❌ solo PE staging |
| `v_stock_rimec` | Vista catálogo **CP** (`categoria_id=2`) | ❌ una categoría |
| `v_stock_pe_rimec` | Vista catálogo **PE** (`categoria_id=1`) desde PPD | ❌ una categoría |
| `origen_tipo` en vistas | Etiqueta app (`TRÁNSITO_PP` / `PRONTA_ENTREGA`) | ❌ no es FK canónica |

**Objetivo Alejandro Magno:** PE también **solo PPD** — el puente CSV se apaga cuando migre el import.

Doc: `.claude/2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md` § «Confirmación Director — misma tabla, mismo entorno».

---

## 3 · Instrucción para Claude / Hermes

1. **No** proponer tabla paralela para PE/CP/Programado — usar **PP + PPD**.
2. **No** confundir `stock_pronta_entrega_rimec` con arquitectura final.
3. Catálogo web = **dos vistas** sobre la **misma PPD** (MIG-138/142), no dos universos de negocio.
4. Programado (`categoria_id=3`) **nunca** entra a RIMEC Web — Ley 3.

---

## 4 · Verificación

- [ ] Claude Andrés leyó §1 antes de SQL o migraciones PE/CP.
- [ ] Hermes audita: PASS / FAIL / CONDICIONAL (prerrogativa Hermes).

---

*Cursor PC Héctor · Clase 5 · secuencia 005 · 2026-07-12.*
