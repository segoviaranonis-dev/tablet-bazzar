# OT-RIMEC-WEB-ETA-POSICION-002 — Reubicar fecha ETA en la tarjeta del catálogo

**Prioridad:** Media (UX)
**Director:** Héctor Segovia
**Ejecutor:** **Gemini** (Antigravity / `report` no aplica; este archivo vive en `rimec-web`)
**Repo:** `C:\Users\hecto\Nexus_Core\rimec-web`
**Estado:** PENDIENTE EJECUCIÓN

---

## Contexto

Después de OT-RIMEC-WEB-TARJETAS-MULTI-ORIGEN-001, la tarjeta tiene dos badges en la **esquina superior izquierda** sobre la foto:

1. Pill **`TRÁNSITO`** (color del shell del origen)
2. Chip **`🚢 15-06`** (fecha ETA)

El Director pidió mover **solo la fecha ETA** a otra ubicación dentro de la tarjeta. La pill `TRÁNSITO` se queda donde está.

Referencia visual del Director (anotación roja en captura):
- Mover ETA desde **arriba a la izquierda sobre la foto** → al **bloque inferior, a la derecha de la fila Marca · Línea · Referencia** (mismo nivel que `ACTVITTA 4202 · 565`).

---

## Cambios pedidos

### 1. Sacar el chip ETA del overlay sobre la imagen

Archivo: `rimec-web/app/CatalogoGrid.tsx`

**Quitar** el segundo `<span>` del overlay superior-izquierdo (líneas ~360–368). Tiene que quedar **solo** la pill `TRÁNSITO` arriba a la izquierda:

```tsx
<div className="absolute top-2.5 left-2.5 flex items-center gap-2">
  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm"
        style={{ backgroundColor: shell.badgeBackground, color: shell.badgeColor }}>
    {origenBadgeText(p.origen_tipo)}
  </span>
  {/* ← Eliminar el <span> con p.origen_label de aquí */}
</div>
```

> Hacer lo mismo en el **Lightbox** (función `Lightbox` ~líneas 187–195, mismo bloque): el overlay sobre la imagen ampliada también debe quedar solo con la pill `TRÁNSITO`.

### 2. Insertar la fecha ETA a la derecha del bloque marca/línea/referencia

En la **Fila 3** del cuerpo de la tarjeta (~líneas 383–393), agregar la fecha ETA alineada a la **derecha** de la misma fila. El `div` actual tiene `flex items-center gap-1.5`; sumarle `justify-between` para empujar el chip de ETA al borde derecho.

Estructura final esperada:

```tsx
<div className="flex items-center justify-between gap-2 mb-1">
  <div className="flex items-center gap-1.5 min-w-0">
    <span className="text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0"
          style={estiloBadgeMarca(p.descp_marca)}>
      {p.descp_marca}
    </span>
    <div className="flex items-center gap-1 text-[11px] font-extrabold truncate">
      <span style={{ color: AZUL }}>{p.linea_codigo}</span>
      <span className="text-slate-300">·</span>
      <span style={{ color: shell.accentColor }}>{p.referencia_codigo}</span>
    </div>
  </div>

  {/* ETA — nueva ubicación pedida por el Director */}
  <span
    className="text-[10px] font-extrabold whitespace-nowrap px-2 py-0.5 rounded-md shrink-0"
    style={{
      color: shell.accentColor,
      backgroundColor: shell.shellBackground,
      border: shell.shellBorder,
    }}
    title={`ETA ${p.origen_label}`}
  >
    {p.origen_label}
  </span>
</div>
```

Notas:
- `p.origen_label` ya viene formateado como `🚢 15-06` desde `lib/catalogoOrigen.ts` (no hace falta volver a formatear).
- Si `origen_tipo === 'STOCK_LOCAL'` o `'DEPOSITO_X'`, `origen_label` muestra `Stock · …` o `Depósito …` y la lógica funciona igual (no rompe la coexistencia multi-origen).
- Mantener `whitespace-nowrap` para que `15-06` no se corte en cards angostas.
- Mantener la paleta del **shell** (la celeste/naranja/violeta/verde por hash de ETA queda coherente con el resto de la tarjeta).

### 3. Eliminar comentario duplicado

En la línea ~380–382 hay `{/* Fila 3: Marca y Códigos */}` repetido dos veces. Dejar una sola línea de comentario.

---

## Fuera de alcance (no tocar)

- `lib/catalogoOrigen.ts` (paleta, badge text, label) — la lógica de origen ya está OK.
- `lib/agruparTarjetasCatalogo.ts` — agrupación multi-origen permanece.
- La pill `TRÁNSITO` arriba a la izquierda **se mantiene**.
- El chip “`N col.`” arriba a la derecha **se mantiene**.
- Estilo del shell (fondo/borde/sombra) **no cambia**.

---

## Verificación visual (Director)

1. `cd C:\Users\hecto\Nexus_Core\rimec-web && npm run dev`
2. Abrir **http://localhost:3001**
3. Buscar una tarjeta con ETA (ej. `15-06`, `15-08`).
4. Resultado esperado:
   - Arriba-izquierda sobre la foto: solo pill `TRÁNSITO`.
   - Debajo del bloque foto, fila marca/códigos: `ACTVITTA  4202 · 565` a la izquierda, y `🚢 15-06` empujado al borde derecho.
   - Mismo SKU con dos ETAs distintas (multi-origen) → cada tarjeta muestra su propia fecha en la nueva posición; el shell sigue cambiando de paleta por hash de ETA.
5. Probar lightbox al hacer click sobre la imagen: misma regla (sin ETA en overlay superior).

---

## Entregables

| Archivo | Acción |
|---------|--------|
| `rimec-web/app/CatalogoGrid.tsx` | Editar `TarjetaProducto` y `Lightbox` según las 3 secciones arriba |
| `ot/RESPUESTA_ANTIGRAVITY.md` o `ot/RESPUESTA_EJECUTOR.md` | Bitácora corta de Gemini: archivos tocados, screenshots opcionales |

**No** crear archivos nuevos. **No** commitear sin que Cursor audite.

---

## Copiar a Gemini

```
OT-RIMEC-WEB-ETA-POSICION-002 — UX tarjeta catálogo

Repo: C:\Users\hecto\Nexus_Core\rimec-web
Archivo: app/CatalogoGrid.tsx

Tarea: mover el chip de fecha ETA (🚢 15-06) desde el overlay superior-izquierdo
de la imagen al bloque inferior, a la derecha de la fila "Marca · Línea · Referencia".

Pasos exactos en ot/en_curso/OT-RIMEC-WEB-ETA-POSICION-002.md
(secciones 1, 2 y 3).

Aplicar lo mismo dentro del componente Lightbox.

No tocar lib/catalogoOrigen.ts ni agruparTarjetasCatalogo.ts ni la paleta del shell.
Avisame con screenshot cuando esté listo para que Cursor audite.
```
