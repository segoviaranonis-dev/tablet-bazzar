# OT-RIMEC-WEB-ETA-TAMANO-003 — Aumentar tamaño del chip ETA

**Prioridad:** Media (UX)  
**Director:** Héctor Segovia  
**Ejecutor:** **Gemini**  
**Repo:** `C:\Users\hecto\Nexus_Core\rimec-web`  
**Estado:** PENDIENTE EJECUCIÓN  
**Relacionada:** `OT-RIMEC-WEB-ETA-POSICION-002` (ubicación del chip)

---

## Contexto

En la tarjeta del catálogo, el chip de fecha ETA (`🚢 15-06`) se ve **demasiado chico** respecto a la fila Marca · Línea · Referencia. El Director marcó en captura el chip a la derecha de `VIZZANO · 1185 · 1158` y pidió **aumentar su tamaño** para que sea legible de un vistazo en móvil.

Hoy el chip usa clases del estilo:

```tsx
className="text-[10px] font-extrabold whitespace-nowrap px-2 py-0.5 rounded-md shrink-0"
```

Eso es más chico que los códigos de línea/referencia (`text-[11px]`) y casi igual al pill de marca (`text-[9px]`). **El ETA debe ser el elemento más visible de esa fila** (es la fecha de arribo).

---

## Pre-requisito de ubicación

Si **aún no** aplicaste `OT-RIMEC-WEB-ETA-POSICION-002`:

1. Primero mové el ETA del overlay de la foto → fila derecha de Marca · Línea · Referencia (ver OT-002).
2. Luego aplicá los cambios de tamaño de esta OT.

Si OT-002 ya está hecha, solo escalá el chip en la nueva ubicación.

---

## Cambios pedidos

### 1. Constante / componente reutilizable (recomendado)

En `rimec-web/app/CatalogoGrid.tsx`, crear un mini-componente local (mismo archivo, arriba de `Lightbox`):

```tsx
function ChipEta({
  label,
  shell,
  className = '',
}: {
  label: string
  shell: TarjetaCatalogo['shell']
  className?: string
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1',
        'text-sm font-extrabold leading-none whitespace-nowrap',
        'px-3 py-1.5 rounded-lg shrink-0',
        'shadow-sm',
        className,
      ].join(' ')}
      style={{
        color: shell.accentColor,
        backgroundColor: shell.shellBackground,
        border: shell.shellBorder,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
      title={`ETA ${label}`}
    >
      {label}
    </span>
  )
}
```

**Objetivo visual:** texto ~**14px** (`text-sm`), padding generoso, borde del shell, sombra suave. Debe leerse claramente al lado de marca/línea/ref.

### 2. Tarjeta del catálogo (`TarjetaProducto`)

- Reemplazar el `<span>` del ETA en la **fila 3** (Marca · Línea · Referencia) por `<ChipEta label={p.origen_label} shell={shell} />`.
- Mantener `justify-between` en el contenedor de la fila para que el chip quede pegado a la **derecha**.
- **Quitar** el ETA del overlay sobre la imagen si todavía está ahí (solo debe quedar la pill `TRÁNSITO` arriba-izquierda).

### 3. Lightbox

- Misma regla: ETA **no** en overlay de la foto.
- En el bloque inferior (fila marca/códigos), usar `<ChipEta />` con las **mismas** clases/tamaño que la tarjeta.
- Si el lightbox aún muestra ETA junto a `TRÁNSITO` en `absolute top-3 left-3`, **eliminarlo** de ahí y ponerlo en la fila inferior.

### 4. Tamaños mínimos aceptables (Director)

| Propiedad | Antes (aprox.) | Después (obligatorio) |
|-----------|----------------|------------------------|
| Font size | `10px` | `14px` (`text-sm`) |
| Padding | `px-2 py-0.5` | `px-3 py-1.5` |
| Border radius | `rounded-md` | `rounded-lg` |
| Peso | `font-extrabold` | mantener |
| Contraste | shell | mantener `shell.accentColor` + fondo shell |

**No** bajar de `text-[13px]`. Si en cards muy angostas el chip comprime la fila, la marca/línea pueden truncar (`truncate`); el ETA **no** se trunca (`whitespace-nowrap`).

### 5. Responsive

- En viewport &lt; 360px: permitir `text-[13px] px-2.5 py-1` como mínimo (nunca volver a `10px`).
- Probar en DevTools iPhone SE y en desktop 3 columnas.

---

## Fuera de alcance

- `lib/catalogoOrigen.ts` — formato `🚢 15-06` ya está OK.
- Paletas / shells por quincena — no cambiar.
- Pill `TRÁNSITO`, badge `N col.`, precio, grada, selector de cajas.
- `agruparTarjetasCatalogo.ts`.

---

## Verificación visual

1. `cd C:\Users\hecto\Nexus_Core\rimec-web && npm run dev`
2. Abrir **http://localhost:3001**
3. Tarjeta con ETA (ej. `🚢 15-06`):
   - Chip **claramente más grande** que línea/ref de la misma fila.
   - Legible sin zoom en móvil.
   - Alineado a la derecha de `MARCA · línea · ref`.
4. Lightbox: mismo tamaño y posición.
5. Dos ETAs distintas (multi-origen): cada tarjeta conserva su chip grande con paleta distinta.

**Criterio de aceptación:** el Director debe poder leer la fecha ETA sin esfuerzo; comparar con captura anterior — el chip debe ocupar ~1.4×–1.6× el área visual anterior.

---

## Entregables

| Archivo | Acción |
|---------|--------|
| `rimec-web/app/CatalogoGrid.tsx` | `ChipEta` + aplicar en tarjeta y lightbox |
| `ot/RESPUESTA_EJECUTOR.md` o `ot/RESPUESTA_ANTIGRAVITY.md` | Bitácora + screenshot antes/después |

**No** crear archivos nuevos salvo el componente inline en `CatalogoGrid.tsx`.  
**No** commitear sin auditoría de Cursor.

---

## Copiar a Gemini

```
OT-RIMEC-WEB-ETA-TAMANO-003 — Aumentar tamaño chip ETA

Repo: C:\Users\hecto\Nexus_Core\rimec-web
Archivo: app/CatalogoGrid.tsx

El chip 🚢 15-06 está muy chico (text-[10px]). Subir a text-sm (14px),
px-3 py-1.5, rounded-lg, sombra suave. Debe ser el elemento más legible
de la fila Marca · Línea · Referencia (derecha).

Si OT-002 no está aplicada: primero mover ETA fuera del overlay de la foto
(ver ot/en_curso/OT-RIMEC-WEB-ETA-POSICION-002.md), luego agrandar.

Crear ChipEta() reutilizable para tarjeta + lightbox.
Instrucciones completas: ot/en_curso/OT-RIMEC-WEB-ETA-TAMANO-003.md

Screenshot cuando esté listo para auditoría Cursor.
```
