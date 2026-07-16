# Cliente 5000 — entorno de pruebas RIMEC Web / FI

**Código:** `2.2.1.0.9`  
**Cliente:** `cliente_v2.id_cliente = 5000` · **Bazzar.py**  
**Orden Director:** **Documenta** 2026-07-14  
**Estado:** ✅ **PURGE 2026-07-16** — 0 FI · etapa pruebas cerrada  
**Lección ALM_WEB:** el purge borró `traspaso` ligados a FI 5000 → Depósito Web ciego · remedio + ley en [CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md](../2.5_bazzar_web/CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md) (**2.5.1.2**)  
**Cruce AM:** [CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md](../2.3_report/gestion_compra/CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md) (**2.3.1.25**) · desbloqueado  
**Cierre etapa:** [ETAPA_DIA_OPERATIVO_20260713_CERRADA.md](../../4_etapas/ETAPA_DIA_OPERATIVO_20260713_CERRADA.md)  
**Shibboleth:** Andrés, el que viene.

---

## Regla de negocio

| Punto | Detalle |
|-------|---------|
| **Cliente 5000** | Reservado para **pruebas E2E** (RIMEC Web carrito · confirmar · FI · PE web). **No es cliente operativo.** |
| **Director** | Debe poder **eliminar/revertir** registros de prueba (FI, PV, carrito, sesión) **sin afectar** artículos ni stock de **compra previa** real. |
| **Prohibido en prod** | Usar 5000 para ventas reales salvo smoke acordado. |

---

## Inventario (Supabase · post-purge 2026-07-16)

Consulta: `node report/scripts/diag_cliente_facturas.mjs 5000`

| Métrica | Valor |
|---------|--------|
| **factura_interna** | **0** (purge duro · 35 FI eliminadas) |
| **Script** | `report/scripts/purge_cliente_5000_pruebas.mjs` |
| **Bazzar Web compra/stock** | Tablas retail no; **sí** se borraron `traspaso` FI→web (remediado **2.5.1.2**) |
| **Otros clientes** | 656 FI intactas |

**Ubicación datos:**

- Cabecera: `factura_interna` (`cliente_id = 5000`)
- Líneas: `factura_interna_detalle` (`factura_id`)
- Trazas web: `pedido_id` / `pv_global` en FI · RPC `confirmar_pedido_web`
- UI: RIMEC Web `/mis-facturas` · PDF `/api/pdf/factura/{id}`
- Report: módulo **Facturación** / bandeja FI

---

## Requisito Director — borrado seguro

### Qué debe poder borrarse (solo pruebas 5000)

- Facturas internas **CONFIRMADA/ANULADA** del cliente 5000
- Detalle `factura_interna_detalle` asociado
- Preventas / PV de prueba ligadas a esas FI
- Carritos / sesiones de prueba en RIMEC Web (localStorage + tablas carrito si aplica)

### Qué **NO** debe tocarse

- **`pedido_proveedor_detalle`** de CP real (otros clientes / otras FI)
- **Stock CP en tránsito** (quincenas operativas no-5000)
- **Pilares** · **Sales Report** (`registro_ventas_general_v2` blindado)
- Artículos de **compra previa** vendidos a clientes distintos de 5000

### Criterio de aislamiento

| Origen | Señal en BD | Al revertir prueba 5000 |
|--------|-------------|-------------------------|
| **PE web** | FI sin `pp_id` o det_id sintético ≥ 800M | Revertir solo `stock_pronta_entrega_rimec` / líneas PE de esa FI |
| **CP prueba** | FI con `pp_id` pero **cliente_id = 5000** | Anular FI + **no** descontar de PP operativo de otros clientes; evaluar si `pares_vendidos` en ppd se restaura solo para líneas de esa FI |

> **Pendiente OT:** script o pantalla Director «Limpiar pruebas 5000» con transacción acotada + log + confirmación visual.

---

## Smoke / E2E documentado

- [CHUSAR_AUDITORIA_PRE_PROD_20260713.md](./CHUSAR_AUDITORIA_PRE_PROD_20260713.md) — E2E cliente 5000 + reversión si prueba
- [CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](./CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md)
- [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md](./CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md)

---

## Script diagnóstico

```bash
node report/scripts/diag_cliente_facturas.mjs 5000
```

---

## Relacionados

- [DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md](./DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md)
- [CHUSAR_CATALOGO_LATENCIA_T2T7_DEPLOY_20260714.md](./CHUSAR_CATALOGO_LATENCIA_T2T7_DEPLOY_20260714.md)
- Índice errores: cliente prueba ≠ producción
