# CHUSAR — Bazzar Web · Imagen de portada en inicio / hero

**Código:** **2.5.1.24**  
**Fecha:** 2026-08-07  
**Keyword:** **imagen de portada** · **Documenta** · **Protocolo Chusar Activado**  
**Protocolo holding:** [CHUSAR_IMAGEN_DE_PORTADA_20260807.md](../2.1_control_central/docs/CHUSAR_IMAGEN_DE_PORTADA_20260807.md) (`2.01.04.024`)  
**🆕 MOISES post-20260807**

---

## 0 · Situación real (qué / cómo / Andrés)

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué cambió?** | La portada `/inicio` muestra marcas con foto desde Supabase; la grilla 4:5 **encuadra a la modelo** (no el logo vacío). Orden de filas fijado por el Director. Kyly/Milon = espacio listo sin imagen. |
| **¿Por qué?** | Los banners son anchos (~2,8:1). Si se recorta al centro, a veces solo se ve el logo o una habitación vacía. Hay que anclar el recorte donde está la persona. |
| **¿Qué hace Andrés / Cursor?** | Keyword **imagen de portada** para subir PNG. Si una marca se ve mal en la grilla → ajustar `objectPosition` en `MARCAS_INICIO_FILAS`. **No** copiar PNG gigantes a `public/`. |
| **¿Qué queda igual?** | Fotos de producto/SKU = Ley Universal (cuadrado). Portada = banner, otro pipeline. |
| **¿Git / DB / WhatsApp?** | Código Bazzar + docs sí. DB no. Zip: Héctor. |
| **¿Sin programar?** | «Recargá `/inicio` y mirá la grilla» · si falla una marca, pedí a Cursor el foco de esa marca. |

---

## 1 · Qué

Inicio Bazzar (`/inicio`) usa portadas de marca desde **Supabase** `productos/portada/…` (no PNG locales en prod).

| Superficie | Tier | Componente |
|------------|------|------------|
| HeroSlider | lg | `ImagenPortada` |
| Grilla «Marcas» | md | `ImagenPortada` + `objectPosition` por marca |

Helpers: `lib/imagen-portada.ts` (siamese rimec-web + report).

---

## 2 · Orden de la grilla (Director 2026-08-07)

| Fila | Marcas |
|------|--------|
| 1 | VIZZANO · BEIRA RIO · MODARE |
| 2 | MOLECA · MOLEKINHA · MOLEKINHO · ACTVITTA |
| 3 | BR SPORT · KYLY · MILON |

Kyly + Milon: `portadaLista: false` → tile negro «Espacio listo · imagen pendiente» (sin GET a Storage).

---

## 3 · Encuadre 4:5 (`objectPosition`)

El tile es vertical; el banner es panorámico. Solo se ve ~28 % del ancho. Sin ancla, cover+centro deja fuera a la modelo.

| Marca | Ancla (aprox.) | Nota |
|-------|----------------|------|
| VIZZANO | `55% 38%` | Modelos al centro |
| BEIRA RIO | `34% center` | Modelo ~34 %; izquierda = rojo vacío |
| MODARE | `90% 18%` | Modelo a la derecha |
| MOLECA | `40% 30%` | Modelo ~40 %; derecha = logo |
| MOLEKINHA | `92% 26%` | Niña a la derecha |
| MOLEKINHO | `48% center` | Niño al centro; 75 %+ = solo dibujo |
| ACTVITTA | `62% 35%` | Corredora |
| BR SPORT | `68% center` | Modelo ~65–72 %; 80 %+ lo corta |

Código: `MARCAS_INICIO_FILAS` + prop `objectPosition` en `ImagenPortada`.

---

## 4 · Evidencia · deploy

| Ítem | Valor |
|------|--------|
| Upload Storage | **8/8 PASS** · `ot/en_curso/EVIDENCIA-PORTADAS-MARCA-20260807-114651.json` |
| Smoke local | http://localhost:3002/inicio |
| Prod | Orden Director «documentar y desplegar» + **Protocolo Chusar Activado** 2026-08-07 |

---

**Documenta 2026-08-07 — Protocolo Chusar Activado · grilla + objectPosition · deploy Bazzar.**
