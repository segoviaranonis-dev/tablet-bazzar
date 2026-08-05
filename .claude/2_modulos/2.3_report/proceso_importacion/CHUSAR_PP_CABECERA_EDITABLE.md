# CHUSAR — Cabecera editable · Pedido proveedor (Report 2.3.1.7.5)

**Subcuenta:** **2.3.1.7.5** · detalle PP  
**Ruta:** `/proceso-importacion/pedido-proveedor/[ppId]`  
**Paridad Streamlit:** `control_central/modules/pedido_proveedor/` — `get_pp_header`, `guardar_configuracion_pp`, `desasignar_ic_de_pp`  
**Actualizado:** 2026-07-08

**Padre:** [CHUSAR_PEDIDO_PROVEEDOR.md](./CHUSAR_PEDIDO_PROVEEDOR.md)

---

## Quincena · aplicar a todo el lote (2026-07-07)

Al cambiar **FECHA DE EMBARQUE** (`quincena_arribo_id` 1–24) el PATCH cabecera propaga a **todas las ICs** del PP:

```sql
UPDATE intencion_compra ic
SET quincena_arribo_id = $2
FROM intencion_compra_pedido icp
WHERE icp.intencion_compra_id = ic.id AND icp.pedido_proveedor_id = $1
```

| UI | Comportamiento |
|----|----------------|
| Selector quincena | Tab Stock / cabecera detalle |
| Botón **Aplicar quincena a todo el lote** | Confirmación · PATCH PP + ICs |
| Mensaje éxito | «Quincena aplicada a todo el lote (…).» |

Código: `cabecera-actions.ts` · `PedidoProveedorDetalleClient.tsx`  
Regla: solo si `cabecera_editable` (PP no ENVIADO/ANULADO).

---

## Objetivo gerencial

La cabecera del PP debe reflejar **estrategia comercial** y **operación editable** hasta el envío a Compra Legal — no datos legacy incorrectos (cliente stock, vendedor mal joinado).

El personal de Pedido Proveedor edita proforma, observaciones e ICs vinculadas **sin fricción** mientras `pedido_proveedor.estado` ∈ {`ABIERTO`, `CERRADO`}.

---

## Cambios de etiquetas (UI)

| Antes (incorrecto) | Ahora | Fuente de verdad |
|--------------------|-------|------------------|
| **Cliente** | **Categoría** | `pedido_proveedor.categoria_id` → `categoria_v2`; fallback primera IC del puente |
| **Vendedor** | **Creador** | `intencion_compra_pedido.asignado_por` → `usuario_v2.descp_usuario`; fallback `vendedor_v2` de la IC |
| **Factura import.** (cabecera) | **Observaciones** | `pedido_proveedor.notas` (texto libre operativo) |
| **Proforma** (solo lectura) | **Proforma proveedor** (input) | `pedido_proveedor.numero_proforma` |
| **Listado precio** (legacy cabecera) | ⛔ **Retirado 2026-07-21** | Operativo en IC/PF/FI — ver [CHUSAR_PP_CABECERA_BIBLIOTECA](./CHUSAR_PP_CABECERA_BIBLIOTECA.md) **2.3.1.7.5.3.13** |
| — | **Biblioteca de casos** | `pedido_proveedor.biblioteca_precio_id` · botón cambio total |

**Nota:** `nro_factura_importacion` **no** se muestra en cabecera. Sigue en el bloque **«Cerrar digitación»** (tab ICs) — obligatorio para paso operativo pre-F9, igual que Streamlit Digitación.

---

## Categoría — mapeo canónico

| `categoria_id` | `categoria_v2.descp_categoria` | Etiqueta cabecera |
|----------------|--------------------------------|-------------------|
| 2 | PRE VENTA | **COMPRA PREVIA** |
| 3 | — | **PROGRAMADO** |

Función: `formatCategoriaPp()` en `report/src/lib/pedido-proveedor/cabecera-actions.ts`.

Prioridad: `pp.categoria_id` heredado al asignar ICs; si NULL, subconsulta primera fila `intencion_compra_pedido`.

---

## Creador — regla de negocio

**Problema legacy:** join `usuario_v2.id_usuario = intencion_compra.id_vendedor` mostraba administrador (HECTOR) porque `id_vendedor` es FK lógica a **`vendedor_v2`**, no a usuario de sesión.

**Solución Report:**

