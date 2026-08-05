# TABLET BAZZAR — Agrupación terciaria (Marca → Estilo)

**Tipo:** Ley de diseño POS (ejecutor)  
**Módulo:** 2.4 Tablet Bazzar  
**Fecha:** 2026-06-22  
**Estado:** Documentado · **implementado** en `/cadena/vista` (2026-06-22)  
**Decisión Director:** Si el vendedor mira una *chatita*, el costado solo muestra *chatitas* de esa marca — nunca mezclar *tenis*, *mocasines*, etc.

**Jerarquía completa:**

```
TERCIARIA   Marca → Estilo          (cohorte de navegación)
  └─ SECUNDARIA   L + R             (cadena lateral · ←→ si >1 ref)
       └─ PRIMARIA   L + R + material   (precio · footer · ←→ si 1 ref)
            └─ COLOR   color_id         (variante · ↑↓)
```

**Documentos base:** [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md) · [NAVEGACION_CADENA.md](../../../tablet-bazzar/docs/NAVEGACION_CADENA.md)

---

## 🎯 ALCANCE

Define la **cohorte terciaria** que acota qué pares L+R pueden aparecer en la cadena del costado y en los gestos **← →** cuando hay varias referencias.

**Aplica a:** `/cadena/vista` (`tablet-bazzar/`).  
**No aplica a:** precio (sigue en primaria L+R+Mat), Report, Sales Report.

---

## 📐 VISIÓN EN CUATRO CAPAS

```
MARCA (sesión vista)     ESTILO (hero activo)     SECUNDARIA L+R        PRIMARIA L+R+Mat
     ACTVITTA        →        Chatita         →   4202·500, 4202·501…  →  mat 100, 500…
                                                      ↑ costado              ↑ footer
                                                 solo chatitas          colores ↑↓
```

**Ejemplo Director:** Hero = sandalia estilo **Chatita** (marca ACTVITTA).  
Sidebar vertical y flechas ←→ **solo** recorren otros pares L+R con `estilo = "Chatita"` y `marca = ACTVITTA`.  
Un **Tenis** de la misma marca **no** entra en esa cadena aunque tenga stock.

---

## 0️⃣ TERCIARIA — MARCA → ESTILO

### Definición

| Dimensión | Campo depósito | Rol |
|-----------|----------------|-----|
| Marca | `marca` / `marca_id` | Universo de la vista (`?marca=`). Ya fijado al ingresar cadena. |
| Estilo | `estilo` | **Cohorte activa** — ancla de navegación lateral. |

**Clave lógica:**

```
cohorte_terciaria = normalize(marca) + "|" + normalize(estilo_hero)
```

`estilo_hero` = `estilo` del par L+R (y fila activa) mostrado en el hero.  
Si el vendedor salta a otro par L+R **dentro** de la cohorte, el estilo se mantiene (misma cohorte).  
Si el vendedor elige un producto de **otro estilo** (búsqueda, tap panel estilo, salto directo), la cohorte **se re-ancla** al nuevo `estilo`.

### Qué controla (UI `/cadena/vista`)

| Control | ¿Acotado por terciaria? |
|---------|-------------------------|
| Sidebar vertical `CarruselNaipesLR` | **Sí** — lista = pares L+R de la cohorte |
| Flechas / swipe **← →** con `paresNav.length > 1` | **Sí** — anterior/siguiente L+R **solo** en cohorte |
| Footer `CarruselMateriales` | No directamente — depende del par L+R activo (secundaria) |
| Flechas **← →** con una sola ref | No — pasa a **primaria** (materiales) |
| Flechas / swipe **↑ ↓** | No — **color** del material activo (nivel 2) |
| Panel filtros Estilo (multi-select) | Opcional — filtro manual; **no sustituye** la ley terciaria en navegación automática |
| Búsqueda código vendedor | Puede **cambiar** cohorte si el destino tiene otro estilo |

### Reglas de negocio

1. **No mezclar estilos en el costado.** Chatita ≠ Tenis aunque compartan marca y línea numérica cercana.
2. **Marca ya acotada** al entrar a vista; terciaria añade el corte **estilo**.
3. **Estilo no define precio** — solo delimita navegación. Precio sigue en L+R+material.
4. **Texto `estilo`** viene enriquecido del depósito (JOIN pilares / staging). Si está vacío, cohorte = `"OTROS"` o par único (OT pendiente si afecta UX).
5. **Prohibido** usar descripción libre de producto como cohorte si existe `estilo` canónico en fila.

### Relación con filtros existentes

