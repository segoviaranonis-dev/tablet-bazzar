# P-12 — Protocolo cajero · bandeja CSV · Bobeda (mina de oro)

**Código plan:** P-12 · **CHUSAR activo** · **Actualizado:** 2026-06-23

---

## 1. Tres capas — vocabulario oficial

| Capa | Nombre operativo | Tabla / UI | Vida útil | Stock sesión |
|------|------------------|------------|-----------|--------------|
| **1 · Intermedia** | Ticket por puesto (tablet) | `ticket_pos_staging` + `_linea` | Sesión del día · editable | **Sí** — baja/sube al COBRAR, editar o cancelar |
| **2 · Bandeja cajero** | CSV pendiente | UI Report card A · filas pre-bobeda | Hasta que cajero envía a Bobeda | No (stock ya descontado en capa 1) |
| **3 · Bobeda** | Mina de oro | **`ticket_venta_pos`** | **Permanente** — sobrevive “Actualizar stock” | No |

> **Bobeda = `ticket_venta_pos`.** No es otra tabla. Es el registro atómico robusto del que saldrán informes de eficiencia Bazzar.

Doc intermedia + stock: `tablet-bazzar/docs/ARQUITECTURA_SESION_STOCK_ORO.md`  
**Mapa conexiones agente (obligatorio):** [MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md](./MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md) · **2.3.2.2.10**

---

## 2. Estados canónicos (objetivo)

### 2.1 Intermedia (`ticket_pos_staging`)

| Estado | Significado |
|--------|-------------|
| `ABIERTO` | Venta en curso · editable (+/− artículo · cancelar) |
| `CERRADO` | Vendedor cerró ticket · listo para caja |
| `CANCELADO` | Anulado · stock restaurado |
| `ORO` | Promovido · copiado a bandeja/bobeda · header staging archivado |

### 2.2 Bobeda (`ticket_venta_pos`)

| Estado | Significado | Quién actúa |
|--------|-------------|-------------|
| `PENDIENTE_CAJA` | En **bandeja entrada** cajero · LED **Pendiente** encendido | Cajero |
| `CSV_DESCARGADO` | CSV ya descargado · habilita **Enviar a Bobeda** | Cajero |
| `PENDIENTE_ENTREGA` | En Bobeda · factura legal hecha · espera despacho | Entregas |
| `ENTREGADO` | QC OK · cliente retiró | Entregas |
| `ANULADO` | ⏳ solo autorización especial (Director) | — |

**Estado ideal bandeja cajero:** **VACÍO** (ningún `PENDIENTE_CAJA` / `CSV_DESCARGADO`).

---

## 3. Botones UI caja operativa (card A)

Por fila / lote en bandeja:

| Control | Cuándo | Acción |
|---------|--------|--------|
| Indicador **Pendiente** | Ticket en bandeja | Visual — hay CSV por procesar |
| **Descargar CSV** | Siempre visible en fila pendiente | Genera archivo · nombre alineado a cliente/vendedor |
| **Enviar a Bobeda** | **Solo después** de descargar CSV | Cajero confirmó coincidencia ticket ↔ caja real → `PENDIENTE_ENTREGA` · sale de bandeja |

Regla de oro: el cajero **no** envía a Bobeda sin haber descargado el CSV (trazabilidad import facturador legacy).

---

## 4. Protocolo cajero (CHUSAR — paso a paso)

### 4.1 Apertura de turno

1. Iniciar sesión en **Report** (`:3001`) — rol habilitado (P-11).
2. Entrar al **módulo Caja de su tienda** — única visible por rol (`/tablet-bazzar/[cliente_id]`).
3. Se activa **sesión de caja** con usuario responsable (auditoría futura).
4. Verificar **bandeja de entrada**: estado ideal **VACÍO**.

### 4.2 Atención en mostrador

5. Cliente llega desde piso — vendedor tablet ya cerró ticket intermedio.
6. **Pregunta clave del cajero:** «¿Cuál es su nombre?» / «¿A nombre de quién emitió la factura el vendedor en tienda?»
7. Cajero mira bandeja — localiza fila / CSV cuyo **nombre coincide** con la respuesta del cliente.
8. **Descargar CSV** → abrir **sistema legal (legacy)** → importar CSV → crear factura legal → cobro real.
9. Coincidencia exacta ticket Nexus ↔ caja física → **Enviar a Bobeda**.
10. Fila desaparece de bandeja → acercarse a **VACÍO**.

### 4.3 Fuera de alcance Nexus (legacy)

