# CHUSAR — Adecuación Bazzar Web ↔ RIMEC + auditoría local senior

**Código:** **2.5.1.8**  
**Fecha:** 2026-08-02  
**Keyword:** **Documenta** · plan Director *Auditoría local senior + adecuación Bazzar Web*  
**Apps:** Bazzar Web (`:3002`) · referencia canónica RIMEC Web  
**Shibboleth:** Andrés, el que viene.

---

## 1. Ley de calidad agente (anti-mediocridad)

Entregables de **auditoría de stock / catálogo** en Bazzar **no** se cierran con solo agregados Dep/Sano/Web.

| Obligatorio | Prohibido |
|-------------|-----------|
| Ramos separados **Calzado (654)** / **Confecciones (638)** | Una sola grilla mezclada como única vista |
| Detalle molecular **5 pilares** (+ descripciones) | Solo conteos por marca |
| **Grada / talles** según ramo (654 curva · 638 am_talle×precio) | Mezclar 34–39 calzado como talle Kyly |
| Separar `ok_stock` vs `ok_grada_638` | Banner PASS global si grada 638 falla |
| Medias/ropas 654 = chip **dentro de Calzado** | Tratar medias/ACT ROPAS como UI Kyly (638) |
| Criterio PASS + smoke local | Declarar “listo” sin API 200 / totales coherentes |
| Shibboleth + cierre 💰 COSTO | Omitir `Terminal:` |

**Inspiración UI obligatoria (no inventar):**  
`rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md` · `CatalogConfeccionesTallas` · `gradaAbierta638` · `pe-modulo-medias`.

---

## 2. F0 entregado — Estadísticas de Stock v2.4 (`/auditoria-local`)

| Pieza | Ruta |
|-------|------|
| Gate no-deploy | `enabled.ts` + middleware |
| API | `queries.ts` · `types.ts` · `medias654.ts` · `grada638.ts` |
| UI | tabs · cabecera grada marca · Web/Dep × talle · toggle fotos NIIF |
| Keyword | **estadisticas de Stock** |
| Doc módulo | **2.5.1.7** (completo) |

**Orden 638 cabecera:** `1·2·3 → P·M·G·GG → 4·6·8 → 10…`  
**Cantidades:** Σ celdas ALM = Tot marca (no prendas PPD en celdas).  
**Grada 638:** PPD `am_talle` / F9 TC Tallas — no `talla_codigo` 34–39.

**Prohibido deploy** hasta cierre de etapa u orden directa del Director.

---

## 3. Gap funcional catálogo (Bazzar hoy vs RIMEC)

Fuente: `bazzar-web/docs/AUDITORIA_BAZZAR_WEB.md` + observación tienda `:3002`.

| Gap | Estado Bazzar | Canónico RIMEC a espejar |
|-----|---------------|---------------------------|
| Rama 638 (talles / precio por talle) | Agrupa L+R+Mat; tallas sueltas; riesgo UI “colores” | `CatalogConfeccionesTallas` · detector 638 |
| Badges col vs tall | No paridad | Panel origen / badges ramo |
| Imagen dual 654/638 | Parcial (stems Excel / Kyly) | Ley Universal Imágenes + stems proveedor |
| Filtros AB-CR / medias 654 | Incompletos o frágiles | `pe-modulo-medias` · filtros siameses Tipo |
| Paridad total `ProductoCard` | **Fuera de F0** — roadmap F1+ | No fingir “listo” con resumen |

---

## 4. Gap seguridad (backlog priorizado)

De `AUDITORIA_BAZZAR_WEB.md` (no resuelto en F0):

1. Rate-limit durable (serverless) en checkout / cédula  
2. CSP unificada (middleware ↔ `next.config`)  
3. Server actions con service_role — endurecer (CAPTCHA, token pedido, RLS)  
4. `/pedido/[id]` sin ownership  
5. Secretos históricos en repo — rotación / purge (ops Director)

---

## 5. Roadmap por fases (orden Director)

| Fase | Alcance | Criterio PASS | Deploy |
|------|---------|---------------|--------|
| **F0** | Auditoría local v2.3 (ramos + pilares + grada 654/638) | Tabs · acordeón · API 200 · `ok_stock`/`ok_grada_638` honestos | **No** |
| **F1** | Catálogo tienda — rama 638 + detector + UI talles B2C | Kyly vende por talle; badges correctos | No hasta orden/cierre |
| **F2** | Filtros / AB-CR / medias 654 sin romper venta abierta | Medias en Calzado; Normal ≠ PROMO si aplica | Idem |
| **F3** | Seguridad (headers, rate-limit, hardening checkout) | Checklist AUDITORIA § críticas mitigadas o deuda explícita | Idem |
| **F4** | Paridad operativa restante (checkout, stock post-import, smoke NIIF) | Smoke Director en `:3002` | Idem |

**Archivos canónicos RIMEC a portar (adaptar B2C, no copiar B2B ciego):**

- `rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md`
- `rimec-web/components/catalog/CatalogConfeccionesTallas.tsx`
- `rimec-web/lib/gradaAbierta638.ts`
- `rimec-web/lib/filtros/pe-modulo-medias.ts`
- `rimec-web/lib/filtros/filtro-tipo-canonico.ts` (siamese con Report AM)

---

## 6. Relación docs

| Código | Rol |
|--------|-----|
| **2.5.1.7** | Módulo LOCAL tienda · gate no-deploy · cruce Dep/Sano/Web |
| **2.5.1.8** (este) | Norma calidad · gaps · roadmap F0–F4 · detalle senior UI |
| **2.5.1.6** | Report integridad (distinto) — no mezclar |

---

**Índice módulo:** [INDICE.md](./INDICE.md) · Portal `:3004/modulos/bazzar-web`
