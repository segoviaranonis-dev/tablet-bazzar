# Protocolo Chusa — Administrador de IC · generación FI por lote

**Código:** **2.3.1.7.5.3.5.1**  
**Módulo:** Pedido proveedor · tab `?tab=admin-ic`  
**Decisión Director:** 2026-07-11  
**Estado:** 🟢 **CANÓNICO** — control previo a **Generar factura interna por lote**  
**Componente UI:** `PpTabAdministradorIc.tsx`  
**Shibboleth:** Andrés, el que viene.

---

## Propósito

Simplificar la generación de **Facturas Internas (FI)** cuando IC y Pre-Factura interna (PF) son **equivalentes en universo y en canon**.  
Si todo cuadra, **no** tiene sentido operativo generar FI **una a una** — el sistema habilita **un solo proceso por lote**.

Este protocolo **reemplaza** como norte la UI previa de lista de parejas con botones individuales «Generar factura» (ineficiente · no acorde al diseño Director).

---

## Las tres columnas del canon

Comparación **estricta · sin margen de error** entre panel **IC · cabecera** (izquierda) y **Pre-Factura interna · proforma** (derecha):

| # | Columna IC | Columna PF | Regla |
|---|------------|------------|--------|
| 1 | **Cliente** (`id_cliente` / SHOP) | **Cliente** | Igualdad exacta numérica |
| 2 | **Marca** | **Marca** (alineada con IC; caso comercial cuando aplica) | Igualdad exacta de etiqueta canon |
| 3 | **Cant.** (`pares`) | **Cant.** (`total_pares`) | Igualdad exacta entera |

**Fuera del canon para este control:** IC Nº, Caso, LP, Monto — no habilitan ni bloquean el lote por sí solos (LP/monto se ajustan con regla IC manda en implementación aparte).

---

## Tres niveles de control (secuenciales)

```
Nivel 1 — Contadores rojos
        ↓ (solo si contador IC = contador PF)
Nivel 2 — Canon renglón × renglón
        ↓ (solo si las 3 columnas coinciden en cada renglón alineado)
Nivel 3 — Cuadro verde superior · Generar FI por lote
```

### Nivel 1 — Contadores (cuadros rojos en mockup)

| Contador | Panel | Qué cuenta |
|----------|-------|------------|
| **Contador IC** | Izquierda | Cantidad de **cabeceras IC** visibles en el universo de trabajo (filtro cliente aplicado si hay) |
| **Contador PF** | Derecha | Cantidad de **cabeceras Pre-FI** visibles en el mismo universo |

- Trabajan **de forma independiente** (cada panel calcula su total).
- **Condición de paso:** `contador_IC === contador_PF`.
- Si difieren → **no** se evalúa nivel 2 · botón lote **deshabilitado**.

### Nivel 2 — Verificación del canon

Solo si Nivel 1 pasó:

1. Ordenar/alinear filas IC y PF con la **misma regla de orden** (cliente → marca → cantidad → desempate).
2. Emparejar **renglón i** IC con **renglón i** PF (misma posición visual).
3. Para **cada** renglón, verificar las **3 columnas del canon** — coincidencia **100% · sin tolerancia**.

**Condición de paso:** todos los renglones del universo visible pasan el canon.

Si falla un solo renglón → botón lote **deshabilitado** · corregir IC en `?tab=ics` (§ Desajuste) · **no** hay panel central DnD en camino feliz (2026-07-11).

### Nivel 3 — Cuadro verde superior (habilitación lote)

**Ubicación UI:** franja superior central del Administrador de IC (mockup Director · cuadrado verde sobre la línea roja entre paneles).

**Contenido — simple y fijo:**

```
┌─────────────────────────────────────┐
│  IC: [n]     PF: [n]                │
│  [ Generar factura interna por lote ]│
└─────────────────────────────────────┘
```

| Elemento | Comportamiento |
|----------|----------------|
| Contador IC | Mismo valor que Nivel 1 (cabeceras IC) |
| Contador PF | Mismo valor que Nivel 1 (cabeceras PF) |
| Botón **Generar factura interna por lote** | **Habilitado** solo si Nivel 1 **y** Nivel 2 OK |

**Acción del botón:** generar **todas** las FI del universo validado en **una sola operación por lote** (no un clic por pareja).

**Regla de negocio:** IC manda en cabecera (LP, descuentos, vendedor, plazo) al materializar FI — ver [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) · iteración SHOP 2026-07-11.

---

## Desajuste IC ↔ Proforma — error del vendedor (caso operativo)

**Tipo:** error habitual · no es fallo del motor de importación.  
**Detectado en:** Administrador de IC cuando **Nivel 1** (contadores IC ≠ PF) o **Nivel 2** (canon no cuadra renglón a renglón).

### Qué revela el panel

| Señal | Interpretación |
|-------|----------------|
| Contador IC ≠ contador PF | Universo distinto — faltan/sobran cabeceras IC o la proforma agrupa distinto (caso comercial) |
| Misma cliente + marca · distinta **Cant.** o distinto **Caso** en PF | Vendedor cargó mal la IC (caso normal vs promocional, split de pares, etc.) |
| Monto IC ≠ monto PF (misma cant.) | Listado LP o monto bruto IC desactualizado — corregir en IC |

### Verdad en conflicto IC vs Proforma

| Situación | Fuente de verdad para **cantidad y caso** |
|-----------|-------------------------------------------|
| Proforma ya importada · artículos vienen del Excel proveedor | **Pre-Factura interna (proforma)** |
| IC es intención comercial del vendedor | IC se **ajusta** para cuadrar con proforma antes de FI |

