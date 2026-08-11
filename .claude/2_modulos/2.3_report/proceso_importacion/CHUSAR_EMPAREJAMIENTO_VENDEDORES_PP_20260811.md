# CHUSAR — Emparejamiento vendedores PP · integridad FI ↔ IC

**Código:** **2.3.1.7.5.3.18** · **Error:** **4.02.03.026**  
**Keyword:** Documenta · Protocolo chusar activado  
**Fecha:** 2026-08-11 · **Caso pionero:** PP **94** (`94-PV001`) · FI subtítulo mostraba **BZZP** en lugar de **GIANINA**  
**Nota:** Trinidad IC↔PF↔FI sigue en **2.3.1.7.5.3.15** (código distinto).

---

## 1 · Regla (obligatoria)

En **Pedido proveedor** (CP y PROGRAMADO), el subtítulo FI:

`vendedor · listado · plazo · marca`

| Campo | Fuente canónica | Prohibido |
|-------|-----------------|-----------|
| **Vendedor** | `vendedor_v2` vía IC pareada (`fi.notas` = `ic.numero_registro`) | `usuario_v2` (BZZP, BZZF, login tienda) |
| Listado | `lista_precio_id` / LPC | — |
| Plazo | `plazo_v2` | — |
| Marca | `marca_v2` | — |

**`fi.vendedor_id`** en PP = **`vendedor_v2.id_vendedor`** siempre.

**Excepción única:** FI **PE Web** (`pedido_id` / carrito) — ver `vendedor-fi-display.ts` · usuario_v2 · **4.02.04.004**.

---

## 2 · Síntoma del error (PP 94)

- UI FI: `BZZP · LPC03 · EFECTIVO · MODARE`
- Dropdown VENDEDOR: **GIANINA** (correcto en IC)
- Logística OK: `Código de vendedor real no resuelto · vendedor=Tito · caso=CLASICOS` (otro FI / matriz Carlos)

**Causa:** query legacy priorizaba `usuario_v2.descp_usuario` antes que `vendedor_v2` cuando el mismo número de ID existe en ambas tablas (colisión bancaria).

---

## 3 · Auditoría integridad PP (obligatoria)

Ante **«audita la integridad»** de un PP, **siempre** incluir:

```bash
cd report
npx tsx scripts/_audit_pp_vendedor_integridad.ts <pp_id>
```

| Código issue | Significado |
|--------------|-------------|
| `COLISION_USUARIO` | fi.vendedor_id muestra login Nexus (ej. BZZP) |
| `DESALINEADO_IC` | fi.vendedor_id ≠ ic.id_vendedor pareada |
| `SIN_VENDEDOR_V2` | ID sin fila en vendedor_v2 |

**Reparar** (desde IC pareada, FI + IC + logística):

```bash
APPLY=1 npx tsx scripts/_audit_pp_vendedor_integridad.ts <pp_id>
```

---

## 4 · Implementación

| Archivo | Rol |
|---------|-----|
| `report/src/lib/pedido-proveedor/vendedor-pp-integridad.ts` | Audit · repair · SQL display PP |
| `detail-query.ts` | Subtítulo FI tab PP |
| `csv-ventas-export.ts` | CSV Carlos — nombre vendedor comercial |
| `fi-pdf-data.ts` | PDF FI PP |
| `fi-pp-actions.ts` | PATCH vendedor → sync trinidad |
| `scripts/_audit_pp_vendedor_integridad.ts` | CLI Director / agente |

---

## 5 · PP 94 — resultado (2026-08-11)

- **37 FI** auditadas · `fi.vendedor_id` = `ic.id_vendedor` en vendedor_v2 (**OK**)
- Ej. **94-PV001:** id **10** = **GIANINA** en catálogo · **BZZP** solo en `usuario_v2` (colisión id 10)
- **Fix aplicado:** queries UI/CSV/Logística priorizan `vendedor_v2` — subtítulo muestra GIANINA (cada FI su vendedor)
- **No requirió** `APPLY=1` en BD para PP 94 (IDs ya correctos)

---

## 6 · Checklist «audita integridad PP»

- [ ] `auditarIntegridadVendedorPp` → `ok: true`
- [ ] Subtítulo FI = vendedor_v2 (no BZZ*)
- [ ] CSV Carlos columna Vendedor resuelve matriz Hoja2
- [ ] IC pareada `notas` ↔ `numero_registro` alineada
- [ ] Logística `id_vendedor` sync

---

**Línea 1 agente viva:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible
