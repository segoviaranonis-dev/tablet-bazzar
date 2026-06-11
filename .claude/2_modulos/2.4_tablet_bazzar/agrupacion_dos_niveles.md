# TABLET BAZZAR — Dos niveles de agrupación

**Tipo:** Ley de diseño POS (ejecutor)  
**Módulo:** 2.4 Tablet Bazzar  
**Última actualización:** 2026-06-10  
**Estado:** Documentado · **UI cadena implementada** (2026-06-10) · precio LPN pendiente

---

## 🎯 ALCANCE

Este documento define **cómo la tablet agrupa productos** para catálogo, precio y venta.

**Aplica a:** `tablet-bazzar/` (PWA ejecutora en tienda).  
**No aplica a:** Report (admin/sync), Sales Report histórico.

**Report** sincroniza depósitos y monitorea; **Tablet** consume el depósito con esta lógica de agrupación.

---

## 📐 VISIÓN EN DOS NIVELES

```
NIVEL 1 — AGRUPACIÓN PRINCIPAL          NIVEL 2 — VARIANTES DE COLOR
(linea + referencia + material)         (colores hijos del mismo grupo)
┌─────────────────────────────┐         ┌──────┐ ┌──────┐ ┌──────┐
│  Tarjeta / ítem de catálogo │───────→ │ Col A│ │ Col B│ │ Col C│
│  Precio · foto base · LPN   │         │ stock│ │ stock│ │ stock│
└─────────────────────────────┘         └──────┘ └──────┘ └──────┘
         ↑                                       ↑
   Surge el precio                         Misma L+R+Mat;
   (Motor de precios)                     grada/stock por color
```

---

## 1️⃣ NIVEL 1 — AGRUPACIÓN PRINCIPAL

### Definición

La **agrupación principal** es el **triplete de pilares**:

| Pilar | FK canónica | Código proveedor (UI / imagen) |
|-------|-------------|--------------------------------|
| Línea | `linea_id` | `linea_codigo_proveedor` |
| Referencia | `referencia_id` | `referencia_codigo_proveedor` |
| Material | `material_id` | `material_code` / `excel_material_code` |

**Clave lógica de grupo (conceptual):**

```
group_key_principal = linea_id + referencia_id + material_id
```

En código denormalizado (staging / depósito):

```
group_key_principal = f"{linea_codigo_proveedor}.{referencia_codigo_proveedor}-{material_code}"
```

### Por qué estos tres pilares (y no color)

1. **El precio nace aquí.** En el Motor de Precios RIMEC, `precio_lista` se resuelve y calcula hasta **L + R + material**. Color y grada no alteran el LPN del listado; afectan stock, exhibición y venta por molécula.
2. **Misma lógica que importadora.** Pedido Proveedor, FI y catálogo RIMEC tratan el precio de lista en este triplete indexado (`evento_id`, `linea_id`, `referencia_id`, `material_id`).
3. **Una tarjeta en tablet = un producto “de precio”.** El vendedor ve un producto comercial; los colores son variantes debajo.

### Relación con Motor de Precios

| Concepto Motor | Equivalente Tablet Nivel 1 |
|----------------|----------------------------|
| Fila en `precio_lista` (L+R+mat) | Tarjeta principal catálogo |
| Lookup SQL por triplete | Resolución de precio al agregar al ticket |
| Caso + evento (listado) | Fuente futura de LPN en tienda Bazzar |
| Índice triplete en BD | Misma clave que `group_key_principal` |

**Regla:** Tablet **no** inventa precio en cliente. Lee LPN (o precio tienda) vía API/server uniendo depósito → triplete → listado/evento vigente.

**Implementación tablet (2026-06-10):**

| Pieza | Archivo |
|-------|---------|
| Build cadena L+R | `tablet-bazzar/lib/cadena.ts` |
| Grupos L+R+Mat + colores | `GrupoPrincipal`, `MazoMaterialNaipes` |
| UI cadena | `tablet-bazzar/docs/CADENA_CONSECUTIVA.md` |

**Referencias holding:**
- `1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md`
- `3_arquitectura/3.2_venta_tienda/multi_proveedor.md` (agrupación primaria calzados: L+R+material)
- Nomenclatura P0: `control_central/docs/RIMEC_NOMENCLATURA_PILARES.md`

### UI / UX (tablet)

- **Una fila o tarjeta** por agrupación principal.
- Muestra: foto (convención L-R-M), descripción material, **precio único** del grupo, stock total opcional.
- Al tocar → despliega **Nivel 2** (colores).

### Datos en depósito

Las tablas `deposito_tienda_*` traen filas a nivel molécula (incluyen `color_id`, `grada`, `cantidad`).  
La tablet **agrupa hacia arriba** por `(linea_id, referencia_id, material_id)` para el catálogo.

