# CHUSAR — Motor precio WEB · LPN/CASO no llegaban (ppd huérfano)

**Código:** **2.5.1.4**  
**Fecha:** 2026-08-01  
**Keyword:** **Documenta** · arreglar Motor precio  
**Etapa:** [ETAPA_AUDITORIA_DEPOSITO_WEB_20260801.md](../../4_etapas/ETAPA_AUDITORIA_DEPOSITO_WEB_20260801.md)  
**App:** Report `/bazzar-web/motor-precio`  
**Shibboleth:** Andrés, el que viene.

---

## Síntoma

Guardián catálogo: **103 SIN LPN/CASO** · CALCULADO `—` · solo 4 CON PRECIO.  
Tabla «Sin precio calculable» con LPN/CASO vacíos pese a stock y PUBLICADO.

---

## Causa raíz

Mapa `LPN_CASO_LATERAL_SQL` resolvía PE solo vía:

`factura_interna` → `factura_interna_detalle.ppd_id` → `pedido_proveedor_detalle`

**Evidencia BD:** de 101 FID PE, **96** tenían `ppd_id` apuntando a PPD **inexistente** (huérfano). El JOIN fallaba → LPN/CASO null.

Además: `intencion_compra_pedido.precio_evento_id` null en PP de estos ingresos → camino precio_lista tampoco aportaba.

---

## Fix (código)

Archivo: `report/src/lib/bazzar-web/motor-precio/lpn-caso-sql.ts`

| Prioridad | Fuente |
|-----------|--------|
| 1 | `precio_lista` por evento IC (si hay) |
| 2 | FI + FID: PPD vivo **o** `fid.precio_lista` + caso de `linea_snapshot` / `fi.caso` (match L+R por snapshot) |
| 3 | `stock_sano_deposito` L+R+M del mismo almacén |

Consumidores (mismo SQL): Motor precio catálogo/publicar · Stock Sano aplicar · Compra Web display.

---

## Smoke 2026-08-01

| Check | Resultado |
|-------|-----------|
| SKUs L+R+MAT con stock | **107** |
| Con LPN | **107** |
| Con CASO | **107** |
| Sin precio calculable (`fn_precio_venta_web`) | **0** |
| Ej. 10000/5 | LPN 107700 · CASO CARTERAS |

UI: refrescar http://localhost:3000/bazzar-web/motor-precio (hard refresh).

---

## Pendiente ops (Director)

- Publicar precios WEB desde el botón si hace falta alinear CALCULADO → PUBLICADO.
- Remendar `ppd_id` huérfanos en FID (OT datos) — el fix ya no depende de ellos.
