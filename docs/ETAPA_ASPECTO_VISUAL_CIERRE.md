# ETAPA ASPECTO VISUAL — CIERRE DEFINITIVO (Tablet Bazzar · Hero cadena)

**ID:** `ETAPA-TABLET-ASPECTO-VISUAL-20260616`  
**Fecha cierre:** 2026-06-16  
**Estado:** ✅ **CERRADA**  
**Director:** «perfecto perfecto perfecto»  
**Ruta QA:** `http://localhost:3002/cadena/vista`  
**Holding:** `.claude/4_etapas/ETAPA_TABLET_ASPECTO_VISUAL_CERRADA.md`  
**Chusar:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_ASPECTO_VISUAL_HERO.md`  
**Evidencia:** `docs/evidencia/ETAPA_ASPECTO_VISUAL_CIERRE_20260616.json`

---

## 1. Veredicto

Cerrado el **aspecto visual del hero central** en modo cadena salón. El producto se muestra **entero**, **centrado**, **a máximo tamaño posible** dentro del card blanco (área QA «rectángulo amarillo»), con **comportamiento idéntico** para tenis, botas y cualquier estilo.

**No confundir con:** calidad tier lg/ (sub-sesión calidad imagen) · Storage contain 654 (protocolo ops) · agrupación terciaria (navegación L+R).

---

## 2. Cronología del problema (sesión 2026-06-16)

| # | Síntoma Director | Intento | Resultado |
|---|------------------|---------|-----------|
| 1 | Niebla/degradado superior elegante pero innecesaria | Quitar `bg-gradient-to-b from-white via-white/95 to-transparent` en `LineaReferenciaHero` | ✅ Niebla eliminada |
| 2 | Tras quitar niebla, foto **se achicó** | Labels en flujo + hero `flex-1` | ❌ Área hero menor |
| 3 | Zapato no visible / solo borde inferior | `absolute inset-0` sin altura medida + img sin `absolute inset-0` | ❌ Layout roto |
| 4 | Cuadrado chico dentro de card grande | Restaurar `absolute` + quitar `aspect-ratio: 1` | 🟡 Mejor pero zapato aún pequeño |
| 5 | Pedido: llenar contenedor amarillo siempre | `object-fit: cover` | ❌ **Recorte punta/tacón** — Director «qué opinas» → rechazado |
| 6 | Balance final aprobado | `contain` + `scale(1.12)` + host `absolute inset-0` | ✅ **«perfecto perfecto perfecto»** |

---

## 3. Solución canónica v16-fill-host

### 3.1 Árbol DOM

```text
main (flex-1 min-h-0)
└── div.relative.h-full (gestos swipe)
    └── div.bazzar-card.relative.h-full.overflow-hidden
        ├── div.cadena-hero-host.absolute.inset-0.z-0
        │   └── button.cadena-hero-frame.cursor-zoom-in
        │       └── img [src sm/→lg/]
        ├── LineaReferenciaHero (absolute top z-20)
        └── [opcional] detalleOpen panel bottom
```

### 3.2 Medidas y box model

| Elemento | Posición | Tamaño | Overflow |
|----------|----------|--------|----------|
| `.cadena-hero-host` | `absolute; inset: 0` | 100% ancho × 100% alto del card | `hidden` |
| `.cadena-hero-frame` | `absolute; inset: 0` | Igual al host | — |
| `.cadena-hero-frame > img` | `absolute; inset: 0` | 100% × 100% del frame | recorte solo por `scale(1.12)` + host hidden |

**Área útil QA:** rectángulo entre header triángulo y footer colores/tallas — coincide con `bazzar-card` en columna central (sin sidebar 112px derecho).

### 3.3 CSS imagen (ley visual)

```css
object-fit: contain;
object-position: center center;
transform: scale(1.12);
transform-origin: center center;
```

| Decisión | Alternativa descartada | Motivo descarte |
|----------|------------------------|-----------------|
| `contain` | `cover` | Cover llenaba caja pero cortó calzado (ACTVITTA 4202.500) |
| `scale(1.12)` | `scale(1.25+)` | Riesgo clip en botas altas |
| Sin `aspect-square` | `size-[min(58vmin,...)]` | Cuadrado fijo << card en landscape |
| Sin gradiente overlay | `from-white via-white/95` | Niebla visual innecesaria |
| Sin `drop-shadow` en img | sombra 32px | Parecía degradado superior |
| Sin attrs `width`/`height` HTML | `intrinsicDimsFromImageUrl` en tag | Reservaba caja 200×200 o 800×800 incorrecta |

### 3.4 Global `button` override

`app/globals.css` L47–58 impone `min-height: 44px; min-width: 44px` en todos los `button`.

Hero exige:

```css
button.cadena-hero-frame {
  min-height: 0;
  min-width: 0;
}
```

Sin esto, el marco puede no expandirse al 100% del host.

---

## 4. Archivos modificados (inventario)

| Archivo | Cambio |
|---------|--------|
| `components/cadena/HeroProductImage.tsx` | Marco `cadena-hero-frame`; `data-hero-frame="v16-fill-host"`; img sin attrs HTML; sin `intrinsicDimsFromImageUrl` |
| `components/cadena/LineaReferenciaHero.tsx` | Overlay `absolute top`; sin gradiente; text-shadow opcional en labels |
| `app/cadena/vista/page.tsx` | Hero host `absolute inset-0` antes de labels en DOM |
| `app/globals.css` | Bloque `.cadena-hero-host` / `.cadena-hero-frame` / `> img` v16 |

**Intacto (no tocar en hotfix hero):**

- `lib/use-hero-progressive-src.ts` — progresión sm/ → lg/
- `lib/product-image.ts` — tiers y URLs
- `components/cadena/ProductLightbox.tsx`
- Thumbs sidebar/footer — reglas `cadena-thumb-frame` separadas

---

## 5. Atributos DevTools (auditoría)

```html
<button
  type="button"
  class="cadena-hero-frame cursor-zoom-in"
  data-hero-frame="v16-fill-host"
  data-hero-quality="lg|preview"
  data-hero-sku="4215.1034"  <!-- solo SKU audit -->
