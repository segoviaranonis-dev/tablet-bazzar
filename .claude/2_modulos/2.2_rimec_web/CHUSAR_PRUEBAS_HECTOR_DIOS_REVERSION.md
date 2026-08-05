# CHUSAR — Pruebas Héctor Nivel Dios · reversión obligatoria

**Código:** **2.2.1.2.1**  
**Ratificado:** Director · 2026-07-12 · «todas las facturas… con usuario hector nivel dios vamos a eliminar o revertir… con explícito»  
**Padre:** [CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](./CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md)  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Alcance de la prueba

Desde el go-live CP+PE en prod, las pruebas operativas usan el usuario **Héctor** (`rol_id=1` + `categoria=DIOS`).

Incluye (sin límite a):

| Artefacto | Origen típico |
|-----------|----------------|
| Pedidos Web `PVR-*` | RIMEC Web carrito CP o PE |
| Facturas internas `FI-*` / `PE-*` | Aprobaciones / confirmar pedido |
| Movimientos de stock / pares vendidos | FI confirmada |

**No mezclar** con operación real de otros usuarios/clientes (salvo que el Director lo indique).

---

## 2 · Regla de oro

1. Durante la prueba: operar con Héctor DIOS.
2. Al **terminar la prueba con éxito**, el Director ordena **explícitamente** revertir/eliminar.
3. **Sin frase explícita** («revertí», «eliminá las FI de prueba», «limpiá Héctor») → **prohibido** borrar FI/PVR/stock.
4. Preferir universo acotado: cliente de prueba / trazas del día / nros `PE-*` / usuario Héctor — **nunca** clientes reales de operación.

---

## 3 · Checklist reversión (cuando el Director lo ordene)

| # | Acción | Notas |
|---|--------|-------|
| 1 | Listar PVR/FI creados en la ventana de prueba (usuario Héctor) | Report Aprobaciones + BD |
| 2 | Anular / revertir FI CONFIRMADA según protocolo holding | Sin tocar otros vendedores |
| 3 | Reponer stock CP/PE si aplica | Import stock RIMEC / recepción FI cliente 5000 si el Director lo define |
| 4 | Evidencia: lista de nros revertidos | Adjuntar a etapa o CHUSAR |
| 5 | **Reversión completa PVR → carrito** | [CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md](./CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md) (**2.2.1.2.3**) — 7 pasos · purge opcional cliente 5000 |

---

## 4 · Relación cliente 5000 (weekend)

Si la prueba usó **cliente 5000** (traspaso Web Bazzar), la reversión puede cruzar con import stock + recepción FI 5000 — **solo** ese cliente; otros clientes = operación real intocable.

---

**Documenta:** 2026-07-12 · orden Director cierre etapa + despliega + reversión explícita
