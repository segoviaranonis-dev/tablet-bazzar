# Backlog parqueado — listo cambio de foco · 2026-08-05

**Keyword:** **Documenta** · 2026-08-05  
**Orden Director:** documentar todo lo pendiente · agente listo para cambiar de foco  
**Protocolo vivo:** Protocolo Moises Activado  
**Shibboleth:** Andrés, el que viene.

> Este archivo **congela** deudas abiertas del paralelo cocina/bandeja/DPE.  
> No abre etapa nueva. Reapertura = **Nueva etapa** / **Inicia etapa** o orden directa citando el ítem.

---

## Estado al parquear

| Frente | Estado |
|--------|--------|
| **Única etapa viva** | `MOISES-20260804` (infra / mudanza) |
| **Cocina ≠ PDF** | ✅ Local + CHUSAR **2.3.1.35.15** · smoke PASS |
| **Cron 06:00** | 🟡 Plan intento **2026-08-06** · **2.3.1.35.14** + error **4.02.05.005** |
| **Foco agente** | 🟢 **Libre** — espera nuevo norte del Director |

---

## A · Automatización / cocina / bandeja (Report)

| # | Ítem | Ref | Notas al reabrir |
|---|------|-----|------------------|
| A1 | Intento cocina auto **06:00** | **2.3.1.35.14** · `PLAN_COCINA_AUTO_0600_INTENTO_20260806.md` · **4.02.05.005** | COCINAR 05:00 · EMPLATAR 05:50 · MAIL 06:00 · worker vivo · preferir smoke antes de banquete |
| A2 | Carrier cloud del worker | deuda | Sin esto el reloj no vive de noche en PC apagada |
| A3 | **Asignador** (quién ve qué PDF) | **2.3.1.35.11** | No achicar cocina |
| A4 | Unificar banquete SPE (1 mensaje menú) | scripts `_unificar_banquete_hector` | Post-corrida grande |
| A5 | Validar UI aviso corto + acordeón Detalle | bandeja | Post-banquete |
| A6 | Carpeta `LOGISTICA_CONFIRMACION_ENTREGAS` | stub vacío | UI acordeón lista · datos no |
| A7 | Puente Logística → PDF FI | Graciela→vendedor | Flujo completo |
| A8 | PLAN-AUTO T−10 / asignador (etapa admin cerrada) | `PLAN-AUTO-BANDEJA-PE-20260802` | Reabrir solo con Nueva etapa |

**Hecho (no reabrir como pendiente):** Cocina ≠ PDF local **2.3.1.35.15** · layout 638 · espíritu 133×LP · banquete unificado histórico 413 PDF.

---

## B · Datos / tipificación

| # | Ítem | Ref | Decisión pendiente Director |
|---|------|-----|------------------------------|
| B1 | DPE tipifica VERANO · visual invierno (KYLY `1001020100`) | **4.02.05.004** · **2.3.1.35.13** | ¿Aceptar DPE? ¿Carlos? ¿smoke INVIERNO al lado? |

---

## E · Filtros cascada (Web + Report) — local OK · sin deploy

| # | Ítem | Ref | Pendiente al retomar |
|---|------|-----|----------------------|
| E1 | RIMEC Web cascada catálogo (AB-CR · Marca · Género · molécula) | **2.2.1.42** · [CHUSAR_HANDOFF_FILTROS_20260805.md](./CHUSAR_HANDOFF_FILTROS_20260805.md) | MIG-199 Supabase · smoke browser `:3001` · deploy con puerta |
| E2 | Report `/aprobaciones` filtros indagación | **2.3.1.3.5** · mismo handoff | Smoke `:3000` · deploy con puerta |

**Dev local (2026-08-05):** `:3000` Report · `:3001` RIMEC Web levantados.

---

## C · Holding / otras deudas (post-corte admin)

| # | Ítem | Ref |
|---|------|-----|
| C1 | Alcance PDF Sales Report | Etapa admin cerrada `SALES-REPORT-PDFS-20260804` |
| C2 | Import CSV Carlos (piso) | CSV con **DEPOSITO ya en prod** (`c2ddd2f`) · falta solo import físico en sistema Carlos |
| C3 | Confirm recepción TRP PE-237 Bazzar | ✅ Integridad CUADRA **2.5.1.17** (2026-08-05) · confirmar recepción = orden operativa |
| C4 | Supabase billing endurecer | **4.90.01.001** |
| C5 | ~~Deploy prod rimec-web~~ **HECHO** | Desplegado `906c90b` por orden directa 2026-08-05 (PE+CP proceso · vendedores sin acceso) · [CHUSAR_DEPLOYS_PROD_20260805.md](./CHUSAR_DEPLOYS_PROD_20260805.md) |
| C6 | Lección build/untracked (rueda Moises) | [CHUSAR_DEPLOYS_PROD_20260805.md](./CHUSAR_DEPLOYS_PROD_20260805.md) §3 · build local verde + auditar imports vs git antes de deploy |

---

## D · Moises (sigue vivo — no es “producto”)

| # | Pendiente | Estado |
|---|-----------|--------|
| D1 | PC aislada descarga + agente lee Moises | ⏳ |
| D2 | Q1–Q7 + crear **moria-moises** | ⏳ |
| D3 | Tags `pre-moises-*` · runbook cutover · `.env.example` | ⏳ |
| D4 | `pg_dump` en PC (backup fresco) | 🔴 sin binario local |

Detalle: [ETAPA_MOISES_20260804.md](./ETAPA_MOISES_20260804.md) · [ACTUAL.md](./ACTUAL.md)

---

## Cómo retomar (agente)

1. Leer este backlog + `ACTUAL.md`.  
2. Si el Director nombra un ítem (ej. A1) → ejecutar sin mezclar con Moises salvo que diga lo contrario.  
3. Si dice **Nueva etapa** → abrir etapa de producto citando filas de aquí.  
4. Memoria: solo con **Documenta** / **Documentación Moises|Chusar**.

---

## Docs de este Documenta

- Este archivo · [CHUSAR_HANDOFF_FILTROS_20260805.md](./CHUSAR_HANDOFF_FILTROS_20260805.md) · **2.2.1.42** · **2.3.1.3.5** · `PENDIENTES_COCINA_PDF_BANDEJA_20260804.md` · `ACTUAL.md` · `PLAN_COCINA_AUTO_0600_INTENTO_20260806.md` · `ETAPA_MOISES_20260804.md` (nota parqueo)
