# CHUSAR — Error Calzado ≠ Carteras · estrategia Mario Bros / grupo uno

**Código:** **2.2.1.24**  
**Error Moria:** `4.01.04.003`  
**Fecha:** 2026-07-24  
**Keyword Director:** **Documenta** · Protocolo Chusar activado  
**App:** RIMEC Web `:3001`  
**Estado:** ✅ Fix local · ⏳ deploy prod (Claude Code + OK Director)

---

## 1 · Ley Director (Mario Bros · grupo uno)

Al iniciar la **estrategia Mario Bros** (diccionario PE · tres Excel · **grupo uno**) quedó establecido:

| Universo | Qué entra | Qué queda **fuera** |
|----------|-----------|---------------------|
| **Filtro Categoría Calzado** (`ramo_tipo=CALZADO`) | Calzado comercial en **tres cadenas**: **NORMAL · PROMOCIONAL · LIQUIDACIÓN** (grupo uno) | **Carteras** · confecciones 638 · cualquier accesorio no calzado |
| **Módulo carteras** | Chip **Tipo → Carteras** (`tipo_grupos=carteras`) | No mezclar en Calzado por defecto |

**Fuente canónica grupo uno:** [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) (**2.3.1.10.1.2** §4):

> Exclusión: grupos `CARTERAS` / `CARTERA` → **fuera** del filtro grupo uno (módulo propio).

**Visual casino:** [CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md](./CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md) — shells NORMAL/PRO/LIQ; **no** incluye carteras en pill Calzado.

---

## 2 · Error cometido (agente · 2026-07-24)

El Director reportó **pijamas en ESTILO Calzado** + **bolsos en grilla** (`?origen_tipo=TODOS&ramo_tipo=CALZADO`).

| Turno agente | Fallo |
|--------------|-------|
| Auditoría iceberg | Corrigió solo **confecciones CP** en RPC (MIG-181) |
| Respuesta carteras | Dijo «carteras 654 son diseño válido» — **contradice Mario Bros** |
| Objetivo Director | **Calzado = Normal + Promo + LIQ + calzado puro** — sin carteras ni confecciones |

**Clasificación:** violación de regla ya escrita en Chusar grupo uno · no bug nuevo de producto.

---

## 3 · Síntomas y evidencia BD

| Métrica | Valor local |
|---------|-------------|
| PE `ramo_tipo=CALZADO` + `grupo_estilo=CARTERAS` | **236 filas** |
| PE calzado puro (sin CARTERAS grupo/tipo) | **5.602 filas** |
| CP confecciones filtradas post MIG-181 | Kyly/Milon/PIJAMA fuera de meta CALZADO |

Scripts: `report/scripts/_audit_iceberg_calzado.mjs` · `report/scripts/_audit_calzado_sin_carteras.mjs`

---

## 4 · Fix aplicado (local)

### 4.1 Iceberg confecciones (sidebar)

**MIG-181** — `rimec_catalogo_meta` rama CP filtra `p_ramo_tipo` (paridad PE · vista MIG-168).

### 4.2 Exclusión carteras en Calzado (grilla + meta)

| Archivo | Función |
|---------|---------|
| `lib/filtros/filtro-tipo-canonico.ts` | `esFilaCarteraCatalogo` · `calzadoExcluyeCarterasPorDefecto` |
| `lib/catalogoFilters.ts` | SQL `.neq CARTERAS` + `applyMemoryFilters` |
| `lib/catalogoMetaRpc.ts` | Sidebar sin estilo/tipo CARTERAS |
| `lib/catalogoPaginado.ts` | BCL cuando Calzado excluye carteras |

**Regla implementada:**

```
SI ramo_tipo = CALZADO
 Y tipo_grupos NO incluye 'carteras'
 → excluir filas CARTERAS (grupo, tipo, caso BCL)
```

**Ver carteras:** `&tipo_grupos=carteras` (hermanos siameses · [2.2.1.18](./CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md)).

---

## 5 · Checklist smoke Director

- [ ] `:3001/?origen_tipo=TODOS&ramo_tipo=CALZADO` — grilla **sin bolsos**
- [ ] Sidebar ESTILO — **sin** PIJAMA / LEGGING / CARTERAS
- [ ] Chips COMERCIAL — solo NORMAL · PROMO · LIQ visibles en PE
- [ ] `&tipo_grupos=carteras` — carteras **solo** ahí

---

## 6 · Pendiente prod

| Ítem | Responsable |
|------|-------------|
| MIG-181 + MIG-180 en Supabase prod | Claude Code |
| Deploy RIMEC Web visual + filtros | Claude Code + OK Director |

---

## 7 · Cruces Moria

| Código | Título |
|--------|--------|
| `4.01.04.003` | Este error · detalle `5_errores/detalle/` |
| `2.2.1.0.6` | Auditoría ramo confecciones |
| `2.2.1.18` | Hermanos siameses Tipo |
| `2.3.1.10.1.2` | Grupo uno · exclusión carteras decoder |
| `2.2.1.21.G1` | Visual casino NORMAL/PRO/LIQ |

---

**Orden Director:** Documenta · Protocolo Chusar · 2026-07-24.
