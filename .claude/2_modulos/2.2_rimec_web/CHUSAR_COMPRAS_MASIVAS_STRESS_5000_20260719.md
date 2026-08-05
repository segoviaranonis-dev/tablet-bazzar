# CHUSAR — Compras masivas · stress test cliente 5000

**Código:** `2.2.1.17`  
**Etapa:** [ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md](../../4_etapas/ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md)  
**Cliente:** `5000` · **Bazzar.py** · canal prueba E2E  
**Fecha PARÉNTESIS:** **2026-07-19** (solo hoy)  
**Orden Director:** **Nueva etapa** 2026-07-19  
**Shibboleth:** Andrés, el que viene.

---

## Regla del día

> **PARÉNTESIS:** estresar compra masiva con cliente **5000**.  
> **Al final del día:** eliminar **todos los procesos** con **fecha de hoy** y **cliente 5000**.  
> Otros clientes · CP real · Sales Report = **intocables**.

Referencia base: [CHUSAR_CLIENTE_5000_PRUEBAS.md](./CHUSAR_CLIENTE_5000_PRUEBAS.md) (**2.2.1.0.9**).

---

## Pre-flight

```bash
cd report
node scripts/diag_cliente_facturas.mjs 5000
```

| Esperado | Valor |
|----------|-------|
| `factura_interna` total | **0** |
| Cliente | Bazzar.py |

Login RIMEC Web como vendedor con sesión que apunte a **cliente 5000** (HECTOR DIOS / perfil acordado).

---

## Checklist stress (Director + Cursor)

| # | Acción | App | PASS |
|---|--------|-----|:----:|
| 1 | Activar venta · catálogo CP | `:3001` / prod | ☐ |
| 2 | Agregar **lote masivo** CP (≥20 líneas · varios tonos/casos) | Carrito | ☐ |
| 3 | Cambiar a PE · agregar líneas PE | Carrito mixto | ☐ |
| 4 | VALIDAR carrito · sin errores stock | Modal VALIDAR | ☐ |
| 5 | Confirmar pedido → PVR | RPC confirmar | ☐ |
| 6 | Aprobaciones / descuentos si aplica | Report `:3000` | ☐ |
| 7 | FI generada · PDF · `mis-facturas` | Web + Report | ☐ |
| 8 | Panel CP / AM — métricas movidas solo 5000 | Report AM | ☐ |
| 9 | Repetir 2–3 ciclos si el Director quiere más carga | — | ☐ |

**Observar:** latencia catálogo · acordeón · TIPO · pulse Promo/LIQ (hotfix **2.2.1.16**).

---

## Qué se genera (rastreo BD)

| Artefacto | Tabla / señal |
|-----------|----------------|
| Carrito | `carrito_rimec` / localStorage |
| Pedido web | `pedido_venta_rimec` · `pedido_venta_rimec_detalle` |
| Factura | `factura_interna` · `factura_interna_detalle` |
| Stock CP | `pedido_proveedor_detalle.pares_vendidos` |
| Stock PE | `stock_pronta_entrega_rimec` |
| Traspaso web | `traspaso` (solo BORRADOR/ENVIADO — ver ley purge) |

Filtro EOD: `cliente_id = 5000` **AND** `fecha` / `created_at` **= 2026-07-19** (zona operativa).

---

## Cierre EOD — purge obligatorio

### 1 · Auditoría pre-borrado

```bash
cd report
node scripts/diag_cliente_facturas.mjs 5000
```

SQL referencia (solo lectura):

```sql
SELECT id, nro_factura, estado, pv_global, pedido_id,
       created_at::date AS dia
FROM factura_interna
WHERE cliente_id = 5000
  AND created_at::date = CURRENT_DATE
ORDER BY id;
```

### 2 · Dry-run purge

```bash
node scripts/purge_cliente_5000_pruebas.mjs --dry-run
```

El script purgea **todo el cliente 5000** (aislado de prod). Como 5000 es solo prueba y hoy arrancó en **0 FI**, equivale a «solo lo de hoy».

### 3 · Ejecutar purge

```bash
node scripts/purge_cliente_5000_pruebas.mjs
```

**Qué hace:** reintegra stock CP/PE de FI CONFIRMADA/RESERVADA · borra detalle/cabecera FI · PVR huérfanos · carrito · traspaso no confirmado (ley [CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md](../2.5_bazzar_web/CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md)).

**Qué NO toca:** otros clientes · `pedido_proveedor` operativo · Sales Report · traspaso CONFIRMADO con ingreso ALM_WEB.

### 4 · Post-purge

```bash
node scripts/diag_cliente_facturas.mjs 5000
```

| Esperado | Valor |
|----------|-------|
| FI total | **0** |

Limpiar localStorage carrito en navegador del vendedor de prueba.

### 5 · Cerrar etapa

Director: **Cierra etapa** → [protocolo_etapas.md](../../1_fundamentos/1.1_protocolos/protocolo_etapas.md) + `etapas.json`.

---

## Reversión puntual (sin purge total)

Si solo hay que revertir **un** PVR antes del EOD: [CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md](./CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md) (**2.2.1.2.3**).

---

## Relacionados

- [CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md](../2.3_report/gestion_compra/CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md) · **2.3.1.25**
- [CHUSAR_HOTFIX_CATALOGO_PRECISION_BANCARIA_20260719.md](./CHUSAR_HOTFIX_CATALOGO_PRECISION_BANCARIA_20260719.md) · **2.2.1.16**
