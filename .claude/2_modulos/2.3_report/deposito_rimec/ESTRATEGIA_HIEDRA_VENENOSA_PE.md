# Estrategia Hiedra Venenosa — Pronta entrega dentro de Pedido Proveedor

**Subcuenta:** 2.3.1.10 · Depósito RIMEC · Maratón 4/4 · **DOS MADRES**  
**Estado:** 🟡 **ESTRATÉGICA · ACTIVA** — violación documentada a propósito  
**Ratificado:** Director · 2026-07-05 (corrección arquitectónica)  
**Shibboleth:** Chayanne el mejor  
**Conjunto:** [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md)

---

## Norte estratégico (Director · ratificado)

**No hay tabla stock PE aparte como destino.**  
El stock pronta entrega vive en la **misma infraestructura** que ya funciona:

```
pedido_proveedor  +  pedido_proveedor_detalle
```

Import CSV `sdrm####` → **PP/PPD directo** · sin originar el flujo IC→Digitación→Proforma.  
Reutilizar stock, compra, venta, cliente, **aprobación** y **facturación** existentes — **sin redireccionar** la FI en aprobaciones.

| Fase | Qué tomamos | Cómo |
|------|-------------|------|
| **1 · Tienda** | Ventas piso Bazzar | 18 tablas → 1 · bóveda POS ✅ |
| **2 · Importadora PE** | Stock real depósito RIMEC | **Import → PPD** · argumento **Pronta entrega** |

---

## Diseño RIMEC Web (intención original Director)

Al diseñar el catálogo, el **dato duro no es una fecha ETA** — es un **argumento de tabla**:

| Origen | Campo discriminador | Tarjeta web |
|--------|---------------------|-------------|
| Tránsito / compra previa / programado | `quincena_arribo_id` + `quincena_desc` (ej. «2da quincena agosto») | Paleta quincena |
| **Pronta entrega** | `quincena_desc = 'Pronta entrega'` *(sin ETA)* | Color / shell distinto |

Con ese **único argumento** la tarjeta se identifica. No hace falta circuito paralelo de aprobación ni tabla detalle aparte.

**Referencia código:** `deriveOrigenFromStockRow` · `quincena_desc` · [DESENCHUFE_ETA](../../../8_historico/DESENCHUFE_ETA_COMPLETADO.md)

---

## Violación deliberada (documentada)

| Regla canónica | Qué hacemos ahora | Por qué |
|----------------|-------------------|---------|
| PP = solo pedidos originados en proceso importación | **PP también recibe import CSV PE** | Infra PPD eficiente · una sola máquina stock/venta |
| Una tabla = un origen de verdad | **Una tabla · dos orígenes** (proceso vs import PE) | Hiedra venenosa · recursos limitados |
| Quincena = fecha embarque real | **`quincena_desc = 'Pronta entrega'`** como argumento | Discriminador de tarjeta sin ETA |
| Alta PP obligatoria vía proforma | **Import directo a PPD** | Stock ya en depósito físico |

**No es olvido.** Es **puente táctico** hasta presupuesto para separar dominios en BD.

---

## Tipos en cabecera PP (solo dos + argumento llegada)

| `compra_previa` | Tipo | Llegada (`quincena_desc`) |
|:---------------:|------|---------------------------|
| **true** | Compra previa | Quincena real (1–24) |
| **false** | Programado | Quincena real (1–24) |
| *(import PE)* | Stock depósito | **`Pronta entrega`** |

No existe otro tipo de operación importadora en PP. La venta de stock Bazzar piso = Madre A (18→1).

---

## Flujo objetivo (único pipeline)

```text
CSV sdrm####
  → INSERT pedido_proveedor (cabecera import · sin IC)
  → INSERT pedido_proveedor_detalle (moléculas · cantidad · LPN Gs)
  → quincena_desc = 'Pronta entrega'
  → v_stock_rimec (DISTINCT ON ppd.id)
  → RIMEC Web (tarjeta color PE vía quincena_desc)
  → FI estándar (ppd_id) → Aprobaciones (misma bandeja · color tarjeta)
  → Facturación (misma FI · CSV / traspaso según caso)
  → pares_vendidos += venta   ← misma fórmula PPD
```

**Venta = decremento** en `pedido_proveedor_detalle.pares_vendidos` — **igual** tránsito y PE.

