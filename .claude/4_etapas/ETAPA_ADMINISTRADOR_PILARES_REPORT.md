# ETAPA — Administrador de Pilares (Report)

**Inicio:** 2026-06-15  
**Ratificado Director:** 2026-06-16  
**Cierre:** 2026-06-17 — **Chusar**  
**Estado:** ✅ **CERRADA** — ver [ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md](./ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md)  
**Producto:** Report (`report/`) — ruta `/pilares`  
**Relación:** Alimenta triángulo header → [SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md](./SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md)

---

## Objetivo general

**Abandonar Streamlit** como superficie de edición de pilares operativos. El catálogo L / L×R pasa a Report.

## Objetivo específico

Crear **Administrador de Pilares multi-proveedor** que mantenga `linea` y `linea_referencia` (y catálogo `referencia` vía convenciones) para:

| Proveedor | `tipo_v2` | Estado datos |
|-----------|-----------|--------------|
| **654** Calzado | 1 | Producción — paridad Streamlit |
| **638** Confecciones (Kyly) | 2 | Import en curso (Tablet Bazzar / Retail) — pilares conviven en mismo módulo |

## Por qué fuera del Motor de Precios

- **Confidencialidad:** listados, casos comerciales y aritmética de precios no deben mezclarse con edición de catálogo.
- **Seguridad:** operador de pilares no necesita acceso al Motor.
- **UX:** Report ya es hub RIMEC Admin; una sola app para enriquecer catálogo post-import.

---

## Criterio de éxito

1. **Paridad:** todo lo visible hoy en Streamlit (`_render_admin_lineas`, `_render_linea_referencia`) disponible en `/pilares`.
2. **Multi-proveedor:** selector 654 / 638; reglas distintas L+R (STYLE vs ref `K`) sin pantallas duplicadas.
3. **Convivencia:** líneas `tipo_v2=2` importadas en alta perezosa → completables aquí (marca, género, estilo, tipo_1).
4. **Amigable:** filtros claros, NULLs visibles, paginación, edición por lote — mejor que Streamlit.
5. **Sin regresión:** Sales Report blindado; Retail/Tablet siguen alimentando staging; este módulo solo **muta pilares** autorizados.

---

## Entregables

### Fase 0 (hecho local)

- [x] `report/docs/ADMINISTRADOR_PILARES.md` (visión multi-proveedor)
- [x] Índices Report + manual funciones
- [x] Tarjeta home + nav `Pilares`
- [x] Hub `/pilares` + selector tipo_v2

### Fase 1 — MVP local (2026-06-16 → deploy 2026-06-17)

- [x] APIs GET/PATCH `lineas`, `linea-referencia`, `maestras`
- [x] UI Líneas + L×R + acordeón datos generales
- [x] Middleware matcher `/pilares`
- [x] Triángulo header doc + paridad tablet JOIN pilares
- [x] Filtros chip · cascada marcas · buscador multi-línea · editor rango L×R
- [x] Commit + push + Vercel prod

### Fase 2 — Paridad Streamlit completa (post-cierre)

- [ ] Género por rango UI en `/pilares/lineas` (API lista)
- [ ] Edición lote L×R checkboxes (Editor rango cubre caso principal)
- [ ] Reaplicar FK / ley género (654) API

### Cierre sub-proyecto

- [x] Paridad validada Director (2026-06-17)
- [ ] `MIGRACION_STREAMLIT_REPORT.md` → `/pilares` ✅ (doc operativa lista)
- [x] Consumidores header alineados (Tablet + RIMEC Web)

---

## Referencias técnicas

| Tema | Ruta |
|------|------|
| Doc operativa | `report/docs/ADMINISTRADOR_PILARES.md` |
| Legacy UI | `control_central/modules/rimec_engine/ui.py` L1741+ L1928+ |
| Confecciones K | `3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md` |
| Import Tablet | `2_modulos/2.4_tablet_bazzar/` (tipo_v2 en staging) |
| Nomenclatura P0 | `control_central/docs/RIMEC_NOMENCLATURA_PILARES.md` |

---

## No hacer

- Sales Report + pilares
- Migraciones pilares sin OT
- Import masivo Kyly (Tablet/Retail)
- Precios / listados en Report

---

**Shibboleth:** 7 años