| Mecanismo | Diferencia |
|-----------|------------|
| Filtro URL `estilos=` | Subconjunto **manual** multi-select del vendedor |
| **Ley terciaria** | Subconjunto **automático** anclado al hero — siempre activo en navegación ←→ / sidebar |
| Ambos | Intersección: navegación = cohorte terciaria ∩ filtros activos (si hay) |

---

## 1️⃣ SECUNDARIA — L + R (dentro de cohorte)

**Clave:** `linea_codigo_proveedor | referencia_codigo_proveedor`  
**Alcance:** solo pares con stock > 0 en la tienda, marca de sesión y **mismo estilo** que la cohorte terciaria.

**UI:** sidebar vertical (si `paresCohorte.length > 1`).  
**Eje:** ← → cuando hay varias refs en la cohorte.

Orden: numérico línea ASC → referencia ASC (`compareLineaRef` en `lib/cadena.ts`).

---

## 2️⃣ PRIMARIA — L + R + material

Sin cambio respecto a [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md).  
**UI:** footer horizontal.  
**Eje:** ← → cuando la cohorte secundaria tiene **una sola** referencia activa.

---

## 3️⃣ COLOR — variante

Sin cambio. **Eje:** ↑ ↓ sobre colores del material activo (primaria).

---

## 🎮 MATRIZ DE CONTROLES (jerarquía)

| Entrada táctil / teclado | Agrupación que manda | Movimiento |
|--------------------------|----------------------|------------|
| Sidebar vertical (tap naipes L+R) | **Terciaria → Secundaria** | Salto a par L+R de la cohorte estilo |
| **← →** (`paresCohorte.length > 1`) | **Terciaria → Secundaria** | Ref anterior / siguiente en cohorte |
| **← →** (`paresCohorte.length === 1`) | **Primaria** | Material anterior / siguiente |
| Footer materiales | **Primaria** | Salto directo L+R+Mat |
| **↑ ↓** | **Color** | Color anterior / siguiente del material activo |
| Tap mazo colores | **Color** | Rota color (`stepColor`) |

**Ley de precedencia:** terciaria acota secundaria; secundaria acota el par sobre el que opera primaria; primaria acota colores.

---

## 🔑 IMPLEMENTACIÓN PREVISTA (código)

```typescript
/** Cohorte terciaria — pares L+R navegables en sidebar y ←→ */
export function paresCohorteEstilo(
  pares: ParLineaRef[],
  estiloHero: string,
): ParLineaRef[] {
  const e = (estiloHero ?? "").trim();
  if (!e) return pares;
  const cohort = pares.filter((p) => (p.estilo ?? "").trim() === e);
  return cohort.length > 0 ? cohort : pares;
}
```

| Pieza | Archivo | Estado |
|-------|---------|--------|
| Función cohorte | `lib/cadena.ts` → `paresCohorteEstilo`, `resolverNavCohorte` | ✅ |
| Orquestación vista | `app/cadena/vista/page.tsx` (`cohorteEstilo`, `parKeyActivo`) | ✅ |
| Sidebar + stepPar | `CarruselNaipesLR`, `stepVertical` | ✅ |
| Docs navegación | `NAVEGACION_CADENA.md` | ✅ |

**Tras implementar:** smoke — hero Chatita → sidebar sin Tenis; cambiar hero a Tenis → sidebar solo Tenis.

---

## 🚫 LO QUE NO ES TERCIARIA

| Campo | Rol real |
|-------|----------|
| `genero`, `tipo_v2` | Filtros / header — no cohorte lateral |
| `grupo_estilo_id` (FK futura) | Sustituto canónico de texto `estilo` cuando exista en depósito |
| Marca sola | Nivel anterior a estilo; no suficiente para acotar costado |

---

## 📊 ESTADO

| Componente | Estado |
|------------|--------|
| Ley terciaria documentada | ✅ Este documento |
| Cohorte en sidebar / ↑↓ entre refs | ✅ `resolverNavCohorte` |
| Tests smoke Chatita vs Tenis | ⏳ piso |

---

## 🔗 DOCUMENTOS RELACIONADOS

- [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md) — primaria + color
- [3_arquitectura/3.2_venta_tienda/multi_proveedor.md](../../3_arquitectura/3.2_venta_tienda/multi_proveedor.md) — primaria/secundaria en BD proveedor
- [tablet-bazzar/docs/CADENA_CONSECUTIVA.md](../../../tablet-bazzar/docs/CADENA_CONSECUTIVA.md)
- [tablet-bazzar/docs/NAVEGACION_CADENA.md](../../../tablet-bazzar/docs/NAVEGACION_CADENA.md)

---

**Aprobado por documentación:** Director (2026-06-22)  
**Próximo paso:** implementar `paresCohorteEstilo` en `page.tsx` y validar en piso.
