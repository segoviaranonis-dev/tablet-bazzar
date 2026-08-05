# CHUSAR — Ventas + Fotos · PDF ejecutivo

**Código:** **2.3.1.2.1**  
**Ruta Report:** `/ventas-fotos` · API `POST /api/ventas-fotos/pdf`  
**Prod:** https://rimec-report.vercel.app/ventas-fotos  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Rol en el holding

Vista comercial con **imagen por molécula** · filtros pilares · buckets por `descp_categoria` (STOCK · PREVENTA · PROGRAMADO). **No** es Panel Alejandro Magno — complementa Sales Report blindado sin tocar `registro_ventas_general_v2`.

Relación AM: [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) § Cabeza 5.

---

## 2 · PDF ejecutivo

| Campo | Valor |
|-------|--------|
| Generador | `report/src/lib/ventas-fotos/pdfGenerator.ts` |
| Entrada | `generarPDFVentasFotos(data)` |
| Página 1 | Resumen ejecutivo · KPIs · banner si hay truncado |
| Páginas 2+ | Detalle filas con thumbnail embebido |
| Tope filas | **80** (`PDF_MAX_FILAS_VENTAS_FOTOS`) desktop y serverless |
| Env override | `PDF_VENTAS_FOTOS_MAX_FILAS` (Vercel) |
| Timeout API | `maxDuration = 120` s (`route.ts`) |
| Precarga imágenes | Concurrencia **10** en server · validador `imageUrlValidator.ts` |

---

## 3 · Hotfix 2026-07-10 — PDF cortaba en 25 filas

**Síntoma:** Banner «primeras **80** filas» pero detalle terminaba en **~25** (ej. cliente 104 · VIZZANO · oct 2025).

**Causa:** En Vercel (`VERCEL=1`) el código forzaba `MAX_FILAS_PDF = Math.min(recommendedLimit, 25)` mientras el texto del banner decía 80.

**Fix:** commit **`b60fd9d`** · deploy prod **`dpl_72eQ28e8SH8VqhS4PvZU7MuQK7tN`**

```typescript
const PDF_MAX_FILAS_VENTAS_FOTOS = 80
const maxFilasCap = isServerless
  ? Number(process.env.PDF_VENTAS_FOTOS_MAX_FILAS) || PDF_MAX_FILAS_VENTAS_FOTOS
  : getRecommendedImageLimit(deviceType)
const MAX_FILAS_PDF = Math.min(data.rows.length, maxFilasCap)
```

Banner dinámico: `PDF muestra primeras ${maxFilasPdf} filas…`

**Error índice:** `4.02.02.004` → ✅ **RESUELTO 2026-07-10**

---

## 3.1 · Hotfix 2026-07-21 — foto ausente en Storage bloqueaba el PDF

**Síntoma:** «PDF no disponible, reintentar» + «PDF abortado — «ventas + fotos» exige foto en cada fila. Faltan N imagen(es) en Storage». El PDF **nunca** salía aunque la única foto faltante simplemente **no existía** en Storage.

**Espíritu de la restricción (Director):** el bloqueo debe verificar que el **PDF se construyó bien** (que ninguna foto se perdió por **señal/red**), **no** castigar la **ausencia real** de una imagen en la BD.

**Dos causas de foto no renderizada — trato distinto:**

| Caso | Detección | Acción |
|------|-----------|--------|
| Foto **existe** pero no llegó (timeout/red) | reintentos agotados **sin** 404/400 | **BLOQUEAR** · reintentar (integridad) |
| Foto **no existe** en Storage | todos los intentos 400/404 / URL inválida | **NO bloquea** · placeholder `S/IMG` + **alerta ámbar** |

**Fix:** commit **`c4d5758`** · deploy prod **`dpl_7oMJWjYH38xj2QJmrPtUC1TDyHzY`** (READY 2026-07-21)

- `imageUrlValidator.ts`: nueva clase `ImageLoadError` con `kind: 'not_found' | 'network'`. `safeFetchImageGarantizado` clasifica el fallo final (only-404 ⇒ `not_found`, cualquier timeout/red ⇒ `network`).
- `pdfGenerator.ts`: `fetchImage` devuelve `{ status: 'ok' | 'not_found' | 'network' }`. `preloadVentasFotosImages` acumula `missingInStorage` (no aborta) y `networkFails` (aborta con `PDF abortado — fallo de red/señal…`). `generarPDFVentasFotos` retorna `{ buffer, missingInStorage }`.
- `route.ts`: si hay ausentes, responde el PDF **200** con headers `X-PDF-Missing-Count` / `X-PDF-Missing-Images`.
- `VentasFotosClient.tsx`: `readPdfResponse` lee esos headers → estado `pdfWarning` (alerta ámbar) sin marcar error.

**Regla de oro:** un `PDF abortado — fallo de red/señal…` = reintentar. Una **alerta ámbar** = el PDF salió y falta subir esa(s) foto(s) a Storage.

---

## 4 · Archivos clave

| Ruta | Rol |
|------|-----|
| `src/lib/ventas-fotos/pdfGenerator.ts` | Generación PDF · clasifica ausente vs red |
| `src/app/api/ventas-fotos/pdf/route.ts` | POST serverless · headers `X-PDF-Missing-*` |
| `src/lib/pdf/imageUrlValidator.ts` | Límites desktop/mobile · `ImageLoadError` (not_found/network) |
| `src/app/ventas-fotos/VentasFotosClient.tsx` | UI descarga · alerta ámbar `pdfWarning` |

---

## 5 · Smoke post-deploy

1. `/ventas-fotos` · filtros cliente + marca + rango fechas.
2. Descargar PDF · verificar banner + conteo filas detalle ≤ 80.
3. Si consulta > 80 filas · banner indica truncado · pantalla tiene detalle completo.
4. **Foto ausente en Storage** (ej. `8486-422-30579-66.jpg`): el PDF **debe** bajar con placeholder `S/IMG` + alerta ámbar «Falta(n) N imagen(es)…». **No** debe bloquear.
5. **Corte de red** durante descarga: el PDF **debe** abortar con «fallo de red/señal…» → reintentar.

---

## Índice

- [INDICE.md](./INDICE.md) § Ventas + Fotos
- [4.02.02.004](../../5_errores/detalle/4.02.02.004_ventas-fotos-pdf-25-vs-80-serverless.md)
