# DOC — Administrador IC · Lote FI PROGRAMADO · PP-28 · Errores y soluciones

**Código:** **2.3.1.7.5.3.5.3**  
**Fecha:** 2026-07-11  
**Estado:** 🟢 **CANÓNICO LOCAL** — caso piloto **PP-2026-0019** (`pp_id=28`) · replicar a **todos los PP PROGRAMADO**  
**Decisión Director:** 2026-07-11 · lote Chusa · excepción **sin LPN** · documentación handoff mañana  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Propósito del documento

Registrar **pormenorizadamente**:

1. El **mapa del proceso** (cabecera vs molécula).
2. El **intento exitoso** en PP-28 con **excepción sin LPN** (borde ámbar).
3. **Todos los errores** encontrados en la sesión 2026-07-11 y **soluciones implementadas**.
4. **Checklist de réplica** para el resto de PP `categoria_id=3` (PROGRAMADO).
5. **Handoff mañana** — qué falta antes de escalar a PP-17, PP-16, etc.

**No reemplaza:** [DOC_PROCESO_PROGRAMADO_COMPLETO](./DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711.md) (**2.3.1.7.5.3.9** — cadena completa Motor→FI) · [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) (reglas N1–N3) · [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) (layout).

---

## 2 · Mapa del proceso — dos capas

### 2.1 Capa CABECERA (Protocolo Chusa)

| Símbolo UI | Qué cuenta | Fuente |
|------------|------------|--------|
| **IC 115** | Cabeceras intención de compra | `intencion_compra_pedido` + filtros admin |
| **PF 115** | Grupos pre-factura (cliente·marca·caso) | PPD agrupado · `administrador-ic-query` |
| **FI 115** | Facturas internas generadas | `factura_interna WHERE pp_id` |

**Regla:** `IC = PF = FI` en **cantidad de filas** + canon **cliente · marca · pares** por índice i↔i.

**Un clic lote:** `POST …/administrador-ic/generar-fi-lote` · parejas armadas **en servidor** (`construirParejasLoteChusa`) · ~2 min para 115 FI.

### 2.2 Capa MOLÉCULA (KPI cabecera PP)

| KPI | Qué mide | Fórmula |
|-----|----------|---------|
| **Pares IC** | Compromiso comercial | Σ `intencion_compra.cantidad_total_pares` |
| **Artículos F9** | Filas PPD importadas | COUNT `pedido_proveedor_detalle` con línea |
| **Saldo** | Pares F9 **sin reservar** | `pares_inicial − vendido` |

Donde:

- `pares_inicial` = Σ `ppd.cantidad_pares` (stock F9).
- `vendido` = max(`venta_transito`, `ppd.pares_vendidos`) **salvo** PROGRAMADO sin FI → solo `venta_transito`.
- Cada línea FI llama `descontar_stock_pp(ppd_id, pares)` → incrementa `pares_vendidos`.

**Regla Director (2026-07-11):** con **0 FI**, saldo **debe = pares inicial** (9400). Con **115 FI completas** y todas las líneas en FI, saldo **= 0**.

**Error conceptual frecuente:** confundir **115 filas** con **9400 pares**. IC=PF=115 **no implica** saldo 0 hasta que **todos los PPD** estén en FI.

### 2.3 Diagrama de flujo

```
Import F9 (?tab=stock)
    ↓
PPD 912 art · 9400 pares · _shop desde Excel
    ↓
ICs asignadas (?tab=ics) — 115 cabeceras · 9400 p
    ↓
Administrador IC (?tab=admin-ic)
    N1: contador IC = PF
    N2: canon cliente·marca·cant por fila
    N3: botón «Generar N facturas · un clic»
    ↓
POST generar-fi-lote (~120 s)
    ↓
115 FI RESERVADA (?tab=fi)
    · líneas con LPN → precio normal
    · líneas sin LPN → precio 0 · borde ámbar · sin_lpn en snapshot
    ↓
Saldo KPI = 0 (si todo PPD reservado)
    ↓
CSV veneno Carlos (?tab=fi)
```

---

## 3 · Caso piloto PP-28 / PP-2026-0019

| Campo | Valor |
|-------|--------|
| `pp_id` | **28** |
| `numero_registro` | **PP-2026-0019** |
| Proforma | 8051/2026 |
| IC | 115 · 9400 pares |
| PPD | 912 artículos |
| Evento precios | vinculado vía IC |

### 3.1 Intento exitoso (con excepción)

Tras borrar intentos corruptos y re-ejecutar lote con regla **sin LPN**:

- **115 FI** creadas.
- **~13 líneas** (~124 pares históricos) sin LPN en listado → **entran en FI** con precio 0.
- UI tab FI: borde **ámbar** + badge **Sin LPN** en `PpFiCard`.
- Cabecera: **IC 115 = PF 115 → FI 115**.

### 3.2 Excepción sin LPN (regla canónica 2026-07-11)

| Antes (rechazado) | Ahora (Director) |
|-------------------|------------------|
| Omitir línea sin LPN | **Crear línea en FI** |
| No descontar stock | **Sí** `descontar_stock_pp` |
| Fallar lote | Lote continúa |
| — | `linea_snapshot.sin_lpn: true` |
| — | UI borde ámbar · precio Gs. 0 |

