# LEY DE INTEGRIDAD VISUAL — Imagen dentro del marco

> **⚠️ 2026-07-10 — ENTRADA ÚNICA:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`)  
> Este archivo queda como **anexo** (narrativa marco / infección). Ante conflicto, manda la Ley Universal.

**Palabras clave:** `Integridad visual` · `Contención imagen` · `Protocolo Imágenes` · `problemas de imagen` · `imagen` · `desbordamiento de imagen` · `las imagenes no se ven bien`  
**Solución integral RIMEC Web:** [PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md](../../2.2_rimec_web/PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md)  
**Registro errores:** [INDICE_ERRORES.md](../../../5_errores/INDICE_ERRORES.md) · detalle `5_errores/detalle/`  
**Relacionado:** [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md) · [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](./NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md)  
**Director:** Héctor Segovia · 2026-06-15

---

## Qué problema describe (nombre técnico)

| En español (para vos) | En ingeniería |
|----------------------|---------------|
| **La foto se sale del cuadro** | **Desbordamiento** (`overflow`) |
| **La foto tiene que quedar entera dentro del marco** | **Contención** + `object-fit: contain` |
| **El marco es sagrado** | **Contenedor con tamaño fijo** (`aspect-ratio`, `max-width/height`) |
| **Tratar la foto con rigor de dato contable** | **Integridad visual** — misma disciplina que FK/costo en BD |

No es un tema de sm/lg (eso está bien). Es: **en cualquier tamaño, la imagen nunca puede invadir fuera de su celda**.

---

## Ley (inquebrantable)

> Toda imagen de producto se muestra **completa y contenida** dentro de un **marco definido**.  
> Prohibido que punta, tacón o bordes del JPEG **sobrepasen** el contenedor en listado, hero, miniatura, PDF o modal.

Rigor equivalente a un dato fiscal: si el marco dice 200×200, el zapato **vive adentro** — no negociable.

---

## Dos capas (ambas deben PASS)

### Capa 1 — Archivo en Storage (origen)

- Tiers `sm` / `md` / `lg` generados con **fit contain** + padding blanco.
- Si el JPEG ya viene recortado (crop), **ningún CSS arregla** el desborde/recorte.
- Auditoría: márgenes laterales en foto horizontal → ver `PUNTO_CRITICO_RECORTE_CALZADO.md`.

### Capa 2 — Pantalla (marco UI)

Todo componente que muestre foto debe cumplir:

```
MARCO (contenedor)  →  tamaño fijo o ratio fijo, overflow oculto
IMG dentro del marco  →  escala proporcional, entera, centrada (contain)
```

**Prohibido en calzado:**

- `object-cover` que recorta punta/tacón para “llenar” el cuadro
- `<img>` con `h-full w-full` sin marco que contenga
- Padding en la img sin `box-border` (desborda el marco)
- Escalar `sm` a tamaño hero gigante (pixelado + sensación de “desborde”)

**Tablet referencia PASS:** `HeroProductImage` · marco `data-hero-frame` · img directo con contain.

---

---

## Síndrome documentado — «Infección del marco»

**Nombre canónico:** **Desbordamiento de miniatura en grilla**  
**Código auditoría:** `IMG-FAIL-OVERFLOW-THUMB`  
**Alias Director:** *la infección* · *la foto se sale de la cajita* · *marco violado*

### Qué se ve (tus capturas)

En la **misma tabla**, filas vecinas:

| Estado | Miniatura |
|--------|-----------|
| **PASS** | Zapato chico, **margen blanco** alrededor, bordes redondeados respetados |
| **FAIL** | Zapato **a tamaño real del cuadro**, pegado al borde, **punta o suela cortada** |

No es que falte sm/lg. Es que **algunas celdas no contienen** la imagen y otras sí — la infección **salta fila a fila** en la misma pantalla.

### Causa (capas)

1. **UI:** `<img>` sin `object-fit: contain` + marco sin `overflow: hidden` — la foto escala mal y **desborda**.
2. **Storage:** tier `sm/` generado con **crop** en ese SKU — el JPEG ya viene mutilado (ver recorte calzado).
3. **Componente:** no hay **un solo** `ProductImage` en la grilla — cada fila puede renderizar distinto.

### Criterio PASS / FAIL (auditoría visual)

- **PASS:** zapato **entero** visible; **aire blanco** entre zapato y borde del marco; ningún píxel “choca” el borde redondeado.
- **FAIL:** tacón/punta/suela **cortados** o imagen **sin margen** pegada al borde = `IMG-FAIL-OVERFLOW-THUMB`.

### Orden al dev (copiar)

> “Grilla con infección de marco: unificar miniatura con **contain** obligatorio. Mismo componente todas las filas. Si FAIL persiste en un SKU, auditar `sm/` en Storage. Código: `IMG-FAIL-OVERFLOW-THUMB`.”

---

| Lo que ven | Causa probable |
|------------|----------------|
| Foto “más grande que la cajita” | CSS: falta contain / overflow en marco |
| Punta o tacón cortados | Storage: tier con crop, o CSS cover |
| Miniatura se sale en factura/PDF | PDF: imagen sin límite max-width/height |
| Se ve bien en un módulo, mal en otro | **No hay componente único** — cada pantalla inventa CSS |

---

## Solución holding (obra maestra visual)

1. **Un solo componente** por app (ej. `ProductImage`) — nadie pone `<img>` suelto en catálogo.
2. **Variantes:** `thumb` | `card` | `hero` | `modal` — todas con **contención**.
3. **Ampliar (lg):** modal nuevo marco; la foto **también** contain dentro del modal.
4. **Checklist antes de merge:** screenshot PASS — zapato entero, ningún píxel fuera del borde del marco.
5. **Auditoría Storage** en SKUs problemáticos antes de culpar al frontend.

---

## Cómo pedírselo a un dev (copiar)

> “Integridad visual: imagen siempre **contenida** en el marco. `object-fit: contain`, overflow hidden en contenedor. Misma molécula L-R-M-C. Si sobrepasa, FAIL. Ver `LEY_INTEGRIDAD_VISUAL_IMAGEN.md`.”

---

## Apps a revisar (desborde reportado)

| App | Prioridad visual |
|-----|------------------|
| Tablet Bazzar | Alta — parcialmente corregido (hero) |
| RIMEC Web catálogo | Alta — unificar componente |
| Bazzar Web | Alta — MVP publicación |
| Report / ventas-fotos | Media — PDF + grillas |
| Streamlit FI / aprobaciones | Media — tarjetas FI |

---

**Shibboleth:** 7 años · Producto = 90 % visual — la foto es dato de primera clase.
