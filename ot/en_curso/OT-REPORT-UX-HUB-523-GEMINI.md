# OT-REPORT-UX-HUB-523 — Report web: un solo estilo Obsidian + Oro (consultoría Gemini)

**Ejecutor:** Antigravity (Gemini) — **solo diseño / diagnóstico**  
**Repo:** `C:\Users\hecto\Nexus_Core\report` (Next.js)  
**Claude Code:** sigue con `OT-MOTOR-OPTIMIZADO-FINAL-001` en paralelo — **no tocar**

---

## Disparador

> **Ejecuta la OT**

Leé `ot/COLA.md` → esta OT → respondé en **`ot/RESPUESTA_ANTIGRAVITY.md`**.

---

## Contexto del Director (no negociable)

- Plataforma de **informes ejecutivos** a partir de Excel / BD (~**USD 14M** bajo gestión).
- **Uso exclusivo del Director** de la empresa — tono institucional serio, **no lúdico**, no “demo de juguete”.
- Estilo deseado: **Obsidian + oro** (mismo lenguaje que Nexus / Motor: fondo slate/obsidian, acento **`#D4AF37`**).
- Hoy hay **dos herramientas** (más vendrán):
  1. **Reporte de ventas** → ruta principal `/rimec`
  2. **Reporte de ventas en tienda** → confirmar en repo si es `/retail`, vista filtrada en `/rimec`, u otra; proponer nombre y card en el hub

---

## Problema reportado

La **portada** (`/`, `src/app/page.tsx`) se siente **extraña** y **no acorde** al resto:
- Parece un **documento de misión/visión** largo (“Documento de trabajo — demostración”), no un **centro de mando** con acceso a herramientas.
- Conviven **varios sistemas visuales** en el mismo producto.

### Pistas técnicas (para tu diagnóstico — leer en repo)

| Token / zona | Archivo | Estética |
|--------------|---------|----------|
| `report-*` (paper crema, navy, gold `#7a6233`) | `tailwind.config.ts`, `layout.tsx`, `page.tsx`, `ReportCover` | Informe institucional **claro** |
| `exec-*` (canvas claro cálido) | `RimecClient.tsx`, `/rimec/clasico` | Minimal ejecutivo **claro** |
| Oscuro + **amarillo Tailwind** (`yellow-400`, `slate-950`) | `ImmersiveClient.tsx`, `/rimec` | Dashboard **oscuro** (no oro Nexus `#D4AF37`) |
| `rim-*` (void `#070b12`) | `tailwind.config.ts` | Definido pero **poco usado** en home |

**Nav global:** `ReportAppNav` usa barra **navy clara**; `/rimec` usa header **negro/glass** distinto.

---

## Tu misión (solo consultoría)

1. **Explicar en lenguaje Director** por qué hoy “se ven dos (o tres) estilos” y qué rompe la confianza ejecutiva.
2. **Proponer portada nueva** (`/`): hub con 2 cards (ventas + ventas tienda), espacio para N herramientas futuras, Obsidian + oro `#D4AF37`.
3. **Design tokens unificados** (tabla: color, uso, reemplazo de `yellow-400` / `report-gold` viejo).
4. **Copy** en español — títulos cortos, sin “demostración” ni párrafos de misión en la home.
5. **Wireframe textual** o ASCII de la home + barra de navegación coherente con `/rimec`.
6. **Qué NO hacer:** SQL, tablas nuevas, código React (Claude integra después).

---

## Preguntas obligatorias (tabla en RESPUESTA)

| ID | Pregunta |
|----|----------|
| R1 | ¿Por qué coexisten `report-*`, `exec-*` y oscuro `/rimec`? Causa raíz en 3 bullets. |
| R2 | ¿La home actual cumple rol de “Director USD 14M”? Sí/No + por qué. |
| R3 | Propuesta de **home hub** (estructura + copy de 2 herramientas). |
| R4 | Paleta unificada Obsidian + Oro (hex + Tailwind names sugeridos). |
| R5 | ¿Qué hacer con `/informes`, `/retail`, “Vista clásica”? ¿Secundarios, ocultos, o mismo shell? |
| R6 | Veredicto: **PARCHE copy** \| **REDISEÑAR home** \| **REDISEÑAR todo report web** |

---

## Dónde responder

**Solo:** `C:\Users\hecto\Nexus_Core\ot\RESPUESTA_ANTIGRAVITY.md`

No uses `RESPUESTA_EJECUTOR.md` (es de Claude).

---

## Al terminar

Decí **Listo** con el archivo guardado en disco.
