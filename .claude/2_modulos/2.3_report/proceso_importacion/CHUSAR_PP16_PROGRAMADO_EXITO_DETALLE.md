# CHUSAR — PP-16 PROGRAMADO · Éxito import · Detalle completo · Errores e inconvenientes

**Código:** **2.3.1.7.5.3.3.4**  
**Estado:** ✅ **CERRADO** 2026-07-09  
**Etapa:** [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](../../../4_etapas/ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md)  
**Error índice:** `4.02.03.006` → ✅ **RESUELTO**  
**Padre:** [CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md](./CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md) · [CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md](./CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md)

---

## 1 · Resumen ejecutivo

Primera **proforma PROGRAMADO** en operación real (usuario **ALFREDO**, PP **PP-2026-0016**, BD id **25**) completó import end-to-end **2026-07-09** en local `:3000`:

- **722** moléculas `pedido_proveedor_detalle`
- **39** `factura_interna` RESERVADA (1:1 con IC)
- **8.880** pares cuadrados PPD = FI
- **0** `venta_transito` · reserva FI reflejada en `pares_vendidos` (ley solo venta)

---

## 2 · Caso de prueba (ficha)

| Campo | Valor |
|-------|--------|
| PP número | PP-2026-0016 |
| PP BD id | 25 |
| Proforma | 8600-4121 |
| Excel | `8600IMPORTARWEB.xlsx` (Beira Rio) |
| Listado / evento | PR-8600 · evento **#37** · POLITICA JUNIO 2026 |
| IC vinculadas | **39** |
| Clientes SHOP distintos | **12** |
| Pares totales | **8.880** |
| `categoria_id` PP | **3** PROGRAMADO |
| Usuario | ALFREDO · ADMIN RIMEC |

---

## 3 · Evidencia PASS (BD)

| Check SQL / script | Resultado |
|--------------------|-----------|
| `COUNT(ppd)` | 722 |
| `COUNT(fi WHERE estado=RESERVADA)` | 39 |
| `SUM(ppd.cantidad_pares)` | 8.880 |
| `SUM(fi_det.pares)` | 8.880 |
| `COUNT(ppd WHERE pares_vendidos=cantidad_pares)` | 722 |
| `COUNT(venta_transito)` | 0 |
| `COUNT(intencion_compra_pedido)` | 39 |
| Script audit | `node scripts/audit_pp25_aritmetica.mjs 25` |

**UI:** mensaje verde Director post-import confirmado.

---

## 4 · Cronología día a día

### 2026-07-08 — Apertura etapa · fallo operativo

| Hora (aprox.) | Evento |
|---------------|--------|
| Mañana | Director abre etapa PP16 · Alfredo intenta primera import prod |
| — | Preview SHOP↔IC: errores masivos contradictorios |
| — | Paso 2 >5 min sin overlay · pantalla quieta |
| — | Alfredo se retira |
| Noche | BD: 722 PPD · **0 FI** · error `4.02.03.006` abierto |
| Noche | Cursor despliega fixes `644f091`→`777898c` |

### 2026-07-09 — Retoma local · PASS

| Hora (aprox.) | Evento |
|---------------|--------|
| — | Replanteo UI IC PROGRAMADO (SHOP, sin default 276) |
| — | Fix gate borrar · aritmética tier LP · KPI GREATEST |
| — | Borrar import + re-import local |
| — | Preview 12 SHOP ✅ · Import 3–6 min · **39 FI** |
| Noche | Director confirma éxito · orden cierre doc + nueva etapa inyección IC |

---

## 5 · Catálogo completo de errores e inconvenientes

### 5.1 · Errores de código (resueltos)

| # | ID / tema | Síntoma | Causa raíz | Fix | Commit / fecha |
|---|-----------|---------|------------|-----|----------------|
| 1 | **4.02.03.006** | 722 PPD · 0 FI | `categoria_id === 3` falla con string `'3'` de Postgres | `Number(categoria_id)` en motor | `70f594f` |
| 2 | Motor prod | Preview/import falla o parcial | Vercel sin Python | Motor TS `proforma-programado-engine.ts` | `644f091` |
| 3 | Preview SHOP | «SHOP sin IC» + «Cliente sin filas» a la vez | `Map` con claves string vs number en `id_cliente` | Normalizar `Number(id_cliente)` | `a34c660` |
| 4 | UX paso 2 | Usuario cree colgado 5+ min | Sin overlay · timeout default | `ProcesoImportacionWaitOverlay` + `maxDuration=300` | `777898c` |
| 5 | Borrar prod | Botón no responde | `runProformaBorrarPython` en Vercel | `borrarImportacionTs` | `70f594f` |
| 6 | Borrar post-FI | «Hay ventas» con Web=0 | Gate usaba `pares_vendidos` reserva FI | Gate = `venta_transito` + FI CONFIRMADA | local 2026-07-09 |
| 7 | Precio FI | Solo LPN ignorando LPC04 IC | Import TS una columna `lpn` | `aritmetica-programado.ts` 4 tiers | local 2026-07-09 |
| 8 | FOB cabecera | Descuentos mal aplicados | TS trataba % como fracción 0–1 | `calcFobAjustadoPct` divide `/100` | local 2026-07-09 |
| 9 | KPI cabecera | `total_vendido` inflado | Sumaba vt + pares_vendidos | `GREATEST(SUM(vt), SUM(pv))` | local 2026-07-09 |
| 10 | Badge LP tab FI | Falso positivo cliente 286 | Join naive FI↔IC | Join vendedor + pares cercanos | `detail-query.ts` |
| 11 | UI IC PROGRAMADO | Default cliente 276 STOCK | Semántica CP en rama programado | Replanteo SHOP · guía cabecera | local 2026-07-09 |

