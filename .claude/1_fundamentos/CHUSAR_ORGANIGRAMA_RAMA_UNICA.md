# CHUSAR — Organigrama · rama única (Navegador Holding)

**Código:** `2.0.2` · **Estado:** ACTIVO · **2026-07-10**  
**App:** `nexus-navegador-holding/` · Local `:3004` · Prod `https://moriachusar.vercel.app`  
**Autoridad:** Director · keyword **Documenta**

---

## Qué es

Navegación de **Módulos / Report** sin sidebar profundo: **organigrama de tarjetas sucesivas** (estilo NIIF claro). Al expandir una rama, los **hermanos se ocultan** y solo esa rama queda centrada con sus hijos en **fila horizontal**.

---

## Comportamiento (ley UX)

| Acción | Resultado |
|--------|-----------|
| `+` en un nodo con hijos | Hermanos desaparecen · nodo centrado · hijos en fila horizontal |
| `+` en un hijo | Misma lógica · nietos debajo · hermanos del hijo ocultos |
| `−` en el nodo centrado | Sube un nivel · reaparecen hermanos |
| Miga (breadcrumb) | Salta a cualquier ancestro del drill |
| Buscar | Lista filtrada (modo búsqueda; no drill) |

**Bazzar Web** (`2.3.3` · slug `bazzar-web-modulo`) es **3ª rama** al mismo nivel que RIMEC y Bazzar — no renombrar ni ocultar.

---

## Layout

- Contenedor **pantalla completa** bajo header/tabs (`flush` + `org-card-viewport--full`).
- Hijos **siempre centrados** bajo el padre (`org-card-node__children-track` + fila `max-content`).
- Con muchos hijos: scroll horizontal; barra conectora solo del ancho del grupo.

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/components/ModuloOrganigrama.tsx` | Drill-down · tarjetas · holding |
| `src/app/globals.css` | `org-card-*` · `org-drill-*` · fullscreen |
| `src/components/ModuloShellFull.tsx` | `flush` · main flex |
| `src/app/modulos/[slug]/page.tsx` | Report/producto · fullscreen |
| `src/app/modulos/[slug]/[childSlug]/page.tsx` | Hijo activo · fullscreen |
| `config/arbol-modulos.json` | Árbol Report · 3 ramas |

---

## Operación local

Si la página carga sin colores (HTML 200 + CSS 404): matar `:3004`, borrar `.next`, `npm run dev:clean` o `INICIAR.bat`.

---

## Deploy

| Campo | Valor |
|-------|--------|
| Proyecto Vercel | `moria_chusar` |
| URL | https://moriachusar.vercel.app |
| Sync memoria | `npm run sync:holding` (prebuild) |
| Regla | Solo cierre etapa **o** orden directa Director |

---

## Verificación

1. http://localhost:3004/modulos/report — raíz Report + 3 tarjetas centradas  
2. `+` RIMEC → solo RIMEC + 10 hijos horizontales  
3. Prod: https://moriachusar.vercel.app/modulos/report  

**Shibboleth:** Andrés, el que viene.