**Archivos:** `administrador-ic-generar-fi.ts` · `linea-snapshot-display.ts` · `PpFiCard.tsx`.

---

## 4 · Catálogo de errores y soluciones

### 4.1 Tabla maestra

| # | Síntoma | Causa raíz | Solución | Archivo / acción |
|---|---------|------------|----------|------------------|
| E1 | Botón lote · POST **400** · IC 1168 | PPD sin LPN · motor omitía líneas | Fallback LPN: `pl_fk` → `pl_cod` lateral → `ppd.precio_lpn*` | `administrador-ic-generar-fi.ts` `loadSkusPpd` |
| E2 | POST 400 · parejas incoherentes | Body cliente ≠ servidor | Parejas solo servidor: `construirParejasLoteChusa` en API | `generar-fi-lote/route.ts` |
| E3 | UI «Nivel 3 listo» · no hay FI | Usuario mira admin-ic · FI en `?tab=fi` | Redirect + overlay + mensaje explícito | `PpTabAdministradorIc.tsx` |
| E4 | POST 200 ~122 s · «no pasó nada» | Lote lento sin feedback | `ProcesoImportacionWaitOverlay` ~2 min | `PpTabAdministradorIc.tsx` |
| E5 | **120 FI** vs **115 IC** | Re-ejecutar lote sin borrar | Guard API: `n_fi > n_esperadas` → **409** · UI `fiExceso` ámbar | `generar-fi-lote/route.ts` + UI |
| E6 | Saldo **124** con **0 FI** | Borrar FI sin reset `pares_vendidos` | `borrarFiReservadasProgramado` restaura stock · reset manual PP-28 | `proforma-programado-engine.ts` |
| E7 | Saldo **124** con **115 FI** | Líneas sin LPN **omitidas** (no en FI) | Crear FI igual · flag `sin_lpn` · reservar pares | `administrador-ic-generar-fi.ts` |
| E8 | Saldo ≠ 0 con 0 FI tras borrado | KPI contaba `pares_vendidos` fantasma | PROGRAMADO + `n_fi=0` → vendido = solo `venta_transito` | `detail-query.ts` |
| E9 | Página **500** · MODULE_NOT_FOUND | `next build` con dev :3000 activo | `npm run dev:clean:3000` | operación |
| E10 | Build TSX **Unexpected token** | `))}` duplicado en `.map` | Quitar cierre extra | `PpTabAdministradorIc.tsx` |
| E11 | Panel central DnD innecesario | UX rechazada Director | Eliminado · 2 columnas · solo botón lote | `PpTabAdministradorIc.tsx` |
| E12 | Canon rojo engañoso (verde global) | `matchNivel` ring verde | Solo rojo pulsante en 3 cols canon | `administrador-ic-monto.ts` + UI |
| E13 | ICs Asignadas sin monto/plazo | Campos no persistían | PATCH `monto_bruto` + `id_plazo` | `PedidoProveedorDetalleClient.tsx` |

### 4.2 Secuencia cronológica sesión (terminal 102080)

1. POST generar-fi-lote **400** ×3 (E1 · E2).
2. Fix LPN + parejas servidor.
3. POST **200 in 122841 ms** · 115 FI (primer éxito).
4. Re-clics → 120 FI (E5).
5. Borrado 120 FI · reset stock.
6. UI simplificada · celebración · saldo fixes.
7. Segundo lote 115 FI · excepción sin LPN (E7).
8. Documentación handoff (este archivo).

---

## 5 · Implementación código (inventario)

### 5.1 Backend

| Ruta / lib | Rol |
|------------|-----|
| `…/administrador-ic/generar-fi-lote/route.ts` | Lote · guard exceso · skip IC con FI |
| `…/administrador-ic/generar-fi/route.ts` | FI unitaria (legacy excepciones) |
| `administrador-ic-generar-fi.ts` | Motor FI · LPN fallback · sin_lpn |
| `administrador-ic-monto.ts` | Chusa N1–N3 · parejas · canon |
| `administrador-ic-query.ts` | IC + PF desde PPD |
| `detail-query.ts` | Saldo KPI PROGRAMADO |
| `proforma-programado-engine.ts` | `borrarFiReservadasProgramado` + restore stock |
| `cabecera-actions.ts` | PATCH IC monto/plazo |

### 5.2 Frontend

| Componente | Rol |
|------------|-----|
| `PpTabAdministradorIc.tsx` | UI lote · IC=PF=FI · sin panel DnD |
| `ChusaLoteCelebracionOverlay.tsx` | Celebración post-lote |
| `ProcesoImportacionWaitOverlay.tsx` | Bloqueo ~2 min |
| `PpFiCard.tsx` | Borde ámbar sin LPN |
| `PedidoProveedorDetalleClient.tsx` | Tabs · KPI cabecera |

### 5.3 Snapshot FI sin LPN

```json
{
  "linea_codigo": "2305",
  "ref_codigo": "2014",
  "ic_id": 1168,
  "origen": "administrador-ic",
  "sin_lpn": true
}
```

