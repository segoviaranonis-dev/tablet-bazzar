# CHUSAR — Pruebas integridad stock Bazzar · Fase 1 y Fase 2

**Código:** **PRUEBA-STOCK-BZZ-2026** · **2.4.4** (tablet) · **2.3.2.2.11** (caja/sync)  
**Etapa:** [ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR_CERRADA.md](../../4_etapas/ETAPA_PRUEBA_INTEGRIDAD_STOCK_BAZZAR_CERRADA.md)  
**Estado:** ✅ **CERRADA Fase 1 · 2026-07-03** · Fase 2 sync 6 tiendas = etapa futura  
**Shibboleth:** 7 años

**Hermana bóveda (FOCO):** [CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md](./CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md) · [ETAPA bóveda](../../4_etapas/ETAPA_BOVEDA_STRESS_TEST_BAZZAR.md)

---

## Norte

Validar que el **circuito POS + depósito + vidriera** es **robusto y fiable** antes de escalar.

| Fase | Cuándo | Alcance |
|------|--------|---------|
| **1 · Una tienda** | **Mañana 2026-06-28** | Reset contadores + integridad **física** + **referencial** en **1** `cliente_id` |
| **2 · Sync simultáneo** | Segunda etapa (después PASS Fase 1) | Sync **6 tiendas** en paralelo · integridad cruzada |

**No reemplaza** docs canónicos — **extiende** el smoke de cierre salón.

---

## Documentación base (no perder de vista)

| Tema | Doc |
|------|-----|
| POS bandeja única | [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md) |
| Reglas inviolables | [REGLAS_BANDEJA_UNICA_POS.md](../../../tablet-bazzar/docs/REGLAS_BANDEJA_UNICA_POS.md) |
| Sync depósito | [LOGICA_STOCK_DEPOSITO_SYNC.md](../../../report/docs/LOGICA_STOCK_DEPOSITO_SYNC.md) |
| Admin sync | [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](../2.6_depositos_bazzar/CHUSAR_ADMIN_DEPOSITOS_REPORT.md) |
| Vidriera jefa salón | [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](../2.4_tablet_bazzar/CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) |
| Depósito cajas | [CHUSAR_TABLET_DEPOSITO_CAJAS.md](../2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CAJAS.md) |
| Smoke vendedor | [PRUEBA_VENDEDOR_STAGING.md](../../../tablet-bazzar/docs/PRUEBA_VENDEDOR_STAGING.md) |
| Cierre salón publicado | [ETAPA_DEPOSITO_SALON_VIDRIERA_CERRADA.md](../../4_etapas/ETAPA_DEPOSITO_SALON_VIDRIERA_CERRADA.md) |
| Reset contadores | `report/scripts/reset_pos_bazzar_ventas.mjs` |
| Checklist piso Fase 1 | [PRUEBA_INTEGRIDAD_STOCK_FASE1.md](../../../tablet-bazzar/docs/PRUEBA_INTEGRIDAD_STOCK_FASE1.md) |

---

## Fase 1 — Mañana · una tienda

**Tienda canónica:** **2100 · FER-A · Fernando Adultos** (expandir solo tras PASS).

### Paso 0 — Reset contadores (obligatorio)

Ejecutar **antes** de cualquier venta de prueba:

```bash
cd report
node scripts/reset_pos_bazzar_ventas.mjs
# Opcional scope una tienda si el script lo soporta; si no, reset global + sync 2100
```

**Debe quedar:**

| Contador / tabla | Estado esperado |
|------------------|-----------------|
| `ticket_bandeja_cajero` | vacía (2100) |
| `bobeda_venta_pos` | vacía (2100) |
| `pos_fi_fa_counter` | sin fila 2100 o `last_num = 0` |
| `ticket_bandeja_lote_id_seq` | próximo lote usable (= 1 efectivo) |
| `deposito_1_2100_tienda` | **no borrado** por reset · alinear con sync si hace falta |

Luego **sync solo 2100** desde Report si depósito ≠ Retail post-reset.

---

### Prueba A — Integridad **física** (piso real)

**Pregunta:** ¿Lo que ve el vendedor/jefa coincide con lo que hay en piso y escaparate?

