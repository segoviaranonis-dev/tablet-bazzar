# CHUSAR — Dual cache catálogo · CP ↔ PE instantáneo

**Código:** **2.2.1.0.2** · **Característica producto ★★★**  
**App:** RIMEC Web `:3001`  
**Track:** Día operativo 13-07-26 · **Track 1** (Cursor)  
**Ratificado:** Director · 2026-07-13  
**Shibboleth:** Andrés, el que viene.

---

## Por qué es característica central del producto

El vendedor **siempre entra por Compra previa** (CP). Pronta entrega (PE) debe estar **lista detrás del telón** — sin los 30–40 s de espera al cambiar pestaña.

| Promesa | Métrica |
|---------|---------|
| CP visible al abrir | Primera pantalla en pocos segundos |
| PE precargado en paralelo | ≥ **30 tarjetas** en cache antes del click |
| Cambio CP ↔ PE | **Instantáneo** si cache caliente (sin spinner vacío) |
| Imágenes | Decode en background (`preloadImageDecoded`) |

---

## Arquitectura — dual warm

```
Usuario en CP (default)
  ├─ GET /api/catalogo/tarjetas  → pinta CP (prioridad)
  └─ +150ms detrás del telón
       └─ GET tarjetas PE (CALZADO) + filtros → pageCache PE

Usuario click «Pronta entrega»
  ├─ cache PE ≥30 tarjetas → pinta YA + refresh background
  └─ ensureDualCatalogWarm → precarga CP en background
```

**Inverso:** en PE activo, CP se mantiene caliente igual.

---

## Implementación

| Pieza | Ruta |
|-------|------|
| Motor cache | `rimec-web/lib/catalogoPeWarmCache.ts` |
| Hook UI | `rimec-web/app/CatalogoClient.tsx` |
| API tarjetas | `rimec-web/app/api/catalogo/tarjetas/route.ts` |
| Límite página | `CARD_PAGE_LIMIT = MIN_WARM_CARDS = 30` |

### Funciones clave

| Función | Rol |
|---------|-----|
| `ensureDualCatalogWarm(activeFilters)` | Mantiene CP+PE default calientes |
| `isCatalogWarmEnough(payload)` | `tarjetas.length ≥ 30` + TTL 15 min |
| `storePageWarmCache` | Memoria módulo + warm imágenes |
| `getPageWarmCache` | Hit al cambiar pill origen |

### Filtros cache default

| Origen | Query cache |
|--------|-------------|
| **CP** | sin `origen_tipo` |
| **PE** | `origen_tipo=PRONTA_ENTREGA&ramo_tipo=CALZADO` |

Cambios de filtro (marca, línea, etc.) = cache miss esperado → fetch normal.

---

## Stale-while-revalidate

Si cache tiene ≥30 tarjetas pero TTL válido:

1. Pinta tarjetas **de inmediato** (`loading=false`).
2. Refresca en background (`fetchPage`).
3. Actualiza cache al terminar.

Si cache parcial o miss → spinner hasta primera respuesta.

---

## Problema anterior (2026-07-13)

| Antes | Después |
|-------|---------|
| PE prefetch solo tras CP + `idle` ~2,8 s | PE prefetch **+150 ms** tras montar CP |
| Solo PE en background | **Bidireccional** CP↔PE |
| Hit cache pero sin mínimo 30 | `isCatalogWarmEnough` obligatorio |
| Cambio pestaña 30–40 s | Objetivo **&lt;1 s** con cache caliente |

---

## Smoke test Director

1. Login `:3001` → CP default carga.
2. **Esperar ~20–30 s** en CP (PE termina prefetch) — Network: request PE en background.
3. Click pill **Pronta entrega** → grilla **sin vacío prolongado** · ≥30 modelos.
4. Volver **Compra previa** → igualmente instantáneo.
5. DevTools → Application: no persiste en `sessionStorage` (memoria sesión SPA · TTL 15 min).

---

## Relacionado

- [PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md](./PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md) § prefetch  
- [CHUSAR_DIA_OPERATIVO_20260713.md](../2.3_report/CHUSAR_DIA_OPERATIVO_20260713.md) Track 1  
- [CHUSAR_CATALOGO_CABECERA_FILTROS.md](./CHUSAR_CATALOGO_CABECERA_FILTROS.md)

---

**Ley producto:** CP es la puerta · PE siempre detrás del telón · **30 tarjetas mínimo** en ambos lados.