---

## 6 · Operaciones BD — borrar intento corrupto

**Solo FI RESERVADA** · sin CONFIRMADA · sin venta Web.

Orden:

1. Restaurar `pares_vendidos` desde `factura_interna_detalle` (por ppd_id).
2. DELETE detalle + cabecera FI.
3. Verificar: `n_fi=0` · `SUM(pares_vendidos)=0` · `SUM(cantidad_pares)=9400`.

**Función canónica:** `borrarFiReservadasProgramado(ppId)` en `proforma-programado-engine.ts`.

**PP-28 ejecutado 2× en sesión:** 120 FI borradas · luego 115 FI borradas antes del intento final.

---

## 7 · Réplica a todos los PP PROGRAMADO

### 7.1 Precondiciones por PP

| # | Check | Cómo verificar |
|---|-------|----------------|
| P1 | `categoria_id = 3` | Cabecera PP |
| P2 | Proforma importada · PPD > 0 | `?tab=stock` |
| P3 | `_shop` correcto en `grades_json` | [CHUSAR_RECONSTRUCCION_SHOP](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) |
| P4 | ICs asignadas = cabeceras esperadas | `?tab=ics` |
| P5 | N1+N2 Chusa verde | `?tab=admin-ic` |
| P6 | Evento precios vinculado | Stock · panel listado |
| P7 | Sin FI RESERVADA previa corrupta | KPI Facturas = 0 o borrar |

### 7.2 Procedimiento estándar (por PP)

1. Abrir `…/pedido-proveedor/[ppId]?tab=admin-ic`.
2. Confirmar **IC n = PF n** y canon sin rojo pulsante.
3. Si hay FI viejas incorrectas → `borrarFiReservadasProgramado` (Claude Code / script bajo supervisión).
4. Clic **Generar N facturas · un clic** · no cerrar pestaña ~2 min.
5. Celebración → tab **Facturas Internas**.
6. Validar: **Facturas = IC** · **Saldo = 0** (o líneas ámbar sin LPN documentadas).
7. CSV veneno · smoke AM si aplica.

### 7.3 PP conocidos en holding

| PP | Registro | Notas réplica |
|----|----------|---------------|
| **28** | PP-2026-0019 | ✅ Piloto · 8051/2026 · doc este archivo |
| **17** | PP-2026-0017 | [CHUSAR_PP17](./CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO.md) · 98 IC |
| **16** | PP-2026-0016 | ✅ Cerrado histórico · motor viejo · revisar Chusa |
| *lista* | `?ramo=programado` | Iterar quincena activa |

### 7.4 Deuda antes de réplica masiva

| ID | Tarea | Prioridad |
|----|-------|-----------|
| D1 | Validación Chusa **100% server-side** pre-lote | Alta |
| D2 | Script operativo `borrar_fi_reservadas_pp.ts` (wrapper público) | Media |
| D3 | Reporte post-lote: conteo `sin_lpn` por PP | Media |
| D4 | Completar LPN faltantes en motor precios (13 SKUs PP-28) | Baja · no bloquea FI |
| D5 | Deploy prod Report (solo Claude Code + Director) | Alta · post smoke local |

---

## 8 · Handoff mañana (2026-07-12)

### 8.1 Estado al cierre 2026-07-11

- Código local **OK** · build pasa · :3000 con `dev:clean:3000`.
- PP-28: intento final con **sin LPN** documentado · previo borrado hecho.
- Etapa `ADMIN-IC-PP28-20260711` **abierta** · réplica resto PP pendiente.

### 8.2 Orden sugerido mañana

1. **Smoke PP-28:** refrescar admin-ic + fi · confirmar 115 FI · saldo 0 · ámbar sin LPN.
2. **CSV 8051-26** desde tab FI.
3. **PP-17** (o siguiente en lista programado): repetir checklist §7.
4. Cerrar etapa PP-28 si smoke PASS · `etapas.json` + doc CERRADA.
5. Abrir etapa **RÉPLICA-CHUSA-PROGRAMADO-20260712** si el Director ordena escala masiva.

### 8.3 Comandos útiles

```powershell
# Report limpio
cd report; npm run dev:clean:3000

# Build verificación
cd report; npx next build
```

---

## 9 · Referencias cruzadas

| Doc | Código |
|-----|--------|
| [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) | 2.3.1.7.5.3.5.1 |
| [AUDITORIA_ADMIN_IC_PP28_CHUSA_VENENO_20260711](./AUDITORIA_ADMIN_IC_PP28_CHUSA_VENENO_20260711.md) | 2.3.1.7.5.3.5.2 |
| [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) | 2.3.1.7.5.3.5 |
| [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) | 2.3.1.7.5.3.7 |
| [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) | CSV post-FI |
| [ETAPA_ADMIN_IC_PP28_PROGRAMADO.md](../../../4_etapas/ETAPA_ADMIN_IC_PP28_PROGRAMADO.md) | Etapa viva |

---

**Documenta 2026-07-11 — Director · handoff réplica PROGRAMADO · PP-28 piloto · Andrés, el que viene.**
