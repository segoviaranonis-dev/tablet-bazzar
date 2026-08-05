# CHUSAR — Catálogo RIMEC Web · scope ramo por usuario (654 / 638)

**Código:** **2.2.1.38**  
**Fecha:** 2026-07-30 · **Keyword:** Documenta + despliega (Director)  
**App:** RIMEC Web `:3001` / prod · Accesos Portal `:3004/accesos`

---

## Ley

Para **aligerar** la grilla, cada login comercial ve **un solo ramo**:

| Scope | Logins | Catálogo | Prohibido |
|-------|--------|----------|-----------|
| **Calzado 654** | ATI, LILI, YRMA, CESAR, Carina, MARIO, DERLIS, GRICELDA, GIANINA, Enrique, MARCELO, LUISLV, Eduardo, HUGO (+ alias) | Solo `ramo_tipo=CALZADO` | Confecciones **638** |
| **Confecciones 638** | **DARIO** · **PATRICIA** | Solo `ramo_tipo=CONFECCIONES` | Calzado **654** |
| **Libre** | DIOS, ADMIN (salvo Patricia), Bazzar, etc. | Ambos ramos | — |

Enforcement: **servidor** (API tarjetas/filtros) + **SSR** + **UI** (pills) + **warm/sync** (no precarga el ramo prohibido).

---

## Código canónico

| Pieza | Ruta |
|-------|------|
| Listas + resolve | `rimec-web/lib/auth/catalogoScopeUsuario.ts` |
| API | `app/api/catalogo/tarjetas` · `filtros` → `applyCatalogoScopeUsuario` |
| Login / me | `catalogo_scope` · `solo_calzado` · `solo_confecciones` |
| UI | `CatalogoClient` · `FiltrosCatalogo` · `CatalogoFiltrosSidebar` |
| Warm | `catalogoPeWarmCache` (`skipConfecciones` / `skipCalzado`) |
| Sync overlay | `catalogoSyncStages` por scope |
| Accesos Portal | `nexus-navegador-holding/config/usuario-v2-roles.json` · `OrganigramaAccesos` |

---

## Operación

1. Usuario cierra sesión y vuelve a entrar (scope se deriva del `name` de sesión).
2. Ampliar listas: editar `SOLO_CALZADO_LOGIN` / `SOLO_CONFECCIONES_LOGIN` + censo JSON `:3004`.
3. Smoke: `DARIO` → confecciones · `ATI` → calzado · `HECTOR` → libre.

---

## Relacionado

- Confecciones reglas propias **2.2.1.0.11** · CP confecciones etapa **2.2.1.36**
- Report: VENDEDOR sin Logística hasta `LOGISTICA_VENDEDOR_LANZADA` (`report/src/lib/auth/vendedor-rimec-report.ts`)
- BZZS / BZZP → `categoria=ADMIN` (BD 2026-07-30)

**Shibboleth:** Andrés, el que viene.