1. **Primario:** usuario que asignó la IC al PP en Digitación → `intencion_compra_pedido.asignado_por` → `usuario_v2.descp_usuario`.
2. **Fallback:** vendedor comercial de la IC → `vendedor_v2.descp_vendedor` vía `ic.id_vendedor`.

Solo lectura en cabecera (no editable).

---

## Ventana de edición (bandera PP)

```typescript
cabecera_editable = estado !== "ENVIADO" && estado !== "ANULADO"
```

| Estado PP | Cabecera | ICs (nro fábrica / desasignar) | Listado precio |
|-----------|----------|--------------------------------|----------------|
| ABIERTO | ✓ | ✓ | ✓ |
| CERRADO | ✓ | ✓ | ✓ |
| ENVIADO | ✗ | ✗ | ✗ |
| ANULADO | ✗ | ✗ | ✗ |

Paridad Streamlit: `require_pp_pre_compra` / `pp_listado_precio_editable`.

---

## Campos editables en cabecera

| Campo BD | UI | Guardado |
|----------|-----|----------|
| `numero_proforma` | Input texto | PATCH al blur o botón «Guardar cabecera» |
| `notas` | Textarea observaciones | Idem |

**UX:** autosave on blur + botón explícito. Mensaje toast inline.

---

## ICs vinculadas (tab «ICs Asignadas»)

Paridad `desasignar_ic_de_pp` (Streamlit `logic.py`).

| Acción | API | Efecto BD |
|--------|-----|-----------|
| Editar nro. pedido fábrica | `PATCH …/pedido-proveedor/[ppId]/ic/[icId]` | `UPDATE intencion_compra_pedido.nro_pedido_fabrica` |
| Devolver a Digitación | `DELETE …/pedido-proveedor/[ppId]/ic/[icId]` | `DELETE` puente; IC → `AUTORIZADO`; descuenta `pares_comprometidos` del PP |

Bloqueado si PP ENVIADO/ANULADO.

---

## API Report (nuevo / extendido)

| Método | Ruta | Body | Auth |
|--------|------|------|------|
| GET | `/api/proceso-importacion/pedido-proveedor/[ppId]` | — | `requireMotorPreciosAdmin` |
| PATCH | mismo | `{ numero_proforma?, notas?, nro_pedido_externo?, quincena_arribo_id?, descuento_1..4? }` | idem |
| POST | mismo | `{ nro_factura_importacion }` | cerrar digitación (sin cambio) |
| PATCH | `…/[ppId]/ic/[icId]` | IC completa (marca, vendedor, pares, evento, nro fábrica) | idem |
| DELETE | `…/[ppId]/ic/[icId]` | — | desasignar IC |

---

## Archivos tocados

| Archivo | Rol |
|---------|-----|
| `report/src/lib/pedido-proveedor/detail-query.ts` | Query cabecera: `categoria`, `creador`, `cabecera_editable` |
| `report/src/lib/pedido-proveedor/cabecera-actions.ts` | `patchPpCabecera`, `updateIcPuenteNroFabrica`, `desasignarIcDePp` |
| `report/src/app/api/…/pedido-proveedor/[ppId]/route.ts` | PATCH cabecera |
| `report/src/app/api/…/pedido-proveedor/[ppId]/ic/[icId]/route.ts` | PATCH/DELETE IC |
| `report/src/app/…/PpTabStock.tsx` | Tab Stock Fase 1 (quincena duro, descuentos, listado) |
| `report/src/app/…/PedidoProveedorDetalleClient.tsx` | UI cabecera + ICs + router tabs |

---

## Pendiente (post Fase 1 · 2026-07-03)

- Upload proforma Excel (Fase 4).
- Ala Norte acordeón + precios stock (Fase 2).
- Tab FI NIIF · [CHUSAR_PP_TAB_FI](./CHUSAR_PP_TAB_FI.md) ✅ 2026-07-08
- Columna `created_by` en `intencion_compra` — futuro prioridad sobre `asignado_por`.

---

## Validación mínima

1. Abrir PP ABIERTO con IC vinculada.
2. Cabecera muestra **Categoría** (COMPRA PREVIA o PROGRAMADO) y **Creador** (usuario digitación).
3. Editar proforma y observaciones → persisten tras refresh.
4. Editar nro. fábrica IC → guardar OK.
5. «Devolver a Digitación» → IC desaparece del PP y reaparece en bandeja Digitación.
6. PP ENVIADO → todos los inputs deshabilitados.

`npm run build` en `report/` — PASS.
