# CHUSAR — Administrador de IC · PROGRAMADO (replanteo PP)

**Código:** **2.3.1.7.5.3.5**  
**Decisión Director:** 2026-07-10 · PP-19 (8051/2026 · 108 IC)  
**Estado:** 🟢 **CANÓNICO — reemplaza estrategia IC=FI automática**  
**Ruta futura:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=admin-ic`  
**Shibboleth:** Chayanne el mejor

---

## Decisión — abandonar estrategia actual

| Estrategia | Veredicto |
|------------|-----------|
| **1 IC = 1 FI = 1 bloque SHOP en CSV** (motor `buildProgramadoFiJobs` · ratificar IC→FI) | ⛔ **ABANDONADA** — no escalar · no refleja realidad proforma |
| Emparejamiento automático proforma fila×marca×IC por SHOP | ⛔ **ABANDONADA** como generador de FI |
| Export CSV con 108 bloques vacíos + 28 con producto (PP-19) | Síntoma del fallo — **no** es objetivo de negocio |

**Por qué (Director · PP-19):** las **IC ya están** y son válidas. Lo **fatal** es tratar la **proforma** como si debiera clonar 1:1 cada IC. En la proforma real, un mismo **código cliente (SHOP)** concentra varias marcas/casos; una IC es **una intención por marca** (u otra granularidad comercial), no una fila proforma. Forzar paridad automática dejó **~80 FI vacías** y confusión operativa.

**Código legacy a congelar (no extender):**

- `report/src/lib/pedido-proveedor/proforma-programado-engine.ts` → `buildProgramadoFiJobs`, `ratificarFiProgramadoCompleto`, botón **⚡ IC→FI**
- Regla doc previa «N FI automáticas · 1 por IC» en [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) § paso 5

Hotfixes recientes (108 FI · columna IC CSV · caché) quedan como **parche histórico** hasta migrar UI — **no** son norte.

---

## Norte — nuevo módulo

Reinventar el puente **IC ↔ proforma ↔ FI** como **herramienta visual del usuario**, no como motor ciego.

### Pestaña nueva en detalle PP

Orden de tabs (PROGRAMADO):

| # | Query | Label |
|---|--------|--------|
| 1 | `?tab=ics` | 📋 ICs Asignadas |
| 2 | **`?tab=admin-ic`** | **⚖ Administrador de IC** ← **NUEVA** |
| 3 | `?tab=stock` | 📦 Importación / Stock |
| 4 | `?tab=fi` | 🧾 Facturas Internas |

**Ubicación:** entre **IC** e **Importación** — el usuario administra la relación antes/después de importar stock.

---

## UI — dos paneles por código cliente

Layout principal del **Administrador de IC**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Cabecera PP · filtros · totales IC / FI / delta monto          │
├──────────────────────────┬──────────────────────────────────────┤
│  PANEL IZQUIERDO — ICs     │  PANEL DERECHO — FIs (proforma)      │
│  Agrupado por id_cliente   │  Agrupado por id_cliente           │
│  (SHOP / código cliente)   │  (mismo código)                    │
│                            │                                    │
│  · IC-2026-xxxx            │  · FI cliente X · marca Y · caso Z │
│  · marca · pares · monto   │  · pares · monto · caso            │
│  · listado · descuentos    │                                    │
│                            │                                    │
│         ─── flecha link ───►  (vinculación manual por monto)     │
└──────────────────────────┴──────────────────────────────────────┘
```

| Panel | Fuente | Orden |
|-------|--------|--------|
| **Izquierda — IC** | `intencion_compra` + `intencion_compra_pedido` del PP | `id_cliente` ↑ → `id` IC ↑ |
| **Derecha — FI** | Generadas desde **proforma importada** (reglas CP) | `id_cliente` ↑ → **marca** ↑ → **caso** ↑ |

**Encabezados de grupo:** un bloque por **código cliente** en cada panel; alinear visualmente filas del mismo cliente entre izquierda y derecha.

