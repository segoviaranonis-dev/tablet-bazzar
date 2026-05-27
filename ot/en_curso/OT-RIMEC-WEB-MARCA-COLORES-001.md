# OT-RIMEC-WEB-MARCA-COLORES-001 — Diccionario de colores por marca (badge catálogo)

**Prioridad:** P1 — rimec-web  
**Ejecutor:** Gemini (Antigravity)  
**Director:** Héctor Segovia  
**Repo:** `Nexus_Core/rimec-web/`  
**Estado:** CERRADA — 2026-05-19 (Director: LISTO)

---

## Objetivo

La **pastilla de marca** en cada tarjeta del catálogo (junto a línea · ref) debe usar colores **por marca**, no el azul genérico actual (`AZUL`).

Campo afectado: `p.descp_marca` en `app/CatalogoGrid.tsx` (hay **2** badges iguales ~L230 y ~L414).

---

## Paleta Director (ley de marcas)

Normalizar nombre: `uppercase`, sin acentos, trim. Alias comunes en BD: `ACTVITTA`, `BEIRA RIO`, `BR SPORT`, etc.

| Marca (clave) | Fondo | Texto | Borde |
|---------------|-------|-------|-------|
| **VIZZANO** | Negro `#000000` | Blanco `#FFFFFF` | — |
| **MOLECA** | Rosa medio (contraste WCAG con blanco) ej. `#C2185B` o `#D81B60` | Blanco | — |
| **MOLKINHA** | Transparente / sin relleno | Mismo rosa que Moleca | Blanco **2px** (contorno) |
| **ACTVITTA** / ACTVITA | Fucsia neón ej. `#FF149DeepPink` o `#E91E63` | Azul RIMEC ej. `#1E40AF` | — |
| **MOLKINHO** | Transparente | Celeste ej. `#0EA5E9` | Blanco **2px** |
| **MODARE** | Beige / camel ej. `#C4A574` o `#D2B48C` | Blanco | — |
| **BEIRA RIO** | Naranja ej. `#F97316` | Blanco | — |
| **BR SPORT** / BRSPORT | Azul eléctrico ej. `#0066FF` | Blanco | — |
| **Default** (otras) | `#1E40AF` (azul actual) | Blanco | — |

**Nota Director:** Ajustar hex si en pantalla no se lee bien; prioridad = legibilidad del texto.

---

## Implementación sugerida

### 1. Nuevo módulo `lib/marcaBadge.ts`

```typescript
export type MarcaBadgeStyle = {
  backgroundColor: string
  color: string
  border?: string  // ej. '2px solid #FFFFFF'
}

const MARCA_BADGE: Record<string, MarcaBadgeStyle> = { ... }

export function normalizarMarcaKey(descp: string): string {
  return descp.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toUpperCase()
}

export function estiloBadgeMarca(descp_marca: string | null | undefined): MarcaBadgeStyle {
  const key = normalizarMarcaKey(descp_marca ?? '')
  return MARCA_BADGE[key] ?? MARCA_BADGE['__default__']
}
```

### 2. Componente reutilizable (opcional)

`components/BadgeMarca.tsx` — recibe `descp_marca`, aplica clases + inline style.

### 3. `CatalogoGrid.tsx`

Reemplazar ambos:

```tsx
style={{ backgroundColor: AZUL }}
```

por `style={estiloBadgeMarca(p.descp_marca)}` (spread bg, color, border).

### 4. No cambiar

- Pills de filtro **Marca** en `FiltrosCatalogo.tsx` (solo tarjeta producto).
- Colores de línea/ref (siguen azul/celeste).

---

## Pruebas

| # | Marca en tarjeta | Esperado |
|---|------------------|----------|
| T1 | VIZZANO | Negro / blanco |
| T2 | MOLECA | Rosa / blanco |
| T3 | MOLKINHA | Contorno blanco, texto rosa |
| T4 | ACTVITTA | Fucsia / azul |
| T5 | Marca desconocida | Azul default |

Captura de 3–4 tarjetas distintas en `RESPUESTA_ANTIGRAVITY.md`.

---

## Git

Commit solo si Director lo pide en el mismo PR que ETA o commit aparte:

`feat(rimec-web): badge marca por diccionario de colores`

---

## Entregable

`ot/RESPUESTA_ANTIGRAVITY.md` — estado `LISTO_PARA_AUDITORIA` + capturas.

---

## Mensaje Gemini

```
Ejecuta la OT
```

Abrir este archivo. Solo `rimec-web/`.
