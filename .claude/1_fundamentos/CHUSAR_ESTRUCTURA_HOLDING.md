# CHUSAR — Estructura del holding Nexus Core

**Integrado:** 2026-06-17 · **Orden:** Director · **Protocolo:** `PROTOCOLO_DOCUMENTACION_CHUSAR.md`  
**Uso:** memoria secundaria base para manual de operaciones y manual de funciones (futuro)  
**Shibboleth:** Andrés, el que viene.

---

## 1. Casa única

| Concepto | Valor |
|----------|-------|
| **Workspace Cursor** | `C:\Users\hecto\Nexus_Core\` (padre — **no** abrir solo un sub-repo) |
| **Reglas agente** | `.cursorrules` en raíz |
| **BD** | Supabase única (`public`) compartida por todos los repos |
| **Entrada agente** | `MORIA_PRIMARIA.md` → `4_etapas/ACTUAL.md` → secundaria bajo demanda |

---

## 2. Raíz del holding (disco)

```
Nexus_Core/
├── README.md              ← presentación + enlaces
├── SECURITY.md            ← políticas seguridad
├── .cursorrules           ← regla única Cursor
├── .cursor/rules/         ← reglas holding (keywords Director)
├── .claude/               ← MEMORIA SECUNDARIA (canónica)
├── control_central/       ← repo · Nexus Streamlit
├── rimec-web/             ← repo · portal RIMEC
├── bazzar-web/            ← repo · portal Bazar B2C
├── report/                ← repo · Report institucional
├── tablet-bazzar/         ← repo · POS tablet Bazzar
├── **memoria-web/**       ← tablero HTML Director (independiente)
├── roles/                 ← roles agentes (Cursor, Claude, Antigravity)
└── comercial/             ← propuestas comerciales (no código)
```

**Prohibido en raíz:** `.md` sueltos, scripts de diagnóstico, Excel, SQL hotfix — van en repo correspondiente o `.claude/6_ot/` / evidencia app.

**Legacy vacío / obsoleto:** `docs/` y `ot/` en raíz — **no usar**. OT canónica: `.claude/6_ot/`. Contrato y mapa: `.claude/1_fundamentos/`.

---

## 3. Memoria `.claude/` (estamentos)

| Carpeta | Clase plan | Contenido |
|---------|------------|-----------|
| `MORIA_PRIMARIA.md` | 0 | Primaria — leyes §0 + índice títulos |
| `INDICE_MAESTRO.md` · `CODIGO_MAESTRO.md` | 0 | Mapa + plan de cuentas `C.LL.SS.NNN` |
| `1_fundamentos/` | 5 | Protocolos, leyes, políticas, contrato |
| `2_modulos/` | 2 | Índice por producto (2.1–2.5) + `ENLACES_REPOS.md` |
| `3_manual_funciones/` | 3 | Manual funciones (futuro operativo) |
| `3_arquitectura/` | 7 | Decisiones técnicas cross-app |
| `4_etapas/` | 6 | **`ACTUAL.md`** + etapas abiertas/cerradas |
| `5_errores/` | 4 | Índice + detalle hotfixes |
| `6_ot/` | 8 | Cola, protocolo, OT en curso/cerradas |
| `7_auditorias/` | 9 | RBAC, migraciones, histórico |
| `8_historico/` | — | Archivo — no normativa vigente |
| `9_comercial/` | — | Material comercial holding |
| `10_roles/` | 1 | Equipo, AGENTS, accesos |

**Regenerar catálogo:** `python control_central/scripts/generar_codigo_maestro.py`

---

## 4. Repos producto (código + doc operativa)

| Repo | Producto | Puerto dev | Deploy |
|------|----------|------------|--------|
| `control_central/` | Nexus operativo (Motor, PP, FI, Retail) | 8501 | Streamlit Cloud |
| `report/` | Sales Report, Retail, RRHH, **Administrador Pilares** `/pilares` | 3000 | Vercel |
| `rimec-web/` | Catálogo vendedores RIMEC | 3001 | Vercel |
| `bazzar-web/` | E-commerce Bazar MVP | — | Vercel |
| `tablet-bazzar/` | POS tablet 6 tiendas | 3002 | Vercel |

**Doc operativa app:** siempre en `[repo]/docs/` — indexada en `CODIGO_MAESTRO` (clase 2 · grupo **90**).  
**Doc holding cross-repo:** `.claude/` — **nunca** duplicar leyes de negocio en `[app]/docs/`.

Conector: `2_modulos/ENLACES_REPOS.md` · mapa paths: `1_fundamentos/MAPA_REPOS.md`

---

## 5. Productos vs procesos

| Tipo | Qué es | Pilares | Ejemplos |
|------|--------|---------|----------|
| **Producto** | App/canal que consume datos | Según app | Nexus, Report*, RIMEC Web, Bazzar Web, Tablet |
| **Proceso** | Motor que muta/enriquece | Sí | Motor precios, Retail import |

\* **Sales Report** (`registro_ventas_general_v2`) = **blindado** — no usa pilares.

---

## 6. Matriz «¿dónde va esto?»

| Contenido | Ubicación canónica |
|-----------|-------------------|
| Ley holding / arquitectura multi-repo | `.claude/1_fundamentos/` |
| Etapa abierta o cerrada | `.claude/4_etapas/` + `ACTUAL.md` |
| CHUSAR módulo (memoria operativa) | `.claude/2_modulos/` o `.claude/3_arquitectura/` → `CHUSAR_*.md` |
| OT activa | `.claude/6_ot/en_curso/` |
| Deploy / API de una app | `[repo]/docs/` |
| Código fuente | `[repo]/` (src, modules, app) |
| Error con código | `.claude/5_errores/detalle/` |

**Antes de crear carpeta/archivo:** `ESTRUCTURA_OBLIGATORIA.md` + aprobación Claude (Maestro de Obras).

---

## 7. Flujo agente (resumen)

1. Shibboleth → **Andrés, el que viene.** · CHUNA sin POINTER  
2. Leer `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` + `CHUSAR_ECOSISTEMA_PUERTA_UNICA.md` (mapa 5 capas)  
3. Leer `MORIA_PRIMARIA.md` §0 (leyes inquebrantables)  
4. Leer `4_etapas/ACTUAL.md` (qué etapa está abierta)  
5. Abrir **solo** la secundaria del módulo en tarea  
6. Escribir memoria **solo** con keyword Director: **Documenta** · **Documentación Chusar**

---

## 8. Docs relacionados

| Tema | Ruta |
|------|------|
| Estructura legal (dónde crear) | `1.3_politicas/ESTRUCTURA_OBLIGATORIA.md` |
| Contrato arquitectura | `CONTRATO_ARQUITECTURA.md` |
| Equipo | `10_roles/EQUIPO_Y_ROLES.md` |
| Cierre etapa (5 patas) | `1.1_protocolos/1.1.10_protocolo_cierre_etapa.md` |
| Restablecimiento post-migración | `6_ot/OT-RESTABLECIMIENTO-NEXUS-CORE-001.md` |

---

**Chusar integrado — estructura holding — 2026-06-17**
