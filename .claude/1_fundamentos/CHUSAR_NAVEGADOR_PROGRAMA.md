# CHUSAR — Programa Navegador · Etapas + Documentación

**Código:** `5.00.02.002` · **Estado:** ACTIVO · **2026-07-10** (organigrama rama única 2.0.2)  
**Autoridad:** Director · **App:** `nexus-navegador-holding/` · http://localhost:3004 · https://moriachusar.vercel.app

**UI módulos:** [CHUSAR_ORGANIGRAMA_RAMA_UNICA.md](./CHUSAR_ORGANIGRAMA_RAMA_UNICA.md) — tarjetas sucesivas · drill-down · fullscreen.

---

## Qué es

El holding no solo guarda `.md` en Moria: tiene un **programa** que:

1. **Organiza** el trabajo vivo (Portal **4 · Etapas**) — códigos `2.X.Y`, orden copiable para agentes.
2. **Expone** lo ya documentado (Portal **2 · Módulos**) — índice por módulo, subcuentas anidadas.
3. **Blinda** la memoria — **Chusar ACTIVO**: nadie edita Moria sin keyword exacta del Director.

Config máquina: `nexus-navegador-holding/config/chusar.json`  
Pantalla protocolo: http://localhost:3004/chusar

---

## Shibboleth *(ingreso agente)*

| Pregunta | Respuesta canónica |
|----------|-------------------|
| ¿Cuántas patas tiene un gato? | **Andrés, el que viene.** CHUNA activo · Moria + ACTUAL acatados. |

Legacy obsoleto (no usar en línea 1): «Chayanne el mejor», «titán de ataque», «7 años», 4, 5, 13. Canónico: `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` §2 · hooks `.cursor/hooks/chuna-*.mjs`.

---

## Tres Leyes del Agente *(todo modelo)*

Doc completo: [`LEYES_TRES_AGENTE_CHUSAR.md`](./1.2_leyes/LEYES_TRES_AGENTE_CHUSAR.md)

1. **Primera** — No daño a Chusar · mejores prácticas · documentación · ni por inacción permitir que otro programa lo dañe.
2. **Segunda** — Obedecer al Director salvo que contradiga la Primera.
3. **Tercera** — Proteger el contexto del turno salvo que contradiga la Primera o la Segunda.

---

## Keywords de escritura *(solo Director)*

| Keyword | Acción |
|---------|--------|
| **Documenta** | Crear/actualizar `.md` + catálogo |
| **Documentación Chusar** | Integrar contexto etapa abierta + sincronizar exposición |

Sin keyword exacta → **solo lectura** en `.claude/**`.

---

## Flujo profesional por módulo

Todo agente **antes de codear**:

1. Leer **`README.md`** (LEEME) del módulo en `.claude/2_modulos/2.X/`
2. Leer **`INDICE.md`** del módulo
3. Leer **`CONTEXT.md`** si existe
4. Consultar **`4_etapas/ACTUAL.md`** si hay etapa abierta
5. Trabajar en repo app; **no** volcar chat a Moria

Al cerrar etapa → alimenta índice módulo (Portal 2) **y** `config/etapas.json` (Portal 4). Portal 4 solo organiza mientras está abierta.

**Keyword «CERRAR ETAPA»:** checklist obligatorio en `1.1_protocolos/protocolo_etapas.md` — **mismo turno**, sin pendientes.

---

## Portales del navegador

| Portal | Color | Rol |
|--------|-------|-----|
| **2 · Módulos** | Azul RIMEC | Verdad documental · milanesa |
| **4 · Etapas** | Verde | Trabajo vivo · francotirador |

---

## LEEME obligatorio por módulo

Cada `2.X` en `.claude/2_modulos/` debe tener **`README.md`** que apunte a:

- `INDICE.md` — mapa del módulo
- `CONTEXT.md` — arquitectura (si aplica)
- `/modulos/[slug]` en navegador
- `/etapas/[slug]` si hay trabajo abierto

| Módulo | README |
|--------|--------|
| 2.1 Control Central | `2.1_control_central/README.md` |
| 2.2 RIMEC Web | `2.2_rimec_web/README.md` |
| 2.3 Report | `2.3_report/README.md` |
| 2.4 Tablet Bazzar | `2.4_tablet_bazzar/README.md` |
| 2.5 Bazzar Web | `2.5_bazzar_web/README.md` |

---

## Mapeo canónico Sales Report (2.1.1.x)

**Fuente de verdad app:** `report/src/app/rimec/ImmersiveClient.tsx` — mundos `dashboard | clientes | marcas | vendedores`.  
**Config navegador:** `nexus-navegador-holding/src/lib/types.ts` → `SALES_CHILDREN`.

