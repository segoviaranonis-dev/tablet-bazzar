# 00 — Hub · 6 cajas tienda (2.3.2.2.0)

**Ruta app:** `/tablet-bazzar`  
**Rol:** Punto de entrada cajero / supervisor Bazzar — **no** mezcla tiendas en una sola vista operativa.

---

## UI objetivo

Pantalla con **6 cards** (diseño retail, iconografía tienda, métrica rápida “pares hoy” por card).

| Card | `cliente_id` | Destino |
|------|--------------|---------|
| Fernando Adultos | 2100 | `/tablet-bazzar/2100` |
| Fernando Niños | 2900 | `/tablet-bazzar/2900` |
| San Martín Adultos | 2400 | `/tablet-bazzar/2400` |
| San Martín Niños | 2700 | `/tablet-bazzar/2700` |
| Palma Adultos | 3100 | `/tablet-bazzar/3100` |
| Palma Niños | 3200 | `/tablet-bazzar/3200` |

Usuario con acceso restringido ve **solo su card** (ver P-06).

---

## Qué NO es el hub

- No es sync Retail (→ 2.3.2.1).
- No es Sales Report RIMEC.
- No es tablet POS (→ 2.4.2.3).

---

## Estado

| Ítem | Estado |
|------|--------|
| Listado tickets global | ✅ parcial |
| 6 cards navegación | ⏳ |
| KPI por card en hub | ⏳ |
