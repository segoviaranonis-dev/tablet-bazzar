# Navegación cadena — Tablet Bazzar

**Ruta:** `/cadena/vista`  
**Orquestación:** `app/cadena/vista/page.tsx`  
**Doc madre:** [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md)  
**Ley agrupación:** `.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md` · **terciaria:** [agrupacion_terciaria.md](../../../.claude/2_modulos/2.4_tablet_bazzar/agrupacion_terciaria.md)

---

## Cuatro capas (jerarquía)

| Capa | Clave | Dónde en UI | Eje |
|------|-------|-------------|-----|
| **Terciaria** | Marca + **estilo hero** | Delimita sidebar L+R | ←→ si >1 ref en cohorte |
| **Secundaria** | L + R | Sidebar vertical | ←→ (dentro cohorte) |
| **Primaria** | L + R + material | Footer naipes | ←→ si 1 ref |
| **Color** | `color_code` | Mazo + hero | ↑↓ |

**Regla Director:** hero Chatita → costado solo chatitas de esa marca. Doc: [agrupacion_terciaria.md](../../../.claude/2_modulos/2.4_tablet_bazzar/agrupacion_terciaria.md)

---

## Dos niveles (sin duplicar fotos) — referencia rápida

| Nivel | Clave | Dónde en UI | Eje de navegación |
|-------|-------|-------------|-------------------|
| **1 — Principal** | L + R + **material** | Footer (naipes horizontales) + mazo derecho | ←→ cuando hay **una** ref activa |
| **2 — Color** | `color_code` | Mazo apilado (sidebar) + hero | ↑↓ |
| **Cadena secundaria** | L + R (sin material) | Sidebar vertical (solo si >1 ref) | ←→ cuando hay **varias** refs |

**Regla anti-duplicación:** el carrusel **no repite** el mismo ítem si la ventana es mayor que el total (`buildCarouselWindow` en `lib/cadena-carousel.ts`). Con una sola ref filtrada, el footer muestra **materiales distintos**, no cinco veces la misma foto.

---

## Controles

| Entrada | Comportamiento |
|---------|----------------|
| **← →** teclado | Varias refs → siguiente/anterior L+R. Una ref → siguiente/anterior **material** |
| **↑ ↓** teclado | Color anterior/siguiente del material activo |
| Swipe ← → hero | Igual que flechas ← → |
| Swipe ↑ ↓ hero | Igual que flechas ↑ ↓ |
| Bordes hero (invisibles) | Igual que ← → |
| Tap centro hero | Detalle (material, grada, pares) |
| Footer naipes | Salto directo a material (L+R+Mat) |
| Sidebar vertical | Salto directo a par L+R (si hay >1) |
| Tap mazo / badge +N | Rota color (`stepColor`) |
| ⌕ header | Búsqueda código vendedor |

**Sin botones ◀ ▶ visibles** — solo teclado, swipe y zonas táctiles opacas.

Hooks: `lib/use-touch-nav.ts` · `lib/use-cadena-keyboard.ts`

---

## Componentes

| Componente | Archivo | Rol |
|------------|---------|-----|
| Carrusel L+R | `CarruselNaipesLR.tsx` | Sidebar vertical (cadena) |
| Carrusel materiales | `CarruselMateriales.tsx` | Footer — nivel 1 |
| Mazo colores | `MazoMaterialNaipes.tsx` | Sidebar — stack colores |
| Hero | `LineaReferenciaHero.tsx` + `ProductImage` | Foto grande + overlays |
| Stock live | `StockOtrosLocales.tsx` | 3 ubicaciones (poll) |

---

## Estado en URL

| Param | Significado |
|-------|-------------|
| `marca` | Marca cadena (obligatorio en vista) |
| `cliente_id` | Depósito (2100 = Fernando Adultos) |
| `refs` | Claves L+R: `linea\|referencia`. **Varias** separadas por **coma** (`1184\|1101,1184\|1161`) |
| `q` | Texto búsqueda heredado de entrada |
| `estilos` | Filtro multi (pipe entre estilos) |
| `pi`, `gi`, `c1`, `c2` | Posición inicial (par, grupo material, colores) |

**Parser refs:** `parseReferenciaKeysParam` en `lib/filtros-url.ts` — una clave `1184|1101` **no** se parte por el pipe interno.

---

## Archivos de lógica

| Archivo | Rol |
|---------|-----|
| `lib/cadena.ts` | `buildCadenaFromFilas`, `GrupoPrincipal`, `ParLineaRef` |
| `lib/cadena-server.ts` | `resolverMarcaIngreso`, `filtrarParesServer` |
| `lib/cadena-filtros.ts` | Filtros estilo/ref en vista |
| `lib/cadena-carousel.ts` | `buildCarouselWindow`, preview thumb |
| `lib/codigo-busqueda.ts` | Parser `1122.828-100-5` |
| `lib/filtros-url.ts` | Serialización URL filtros + refs |

---

## Smoke test (Director)

```text
1. Login → /cadena → Fernando Adultos
2. Buscar "1184" → INGRESAR
3. Vista VIZZANO: footer = materiales distintos (no clones)
4. Flechas ← → cambian material o ref según contexto
5. Flechas ↑ ↓ cambian color; hero actualiza foto y stock
6. Click ref en lista → vista con stock (no "Sin stock")
```

---

**Última actualización:** 2026-06-11 · sub-etapa UI navegación + fix filtros
