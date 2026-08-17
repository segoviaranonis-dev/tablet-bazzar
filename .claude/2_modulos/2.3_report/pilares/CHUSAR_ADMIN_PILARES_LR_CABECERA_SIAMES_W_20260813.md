# CHUSAR — Admin L×R · protocolo siameses = panel Dimensiones∥Molécula

**Código:** **2.3.5.5.1**  
**Fecha:** 2026-08-13 · **saneado** mismo día (orden Director: no más “pills parecidas”)  
**Keyword:** **Documenta** · **aplica el protocolo hermanos siameses**  
**Padres:** FOCO **2.3.5.5** · maestro **2.2.1.44** · mapeo **2.2.1.52** · CABECERA Web **2.2.1.1**  
**App:** Report `:3000` `/pilares/linea-referencia`  
**🆕 MOISES post-20260807 · 2026-08-13**

**Línea 1:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible

---

## 0 · Definición Director (inviolable)

Cuando el Director dice **«aplica el protocolo hermanos siameses»** a **este módulo** (Admin L×R / FOCO pilares), **significa**:

> Instalar el **mismo funcionamiento de filtros** que RIMEC Web: panel dual **DIMENSIONES ∥ MOLÉCULA** (`CatalogoFiltrosSidebar` / paridad `ReposicionFiltrosSidebar`), con todo lo **mapeado** en **2.2.1.52** / maestro **2.2.1.44** §4.

**No significa:** inventar pills naranja · “CABECERA lite” · solo cascada SQL · solo chip Problemas.

**Origen visual canónico (captura Director):**

| Bloque | Contenido mapeado |
|--------|-------------------|
| **DIMENSIONES** | Stock (Todos · Compra previa · Pronta entrega) · Depósito (Todos · D1 · DEP2 · D3) · Categoría (Calzado · Confecciones) · Buscar · AB-CR multi · Marca multi · Tipo multi · Género multi |
| **MOLÉCULA** | Cascada **Estilo → Línea → Referencia → Material → Color** (L-R-M-C 100%) · cada uno multi |

Código ancla W: `rimec-web/app/components/CatalogoFiltrosSidebar.tsx`  
Paridad Report ya existente: `report/src/components/herramienta-reposicion/ReposicionFiltrosSidebar.tsx`

---

## 1 · Retractación (errores de agente)

| Error | Estado |
|-------|--------|
| Interpretar siameses = pills / barra horizontal | ❌ **RETRACTADO** |
| Doc `2.3.5.5.1` v1 prometiendo “réplica FiltrosCatalogo pills” sin sidebar dual | ❌ **RETRACTADO** · este archivo manda |
| Declarar AP “hermano W” sin UI Dimensiones∥Molécula | ❌ incumplimiento |

---

## 2 · Hermano AP

| Sigla | Superficie | UI obligatoria |
|-------|------------|----------------|
| **W** | rimec-web catálogo | `CatalogoFiltrosSidebar` |
| **AP** | `/pilares/linea-referencia` | `PilaresLrFiltrosSidebar` · misma estructura |

**Universo de datos AP:** `linea_referencia` (+ joins `linea` / retail staging según filtro). Misma UX; SQL adaptado al universo (ley CABECERA **3.2.00.001**).

---

## 3 · Path-a-path (instalación)

| Pieza mapeada | Archivo AP |
|---------------|------------|
| Sidebar dual Dimensiones∥Molécula | `report/.../PilaresLrFiltrosSidebar.tsx` |
| Cascada E→L→R→M→C | `report/src/lib/pilares/lr-cascada-molecula.ts` |
| Cliente + URL | `LineaReferenciaAdminClient.tsx` |
| API filtros | `api/pilares/linea-referencia` |

Omitir en AP **solo** si el Director lo autoriza por escrito. Por defecto: **todo lo mapeado visible e instalado**.

---

## 4 · Andrés / Moises

**Qué:** «aplica siameses» en pilares = **este** panel (captura), no otra cosa.  
**Qué no:** volver a pills naranja · redeclarar cumplido sin Dimensiones∥Molécula.  
**Zip:** Héctor. Sync OPS→Andrés = **OFF**.

---

## 5 · Smoke

1. Abrir `/pilares/linea-referencia` → ver **dos columnas** DIMENSIONES + MOLÉCULA (azul rimec), no fila de pills naranja.  
2. Molécula muestra texto cascada E→L→R→M→C.  
3. Multi en acordeones; dimensión limpia molécula.

```bash
cd report && npx tsx scripts/_smoke_lr_filtro_otros.ts
```

---

**Shibboleth:** Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.