**Regla Director (2026-07-11):** cuando el desajuste es error de carga del vendedor (ej. artículo **promocional** cargado como **normal**), lo correcto es la **proforma**; la IC se corrige.

### Procedimiento de subsanación (confirmado)

1. **Detectar** en `?tab=admin-ic` — Protocolo Chusa bloqueado (N1 o N2).
2. **Diagnosticar** fila a fila: cliente · marca · cant. · caso en PF vs IC.
3. Ir a pestaña **`?tab=ics`** (ICs asignadas) · editar la IC afectada:
   - **Pares / cantidad** → igual que la PF correspondiente.
   - **Monto bruto** → recalcular o ajustar al valor comercial coherente con proforma.
   - Si el error es **caso** (promocional vs normal): puede requerir **partir o reasignar** ICs (una IC por caso comercial cuando la proforma ya viene separada por caso).
4. **Guardar** IC · volver a **`?tab=admin-ic`** · refrescar.
5. Revalidar **N1 → N2 → N3**. Si cuadra → **Generar factura interna por lote** (un clic · ~2 min · overlay espera).

### Ejemplo PP-28 · cliente 826 · MODARE (2026-07-11)

| Panel | Filas | Cant. | Caso / nota |
|-------|-------|-------|-------------|
| **IC (incorrecto)** | 2 cabeceras | 8 + 52 | Vendedor mezcló promocional en caso normal |
| **PF (correcto)** | 2 cabeceras | 16 + 44 | PROMOCIONAL · Normal (BR-VZ-MD-ML-MKA-D) |

Acción Director: editar IC en `?tab=ics` hasta **16 + 44** y montos alineados con PF · luego reintentar Protocolo Chusa.

---

## UI operativa — dos columnas (2026-07-11)

| Elemento | Comportamiento |
|----------|----------------|
| **Panel izquierdo** | Cabeceras IC |
| **Panel derecho** | Pre-Factura interna (PF) |
| **Franja superior** | Contadores IC · PF · FI · botón **Generar N facturas · un clic** |
| **Panel central DnD** | ⛔ **Eliminado** del camino feliz — excepciones se resuelven editando IC en `?tab=ics` |
| **Post-lote** | Overlay espera ~2 min → `ChusaLoteCelebracionOverlay` → redirect `?tab=fi` |

### Regeneración obligatoria (Director · 2026-07-12 · error `4.02.03.010`)

Tras **cualquier** corrección de caso comercial (biblioteca BCL · PELE · reimport proforma):

| Regla | Detalle |
|-------|---------|
| **Administrador IC manda** | PF recalculadas en pantalla = verdad operativa |
| **Botón verde** | Con FI existentes → **«Recalcular N facturas desde proforma»** · borra RESERVADA · rehace **todas** |
| **Prohibido** | `already_done` por conteo · omitir IC con FI · «Ver resultado» sin recalcular montos |
| **API** | `POST …/generar-fi-lote` body `{ "regenerar": true }` |

Doc error: [4.02.03.010](../../../5_errores/detalle/4.02.03.010_admin-ic-boton-verde-no-recalcula-fi.md)

### Contadores post-lote (cabecera)

| Contador | Regla |
|----------|-------|
| **IC = PF = FI** | Igualdad **exacta** de filas (no `>=`) |
| **fiExceso** | Si `n_fi > n_esperadas` → aviso ámbar · API **409** en reintento |
| **Saldo KPI** | Pares F9 sin reservar · debe **0** cuando todas las líneas PPD están en FI |

### Excepción sin LPN (Director · 2026-07-11)

| Antes | Ahora |
|-------|-------|
| Omitir línea PPD sin LPN | **Crear línea FI** igual |
| No reservar stock | **Sí** `descontar_stock_pp` |
| — | `linea_snapshot.sin_lpn: true` · precio **0** · borde **ámbar** en `PpFiCard` |

Doc pormenorizado: [DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) §3.2 · §4.

---

## Prohibido (UI / producto)

- Lista de parejas con botón «Generar factura» **por fila** cuando el universo completo ya es igual.
- Recuadros verdes con scroll de N botones en banner lateral (diseño rechazado 2026-07-11).
- Habilitar lote con margen en cantidad, marca o cliente.
- Contar renglones de un panel contra totales del otro sin alinear orden canon.

---

## Implementación

| Pieza | Estado |
|-------|--------|
| `evalProtocoloChusa` / cuadro verde / lote API | ✅ local 2026-07-11 |
| UI 2 columnas · sin panel DnD · celebración | ✅ local 2026-07-11 |
| Guard anti-duplicado FI (`409` exceso) | ✅ local 2026-07-11 |
| Excepción **sin LPN** · borde ámbar FI | ✅ local 2026-07-11 |
| Corrección IC vendedor → doc § Desajuste | ✅ 2026-07-11 |
| Highlight canon celdas rojas | ✅ 2026-07-11 |
| **PP-28 piloto · 115 FI** | ✅ local 2026-07-11 · [DOC errores/soluciones](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) |
| **Auditoría PP-28 · Chusa · veneno** | ✅ [AUDITORIA_ADMIN_IC_PP28_CHUSA_VENENO_20260711](./AUDITORIA_ADMIN_IC_PP28_CHUSA_VENENO_20260711.md) |
| Validación Chusa **server-side** en lote API | ⬜ deuda · réplica resto PP |
| Réplica **todos PP PROGRAMADO** | ⬜ mañana · checklist §7 doc maestro |

---

## Referencias

| Doc | Relación |
|-----|----------|
| [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) | Layout 3 paneles · PF agrupación |
| [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) | `_shop` · smoke PP-28 |
| [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) | Import PPD |

---

**Documenta 2026-07-11 — Protocolo Chusa · canon lote Administrador de IC · Director.**
