# Módulo: Aprobación de Pedidos RIMEC

> Leer antes de modificar `modules/aprobacion_pedidos/` o tablas `pedido_venta_rimec` / `factura_interna*`.

**Índice holding:** `2.1_control_central` → submódulo **Aprobaciones**  
**Registry Streamlit:** `modules.aprobacion_pedidos` (4.5)  
**Estado:** Producción  
**Última auditoría:** 2026-06-10 (PV global, backfill pedidos, montos FI)

---

## Qué hace

**Editor de pedidos mayoristas** + control administrativo sobre lo que el vendedor propuso en **rimec-web**.

No es solo confirmar/rechazar: la **Factura Interna** refleja la decisión de administración (cantidades, precios, descuentos, cliente). Esa decisión descuenta stock del **Pedido Proveedor** en tránsito.

**Ventana de edición:** todo editable mientras el PP vinculado **no** esté **enviado a compra** (`pedido_proveedor.estado = ENVIADO`). Incluye FIs **CONFIRMADAS** (mercadería aún en tránsito). Al enviarse a compra legal, la edición se cierra.

Autoriza pedidos creados en **rimec-web** (RPC `confirmar_pedido_web`).

Flujo operativo:

```
Pedido web (PVR-…) → FIs RESERVADA (células PP×Marca×Caso)
  → Confirmar FI individual → CONFIRMADA + pv_global
  → Si todas las FIs del pedido confirmadas → pedido CONFIRMADO + email PDF
```

**Paradigma:** BD como único canal. La UI no inventa células; lee `factura_interna` por estado.

---

## Archivos código

| Archivo | Responsabilidad |
|---------|-----------------|
| `modules/aprobacion_pedidos/ui.py` | 4 tabs Streamlit, tarjetas FI (`render_fi_card`) |
| `modules/aprobacion_pedidos/ui_fast.py` | Acciones inline tab Confirmadas |
| `modules/aprobacion_pedidos/logic.py` | Queries, `confirmar_fi`, `anular_fi`, edición encabezado/items |
| `core/fi_card.py` | Render canónico de toda FI en el holding |
| `core/fi_numbering.py` | Formato display `PV000147` desde `pv_global` |
| `streamlit_apps/aprobaciones.py` | Entry alternativo (legacy) |

---

## Pestañas UI vs tablas (CRÍTICO)

| Tab UI | Qué cuenta | Tabla | Filtro SQL |
|--------|------------|-------|------------|
| **Pendientes** | Pedidos | `pedido_venta_rimec` | `estado='PENDIENTE'` AND EXISTS FI `RESERVADA` |
| **Reservadas** | Facturas | `factura_interna` | `estado='RESERVADA'` |
| **Confirmadas** | Facturas | `factura_interna` | `estado='CONFIRMADA'` ORDER BY `pv_global` DESC LIMIT 200 |
| **Anuladas** | Facturas | `factura_interna` | `estado='ANULADA'` LIMIT 200 |

**No confundir:** el tab Confirmadas muestra **FIs**, no filas de `pedido_venta_rimec`. Un pedido puede tener varias FIs (células).

Funciones en `logic.py`: `get_pedidos_pendientes`, `get_fi_reservadas`, `get_fi_confirmadas`, `get_fi_anuladas`.

---

## Modelo de datos

### Cabecera pedido web

**Tabla:** `pedido_venta_rimec`

| Campo clave | Uso |
|-------------|-----|
| `nro_pedido` | `PVR-2026-XXXXXX` |
| `estado` | `PENDIENTE` → `CONFIRMADO` / `RECHAZADO` / `EDITADO` |
| `cliente_id`, `vendedor_id`, `plazo_id`, `lista_precio_id` | Encabezado comercial |
| `descuento_1…4`, `total_pares`, `total_monto` | Totales del carrito |
| `payload_json` | Snapshot del carrito (fallback pre-RPC-028) |

Origen: **rimec-web** vía `confirmar_pedido_web` (MIG-100 descuentos por factura).

### Factura interna / Preventa (PV)

**Tabla:** `factura_interna` — 1 fila = 1 célula (PP + Marca + Caso)

| Campo clave | Uso |
|-------------|-----|
| `pedido_id` | FK → `pedido_venta_rimec.id` |
| `pp_id`, `marca`, `caso` | Identidad de la célula |
| `nro_factura` | Legacy por PP (`8-PV024`) |
| **`pv_global`** | **Número PV canónico** (`147` → UI `PV000147`) — MIG-107 |
| `estado` | `RESERVADA` → `CONFIRMADA` / `ANULADA` |
| `total_pares`, `total_monto` | Debe = SUM(`factura_interna_detalle`) |

**Tabla detalle:** `factura_interna_detalle` — ítems con `linea_snapshot` (5 pilares + imagen).

### Numeración PV (ley MIG-107)

- `pv_global` se asigna al pasar a **CONFIRMADA** o **ANULADA** (trigger `asignar_pv_global`).
- **RESERVADA** no tiene `pv_global` (correcto).
- Secuencia global 1…N sin huecos; UNIQUE parcial.
- UI muestra `PV{pv_global:06d}`; legacy en subtítulo (`Legacy: 8-PV020`).

Vista compat: `v_factura_interna_preventa` → columna `numero_preventa_global`.

### Estados pedido vs FI