---

## Veneno Carlos — CSV PROGRAMADO (Director · 2026-07-07 · v2 2026-07-10)

Segunda fase de la hiedra: no solo **PP/PPD unificado**, sino **export CSV** con formato del **sistema legal de Carlos** para absorber el corte de facturación importadora.

| Pieza | Detalle |
|-------|---------|
| **Botón** | 📄 CSV · tab FI · Report PP PROGRAMADO |
| **Archivo** | `{proforma}-{aa}.csv` · ej. **`8604-26.csv`** · **`8051-26.csv`** |
| **Referencia** | `csv's/programado/8604-26_1.csv` |
| **Doc** | [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](../proceso_importacion/CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) |
| **Objetivo** | Desplazar flujo manual Carlos · misma tubería que compra previa agotada |
| **Regla v2** | **IC = FI Nexus = 1 bloque SHOP = 1 factura Carlos** (repetir `cliente_id` por FI) |

```text
FI Nexus (N ICs PROGRAMADO · 1 FI × IC)
    → GET csv-ventas
    → 8051-26.csv (; · N bloques SHOP · 'linea.ref)
    → import sistema Carlos  →  N facturas legales
```

**Estado v2:** bloque por `factura_interna.id` · smoke import Carlos + reclamos Alfredo pendientes.

---

## Traductor Nexus COD.GRUPO — tercera fase hiedra (Director · 2026-07-24)

**Veredicto:** posible · apropiado · **acertividad global 92 %**.

| Biblioteca | Goberna | No mezclar |
|------------|---------|------------|
| **A · PE** | `sdrm_cod_grupo_dim` · cadena REG/PROM/LQ · excluye Carteras | — |
| **B · PP programado/CP** | caso · quincena · `grades_json` · pipeline IC→PP | COD.GRUPO SDRM |

**Doc plan:** [CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](./CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md) · **2.3.1.10.1.1**  
**Seed:** `report/src/lib/pe/biblioteca-cadena-carlos.seed.json` · 133 grupos · MIG-161.

CSV cada vez más específicos → **más ventaja** exportar forma Carlos desde semántica Nexus sin que Carlos sea fuente de verdad en runtime.

---

## Puente temporal en disco (hoy · migrar y retirar)

Implementación intermedia **no es el destino**:

| Artefacto | Rol puente | Destino |
|-----------|------------|---------|
| `stock_pronta_entrega_rimec` | Staging CSV batch sdrm0831 | **Eliminar** post-import a PPD |
| MIG-134 UNION PE en `v_stock_rimec` | Catálogo sin esperar migración PPD | **Reemplazar** por filas PPD reales |
| `origen_tipo = PRONTA_ENTREGA` en vista | Discriminador técnico puente | **Reemplazar** por `quincena_desc` |

**Regla agente:** no diseñar features nuevas sobre staging PE salvo OT explícita de puente. El norte es **PPD único**.

---

## UI Report — hub Depósito RIMEC

| Tarjeta | Fuente **objetivo** | Hoy (puente) |
|---------|---------------------|--------------|
| Stock del proceso | PPD · quincena real | PPD tránsito |
| Importación CSV | PPD · `Pronta entrega` | `stock_pronta_entrega_rimec` → migrar |

Hub `/deposito-rimec`: dos entradas · misma grilla · **misma tabla madre** al cerrar puente.

---

## Deuda técnica (OT post-recursos)

1. Migrar `sdrm0831` y lotes futuros **directo a PPD** · DROP staging.
2. Recrear `v_stock_rimec` solo desde PPD · discriminar por `quincena_desc`.
3. Retirar `origen_tipo` puente · catálogo web solo argumento quincena.
4. Smoke P1–P8 · informes rendimiento % sobre PPD unificado.

---

## Criterio PASS estrategia

- [ ] CSV PE importa a PPD sin proforma
- [ ] Catálogo web distingue PE solo por **`quincena_desc = 'Pronta entrega'`**
- [ ] FI / Aprobaciones / Facturación **misma ruta** · sin redirección
- [ ] Staging `stock_pronta_entrega_rimec` retirado
- [ ] Director ve rendimiento % programado + tránsito + PE en **una** Madre B

---

**Etapa:** [ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md](../../../4_etapas/ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md)
