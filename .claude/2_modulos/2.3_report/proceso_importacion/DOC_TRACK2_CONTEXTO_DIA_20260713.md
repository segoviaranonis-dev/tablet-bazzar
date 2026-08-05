# DOC — Track 2 · contexto listo · Día operativo 13-07-26

**Código:** **2.3.1.13.2** · Track 2  
**Etapa:** [ETAPA_DIA_OPERATIVO_20260713](../../../4_etapas/ETAPA_DIA_OPERATIVO_20260713.md)  
**CHUSAR día:** [CHUSAR_DIA_OPERATIVO_20260713](../CHUSAR_DIA_OPERATIVO_20260713.md) §2  
**Documenta:** Director · 2026-07-13  
**Ejecutor:** Cursor · foco **solo Track 2**  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Objetivo Track 2 (hoy)

| Paso | Acción | PASS |
|:----:|--------|:----:|
| 2.1 | Retomar flota PP **PROGRAMADO** (post PP-28) | ☐ |
| 2.2 | Alinear **IC ↔ PF ↔ FI** · botón verde regenerar donde aplique | ☐ |
| 2.3 | Chusa **N1** verde en lote objetivo | ☐ |
| 2.4 | **Descarga CSV** operativo (Director define cuál) | ☐ |

**URL foco:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=admin-ic`  
**Report local:** `:3000`

---

## 2 · Qué ya está ganado (no rehacer)

| Fecha | Entrega | Doc |
|-------|---------|-----|
| 11-07 | Piloto **PP-28** · Chusa lote · 115 IC≈115 FI · excepción sin LPN | [DOC_ADMIN_IC_LOTE_PP28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) |
| 11-07 | Motor `_shop` Excel · Admin IC layout · API generar-fi-lote | [ETAPA_ADMIN_IC_PP28](../../../4_etapas/ETAPA_ADMIN_IC_PP28_PROGRAMADO.md) (heredada; etapa portal **cerrada** → Track 2) |
| 12-07 | Motor pilares en import proforma · backfill FK · ley biblioteca BCL→PELE | [DOC_REPARACION_PROGRAMADO…](./DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712.md) |
| 12-07 | Sync PELE ← BCL eventos 31/37/45 · regeneración FI flota | mismo DOC §4–5 |
| 12-07 | Hotfix botón verde recalcula FI (`4.02.03.010`) | [4.02.03.010](../../../5_errores/detalle/4.02.03.010_admin-ic-boton-verde-no-recalcula-fi.md) |

**Ley no negociable (12-07):** caso comercial = **solo biblioteca** (BCL→PELE→`precio_lista`). Import proforma **debe** nutrir pilares + FK PPD. Sin heurística STYLE/BAG.

---

## 3 · Ámbar / deuda al entrar Track 2

| Ítem | Detalle | Bloquea CSV? |
|------|---------|:------------:|
| Gaps estilo `linea_referencia` en PP históricos | DOC reparación §2 · §6 | No |
| Líneas 6531 / 2502 / 1206 caso dudoso | DOC reparación §6 | Revisar si lote toca esas líneas |
| PP-29 sin proforma | Pendiente Excel Director | Sí para ese PP |
| Chusa N1 rojo cuando 1 shop = varios casos | Esperado · FI igual vía motor | No |
| Réplica masiva checklist §7.2 | PP-17, 16, 15, 21… | Objetivo Track 2 |
| Deploy prod Report | Solo cierre etapa / orden Héctor | — |

---

## 4 · Orden operativo sugerido (Cursor)

1. `npm run dev:clean:3000` (o confirmar Report vivo).  
2. Abrir flota PROGRAMADO · empezar por PP que Director indique (default sugerido: **verificar PP-28** IC=PF=FI + KPI saldo).  
3. Por cada PP: precondiciones [§7.1 DOC PP-28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) → Chusa → generar/regenerar FI → tab FI.  
4. Si FI desfasadas vs PF → botón verde / `regenerar` (ley `4.02.03.010`).  
5. CSV: [CHUSAR_CSV_VENENO_CARLOS](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) · dual ventas+inicial · **solo tras** orden Director del archivo.  
6. **No** tocar Track 1 (import PE) ni Track 3 (E2E 5000) en este hilo.

---

## 5 · Fuera de este track (parking · sesión 12-07 noche)

| Tema | Doc | Track |
|------|-----|:-----:|
| PE cajas cerradas + «+» carteras (fix local Web) | [DOC_BUG_PE…20260713](../../2.2_rimec_web/DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md) | **3** |
| Handoff 1 par/click (supersedido) | [DOC_HANDOFF…20260712](../../2.2_rimec_web/DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md) | — |
| Moria Chusar · índice Alejandro Magno git | commit `6fd6077` · `CHUSAR_ALEJANDRO_MAGNO_ESTRATEGIA.md` | — |
| Report PDF Ventas+Fotos 80 filas | `b60fd9d` · `4.02.02.004` | — |
| Report Stock tránsito PROMOCIONAL | `3ffb9c2` · CHUSAR stock tránsito ventas | — |
| Sync Excel stock PE | CHUSAR día §1 | **1** |

---

## 6 · Lectura mínima antes de tocar código

1. Este archivo  
2. [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md)  
3. [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md)  
4. [DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712](./DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712.md) §1 · §7  
5. [DOC_ADMIN_IC_LOTE…PP28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) §7 réplica