| # | Acción | Verificación física |
|---|--------|---------------------|
| A1 | Abrir `/deposito` 2100 · tab Stock | ⭐ en grada vidriera activa · totales pares coherentes |
| A2 | Anotar 1 molécula (L.R+mat+color) + grada ⭐ | Foto mental / papel: par expuesto en vidriera |
| A3 | `/cadena` → vender **1 par** de esa grada | Stock depósito −1 · badge pares baja |
| A4 | Tab Alertas vidriera | Si agotó grada ⭐ → alerta cambio; si no → sin falsa alarma |
| A5 | CERRAR ticket → Report caja 2100 | Lote visible · FI_FA = **1** |
| A6 | Cancelar 2º par (si se agregó) o venta completa | Restauración stock +1 si cancelado antes CERRAR |
| A7 | Enviar a empaque (si aplica) | Bandeja limpia · bobeda +N |

**PASS físico:** cada −1/+1 en pantalla = par real contable · jefa ve faltante vidriera cuando corresponde.

---

### Prueba B — Integridad **referencial** (datos BD)

**Pregunta:** ¿Las FK, contadores y aislamiento `cliente_id` no mienten?

| # | Check SQL / lógico | Criterio PASS |
|---|-------------------|---------------|
| B1 | `SELECT COUNT(*) FROM ticket_bandeja_cajero WHERE cliente_id=2100 AND estado='ABIERTO'` | coherente con carritos abiertos en UI |
| B2 | `MAX(numero_fi_fa) WHERE cliente_id=2100` vs `pos_fi_fa_counter` | iguales tras CERRAR |
| B3 | `staging_id` único por lote · todas las filas del lote mismo `numero_fi_fa` | sin divergencia |
| B4 | Suma `cantidad` depósito molécula + filas bandeja activas misma molécula | = snapshot post-sync − ventas netas |
| B5 | Ninguna fila bandeja 2100 con `cliente_id` ≠ 2100 | aislamiento |
| B6 | Códigos molécula bandeja = códigos fila depósito (L,R,mat,color,grada) | sin texto libre cruzado |
| B7 | Primera venta post-reset: `staging_id=1`, `numero_fi_fa=1` | contadores reiniciados |

Evidencia: `tablet-bazzar/docs/evidencia/INTEGRIDAD_FASE1_2100_YYYYMMDD.json`

---

## Fase 2 — Segunda etapa · sync simultáneo 6 tiendas

**Precondición:** Fase 1 **PASS** documentada · Director autoriza.

### Objetivo

Probar que **Sincronizar TODOS** (6× `deposito_1_*_tienda`) no corrompe:

- aislamiento por `cliente_id`
- bandejas abiertas en otras tiendas (guard 409)
- totales Retail vs operativo por tienda

### Prueba C — Integridad física multi-tienda

| # | Acción |
|---|--------|
| C1 | Venta concurrente simulada: 2100 + 2400 (2 operadores) · 1 par c/u |
| C2 | Vidriera alertas independientes por tienda |
| C3 | Report hub depósitos · contadores por card correctos |

### Prueba D — Integridad referencial sync paralelo

| # | Check |
|---|--------|
| D1 | `POST /api/depositos/sync` sin `cliente_id` · 6 tablas · log batch_id |
| D2 | Tras sync: `SUM(cantidad)` por tienda vs preview Retail |
| D3 | Bandeja abierta en 2100 → sync 2100 debe **409** (guard) |
| D4 | Sync 2400 con bandeja 2100 abierta → **2400 OK · 2100 intacto** |
| D5 | `tiendas_marcas` · ninguna fila Retail fuera de matriz en depósito |

**Estado:** 📋 diseño · **no ejecutar mañana** salvo orden explícita post-Fase 1.

---

## Roles mañana

| Rol | Herramienta |
|-----|-------------|
| Director / operador | Reset + sync Report |
| Vendedor | Tablet `/cadena` |
| Jefa salón | Tablet `/deposito` Alertas ⭐ |
| Agente | SQL checks · evidencia JSON |

---

## Cierre Fase 1

Director dice **Cierra etapa** solo con:

- evidencia JSON Fase 1
- PASS A1–A7 y B1–B7
- build tablet + report OK

Fase 2 se abre como sub-etapa separada en `etapas.json`.

---

**Documenta — orden Director — 2026-06-27 · ejecución mañana 2026-06-28**
