# CHUSAR — Memoria Web (tablero HTML)

**Proyecto:** `nexus-navegador-holding/` · **Next.js** · dev `:3004` · Legacy: `memoria-web/` redirige  
**Entrada:** `index.html` (bienvenida) → `hub.html` (4 portales)  
**Integrado:** 2026-06-17 · **Orden:** Director  
**Shibboleth:** 7 años

---

## Qué es

**Hermano siames del protocolo Chusar, del INDICE y de la memoria secundaria.**

Un mismo organismo, dos caras:

| Cara | Dónde | Quién la usa | Qué es |
|------|--------|--------------|--------|
| **Memoria secundaria** | `.claude/` · `MORIA_PRIMARIA.md` · `INDICE_MAESTRO.md` · `CODIGO_MAESTRO.md` | Agentes | Verdad operativa · git · Chusar · plan `C.LL.SS.NNN` |
| **Memoria Web / Navegador Holding** | `nexus-navegador-holding/` | Director · web pública | Misma jerarquía · numeración · **navegador central** productos + docs |

No compiten. No se contradicen. Si el `.md` cambia (etapa, módulo, cierre), el HTML hermano **debe** reflejarlo. Si el Director consulta el HTML, el agente lee el `.md` fuente y sincroniza.

```
INDICE / Moria (árbol títulos)  ←——→  memoria-web (árbol HTML)
         ACTUAL.md              ←——→  hub / 4-etapas/actual
         CHUSAR_*.md            ←——→  tarjetas módulo / etapa
         CODIGO_MAESTRO         ←——→  código 2.1, 2.2… en pantalla
```

**Chusar** integra contexto en `.claude/` **y** actualiza al hermano HTML. **Consulta etapas** = hablar mirando el gemelo visual.

Sitio **estático multipágina**: árbol espeja Moria (`1` fundamentos · `2` módulos · `3` arquitectura · `4` etapas). El Director navega **cerradas → módulo → activa**.

---

## Cuándo sincronizar (agente)

| Keyword Director | Acción |
|------------------|--------|
| **Documentación Chusar** | Actualizar HTML de la rama tocada + `ACTUAL.md` |
| **Consulta etapas** · **ETAPAS_VIVO** | Abrir `memoria-web/index.html` o `4-etapas/actual.html`; actualizar si desfasado |

**No** convertir todo el `.md` a HTML de golpe — solo páginas del árbol que cambien (etapa nueva, cierre, módulo).

---

## Estructura carpeta

```
memoria-web/
├── index.html
├── assets/css/site.css
├── 4-etapas/          ← timeline + actual + activas/ + cerradas/
└── 2-modulos/         ← 2.1 … 2.5 por producto
```

Cada HTML: sidebar común + breadcrumb + enlace al `.md` fuente en `.claude/`.

---

## Reglas

1. **Independiente** de Vercel/apps — abrir local en navegador.
2. **No** duplicar leyes de negocio — resumen + link al `.md`.
3. Etapa cerrada → mover card a `4-etapas/cerradas/[slug].html`.
4. Etapa nueva → `4-etapas/activas/[slug].html` + actualizar sidebar en todas las páginas del mismo nivel (o script futuro).
5. **Plan de cuentas — orden sagrado:** tarjetas y menús **siempre** en orden numérico ascendente (`1` → `2.1` → `2.1.1` → `2.1.1.1` …). El badge «etapa aquí» **no** mueve la tarjeta arriba.
6. **Profundidad contable:** cada subcuenta puede tener HTML propio + botones **Streamlit** / **Vercel** / **MD local** (hermano del `.md` en `.claude/`). Ejemplo Sales Report: `2.1.1` → `2.1.1.1` Dashboard · `2.1.1.2` Clientes · `2.1.1.3` Marcas · `2.1.1.4` **Vendedores** (pestañas `/rimec?mundo=…`).

---

**Legacy:** `.claude/4_etapas/ETAPAS_VIVO.html` redirige aquí.
