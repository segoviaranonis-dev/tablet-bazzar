# CHUSAR — Listado motor por FI · imposición · precio 0 sin match

**Código:** **2.3.1.7.5.3.14** · **Ratificado:** Director · 2026-07-26  
**Keyword:** Documenta · **App:** Report · **Piloto:** PP-38  
**Ruta UI:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=fi`  
**Shibboleth:** Andrés, el que viene.

---

## Norte

Cada **factura interna (FI)** del PP tiene un **selector de listados del motor de precios** (`precio_evento.id` — ej. #2, #27, #45, #56). **No** son tiers LPN/LPC02/LPC03/LPC04 (1–4).

Al elegir un evento:

1. Actualiza `intencion_compra.precio_evento_id` + `intencion_compra_pedido.precio_evento_id` del SHOP de esa FI.
2. Recalcula **inmediatamente** precio de venta por línea desde **`precio_lista`** (L+R+material, redondeo comercial MIG-179).
3. Sincroniza **Logística OK** (`syncLogisticaMontosDesdeFi` + bandera PP si aplica).
4. Muestra **reporte** en la tarjeta FI: monto anterior · monto nuevo · variación · desglose SKUs.

**Ley inviolable (Director 2026-07-26):** `precio_lista` es la **verdad**. Sin match en el evento elegido → **precio 0** en esa línea (prohibido fallback snapshot `ppd.precio_lpc0x`).

---

## Qué NO es (malentendido corregido)

| Concepto | Rol | UI tab FI |
|----------|-----|-----------|
| **Listado motor** | Evento cerrado del motor · filas en `precio_lista` | `<select>` violeta por FI |
| **Tier LP 1–4** | LPN / LPC02 / LPC03 / LPC04 · multiplicador sobre base listado | `SelectorPoliticaLp` (gris) · PATCH `lista-precio` |
| **Botón rojo «Asignar listado de Precios»** | Impositor **tier** post-ENVIADO · [2.3.1.7.5.3.10](./CHUSAR_RECALC_LP_LOGISTICA_POST_COMPRAS.md) | **Retirado** del tab FI — confundía tier con evento motor |

Post-ENVIADO: el dropdown listado motor sigue activo en FI RESERVADA/CONFIRMADA (`allowPpEnviado: true`).

---

## Flujo operativo (un clic)

```
Operador expande FI → elige evento motor en select violeta
        │
        ▼
PATCH …/fi/[fiId]/listado-motor  { evento_id: N }
        │
        ├─ actualizarListadoMotorFiDesdePp()
        │     ├─ UPDATE IC + ICP precio_evento_id (SHOP = fi.cliente_id)
        │     ├─ resincronizarFiDesdeListadoPp({ forzarSoloPrecioLista, precioEventoIdOverride })
        │     └─ syncLogisticaMontosDesdeFi + syncLogisticaPpIfBandera
        │
        ▼
