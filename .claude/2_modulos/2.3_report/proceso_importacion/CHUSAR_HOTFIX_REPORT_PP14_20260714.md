# CHUSAR — Hotfix Report PP-14 · vincular FI + PDF FI (2026-07-14)

**Código:** **2.3.1.7.5.3.2.H**  
**Orden:** Documenta (Director)  
**Commit Report:** `7b7d5d7` · push `main` → Vercel auto  
**Errores:** `4.02.03.012` · `4.02.03.013`  
**Shibboleth:** Andrés, el que viene.

---

## Resumen ejecutivo

Dos fallos de **paridad prod** en el mismo flujo operativo (Alfredo · PP-2026-0014):

| # | Síntoma | Causa | Fix |
|---|---------|-------|-----|
| 1 | Vincular listado #49 · FI sigue precio #34 | TS vinculaba PPD · **no recalc FI** | `recalcular-fis-pp.ts` |
| 2 | Descargar PDF FI → error | API solo Python | `run-fi-pdf.ts` + pdf-lib |

**Rescate BD:** smoke `recalcularFisPp(14, incluirConfirmadas)` → 22/22 FI · PV022 **781.920 → 953.640** Gs.

---

## Ineficiencia documentada

1. **Handoff decía «deploy ⏳»** pero ops probó en prod antes del push — PPD OK · FI rota.
2. **`Terminal: Ok` sin leer `:3000`** — build en paralelo corrompió `.next` del dev.
3. **Checks UI engañosos** — «recalc FI» + «incluir CONFIRMADA» no hacían nada en Vercel.
4. **PDF FI** listado como «solo Python» en CHUSAR viejos sin bloquear botón en prod.

---

## Archivos código (report)

```
src/lib/pedido-proveedor/recalcular-fis-pp.ts
src/lib/pedido-proveedor/run-fi-pdf.ts
src/lib/pedido-proveedor/fi-pdf-data.ts
src/lib/pedido-proveedor/fi-pdf-generator.ts
src/lib/pdf/pdfImageUtils.ts
src/app/api/.../vincular-listado/route.ts
src/app/api/.../recalcular-fi/route.ts
src/app/api/.../fi/[fiId]/pdf/route.ts
scripts/smoke_recalc_fi_pp.ts
scripts/smoke_fi_pdf.ts
```

---

## Smoke post-deploy prod

1. PP14 tab FI · **14-PV022** → LPC03 **~953.640** Gs.
2. **Descargar PDF** cualquier FI CONFIRMADA → descarga `.pdf`.
3. Tab Stock · vincular otro evento · check CONFIRMADA → Δ monto FI en respuesta API.

---

## Pendiente (no este hotfix)

- Paridad Streamlit dos botones vincular
- Etapa catálogo latencia — **Cierra etapa** formal
- Lightbox precio RIMEC Web (`4.01.04.001`)

---

## Índices actualizados

- [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md)
- [CHUSAR_PP_TAB_FI.md](./CHUSAR_PP_TAB_FI.md)
- [PENDIENTES_HANDOFF_20260714.md](./PENDIENTES_HANDOFF_20260714.md)
- [INDICE.md](./INDICE.md) · [INDICE_ERRORES.md](../../../5_errores/INDICE_ERRORES.md)