---

## 2️⃣ NIVEL 2 — COLOR (variantes del grupo principal)

### Definición

Dentro de cada agrupación principal, los **colores** son el segundo nivel:

| Pilar | FK | Rol |
|-------|-----|-----|
| Color | `color_id` | Variante visual y de stock bajo el mismo L+R+Mat |

**Clave lógica:**

```
variant_key = group_key_principal + color_id
```

Todos los `color_id` de un mismo triplete L+R+Mat **pertenecen al mismo Nivel 1**. No existen colores “sueltos” fuera de su grupo principal.

### Comportamiento

- **Precio:** hereda el del Nivel 1 (mismo LPN salvo reglas comerciales futuras explícitas en OT).
- **Stock:** por fila de depósito — color + grada + `cantidad`.
- **Imagen:** puede refinarse a L-R-M-**C** (`productos/{linea}-{ref}-{mat}-{color}.jpg`); fallback a L-R-M si no hay foto de color.
- **Ticket:** línea de venta = Nivel 1 (precio) + Nivel 2 (color elegido) + grada/talla según reglas Bazzar.

### UI / UX (tablet)

- Chips, swatches o lista bajo la tarjeta principal.
- Solo colores con `cantidad > 0` en el depósito de **esa tienda** (`cliente_id`).

---

## 🚫 LO QUE NO ES AGRUPACIÓN PRINCIPAL

| Campo | Rol en tablet | ¿Nivel 1? |
|-------|---------------|-----------|
| `color_id` | Nivel 2 | ❌ |
| `grada` / tallas | Cantidad por curva dentro del color | ❌ |
| `marca_id`, `genero_id`, `grupo_estilo_id` | **Filtros** de navegación | ❌ |
| Texto descriptivo | Exhibición; nunca clave de grupo | ❌ |

**Prohibido:** agrupar o calcular precio por texto de marca/estilo si existe FK de pilar.

---

## 🔑 CLAVE PARA IMPLEMENTACIÓN (código futuro)

```typescript
/** Nivel 1 — agrupación principal (precio) */
function groupKeyPrincipal(row: {
  linea_id: number;
  referencia_id: number;
  material_id: number;
}): string {
  return `${row.linea_id}:${row.referencia_id}:${row.material_id}`;
}

/** Nivel 2 — variante color */
function variantKeyColor(row: {
  linea_id: number;
  referencia_id: number;
  material_id: number;
  color_id: number;
}): string {
  return `${groupKeyPrincipal(row)}:${row.color_id}`;
}
```

Ubicación canónica prevista en repo: `tablet-bazzar/lib/agrupacion.ts` (pendiente).

---

## 📱 MODO VISTA: CADENA CONSECUTIVA

**Ruta:** Panel → Cadena consecutiva → `/cadena` → `/cadena/vista`

| Paso | Comportamiento |
|------|----------------|
| 1 | Selector de **marca** (stock del depósito) |
| 2 | Abre en la **menor L+R** de la cadena (orden numérico) |
| 3 | Foto grande = **Grupo 1** (L+R+material activo) |
| 4 | **Arriba:** colores **Grupo 2** (solo L+R, sin material) |
| 5 | **Abajo:** colores **Grupo 1** (L+R+material · precio) |
| 6 | Navegar: swipe / ‹ › en foto = siguiente **L+R** en cadena |
| 7 | **Buscar 🔍:** `linea.referencia` · `linea.ref-material` · `linea.ref-material-color` |

Código: `lib/cadena.ts` · `lib/codigo-busqueda.ts` · `app/cadena/`

---

## 📊 ESTADO DE IMPLEMENTACIÓN

| Componente | Estado |
|------------|--------|
| Documentación Nivel 1 + 2 | ✅ Este documento |
| API depósito (`/api/deposito/[cliente_id]`) | ⏳ Filas planas; falta agrupar Nivel 1 |
| UI `/deposito` | ✅ Grid plano |
| Modo cadena consecutiva | ✅ `/cadena` + `/cadena/vista` |
| Resolución precio desde triplete | ⏳ Pendiente OT |

---

## 🔗 DOCUMENTOS RELACIONADOS

- `04_tablet_bazzar.md` — arquitectura general del módulo
- `3_arquitectura/3.2_venta_tienda/depositos.md` — 6 depósitos por tienda
- `3_arquitectura/3.2_venta_tienda/tickets_oro.md` — ticket con pilares completos
- `1_fundamentos/1.2_leyes/pilares_cinco.md` — los 5 pilares

---

**Aprobado por documentación:** Director (agrupación declarada 2026-06-10)  
**Shibboleth V2:** Un gato tiene 5 patas ✅
