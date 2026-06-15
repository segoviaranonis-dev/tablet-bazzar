# HOTFIX — Hero recortado MOLEKINHA 2083.1133 (error crítico)

**Fecha cierre:** 2026-06-15  
**Estado:** **RESUELTO** — validado en piso (`/cadena/vista`, cliente 2900)  
**SKU caso:** MOLEKINHA CHATITA **2083.1133** · `2083-1133-13488-16072.jpg`  
**Protocolo madre:** [PUNTO_CRITICO_RECORTE_CALZADO.md](../../.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md)

---

## Síntoma (error crítico)

En salón tablet, el hero de **2083.1133** mostraba solo la puntera del zapato: tacón cortado, imagen «zoom» dentro del marco blanco. El mismo defecto aparecía en la miniatura activa del sidebar. Parches CSS v15–v22 **empeoraron** el layout sin arreglar el calzado.

**Regla de oro:** si el JPEG en Storage ya viene recortado, `object-contain` en React **no puede** recuperar punta ni tacón.

---

## Diagnóstico — dos capas (orden obligatorio)

### 1. Storage (causa raíz — FAIL)

| Tier | Antes | Después (fix) |
|------|-------|---------------|
| Origen local | `imagenes/2083-1133-13488-16072.jpg` **800×545**, ml=24 mr=15 | — |
| `sm/` | 200×200, **4693 B**, zapato cortado en archivo | 200×200, **4047 B**, contain ✅ |
| `lg/` | 800×800, crop legacy (≠ upscale de sm) | 800×800, ml=24 mr=15 ✅ |
| `flat` | 200×200 copia del sm recortado | 800×545 desde origen ✅ |

Auditoría: descargar tier, medir bbox del calzado vs canvas. Si foto horizontal en cuadrado tiene **márgenes laterales 0** y falta punta/tacón **en el archivo** → FAIL Storage (no CSS).

### 2. CSS (secundario — PASS tras Storage)

Tras regenerar tiers, el frontend solo debe **mostrar fielmente** el JPEG:

| Elemento | Valor canónico |
|----------|----------------|
| Componente | `components/cadena/HeroProductImage.tsx` |
| Build | `data-hero-frame="v9-bare-img"` |
| Imagen | `<img>` directo, **sin** wrapper `ProductImage` en hero |
| Tier hero | `pickHeroLoadSequence`: **sm/** → lg → flat |
| CSS | `object-contain object-center` en marco cuadrado |
| Layout | Hero en capa absoluta centrada; overlays (`LineaReferenciaHero`, stock) encima |

**Prohibido en hero:** parches `vmin`, `background-image`, `width/height` HTML desacoplados del tier, padding en `<img>` con `absolute inset-0`.

---

## Mapa del error (2083.1133)

```
Origen local 800×545 (zapato completo)
        ↓ conversión legacy (crop centrado)
Storage sm/lg 200/800 cuadrado — punta/tacón CORTADOS en JPEG
        ↓
Hero tablet object-contain — muestra fielmente el JPEG mutilado
        ↓
Director ve «recorte» → parches CSS v15–v22 → layout peor, mismo JPEG
        ↓
Fix: resize_contain desde origen local + upload sm/md/lg/flat
        ↓
Hero v9-bare-img + Ctrl+Shift+R → zapato completo ✅
```

---

## Solución aplicada

### Paso 1 — Regenerar Storage desde origen local

Script: `scripts/regenerar_storage_2083_1133.py`

```bash
cd tablet-bazzar
python scripts/regenerar_storage_2083_1133.py
```

Lógica (igual que caso fundador 4215.1034):

```python
img.thumbnail((size, size), Image.Resampling.LANCZOS)
canvas = Image.new("RGB", (size, size), (255, 255, 255))
canvas.paste(img, ((size - img.width) // 2, (size - img.height) // 2))
```

Sube con `x-upsert: true` a Supabase: `sm/`, `md/`, `lg/` y flat en raíz `productos/`.

### Paso 2 — Frontend mínimo (evidencia PASS)

- `HeroProductImage`: img directo `sm/`, marco cuadrado, `object-contain`.
- Sin más experimentos CSS en el hero salvo reservar espacio para dock POS (`pb-[7.5rem]` en capa hero).

### Paso 3 — QA piso

1. `Ctrl+Shift+R` en `http://localhost:3002/cadena/vista?marca=MOLEKINHA&cliente_id=2900`
2. Ir a **2083.1133** — tacón y punta visibles en hero y thumb.
3. DevTools: `data-hero-frame="v9-bare-img"`, URL contiene `/sm/2083-1133-13488-16072.jpg`.

### Paso 4 — Lote marca (ops)

MOLEKINHA tiene cientos de SKUs con el mismo gap legacy:

```bash
cd control_central
python tools/protocolo_imagenes_cerrar_gap.py --cerrar --marca MOLEKINHA
```

Prioridad origen en script: **local `imagenes/`** > flat Storage (nunca re-escalar un tier ya recortado).

---

## Lecciones (no repetir)

1. **Auditar JPEG antes de tocar CSS** — `scripts/auditar_hero_2083_1133.ts` + medición bbox Python/Pillow.
2. **No confundir bytes distintos con contain** — sm 4693 B vs 4047 B tras fix; el recorte era contenido, no solo tamaño.
3. **flat Storage puede mentir** — para 1133 el flat era copia 200×200 del sm recortado, no el 800×545 original.
4. **Los parches CSS multiplicaron regresiones** — el Director tenía razón: v15–v22 empeoraron layout sin cambiar el JPEG.

---

## Evidencia

| Archivo | Contenido |
|---------|-----------|
| `docs/evidencia/HERO_REGEN_2083_1133.json` | Antes/después Storage + frontend |
| `docs/evidencia/HERO_AUDIT_2083_1133.json` | Auditoría tiers HEAD + diagnóstico |
| `docs/evidencia/regen_2083_1133/sm/` | JPEG regenerado local (referencia visual) |
| `docs/evidencia/HERO_FIX_EVIDENCIA.json` | Caso fundador 4215.1034 (mismo patrón) |
| `scripts/regenerar_storage_2083_1133.py` | Hotfix unitario reutilizable |

---

## Checklist agente (cierre ticket hero recortado)

- [ ] ¿Origen horizontal existe en `imagenes/` o flat 800×545?
- [ ] ¿Tier usado por app (sm/) tiene zapato completo **en el archivo**?
- [ ] ¿Regeneración con `resize_contain`, no crop?
- [ ] ¿Hero = v9-bare-img + sm/ + object-contain?
- [ ] ¿Director validó con Ctrl+Shift+R en tablet real?

---

**Registrado:** Cursor · Director Héctor · cierre hero MOLEKINHA 2083.1133