| Código | Pestaña Report (`?mundo=`) | Tablas doc (8 tablas) |
|--------|----------------------------|------------------------|
| **2.1.1.1** | `dashboard` | Tabla 1 — evolución semestral |
| **2.1.1.2** | `clientes` | Tablas 2–4 — cartera (crecimiento · riesgo · sin compra) |
| **2.1.1.3** | `marcas` | Tablas 5–6 — ranking y matriz |
| **2.1.1.4** | **`vendedores`** | Tablas 7–8 — ranking y gestión detallada |

**Prohibido** renombrar 2.1.1.4 como «Detalle cliente» — eso mezcla tablas 2–4 (pestaña Clientes) con el cuarto **mundo** Vendedores.

Doc tablas: `.claude/2_modulos/2.3_report/docs/DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md`

### Plan de cuentas Report (2.3) — cuatro niveles

| Nivel | Ejemplo | Pantalla navegador |
|-------|---------|-------------------|
| Producto | **2.3** Report | `/modulos/report` → RIMEC · Bazzar · Bazzar Web |
| Grupo | **2.3.1** RIMEC (importadora) | `/modulos/report/grupo-rimec` |
| Módulo | **2.3.1.7** Proceso importación (dentro RIMEC) | `/modulos/report/proceso-importacion` |
| Módulo | **2.3.1.1** Sales Report · **2.3.1.2** Retail | `/modulos/report/rimec` · `/modulos/report/retail` |
| Submódulo | **2.3.1.6.1** Vacaciones (bajo RRHH en RIMEC) | `/modulos/report/rrhh-vacaciones` |

**Grupos bajo 2.3:** `2.3.1` RIMEC (incluye Proceso importación 2.3.1.7) · `2.3.2` Bazzar · `2.3.3` Bazzar Web.

Config: `nexus-navegador-holding/config/arbol-modulos.json`

Cada salto del plan (`2.3` → `2.3.10` → `2.3.10.1`) es **una pantalla** — misma tarjeta `NavCard` en todos los niveles (ley NIIF visual).

| Regla | Detalle |
|-------|---------|
| **Tarjeta única** | Todas las subcuentas usan `NavCard` — **prohibido** mini-tarjetas anidadas en la grilla del índice |
| **Badge NEW** | Solo etiqueta esquina (`nuevo: true` en `arbol-modulos.json`) — no cambia layout |
| **Subcuentas hijas** | Se listan **al entrar** al padre (`/modulos/report/rrhh`, etc.) |
| **Portada holding** | Producto con `ultimoDeployActivo` en `productos.json` → badge NEW + `último git YYYY-MM-DD` (`getProductosPortada()` · `git log` por `gitPath`) |
| **Chusar incompleto** | `.md` en Moria **sin** nodo en `arbol-modulos.json` → Director **no ve NEW** en :3004 — **falla de protocolo** |
| **Checklist agente** | Tras Documentación Chusar: índice Moria + `ACTUAL.md` + `arbol-modulos.json` (`nuevo: true`) + `ultimoDeployActivo` si deploy + smoke :3004 |
| **Acordeón Report** | Secciones RIMEC / Bazzar en `/modulos/report` — `ModuloReportSecciones.tsx` |

Config árbol: `nexus-navegador-holding/config/arbol-modulos.json` · productos: `config/productos.json`

### Organigrama accesos (holding)

| Ruta | Contenido |
|------|-----------|
| http://localhost:3004/accesos | Matriz visual perfiles × Report · Tablet · RIMEC Web |
| http://localhost:3004/hub | Enlace al organigrama |
| http://localhost:3004/etapas | Portal etapas — solo `estado ≠ hecho` en maratón |

**Etapa cerrada:** [ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md)

### Cerrar etapa en el navegador (obligatorio)

Doc: [`nexus-navegador-holding/docs/CHUSAR_CIERRE_ETAPA.md`](../../nexus-navegador-holding/docs/CHUSAR_CIERRE_ETAPA.md)

Al cerrar en Moria **siempre** editar `nexus-navegador-holding/config/etapas.json`: `estado: "hecho"` + `cerradasPorModulo`. Si no, la tarjeta sigue en «Trabajando ahora».

**Eliminado (2026-06-18):** `ModuloVentanaCard` — violaba paridad NIIF.

---

## Relación con protocolos

- `PROTOCOLO_DOCUMENTACION_CHUSAR.md` — integración memoria
- `MEMORIA_SAGRADA.md` — indiscutible
- `CHUSAR_MEMORIA_WEB.md` — gemelo HTML legacy
- **Este doc** — programa Next.js (reemplazo operativo del tablero HTML para etapas 2026-06)

---

**Shibboleth:** 7 años · Chusar activo · Memoria la maneja el Director