**Flecha / enlace:** acción explícita del usuario — **no** automática al importar.

---

## Procesamiento proforma — independiente de IC

### Fase A — Import (tab Stock, sin cambiar entrada Excel)

1. Subir proforma Beira Rio (columna **SHOP** = `id_cliente`).
2. **Preview** puede seguir cruzando SHOP ↔ IC para **validar pares totales** por cliente (control de calidad).
3. **PPD + pilares** — igual que hoy (`populate_pp_from_proforma`).

### Fase B — FI (nuevo motor · reglas **Compra previa**)

Tras import PPD, crear FI **sin atar 1:1 a IC**:

| Regla FI | Descripción |
|----------|-------------|
| **1 factura por cliente** | Agrupación base `id_cliente` (SHOP) |
| **× marca** | Subdivisión `id_marca` / BRAND proforma |
| **× caso comercial** | Subdivisión `precio_lista.nombre_caso_aplicado` (caso **no** vive en IC) |

→ Misma semántica que **Compra previa** (`categoria_id = 2`): FI = universo **proforma + listado**, no clon de cabecera IC.

**Independencia:** las FI del panel derecho **no** copian cabecera IC (vendedor/plazo/descuento pueden derivarse de reglas CP o defaults PP — definir en implementación).

---

## Vinculación IC ↔ FI — el clic del monto

| Campo | Rol |
|-------|-----|
| **Monto / pares IC** | Lado izquierdo · intención comercial |
| **Monto / pares FI** | Lado derecho · factura proforma |
| **Acción usuario** | Clic en par IC+FI cuando **montos (o pares) coinciden** (tolerancia configurable) → guardar vínculo |

**Casos comerciales:** no están en IC — el usuario usa **paridad de monto** como pista para enlazar intención con factura generada.

Persistencia sugerida (implementación futura):

- Tabla puente `ic_factura_interna_vinculo` (`ic_id`, `fi_id`, `vinculado_por`, `vinculado_at`, `delta_monto`)
- UI: estado visual (sin vínculo · sugerido · confirmado · conflicto)

---

## Tab Facturas Internas (`?tab=fi`) — rol después del replanteo

- **Lista / PDF / CSV** de las FI generadas por proforma (panel derecho).
- **No** botón «Regenerar 1 IC = 1 FI».
- CSV Carlos: redefinir bloques según **FI CP** (cliente×marca×caso) + columna IC solo si hay vínculo confirmado en Administrador.

---

## UI v1 — pestaña juego (2026-07-10)

**Ruta:** `?tab=admin-ic` · componente `PpTabAdministradorIc.tsx` · API `GET …/administrador-ic`

### Layout operativo — 2 columnas + lote (2026-07-11)

| Panel | Ancho | Contenido |
|-------|-------|-----------|
| **Izquierda** | ~½ pantalla | Cabecera IC · Shop · IC Nº · Marca · LP · Monto · Cant. |
| **Derecha** | ~½ pantalla | Pre-Factura interna (PF) · misma cabecera · expandible |
| **Superior** | full | Contadores IC · PF · FI · botón **Generar N facturas · un clic** (Protocolo Chusa N3) |

⛔ **Panel central DnD** retirado del camino feliz — ver [PROTOCOLO_CHUSA](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) · excepciones → editar IC en `?tab=ics`.

### Pre-Factura interna (PF)

- Agrupación proforma: **`id_cliente (SHOP) × marca × caso`** — reglas CP, **independiente de IC**.
- Cabecera PF = misma grilla que IC (dimensiones iguales).
- **Expandir PF** (▸): muestra artículos con miniatura + **5 pilares** (L · R · M · C · G).

### Regla de expansión (caso Director)

> Si un cliente tiene **dos IC** misma marca · misma cantidad · mismo caso, el sistema **no puede** saber qué producto va en cada factura. Ahí el usuario **expande** la PF y arrastra **artículos uno a uno** al centro — no la cabecera.

