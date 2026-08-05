# ETAPA CERRADA — Administrador de Pilares (Report) · 2.3.5

**ID:** `ETAPA-235-PILARES-REPORT-20260615`  
**Maratón:** Etapa 1 de Report · **2/5**  
**Apertura:** 2026-06-15 · **Ratificado:** 2026-06-16  
**Cierre:** 2026-06-17 · **Director:** Chusar · «terminado!!!»  
**Estado:** ✅ **CERRADA**  
**Shibboleth:** Chayanne el mejor

---

## Entregable operativo (piso)

Módulo **Administrador de Pilares** desplegado en Report (`/pilares`) con edición directa en BD de `linea` y `linea_referencia`. Propagación **instantánea** al triángulo header (RIMEC Web + Tablet Bazzar) tras Guardar / Aplicar.

| Ruta | Función | Estado |
|------|---------|--------|
| `/pilares` | Hub · selector Calzados (654) / Confecciones (638) | ✅ |
| `/pilares/lineas` | Marca · género · filtros chip · datos generales | ✅ |
| `/pilares/linea-referencia` | Estilo · tipo 1 · buscador multi-línea · editor rango | ✅ |
| `/api/pilares/*` | GET/PATCH maestras · lineas · L×R · autocompletado códigos | ✅ |

**URL prod:** https://report-rimec.vercel.app/pilares (post-push main)

---

## Entregables técnicos

### Backend (`report/src/lib/pilares/`)

| Pieza | Detalle |
|-------|---------|
| `queries.ts` | Listados, cascada reactiva, PATCH fila / rango / scope / códigos |
| `auth-api.ts` | Gate `rol_id = 1` |
| `constants.ts` | `tipo_v2` 1→654 · 2→638 |

### APIs

| Endpoint | Métodos | Uso |
|----------|---------|-----|
| `/api/pilares/maestras` | GET | Marcas (`marca_tipo_v2`), géneros, estilos, tipos1 |
| `/api/pilares/lineas` | GET, PATCH | Grilla líneas · fila · rango género |
| `/api/pilares/lineas/codigos` | GET | Autocompletado código línea |
| `/api/pilares/linea-referencia` | GET, PATCH | Grilla L×R · fila · rango bulk · cascada |

### UI Report

| Componente | Función |
|------------|---------|
| `PilaresHubClient` | Tarjetas Líneas / L×R |
| `LineasAdminClient` + `PilaresLineasFiltrosBar` | Chips Tipo · Marca · Género |
| `LineaReferenciaAdminClient` | Grilla 200 filas + total filtrado |
| `PilaresLineaReferenciaFiltrosBar` | Cascada reactiva marcas (estilo/tipo1/líneas) |
| `LineaReferenciaBuscador` | Multi-selección líneas (sin «hasta») |
| `LineaReferenciaEditor` | Rango inicial–final · género · estilo · tipo 1 · **Aplicar** |
| `DatosGeneralesLineas` | Resumen contadores por marca/género |

### Seguridad

- Middleware: `/pilares/:path*` · `/api/pilares/:path*` · `ROLE_ROUTES` rol 1
- Home Report: tarjeta «Administrador de Pilares» sección RIMEC

### Triángulo header

| Vértice | Tabla | Pantalla |
|---------|-------|----------|
| Género | `linea.genero_id` | `/pilares/lineas` |
| Marca | `linea.marca_id` | `/pilares/lineas` |
| Estilo | `linea_referencia.grupo_estilo_id` | `/pilares/linea-referencia` |
| Tipo 1 | `linea_referencia.tipo_1_id` | `/pilares/linea-referencia` |

Doc: [TRIANGULO_HEADER_PILARES.md](../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md)

---

## Paridad Streamlit

| Streamlit (`ui.py`) | Report | Estado cierre |
|---------------------|--------|---------------|
| Admin líneas · filtros marca/género | `/pilares/lineas` | ✅ |
| Editar género por rango | API + pendiente UI dedicada Líneas | 🟡 API lista |
| Reaplicar FK / ley género | — | ⬜ Fase posterior |
| L×R filtros marca/estilo/tipo1 | Chips + cascada | ✅ |
| L×R edición fila | Guardar por fila | ✅ |
| L×R edición lote | Editor acordeón rango | ✅ |
| Grilla 200 + total | Sí | ✅ |
| Multi-proveedor 654/638 | Selector `tipo_v2_id` | ✅ |
| Ref **K** confecciones | Badge en grilla | ✅ |

**Criterio Director:** operador puede corregir «Otros» y derivar por marca con filtros reactivos + editor masivo → **cumplido**.

---

## Deploy

| Campo | Valor |
|-------|--------|
| Repo | `segoviaranonis-dev/report` |
| Rama | `main` |
| Commit cierre | ver git log `feat(pilares):` 2026-06-17 |
| Evidencia repo | `report/docs/evidencia/CIERRE_ETAPA_235_PILARES_20260617.md` |
| Evidencia sesión triángulo | `report/docs/EVIDENCIA_SESION_PILARES_TRIANGULO_20260616.md` |

---

## Pendiente (no bloquea cierre 2.3.5)

- UI género por rango en `/pilares/lineas` (API ya existe)
- Reaplicar FK / ley género desde listado Motor (654)
- Import Excel L+LR en Report (fase posterior)
- Retirar pestañas Streamlit Motor (OT aparte)

---

## Referencias

| Doc | Ruta |
|-----|------|
| Operativa | `report/docs/ADMINISTRADOR_PILARES.md` |
| Etapa histórica | [ETAPA_ADMINISTRADOR_PILARES_REPORT.md](./ETAPA_ADMINISTRADOR_PILARES_REPORT.md) |
| Índice 2.3 | [INDICE.md](../2_modulos/2.3_report/INDICE.md) §6 |

---

**Siguiente maratón Report:** Etapa 2 · **2.3.9** Monitoreo tickets Tablet
