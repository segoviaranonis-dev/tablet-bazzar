# Imágenes de producto

Misma convención que RIMEC Web y Report.

## URL pública

`lib/storage-url.ts` → `publicStorageObjectUrl("productos", path)`

Base: `NEXT_PUBLIC_SUPABASE_URL` + `/storage/v1/object/public/productos/`

## Convención de nombre

Stem **L-R-M-C** (códigos proveedor enteros):

```
1184-100-9569-15745.jpg
```

Fallback sin material/color: `1184-100.jpg`

Excel legacy: columna `imagen_nombre` en fila depósito.

## Miniaturas (velocidad)

`lib/product-image.ts` → `toThumbnailStorageUrl`:

```
/productos/1184-100.jpg  →  /productos/thumbs/1184-100.jpg
```

`ProductImage` intenta thumb primero; en error prueba candidatos siguientes; al agotar muestra 👟.

## Prefetch

`lib/prefetch-images.ts` — precarga en `<link>` implícito vía `new Image()`:

- Par activo
- Vecinos ±1, ±2, ±3 en cadena
- Hasta 4 colores por grupo material del par actual

Invocado desde `app/cadena/vista/page.tsx` en `useEffect`.

---

**Última actualización:** 2026-06-10
