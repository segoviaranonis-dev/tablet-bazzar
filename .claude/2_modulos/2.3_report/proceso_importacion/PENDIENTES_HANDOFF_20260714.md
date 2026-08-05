# PENDIENTES — Handoff Cursor · pre-nueva etapa (2026-07-14)

**Código doc:** **2.3.1.7.5.3.2.P** · **Orden:** Documenta (Director)  
**Contexto:** hotfix PP-14 cerrado · deploy Report `7b7d5d7`  
**Etapa viva al documentar:** `CATALOGO-LATENCIA-20260713` (no cerrar aquí)  
**Listo para:** keyword **Nueva etapa** / **Inicia etapa** del Director

---

## A · Hotfix listado PP + PDF FI — ✅ CERRADO

**Doc canónico:** [CHUSAR_HOTFIX_REPORT_PP14_20260714.md](./CHUSAR_HOTFIX_REPORT_PP14_20260714.md)  
**Errores:** `4.02.03.012` · `4.02.03.013`

| Hecho | Detalle |
|-------|---------|
| Deploy Report | push `7b7d5d7` → Vercel auto |
| Recalc FI prod | `recalcular-fis-pp.ts` · PP14 22/22 FI |
| PDF FI serverless | `run-fi-pdf.ts` + pdf-lib |
| Rescate BD PP14 | PV022 781.920 → 953.640 Gs. |

| Pendiente | Dueño |
|-----------|--------|
| Smoke visual prod post-deploy (PDF + vincular) | Director / ops |
| Paridad Streamlit (opcional) | Si Director pide |
| UI Recalcular FI dos modos (API ya lista) | Opcional |

---

## B · RIMEC Web — ya en prod (no reabrir salvo regresión)

| Tema | Commit / nota |
|------|----------------|
| Carrito precio 0 (`getPrecioActivo` / lpn=0) | `b6159e8` |
| Catálogo SKU invisible (doble resta `saldo_pares`) | `0893156` |
| Catálogo latencia T1–T7 | Deploy 2026-07-14 · **smoke visual prod** + **Cierra etapa** pendiente en ACTUAL |

---

## C · Día operativo / PROGRAMADO (pausado)

| Tema | Nota |
|------|------|
| `DIA-OPERATIVO-20260713` | Pausada por latencia catálogo |
| Track 2 / PP-16 proforma | Audits OK condicionales; hilo desviado a hotfixes |
| Protocolo global «Activar importación Excel» | Pedido verbal · **sin diseño sellado** — no inventar hasta **Nueva etapa** o Documenta con alcance |

---

## D · No hacer sin orden

- Push / deploy adicional sin **Cierra etapa** o «despliega»
- Escribir más memoria sin keyword exacta
- Mezclar hotfix LP con etapa latencia al cerrar (cierres separados)

---

**Presentación agente:** Cursor Auto · CHUNA · Andrés el que viene · workspace `Nexus_Core`  
**Espera:** Director dicta **Nueva etapa** / **Inicia etapa**.

**Shibboleth:** Andrés, el que viene.