UI: PpListadoMotorReportePanel + reload PP (montos cabecera)
```

**Rollback IC:** si resync falla transaccionalmente, revierte `precio_evento_id` al valor anterior.

---

## Reglas de precio (motor)

### Lookup SQL

| Función | Uso |
|---------|-----|
| `sqlPrecioBaseFiDetalleSoloEvento(tier)` | Solo `precio_lista` · **sin** fallback PPD |
| `sqlFromFiDetallePrecioEventoOverride($3)` | Evento fijo en imposición (no primer ICP del PP) |
| `sqlPrecioComercialDesdePl(tier)` | Redondeo centena · LPC03 ×1.12 · LPC04 ×1.20 |
| `SQL_FROM_FI_DETALLE_PRECIO` | Resync normal · IC por `fi.cliente_id` |

Join `pl_fk` + lateral `pl_cod` por L+R (+ material preferido si FK existe).

### Por línea (`forzarSoloPrecioLista: true`)

| Caso | `precio_unit` | `precio_neto` | PPD tier column |
|------|---------------|---------------|-----------------|
| Match en `precio_lista` | base comercial | cascada descuentos FI | base |
| **Sin match** | **0** | **0** | **0** |
| PPD | `listado_precio_id` = evento impuesto | | |

Descuentos FI (d1–d4) aplican solo si base > 0.

### Estadísticas reporte

| Campo | Significado |
|-------|-------------|
| `skus_total` | Líneas FI |
| `skus_ok` | Líneas con precio > 0 desde listado |
| `skus_sin_match` | Líneas impuestas a **0** |
| `skus_cambiados` | Líneas cuyo neto ≠ neto anterior |
| `todos_skus_ok` | `skus_sin_match === 0` |
| `hubo_cambio_monto` | `total_monto` ≠ anterior |

---

## Cobertura PP en selector (informativo)

GET `/api/proceso-importacion/pedido-proveedor/[ppId]` incluye `listadoMotorCobertura[]`:

- Cuenta moléculas **L+R únicas** de todas las FI del PP vs filas `precio_lista` por `evento_id`.
- Dropdown ordena por `%` descendente · etiqueta: `{label} · PP {pct}% ({match}/{total})`.
- **No bloquea** eventos al 0% — el operador puede imponer igual; las líneas sin match quedan en 0.

Scripts diagnóstico:

```bash
node scripts/_monitor_listado_motor_pp38.mjs
node scripts/_monitor_eventos_cobertura_pp.mjs 38
```

---

## API

### PATCH listado motor FI

`PATCH /api/proceso-importacion/pedido-proveedor/[ppId]/fi/[fiId]/listado-motor`

**Auth:** `requireMotorPreciosAdmin` (rol motor precios / admin).

**Body:**

```json
{ "evento_id": 27 }
```

**Respuesta 200:**

```json
{
  "ok": true,
  "report": { "skus_total": 2, "skus_ok": 1, "skus_sin_match": 1, "monto_antes": 2817600, "monto_despues": 1137600, "delta_monto": -1680000, "evento_id": 2, "logistica_sync": true, "ms_server": 1608 },
  "total_monto": 1137600
}
```

---

## Código (mapa archivos)

| Capa | Archivo | Rol |
|------|---------|-----|
| UI select + reporte | `PpFiCard.tsx` | Dropdown · `aplicarListadoMotor` |
| UI panel montos | `PpListadoMotorReportePanel.tsx` | Cajas anterior/nuevo/Δ |
| Tab FI | `PpTabFacturasInternas.tsx` | Pasa `eventos` + `listadoMotorCobertura` |
| Client PP | `PedidoProveedorDetalleClient.tsx` | State cobertura desde GET PP |
| API | `…/fi/[fiId]/listado-motor/route.ts` | PATCH |
| Orquestación | `fi-pp-actions.ts` · `actualizarListadoMotorFiDesdePp` | IC + resync + logística |
| Resync | `aprobaciones-mutations.ts` · `resincronizarFiDesdeListadoPp` | Loop líneas · stats |
| Lookup SQL | `fi-precio-evento-lookup.ts` | Solo evento · override |
| Cobertura | `listado-motor-cobertura.ts` | `listEventoCoberturaPp` · `getEventoCoberturaFi` |
| Tipos cliente | `listado-motor-fi-types.ts` | `ListadoMotorFiReport` · `fmtReporteListadoMotor` |
| GET PP enriquecido | `…/pedido-proveedor/[ppId]/route.ts` | `listadoMotorCobertura` |

---

## Evidencia PP-38 (2026-07-26)

### Cobertura moléculas L+R (145 únicas en FI)

| Evento | Match | Nota |
|--------|-------|------|
| #2 | 25/145 (17%) | Mejor cobertura probada |
| #4 | 16/145 (11%) | |
| #35 / #18 | 9/145 (6%) | |
| #27–#30, #45, #47, #56 | **0%** | Ninguna molécula PP-38 en esos listados |

### Pruebas automatizadas (`_test_listado_motor_cero_pp38.mts`)

| FI | Evento | Monto antes | Monto después | Resultado |
|----|--------|-------------|---------------|-----------|
| 38-PV001 (#3423) | #27 | Gs. 1.311.600 | **Gs. 0** | 1/1 sin match → 0 · Logística OK |
| 38-PV002 (#3424) | #2 | Gs. 2.817.600 | **Gs. 1.137.600** | 1 con precio · 1 → 0 |

```bash
npx tsx scripts/_test_listado_motor_cero_pp38.mts 38 3423 27
npx tsx scripts/_test_listado_motor_cero_pp38.mts 38 3424 2
```

**⚠ Datos piloto:** PV001 quedó en Gs. 0 con IC evento #27 tras prueba — restaurar desde backup IC/#45 si operación real lo requiere.

### Causa raíz histórica «no cambiaba»

Antes: sin match → fallback `ppd.precio_lpc03` → mismo monto siempre.  
Ahora: `forzarSoloPrecioLista: true` + precio **0** → monto FI baja de forma visible.

---

## UI · NIIF

| Elemento | Patrón |
|----------|--------|
| Label select | `Listado motor · recalc inmediato → Logística OK` · violeta |
| Reporte | `PpListadoMotorReportePanel` · ámbar si sin match · verde si todo OK |
| Tier LP | Sin cambio · selector gris existente |

---

## Relación con otros CHUSAR

| Código | Doc | Relación |
|--------|-----|----------|
| 2.3.1.7.5.3.2 | [CHUSAR_PP_TAB_FI](./CHUSAR_PP_TAB_FI.md) | Tab contenedor |
| 2.3.1.7.5.3.2 | [CHUSAR_VINCULACION_LISTADO](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) | Vincular **todo el PP** desde Stock |
| 2.3.1.7.5.3.10 | [CHUSAR_RECALC_LP](./CHUSAR_RECALC_LP_LOGISTICA_POST_COMPRAS.md) | Impositor **tier** · distinto flujo |
| 2.3.1.7.3 | [CHUSAR_IC_PROBLEMA_2](./CHUSAR_IC_PROBLEMA_2_LISTADO_LP.md) | `precio_evento_id` en IC |
| 2.3.1.28 | Logística OK | Sync montos post-FI |

---

## § Deploy completo — preparado 2026-07-26

**Producto:** Report (`report/`) · **Sin migraciones BD** · **Sin cambio rimec-web**.

### Pre-flight ✅

| Check | Estado |
|-------|--------|
| `npm run build` Report | ✅ exit 0 · Next 15.5.18 |
| Tipos / lint archivos tocados | ✅ |
| Scripts smoke | `_test_listado_motor_cero_pp38.mts` · monitores `.mjs` |
| Auth prod | Motor precios admin en PATCH |

### Secuencia deploy (Director ordena)

1. **Commit** `report/` — mensaje sugerido: *Imponer listado motor por FI · precio 0 sin match · reporte Logística*
2. **Push** `main` (o rama acordada)
3. **Vercel** Report — redeploy automático
4. **`productos.json`** → `"ultimoDeployActivo": true` solo en slug `report`
5. **Smoke prod:** PP piloto tab FI · un clic listado · verificar reporte + Logística OK
6. **Opcional cierre etapa:** `etapas.json` + doc CERRADA si el Director cierra etapa dedicada

### Puerta CHUNA

Deploy prod requiere **cierre etapa canónico** o **orden directa Director** — [CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md](../../../1_fundamentos/1.1_protocolos/CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md).

### Post-deploy operativo

- Preferir eventos con cobertura > 0% en dropdown (ej. #2 PP-38).
- Evento 0% cobertura = FI puede quedar en **Gs. 0** — comportamiento esperado.
- Latencia PATCH ~1.5–20s/FI (resync línea a línea + reload PP) — optimización futura si hace falta.

---

## Smoke manual (local :3000)

1. `/proceso-importacion/pedido-proveedor/38?tab=fi`
2. Expandir FI · ver select con `· PP X%`
3. Elegir evento #2 → reporte verde/ámbar · monto cabecera cambia
4. Elegir evento #27 → líneas a 0 · monto → 0
5. Logística OK — fila FI con `monto_neto` alineado

---

**Documenta:** Director 2026-07-26 · Cursor Auto · sesión listado motor PP-38.
