# PENDIENTES — Handoff Cursor · pre-nueva etapa (2026-07-20)

**Código doc:** **2.3.1.7.5.3.2.P2** · **Orden:** **Documenta** (Director)  
**Contexto:** sesión Report PP/FI · Logística OK deploy · hotfix CSV Aprobaciones · usuarios  
**Etapas vivas al documentar:** `COMPRAS-MASIVAS-5000` · `LOGISTICA-OK` · `IMPORTACION-PROGRAMADOS` (paralelo)  
**Listo para:** keyword **Nueva etapa** / **Inicia etapa** del Director

---

## A · PP tab FI — encabezado editable — ✅ CÓDIGO · smoke prod pendiente

**Doc:** [CHUSAR_PP_FI_ENCABEZADO_EDITABLE_20260720.md](./CHUSAR_PP_FI_ENCABEZADO_EDITABLE_20260720.md)

| Hecho | Detalle |
|-------|---------|
| UI `PpFiCard` | Vendedor · plazo · desc. 1–4 · LP (recalcula líneas) |
| API | `PATCH .../fi/[fiId]/encabezado` · `.../vendedor` |
| Sync IC | Descuentos + plazo al guardar encabezado FI |
| Auditoría | `26-PV001` FI=IC=CSV desc 15/10/0/0 · script `audit_fi_csv_completo.mjs` |
| Deploy | commits `dc7839d` → `46f43c9` (fix bundle logística + NexusNavKey) |

| Pendiente | Dueño |
|-----------|--------|
| Smoke prod PP-2026-0017 tab FI · editar descuentos | Director |
| Columna **Desc** administrador IC — validar en prod | Director |

---

## B · Logística OK — ✅ DEPLOY PARCIAL · cierre etapa pendiente

**Etapa:** [ETAPA_LOGISTICA_OK_20260719.md](../../../4_etapas/ETAPA_LOGISTICA_OK_20260719.md) · **2.3.1.28**

| Hecho | Detalle |
|-------|---------|
| MIG-167/168 | Bandera PP · cajas desde FI · bandeja vendedor→cadena→cliente |
| UI | `/logistica-ok` · `PpLogisticaBandera` · hub + middleware |
| Deploy | `13df3ee` · `46f43c9` |
| Smoke local | PP-0014 · 22 FI · 290 cajas |

| Pendiente | Dueño |
|-----------|--------|
| MIG-167/168 **prod** si no aplicadas | Cursor + Director |
| Smoke navegador prod `/logistica-ok` | Director |
| Mapa entregas (fase futura) | Nueva etapa |
| **Cierra etapa** cuando PASS | Director |

---

## C · Hotfix CSV general Aprobaciones — ✅ RESUELTO deploy

**Error:** `4.02.03.015` · **Doc:** [detalle](../../../5_errores/detalle/4.02.03.015_csv-general-duplicado-linea-proveedor.md)

| Hecho | Detalle |
|-------|---------|
| Síntoma | Artículo `8585.102` ×2 por color en CSV (`12-PV011`) |
| Causa | Join `linea` sin `proveedor_importacion_id` (8585 en prov. 654 y 638) |
| Fix | `csv-general-export.ts` · join acotado a PP |
| Deploy | `e333107` |

| Pendiente | Dueño |
|-----------|--------|
| Re-descargar CSV general prod · confirmar 2 filas/color | Director |

---

## D · Usuarios Report (ops BD) — ✅ HECHO sesión

| Usuario | Template | Password | rol | Notas |
|---------|----------|----------|-----|-------|
| **ivan** | ALFREDO | `ivanronaldo` | RIMEC ADMIN (1+ADMIN) | id 28 |
| **YRMA** | ATI | `3544` | RIMEC VENDEDOR (3) | id 14 · `vendedor_v2` id **22** creado |

Script reutilizable: `report/scripts/ensure_ivan_like_alfredo.mjs` · `ensure_yrma_como_ati.mjs`

---

## E · Etapas paralelas sin cerrar (carry)

| Etapa | Code | Pendiente clave |
|-------|------|-----------------|
| Compras masivas 5000 | `COMPRAS-MASIVAS-5000-20260719` | Stress + EOD purge + cierre |
| Importación programados | `IMPORTACION-PROGRAMADOS-20260718` | Maratón PP-0024/0025 · digitación |
| Reposición filtro | `REPOSICION-FILTRO-ADICIONAL-20260716` | ⏸ pausada |

---

## F · No hacer sin orden

- Push/deploy adicional sin **Cierra etapa** o «despliega» / «bug urgente» resuelto + confirmación
- Escribir memoria sin keyword exacta
- Declarar etapa cerrada sin `etapas.json` `:3004`

---

## G · Commits Report referencia (2026-07-20)

| Commit | Tema |
|--------|------|
| `dc7839d` | FI encabezado PP (plazo + desc + vendedor) |
| `13df3ee` | Bundle logística OK faltante en git |
| `46f43c9` | NexusNavKey `logistica-ok` |
| `e333107` | Hotfix CSV general duplicados |
| `3237f5a`+ | (intermedios deploy) |

**Prod:** https://rimec-report.vercel.app

---

**Presentación agente:** Cursor Auto · CHUNA · Andrés el que viene · workspace `Nexus_Core`  
**Espera:** Director dicta **Nueva etapa** / **Inicia etapa** con nombre y foco.

**Shibboleth:** Andrés, el que viene.
