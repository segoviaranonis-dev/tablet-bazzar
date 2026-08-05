# CHUSAR — DOS MADRES · Gestión de compra importadora

**Nombre del conjunto:** **DOS MADRES**  
**Código:** **2.3.1.11** · Report · 🔍🕵️ Gestión compra Director  
**Ratificado:** Director · 2026-07-05  
**Etapa:** [ETAPA_GESTION_COMPRA_DIRECTOR.md](../../../4_etapas/ETAPA_GESTION_COMPRA_DIRECTOR.md)  
**Estrategia PE:** [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](../deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md)  
**Shibboleth:** Chayanne el mejor

> **Propósito:** cuando el Director cite una tabla, el agente lee **este archivo primero**. Norte: **todo stock importadora en PP/PPD** · violación documentada · puente temporal en disco hasta migración.

---

## 1 · Qué es DOS MADRES

| # | Madre | Estado hoy | Destino |
|---|-------|------------|---------|
| **Madre A** | Stock Bazzar | 18 tablas `deposito_*` | **1 tabla** + re-import CSV |
| **Madre B** | **`pedido_proveedor` + `pedido_proveedor_detalle`** | Operativa · prueba + real + **puente staging PE** | **Única** tabla stock importadora (proceso + programado + PE) |

**Madre B absorbe PE.** No crear ni perpetuar tabla stock PE aparte como arquitectura final.

---

## 2 · Violación arquitectónica (ratificada)

**Una tabla · dos usos:**

| Uso | Origen | Discriminador |
|-----|--------|---------------|
| Proceso importación | IC → PP → proforma | `compra_previa` + quincena real |
| **Import stock depósito** | CSV `sdrm####` directo | `quincena_desc = 'Pronta entrega'` |

Misma infraestructura: stock · compra · venta · cliente · **aprobación · facturación** — **sin redireccionar FI**.

Se corrige cuando haya recursos · ver deuda en [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](../deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md).

---

## 3 · Argumento duro RIMEC Web (no ETA)

| Campo | Tránsito / programado | Pronta entrega |
|-------|----------------------|----------------|
| `quincena_arribo_id` | 1–24 (dato duro) | NULL o sentinel acordado |
| `quincena_desc` | «2da quincena agosto»… | **`Pronta entrega`** |
| Tarjeta catálogo | Paleta quincena | Shell / color distinto |

El catálogo **ya fue diseñado** para argumento de tabla · no fecha suelta.

---

## 4 · Tipos cabecera PP

| Tipo | `compra_previa` | Cómo entra |
|------|:---------------:|------------|
| Compra previa | **true** | Proceso PP |
| Programado | **false** | Proceso PP |
| Stock PE importado | *(cabecera import)* | CSV → PPD · `quincena_desc = 'Pronta entrega'` |

Venta Bazzar piso = Madre A · no PP.

---

## 5 · Flujo único venta (tránsito = PE)

```text
RIMEC Web → FI (ppd_id) → Aprobaciones → Facturación → pares_vendidos ↑
```

**Misma FI · misma aprobación · misma facturación.** Solo cambia el **color/argumento** de tarjeta en web.

Facturación **proceso** (CSV legal) vs operación real = distinción **operativa UI** · no tabla detalle paralela.

---

## 6 · Puente temporal (NO perpetuar)

| Artefacto | Estado | Acción agente |
|-----------|--------|---------------|
| `stock_pronta_entrega_rimec` | Existe · sdrm0831 | Puente · migrar a PPD · no ampliar |
| MIG-134 UNION `PRONTA_ENTREGA` | Catálogo web | Reemplazar por PPD + quincena_desc |
| `factura_pronta_entrega_detalle` | **No crear** | Venta = `factura_interna_detalle` + `ppd_id` |

---

## 7 · Datos prueba vs sagrados

### Madre B — PP/PPD

| Clase | Política |
|-------|----------|
| PP/PPD prueba · depósito gestión | Borrar/omitir con orden Director |
| PPD en **RIMEC Web** (`v_stock_rimec` · saldo > 0) | **SAGRADO** |
| Import PE futuro en PPD | Real · no mezclar con filas prueba |

### Madre A — Bazzar

Depósito gestión = prueba. 18→1 en roadmap.

---

## 8 · Fórmulas (una sola · PPD)

```
saldo_pares     = ppd.cantidad_pares − COALESCE(ppd.pares_vendidos, 0)
pct_rendimiento = pares_vendidos / NULLIF(cantidad_pares, 0) × 100
```

Filtrar PE en informes: `quincena_desc = 'Pronta entrega'`  
Filtrar tránsito: `quincena_desc <> 'Pronta entrega'` AND quincena_arribo_id IS NOT NULL  
Filtrar programado: `compra_previa = false`

---

## 9 · Matriz Director → tabla

| Director dice… | Dónde |
|----------------|-------|
| «Pronta entrega» / «PE» | PPD · `quincena_desc = 'Pronta entrega'` |
| «Tránsito» / «compra previa» | PPD · quincena real · `compra_previa = true` |
| «Programado» | PP · `compra_previa = false` |
| «Depósito Bazzar» | Madre A |
| «Staging sdrm» *(puente)* | `stock_pronta_entrega_rimec` — temporal |
| «Informe Presidente» | `registro_ventas_general_v2` — solo lectura |
| «Bóveda» | `bobeda_venta_pos` — inmutable |

---

## 10 · Blindajes

| # | Regla |
|---|-------|
| 1 | Norte = PE en PPD · no diseñar sobre staging salvo puente |
| 2 | No redireccionar FI en aprobaciones por ser PE |
| 3 | No DELETE PPD con saldo en catálogo web |
| 4 | No JOIN Sales Report blindado ↔ pilares en SQL único |
| 5 | No confundir Madre A (tienda) con Madre B (importadora) |

---

## 11 · Roadmap

| # | Entregable |
|---|------------|
| 1 | Sanear PP prueba vs sagrado web |
| 2 | `compra_previa` + programados |
| 3 | Import CSV → PPD · `quincena_desc = 'Pronta entrega'` |
| 4 | Retirar staging + MIG-134 puente |
| 5 | Unificar 18 → 1 Bazzar |
| 6 | Panel `/gestion-compra` · rendimiento % Madre B |

---

## 12 · Referencias

| Doc | Tema |
|-----|------|
| [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](../deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md) | Violación PP dual uso |
| [CHUSAR_FACTURACION.md](../facturacion/CHUSAR_FACTURACION.md) | FI única |
| [CHUSAR_DEPOSITO_RIMEC.md](../deposito_rimec/CHUSAR_DEPOSITO_RIMEC.md) | Hub 2 tarjetas |
| [PEDIDO_PROVEEDOR.md](../proceso_importacion/PEDIDO_PROVEEDOR.md) | Proceso clásico |

---

**Integrado:** corrección Director 2026-07-05 · PE = argumento en PP · staging temporal only.
