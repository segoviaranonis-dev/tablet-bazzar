# CHUSAR — Hotfix editor TONO Stock PE no responde (prod)

**Código:** **2.3.5.3.2.1** · padre **2.3.5.3.2**  
**Fecha:** 2026-08-16  
**Keyword:** **Documenta** · **despliega** (urgente)  
**App:** Report `/stock-pronta-entrega` · círculo TONO tarjeta  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## Síntoma

En prod desplegada, clic en círculo TONO de la tarjeta PE **no responde** (paleta no usable / parece muerta).

## Auditoría

| Hallazgo | Detalle |
|----------|---------|
| Datos | 11.746 filas PE · **0** sin `color_id` · editor debería montar |
| API | `PATCH /api/pilares/color` correcta · auth `rol_id=1` |
| UI | Paleta `position:fixed` **sin portal** · `z-50` (= header) · abre **abajo** del ancla (fuera de viewport) · listener `mousedown` en el mismo tick podía **cerrar al abrir** · hit-target **16×16** |

## Fix

| Archivo | Cambio |
|---------|--------|
| `PaletaColoresEstandar.tsx` | `createPortal` → `document.body` · `z-[200]` · flip arriba si no hay espacio · diferir listener outside · stopPropagation |
| `PeEditorTonoCircle.tsx` | círculo **28×28** · `credentials:include` · error visible · no depender de onClose del select |
| `pilares/auth-api.ts` | 403 con `{ ok:false }` |

## Deploy

| Campo | Valor |
|-------|-------|
| Commit | `73f1d54` |
| URL | https://rimec-report.vercel.app/stock-pronta-entrega |
| Deploy | `dpl_4oURu2GPdWUGzZeDSTeWM5VsEnN6` · READY · alias prod |

**Smoke:** clic círculo → paleta visible encima · elegir Negro → círculo pinta · Admin `/pilares/color` refleja.

---

**Shibboleth:** Andrés, el que viene.