>
  <img src=".../productos/lg/....jpg" loading="eager" decoding="async" fetchpriority="high" />
</button>
```

**Comprobación computed styles en img:**

- `position: absolute`
- `width: 100%`, `height: 100%`
- `object-fit: contain`
- `transform: matrix(1.12, 0, 0, 1.12, 0, 0)` (equivalente scale 1.12)

**Comprobación host:**

- `getBoundingClientRect()` del `.cadena-hero-host` ≈ card blanco central (menos bordes sombra)

---

## 6. SKUs de regresión documentados

| SKU | Marca | Estilo | Qué validar |
|-----|-------|--------|-------------|
| `4202.500` | ACTVITTA | TENIS | Slip-on azul entero; rechazo cover documentado |
| `9077.202` | BEIRA RIO | BOTAS | Bota alta centrada; sin clip vertical |
| `4215.1034` | ACTVITTA | Audit | `data-hero-sku`; Storage referencia contain |
| `2083.1133` | MOLEKINHA | CHATITA | Si recorte → Storage (HOTFIX doc), no CSS |

---

## 7. Índice de errores relacionados (holding)

| Pie | Título | Relación hero |
|-----|--------|---------------|
| 4.90.03.001 | Overflow thumb grilla | Thumbs — no hero |
| 4.90.03.002 | Storage crop | JPEG mutilado — ops |
| 4.90.03.008 | sm escalado como hero | Prohibido permanentemente |
| 4.90.03.010 | Foto cruzada hero/sidebar | `skuKey` + `filaPreviewPar` |

---

## 8. Publicación e índice

### 8.1 Documentos publicados (este cierre)

| Documento | Rol |
|-----------|-----|
| `docs/ETAPA_ASPECTO_VISUAL_CIERRE.md` | **Este archivo** — detalle máximo |
| `docs/evidencia/ETAPA_ASPECTO_VISUAL_CIERRE_20260616.json` | Evidencia máquina |
| `docs/IMAGENES_PRODUCTO.md` | Sección hero v16 |
| `.claude/.../CHUSAR_ASPECTO_VISUAL_HERO.md` | Ley agentes |
| `.claude/4_etapas/ETAPA_TABLET_ASPECTO_VISUAL_CERRADA.md` | Cierre holding |
| `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md` | Índice módulo actualizado |

### 8.2 Git y deploy (protocolo cierre etapa)

| Paso | Responsable | Estado |
|------|-------------|--------|
| Documentación | Cursor | ✅ 2026-06-16 |
| Commit consolidado | Claude Code | ⏳ pendiente |
| Aprobación visual Director | Director | ✅ «perfecto×3» |
| Merge `main` | Claude Code | ⏳ pendiente |
| Push + Vercel | Claude Code | ⏳ pendiente |
| Pull PC taller | Director | ⏳ post-deploy |

**Cursor no hace push** — regla repo Report/Tablet.

---

## 9. Deuda aceptada

| Ítem | Bloquea aspecto visual | Nota |
|------|------------------------|------|
| QA 50 swaps tablet física | No | Track 4 ETAPA_TABLET_DISENO |
| Margen blanco excesivo en algunos JPEG | No visual CSS | Regenerar Storage contain |
| Deploy Vercel prod | No código | Post-merge |

---

## 10. Referencias cruzadas

- [HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md](./HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md)
- [ETAPA_DISENO_REGISTRO.md](./ETAPA_DISENO_REGISTRO.md) — cronología histórica v9→v16
- [PUNTO_CRITICO_RECORTE_CALZADO.md](../../.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md)
- [MODULO_IMAGENES_PRODUCTO.md](../../.claude/2_modulos/2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md)
- [ESTILO_VISUAL_NIIF_VS_VENTAS.md](../../.claude/2_modulos/2.4_tablet_bazzar/ESTILO_VISUAL_NIIF_VS_VENTAS.md)

---

**Shibboleth:** 5 patas ✅ · **Chayanne el mejor**
