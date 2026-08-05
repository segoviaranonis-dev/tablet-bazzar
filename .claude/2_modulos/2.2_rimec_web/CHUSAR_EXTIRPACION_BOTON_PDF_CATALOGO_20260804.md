# 2.2.1.41 — Extirpación botón dorado «PDF Catálogo» (RIMEC Web)

**Código:** **2.2.1.41**  
**Fecha:** 2026-08-04 · **Documenta** (orden Director)  
**App:** RIMEC Web `:3001` / prod `rimec-web.vercel.app`  
**Shibboleth:** Andrés, el que viene.

---

## Decisión Director

El botón flotante dorado **📄 PDF Catálogo (N modelos)** del catálogo **se extirpa**.

**Sustituto operativo:** cocina de PDFs Stock PE → bandeja Mensajes internos (Report **2.3.1.35** / **2.3.1.36**).  
El catálogo web **ya no** genera ni descarga un PDF filtrado de la grilla.

---

## Evidencia — próximo deploy

| Campo | Valor |
|-------|--------|
| **Estado local** | ✅ Código eliminado (2026-08-04) |
| **Prod sellada** | `f408fc2` — el botón **aún puede existir** en Vercel hasta el próximo deploy autorizado |
| **Próximo deploy rimec-web** | **Prohibido** reintroducir el botón · el diff **debe** salir **sin** PDF Catálogo |
| **Puerta deploy** | Solo cierre de etapa canónico **o** orden directa Director |

**Checklist pre-deploy (obligatorio):**

1. `CatalogoGrid.tsx` — sin `handleGenerarPDFCatalogo` / sin botón dorado PDF.  
2. No existe `rimec-web/app/api/pdf/catalogo/route.ts`.  
3. No existe `rimec-web/lib/pdfCatalogoGenerator.ts`.  
4. Smoke `:3001` — solo flotantes Activar venta / carrito (si aplica).

---

## Qué se quitó (local)

| Pieza | Acción |
|-------|--------|
| UI botón dorado | Eliminado de `rimec-web/app/CatalogoGrid.tsx` |
| Handler + estado `generandoPDF` | Eliminado |
| API `POST /api/pdf/catalogo` | Archivo borrado |
| `lib/pdfCatalogoGenerator.ts` | Archivo borrado |

**No confundir** con:

- PDF **factura interna** (`/api/pdf/factura/[id]`) — **sigue**.  
- Cocina PDF PE Report (`generar-pdf-stock-pe*.ts`) — **sigue** · canal canónico.  
- Dorado en estilos de factura (`pdfGenerator.ts` FI) — **sigue** (otro producto).

---

## Por qué

1. Duplicaba el canal de stock PE (filtros grilla ≠ diccionario COD.GRUPO).  
2. Director: *«vamos a sustituir eso por la cocina de PDFs»*.  
3. Un solo menú de PDFs en bandeja (asignador aguas abajo).

---

## Referencias

- Cocina / espíritu 133×3: **2.3.1.35.11**  
- Bandeja mensajes: **2.3.1.36**  
- Menciones históricas PDF catálogo (obsoletas como feature): `CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md` · `CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md`  
- Deploy solo cierre: `CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md`

---

**Documenta 2026-08-04 — evidencia extirpación · no va en el siguiente despliegue.**
