# CHUSAR — Admin LR · Filtros flotantes sin scroll (herramientas maestra)

**Código:** **2.3.5.13**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta + despliega (Director: filtros siempre visibles · flotantes)  
**App:** Report `:3000/pilares/linea-referencia` · prod rimec-report  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**Padres:** **2.3.5.12** PE/SDRM + ley FK · **2.3.5.11** re-arq UI  
**🆕 MOISES · 2026-08-17**

---

## 0 · Situación real

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué no gustaba?** | Contenedor único con `overflow` + scrolls anidados en Dimensiones/Molécula y en listas (Estilo, etc.). |
| **¿Qué pidió el Director?** | Filtros **siempre visibles**, contenedor que **se extiende**, paneles **flotantes** — son herramientas de admin de maestra L×R. |
| **¿Qué se hizo?** | Sin `max-h` ni `overflow-y` en bloques/listas · paneles sticky con sombra · grilla aparte. |

---

## 1 · Ley UI

1. Filtros = **herramientas** de la maestra (no cajita scrolleable dentro de otra).  
2. Listas multi (Estilo, Marca, Línea…) **crecen** con el contenido; scroll = **página**, no el panel.  
3. Dimensiones y Molécula = paneles **flotantes** (`sticky` + sombra + ring) en desktop.  
4. Grilla/editor en tarjeta propia; **no** atrapar filtros en un `overflow-hidden` padre.  
5. Sigue vigente **2.3.5.12**: maestra → FK filtros · SDRM/PE = solo scope.

---

## 2 · Archivos

| Archivo | Cambio |
|---------|--------|
| `PilaresLrFiltrosSidebar.tsx` | Sin scroll interno · asides flotantes |
| `LineaReferenciaAdminClient.tsx` | Grid items-start · sin caja overflow única |
| (vigente) `queries.ts` / PE | **2.3.5.12** sin cambio de ley |

---

## 3 · Smoke Director

1. Prod `/pilares/linea-referencia?tipo_v2_id=2` — paneles con sombra, sin scrollbar interno en Estilo.  
2. Abrir Estilo completo → página crece; filtros siguen sticky arriba.  
3. PE sigue filtrando SDRM venta hoy.

---

## Relacionados

**2.3.5.12** · **2.3.5.11** · **2.3.5.5.1** siameses
