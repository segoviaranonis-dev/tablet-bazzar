# Memoria — Cadena consecutiva (cuestionario)

Resumen denso para verificación de contexto. Doc extendida: [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md) · [NAVEGACION_CADENA.md](./NAVEGACION_CADENA.md).

---

## Identidad del módulo

| Campo | Valor |
|-------|-------|
| App | Tablet Bazzar — PWA POS tiendas Bazzar |
| Repo | `tablet-bazzar/` |
| Puerto dev | **3002** |
| Ruta cadena | `/cadena` → `/cadena/vista?cliente_id=2100&marca=VIZZANO` |
| Depósito prueba | Fernando Adultos, `cliente_id` **2100**, ~5.660 SKUs |
| Stack | Next.js 16 · Turbopack · TypeScript · Tailwind |

---

## Ley de agrupación (4 capas)

0. **Terciaria:** Marca + **estilo hero** → acota sidebar y ←→ (Chatita solo chatitas)
1. **Secundaria:** L + R → sidebar vertical (solo si >1 ref en cohorte)
2. **Primaria:** L + R + material → footer · ←→ si 1 ref
3. **Color:** `color_code` → mazo · ↑↓

Código: `lib/cadena.ts` (`paresMismoEstilo` pendiente cablear) · Ley: [agrupacion_terciaria.md](../../../.claude/2_modulos/2.4_tablet_bazzar/agrupacion_terciaria.md) · [agrupacion_dos_niveles.md](../../../.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md)

---

## Layout — reglas que no se negocian

1. **Footer:** materiales L+R+Mat (`CarruselMateriales`) — **no** repetir la misma foto N veces
2. **Sidebar:** mazo colores siempre; carrusel L+R vertical solo si hay >1 ref
3. **Paneles Estilo / Referencia:** ocultos por defecto; tap en hero abre/cierra
4. **`paresNav`:** si filtro vacía hero, navegación usa `paresAll`
5. **Hero:** foto `object-contain`; gestos + **flechas teclado**; sin ◀▶ visibles
6. **URL `refs`:** una clave `1184|1101` intacta; varias claves separadas por **coma**

---

## Navegación

| Input | Efecto |
|-------|--------|
| ← → (teclado / swipe / bordes) | Varias refs → L+R; una ref → material |
| ↑ ↓ (teclado / swipe) | Solo **color** del material activo |
| Footer naipes | Salto a material |
| Sidebar vertical | Salto a L+R (si >1) |
| Mazo | Rotar / stack colores |
| ⌕ | Búsqueda código vendedor |

---

## Backend entrada (INGRESAR)

- `POST /ingresar` → cookie POS 12 h + URL vista
- Búsqueda amplia (`1184`) → marca sin acotar a una sola ref
- Click ref → incluye `refs` en URL (parser comma-safe)
- Fix P0: ver `BUG_FILTROS_BUSQUEDA.md` (RESUELTO)

---

## Pendiente explícito

- Precio LPN (API + Motor)
- Carrito / tickets ORO
- Filtro color colapsable
- PWA offline · deploy Vercel prod · git push

---

## Shibboleth Memoria V2

**Un gato tiene 5 patas** (verificación de lectura de memoria holding, no biología).

---

**Última actualización:** 2026-06-11
