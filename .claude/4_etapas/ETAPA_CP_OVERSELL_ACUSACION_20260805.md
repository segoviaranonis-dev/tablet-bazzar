# ETAPA — CP Web · acusación oversell carrito ↔ disponible

**ID:** `CP-OVERSELL-ACUSACION-20260805`  
**Estado:** 🟡 **EN CURSO · ESPERANDO RESPUESTA** · **no FOCO** (FOCO = Final Bazzar Web desde 2026-08-06) · reporte forense enviado 2026-08-05  
**Módulo:** RIMEC Web · Compra previa (CP) · carrito  
**App local:** http://localhost:3001  
**Ejecutor:** Cursor  
**Shibboleth:** Andrés, el que viene. CHUNA activo · Moria + ACTUAL acatados.

---

## Acusación (texto Director)

> Cantidad disponible y carrito **no tienen conexión** — había **100 disponible**, vendieron **208**; la cantidad **no se reducía** (o algo así).

**Unidades a confirmar:** ¿100/208 = **cajas**, **pares**, o **referencia de producto** (ej. ref. `208` en PP-15)?

---

## Objetivo etapa

1. **Observar** si el incidente se repite con caso concreto (`det_id`, PP, FI, vendedor, fecha).  
2. **Separar** CP Web tránsito vs canal PROGRAMADO (Report proforma).  
3. **No deploy prod** hasta cierre etapa u orden directa Director.

---

## Hallazgos forense (apertura 2026-08-05)

### CP Web (`EN_TRANSITO` · `v_stock_rimec`) — oversell **no confirmado en BD**

| Chequeo Supabase | Resultado |
|------------------|-----------|
| `pares_vendidos > cantidad_pares` | **0** filas |
| CP en catálogo: Σ FI > stock PPD | **0** filas |
| Carritos abiertos > `cajas_disponibles` | **0** (instante consulta) |

**Cadena técnica conectada:**

| Paso | Dónde | Qué valida |
|------|-------|------------|
| Catálogo | `v_stock_rimec` | `saldo_pares` · `cajas_disponibles` |
| Agregar carrito | `POST /api/carrito/items` | `cantidad_cajas` vs stock normalizado |
| VALIDAR | `carritoValidarPe.ts` | cajas + pares vs `disponibilidad.ts` |
| CONFIRMAR | RPC `confirmar_pedido_web` (MIG-173) | `FOR UPDATE` PPD · tope pares · `repairConfirmarPayloadPrecios` |

**Sensación “desconectado” (UX, no bug BD probado):**

- Sin **reserva blanda** — carrito ajeno no resta del número en catálogo hasta confirmar.  
- **Snapshot** `cajas_disponibles` al agregar; catálogo puede quedar viejo sin F5.  
- Concurrencia multi-vendedor: segundo confirm debería fallar en RPC.

### PROGRAMADO (PP-2026-0015) — desvío **sí** (otro canal)

- Ej. `ppd_id=3401`: stock **12 pares**, FI `15-PV002` con **8 líneas × 12 = 96 pares** en mismo `ppd_id`.  
- Fuera de `v_stock_rimec` (sin precio vinculado → no catálogo Web CP).  
- Import proforma: mapeo SHOP → mismo PPD; sync final `pares_vendidos = cantidad_pares` enmascara FI vs PPD.

Doc técnica: [CHUSAR_ACUSACION_OVERSELL_CP_CARRITO_20260805.md](../2_modulos/2.2_rimec_web/CHUSAR_ACUSACION_OVERSELL_CP_CARRITO_20260805.md) (**2.2.1.43**)

---

## Scripts forense (repo, no memoria sagrada operativa)

- `report/scripts/_forensic_oversell_cp.mjs`  
- `report/scripts/_forensic_oversell_cp2.mjs`  
- `report/scripts/_forensic_oversell_cp3.mjs`

Re-ejecutar tras nuevo incidente.

---

## Reporte operativo recibido (2026-08-05 tarde)

**Origen:** Excel Sales Report / Carlos — comparación **PV 4099 vs PV 4100** por `CODIGO ARTICULO` (`654.246725` … `654.261872`).

