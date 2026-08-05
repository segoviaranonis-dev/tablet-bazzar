# P-01 — Tablet · 3 módulos · ciclo cerrado (Hiedra)

**Código:** 2.4.2.x · **App:** `tablet-bazzar/` · **Panel:** `/`  
**Estrategia:** imposibilitar bypass vendedor/cajero · **Actualizado:** 2026-06-23

---

## 1. Los tres módulos (obligatorios en panel)

| # | Módulo | Ruta | Rol | Estado código |
|---|--------|------|-----|---------------|
| **1** | **Depósito** | `/deposito` | Consultar stock piso · fotos · pilares | ✅ |
| **2** | **Venta** | `/cadena` | Vender · PIN vendedor · staging intermedia | ✅ |
| **3** | **Empaque** | `/empaque` ⏳ | Cerrar ciclo físico · leer **Bobeda** | ⏳ |

> Un solo panel · tres puertas. **Ningún par sale de la tienda sin pasar por Empaque en tablet** (objetivo estratégico).

Registro modos: `tablet-bazzar/lib/view-modes.ts`

---

## 2. Estrategia — ¿por qué Empaque en tablet?

**Problema:** vendedor o cajero pueden resistirse al cambio y seguir “a mano” (papel, memoria, facturador solo).

**Respuesta Hiedra:** el flujo **vuelve a la tablet** en el último metro físico:

```
Depósito (mirar) → Venta (cobrar staging) → Caja Report (CSV → Bobeda)
       ↑                                              ↓
       └──────────── Empaque (tablet) ← Bobeda PENDIENTE_ENTREGA
```

| Sin Empaque Nexus | Con Empaque Nexus |
|-------------------|-------------------|
| Cajero factura y entrega bolsita sin trazabilidad | Empaque **obliga** scan/consulta Bobeda |
| Vendedor niega uso tablet | Cliente **no retira** sin paso Empaque |
| Datos rotos en Bobeda | Bobeda = 100% ventas físicas |

**Anti-bypass:** quien quiera excluirnos del proceso **no puede** — el protocolo de tienda exige Empaque tablet antes de salida.

---

## 3. Ciclo completo (6 tiendas)

```
[Retail sync] → depósito sesión
      │
┌─────▼───── TABLET ─────────────────────────────────────┐
│ 1 DEPÓSITO   consulta stock · otras tiendas            │
│ 2 VENTA      PIN · carrito · staging (stock −)         │
└─────┬──────────────────────────────────────────────────┘
      │ cliente a caja
┌─────▼───── REPORT CAJA ────────────────────────────────┐
│ Bandeja CSV · Pendiente · Descargar · Enviar Bobeda    │
└─────┬──────────────────────────────────────────────────┘
      │ ticket_venta_pos (Bobeda) PENDIENTE_ENTREGA
┌─────▼───── TABLET EMPAQUE ─────────────────────────────┐
│ 3 EMPAQUE    bandeja por nombre · miniaturas · QC      │
│              marca EMPAQUE_LISTO (o ENTREGADO directo) │
└─────┬──────────────────────────────────────────────────┘
      │ cliente retira
      ▼
   Bobeda ENTREGADO · informes · mina de oro intacta
```

Doc caja: [P-12](../../2.3_report/caja_bazzar/P-12_PROTOCOLO_CAJERO_BOBINA.md)  
Doc entregas/empaque cruzado: [P-13](../../2.3_report/caja_bazzar/P-13_MODULO_ENTREGAS_BOBINA.md)

---

## 4. Módulo Empaque — funciones ⏳

| # | Función |
|---|---------|
| 1 | Bandeja `PENDIENTE_ENTREGA` · orden **por nombre** (mismo criterio caja) |
| 2 | Miniaturas calzado · molécula L·R·Mat·Color·grada |
| 3 | QC visual vs Bobeda |
| 4 | Confirmar empaque → `EMPAQUE_LISTO` o `ENTREGADO` |
| 5 | Estado ideal bandeja: **VACÍO** |

**API objetivo:** `GET /api/empaque/tickets` · `POST /api/empaque/confirmar`

---

## 5. Estados Bobeda (extensión Empaque)

| Estado | Quién |
|--------|-------|
| `PENDIENTE_CAJA` | Cajero bandeja |
| `CSV_DESCARGADO` | Post-CSV |
| `PENDIENTE_ENTREGA` | Post-Bobeda · **entrada Empaque** |
| `EMPAQUE_LISTO` | ⏳ Empaque tablet confirmó bulto |
| `ENTREGADO` | Cliente retiró |
| `ANULADO` | Solo auth especial |

---

## 6. Roles — nadie salta el ciclo

| Rol | Módulo | No puede saltar |
|-----|--------|-----------------|
| Vendedor piso | Venta + Depósito | Empaque + Caja |
| Cajero | Report caja | Empaque (cliente no sale sin) |
| Empaque | Tablet Empaque | Bobeda (solo tickets reales) |
| Gerencia | Report métricas | Bobeda histórica |

---

## 7. Implementación

| Pieza | Estado |
|-------|--------|
| Depósito + Venta panel | ✅ |
| Empaque ruta + UI | ⏳ |
| Empaque API + estados | ⏳ |
| CHUSAR Empaque | [CHUSAR_TABLET_EMPAQUE.md](./CHUSAR_TABLET_EMPAQUE.md) |

---

## 8. Referencias

| Doc | Tema |
|-----|------|
| [CHUSAR_TABLET_VENTAS.md](./CHUSAR_TABLET_VENTAS.md) | Venta |
| [CHUSAR_TABLET_DEPOSITO_FOTOS.md](./CHUSAR_TABLET_DEPOSITO_FOTOS.md) | Depósito |
| [P-12 caja](../../2.3_report/caja_bazzar/P-12_PROTOCOLO_CAJERO_BOBINA.md) | Bobeda |
| [01_VISION hiedra](../../2.3_report/caja_bazzar/01_VISION_HIEDRA_PUERTA_CHICA.md) | Fase 1–2 |

---

**P-01 Tablet — 3 módulos · ciclo cerrado · resistencia al cambio neutralizada en Empaque**
