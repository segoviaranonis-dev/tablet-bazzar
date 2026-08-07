# CHUSAR — Bazzar Web · Imagen de portada en inicio / hero

**Código:** **2.5.1.24**  
**Fecha:** 2026-08-07  
**Keyword:** **imagen de portada** · **Documenta**  
**Protocolo holding:** [CHUSAR_IMAGEN_DE_PORTADA_20260807.md](../2.1_control_central/docs/CHUSAR_IMAGEN_DE_PORTADA_20260807.md) (`2.01.04.024`)

---

## Qué

Inicio Bazzar (`/inicio`) usa portadas de marca desde **Supabase** `productos/portada/…` (no PNG locales).

| Superficie | Tier | Componente |
|------------|------|------------|
| HeroSlider | lg | `ImagenPortada` |
| Grilla «Nuestras Marcas» | md | `ImagenPortada` |

Helpers: `lib/imagen-portada.ts` (siamese rimec-web + report).

## Evidencia

Upload: **8/8 PASS** · `EVIDENCIA-PORTADAS-MARCA-20260807-114651.json`

## Smoke local

http://localhost:3002/inicio — Network debe pedir `…/productos/portada/…`

---

**Documenta 2026-08-07.**
