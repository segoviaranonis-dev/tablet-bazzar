# CHUSAR — Borrar importación proforma · PROGRAMADO

**Código:** 2.3.1.7.5.3.3.2 · **Estado:** ✅ operativo local 2026-07-09  
**Caso vivo:** PP-2026-0016 · BD id **25** · proforma **8600-4121**  
**Relacionado:** [CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md](./CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md) · error `4.02.03.006`

---

## Qué hace «Borrar importación»

Elimina **todo el stock importado** de un PP para poder cargar la proforma otra vez. **No** toca ICs ni cabecera PP (nro proforma, descuentos, quincena).

### Tablas afectadas (orden TS `borrarImportacionTs`)

| Paso | Tabla | Acción |
|------|--------|--------|
| 1 | `venta_transito` | DELETE filas ligadas a PPD del PP |
| 2 | `factura_interna_detalle` | DELETE vía JOIN `factura_interna` |
| 3 | `factura_interna` | DELETE todas del PP (RESERVADA + CONFIRMADA*) |
| 4 | `snapshot_costos` | DELETE del PP |
| 5 | `pedido_proveedor_detalle` | DELETE todas las moléculas |
| 6 | `pedido_proveedor` | `pares_comprometidos = 0` · `estado_transito = NULL` si estaba EN_TRANSITO |

\* **Bloqueo:** si existe **FI CONFIRMADA** → aborta (422).

Transacción **atómica** (`BEGIN` / `COMMIT` / `ROLLBACK`).

---

## Cuándo está permitido borrar

| Condición | Bloquea |
|-----------|---------|
| Sin PPD (`n_articulos = 0`) | Sí — «No hay importación cargada» |
| `venta_transito` > 0 (ventas Web post-alzado) | Sí |
| FI con `estado = CONFIRMADA` | Sí |
| `pares_vendidos` en PPD por reserva FI (`descontar_stock_pp`) | **No** — corregido 2026-07-09 |

### Bug corregido 2026-07-09

Tras import PROGRAMADO, `descontar_stock_pp` sube `pares_vendidos` en PPD al crear FI RESERVADA. El motor TS rechazaba borrar con «hay ventas» aunque **venta Web = 0**.

**Fix:** gate de borrado usa solo `venta_transito` + FI CONFIRMADA. UI distingue **vendidos Web** vs **reservados FI**.

---

## Rutas API

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/proceso-importacion/pedido-proveedor/[ppId]/borrar-import` | Estado (`getEstadoBorradoImportPp`) |
| POST | mismo | Ejecuta borrado (`borrarImportacionPp`) |

Auth: `requireMotorPreciosAdmin` (ADMIN RIMEC / DIOS).

---

## Motor: TS vs Python

| Entorno | Motor |
|---------|--------|
| Vercel (`VERCEL=1`) | TS `borrarImportacionTs` |
| Local con `PP_PROFORMA_USE_TS=1` en `.env.local` | TS |
| Local sin flag | Python `report_import_proforma_pp.py --borrar-import` → fallback TS si falla |

Archivos:

- `report/src/lib/pedido-proveedor/borrar-import.ts`
- `report/src/lib/pedido-proveedor/proforma-programado-engine.ts` → `borrarImportacionTs`
- `report/src/app/api/.../borrar-import/route.ts`

---

## UI — Tab Stock PP (`PpTabStock.tsx`)

Sección roja **«Importación incorrecta»** visible si `n_articulos > 0`.

1. GET estado al cargar tab (artículos, pares, vendidos Web, reservados FI, nº FI).
2. Si `puede_borrar` → botón **Borrar importación** + confirmación doble.
3. POST borrar → mensaje verde → `onReload()` refresca KPIs y tab FI.

Texto canónico: borrar solo si **ventas Web = 0** (no confundir con reserva FI).

---

## Reimportar después de borrar

### Flujo manual (Director / Alfredo)

```
Tab Stock PP-16
  → Borrar importación (confirmar)
  → Verificar: 0 PPD · 0 FI · KPI saldo coherente
  → Elegir Excel 8600IMPORTARWEB.xlsx
  → Paso 1 Preview SHOP↔IC (overlay 30–90 s)
  → Paso 2 Import (overlay 3–6 min)
  → PASS: 722 PPD · 39 FI RESERVADA · 8.880 pares
```

### Flujo automático al importar con stock previo

Si ya hay PPD, el UI manda `borrar_previo=1` en POST `/proforma`:

```typescript
// PpTabStock.tsx — importarProforma()
if (!sinStock) fd.append("borrar_previo", "1");
```

La ruta `proforma/route.ts` llama `borrarImportacionPp` **antes** del import. Mismas reglas de bloqueo.

---

## Evidencia PASS (caso Alfredo)

| Métrica | Esperado post-import |
|---------|----------------------|
| PPD | 722 |
| FI RESERVADA | 39 |
| Pares | 8.880 |
| ICs vinculadas | 39 (sin cambio) |
| SHOP únicos | 12 |

URL: `http://localhost:3000/proceso-importacion/pedido-proveedor/25?tab=stock`

---

## Errores frecuentes

| Síntoma | Causa | Acción |
|---------|-------|--------|
| Botón borrar gris + motivo rojo | Venta Web o FI confirmada | No borrar — escalar |
| POST 422 «hay ventas» con Web=0 | Bug pre-2026-07-09 (pares_vendidos FI) | Pull fix TS |
| Borrar OK pero FI siguen | Cache UI | F5 · verificar BD |
| Import tras borrar: 0 FI | `categoria_id` string / motor CP | Ver `4.02.03.006` |
| Preview bloqueado | SHOP sin IC | Corregir IC o Excel col. J |

---

## Índice Moria

- Proceso importación: [INDICE.md](./INDICE.md)
- Protocolo proforma: `PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md`
- CSV Carlos: [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md)
