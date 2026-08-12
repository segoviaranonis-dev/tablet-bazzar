# CHUSAR — Aprobación Gral por molécula (pedido)

**Código:** **2.3.1.3.7** · **Estado:** ✅ **VALIDADO Director 2026-08-12** (cerrado operativo)  
**Fecha:** 2026-08-11 · cierre Documenta 2026-08-12  
**Keyword:** **Documenta** · **despliega**  
**App:** Report `:3000/aprobaciones`  
**🆕 MOISES post-20260807 · 2026-08-11**

**Padre:** Aprobaciones **2.3.1.3** · agilidad **2.3.1.3.6** · confirmar FI `confirmarFi`

---

## 0 · Norte Director

1. **Aprobación Gral** no es “aprobar toda la lista de pendientes”.  
2. Va **en cada molécula** (tarjeta de pedido) — lugar dibujado junto a chips origen / nro PVR.  
3. Objetivo ejemplo: aprobar **Bazzar.py** (PE · 5000) **sin** tocar el de **Compra previa** (otro PVR).  
4. Afecta **solo la familia** de FI RESERVADA **dentro** de ese `pedido_id`.  
5. Misma robustez que ✓ Aprobar individual (misma mutación + logística `after`).

---

## 1 · Concepto

| Término | Significado |
|---------|-------------|
| **Molécula** | Un `pedido_venta_rimec` pendiente (tarjeta) |
| **Familia** | Todas las `factura_interna` RESERVADA con ese `pedido_id` (células marca×caso) |
| **Aprobación Gral** | Confirma esa familia de un golpe |
| **Aprobar** (célula) | Confirma una sola FI |

**Prohibido:** un botón global que apruebe Bazzar.py + Compra previa juntos.

---

## 2 · UI

- Botón **✓ Aprobación Gral** en `PedidoPendienteCard` (derecha, bajo nro PVR).  
- Confirmación local: “¿Aprobar solo PVR-…? No afecta otros pedidos.”  
- Lista pendiente: texto aclaratorio bajo el contador.

Archivos:

- `report/src/app/aprobaciones/components/PedidoPendienteCard.tsx`  
- `report/src/app/aprobaciones/AprobacionesClient.tsx`  
- `report/src/app/aprobaciones/lib/aprobaciones-mutations.ts` → `aprobacionGeneral`  
- `report/src/app/api/aprobaciones/aprobacion-general/route.ts`

---

## 3 · API

`POST /api/aprobaciones/aprobacion-general`  
Body: `{ "pedidoIds": [304] }` — la UI manda **un** id (la molécula).  
Interno: `confirmarFi` por cada FI RESERVADA del/los pedido(s) · Nivel Dios · logística en `after()`.

---

## 4 · Caso prueba 2

| Pedido | Cliente | Origen | Gral debe… |
|--------|---------|--------|------------|
| PVR-2026-416511 (304) | 5000 Bazzar.py | PE | Aprobar sus ~20 FI |
| Otro pendiente CP | p.ej. 2400 | Compra previa | Quedar intacto |

---

## 5 · Cierre Director (2026-08-12)

Director: **«Aprobación Gral funcionó perfectamente»** → foco cerrado.  
Bancard Laura y Motor sellos **siguen abiertos** (pruebas / aguardando).  
**Deploy Report:** `abd93b1` (junto con auditoría estilo **2.5.1.6.1**).

---

## 6 · Andrés

🆕 **2.3.1.3.7** — Aprobación Gral = molécula, no lista. Zip Héctor. Sync OPS **OFF**.

---

## 7 · Línea 1 viva

Si pienso en el lo entiendo, pero si me lo explicarlo es imposible