- Emisión factura fiscal · formas de pago · plazos — **sistema que reemplazamos gradualmente**.
- Nexus orbita: CSV + Bobeda + entregas.

---

## 5. Flujo end-to-end (diagrama)

```
[RETAIL Excel] → sync depósito → sesión stock día
        │
[TABLET] PIN vendedor → venta → COBRAR
        │
        ▼
ticket_pos_staging (ABIERTO) ──editar/cancelar──► stock ±
        │ Cerrar
        ▼
ticket_pos_staging (CERRADO) → Promover
        │
        ▼
ticket_venta_pos (PENDIENTE_CAJA)  ← bandeja cajero · Pendiente ON
        │ Descargar CSV
        ▼
ticket_venta_pos (CSV_DESCARGADO)  ← Enviar a Bobeda habilitado
        │ Enviar a Bobeda (check cajero)
        ▼
ticket_venta_pos (PENDIENTE_ENTREGA)  ← BOBINA
        │ Tablet EMPAQUE (3er módulo) · QC · miniaturas
        ▼
ticket_venta_pos (ENTREGADO)

[Fin sesión] Actualizar stock → depósito borrado/reimportado
              Bobeda intacta
```

---

## 6. Bobeda — robustez e inmutabilidad

| Principio | Detalle |
|-----------|---------|
| **Una fila = un par** | Molécula L·R·Mat·Color·grada + FK + `snapshot_json` |
| **Informes futuros** | Eficiencia vendedor · tienda · molécula · recompra — solo desde Bobeda |
| **Reversiones** | Solo autorización especial (Director) — ⏳ política aparte |
| **Entorno legal** | Bobeda refleja venta efectiva Nexus; factura fiscal vive en legacy hasta absorción |

---

## 7. Reglas de bloqueo sync stock

No **Actualizar stock** (Retail → depósito) si:

- Existe `ticket_pos_staging` en `ABIERTO` o `CERRADO` (proceso tablet en curso).

Implementado: `POST /api/depositos/sync` → 409 si hay pendientes.

---

## 8. Vendedor y RRHH

| Fuente | Campo |
|--------|-------|
| RRHH `/rrhh` | `funcionarios.ente_id` → `entes` |
| POS | `vendedor_bazzar` = funcionario + tienda + **`codigo_pin`** (import ⏳) |

Nombre en bandeja / CSV debe permitir cruce cajero ↔ «¿a nombre de quién?».

---

## 9. Implementación código (estado 2026-06-23)

| Pieza | Estado |
|-------|--------|
| Staging + stock sesión tablet | ✅ |
| Promover staging → `ticket_venta_pos` EMITIDO | ✅ parcial |
| Estados PENDIENTE_CAJA / CSV_DESCARGADO / PENDIENTE_ENTREGA | ⏳ |
| UI LED Pendiente + Enviar a Bobeda post-CSV | ⏳ |
| Módulo entregas (P-13) | ⏳ doc |
| Sesión caja responsable | ⏳ |

---

## 10. Referencias

| Doc | Tema |
|-----|------|
| [P-03](./03_MODULO_CAJA_OPERATIVA.md) | Card A operativa |
| [P-07](./07_FLUJO_CSV_CAJERO.md) | CSV facturador |
| [P-09](./09_BASE_DATOS_MOLECULAR_TICKETS.md) | BD molecular Bobeda |
| [P-13](./P-13_MODULO_ENTREGAS_BOBINA.md) | Despacho · QC |
| **[CHUSAR_TABLET_EMPAQUE.md](../../2.4_tablet_bazzar/CHUSAR_TABLET_EMPAQUE.md)** | **Tablet 3er módulo · ciclo cerrado** |
| [P-01 Tablet ciclo](../../2.4_tablet_bazzar/P-01_TRES_MODULOS_CICLO_CERRADO.md) | Depósito · Venta · Empaque |

---

## 11. Tablet Empaque — ciclo cerrado (anti-bypass)

Tras **Enviar a Bobeda**, el flujo **vuelve a tablet** (3er módulo **Empaque**):

- Bandeja Bobeda `PENDIENTE_ENTREGA` · nombre · miniaturas · QC
- Sin Empaque confirmado → venta Nexus incompleta en piso
- **Estrategia Hiedra:** vendedor/cajero no pueden excluirnos — el bulto pasa por tablet

Doc: [P-01 Tablet 2.4](../../2.4_tablet_bazzar/P-01_TRES_MODULOS_CICLO_CERRADO.md)

---

**P-12 — Protocolo cajero · Bobeda = ticket_venta_pos · bandeja ideal VACÍO**
