# CHUSAR — Logística · Cabeceras Carlos ~900M Gs (Excel) · color distinto

**Código:** **2.3.1.28.10** · Padre **2.3.1.28**  
**Estado:** 🟢 **EN CURSO** · etapa `LOGISTICA-RIMEC-TXT-20260728`  
**Ratificado plan:** 2026-07-27 · **activado** 2026-07-28 (**Nueva etapa**)  
**App:** Report `/logistica-ok` · UI dual **Logística de Proceso** \| **Logística Rimec**  
**Etapa activa:** [ETAPA_LOGISTICA_RIMEC_TXT_20260728.md](../../../4_etapas/ETAPA_LOGISTICA_RIMEC_TXT_20260728.md)  
**Fuente real:** TXT `csv's/Logistica/52986482 hector.txt` (informe genérico ventas · **no** Excel)

---

## Contexto (dato duro Director)

En el **sistema Carlos** hay un volumen del orden de **~ Gs 900.000.000** en facturas / pedidos **sin confirmar** (aún fuera del circuito de confirmación operativa de Logística OK en Nexus).

Ese stock de cabeceras **debe entrar** a Logística OK para operar entregas, sin confundirse visualmente con el flujo “nativo” (FI generadas / sync post-cierre Carlos completo).

---

## Plan general (acordado)

| # | Qué | Cómo |
|---|-----|------|
| 1 | **Fuente** | Excel de **cabeceras** de ese universo (~900M Gs) |
| 2 | **Inserción** | Import Excel → filas en bandeja Logística (proceso integrado) |
| 3 | **Integración** | Mismo módulo `/logistica-ok` · mismas pestañas / semáforo / Ley FI cuando aplique |
| 4 | **Diferenciación** | **Color distinto** en fila / chip / origen (no mezclar a ojo con FI “Nexus nativas”) |
| 5 | **Evolución** | Detalle de columnas, matching FI/IC y reglas de confirmación se cierran **en la etapa** (no inventar ahora) |

**Frase de diseño:** *integrados en Logística, pero con identidad visual propia (origen Carlos · backlog ~900M)*.

---

## Qué NO es (aún)

- No es el cierre CSV completo IC+FI+pv_global del puente **2.3.1.7.5.3.9** (eso sigue siendo el flujo “cierre Carlos” por PP).
- No es borrar ni reescribir las FI ya en `logistica_pendiente_confirmacion`.
- No es deploy prod hasta **Cierra etapa** u orden directa.

---

## Relación con lo ya construido

| Pieza | Código | Rol respecto a esta etapa |
|-------|--------|---------------------------|
| Plan pestañas / semáforo | **2.3.1.28.5** | Contenedor UI donde viven las filas nuevas |
| Sync post-import cierre Carlos | **2.3.1.28.7** | Flujo “completo” PP — distinto de este Excel de cabeceras |
| PE al confirmar FI | **2.3.1.28.8** | Confirmación nativa — las filas Excel deben poder confirmarse igual (o con regla explícita) |
| Ley FI acordeón | **2.3.1.28.9** | Paridad detalle cuando exista FI Nexus enlazada |
| Puente Carlos Factura Real | **2.3.1.7.5.3.9** | Referencia `pv_global` / nomenclatura Carlos |

---

## Entregables esperados (cuando se diga **Nueva etapa**)

1. Spec Excel (columnas mínimas cabecera: nro Carlos, cliente, vendedor, monto, fecha, etc.).
2. Motor import (script o UI Report) → tabla puente / `logistica_pendiente_confirmacion` con **flag origen** (ej. `origen = CARLOS_BACKLOG_EXCEL`).
3. UI: color distinto + label legible (“Carlos · backlog” o similar).
4. Smoke: suma montos cabecera ≈ orden **900M** · filas visibles en GENERAL · no rompen semáforo.
5. Documenta cierre + deploy según protocolo.

---

## Abierto (Director decide en etapa)

- ¿Color exacto (hex) y chip de texto?
- ¿Una fila Excel = 1 FI Nexus ya existente, o alta “cabecera-only” hasta emparejar?
- ¿Quién confirma fechas (misma UX Logística)?
- ¿Lote único ~900M o cortes por vendedor/día?

---

## Activación

| Ahora (2026-07-27) | Después |
|--------------------|---------|
| Plan Chusar **2.3.1.28.10** + etapa **borrador** | Director: **Nueva etapa** → `trabajoVivo` + foco ACTUAL |

**Shibboleth:** Andrés, el que viene.
