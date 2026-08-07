# CHUSAR — Motor precio · pestañas Publicado / Pendiente · puerta a Bazzar Web

**Código:** **2.5.1.22**  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta**  
**Módulo:** Report `/bazzar-web/motor-precio`  
**Etapa FOCO:** `FINAL-BAZZAR-WEB-20260806` · lanzamiento **2.5.1.18**  
**Padres:** **2.5.1.19** (CASO DPE) · **2.5.1.21** (cascada siamese) · Stock Sano (pase SANO)  
**Estado:** **LEY de decisión ratificada** (Director 2026-08-06) · implementación pendiente de orden  
**Shibboleth:** Andrés, el que viene.

---

## Espíritu (orden Director 2026-08-06)

El Motor deja de ser solo “calculadora + botón publica todo”. Pasa a ser el **guardián de publicación** hacia Bazzar Web:

1. Se **recibe** stock por Compra → Depósito (y Stock Sano puede marcar SANO).
2. En el Motor se **verifica** precio y CASO (NORMAL / PROMOCIONAL / LIQUIDACION).
3. Solo lo que el operador **elige y publica** en este proceso aparece en la tienda Bazzar (`:3002`).
4. Si un producto **ya estaba publicado** y vuelve a entrar con otro CASO/precio (política importadora), el Motor **avisa** y pide **decisión** — **nunca bloquea** al usuario.

```
Compra Web (recepción)
    → Depósito Web (stock físico ALM_WEB)
    → Stock Sano (pase técnico SANO)
    → Motor precio  ← Pendiente | Publicado · multi-select · aviso + decisión
    → Bazzar Web catálogo  (solo filas con publicación Motor vigente)
```

**Veredicto Director:** hay falencias reales en el flujo actual (publicar-todo / sin revisión humana) — no es solo percepción. Esta ley las cierra.

---

## UI objetivo (Guardián)

| Pestaña | Qué muestra |
|---------|-------------|
| **Pendiente** | SKUs en ALM_WEB sin sello Motor, **o** con diferencia vs publicado (precio y/o CASO). Multi-select + revisión. |
| **Publicado** | SKUs con publicación Motor vigente. |

**Multi-select:** el operador marca filas tras ver LPN · CASO · CALCULADO vs PUBLICADO · aviso de conflicto.  
**Publicar:** solo la selección (no “publicar todo” a ciegas).

---

## Ley de conflicto — libertad al usuario (ratificada)

**Prohibido bloquear.** Solo **avisar** y **pedir decisión**.

Cuando hay producto ya en **Publicado** y el ingreso/recálculo trae CASO o precio **distinto**:

| Decisión del operador | Efecto |
|------------------------|--------|
| **Aprobar con precio NUEVO** | Actualiza el precio (y CASO asociado) de lo **publicado**. Todo el stock de ese SKU (viejo + nuevo) vende al precio nuevo. |
| **Aprobar con precio PUBLICADO** | Mantiene el precio ya establecido en Publicado. Lo **nuevo** se vende al precio publicado vigente (no pisa la vitrina). El calculado queda como referencia histórica / no aplica a tienda. |

### Ejemplo canónico

1. En Publicado: línea PROMO · precio 308.000.  
2. Entra recepción / DPE ahora dice NORMAL · calculado 258.000.  
3. UI: aviso **CONFLICTO** (CASO y/o precio).  
4a. Operador elige **precio nuevo** → Publicado pasa a 258.000 (NORMAL); tienda actualiza.  
4b. Operador elige **precio publicado** → sigue 308.000; el stock nuevo se suma vendible a **308.000**.

Misma lógica si solo cambia el monto y el CASO coincide.

---

## Conflictos a detectar (señales, no candados)

| Situación | Señal UI |
|-----------|----------|
| CASO publicado ≠ CASO calculado (ej. PROMO → NORMAL) | Badge **CONFLICTO CASO** + modal de decisión |
| Precio calculado ≠ precio publicado | Badge **≠ precio** + mismas dos opciones |
| Primera publicación (sin publicado previo) | Sin conflicto · un solo camino: publicar calculado |

---

## Ley de aparición en Bazzar Web

**Solo lo que pasó por decisión de publicación del Motor aparece en el catálogo B2C.**

Hoy la tienda filtra `v_stock_web` con `stock_web > 0` · `precio_web > 0` · `stock_sano_estado = 'SANO'` (`catalogo-vendible.ts`).

**Gap (falencia real):** Compra / Stock Sano / “Publicar precios WEB” masivo pueden escribir `precio` sin revisión. La ley exige **sello de publicación Motor** + respeto de la decisión (nuevo vs publicado).

| Capa | Rol |
|------|-----|
| Stock Sano | Pase técnico **SANO** |
| Motor | Pase comercial **publicado** + resolución de conflictos |

---

## Dudas cerradas / abiertas

| # | Tema | Estado |
|---|------|--------|
| 1 | ¿Bloquear conflicto? | **Cerrado:** no bloquear · avisar · pedir decisión |
| 2 | Precio nuevo vs publicado | **Cerrado:** dos botones de aprobación (tabla arriba) |
| 3 | Granularidad sello (L+R+M vs combinación) | Abierta · default propuesto: **tripleta L+R+Material** (como Guardián) |
| 4 | Stock ya en tienda hoy (grandfather) | Abierta · default propuesto: **queda** hasta primera decisión Motor |
| 5 | ¿Compra/Sano deja de escribir precio WEB? | Abierta · default propuesto: Sano solo SANO; **precio WEB solo Motor** |
| 6 | Despublicar → Pendiente | Abierta · no ordenado aún |

---

## Qué NO es este CHUSAR

- No redefine markup DPE (**2.5.1.19**).
- No es grada 638 B2C (F1 **2.5.1.18**).
- **Código local:** no ejecutar hasta orden explícita post-Documenta (esta actualización ya cierra la ley de decisión).

---

## Archivos a tocar (cuando se autorice implementar)

| Pieza | Ruta probable |
|-------|----------------|
| UI pestañas + multi-select + modal decisión | `MotorPrecioClient.tsx` |
| Publicar selección + modo `nuevo` \| `publicado` | `catalogo.ts` · API `publicar` |
| Sello / auditoría decisión | migración + historial |
| Tienda | `catalogo-vendible.ts` · `v_stock_web` si hace falta |

---

## Relación con docs previos

| Código | Rol |
|--------|-----|
| **2.5.1.19** | CASO = DPE NORMAL/PROMO/LIQ |
| **2.5.1.21** | Cascada filtros Guardián |
| **2.5.1.6** | Integridad depósito ↔ SANO ↔ web |
| Este **2.5.1.22** | Puerta comercial + libertad de decisión en conflicto |