**Instrucción Director (FC 1426/26):**

- Lo **rojo** (COMP=0 · VEND>0 en PV **4099**) → pasar a **PV 4100** si hay stock.  
- Ver **orden de venta** (quién vendió primero).  
- Avisar **clientes que quedan sin venta**.  
- Verificar también **0421/26**, **0598/26**, **8894/26**.

### Mapa Nexus (forense BD mismo turno)

| Proforma | PP | PV externo | Inicial pares | Vendido | Oversell PPD |
|----------|-----|------------|---------------|---------|:------------:|
| **1426/26** | PP-2026-0012 | PP-4099 | 9 904 | 3 584 | **0** |
| **0421/26** | PP-2026-0006 | PP-4081 | 10 136 | 3 760 | **0** |
| **0598/26** | PP-2026-0007 | PP-4082 | 9 900 | 2 560 | **0** |
| **8894/26** | PP-2026-0014 | 4135 | 9 164 | 2 516 | **0** |

### Veredicto reporte 1426/26

| Hallazgo | Detalle |
|----------|---------|
| **PV 4100** | **No existe en Nexus** — solo `PP-4099` (PP-12 real · PP-10 vacío duplicado). Otros lotes usan par (`4054-4055`, …). |
| **Rojo Excel** | Desfase **legal SR** (dos PV) vs **un bucket Nexus** — no oversell carrito Web en `pedido_proveedor_detalle`. |
| **8 códigos `654.*`** | Sin match en PPD · SDRM · FI snapshot — clave legal; falta batch SDRM 1426/26 para clientes/orden. |
| **0421 / 0598 / 8894** | Cuadran en BD (vendido = Σ FI). |

### Acciones propuestas (pendiente respuesta Director / operador SR)

1. **Legal:** reasignar ventas PV 4099 → 4100 donde haya COMP (contable).  
2. **Nexus (si ordena):** registrar `PP-4100` o externo `4099-4100` y repartir stock F9.  
3. **Clientes sin venta:** tras reparto legal + mapa códigos.

### Estado turno

| Acción | Estado |
|--------|:------:|
| Análisis reporte + cruce BD | ✅ |
| **Reporte enviado al Director** | ✅ **2026-08-05** |
| **Esperando respuesta** (SR / batch SDRM / orden fix Nexus) | ⏳ |

---

## Checklist etapa (esperar qué pasa)

| # | Ítem | Estado |
|---|------|:------:|
| 1 | Forense código + BD apertura | ✅ |
| 2 | CHUSAR **2.2.1.43** + índices | ✅ |
| 3 | Reporte Excel FC 1426/26 + 0421/0598/8894 | ✅ |
| 4 | **Reporte enviado · esperar respuesta** | ⏳ |
| 5 | Mapa códigos `654.*` → PPD (batch SDRM) | ⏳ |
| 6 | Fix acordado (legal / PP-4100 / carrito UX) | ⏳ |
| 7 | Cierre: CERRADA + `etapas.json` + :3004 | ⏳ |

---

## Fuera de alcance (salvo orden)

- Deploy prod `rimec-web` (sellado `f408fc2`)  
- Mezclar con etapa cascada filtros **2.2.1.42** salvo mismo hotfix acordado  

---

## Referencias

- [CHUSAR_ACUSACION_OVERSELL_CP_CARRITO_20260805.md](../2_modulos/2.2_rimec_web/CHUSAR_ACUSACION_OVERSELL_CP_CARRITO_20260805.md)  
- MIG-173 · `confirmar_pedido_web` · `report/migrations/173_fi_pe_pp_id_logistica_ok.sql`  
- `rimec-web/lib/disponibilidad.ts` · `carritoValidarPe.ts` · `repairConfirmarPayloadPrecios.ts`  
- PROGRAMADO: `report/src/lib/pedido-proveedor/proforma-programado-engine.ts` · `control_central/modules/pedido_proveedor/logic.py` ~2196  

---

**Apertura 2026-08-05 — Reporte SR enviado · etapa en espera de respuesta Director/operador.**