| Evento | `factura_interna` | `pedido_venta_rimec` |
|--------|-------------------|----------------------|
| Checkout web | FIs `RESERVADA` | `PENDIENTE` |
| Confirmar última FI | todas `CONFIRMADA` | `CONFIRMADO` (`_confirmar_pedido_web`) |
| Anular FI | `ANULADA` | puede quedar `PENDIENTE` si quedan otras |
| Rechazo total pedido | — | `RECHAZADO` |

---

## Criterio canónico de montos

Por línea (post-corrección 2026-06-10):

```
precio_base  = max(precio_unit, precio_neto)  # lista
precio_neto  = round(precio_base × cascada descuentos)
subtotal     = precio_neto × pares
total_monto  = SUM(subtotal) en cabecera FI
```

Descuentos en cascada: `descuento_1…4` de la FI (MIG-100: por factura, no globales del pedido).

---

## Seguridad BD

- `pedido_venta_rimec`: RLS ON (MIG-068) — sin badge UNRESTRICTED en Supabase.
- Streamlit usa `DATABASE_URL` / service role (no anon).
- rimec-web escribe vía RPC `SECURITY DEFINER`, no `.from('pedido_venta_rimec').insert()`.

---

## Scripts de mantenimiento

| Script | Uso |
|--------|-----|
| `scripts/auditoria_pv_global_lite.py` | Conteos UI vs BD, huecos PV, export CSV |
| `scripts/corregir_montos_fi_legacy.py` | Alinear detalle/cabecera FIs desincronizadas |
| `scripts/restaurar_cabeceras_fi_confirmadas.py` | Preservar monto confirmado al escalar líneas |
| `scripts/run_backfill_pedidos_desincronizados.py` | `PENDIENTE`→`CONFIRMADO` si todas FIs confirmadas |
| `verificar_pv_global.sql` | Checks MIG-107 en Supabase |

---

## Funciones críticas (`logic.py`)

| Función | Rol |
|---------|-----|
| `confirmar_fi(fi_id)` | RESERVADA→CONFIRMADA; cierra pedido; email PDF |
| `anular_fi(fi_id, motivo)` | ANULADA + reversión stock |
| `modificar_cantidad_item_fi(...)` | Cajas/pares; RESERVADA o CONFIRMADA; ajusta stock PP |
| `editar_descuentos_fi_confirmada(...)` | Descuentos/LPN/plazo en FI ya confirmada (tránsito) |
| `cambiar_cliente_fi(...)` | Cliente en RESERVADA o CONFIRMADA |
| `actualizar_fi_encabezado(...)` | Encabezado; hoy solo vía RESERVADA (recalcula desde `v_stock_rimec`) |
| `get_fis_de_pedido(pedido_id)` | FIs del pedido (camino RPC-028) |
| `crear_preventa_desde_celula(...)` | Fallback pre-028 desde `payload_json` |

---

## Integraciones

| Sistema | Rol |
|---------|-----|
| **rimec-web** | Crea pedido + FIs RESERVADA |
| **Pedido Proveedor** | Stock PP (`pedido_proveedor_detalle`), saldo tránsito |
| **Compra Web / Facturación** | Misma `render_fi_card` (ley FI) |
| **report** (futuro) | Clon planificado — ver `4_etapas/ORDEN_CURSOR_APROBACIONES_NEXTJS.md` |

---

## Errores conocidos resueltos (2026-06-10)

1. **45 pedidos** `PENDIENTE` con FIs ya `CONFIRMADA` → backfill a `CONFIRMADO`.  
   Detalle: [ERROR_PEDIDOS_DESINCRONIZADOS.md](../../../5_errores/ERROR_PEDIDOS_DESINCRONIZADOS.md)
2. **16 FIs** cabecera ≠ suma detalle → scripts de corrección montos.
3. Confusión **147 PV** vs **145 confirmadas**: 147 = `MAX(pv_global)`; incluye 2 ANULADAS numeradas.

---

## Gemelo Report — Nivel Dios (`report/aprobaciones`)

**Palabra clave:** **Nivel Dios** = instancia de control superlativo en Next.js Report.

| Requisito | Valor |
|-----------|--------|
| App | `report/` — ruta `/aprobaciones` |
| Usuario | `usuario_v2.rol_id = 1` **y** `usuario_v2.categoria = 'DIOS'` |
| Contrato | Cada edición → transacción BD inmediata (`fi-editor-sync.ts`, `aprobaciones-mutations.ts`) |
| Doc | `report/docs/APROBACIONES.md` |
| Dev local | `report/REINICIAR_DEV.bat` si «no se ejecuta» (`.next` corrupto) |

Streamlit mantiene el mismo negocio; Report añade gate estricto DIOS + UI NIIF.

---

## Reglas para agentes

1. **PV display:** siempre `pv_global`, nunca solo `nro_factura` legacy.
2. **Conteos UI:** no comparar tab Confirmadas con COUNT de `pedido_venta_rimec`.
3. **Pilar / FK:** no parchear relaciones en memoria; SQL indexado en BD.
4. **Sales Report:** blindado — no cruzar con este flujo.
5. **Cierre de edición:** validar `pedido_proveedor.estado` antes de mutar; bloquear si PP `ENVIADO`.

---

## Documentación extendida

- [MAPA_DATOS_PV.md](MAPA_DATOS_PV.md) — auditoría PV, queries de verificación, ejemplos reales

---

## Shibboleth V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-11  
**Responsable documentación:** Cursor (auditoría + backfill verificados en BD)