### 5.2 · Inconvenientes operativos (no bugs de lógica)

| # | Inconveniente | Impacto | Mitigación |
|---|---------------|---------|------------|
| A | **Terminal Cursor** no captura logs del `next dev` externo | No ver POST `/proforma` en archivo terminal | `dev:clean:3000` en terminal Cursor visible |
| B | Instancia `.next` corrupta (terminal `673712.txt` vieja) | Confusión al leer logs antiguos | Distinguir pid activo (30244) vs proceso muerto |
| C | Import paso 2 **3–6 min** | Impaciencia operador | Overlay + tiempos doc CHUSAR |
| D | **27/39 IC** con `listado_precio_id=1` (LPN) vs FI LPC04 | Desalineación tier LP pre-CSV Carlos | Backfill IC o `/recalcular-fi` — pendiente |
| E | Join audit naive en script | Falsos positivos LP mismatch | Mejorar `audit_pp25_aritmetica.mjs` |
| F | Prod Alfredo no repitió smoke post-fix local | Riesgo percepción «sigue roto» | Smoke prod bajo orden Director |
| G | Vercel plan / timeout 300s | PP grandes en prod | Verificar plan Pro |
| H | Pilares tono multicolor | Manual post-import Pilares→Color | Regla negocio documentada |

### 5.3 · Lecciones Alejandro Magno

1. **PROGRAMADO** = instrumento venta — IC es cabecera comercial SHOP, no logística CP.  
2. **Aritmética 100% BD** — UI nunca calcula neto/tier.  
3. **BigInt/string Postgres** — siempre `Number()` en comparaciones JS.  
4. **Reserva FI ≠ venta Web** — gate borrar debe separar ambos.  
5. **Volumen IC** (412+) exige **inyección Excel** — siguiente etapa.

---

## 6 · Archivos código tocados

| Archivo | Cambio |
|---------|--------|
| `proforma-programado-engine.ts` | Import atómico · FI · tier LP · borrar TS |
| `aritmetica-programado.ts` | **Nuevo** — fórmulas canónicas tier/descuento |
| `borrar-import.ts` | Gate venta Web |
| `detail-query.ts` | KPI GREATEST · join FI↔IC |
| `pilares-proforma-upsert.ts` | Material/color + tono_canon |
| `PpTabStock.tsx` | Overlays · vendidos Web vs reservados FI |
| `IntencionCompraNuevaClient.tsx` | Rama PROGRAMADO · SHOP |
| `IcProgramadoCabeceraGuide.tsx` | **Nuevo** — cadena IC→FI→CSV |
| `CampoShopProgramado.tsx` | **Nuevo** — col. J semántica |
| `IcPendienteCard.tsx` | Header SHOP + badge LP |
| `PedidoProveedorDetalleClient.tsx` | Guía CHUSAR · badge SHOP |
| `pendientes-query.ts` · `detail-query.ts` | `id_cliente` en queries |
| `scripts/audit_pp25_aritmetica.mjs` | **Nuevo** — smoke aritmética |

**Python paridad (local/Streamlit):** `control_central/modules/pedido_proveedor/logic.py`

---

## 7 · Tiempos operativos medidos

| Paso | Duración |
|------|----------|
| Borrar import previo | 5–15 s |
| Preview paso 1 | 30–90 s |
| Import paso 2 | **3–6 min** (722 SKUs · pilares · 39 FI) |
| Audit script | <5 s |

---

## 8 · Secuencia operativa canónica (repetible)

```
LOCAL :3000
  → Borrar importación (si vendidos Web = 0)
  → Elegir Excel proforma Beira Rio
  → Paso 1 Preview (overlay)
  → Validar: N SHOP = clientes Excel col. J · Σ pares = cupo IC
  → Paso 2 Import (overlay 3–6 min)
  → Tab FI: N FI RESERVADA = N IC
  → node scripts/audit_pp25_aritmetica.mjs {ppId}
  → CSV Carlos (post-alineación LP)
```

---

## 9 · Índice Moria

| Código | Doc |
|--------|-----|
| 2.3.1.7.5.3.3.2 | Caso Alfredo (padre) |
| 2.3.1.7.5.3.3.3 | Borrar import |
| 2.3.1.7.5.3.3.4 | **Este doc** |
| 2.3.1.7.5.3.4 | Instrumento venta AM |
| 4.02.03.006 | Error resuelto |

---

**Shibboleth:** Andrés, el que viene.