### Drag & drop v1

| Origen | Destino centro | Resultado |
|--------|----------------|-----------|
| Cabecera IC | Slot IC | OK |
| Cabecera PF (colapsada) | Slot Pre-FI | Pareja cabecera |
| Artículo PF (expandida) | Slot Pre-FI | Pareja granular |

**v1 local:** parejas en estado UI · persistencia BD + INSERT FI = iteración 2.

### Iteración 3 — Protocolo Chusa · lote (2026-07-11)

| Entrega | Estado |
|---------|--------|
| Canon 3 columnas · 3 niveles de control | ✅ doc |
| Cuadro verde · 2 contadores + 1 botón lote | ✅ local 2026-07-11 |
| UI 2 columnas · overlay ~2 min · celebración | ✅ local 2026-07-11 |
| Guard anti-duplicado · saldo KPI PROGRAMADO | ✅ local 2026-07-11 |
| Excepción **sin LPN** · FI precio 0 · ámbar | ✅ local 2026-07-11 |
| **PP-28 piloto** · 115 FI · 8051/2026 | ✅ local 2026-07-11 |
| Corrección IC por error vendedor (PF = verdad) | ✅ doc [PROTOCOLO_CHUSA](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) § Desajuste |
| Doc errores/soluciones + réplica PP | ✅ [DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) |
| Doc protocolo | [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) |
| **Réplica resto PP PROGRAMADO** | ⬜ mañana · checklist §7 doc maestro |

---

| Entrega | Estado |
|---------|--------|
| `_shop` canónico desde Excel | ✅ `populatePpFromProforma` + snapshot |
| Preview SHOP×BRAND | ✅ avisos Δ pares |
| Reimport PP-28 (8051/2026) | ✅ local · 912 PPD |
| Admin IC layout + GENERAR F.I. | ✅ código · smoke etapa |
| Doc | [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) |

### Código v1 Report

| Archivo | Rol |
|---------|-----|
| `administrador-ic-query.ts` | IC + PF agrupadas desde PPD |
| `…/administrador-ic/route.ts` | API GET |
| `PpTabAdministradorIc.tsx` | UI 2 columnas + lote Chusa |
| `ChusaLoteCelebracionOverlay.tsx` | Celebración post-lote |
| `generar-fi-lote/route.ts` | API lote · guard exceso |
| `administrador-ic-generar-fi.ts` | Motor FI · sin_lpn |

---

| # | Tarea |
|---|--------|
| 1 | Tab `admin-ic` · componente `PpTabAdministradorIc.tsx` |
| 2 | API GET agrupación IC por cliente + FI por cliente/marca/caso |
| 3 | Motor FI programado v2 — clonar reglas CP · **sin** `buildProgramadoFiJobs` |
| 4 | API POST/DELETE vínculo IC↔FI por monto |
| 5 | Congelar/retirar ratificar IC→FI en UI programado |
| 6 | Actualizar CSV export post-vínculo |
| 7 | Smoke PP-19: 108 IC izquierda · N FI derecha · usuario vincula por monto |

---

## Referencias

| Doc | Relación |
|-----|----------|
| [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) | Import PPD + preview SHOP — **FI automática obsoleta** |
| [CHUSAR_PP_TAB_FI](./CHUSAR_PP_TAB_FI.md) | Ala Sur · CSV/PDF — adaptar post-v2 |
| [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) | Revisar bloque SHOP/IC tras vínculo manual |
| [MAPA_ACCESO_RAPIDO_PP_DETALLE](./MAPA_ACCESO_RAPIDO_PP_DETALLE.md) | 4 pestañas |
| Compra previa FI | Streamlit / motor CP — **patrón a reutilizar** |

---

**Compilado por orden del Director — Documenta 2026-07-10 · abandono estrategia IC=FI · norte Administrador de IC.**
